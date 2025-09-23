import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { prisma } from '../server';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireTutorOrAdmin, optionalAuth } from '../middleware/auth';
import { DifficultyLevel } from '@prisma/client';

const router = express.Router();

/**
 * GET /api/courses
 * Get all courses with optional filtering
 */
router.get('/', [
  query('category').optional().isString().withMessage('Category must be a string'),
  query('difficulty').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).withMessage('Invalid difficulty level'),
  query('search').optional().isString().withMessage('Search query must be a string'),
  query('instructor').optional().isUUID().withMessage('Instructor ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], optionalAuth, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid query parameters',
      details: errors.array(),
    });
    return;
  }

  const {
    category,
    difficulty,
    search,
    instructor,
    page = 1,
    limit = 20,
  } = req.query;

  // Build where clause
  const where: any = {
    isPublished: true,
  };

  if (category) {
    where.category = { contains: category as string, mode: 'insensitive' };
  }

  if (difficulty) {
    where.difficultyLevel = difficulty as DifficultyLevel;
  }

  if (instructor) {
    where.createdBy = instructor as string;
  }

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { instructorName: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Get courses with enrollment and rating data
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    }),
    prisma.course.count({ where }),
  ]);

  // Calculate average ratings and update enrollment counts
  const coursesWithStats = await Promise.all(
    courses.map(async (course) => {
      // Get average rating
      const ratingStats = await prisma.review.aggregate({
        where: { courseId: course.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      return {
        ...course,
        enrollmentCount: course._count.enrollments,
        averageRating: ratingStats._avg.rating || 0,
        totalRatings: ratingStats._count.rating,
        _count: undefined, // Remove the _count field
      };
    })
  );

  res.json({
    courses: coursesWithStats,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/courses/:id
 * Get a specific course by ID
 */
router.get('/:id', [
  param('id').isUUID().withMessage('Course ID must be a valid UUID'),
], optionalAuth, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid course ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      modules: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
  });

  if (!course) {
    res.status(404).json({
      error: 'Course Not Found',
      message: 'The requested course does not exist',
    });
    return;
  }

  // Check if course is published or if user is the instructor/admin
  if (!course.isPublished) {
    if (!req.user || (req.user.id !== course.createdBy && req.user.role !== 'ADMIN')) {
      res.status(404).json({
        error: 'Course Not Found',
        message: 'The requested course does not exist',
      });
      return;
    }
  }

  // Get average rating
  const ratingStats = await prisma.review.aggregate({
    where: { courseId: course.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  // Check if current user is enrolled
  let isEnrolled = false;
  if (req.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId: req.user.id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  const courseWithStats = {
    ...course,
    enrollmentCount: course._count.enrollments,
    averageRating: ratingStats._avg.rating || 0,
    totalRatings: ratingStats._count.rating,
    isEnrolled,
    _count: undefined,
  };

  res.json({ course: courseWithStats });
}));

/**
 * POST /api/courses
 * Create a new course
 */
router.post('/', authenticateToken, requireTutorOrAdmin, [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category must be between 2 and 50 characters'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('difficultyLevel').isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).withMessage('Invalid difficulty level'),
  body('tags').isArray().withMessage('Tags must be an array'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('contentUrl').optional().isURL().withMessage('Content URL must be a valid URL'),
  body('thumbnailUrl').optional().isURL().withMessage('Thumbnail URL must be a valid URL'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to create a course',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors.array(),
    });
    return;
  }

  const {
    title,
    description,
    category,
    duration,
    difficultyLevel,
    tags,
    price,
    contentUrl,
    thumbnailUrl,
  } = req.body;

  const course = await prisma.course.create({
    data: {
      title,
      description,
      category,
      duration,
      difficultyLevel: difficultyLevel as DifficultyLevel,
      tags,
      price: parseFloat(price),
      contentUrl,
      thumbnailUrl,
      instructorName: req.user.name,
      createdBy: req.user.id,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json({
    message: 'Course created successfully',
    course,
  });
}));

/**
 * PUT /api/courses/:id
 * Update a course
 */
router.put('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Course ID must be a valid UUID'),
  body('title').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Category must be between 2 and 50 characters'),
  body('duration').optional().trim().notEmpty().withMessage('Duration cannot be empty'),
  body('difficultyLevel').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).withMessage('Invalid difficulty level'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('contentUrl').optional().isURL().withMessage('Content URL must be a valid URL'),
  body('thumbnailUrl').optional().isURL().withMessage('Thumbnail URL must be a valid URL'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to update a course',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if course exists and user has permission
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    res.status(404).json({
      error: 'Course Not Found',
      message: 'The requested course does not exist',
    });
    return;
  }

  // Check permissions
  if (existingCourse.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only update your own courses',
    });
    return;
  }

  // Update course
  const updateData = { ...req.body };
  if (updateData.price) {
    updateData.price = parseFloat(updateData.price);
  }

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: updateData,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.json({
    message: 'Course updated successfully',
    course: updatedCourse,
  });
}));

/**
 * DELETE /api/courses/:id
 * Delete a course
 */
router.delete('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Course ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to delete a course',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid course ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if course exists and user has permission
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    res.status(404).json({
      error: 'Course Not Found',
      message: 'The requested course does not exist',
    });
    return;
  }

  // Check permissions
  if (existingCourse.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only delete your own courses',
    });
    return;
  }

  // Delete course (this will cascade delete enrollments, reviews, etc.)
  await prisma.course.delete({
    where: { id },
  });

  res.json({
    message: 'Course deleted successfully',
  });
}));

export default router;

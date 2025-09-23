import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../server';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/enrollments
 * Enroll in a course
 */
router.post('/', authenticateToken, [
  body('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to enroll in a course',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please provide a valid course ID',
      details: errors.array(),
    });
    return;
  }

  const { courseId } = req.body;

  // Check if course exists and is published
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    res.status(404).json({
      error: 'Course Not Found',
      message: 'The requested course does not exist',
    });
    return;
  }

  if (!course.isPublished) {
    res.status(400).json({
      error: 'Course Not Available',
      message: 'This course is not currently available for enrollment',
    });
    return;
  }

  // Check if user is already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: req.user.id,
      },
    },
  });

  if (existingEnrollment) {
    res.status(409).json({
      error: 'Already Enrolled',
      message: 'You are already enrolled in this course',
    });
    return;
  }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      courseId,
      userId: req.user.id,
      lastAccessed: new Date(),
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructorName: true,
        },
      },
    },
  });

  res.status(201).json({
    message: 'Successfully enrolled in course',
    enrollment,
  });
}));

/**
 * GET /api/enrollments/my-courses
 * Get current user's enrolled courses
 */
router.get('/my-courses', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view your courses',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid query parameters',
      details: errors.array(),
    });
    return;
  }

  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: req.user.id },
      skip,
      take: Number(limit),
      include: {
        course: {
          include: {
            _count: {
              select: {
                enrollments: true,
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.enrollment.count({
      where: { userId: req.user.id },
    }),
  ]);

  // Add rating statistics to courses
  const enrollmentsWithStats = await Promise.all(
    enrollments.map(async (enrollment) => {
      const ratingStats = await prisma.review.aggregate({
        where: { courseId: enrollment.course.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      return {
        ...enrollment,
        course: {
          ...enrollment.course,
          enrollmentCount: enrollment.course._count.enrollments,
          averageRating: ratingStats._avg.rating || 0,
          totalRatings: ratingStats._count.rating,
          _count: undefined,
        },
      };
    })
  );

  res.json({
    enrollments: enrollmentsWithStats,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/enrollments/course/:courseId
 * Get enrollments for a specific course (instructors/admins only)
 */
router.get('/course/:courseId', authenticateToken, [
  param('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view course enrollments',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid parameters',
      details: errors.array(),
    });
    return;
  }

  const { courseId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  // Check if course exists and user has permission
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    res.status(404).json({
      error: 'Course Not Found',
      message: 'The requested course does not exist',
    });
    return;
  }

  // Check permissions (only course instructor or admin can view enrollments)
  if (course.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only view enrollments for your own courses',
    });
    return;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId },
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.enrollment.count({
      where: { courseId },
    }),
  ]);

  res.json({
    enrollments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * PUT /api/enrollments/:id/progress
 * Update enrollment progress
 */
router.put('/:id/progress', authenticateToken, [
  param('id').isUUID().withMessage('Enrollment ID must be a valid UUID'),
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to update progress',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid parameters',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;
  const { progress } = req.body;

  // Check if enrollment exists and belongs to user
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
  });

  if (!enrollment) {
    res.status(404).json({
      error: 'Enrollment Not Found',
      message: 'The requested enrollment does not exist',
    });
    return;
  }

  if (enrollment.userId !== req.user.id) {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only update your own enrollment progress',
    });
    return;
  }

  // Update enrollment
  const updateData: any = {
    progress,
    lastAccessed: new Date(),
  };

  // Mark as completed if progress is 100%
  if (progress === 100 && !enrollment.completedAt) {
    updateData.completedAt = new Date();
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id },
    data: updateData,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructorName: true,
        },
      },
    },
  });

  res.json({
    message: 'Progress updated successfully',
    enrollment: updatedEnrollment,
  });
}));

/**
 * DELETE /api/enrollments/:id
 * Unenroll from a course
 */
router.delete('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Enrollment ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to unenroll from a course',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid enrollment ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if enrollment exists and belongs to user
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!enrollment) {
    res.status(404).json({
      error: 'Enrollment Not Found',
      message: 'The requested enrollment does not exist',
    });
    return;
  }

  if (enrollment.userId !== req.user.id) {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only unenroll from your own courses',
    });
    return;
  }

  // Delete enrollment
  await prisma.enrollment.delete({
    where: { id },
  });

  res.json({
    message: `Successfully unenrolled from ${enrollment.course.title}`,
  });
}));

/**
 * GET /api/enrollments/stats/:courseId
 * Get enrollment statistics for a course
 */
router.get('/stats/:courseId', authenticateToken, [
  param('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view enrollment statistics',
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

  const { courseId } = req.params;

  // Check if course exists and user has permission
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    res.status(404).json({
      error: 'Course Not Found',
      message: 'The requested course does not exist',
    });
    return;
  }

  // Check permissions (only course instructor or admin can view stats)
  if (course.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only view statistics for your own courses',
    });
    return;
  }

  // Get enrollment statistics
  const [
    totalEnrollments,
    completedEnrollments,
    activeEnrollments,
    averageProgress,
  ] = await Promise.all([
    prisma.enrollment.count({
      where: { courseId },
    }),
    prisma.enrollment.count({
      where: {
        courseId,
        completedAt: { not: null },
      },
    }),
    prisma.enrollment.count({
      where: {
        courseId,
        lastAccessed: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
    prisma.enrollment.aggregate({
      where: { courseId },
      _avg: { progress: true },
    }),
  ]);

  const stats = {
    courseId,
    totalEnrollments,
    completedEnrollments,
    activeEnrollments,
    completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
    averageProgress: averageProgress._avg.progress || 0,
  };

  res.json({ stats });
}));

export default router;

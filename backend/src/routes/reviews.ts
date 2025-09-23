import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../server';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/reviews/course/:courseId
 * Get all reviews for a specific course
 */
router.get('/course/:courseId', [
  param('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating filter must be between 1 and 5'),
  query('sort').optional().isIn(['newest', 'oldest', 'highest', 'lowest']).withMessage('Invalid sort option'),
], optionalAuth, asyncHandler(async (req, res) => {
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
  const { page = 1, limit = 20, rating, sort = 'newest' } = req.query;

  // Check if course exists
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

  // Build where clause
  const where: any = { courseId };
  if (rating) {
    where.rating = parseInt(rating as string);
  }

  // Build order clause
  let orderBy: any;
  switch (sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'highest':
      orderBy = { rating: 'desc' };
      break;
    case 'lowest':
      orderBy = { rating: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  res.json({
    reviews,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/reviews/course/:courseId/stats
 * Get rating statistics for a course
 */
router.get('/course/:courseId/stats', [
  param('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
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

  // Check if course exists
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

  // Get rating statistics
  const [ratingStats, ratingDistribution] = await Promise.all([
    prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.review.groupBy({
      by: ['rating'],
      where: { courseId },
      _count: { rating: true },
    }),
  ]);

  // Build rating distribution object
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingDistribution.forEach((item) => {
    distribution[item.rating as keyof typeof distribution] = item._count.rating;
  });

  const stats = {
    courseId,
    averageRating: ratingStats._avg.rating || 0,
    totalRatings: ratingStats._count.rating,
    ratingDistribution: distribution,
  };

  res.json({ stats });
}));

/**
 * POST /api/reviews
 * Submit a new review
 */
router.post('/', authenticateToken, [
  body('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 1000 }).withMessage('Review must be less than 1000 characters'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to submit a review',
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

  const { courseId, rating, review } = req.body;

  // Check if course exists
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

  // Check if user is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: req.user.id,
      },
    },
  });

  if (!enrollment) {
    res.status(403).json({
      error: 'Not Enrolled',
      message: 'You must be enrolled in this course to submit a review',
    });
    return;
  }

  // Check if user has already reviewed this course
  const existingReview = await prisma.review.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: req.user.id,
      },
    },
  });

  if (existingReview) {
    res.status(409).json({
      error: 'Review Already Exists',
      message: 'You have already reviewed this course. Use PUT to update your review.',
    });
    return;
  }

  // Create review
  const newReview = await prisma.review.create({
    data: {
      courseId,
      userId: req.user.id,
      userName: req.user.name,
      rating,
      review: review?.trim() || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  res.status(201).json({
    message: 'Review submitted successfully',
    review: newReview,
  });
}));

/**
 * PUT /api/reviews/:id
 * Update an existing review
 */
router.put('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Review ID must be a valid UUID'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim().isLength({ max: 1000 }).withMessage('Review must be less than 1000 characters'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to update a review',
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
  const { rating, review } = req.body;

  // Check if review exists and belongs to user
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    res.status(404).json({
      error: 'Review Not Found',
      message: 'The requested review does not exist',
    });
    return;
  }

  if (existingReview.userId !== req.user.id) {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only update your own reviews',
    });
    return;
  }

  // Update review
  const updateData: any = {};
  if (rating !== undefined) updateData.rating = rating;
  if (review !== undefined) updateData.review = review?.trim() || null;

  const updatedReview = await prisma.review.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  res.json({
    message: 'Review updated successfully',
    review: updatedReview,
  });
}));

/**
 * DELETE /api/reviews/:id
 * Delete a review
 */
router.delete('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Review ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to delete a review',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid review ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if review exists and belongs to user
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    res.status(404).json({
      error: 'Review Not Found',
      message: 'The requested review does not exist',
    });
    return;
  }

  if (existingReview.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only delete your own reviews',
    });
    return;
  }

  // Delete review
  await prisma.review.delete({
    where: { id },
  });

  res.json({
    message: 'Review deleted successfully',
  });
}));

/**
 * GET /api/reviews/my-reviews
 * Get current user's reviews
 */
router.get('/my-reviews', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view your reviews',
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

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId: req.user.id },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorName: true,
          },
        },
      },
    }),
    prisma.review.count({
      where: { userId: req.user.id },
    }),
  ]);

  res.json({
    reviews,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/reviews/course/:courseId/my-review
 * Get current user's review for a specific course
 */
router.get('/course/:courseId/my-review', authenticateToken, [
  param('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view your review',
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

  const review = await prisma.review.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: req.user.id,
      },
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

  if (!review) {
    res.status(404).json({
      error: 'Review Not Found',
      message: 'You have not reviewed this course yet',
    });
    return;
  }

  res.json({ review });
}));

export default router;

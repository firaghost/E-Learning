import express from 'express';
import { param, query, validationResult } from 'express-validator';
import { prisma } from '../server';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { AuthUtils } from '../utils/auth';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/', authenticateToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['STUDENT', 'TUTOR', 'EMPLOYER', 'ADMIN']).withMessage('Invalid role'),
  query('search').optional().isString().withMessage('Search query must be a string'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid query parameters',
      details: errors.array(),
    });
    return;
  }

  const { page = 1, limit = 20, role, search } = req.query;

  // Build where clause
  const where: any = {};
  if (role) {
    where.role = role;
  }
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/users/:id
 * Get a specific user by ID
 */
router.get('/:id', authenticateToken, [
  param('id').isUUID().withMessage('User ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view user profiles',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid user ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Users can view their own profile, admins can view any profile
  if (req.user.id !== id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only view your own profile',
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          createdCourses: true,
          enrollments: true,
          reviews: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({
      error: 'User Not Found',
      message: 'The requested user does not exist',
    });
    return;
  }

  res.json({ user });
}));

/**
 * GET /api/users/:id/courses
 * Get courses created by a specific user (for tutors)
 */
router.get('/:id/courses', [
  param('id').isUUID().withMessage('User ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req, res) => {
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
  const { page = 1, limit = 20 } = req.query;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true },
  });

  if (!user) {
    res.status(404).json({
      error: 'User Not Found',
      message: 'The requested user does not exist',
    });
    return;
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Get courses created by this user
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where: {
        createdBy: id,
        isPublished: true, // Only show published courses to public
      },
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
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({
      where: {
        createdBy: id,
        isPublished: true,
      },
    }),
  ]);

  // Add rating statistics
  const coursesWithStats = await Promise.all(
    courses.map(async (course) => {
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
        _count: undefined,
      };
    })
  );

  res.json({
    instructor: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
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
 * GET /api/users/:id/enrollments
 * Get courses a user is enrolled in
 */
router.get('/:id/enrollments', authenticateToken, [
  param('id').isUUID().withMessage('User ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view enrollments',
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
  const { page = 1, limit = 20 } = req.query;

  // Users can only view their own enrollments, admins can view any
  if (req.user.id !== id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only view your own enrollments',
    });
    return;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: id },
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
      where: { userId: id },
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
 * GET /api/users/:id/reviews
 * Get reviews written by a specific user
 */
router.get('/:id/reviews', [
  param('id').isUUID().withMessage('User ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req, res) => {
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
  const { page = 1, limit = 20 } = req.query;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!user) {
    res.status(404).json({
      error: 'User Not Found',
      message: 'The requested user does not exist',
    });
    return;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId: id },
      skip,
      take: Number(limit),
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({
      where: { userId: id },
    }),
  ]);

  res.json({
    user: {
      id: user.id,
      name: user.name,
    },
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
 * GET /api/users/stats/overview
 * Get platform statistics (admin only)
 */
router.get('/stats/overview', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalReviews,
    usersByRole,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
    prisma.review.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const roleDistribution = usersByRole.reduce((acc, item) => {
    acc[item.role] = item._count.role;
    return acc;
  }, {} as Record<string, number>);

  const stats = {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalReviews,
    roleDistribution,
    recentUsers,
  };

  res.json({ stats });
}));

export default router;

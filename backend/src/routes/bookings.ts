import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../server';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireTutorOrAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new tutor booking
 */
router.post('/', authenticateToken, [
  body('tutorName').trim().isLength({ min: 2, max: 100 }).withMessage('Tutor name must be between 2 and 100 characters'),
  body('subject').trim().isLength({ min: 2, max: 100 }).withMessage('Subject must be between 2 and 100 characters'),
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('duration').isInt({ min: 30, max: 480 }).withMessage('Duration must be between 30 and 480 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to book a tutoring session',
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

  const { tutorName, subject, date, time, duration, price, notes } = req.body;

  // Validate that the booking date is in the future
  const bookingDate = new Date(date);
  if (bookingDate <= new Date()) {
    res.status(400).json({
      error: 'Invalid Date',
      message: 'Booking date must be in the future',
    });
    return;
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      userId: req.user.id,
      tutorName: tutorName.trim(),
      subject: subject.trim(),
      date: bookingDate,
      time,
      duration,
      price: parseFloat(price),
      notes: notes?.trim() || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json({
    message: 'Tutoring session booked successfully',
    booking,
  });
}));

/**
 * GET /api/bookings/my-bookings
 * Get current user's bookings
 */
router.get('/my-bookings', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view your bookings',
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

  const { page = 1, limit = 20, status } = req.query;

  // Build where clause
  const where: any = { userId: req.user.id };
  if (status) {
    where.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    bookings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/bookings
 * Get all bookings (admin only)
 */
router.get('/', authenticateToken, requireTutorOrAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('tutor').optional().isString().withMessage('Tutor filter must be a string'),
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

  const { page = 1, limit = 20, status, tutor } = req.query;

  // Build where clause
  const where: any = {};
  if (status) {
    where.status = status;
  }
  if (tutor) {
    where.tutorName = { contains: tutor as string, mode: 'insensitive' };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    bookings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * GET /api/bookings/:id
 * Get a specific booking
 */
router.get('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Booking ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to view booking details',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid booking ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!booking) {
    res.status(404).json({
      error: 'Booking Not Found',
      message: 'The requested booking does not exist',
    });
    return;
  }

  // Users can only view their own bookings, admins can view any
  if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only view your own bookings',
    });
    return;
  }

  res.json({ booking });
}));

/**
 * PUT /api/bookings/:id
 * Update a booking
 */
router.put('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Booking ID must be a valid UUID'),
  body('tutorName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Tutor name must be between 2 and 100 characters'),
  body('subject').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Subject must be between 2 and 100 characters'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('duration').optional().isInt({ min: 30, max: 480 }).withMessage('Duration must be between 30 and 480 minutes'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to update a booking',
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

  // Check if booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!existingBooking) {
    res.status(404).json({
      error: 'Booking Not Found',
      message: 'The requested booking does not exist',
    });
    return;
  }

  // Users can only update their own bookings, admins can update any
  if (existingBooking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only update your own bookings',
    });
    return;
  }

  // Prepare update data
  const updateData: any = { ...req.body };
  if (updateData.date) {
    const bookingDate = new Date(updateData.date);
    if (bookingDate <= new Date()) {
      res.status(400).json({
        error: 'Invalid Date',
        message: 'Booking date must be in the future',
      });
      return;
    }
    updateData.date = bookingDate;
  }
  if (updateData.price) {
    updateData.price = parseFloat(updateData.price);
  }

  // Update booking
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.json({
    message: 'Booking updated successfully',
    booking: updatedBooking,
  });
}));

/**
 * DELETE /api/bookings/:id
 * Cancel/delete a booking
 */
router.delete('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Booking ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to cancel a booking',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid booking ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!existingBooking) {
    res.status(404).json({
      error: 'Booking Not Found',
      message: 'The requested booking does not exist',
    });
    return;
  }

  // Users can only cancel their own bookings, admins can cancel any
  if (existingBooking.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only cancel your own bookings',
    });
    return;
  }

  // Instead of deleting, mark as cancelled
  const cancelledBooking = await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' },
  });

  res.json({
    message: 'Booking cancelled successfully',
    booking: cancelledBooking,
  });
}));

/**
 * GET /api/bookings/stats/overview
 * Get booking statistics (admin only)
 */
router.get('/stats/overview', authenticateToken, requireTutorOrAdmin, asyncHandler(async (req, res) => {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    bookingsByStatus,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.booking.count({ where: { status: 'confirmed' } }),
    prisma.booking.count({ where: { status: 'completed' } }),
    prisma.booking.count({ where: { status: 'cancelled' } }),
    prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const statusDistribution = bookingsByStatus.reduce((acc, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  const stats = {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    statusDistribution,
    recentBookings,
  };

  res.json({ stats });
}));

export default router;

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { prisma } from '../server';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/comments/course/:courseId
 * Get all comments for a specific course
 */
router.get('/course/:courseId', [
  param('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
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
  const { page = 1, limit = 20 } = req.query;

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

  const skip = (Number(page) - 1) * Number(limit);

  // Get top-level comments (no parent)
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        courseId,
        parentId: null,
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.comment.count({
      where: {
        courseId,
        parentId: null,
      },
    }),
  ]);

  res.json({
    comments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

/**
 * POST /api/comments
 * Create a new comment
 */
router.post('/', authenticateToken, [
  body('courseId').isUUID().withMessage('Course ID must be a valid UUID'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters'),
  body('parentId').optional().isUUID().withMessage('Parent ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to post a comment',
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

  const { courseId, content, parentId } = req.body;

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

  // If parentId is provided, check if parent comment exists
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment || parentComment.courseId !== courseId) {
      res.status(404).json({
        error: 'Parent Comment Not Found',
        message: 'The parent comment does not exist or belongs to a different course',
      });
      return;
    }
  }

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      courseId,
      userId: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar || null,
      content: content.trim(),
      parentId: parentId || null,
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
    message: 'Comment posted successfully',
    comment,
  });
}));

/**
 * PUT /api/comments/:id
 * Update a comment
 */
router.put('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Comment ID must be a valid UUID'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to update a comment',
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
  const { content } = req.body;

  // Check if comment exists and belongs to user
  const existingComment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!existingComment) {
    res.status(404).json({
      error: 'Comment Not Found',
      message: 'The requested comment does not exist',
    });
    return;
  }

  if (existingComment.userId !== req.user.id) {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only update your own comments',
    });
    return;
  }

  // Update comment
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      content: content.trim(),
      isEdited: true,
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

  res.json({
    message: 'Comment updated successfully',
    comment: updatedComment,
  });
}));

/**
 * DELETE /api/comments/:id
 * Delete a comment
 */
router.delete('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Comment ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to delete a comment',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid comment ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if comment exists and user has permission
  const existingComment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!existingComment) {
    res.status(404).json({
      error: 'Comment Not Found',
      message: 'The requested comment does not exist',
    });
    return;
  }

  if (existingComment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Insufficient Permissions',
      message: 'You can only delete your own comments',
    });
    return;
  }

  // Delete comment (this will cascade delete replies)
  await prisma.comment.delete({
    where: { id },
  });

  res.json({
    message: 'Comment deleted successfully',
  });
}));

/**
 * POST /api/comments/:id/like
 * Like or unlike a comment
 */
router.post('/:id/like', authenticateToken, [
  param('id').isUUID().withMessage('Comment ID must be a valid UUID'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to like a comment',
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid comment ID',
      details: errors.array(),
    });
    return;
  }

  const { id } = req.params;

  // Check if comment exists
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    res.status(404).json({
      error: 'Comment Not Found',
      message: 'The requested comment does not exist',
    });
    return;
  }

  // For simplicity, we'll just increment the likes count
  // In a real app, you'd want to track individual likes to prevent duplicate likes
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  res.json({
    message: 'Comment liked successfully',
    likes: updatedComment.likes,
  });
}));

export default router;

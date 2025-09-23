import express from 'express';
import { body, validationResult } from 'express-validator';
import { AuthUtils } from '../utils/auth';
import { prisma } from '../server';
import { asyncHandler, createApiError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['STUDENT', 'TUTOR', 'EMPLOYER']).withMessage('Invalid role specified'),
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors.array(),
    });
    return;
  }

  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    res.status(409).json({
      error: 'User Already Exists',
      message: 'A user with this email already exists',
    });
    return;
  }

  // Hash password
  const hashedPassword = await AuthUtils.hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = AuthUtils.generateTokenPair(user);

  // Return user data (without password) and tokens
  res.status(201).json({
    message: 'User registered successfully',
    user: AuthUtils.sanitizeUser(user),
    token: accessToken,
    refreshToken,
  });
}));

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors.array(),
    });
    return;
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({
      error: 'Invalid Credentials',
      message: 'Invalid email or password',
    });
    return;
  }

  // Check password
  const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({
      error: 'Invalid Credentials',
      message: 'Invalid email or password',
    });
    return;
  }

  // Generate tokens
  const { accessToken, refreshToken } = AuthUtils.generateTokenPair(user);

  // Return user data (without password) and tokens
  res.json({
    message: 'Login successful',
    user: AuthUtils.sanitizeUser(user),
    token: accessToken,
    refreshToken,
  });
}));

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please provide a refresh token',
      details: errors.array(),
    });
    return;
  }

  const { refreshToken } = req.body;

  try {
    // Verify refresh token
    const payload = AuthUtils.verifyRefreshToken(refreshToken);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(401).json({
        error: 'User Not Found',
        message: 'The user associated with this token no longer exists',
      });
      return;
    }

    // Generate new access token
    const newAccessToken = AuthUtils.generateAccessToken(user);

    res.json({
      message: 'Token refreshed successfully',
      token: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      error: 'Invalid Refresh Token',
      message: 'The provided refresh token is invalid or expired',
    });
  }
}));

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to access this resource',
    });
    return;
  }

  // Get full user data from database
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(404).json({
      error: 'User Not Found',
      message: 'User profile not found',
    });
    return;
  }

  res.json({
    user: AuthUtils.sanitizeUser(user),
  });
}));

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side by removing the token
  // This endpoint exists for consistency and future token blacklisting if needed
  res.json({
    message: 'Logout successful',
  });
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
], asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication Required',
      message: 'Please authenticate to access this resource',
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

  const { name, email } = req.body;
  const updateData: any = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: req.user.id },
      },
    });

    if (existingUser) {
      res.status(409).json({
        error: 'Email Already Taken',
        message: 'This email is already associated with another account',
      });
      return;
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
  });

  res.json({
    message: 'Profile updated successfully',
    user: AuthUtils.sanitizeUser(updatedUser),
  });
}));

export default router;

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          error: 'Conflict',
          message: 'A record with this data already exists',
          details: error.meta,
        });
        return;
      case 'P2025':
        res.status(404).json({
          error: 'Not Found',
          message: 'The requested record was not found',
        });
        return;
      case 'P2003':
        res.status(400).json({
          error: 'Foreign Key Constraint',
          message: 'Referenced record does not exist',
        });
        return;
      default:
        res.status(500).json({
          error: 'Database Error',
          message: 'An error occurred while processing your request',
          code: error.code,
        });
        return;
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data provided',
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided token is invalid',
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token Expired',
      message: 'The provided token has expired',
    });
    return;
  }

  // Custom API errors
  if (error.statusCode) {
    res.status(error.statusCode).json({
      error: error.name || 'API Error',
      message: error.message,
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message,
  });
};

/**
 * Create a custom API error
 */
export const createApiError = (message: string, statusCode: number = 500): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  return error;
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

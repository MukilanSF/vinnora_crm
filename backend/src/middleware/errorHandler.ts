import { Request, Response, NextFunction } from 'express';
import { logger, errorReporter } from '../utils/logger';

// Custom error class for API errors
export class APIError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

// Authentication error class
export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

// Authorization error class
export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

// Not found error class
export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// Conflict error class
export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

// Rate limit error class
export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

// Database error class
export class DatabaseError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

// External service error class
export class ExternalServiceError extends APIError {
  constructor(service: string, message: string, details?: any) {
    super(`${service} service error: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', details);
    this.name = 'ExternalServiceError';
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    status: number;
    timestamp: string;
    path: string;
    method: string;
    details?: any;
    requestId?: string;
  };
}

// Main error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Generate request ID for tracking
  const requestId = req.headers['x-request-id'] as string || generateRequestId();

  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle different error types
  if (error instanceof APIError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = error.message;
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    code = 'FILE_UPLOAD_ERROR';
    message = 'File upload error: ' + error.message;
  } else if (error.message?.includes('duplicate key')) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    message = 'Resource already exists';
  } else if (error.message?.includes('foreign key')) {
    statusCode = 400;
    code = 'INVALID_REFERENCE';
    message = 'Invalid resource reference';
  }

  // Log error
  const logData = {
    requestId,
    method: req.method,
    path: req.path,
    statusCode,
    code,
    message: error.message,
    stack: error.stack,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    userId: (req as any).user?.id,
    organizationId: (req as any).user?.organizationId
  };

  if (statusCode >= 500) {
    logger.error('Server Error', error, logData);
    errorReporter.captureException(error, logData);
  } else if (statusCode >= 400) {
    logger.warn('Client Error', logData);
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    error: {
      message: process.env.NODE_ENV === 'production' && statusCode >= 500 
        ? 'Internal server error' 
        : message,
      code,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId
    }
  };

  // Include details in development mode or for client errors
  if (details && (process.env.NODE_ENV !== 'production' || statusCode < 500)) {
    errorResponse.error.details = details;
  }

  // Include stack trace in development mode for server errors
  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) {
    (errorResponse.error as any).stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// 404 handler middleware
export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();

  logger.warn('Resource Not Found', {
    requestId,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });

  res.status(404).json({
    error: {
      message: `Endpoint ${req.method} ${req.path} not found`,
      code: 'ENDPOINT_NOT_FOUND',
      status: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId
    }
  });
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error formatter
export const formatValidationErrors = (errors: any[]): any => {
  return errors.map(error => ({
    field: error.path || error.param,
    message: error.msg || error.message,
    value: error.value,
    location: error.location
  }));
};

// Helper to create validation error from express-validator
export const createValidationError = (errors: any[]): ValidationError => {
  const formattedErrors = formatValidationErrors(errors);
  return new ValidationError('Validation failed', formattedErrors);
};

// Database error handler
export const handleDatabaseError = (error: any): APIError => {
  logger.error('Database operation failed', error);

  // Supabase specific errors
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        return new ConflictError('Resource already exists');
      case '23503': // Foreign key violation
        return new ValidationError('Invalid resource reference');
      case '23502': // Not null violation
        return new ValidationError('Required field missing');
      case '42703': // Undefined column
        return new ValidationError('Invalid field specified');
      default:
        return new DatabaseError('Database operation failed');
    }
  }

  // Generic database error
  return new DatabaseError('Database operation failed');
};

// Rate limiting error handler
export const handleRateLimitError = (req: Request, res: Response): void => {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();

  logger.warn('Rate Limit Exceeded', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(429).json({
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      status: 429,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId,
      retryAfter: 60 // seconds
    }
  });
};

// Generate unique request ID
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Middleware to add request ID to headers
export const addRequestId = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

// Health check error
export const createHealthCheckError = (service: string, details?: any): APIError => {
  return new ExternalServiceError(service, 'Health check failed', details);
};

export default {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  formatValidationErrors,
  createValidationError,
  handleDatabaseError,
  handleRateLimitError,
  addRequestId,
  createHealthCheckError
};

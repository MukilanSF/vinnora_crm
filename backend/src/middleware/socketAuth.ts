import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { supabase } from '../config/database';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  organizationId?: string;
  role?: string;
}

interface JWTPayload {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}

export const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      logger.warn(`Socket authentication failed: No token provided for socket ${socket.id}`);
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    if (!decoded.userId || !decoded.organizationId) {
      logger.warn(`Socket authentication failed: Invalid token payload for socket ${socket.id}`);
      return next(new Error('Invalid token payload'));
    }

    // Verify user exists and is active
    const { data: user, error } = await supabase
      .from('users')
      .select('id, organization_id, role, active')
      .eq('id', decoded.userId)
      .eq('active', true)
      .single();

    if (error || !user) {
      logger.warn(`Socket authentication failed: User not found or inactive for socket ${socket.id}, userId: ${decoded.userId}`);
      return next(new Error('User not found or inactive'));
    }

    // Verify organization access
    if (user.organization_id !== decoded.organizationId) {
      logger.warn(`Socket authentication failed: Organization mismatch for socket ${socket.id}, userId: ${decoded.userId}`);
      return next(new Error('Organization access denied'));
    }

    // Attach user information to socket
    socket.userId = user.id;
    socket.organizationId = user.organization_id;
    socket.role = user.role;

    logger.info(`Socket authenticated successfully: ${socket.id} for user ${user.id} in organization ${user.organization_id}`);
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Socket authentication failed: Invalid JWT for socket ${socket.id} - ${error.message}`);
      return next(new Error('Invalid authentication token'));
    }

    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(`Socket authentication failed: Expired JWT for socket ${socket.id}`);
      return next(new Error('Authentication token expired'));
    }

    logger.error(`Socket authentication error for socket ${socket.id}:`, error);
    next(new Error('Authentication failed'));
  }
};

// Middleware to check if user has specific role
export const requireRole = (requiredRole: string | string[]) => {
  return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const userRole = socket.role;

    if (!userRole) {
      return next(new Error('User role not found'));
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    // Define role hierarchy
    const roleHierarchy: { [key: string]: number } = {
      'sales-rep': 1,
      'manager': 2,
      'admin': 3
    };

    const userRoleLevel = roleHierarchy[userRole];
    const requiredLevel = Math.min(...allowedRoles.map(role => roleHierarchy[role] || 0));

    if (userRoleLevel && userRoleLevel >= requiredLevel) {
      next();
    } else {
      logger.warn(`Socket authorization failed: Insufficient role for socket ${socket.id}, user role: ${userRole}, required: ${requiredRole}`);
      next(new Error('Insufficient permissions'));
    }
  };
};

// Middleware to check if user can access specific entity
export const requireEntityAccess = (entityType: string) => {
  return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
      const userId = socket.userId;
      const organizationId = socket.organizationId;

      if (!userId || !organizationId) {
        return next(new Error('User not authenticated'));
      }

      // Check organization plan and feature access
      const { data: org, error } = await supabase
        .from('organizations')
        .select('plan, settings')
        .eq('id', organizationId)
        .single();

      if (error || !org) {
        return next(new Error('Organization not found'));
      }

      // Define entity access rules based on plan
      const planFeatures: { [key: string]: string[] } = {
        'free': ['leads', 'customers'],
        'starter': ['leads', 'customers', 'deals', 'bills'],
        'professional': ['leads', 'customers', 'deals', 'bills', 'tickets', 'analytics'],
        'enterprise': ['leads', 'customers', 'deals', 'bills', 'tickets', 'analytics', 'advanced']
      };

      const allowedEntities = planFeatures[org.plan] || [];

      if (allowedEntities.includes(entityType)) {
        next();
      } else {
        logger.warn(`Socket entity access denied: User ${userId} cannot access ${entityType} with ${org.plan} plan`);
        next(new Error(`Access to ${entityType} requires plan upgrade`));
      }

    } catch (error) {
      logger.error(`Socket entity access check error:`, error);
      next(new Error('Access check failed'));
    }
  };
};

// Rate limiting for socket events
export const rateLimitSocket = (eventsPerMinute: number = 60) => {
  const eventCounts = new Map<string, { count: number; resetTime: number }>();

  return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const socketId = socket.id;
    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000; // 1-minute window

    const eventData = eventCounts.get(socketId) || { count: 0, resetTime: windowStart };

    // Reset counter if we're in a new window
    if (eventData.resetTime < windowStart) {
      eventData.count = 0;
      eventData.resetTime = windowStart;
    }

    eventData.count++;
    eventCounts.set(socketId, eventData);

    if (eventData.count > eventsPerMinute) {
      logger.warn(`Socket rate limit exceeded for ${socketId}: ${eventData.count} events in current minute`);
      return next(new Error('Rate limit exceeded'));
    }

    next();
  };
};

// Cleanup function for disconnected sockets
export const cleanupSocketData = (socketId: string) => {
  // Clean up any stored socket-specific data
  // This can be called when a socket disconnects
  logger.debug(`Cleaning up data for disconnected socket: ${socketId}`);
};

// Utility function to validate socket data
export const validateSocketData = (data: any, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Additional validation can be added here
  return true;
};

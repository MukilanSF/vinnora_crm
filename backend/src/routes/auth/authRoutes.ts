import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../config/database';
import { 
  asyncHandler, 
  createValidationError, 
  AuthenticationError, 
  ValidationError,
  ConflictError,
  handleDatabaseError
} from '../../middleware/errorHandler';
import { logger, securityLogger } from '../../utils/logger';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('organizationName').optional().trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Helper functions
const generateTokens = (user: any) => {
  const payload = {
    userId: user.id,
    organizationId: user.organization_id,
    role: user.role,
    email: user.email
  };

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const accessToken = jwt.sign(
    payload, 
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    payload, 
    jwtSecret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Routes

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user and organization
 * @access Public
 */
router.post('/register', registerValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createValidationError(errors.array());
  }

  const { email, password, name, organizationName } = req.body;

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create organization first
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName || `${name}'s Organization`,
        plan: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orgError) {
      throw handleDatabaseError(orgError);
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        name,
        role: 'admin',
        active: true,
        plan: 'free',
        organization_id: organization.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, name, role, active, plan, organization_id, created_at')
      .single();

    if (userError) {
      throw handleDatabaseError(userError);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Log successful registration
    securityLogger.logAuthAttempt(email, true, req.ip || '', req.headers['user-agent'] || '');

    logger.info(`User registered successfully: ${user.id} (${email})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organization_id,
          plan: user.plan
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    securityLogger.logAuthAttempt(email, false, req.ip || '', req.headers['user-agent'] || '');
    throw error;
  }
}));

/**
 * @route POST /api/v1/auth/login
 * @desc Authenticate user and return token
 * @access Public
 */
router.post('/login', loginValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createValidationError(errors.array());
  }

  const { email, password } = req.body;

  try {
    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, password_hash, role, active, plan, organization_id')
      .eq('email', email)
      .single();

    if (error || !user) {
      securityLogger.logAuthAttempt(email, false, req.ip || '', req.headers['user-agent'] || '');
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.active) {
      securityLogger.logAuthAttempt(email, false, req.ip || '', req.headers['user-agent'] || '');
      throw new AuthenticationError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      securityLogger.logAuthAttempt(email, false, req.ip || '', req.headers['user-agent'] || '');
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Get organization details
    const { data: organization } = await supabase
      .from('organizations')
      .select('id, name, plan, subscription_status')
      .eq('id', user.organization_id)
      .single();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Log successful login
    securityLogger.logAuthAttempt(email, true, req.ip || '', req.headers['user-agent'] || '');

    logger.info(`User logged in successfully: ${user.id} (${email})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organization_id,
          plan: user.plan,
          organization: organization || null
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      securityLogger.logAuthAttempt(email, false, req.ip || '', req.headers['user-agent'] || '');
    }
    throw error;
  }
}));

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, active, plan, organization_id')
      .eq('id', decoded.userId)
      .eq('active', true)
      .single();

    if (error || !user) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      }
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
    throw error;
  }
}));

export default router;

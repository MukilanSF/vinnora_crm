import { Express } from 'express';
import authRoutes from './auth/authRoutes';
import userRoutes from './users/userRoutes';
import leadRoutes from './leads/leadRoutes';
import customerRoutes from './customers/customerRoutes';
import dealRoutes from './deals/dealRoutes';
import billRoutes from './bills/billRoutes';
import ticketRoutes from './tickets/ticketRoutes';
import noteRoutes from './notes/noteRoutes';
import dashboardRoutes from './dashboard/dashboardRoutes';
import organizationRoutes from './organizations/organizationRoutes';
import webhookRoutes from './webhooks/webhookRoutes';
import { addRequestId } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const setupRoutes = (app: Express): void => {
  // Add request ID middleware
  app.use(addRequestId);

  // API version prefix
  const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

  // Log all API requests
  app.use(API_PREFIX, (req, res, next) => {
    logger.info(`API Request: ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id']
    });
    next();
  });

  // Mount routes
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/leads`, leadRoutes);
  app.use(`${API_PREFIX}/customers`, customerRoutes);
  app.use(`${API_PREFIX}/deals`, dealRoutes);
  app.use(`${API_PREFIX}/bills`, billRoutes);
  app.use(`${API_PREFIX}/tickets`, ticketRoutes);
  app.use(`${API_PREFIX}/notes`, noteRoutes);
  app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
  app.use(`${API_PREFIX}/organizations`, organizationRoutes);
  app.use('/webhooks', webhookRoutes); // Webhooks don't need API versioning

  logger.info(`✅ Routes mounted under ${API_PREFIX}`);
};

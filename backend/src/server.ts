import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import middleware and routes
import { errorHandler } from '@/middleware/errorHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import { logger } from '@/utils/logger';
import { supabaseClient } from '@/config/supabase';
import { initializeWebSocket } from '@/services/websocketService';

// Import routes
import authRoutes from '@/routes/authRoutes';
import userRoutes from '@/routes/userRoutes';
import leadRoutes from '@/routes/leadRoutes';
import customerRoutes from '@/routes/customerRoutes';
import dealRoutes from '@/routes/dealRoutes';
import billRoutes from '@/routes/billRoutes';
import supportRoutes from '@/routes/supportRoutes';
import analyticsRoutes from '@/routes/analyticsRoutes';
import notificationRoutes from '@/routes/notificationRoutes';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.WEBSOCKET_CORS_ORIGIN?.split(',') || ['http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use(errorHandler);

// Initialize WebSocket handlers
initializeWebSocket(io);

// Start server
const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Vinnora CRM Backend Server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔌 WebSocket server initialized`);
  logger.info(`🗄️  Database: Supabase connected`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, io };

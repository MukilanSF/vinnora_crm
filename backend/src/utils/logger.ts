import winston from 'winston';
import path from 'path';

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} ${level}: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// Create transports
const transports: winston.transport[] = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  })
);

// File transports (enabled in production or when LOG_FILE_PATH is set)
if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE_PATH) {
  const logDir = path.dirname(process.env.LOG_FILE_PATH || './logs/app.log');
  
  // All logs
  transports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE_PATH || './logs/app.log',
      format: logFormat,
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  );

  // Error logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      format: logFormat,
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  );

  // HTTP logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      format: logFormat,
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false,
});

// Create stream for Morgan HTTP logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};

// Additional logging utilities
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string, meta?: any): string {
    const contextMsg = `[${this.context}] ${message}`;
    return meta ? `${contextMsg} ${JSON.stringify(meta)}` : contextMsg;
  }

  debug(message: string, meta?: any) {
    logger.debug(this.formatMessage(message, meta));
  }

  info(message: string, meta?: any) {
    logger.info(this.formatMessage(message, meta));
  }

  warn(message: string, meta?: any) {
    logger.warn(this.formatMessage(message, meta));
  }

  error(message: string, error?: Error | any, meta?: any) {
    if (error instanceof Error) {
      logger.error(this.formatMessage(message, meta), { 
        stack: error.stack,
        name: error.name,
        message: error.message 
      });
    } else {
      logger.error(this.formatMessage(message, meta), error);
    }
  }

  http(message: string, meta?: any) {
    logger.http(this.formatMessage(message, meta));
  }
}

// Performance monitoring
export const performanceLogger = {
  startTimer: (label: string) => {
    const start = Date.now();
    return {
      end: () => {
        const duration = Date.now() - start;
        logger.info(`Performance [${label}]: ${duration}ms`);
        return duration;
      }
    };
  },

  logDatabaseQuery: (query: string, duration: number, recordCount?: number) => {
    logger.debug('Database Query', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      duration: `${duration}ms`,
      recordCount
    });
  },

  logAPICall: (method: string, url: string, statusCode: number, duration: number) => {
    logger.http('API Call', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`
    });
  }
};

// Security logging
export const securityLogger = {
  logAuthAttempt: (email: string, success: boolean, ip: string, userAgent: string) => {
    logger.info('Authentication Attempt', {
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
  },

  logSuspiciousActivity: (userId: string, activity: string, details: any, ip: string) => {
    logger.warn('Suspicious Activity', {
      userId,
      activity,
      details,
      ip,
      timestamp: new Date().toISOString()
    });
  },

  logDataAccess: (userId: string, resource: string, action: string, ip: string) => {
    logger.info('Data Access', {
      userId,
      resource,
      action,
      ip,
      timestamp: new Date().toISOString()
    });
  },

  logSecurityViolation: (type: string, details: any, ip: string, userAgent: string) => {
    logger.error('Security Violation', {
      type,
      details,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
  }
};

// Error reporting integration (for services like Sentry)
export const errorReporter = {
  captureException: (error: Error, context?: any) => {
    logger.error('Exception Captured', error, context);
    
    // If Sentry is configured, send to Sentry
    if (process.env.SENTRY_DSN) {
      // Sentry integration would go here
      // Sentry.captureException(error, { extra: context });
    }
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) => {
    logger[level === 'warning' ? 'warn' : level](message, context);
    
    // If Sentry is configured, send to Sentry
    if (process.env.SENTRY_DSN) {
      // Sentry integration would go here
      // Sentry.captureMessage(message, level as SeverityLevel);
    }
  }
};

// Ensure logs directory exists
if (process.env.LOG_FILE_PATH || process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const logDir = path.dirname(process.env.LOG_FILE_PATH || './logs/app.log');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

export default logger;

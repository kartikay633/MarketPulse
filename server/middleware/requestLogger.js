// ROADMAP: Section 6 — Backend Architecture (Request Logger)
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

/**
 * HTTP request logger middleware.
 * Assigns a unique request ID to every request for tracing.
 */
export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const id = req.headers['x-request-id'] || uuidv4();
    req.id = id;
    return id;
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.originalUrl} ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.originalUrl} ${res.statusCode} - ${err.message}`;
  },
  // Don't log health check spam
  autoLogging: {
    ignore: (req) => req.url === '/api/health',
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

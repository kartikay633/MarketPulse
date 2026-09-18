// ROADMAP: Section 6 & 13 — Authentication Middleware
import { supabaseAdmin } from '../config/supabase.js';
import { UnauthorizedError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Express middleware to verify Supabase JWT and extract user context
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Bearer token not provided');
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.debug({ error }, 'Supabase token verification failed');
      throw new UnauthorizedError('Invalid or expired authentication token');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.display_name || user.email?.split('@')[0],
      metadata: user.user_metadata || {},
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional auth middleware — attaches user if token valid, but does not block if absent
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            displayName: user.user_metadata?.display_name || user.email?.split('@')[0],
            metadata: user.user_metadata || {},
          };
        }
      }
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
}

export default requireAuth;

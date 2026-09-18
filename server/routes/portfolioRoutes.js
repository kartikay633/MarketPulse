// ROADMAP: Section 6, 11 & 15 — Portfolio Routes
import { Router } from 'express';
import { tradeController } from '../controllers/tradeController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/portfolio — User's virtual portfolio holdings & summary
router.get('/', optionalAuth, (req, res, next) => tradeController.getPortfolio(req, res, next));

// POST /api/portfolio/reset — Reset paper trading portfolio to ₹10,00,000
router.post('/reset', optionalAuth, (req, res, next) => tradeController.resetPortfolio(req, res, next));

export default router;

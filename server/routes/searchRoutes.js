// ROADMAP: Section 6 & 15 — Search Routes
import { Router } from 'express';
import { marketController } from '../controllers/marketController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/search?q= — Search instruments by symbol, name, or sector
router.get('/', optionalAuth, (req, res, next) => marketController.search(req, res, next));

export default router;

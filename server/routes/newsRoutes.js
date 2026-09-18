// ROADMAP: Section 6, 9 & 15 — News Routes
import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/news — General Indian financial market news
router.get('/', optionalAuth, (req, res, next) => newsController.getMarketNews(req, res, next));

export default router;

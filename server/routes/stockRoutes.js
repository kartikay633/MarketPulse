import { Router } from 'express';
import { marketController } from '../controllers/marketController.js';
import { newsController } from '../controllers/newsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/stocks/:symbol — Full quote for a single stock
router.get('/:symbol', optionalAuth, (req, res, next) => marketController.getQuote(req, res, next));

// GET /api/stocks/:symbol/history — Historical candle bars
router.get('/:symbol/history', optionalAuth, (req, res, next) => marketController.getHistory(req, res, next));

// GET /api/stocks/:symbol/news — Stock-specific news
router.get('/:symbol/news', optionalAuth, (req, res, next) => newsController.getStockNews(req, res, next));

export default router;

// ROADMAP: Section 6, 11 & 15 — Trade Routes
import { Router } from 'express';
import { tradeController } from '../controllers/tradeController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/trade/order — Execute simulated paper order (BUY / SELL)
router.post('/order', optionalAuth, (req, res, next) => tradeController.executeOrder(req, res, next));

// GET /api/trade/orders — User's order execution history
router.get('/orders', optionalAuth, (req, res, next) => tradeController.getOrders(req, res, next));

export default router;

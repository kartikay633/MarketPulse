// ROADMAP: Section 6, 11 & 15 — Watchlist Routes
import { Router } from 'express';
import { watchlistController } from '../controllers/watchlistController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/watchlist — User's watchlist with live quotes
router.get('/', optionalAuth, (req, res, next) => watchlistController.getWatchlist(req, res, next));

// POST /api/watchlist/items — Add symbol to watchlist
router.post('/items', optionalAuth, (req, res, next) => watchlistController.addItem(req, res, next));

// DELETE /api/watchlist/items/:symbol — Remove symbol from watchlist
router.delete('/items/:symbol', optionalAuth, (req, res, next) => watchlistController.removeItem(req, res, next));

export default router;

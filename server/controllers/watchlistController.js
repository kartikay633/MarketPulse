// ROADMAP: Section 6 & 11 — Watchlist Controller
import { watchlistService } from '../services/watchlistService.js';

export class WatchlistController {
  async getWatchlist(req, res, next) {
    try {
      const userId = req.userId || 'demo-trader';
      const data = await watchlistService.getWatchlist(userId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async addItem(req, res, next) {
    try {
      const userId = req.userId || 'demo-trader';
      const { symbol } = req.body;
      if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required', code: 'INVALID_INPUT' });
      }
      const data = await watchlistService.addItem(userId, symbol);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req, res, next) {
    try {
      const userId = req.userId || 'demo-trader';
      const { symbol } = req.params;
      const data = await watchlistService.removeItem(userId, symbol);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

export const watchlistController = new WatchlistController();
export default watchlistController;

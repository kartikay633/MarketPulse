// ROADMAP: Section 6 & 9 — News Controller
import { newsService } from '../services/newsService.js';

export class NewsController {
  async getMarketNews(req, res, next) {
    try {
      const category = req.query.category || 'all';
      const limit = parseInt(req.query.limit, 10) || 15;
      const articles = await newsService.getMarketNews({ category, limit });
      res.json({ category, count: articles.length, articles });
    } catch (err) {
      next(err);
    }
  }

  async getStockNews(req, res, next) {
    try {
      const { symbol } = req.params;
      const limit = parseInt(req.query.limit, 10) || 6;
      const articles = await newsService.getStockNews(symbol, { limit });
      res.json({ symbol, count: articles.length, articles });
    } catch (err) {
      next(err);
    }
  }
}

export const newsController = new NewsController();
export default newsController;

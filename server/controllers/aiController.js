// ROADMAP: Section 6 & 10 — AI Controller
import { aiService } from '../services/aiService.js';

export class AIController {
  async getMarketSummary(req, res, next) {
    try {
      const summary = await aiService.generateMarketSummary();
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }

  async getStockInsight(req, res, next) {
    try {
      const { symbol } = req.params;
      const insight = await aiService.generateStockInsight(symbol);
      res.json(insight);
    } catch (err) {
      next(err);
    }
  }

  async chat(req, res, next) {
    try {
      const { message, conversationId, symbol } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required', code: 'INVALID_INPUT' });
      }
      const response = await aiService.chatResponse({ message, conversationId, symbol });
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getConversations(req, res, next) {
    try {
      const { id } = req.query;
      const data = aiService.getConversations(id);
      res.json({ conversations: data });
    } catch (err) {
      next(err);
    }
  }
}

export const aiController = new AIController();
export default aiController;

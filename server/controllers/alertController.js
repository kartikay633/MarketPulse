// ROADMAP: Section 6, 7 & 12 — Price Alerts Controller
import { alertService } from '../services/alertService.js';

export class AlertController {
  async getAlerts(req, res, next) {
    try {
      const userId = req.userId || 'demo-trader';
      const alerts = await alertService.getUserAlerts(userId);
      res.json({ alerts });
    } catch (err) {
      next(err);
    }
  }

  async createAlert(req, res, next) {
    try {
      const userId = req.userId || 'demo-trader';
      const { symbol, targetPrice, condition, note } = req.body;
      const alert = await alertService.createAlert(userId, { symbol, targetPrice, condition, note });
      res.status(201).json({ alert });
    } catch (err) {
      res.status(400).json({ error: err.message, code: 'ALERT_ERROR' });
    }
  }

  async deleteAlert(req, res, next) {
    try {
      const userId = req.userId || 'demo-trader';
      const { id } = req.params;
      const result = await alertService.deleteAlert(userId, id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const alertController = new AlertController();
export default alertController;

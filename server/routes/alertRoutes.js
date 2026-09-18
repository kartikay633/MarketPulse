// ROADMAP: Section 6, 7, 12 & 15 — Price Alerts Routes
import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/alerts — Fetch user's active & triggered price alerts
router.get('/', optionalAuth, (req, res, next) => alertController.getAlerts(req, res, next));

// POST /api/alerts — Create new price alert
router.post('/', optionalAuth, (req, res, next) => alertController.createAlert(req, res, next));

// DELETE /api/alerts/:id — Delete/cancel price alert
router.delete('/:id', optionalAuth, (req, res, next) => alertController.deleteAlert(req, res, next));

export default router;

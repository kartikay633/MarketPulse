// ROADMAP: Section 6, 7 & 12 — Price Alerts Repository
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

// In-memory fallback: userId -> Array of alerts
const memoryAlerts = new Map();

// Seed initial demo alerts for demo-trader
memoryAlerts.set('demo-trader', [
  {
    id: 'alt-101',
    userId: 'demo-trader',
    symbol: 'NSE:RELIANCE',
    targetPrice: 3100.00,
    condition: 'ABOVE', // 'ABOVE' | 'BELOW'
    status: 'ACTIVE', // 'ACTIVE' | 'TRIGGERED' | 'CANCELLED'
    note: 'Resistance breakout target',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    triggeredAt: null,
  },
  {
    id: 'alt-102',
    userId: 'demo-trader',
    symbol: 'NSE:TCS',
    targetPrice: 2050.00,
    condition: 'BELOW',
    status: 'ACTIVE',
    note: 'Support retest entry',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    triggeredAt: null,
  },
]);

export class AlertRepository {
  async getAlerts(userId) {
    try {
      const res = await query(
        `SELECT id, user_id as "userId", symbol, target_price as "targetPrice", 
                condition, status, note, created_at as "createdAt", triggered_at as "triggeredAt"
         FROM price_alerts
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          symbol: r.symbol,
          targetPrice: parseFloat(r.targetPrice),
          condition: r.condition,
          status: r.status,
          note: r.note,
          createdAt: r.createdAt,
          triggeredAt: r.triggeredAt,
        }));
      }
    } catch (err) {
      logger.debug({ err: err.message }, 'DB query failed for price alerts, using memory');
    }

    if (!memoryAlerts.has(userId)) {
      memoryAlerts.set(userId, []);
    }
    return memoryAlerts.get(userId);
  }

  async createAlert(userId, alertData) {
    const alertId = `alt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const { symbol, targetPrice, condition, note = '' } = alertData;
    const cleanSym = symbol.toUpperCase();

    const newAlert = {
      id: alertId,
      userId,
      symbol: cleanSym,
      targetPrice: parseFloat(targetPrice),
      condition: condition.toUpperCase(),
      status: 'ACTIVE',
      note,
      createdAt: new Date().toISOString(),
      triggeredAt: null,
    };

    try {
      await query(
        `INSERT INTO price_alerts (id, user_id, symbol, target_price, condition, status, note, created_at)
         VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6, NOW())`,
        [alertId, userId, cleanSym, newAlert.targetPrice, newAlert.condition, note]
      );
    } catch (err) {
      logger.debug({ err: err.message }, 'DB insert failed for price alert, saving in memory');
    }

    if (!memoryAlerts.has(userId)) {
      memoryAlerts.set(userId, []);
    }
    memoryAlerts.get(userId).unshift(newAlert);
    return newAlert;
  }

  async deleteAlert(userId, alertId) {
    try {
      await query('DELETE FROM price_alerts WHERE user_id = $1 AND id = $2', [userId, alertId]);
    } catch (err) {
      logger.debug({ err: err.message }, 'DB delete failed for price alert');
    }

    if (memoryAlerts.has(userId)) {
      const filtered = memoryAlerts.get(userId).filter((a) => a.id !== alertId);
      memoryAlerts.set(userId, filtered);
    }
    return { success: true, id: alertId };
  }

  async updateAlertStatus(userId, alertId, status) {
    try {
      await query('UPDATE price_alerts SET status = $1, triggered_at = NOW() WHERE user_id = $2 AND id = $3', [
        status,
        userId,
        alertId,
      ]);
    } catch (err) {
      logger.debug({ err: err.message }, 'DB update failed for price alert status');
    }

    if (memoryAlerts.has(userId)) {
      const userAlerts = memoryAlerts.get(userId);
      const target = userAlerts.find((a) => a.id === alertId);
      if (target) {
        target.status = status;
        if (status === 'TRIGGERED') {
          target.triggeredAt = new Date().toISOString();
        }
      }
    }
  }
}

export const alertRepository = new AlertRepository();
export default alertRepository;

// ROADMAP: Section 6 & 15 — User Routes
import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/user/profile — Get authenticated user profile
router.get('/profile', requireAuth, (req, res, next) => userController.getProfile(req, res, next));

// PATCH /api/user/profile — Update user profile
router.patch('/profile', requireAuth, (req, res, next) => userController.updateProfile(req, res, next));

export default router;

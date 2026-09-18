// ROADMAP: Section 6 & 15 — User Controller
import { userService } from '../services/userService.js';

export class UserController {
  async getProfile(req, res, next) {
    try {
      const profile = await userService.getOrCreateProfile(req.user);
      res.json({ profile });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await userService.updateProfile(req.user.id, req.body);
      res.json({ profile });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
export default userController;

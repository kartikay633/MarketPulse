// ROADMAP: Section 6 & 15 — User Service
import { userRepository } from '../repositories/userRepository.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class UserService {
  /**
   * Get user profile or auto-create if this is their first request
   */
  async getOrCreateProfile(user) {
    let profile = await userRepository.findProfileById(user.id);

    if (!profile) {
      logger.info({ userId: user.id }, 'First time authenticated user detected — auto-creating profile & paper account');
      profile = await userRepository.createProfile(user.id, {
        displayName: user.displayName || user.email?.split('@')[0] || 'Trader',
        experienceLevel: 'beginner',
        interestedSectors: [],
        onboardingCompleted: false,
      });

      // Ensure paper trading account has ₹10,00,000 initial virtual cash
      await userRepository.ensurePaperAccount(user.id);

      // Ensure default watchlist exists
      await userRepository.ensureDefaultWatchlist(user.id);
    }

    return {
      ...profile,
      email: user.email,
    };
  }

  /**
   * Update profile fields (display name, sectors, experience, onboarding flag)
   */
  async updateProfile(userId, updates) {
    // Basic validation
    if (updates.experienceLevel && !['beginner', 'intermediate', 'advanced'].includes(updates.experienceLevel)) {
      throw new ValidationError('Invalid experienceLevel: must be beginner, intermediate, or advanced');
    }

    if (updates.interestedSectors && !Array.isArray(updates.interestedSectors)) {
      throw new ValidationError('interestedSectors must be an array of sector strings');
    }

    const updated = await userRepository.updateProfile(userId, updates);
    return updated;
  }
}

export const userService = new UserService();
export default userService;

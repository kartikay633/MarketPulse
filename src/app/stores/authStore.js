// ROADMAP: Section 5 & Phase 1 — Auth Store (Zustand)
import { create } from 'zustand';
import { supabase } from '../services/supabase';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state and subscribe to Supabase auth events
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
        });
        // Fetch server profile
        await get().fetchProfile();
      } else {
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
        });
      }

      // Listen for auth changes (token refresh, sign in, sign out)
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (newSession?.user) {
          set({
            user: newSession.user,
            session: newSession,
            isAuthenticated: true,
          });
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await get().fetchProfile();
          }
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (err) {
      console.error('Failed to initialize auth store:', err);
      set({ error: err.message, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Email/Password login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
      });

      await get().fetchProfile();
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Failed to sign in';
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  // Email/Password signup
  signup: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        set({
          user: data.user,
          session: data.session,
          isAuthenticated: true,
        });
        await get().fetchProfile();
      }

      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      const msg = err.message || 'Failed to sign up';
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  // Google OAuth Login
  loginWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Instant Demo Trader Login for immediate platform access
  loginAsDemo: () => {
    const demoUser = {
      id: 'demo-trader-001',
      email: 'trader@marketpulse.in',
      user_metadata: { display_name: 'Kartikay Gupta' },
    };
    const demoProfile = {
      id: 'demo-trader-001',
      email: 'trader@marketpulse.in',
      displayName: 'Kartikay Gupta',
      experienceLevel: 'intermediate',
      interestedSectors: ['Information Technology (IT)', 'Banking & Financials', 'Automobiles & EV'],
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    set({
      user: demoUser,
      session: { access_token: 'demo_token', user: demoUser },
      profile: demoProfile,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    return { success: true };
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch user profile from backend
  fetchProfile: async () => {
    try {
      const res = await api.get('/user/profile');
      if (res.data?.profile) {
        set({ profile: res.data.profile });
      }
      return res.data?.profile;
    } catch (err) {
      console.warn('Could not fetch user profile from server:', err.message);
      // Fallback profile from user metadata if backend profile not yet ready
      const currentUser = get().user;
      if (currentUser && !get().profile) {
        set({
          profile: {
            id: currentUser.id,
            email: currentUser.email,
            displayName: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0],
            experienceLevel: 'beginner',
            interestedSectors: [],
            onboardingCompleted: false,
          },
        });
      }
      return null;
    }
  },

  // Update user profile (e.g. after onboarding)
  updateProfile: async (updates) => {
    try {
      const res = await api.patch('/user/profile', updates);
      if (res.data?.profile) {
        set({ profile: res.data.profile });
      }
      return { success: true, profile: res.data?.profile };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));

export default useAuthStore;

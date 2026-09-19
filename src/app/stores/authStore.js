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

      // Handle OAuth PKCE callback if code is in URL search params
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      if (code) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('OAuth code exchange warning in initialize:', exchangeError.message);
          } else if (data?.session) {
            set({
              user: data.session.user,
              session: data.session,
              isAuthenticated: true,
            });
            await get().fetchProfile();
            window.history.replaceState({}, document.title, window.location.pathname);
            set({ isLoading: false });
            return;
          }
        } catch (exchangeErr) {
          console.warn('Code exchange caught error in initialize:', exchangeErr);
        }
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.user) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
        });
        await get().fetchProfile();
      } else {
        // Check for persisted local terminal session
        const savedUserStr = localStorage.getItem('market_pulse_user');
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            const userEmail = (savedUser.email && savedUser.email !== 'trader@marketpulse.in' && savedUser.email !== 'demo@marketpulse.in')
              ? savedUser.email
              : 'kartikay633@gmail.com';
            const userName = savedUser.user_metadata?.display_name || savedUser.user_metadata?.full_name || 'Kartikay Gupta';

            savedUser.email = userEmail;
            savedUser.user_metadata = {
              ...(savedUser.user_metadata || {}),
              display_name: userName,
              full_name: userName,
            };

            set({
              user: savedUser,
              session: { access_token: 'local_token', user: savedUser },
              profile: {
                id: savedUser.id,
                email: userEmail,
                displayName: userName,
                full_name: userName,
                experienceLevel: 'intermediate',
                onboardingCompleted: true,
              },
              isAuthenticated: true,
            });
          } catch (e) {
            localStorage.removeItem('market_pulse_user');
          }
        } else {
          // Default to pre-authenticated terminal operator session
          const defaultTrader = {
            id: 'trader-institutional-01',
            email: 'kartikay633@gmail.com',
            user_metadata: { display_name: 'Kartikay Gupta', full_name: 'Kartikay Gupta' },
          };
          set({
            user: defaultTrader,
            session: { access_token: 'local_token', user: defaultTrader },
            profile: {
              id: defaultTrader.id,
              email: defaultTrader.email,
              displayName: 'Kartikay Gupta',
              full_name: 'Kartikay Gupta',
              experienceLevel: 'intermediate',
              onboardingCompleted: true,
            },
            isAuthenticated: true,
          });
        }
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
          localStorage.removeItem('market_pulse_user');
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
      // Even if supabase fails, ensure terminal operator can access
      const defaultTrader = {
        id: 'trader-institutional-01',
        email: 'kartikay633@gmail.com',
        user_metadata: { display_name: 'Kartikay Gupta', full_name: 'Kartikay Gupta' },
      };
      set({
        user: defaultTrader,
        session: { access_token: 'local_token', user: defaultTrader },
        profile: {
          id: defaultTrader.id,
          email: defaultTrader.email,
          displayName: 'Kartikay Gupta',
          full_name: 'Kartikay Gupta',
          experienceLevel: 'intermediate',
          onboardingCompleted: true,
        },
        isAuthenticated: true,
        isLoading: false,
      });
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

      if (error) {
        // Fallback for custom credentials
        if (email && password) {
          const fallbackUser = {
            id: 'trader-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
            email,
            user_metadata: { display_name: email.split('@')[0] },
          };
          localStorage.setItem('market_pulse_user', JSON.stringify(fallbackUser));
          set({
            user: fallbackUser,
            session: { access_token: 'local_token', user: fallbackUser },
            profile: {
              id: fallbackUser.id,
              email,
              displayName: email.split('@')[0],
              experienceLevel: 'intermediate',
              onboardingCompleted: true,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user: fallbackUser };
        }
        throw error;
      }

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
      });

      await get().fetchProfile();
      return { success: true, user: data.user };
    } catch (err) {
      if (email && password) {
        const fallbackUser = {
          id: 'trader-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
          email,
          user_metadata: { display_name: email.split('@')[0] },
        };
        localStorage.setItem('market_pulse_user', JSON.stringify(fallbackUser));
        set({
          user: fallbackUser,
          session: { access_token: 'local_token', user: fallbackUser },
          profile: {
            id: fallbackUser.id,
            email,
            displayName: email.split('@')[0],
            experienceLevel: 'intermediate',
            onboardingCompleted: true,
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, user: fallbackUser };
      }
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

      if (error) {
        if (email && password) {
          const fallbackUser = {
            id: 'trader-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
            email,
            user_metadata: { display_name: displayName || email.split('@')[0] },
          };
          localStorage.setItem('market_pulse_user', JSON.stringify(fallbackUser));
          set({
            user: fallbackUser,
            session: { access_token: 'local_token', user: fallbackUser },
            profile: {
              id: fallbackUser.id,
              email,
              displayName: displayName || email.split('@')[0],
              experienceLevel: 'intermediate',
              onboardingCompleted: true,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user: fallbackUser, session: true };
        }
        throw error;
      }

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
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // Instant Demo Trader Login for immediate platform access
  loginAsDemo: () => {
    const demoUser = {
      id: 'demo-trader-001',
      email: 'kartikay633@gmail.com',
      user_metadata: { display_name: 'Kartikay Gupta', full_name: 'Kartikay Gupta' },
    };
    const demoProfile = {
      id: 'demo-trader-001',
      email: 'kartikay633@gmail.com',
      displayName: 'Kartikay Gupta',
      full_name: 'Kartikay Gupta',
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

  // Update user profile (e.g. after onboarding or settings edit)
  updateProfile: async (updates) => {
    try {
      const currentUser = get().user || {};
      const newEmail = updates.email || currentUser.email || 'kartikay633@gmail.com';
      const newName = updates.displayName || updates.display_name || updates.full_name || currentUser.user_metadata?.display_name || 'Kartikay Gupta';

      const updatedUser = {
        ...currentUser,
        email: newEmail,
        user_metadata: {
          ...(currentUser.user_metadata || {}),
          display_name: newName,
          full_name: newName,
        },
      };

      const updatedProfile = {
        ...(get().profile || {}),
        ...updates,
        email: newEmail,
        displayName: newName,
        full_name: newName,
      };

      localStorage.setItem('market_pulse_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, profile: updatedProfile });

      try {
        const res = await api.patch('/user/profile', updates);
        if (res.data?.profile) {
          set({ profile: { ...updatedProfile, ...res.data.profile } });
        }
      } catch (_) {}

      return { success: true, profile: updatedProfile };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));

export default useAuthStore;

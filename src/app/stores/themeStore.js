// Institutional Theme Management Store (Zustand)
import { create } from 'zustand';

const THEME_KEY = 'market_pulse_theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark'; // Institutional dark default
};

const applyThemeToDOM = (theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    }
  }
};

// Immediate invocation for zero flash
applyThemeToDOM(getInitialTheme());

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  initialize: () => {
    const theme = getInitialTheme();
    applyThemeToDOM(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, next);
    }
    applyThemeToDOM(next);
    set({ theme: next });
  },

  setTheme: (newTheme) => {
    if (newTheme !== 'dark' && newTheme !== 'light') return;
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, newTheme);
    }
    applyThemeToDOM(newTheme);
    set({ theme: newTheme });
  },
}));

export default useThemeStore;

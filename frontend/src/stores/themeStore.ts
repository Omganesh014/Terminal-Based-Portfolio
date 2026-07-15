import { create } from 'zustand';

export type ThemeName = 'midnight' | 'ember' | 'aurora' | 'neon';

export const themeOrder: ThemeName[] = ['midnight', 'ember', 'aurora', 'neon'];

export function getNextTheme(theme: ThemeName) {
  return themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
}

type ThemeState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

function applyTheme(theme: ThemeName) {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme;
}

applyTheme('aurora');

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'aurora',
  setTheme: (theme) => { applyTheme(theme); set({ theme }); },
}));

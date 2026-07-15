import { create } from 'zustand';

type ThemeName = 'midnight' | 'ember';

type ThemeState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'midnight',
  setTheme: (theme) => set({ theme }),
}));

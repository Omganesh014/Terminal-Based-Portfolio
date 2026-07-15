import { create } from 'zustand';

type SettingsState = {
  bootAnimationEnabled: boolean;
  commandPaletteEnabled: boolean;
  setBootAnimationEnabled: (enabled: boolean) => void;
  setCommandPaletteEnabled: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  bootAnimationEnabled: true,
  commandPaletteEnabled: true,
  setBootAnimationEnabled: (bootAnimationEnabled) => set({ bootAnimationEnabled }),
  setCommandPaletteEnabled: (commandPaletteEnabled) => set({ commandPaletteEnabled }),
}));

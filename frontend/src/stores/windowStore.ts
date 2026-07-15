import { create } from 'zustand';

export type WindowId = 'profile' | 'recruiter' | 'about' | 'resume' | 'projects' | 'experience' | 'education' | 'skills' | 'certificates' | 'achievements' | 'contact' | 'terminal' | 'ai-assistant';

type WindowState = {
  activeWindow: WindowId | null;
  openWindow: (windowId: WindowId) => void;
  closeWindow: () => void;
};

export const useWindowStore = create<WindowState>((set) => ({
  activeWindow: null,
  openWindow: (activeWindow) => set({ activeWindow }),
  closeWindow: () => set({ activeWindow: null }),
}));

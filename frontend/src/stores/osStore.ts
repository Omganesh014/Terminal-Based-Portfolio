import { create } from 'zustand';

export type OsStage = 'boot' | 'login' | 'welcome' | 'desktop' | 'terminal' | 'shutdown';

type OsState = {
  userName: string;
  hostName: string;
  booted: boolean;
  startedAt: number;
  stage: OsStage;
  markBootComplete: () => void;
  setStage: (stage: OsStage) => void;
};

export const useOsStore = create<OsState>((set) => ({
  userName: 'omganesh',
  hostName: 'om',
  booted: false,
  startedAt: Date.now(),
  stage: 'boot',
  markBootComplete: () => set({ booted: true, stage: 'login' }),
  setStage: (stage) => set({ stage }),
}));

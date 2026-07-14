import { create } from 'zustand';

type TerminalState = {
  cwd: string;
  history: string[];
  historyIndex: number;
  setCwd: (cwd: string) => void;
  addHistoryEntry: (entry: string) => void;
  moveHistoryIndex: (offset: -1 | 1) => string | null;
  resetHistoryIndex: () => void;
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  cwd: '/home/omos',
  history: [],
  historyIndex: -1,
  setCwd: (cwd) => set({ cwd }),
  addHistoryEntry: (entry) =>
    set((state) => ({
      history: [...state.history, entry],
      historyIndex: -1,
    })),
  moveHistoryIndex: (offset) => {
    const { history, historyIndex } = get();

    if (history.length === 0) {
      return null;
    }

    const nextIndex =
      historyIndex === -1
        ? history.length - 1
        : Math.max(0, Math.min(history.length - 1, historyIndex + offset));

    set({ historyIndex: nextIndex });
    return history[nextIndex] ?? null;
  },
  resetHistoryIndex: () => set({ historyIndex: -1 }),
}));

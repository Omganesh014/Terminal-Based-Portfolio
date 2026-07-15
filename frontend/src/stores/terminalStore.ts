import { create } from 'zustand';

type TerminalState = {
  cwd: string;
  history: string[];
  historyIndex: number;
  setCwd: (cwd: string) => void;
  addHistoryEntry: (entry: string) => void;
  moveHistoryIndex: (offset: -1 | 1) => string | null;
  resetHistoryIndex: () => void;
  resetSession: () => void;
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  cwd: '/home/omganesh',
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

    if (offset === 1 && historyIndex === history.length - 1) {
      set({ historyIndex: -1 });
      return null;
    }

    const nextIndex = historyIndex === -1
      ? history.length - 1
      : Math.max(0, historyIndex + offset);

    set({ historyIndex: nextIndex });
    return history[nextIndex] ?? null;
  },
  resetHistoryIndex: () => set({ historyIndex: -1 }),
  resetSession: () => set({ cwd: '/home/omganesh', history: [], historyIndex: -1 }),
}));

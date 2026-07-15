import { beforeEach, describe, expect, it } from 'vitest';
import { useTerminalStore } from './terminalStore';

describe('terminal history', () => {
  beforeEach(() => {
    useTerminalStore.setState({ cwd: '/home/omganesh', history: [], historyIndex: -1 });
  });

  it('moves backward and forward through history, returning to a blank prompt', () => {
    const terminal = useTerminalStore.getState();
    terminal.addHistoryEntry('ls');
    terminal.addHistoryEntry('pwd');

    expect(useTerminalStore.getState().moveHistoryIndex(-1)).toBe('pwd');
    expect(useTerminalStore.getState().moveHistoryIndex(-1)).toBe('ls');
    expect(useTerminalStore.getState().moveHistoryIndex(1)).toBe('pwd');
    expect(useTerminalStore.getState().moveHistoryIndex(1)).toBeNull();
  });
});

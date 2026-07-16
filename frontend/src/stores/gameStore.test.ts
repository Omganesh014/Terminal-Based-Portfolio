import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from './gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().stop();
  });

  it('starts with no active game', () => {
    expect(useGameStore.getState().active).toBeNull();
  });

  it('starts snake game', () => {
    useGameStore.getState().startSnake();
    const state = useGameStore.getState();
    expect(state.active).toBe('snake');
    expect(state.score).toBe(0);
    expect(state.gameOver).toBe(false);
    expect(state.snakeState.length).toBe(3);
  });

  it('starts tic-tac-toe game', () => {
    useGameStore.getState().startTtt();
    const state = useGameStore.getState();
    expect(state.active).toBe('ttt');
    expect(state.board).toEqual(Array(9).fill(''));
    expect(state.currentPlayer).toBe('X');
  });

  it('handles tic-tac-toe move', () => {
    useGameStore.getState().startTtt();
    const result = useGameStore.getState().handleInput('1');
    expect(result).toBeTruthy();
    expect(result![0]).toBe('TIC-TAC-TOE');
    expect(useGameStore.getState().currentPlayer).toBe('O');
  });

  it('rejects invalid tic-tac-toe position', () => {
    useGameStore.getState().startTtt();
    expect(useGameStore.getState().handleInput('0')).toBeNull();
    expect(useGameStore.getState().handleInput('a')).toBeNull();
  });

  it('stops the game', () => {
    useGameStore.getState().startSnake();
    useGameStore.getState().stop();
    expect(useGameStore.getState().active).toBeNull();
  });
});

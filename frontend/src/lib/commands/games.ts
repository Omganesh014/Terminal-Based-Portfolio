import type { Command, CommandResult, ExecutionContext } from '../terminal';
import { useGameStore } from '../../stores/gameStore';

function matrixRain(): string[] {
  const cols = 60;
  const rows = 20;
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]|&^%$#@!';
  const drops: number[] = [];
  for (let i = 0; i < cols; i++) drops.push(Math.floor(Math.random() * -rows * 2));

  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let row = '';
    for (let c = 0; c < cols; c++) {
      if (drops[c] === r) row += '\x1b[92m' + chars[Math.floor(Math.random() * chars.length)] + '\x1b[0m';
      else if (drops[c] > r && drops[c] < r + 4) row += '\x1b[32m' + chars[Math.floor(Math.random() * chars.length)] + '\x1b[0m';
      else if (Math.random() < 0.02) row += chars[Math.floor(Math.random() * chars.length)];
      else row += ' ';
    }
    lines.push(row);
  }
  return lines;
}

export const gameCommands: Command[] = [
  {
    name: 'snake', usage: 'snake',
    description: 'Play Snake in the terminal. Use WASD or arrow keys to move.',
    run: (): CommandResult => {
      useGameStore.getState().startSnake();
      const state = useGameStore.getState();
      return { lines: [
        '🐍 SNAKE',
        '',
        ...state.board,
        '',
        'Score: 0  (WASD/Arrows to move)',
      ] };
    },
  },
  {
    name: 'ttt', usage: 'ttt',
    description: 'Play Tic-Tac-Toe against a friend. Enter 1-9 to place your mark.',
    run: (): CommandResult => {
      useGameStore.getState().startTtt();
      return { lines: [
        'TIC-TAC-TOE',
        '',
        '  1 │ 2 │ 3',
        '  ───┼───┼───',
        '  4 │ 5 │ 6',
        '  ───┼───┼───',
        '  7 │ 8 │ 9',
        '',
        "Player X's turn. Enter 1-9.",
      ] };
    },
  },
  {
    name: 'matrix', usage: 'matrix',
    description: 'Matrix digital rain effect.',
    run: (): CommandResult => ({ lines: matrixRain() }),
  },
];

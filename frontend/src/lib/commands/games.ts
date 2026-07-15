import type { Command, CommandResult, ExecutionContext } from '../terminal';

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
    description: 'Play Snake in the terminal. Use arrow keys to move.',
    run: (): CommandResult => ({ lines: [
      '🐍 SNAKE — Terminal Edition',
      '',
      '  Controls: Arrow keys to move',
      '  Goal: Eat food (*) to grow. Don\'t hit walls or yourself.',
      '',
      '  Starting a 20x10 game...',
      '',
      '  ' + '█'.repeat(22),
      ...Array.from({ length: 8 }, () => '  █' + ' '.repeat(20) + '█'),
      '  ' + '█'.repeat(22),
      '',
      '  Score: 0',
      '  Type "snake" again to restart.',
    ] }),
  },
  {
    name: 'ttt', usage: 'ttt',
    description: 'Play Tic-Tac-Toe against the computer.',
    run: (): CommandResult => {
      const board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const drawBoard = (b: string[]) =>
        `  ${b[0]} │ ${b[1]} │ ${b[2]}\n  ───┼───┼───\n  ${b[3]} │ ${b[4]} │ ${b[5]}\n  ───┼───┼───\n  ${b[6]} │ ${b[7]} │ ${b[8]}`;

      return { lines: [
        'TIC-TAC-TOE',
        '',
        'You are X. Computer is O.',
        'Type "ttt <position>" to play (positions 1-9).',
        '',
        ...drawBoard(board).split('\n'),
        '',
        'Your turn. Enter: ttt <1-9>',
      ] };
    },
  },
  {
    name: 'matrix', usage: 'matrix',
    description: 'Matrix digital rain effect.',
    run: (): CommandResult => ({ lines: matrixRain() }),
  },
];

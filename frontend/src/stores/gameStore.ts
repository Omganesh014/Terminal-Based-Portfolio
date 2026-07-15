import { create } from 'zustand';

type SnakeState = { x: number; y: number }[];
type GameStore = {
  active: 'snake' | 'ttt' | null;
  board: string[];
  score: number;
  gameOver: boolean;
  winner: string | null;
  currentPlayer: 'X' | 'O';
  snakeState: SnakeState;
  food: { x: number; y: number };
  dir: { x: number; y: number };
  startSnake: () => void;
  startTtt: () => void;
  handleInput: (key: string) => string[] | null;
  stop: () => void;
};

const SIZE = 20;
const COLS = 40;

function createSnakeBoard(snake: SnakeState, food: { x: number; y: number }) {
  const grid: string[][] = [];
  for (let y = 0; y < SIZE; y++) {
    const row: string[] = [];
    for (let x = 0; x < COLS; x++) {
      if (x === 0 || x === COLS - 1 || y === 0 || y === SIZE - 1) row.push('█');
      else row.push(' ');
    }
    grid.push(row);
  }
  for (const seg of snake) {
    if (seg.y > 0 && seg.y < SIZE - 1 && seg.x > 0 && seg.x < COLS - 1) {
      grid[seg.y][seg.x] = '●';
    }
  }
  if (food.y > 0 && food.y < SIZE - 1 && food.x > 0 && food.x < COLS - 1) {
    grid[food.y][food.x] = '★';
  }
  return grid.map((r) => r.join(''));
}

function scoreLine(score: number, dead: boolean): string {
  return dead ? `GAME OVER — Score: ${score}  Press R to restart.` : `Score: ${score}  (WASD/Arrows to move)`;
}

const initialState = {
  active: null as 'snake' | 'ttt' | null,
  board: [] as string[],
  score: 0,
  gameOver: false,
  winner: null as string | null,
  currentPlayer: 'X' as const,
  snakeState: [] as SnakeState,
  food: { x: 0, y: 0 },
  dir: { x: 0, y: 0 },
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startSnake: () => {
    const snake: SnakeState = [
      { x: Math.floor(COLS / 2), y: Math.floor(SIZE / 2) },
      { x: Math.floor(COLS / 2) - 1, y: Math.floor(SIZE / 2) },
      { x: Math.floor(COLS / 2) - 2, y: Math.floor(SIZE / 2) },
    ];
    let food = { x: 0, y: 0 };
    do { food = { x: Math.floor(Math.random() * (COLS - 2)) + 1, y: Math.floor(Math.random() * (SIZE - 2)) + 1 }; }
      while (snake.some((s) => s.x === food.x && s.y === food.y));

    set({
      active: 'snake',
      board: createSnakeBoard(snake, food),
      score: 0,
      gameOver: false,
      winner: null,
      snakeState: snake,
      food,
      dir: { x: 1, y: 0 },
    });
  },

  startTtt: () => {
    set({ active: 'ttt', board: Array(9).fill(''), score: 0, gameOver: false, winner: null, currentPlayer: 'X', snakeState: [], food: { x: 0, y: 0 }, dir: { x: 0, y: 0 } });
  },

  handleInput: (key: string) => {
    const state = get();
    if (!state.active) return null;

    if (state.active === 'snake') {
      const { snakeState: snake, food, dir, score, gameOver } = state;

      if (gameOver) {
        if (key === 'r' || key === 'R') { get().startSnake(); return null; }
        return null;
      }

      const newDir = (() => {
        if ((key === '\u001b[A' || key === 'w') && dir.y !== 1) return { x: 0, y: -1 };
        if ((key === '\u001b[B' || key === 's') && dir.y !== -1) return { x: 0, y: 1 };
        if ((key === '\u001b[D' || key === 'a') && dir.x !== 1) return { x: -1, y: 0 };
        if ((key === '\u001b[C' || key === 'd') && dir.x !== -1) return { x: 1, y: 0 };
        return null;
      })();
      const actualDir = newDir || dir;

      const head = { x: snake[0].x + actualDir.x, y: snake[0].y + actualDir.y };

      if (head.x <= 0 || head.x >= COLS - 1 || head.y <= 0 || head.y >= SIZE - 1 || snake.some((s) => s.x === head.x && s.y === head.y)) {
        const board = createSnakeBoard(snake, food);
        set({ board, gameOver: true });
        return [...board, '', scoreLine(score, true)];
      }

      const ate = head.x === food.x && head.y === food.y;
      const newSnake = [head, ...snake.slice(0, ate ? snake.length : -1)];
      let newFood = food;
      if (ate) {
        do { newFood = { x: Math.floor(Math.random() * (COLS - 2)) + 1, y: Math.floor(Math.random() * (SIZE - 2)) + 1 }; }
          while (newSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
      }

      const board = createSnakeBoard(newSnake, newFood);
      const newScore = score + (ate ? 1 : 0);
      set({ board, score: newScore, snakeState: newSnake, food: newFood, dir: actualDir });
      return [...board, '', scoreLine(newScore, false)];
    }

    if (state.active === 'ttt') {
      const { board, gameOver, winner, currentPlayer } = state;

      if (gameOver) {
        if (key === 'r' || key === 'R') { get().startTtt(); return null; }
        return null;
      }

      const pos = parseInt(key, 10);
      if (isNaN(pos) || pos < 1 || pos > 9) return null;
      const idx = pos - 1;
      if (board[idx]) return null;

      const newBoard = [...board];
      newBoard[idx] = currentPlayer;

      const winLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      let winner_: string | null = null;
      for (const [a,b,c] of winLines) {
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) { winner_ = newBoard[a]; break; }
      }
      const draw = !winner_ && newBoard.every((c) => c);

      const formatted = [
        'TIC-TAC-TOE',
        '',
        `  ${newBoard[0] || '1'} │ ${newBoard[1] || '2'} │ ${newBoard[2] || '3'}`,
        '  ───┼───┼───',
        `  ${newBoard[3] || '4'} │ ${newBoard[4] || '5'} │ ${newBoard[5] || '6'}`,
        '  ───┼───┼───',
        `  ${newBoard[6] || '7'} │ ${newBoard[7] || '8'} │ ${newBoard[8] || '9'}`,
        '',
      ];

      if (winner_) {
        formatted.push(`🏆 ${winner_} wins! Press R to restart.`);
        set({ board: newBoard, gameOver: true, winner: winner_ });
      } else if (draw) {
        formatted.push('Draw! Press R to restart.');
        set({ board: newBoard, gameOver: true, winner: 'draw' });
      } else {
        const next = currentPlayer === 'X' ? 'O' : 'X';
        formatted.push(`Player ${next}'s turn. Enter 1-9.`);
        set({ board: newBoard, currentPlayer: next });
      }

      return formatted;
    }

    return null;
  },

  stop: () => set({ ...initialState }),
}));

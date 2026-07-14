export type TerminalContext = {
  userName: string;
  hostName: string;
  cwd: string;
};

export type CommandResult = {
  lines: string[];
  cwd?: string;
  clear?: boolean;
};

const fileSystem: Record<string, string[]> = {
  '/': ['home', 'projects', 'resume.md', 'skills.md'],
  '/home': ['omos'],
  '/home/omos': ['projects', 'resume.md', 'skills.md', 'contact.md'],
  '/home/omos/projects': ['terminal-based-portfolio'],
  '/projects': ['terminal-based-portfolio'],
};

const fileContents: Record<string, string[]> = {
  '/resume.md': [
    '# Om Ganesh',
    'Full Stack Developer focused on interactive interfaces, system thinking, and portfolio engineering.',
  ],
  '/skills.md': ['React', 'TypeScript', 'Zustand', 'Terminal UX', 'API integration'],
  '/home/omos/resume.md': [
    '# Resume',
    'Use this portfolio terminal to inspect projects, experience, and technical depth.',
  ],
  '/home/omos/skills.md': ['Frontend engineering', 'Systems design', 'Debugging', 'Product thinking'],
  '/home/omos/contact.md': ['GitHub: Omganesh014', 'Portfolio: OmOS'],
  '/home/omos/projects/terminal-based-portfolio': [
    'Interactive terminal portfolio built with React, TypeScript, Zustand, and xterm.js.',
  ],
  '/projects/terminal-based-portfolio': ['Interactive terminal portfolio in progress.'],
};

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const segments = pathname.split('/').filter(Boolean);
  const stack: string[] = [];

  for (const segment of segments) {
    if (segment === '.') {
      continue;
    }

    if (segment === '..') {
      stack.pop();
      continue;
    }

    stack.push(segment);
  }

  return `/${stack.join('/')}`;
}

function resolvePath(cwd: string, target: string) {
  if (!target || target === '~') {
    return '/home/omos';
  }

  if (target.startsWith('/')) {
    return normalizePath(target);
  }

  return normalizePath(`${cwd}/${target}`);
}

function tokenizeCommand(input: string) {
  const tokens: string[] = [];
  let current = '';
  let quote: 'single' | 'double' | null = null;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (quote) {
      if ((quote === 'single' && character === "'") || (quote === 'double' && character === '"')) {
        quote = null;
      } else {
        current += character;
      }
      continue;
    }

    if (character === ' ' || character === '\t') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    if (character === '"') {
      quote = 'double';
      continue;
    }

    if (character === "'") {
      quote = 'single';
      continue;
    }

    current += character;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function listDirectory(pathname: string) {
  return fileSystem[pathname] ?? ['No entries found.'];
}

function readFile(pathname: string) {
  return fileContents[pathname] ?? [`cat: ${pathname}: No such file or directory`];
}

export function formatPrompt(context: TerminalContext) {
  return `${context.userName}@${context.hostName}:${context.cwd}$ `;
}

export function executeTerminalCommand(input: string, context: TerminalContext): CommandResult {
  const tokens = tokenizeCommand(input);

  if (tokens.length === 0) {
    return { lines: [] };
  }

  const [command, ...args] = tokens;

  switch (command) {
    case 'help':
      return {
        lines: [
          'Available commands: help, clear, whoami, pwd, ls, cd, cat, tree, echo, about',
          'Try: ls /home/omos',
        ],
      };
    case 'clear':
    case 'cls':
      return { lines: [], clear: true };
    case 'whoami':
      return { lines: [`${context.userName}`] };
    case 'pwd':
      return { lines: [context.cwd] };
    case 'ls': {
      const targetPath = args[0] ? resolvePath(context.cwd, args[0]) : context.cwd;
      return { lines: listDirectory(targetPath).map((entry) => entry) };
    }
    case 'cd': {
      const nextPath = args[0] ? resolvePath(context.cwd, args[0]) : '/home/omos';
      if (!fileSystem[nextPath]) {
        return { lines: [`cd: no such file or directory: ${args[0] ?? ''}`.trim()] };
      }

      return { lines: [], cwd: nextPath };
    }
    case 'cat': {
      const target = args[0] ? resolvePath(context.cwd, args[0]) : '';
      return { lines: target ? readFile(target) : ['cat: missing file operand'] };
    }
    case 'tree':
      return {
        lines: [
          '/home/omos',
          '├── projects',
          '├── resume.md',
          '├── skills.md',
          '└── contact.md',
        ],
      };
    case 'echo':
      return { lines: [args.join(' ')] };
    case 'about':
      return {
        lines: [
          'OmOS is a terminal-based developer portfolio.',
          'This phase adds the real terminal runtime and store-backed state.',
        ],
      };
    default:
      return { lines: [`${command}: command not found`] };
  }
}

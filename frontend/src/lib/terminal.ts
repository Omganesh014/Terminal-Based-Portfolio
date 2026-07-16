import { formatFileTree, normalizePath } from './filesystem';
import { useFileSystemStore } from '../stores/filesystemStore';
import { useTerminalStore } from '../stores/terminalStore';
import { phase4Commands } from './commands';
import { searchPortfolio } from './portfolioSearch';
import { CHAT_API } from '../config/api';

export type TerminalContext = { userName: string; hostName: string; cwd: string };
export type CommandResult = { lines: string[]; cwd?: string; clear?: boolean };
export type CommandMetadata = { name: string; usage: string; description: string };
export type ExecutionContext = TerminalContext & { stdin: string[] };
export type Command = CommandMetadata & { run: (args: string[], context: ExecutionContext) => CommandResult | Promise<CommandResult> };

const operators = new Set(['|', '>', '>>', '&&', ';']);

export function tokenizeCommand(input: string) {
  const tokens: string[] = []; let current = ''; let quote: 'single' | 'double' | null = null;
  const push = () => { if (current) { tokens.push(current); current = ''; } };
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quote) { if ((quote === 'single' && char === "'") || (quote === 'double' && char === '"')) quote = null; else current += char; continue; }
    if (char === "'" || char === '"') { quote = char === "'" ? 'single' : 'double'; continue; }
    if (/\s/.test(char)) { push(); continue; }
    if ('|>;'.includes(char)) {
      push();
      const operator = char === '>' && input[index + 1] === '>' ? '>>' : char;
      if (operator === '>>') index += 1;
      tokens.push(operator);
      continue;
    }
    if (char === '&' && input[index + 1] === '&') { push(); tokens.push('&&'); index += 1; continue; }
    current += char;
  }
  push(); return tokens;
}

function hasUnclosedQuote(input: string) {
  let quote: "'" | '"' | null = null;
  for (const char of input) {
    if (!quote && (char === "'" || char === '"')) quote = char;
    else if (char === quote) quote = null;
  }
  return quote !== null;
}

function resolvePath(cwd: string, target = '~') {
  const requestedPath = normalizePath(target === '~' ? '/home/omganesh' : target.startsWith('/') ? target : `${cwd}/${target}`);
  const fileSystem = useFileSystemStore.getState().fileSystem;
  let resolvedPath = '/';

  const segments = requestedPath.split('/').filter(Boolean);
  for (const [index, segment] of segments.entries()) {
    const entries = fileSystem.directories[resolvedPath] ?? [];
    const matchingEntry = entries.find((entry) => entry.toLowerCase() === segment.toLowerCase());
    if (!matchingEntry) return normalizePath(`${resolvedPath}/${segments.slice(index).join('/')}`);
    resolvedPath = normalizePath(`${resolvedPath}/${matchingEntry}`);
  }

  return resolvedPath;
}
function error(command: string, message: string): CommandResult { return { lines: [`${command}: ${message}`] }; }

const commands: Command[] = [
  { name: 'help', usage: 'help [command]', description: 'Show available commands.', run: (args) => {
    const found = args[0] && commandRegistry.get(args[0]);
    return found ? { lines: [`${found.name} — ${found.description}`, `Usage: ${found.usage}`] } : { lines: ['Available commands:', ...commands.map((command) => `  ${command.name.padEnd(8)} ${command.description}`), 'Operators: | (pipe), > (write), >> (append), && and ; (chain)'] };
  } },
  { name: 'clear', usage: 'clear', description: 'Clear the terminal.', run: () => ({ lines: [], clear: true }) },
  { name: 'cls', usage: 'cls', description: 'Alias for clear.', run: () => ({ lines: [], clear: true }) },
  { name: 'whoami', usage: 'whoami', description: 'Print the current user.', run: (_, context) => ({ lines: [context.userName] }) },
  { name: 'pwd', usage: 'pwd', description: 'Print the working directory.', run: (_, context) => ({ lines: [context.cwd] }) },
  { name: 'ls', usage: 'ls [-a] [directory]', description: 'List directory contents.', run: (args, context) => {
    const hidden = args.includes('-a'); const target = resolvePath(context.cwd, args.find((arg) => !arg.startsWith('-'))); const entries = useFileSystemStore.getState().listDirectory(target, hidden);
    return entries ? { lines: [entries.join('  ')] } : error('ls', `cannot access '${args.at(-1) ?? target}': No such directory`);
  } },
  { name: 'cd', usage: 'cd [directory]', description: 'Change the working directory.', run: (args, context) => { const target = resolvePath(context.cwd, args[0]); return useFileSystemStore.getState().directoryExists(target) ? { lines: [], cwd: target } : error('cd', `no such file or directory: ${args[0] ?? ''}`); } },
  { name: 'cat', usage: 'cat <file>', description: 'Print a file.', run: (args, context) => { if (!args[0]) return error('cat', 'missing file operand'); const file = resolvePath(context.cwd, args[0]); return { lines: useFileSystemStore.getState().readFile(file) ?? [`cat: ${args[0]}: No such file`] }; } },
  { name: 'tree', usage: 'tree [directory]', description: 'Render a directory tree.', run: (args, context) => { const target = resolvePath(context.cwd, args[0]); return useFileSystemStore.getState().directoryExists(target) ? { lines: formatFileTree(useFileSystemStore.getState().fileSystem, target) } : error('tree', `no such directory: ${args[0]}`); } },
  { name: 'echo', usage: 'echo <text>', description: 'Print text or piped input.', run: (args, context) => ({ lines: args.length ? [args.join(' ')] : context.stdin }) },
  { name: 'history', usage: 'history', description: 'Show command history.', run: () => ({ lines: useTerminalStore.getState().history.map((entry, index) => `${String(index + 1).padStart(3)}  ${entry}`) }) },
  { name: 'mkdir', usage: 'mkdir <directory>', description: 'Create a directory.', run: (args, context) => !args[0] ? error('mkdir', 'missing operand') : useFileSystemStore.getState().makeDirectory(resolvePath(context.cwd, args[0])) ? { lines: [] } : error('mkdir', `cannot create directory '${args[0]}'`) },
  { name: 'touch', usage: 'touch <file>', description: 'Create an empty file.', run: (args, context) => !args[0] ? error('touch', 'missing file operand') : useFileSystemStore.getState().writeFile(resolvePath(context.cwd, args[0]), []) ? { lines: [] } : error('touch', `cannot touch '${args[0]}'`) },
  { name: 'rm', usage: 'rm [-r] <path>', description: 'Remove a file or directory.', run: (args, context) => { const target = args.find((arg) => !arg.startsWith('-')); return !target ? error('rm', 'missing operand') : useFileSystemStore.getState().remove(resolvePath(context.cwd, target), args.includes('-r') || args.includes('-rf')) ? { lines: [] } : error('rm', `cannot remove '${target}'`); } },
  { name: 'head', usage: 'head <file>', description: 'Print the first lines of a file.', run: (args, context) => { const lines = args[0] ? useFileSystemStore.getState().readFile(resolvePath(context.cwd, args[0])) : context.stdin; return lines ? { lines: lines.slice(0, 10) } : error('head', `cannot open '${args[0]}'`); } },
  { name: 'grep', usage: 'grep <text> [file]', description: 'Filter matching lines.', run: (args, context) => { const [needle, file] = args; if (!needle) return error('grep', 'missing search text'); const lines = file ? useFileSystemStore.getState().readFile(resolvePath(context.cwd, file)) : context.stdin; return { lines: (lines ?? []).filter((line) => line.toLowerCase().includes(needle.toLowerCase())) }; } },
  { name: 'find', usage: 'find [directory] -name <pattern>', description: 'Search for files by name.', run: (args, context) => {
    const nameIdx = args.indexOf('-name');
    const pattern = nameIdx !== -1 ? args[nameIdx + 1]?.toLowerCase() : null;
    if (!pattern) return error('find', 'usage: find [directory] -name <pattern>');
    const dir = resolvePath(context.cwd, nameIdx > 0 ? args[0] : '.');
    const fs = useFileSystemStore.getState().fileSystem;
    const results: string[] = [];
    for (const [path, entries] of Object.entries(fs.directories)) {
      if (!path.startsWith(dir)) continue;
      for (const entry of entries) {
        if (entry.toLowerCase().includes(pattern)) {
          results.push(normalizePath(`${path}/${entry}`));
        }
      }
    }
    for (const filePath of Object.keys(fs.files)) {
      if (filePath.startsWith(dir) && filePath.toLowerCase().includes(pattern)) {
        results.push(filePath);
      }
    }
    if (!results.length) return { lines: [`find: no matches for '${pattern}'`] };
    return { lines: results };
  } },
  { name: 'architecture-view', usage: 'architecture-view', description: 'Explain the portfolio architecture.', run: () => ({ lines: [
    'OM architecture overview:',
    '  - Frontend: React 19 + TypeScript + Vite with a desktop shell and optional terminal runtime.',
    '  - State: Zustand stores keep OS stage, windows, filesystem, terminal, settings, and theme in sync.',
    '  - Content: Portfolio sections are rendered from local UI data and a store-backed virtual filesystem.',
    '  - Integrations: GitHub live profile data, analytics, resume downloads, and browser tests support the public portfolio.',
    '  - Recruiter flow: the workspace highlights profile, resume, projects, and contact paths for quick review.',
  ] }) },
  { name: 'about', usage: 'about', description: 'Describe OM.', run: () => ({ lines: ['OM is a terminal-based developer portfolio.', 'Explore Projects, Experience, Skills, and Contact from /home/omganesh.'] }) },
  ...phase4Commands,
  { name: 'ask', usage: 'ask <question>', description: 'Ask OM AI about portfolio projects, skills, or experience.', run: async (args) => {
    if (!args.length) return { lines: ['ask: Ask a question about the portfolio. Usage: ask <question>'] };
    const question = args.join(' ');

    const localAnswer = searchPortfolio(question);
    if (localAnswer) {
      return { lines: localAnswer.split('\n') };
    }

    const API_URL = CHAT_API;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${API_URL}?message=${encodeURIComponent(question)}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.status === 405) return { lines: ['ask: AI assistant is only available when the backend is running locally. Start it with `cd backend && npm run dev`.'] };
      if (!res.ok) return { lines: [`ask: Failed to get response (${res.status})`] };

      const reader = res.body?.getReader();
      if (!reader) return { lines: ['ask: No response from AI'] };

      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) return { lines: [`ask: ${data.error}`] };
            if (data.text) fullText += data.text;
          } catch { continue; }
        }
      }
      return { lines: fullText ? fullText.split('\n') : ['ask: No response from AI'] };
    } catch {
      return { lines: ['ask: Failed to reach the AI service. Is the backend running?'] };
    }
  } },
];

export const commandRegistry = new Map(commands.map((command) => [command.name, command]));
export const commandMetadata: CommandMetadata[] = commands.map(({ name, usage, description }) => ({ name, usage, description }));
export function formatPrompt(context: TerminalContext) { return `${context.userName}@${context.hostName}:${context.cwd}$ `; }

async function executeSegment(tokens: string[], context: ExecutionContext): Promise<CommandResult> {
  const [name, ...args] = tokens; const command = commandRegistry.get(name);
  return command ? await command.run(args, context) : error(name, 'command not found');
}

export async function executeTerminalCommand(input: string, context: TerminalContext): Promise<CommandResult> {
  if (hasUnclosedQuote(input)) return { lines: ['shell: unterminated quoted string'] };
  const tokens = tokenizeCommand(input); if (!tokens.length) return { lines: [] };
  let index = 0; let stdin: string[] = []; let cwd = context.cwd; let output: string[] = []; let clear = false;
  while (index < tokens.length) {
    if (tokens[index] === '&&' || tokens[index] === ';' || tokens[index] === '|') return { lines: ['shell: syntax error'] };
    const segment: string[] = []; while (index < tokens.length && !operators.has(tokens[index])) segment.push(tokens[index++]);
    if (!segment.length) return { lines: ['shell: syntax error'] };
    const result = await executeSegment(segment, { ...context, cwd, stdin }); output = result.lines; cwd = result.cwd ?? cwd; clear ||= Boolean(result.clear);
    const operator = tokens[index++];
    if (operator === '|') { stdin = output; continue; }
    if (operator === '>' || operator === '>>') {
      const target = tokens[index++];
      if (!target || operators.has(target)) return { lines: ['shell: redirection requires a file'] };
      if (!useFileSystemStore.getState().writeFile(resolvePath(cwd, target), output, operator === '>>')) return error('shell', `cannot write '${target}'`);
      output = [];
      const nextOperator = tokens[index];
      if (nextOperator === '&&' || nextOperator === ';') {
        index += 1;
        stdin = [];
      } else if (nextOperator === '|') {
        return { lines: ['shell: syntax error near unexpected token `|`'] };
      }
      continue;
    }
    if (operator === '&&' || operator === ';') { stdin = []; continue; }
    if (!operator) break;
  }
  return { lines: output, cwd: cwd === context.cwd ? undefined : cwd, clear };
}

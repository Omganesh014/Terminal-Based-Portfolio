import { beforeEach, describe, expect, it } from 'vitest';
import { executeTerminalCommand } from './terminal';
import { useFileSystemStore } from '../stores/filesystemStore';

const context = { userName: 'omganesh', hostName: 'om', cwd: '/home/omganesh' };

describe('executeTerminalCommand', () => {
  beforeEach(() => useFileSystemStore.getState().resetFileSystem());

  it('lists entries from the store-backed virtual filesystem', async () => {
    expect((await executeTerminalCommand('ls', context)).lines).toEqual([
      'Projects  Experience  Education  Skills  Certificates  Achievements  Contact  README.md',
    ]);
  });

  it('changes directories using relative paths', async () => {
    expect((await executeTerminalCommand('cd Projects', context)).cwd).toBe('/home/omganesh/Projects');
  });

  it('resolves portfolio paths without requiring exact capitalization', async () => {
    expect((await executeTerminalCommand('ls projects', context)).lines).toEqual([
      'spendday.md  study-buddy.md  truthbridge-janavaani.md  road-damage-detection.md  daa-final-lab.md  omos-terminal-portfolio.md  kle-connect.md  wids-2026-wildfire-prediction.md  digital-memory-capsule.md',
    ]);
  });

  it('includes SpendDay in the project index with its full portfolio entry', async () => {
    expect((await executeTerminalCommand('ls Projects', context)).lines).toEqual([
      'spendday.md  study-buddy.md  truthbridge-janavaani.md  road-damage-detection.md  daa-final-lab.md  omos-terminal-portfolio.md  kle-connect.md  wids-2026-wildfire-prediction.md  digital-memory-capsule.md',
    ]);
    expect((await executeTerminalCommand('cat Projects/spendday.md', context)).lines).toContain('# SpendDay');
  });

  it('renders the tree from the store-backed virtual filesystem', async () => {
    expect((await executeTerminalCommand('tree', context)).lines).toContain('├── Projects');
  });

  it('returns an error for an unknown command', async () => {
    expect((await executeTerminalCommand('unknown', context)).lines).toEqual(['unknown: command not found']);
  });

  it('preserves quoted arguments as a single token', async () => {
    expect((await executeTerminalCommand('echo "hello portfolio"', context)).lines).toEqual(['hello portfolio']);
  });

  it('reports an unclosed quote instead of executing partial input', async () => {
    expect((await executeTerminalCommand('echo "unfinished', context)).lines).toEqual([
      'shell: unterminated quoted string',
    ]);
  });

  it('explains the portfolio architecture from the terminal', async () => {
    expect((await executeTerminalCommand('architecture-view', context)).lines).toEqual([
      'OM architecture overview:',
      '  - Frontend: React 19 + TypeScript + Vite with a desktop shell and optional terminal runtime.',
      '  - State: Zustand stores keep OS stage, windows, filesystem, terminal, settings, and theme in sync.',
      '  - Content: Portfolio sections are rendered from local UI data and a store-backed virtual filesystem.',
      '  - Integrations: GitHub live profile data, analytics, resume downloads, and browser tests support the public portfolio.',
      '  - Recruiter flow: the workspace highlights profile, resume, projects, and contact paths for quick review.',
    ]);
  });

  it('pipes output into a filter command', async () => {
    expect((await executeTerminalCommand('cat Skills/skills.md | grep TypeScript', context)).lines).toEqual([
      'Java · C++ · C · HTML5 · React.js · Node.js · Express.js · TypeScript · Web Development · Full-Stack Development',
    ]);
  });

  it('writes and appends output through redirection', async () => {
    await executeTerminalCommand('echo first > notes.txt', context);
    await executeTerminalCommand('echo second >> notes.txt', context);

    expect((await executeTerminalCommand('cat notes.txt', context)).lines).toEqual(['first', 'second']);
  });

  it('continues a command chain after redirection', async () => {
    expect((await executeTerminalCommand('echo hello > greeting.txt; cat greeting.txt', context)).lines).toEqual(['hello']);
  });

  it('creates and removes filesystem entries', async () => {
    expect((await executeTerminalCommand('mkdir sandbox', context)).lines).toEqual([]);
    expect((await executeTerminalCommand('touch sandbox/note.txt', context)).lines).toEqual([]);
    expect((await executeTerminalCommand('rm -r sandbox', context)).lines).toEqual([]);
    expect((await executeTerminalCommand('ls sandbox', context)).lines).toEqual([
      "ls: cannot access 'sandbox': No such directory",
    ]);
  });

  it('does not allow removal of the filesystem root', async () => {
    expect((await executeTerminalCommand('rm -r /', context)).lines).toEqual([
      "rm: cannot remove '/'",
    ]);
    expect((await executeTerminalCommand('pwd', context)).lines).toEqual(['/home/omganesh']);
  });

  it('reveals hidden entries only when requested', async () => {
    expect((await executeTerminalCommand('ls', context)).lines[0]).not.toContain('.config');
    expect((await executeTerminalCommand('ls -a', context)).lines[0]).toContain('.config');
  });
});

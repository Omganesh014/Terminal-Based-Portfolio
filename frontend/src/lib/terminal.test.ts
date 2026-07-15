import { beforeEach, describe, expect, it } from 'vitest';
import { executeTerminalCommand } from './terminal';
import { useFileSystemStore } from '../stores/filesystemStore';

const context = { userName: 'omganesh', hostName: 'om', cwd: '/home/omganesh' };

describe('executeTerminalCommand', () => {
  beforeEach(() => useFileSystemStore.getState().resetFileSystem());

  it('lists entries from the store-backed virtual filesystem', () => {
    expect(executeTerminalCommand('ls', context).lines).toEqual([
      'Projects  Experience  Education  Skills  Certificates  Achievements  Contact  README.md',
    ]);
  });

  it('changes directories using relative paths', () => {
    expect(executeTerminalCommand('cd Projects', context).cwd).toBe('/home/omganesh/Projects');
  });

  it('resolves portfolio paths without requiring exact capitalization', () => {
    expect(executeTerminalCommand('ls projects', context).lines).toEqual([
      'spendday.md  study-buddy.md  truthbridge-janavaani.md  road-damage-detection.md  daa-final-lab.md  omos-terminal-portfolio.md  kle-connect.md  wids-2026-wildfire-prediction.md  digital-memory-capsule.md',
    ]);
  });

  it('includes SpendDay in the project index with its full portfolio entry', () => {
    expect(executeTerminalCommand('ls Projects', context).lines).toEqual([
      'spendday.md  study-buddy.md  truthbridge-janavaani.md  road-damage-detection.md  daa-final-lab.md  omos-terminal-portfolio.md  kle-connect.md  wids-2026-wildfire-prediction.md  digital-memory-capsule.md',
    ]);
    expect(executeTerminalCommand('cat Projects/spendday.md', context).lines).toContain('# SpendDay');
  });

  it('renders the tree from the store-backed virtual filesystem', () => {
    expect(executeTerminalCommand('tree', context).lines).toContain('├── Projects');
  });

  it('returns an error for an unknown command', () => {
    expect(executeTerminalCommand('unknown', context).lines).toEqual(['unknown: command not found']);
  });

  it('preserves quoted arguments as a single token', () => {
    expect(executeTerminalCommand('echo "hello portfolio"', context).lines).toEqual(['hello portfolio']);
  });

  it('reports an unclosed quote instead of executing partial input', () => {
    expect(executeTerminalCommand('echo "unfinished', context).lines).toEqual([
      'shell: unterminated quoted string',
    ]);
  });

  it('pipes output into a filter command', () => {
    expect(executeTerminalCommand('cat Skills/skills.md | grep TypeScript', context).lines).toEqual([
      'Java · C++ · C · HTML5 · React.js · Node.js · Express.js · TypeScript · Web Development · Full-Stack Development',
    ]);
  });

  it('writes and appends output through redirection', () => {
    executeTerminalCommand('echo first > notes.txt', context);
    executeTerminalCommand('echo second >> notes.txt', context);

    expect(executeTerminalCommand('cat notes.txt', context).lines).toEqual(['first', 'second']);
  });

  it('continues a command chain after redirection', () => {
    expect(executeTerminalCommand('echo hello > greeting.txt; cat greeting.txt', context).lines).toEqual(['hello']);
  });

  it('creates and removes filesystem entries', () => {
    expect(executeTerminalCommand('mkdir sandbox', context).lines).toEqual([]);
    expect(executeTerminalCommand('touch sandbox/note.txt', context).lines).toEqual([]);
    expect(executeTerminalCommand('rm -r sandbox', context).lines).toEqual([]);
    expect(executeTerminalCommand('ls sandbox', context).lines).toEqual([
      "ls: cannot access 'sandbox': No such directory",
    ]);
  });

  it('does not allow removal of the filesystem root', () => {
    expect(executeTerminalCommand('rm -r /', context).lines).toEqual([
      "rm: cannot remove '/'",
    ]);
    expect(executeTerminalCommand('pwd', context).lines).toEqual(['/home/omganesh']);
  });

  it('reveals hidden entries only when requested', () => {
    expect(executeTerminalCommand('ls', context).lines[0]).not.toContain('.config');
    expect(executeTerminalCommand('ls -a', context).lines[0]).toContain('.config');
  });
});

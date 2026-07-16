import { beforeEach, describe, expect, it } from 'vitest';
import { useFileSystemStore } from './filesystemStore';

describe('filesystemStore', () => {
  beforeEach(() => {
    useFileSystemStore.getState().resetFileSystem();
  });

  it('has a root directory', () => {
    expect(useFileSystemStore.getState().directoryExists('/')).toBe(true);
  });

  it('lists home directory', () => {
    const entries = useFileSystemStore.getState().listDirectory('/home');
    expect(entries).toContain('omganesh');
  });

  it('creates a file', () => {
    const ok = useFileSystemStore.getState().writeFile('/home/omganesh/test.txt', ['hello']);
    expect(ok).toBe(true);
    expect(useFileSystemStore.getState().fileExists('/home/omganesh/test.txt')).toBe(true);
  });

  it('reads a file', () => {
    useFileSystemStore.getState().writeFile('/home/omganesh/hello.md', ['line1', 'line2']);
    const contents = useFileSystemStore.getState().readFile('/home/omganesh/hello.md');
    expect(contents).toEqual(['line1', 'line2']);
  });

  it('appends to a file', () => {
    useFileSystemStore.getState().writeFile('/home/omganesh/log.txt', ['first']);
    useFileSystemStore.getState().writeFile('/home/omganesh/log.txt', ['second'], true);
    expect(useFileSystemStore.getState().readFile('/home/omganesh/log.txt')).toEqual(['first', 'second']);
  });

  it('creates a directory', () => {
    const ok = useFileSystemStore.getState().makeDirectory('/home/omganesh/newdir');
    expect(ok).toBe(true);
    expect(useFileSystemStore.getState().directoryExists('/home/omganesh/newdir')).toBe(true);
  });

  it('removes a file', () => {
    useFileSystemStore.getState().writeFile('/home/omganesh/tmp.txt', ['data']);
    useFileSystemStore.getState().remove('/home/omganesh/tmp.txt');
    expect(useFileSystemStore.getState().fileExists('/home/omganesh/tmp.txt')).toBe(false);
  });

  it('protects root from removal', () => {
    expect(useFileSystemStore.getState().remove('/', true)).toBe(false);
  });

  it('resets filesystem to defaults', () => {
    useFileSystemStore.getState().writeFile('/home/omganesh/foo.txt', ['bar']);
    useFileSystemStore.getState().resetFileSystem();
    expect(useFileSystemStore.getState().fileExists('/home/omganesh/foo.txt')).toBe(false);
  });
});

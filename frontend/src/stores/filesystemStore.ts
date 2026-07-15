import { create } from 'zustand';
import { baseName, defaultFileSystem, normalizePath, parentPath, type VirtualFileSystem } from '../lib/filesystem';

type FileSystemState = {
  fileSystem: VirtualFileSystem;
  listDirectory: (pathname: string, includeHidden?: boolean) => string[] | null;
  readFile: (pathname: string) => string[] | null;
  directoryExists: (pathname: string) => boolean;
  fileExists: (pathname: string) => boolean;
  writeFile: (pathname: string, contents: string[], append?: boolean) => boolean;
  makeDirectory: (pathname: string) => boolean;
  remove: (pathname: string, recursive?: boolean) => boolean;
  resetFileSystem: () => void;
};

const cloneFileSystem = (): VirtualFileSystem => ({ directories: structuredClone(defaultFileSystem.directories), files: structuredClone(defaultFileSystem.files) });

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  fileSystem: cloneFileSystem(),
  listDirectory: (pathname, includeHidden = false) => {
    const entries = get().fileSystem.directories[normalizePath(pathname)];
    return entries ? entries.filter((entry) => includeHidden || !entry.startsWith('.')) : null;
  },
  readFile: (pathname) => get().fileSystem.files[normalizePath(pathname)] ?? null,
  directoryExists: (pathname) => Boolean(get().fileSystem.directories[normalizePath(pathname)]),
  fileExists: (pathname) => Boolean(get().fileSystem.files[normalizePath(pathname)]),
  writeFile: (pathname, contents, append = false) => {
    const target = normalizePath(pathname); const parent = parentPath(target); const name = baseName(target);
    if (!name || !get().directoryExists(parent)) return false;
    set((state) => ({ fileSystem: {
      directories: { ...state.fileSystem.directories, [parent]: state.fileSystem.directories[parent].includes(name) ? state.fileSystem.directories[parent] : [...state.fileSystem.directories[parent], name] },
      files: { ...state.fileSystem.files, [target]: append && state.fileSystem.files[target] ? [...state.fileSystem.files[target], ...contents] : contents },
    }})); return true;
  },
  makeDirectory: (pathname) => {
    const target = normalizePath(pathname); const parent = parentPath(target); const name = baseName(target);
    if (!name || get().directoryExists(target) || !get().directoryExists(parent)) return false;
    set((state) => ({ fileSystem: { ...state.fileSystem, directories: { ...state.fileSystem.directories, [target]: [], [parent]: [...state.fileSystem.directories[parent], name] } } })); return true;
  },
  remove: (pathname, recursive = false) => {
    const target = normalizePath(pathname); const fs = get().fileSystem; const isDirectory = Boolean(fs.directories[target]);
    if (target === '/' || (!isDirectory && !fs.files[target]) || (isDirectory && fs.directories[target].length && !recursive)) return false;
    const descendants = (path: string) => [path, ...Object.keys(fs.directories).filter((key) => key.startsWith(`${path}/`)), ...Object.keys(fs.files).filter((key) => key.startsWith(`${path}/`))];
    const removed = new Set(isDirectory ? descendants(target) : [target]); const parent = parentPath(target); const name = baseName(target);
    set({ fileSystem: { directories: Object.fromEntries(Object.entries(fs.directories).filter(([key]) => !removed.has(key)).map(([key, value]) => [key, key === parent ? value.filter((entry) => entry !== name) : value])), files: Object.fromEntries(Object.entries(fs.files).filter(([key]) => !removed.has(key))) } }); return true;
  },
  resetFileSystem: () => set({ fileSystem: cloneFileSystem() }),
}));

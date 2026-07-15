import { useEffect, useMemo, useRef, useState } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from '@xterm/xterm';
import { executeTerminalCommand, formatPrompt } from '../lib/terminal';
import { useOsStore } from '../stores/osStore';
import { useTerminalStore } from '../stores/terminalStore';
import { useThemeStore } from '../stores/themeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { playSound } from '../lib/sound';

const commandPalette = [
  { command: 'help', label: 'Show available commands' },
  { command: 'about', label: 'About OM' },
  { command: 'architecture-view', label: 'Explain the architecture' },
  { command: 'ls', label: 'List this directory' },
  { command: 'ls projects', label: 'Browse projects' },
  { command: 'cat resume.md', label: 'Read resume' },
  { command: 'cat skills.md', label: 'Read skills' },
  { command: 'tree', label: 'Show portfolio tree' },
  { command: 'clear', label: 'Clear terminal' },
];

const terminalThemes = {
  midnight: {
    background: '#07090d',
    foreground: '#e6edf7',
    cursor: '#7ee787',
    selectionBackground: '#1e3a2b',
    blue: '#8bb6ff',
    brightBlue: '#c5d8ff',
  },
  ember: {
    background: '#120b0a',
    foreground: '#fff1ea',
    cursor: '#ffb18a',
    selectionBackground: '#4a241a',
    blue: '#ffb18a',
    brightBlue: '#ffd6c2',
  },
  aurora: {
    background: '#051016',
    foreground: '#eafcff',
    cursor: '#8fdcff',
    selectionBackground: '#153544',
    blue: '#8fdcff',
    brightBlue: '#d7f6ff',
  },
  neon: {
    background: '#0a0514',
    foreground: '#e8dff5',
    cursor: '#ff6b9d',
    selectionBackground: '#2a1548',
    blue: '#00f0ff',
    brightBlue: '#7fffff',
  },
} as const;

type TerminalScreenProps = {
  onExit: () => void;
  onExitFullscreen: () => void;
};

export function TerminalScreen({ onExit, onExitFullscreen }: TerminalScreenProps) {
  const terminalHostRef = useRef<HTMLDivElement | null>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const selectedCommandIndexRef = useRef(0);
  selectedCommandIndexRef.current = selectedCommandIndex;

  const userName = useOsStore((state) => state.userName);
  const hostName = useOsStore((state) => state.hostName);
  const setCwd = useTerminalStore((state) => state.setCwd);
  const addHistoryEntry = useTerminalStore((state) => state.addHistoryEntry);
  const moveHistoryIndex = useTerminalStore((state) => state.moveHistoryIndex);
  const resetHistoryIndex = useTerminalStore((state) => state.resetHistoryIndex);
  const cwd = useTerminalStore((state) => state.cwd);
  const theme = useThemeStore((state) => state.theme);
  const commandPaletteEnabled = useSettingsStore((state) => state.commandPaletteEnabled);

  const prompt = useMemo(
    () => formatPrompt({ userName, hostName, cwd }),
    [cwd, hostName, userName],
  );

  useEffect(() => {
    if (!terminalHostRef.current || terminalInstanceRef.current) {
      return;
    }

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: 'Cascadia Mono, SFMono-Regular, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.35,
      theme: terminalThemes[useThemeStore.getState().theme],
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());
    terminal.open(terminalHostRef.current);
    fitAddon.fit();

    terminal.writeln('');
    terminal.writeln('   ____        ___  ____');
    terminal.writeln('  / __ \\____  /  |/  / |/ /');
    terminal.writeln(' / / / / __ \\/ /|_/ /|   / ');
    terminal.writeln('/ /_/ / / / / /  / / /   |  ');
    terminal.writeln('\\____/_/ /_/_/  /_/_/|_/   ');
    terminal.writeln('');
    terminal.writeln(' OM portfolio terminal | session ready');
    terminal.writeln(' Use the command menu below, or type a command directly.');

    const writePrompt = () => {
      terminal.write(`\r\n${formatPrompt({ userName, hostName, cwd: useTerminalStore.getState().cwd })}`);
    };

    const redrawInputLine = (nextValue: string) => {
      terminal.write('\r');
      terminal.write('\x1b[2K');
      terminal.write(formatPrompt({ userName, hostName, cwd: useTerminalStore.getState().cwd }));
      terminal.write(nextValue);
    };

    const executeCurrentLine = (selectedCommand: string) => {
      const typedLine = inputBufferRef.current.trim();
      const currentLine = typedLine || (useSettingsStore.getState().commandPaletteEnabled ? selectedCommand : '');

      if (!currentLine) {
        terminal.write('\r\n');
        writePrompt();
        return;
      }

      if (!typedLine) {
        terminal.write(currentLine);
      }

      addHistoryEntry(currentLine);
      resetHistoryIndex();
      const result = executeTerminalCommand(currentLine, {
        userName,
        hostName,
        cwd: useTerminalStore.getState().cwd,
      });

      if (result.clear) {
        terminal.clear();
      }

      if (typeof result.cwd === 'string') {
        setCwd(result.cwd);
      }

      for (const line of result.lines) {
        terminal.writeln(`\r\n${line}`);
      }

      inputBufferRef.current = '';
      writePrompt();
    };

    terminal.onData((data) => {
      if (data === '\r') {
        executeCurrentLine(commandPalette[selectedCommandIndexRef.current].command);
        return;
      }

      if (data === '\u007f') {
        if (inputBufferRef.current.length === 0) {
          return;
        }
        inputBufferRef.current = inputBufferRef.current.slice(0, -1);
        terminal.write('\b \b');
        return;
      }

      if (data === '\u0003') {
        terminal.write('^C');
        inputBufferRef.current = '';
        writePrompt();
        return;
      }

      if (data === '\u001b') {
        if (!inputBufferRef.current) {
          onExit();
        }
        return;
      }

      if (data === '\u001b[A' || data === '\u001b[B') {
        if (inputBufferRef.current.length === 0) {
          playSound('hover');
          const direction = data === '\u001b[A' ? -1 : 1;
          setSelectedCommandIndex((index) =>
            (index + direction + commandPalette.length) % commandPalette.length,
          );
          return;
        }

        const historyEntry = moveHistoryIndex(data === '\u001b[A' ? -1 : 1);
        const value = historyEntry ?? '';
        inputBufferRef.current = value;
        redrawInputLine(value);
        return;
      }

      if (/^[\x20-\x7e]$/.test(data)) {
        inputBufferRef.current += data;
        terminal.write(data);
      }
    });

    const resizeObserver = new ResizeObserver(() => fitAddon.fit());
    resizeObserver.observe(terminalHostRef.current);
    const handleWindowResize = () => fitAddon.fit();
    window.addEventListener('resize', handleWindowResize);

    terminal.focus();
    terminalInstanceRef.current = terminal;
    fitAddonRef.current = fitAddon;
    writePrompt();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      terminal.dispose();
      terminalInstanceRef.current = null;
      fitAddonRef.current = null;
    };
  }, [addHistoryEntry, hostName, moveHistoryIndex, onExit, resetHistoryIndex, setCwd, userName]);

  useEffect(() => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.options.theme = terminalThemes[theme];
    }
    fitAddonRef.current?.fit();
  }, [theme]);

  return (
    <main className="terminal-workspace" data-theme={theme} aria-label="OM terminal workspace">
      <section className="terminal-window">
        <header className="terminal-header">
          <span className="terminal-channel">tty1 · interactive shell</span>
          <strong>OM / TERMINAL</strong>
          <span className="terminal-actions"><button type="button" onClick={onExitFullscreen}>[ exit full screen ]</button><button type="button" onClick={onExit} aria-label="Exit terminal">[exit]</button></span>
        </header>
        <div className="terminal-host" ref={terminalHostRef} />
        {commandPaletteEnabled && <footer className="command-palette" aria-label="Terminal command selection">
          <span className="palette-label">COMMANDS</span>
          <div className="command-options">
            {commandPalette.map((item, index) => (
              <button
                key={item.command}
                type="button"
                className={index === selectedCommandIndex ? 'is-active' : ''}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => playSound('hover')}
                onClick={() => setSelectedCommandIndex(index)}
              >
                <code>{item.command}</code>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <p>Arrow keys select a command. Enter runs it. Esc returns to desktop.</p>
          <p className="current-prompt">{prompt}</p>
        </footer>}
      </section>
    </main>
  );
}

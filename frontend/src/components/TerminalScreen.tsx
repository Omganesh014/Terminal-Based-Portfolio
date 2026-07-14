import { useEffect, useMemo, useRef, useState } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from '@xterm/xterm';
import { executeTerminalCommand, formatPrompt } from '../lib/terminal';
import { useOsStore } from '../stores/osStore';
import { useTerminalStore } from '../stores/terminalStore';
import { useThemeStore } from '../stores/themeStore';

const commandPalette = [
  { command: 'help', label: 'Show available commands' },
  { command: 'about', label: 'About OmOS' },
  { command: 'ls', label: 'List this directory' },
  { command: 'ls projects', label: 'Browse projects' },
  { command: 'cat resume.md', label: 'Read resume' },
  { command: 'cat skills.md', label: 'Read skills' },
  { command: 'tree', label: 'Show portfolio tree' },
  { command: 'clear', label: 'Clear terminal' },
];

type TerminalScreenProps = {
  onExit: () => void;
};

export function TerminalScreen({ onExit }: TerminalScreenProps) {
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
      theme: {
        background: '#07090d',
        foreground: '#e6edf7',
        cursor: '#7ee787',
        selectionBackground: '#1e3a2b',
        blue: '#8bb6ff',
        brightBlue: '#c5d8ff',
      },
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
    terminal.writeln(' OmOS portfolio terminal | session ready');
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
      const currentLine = typedLine || selectedCommand;

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
    fitAddonRef.current?.fit();
  }, [theme]);

  return (
    <main className="terminal-workspace" aria-label="OmOS terminal workspace">
      <section className="terminal-window">
        <header className="terminal-header">
          <div className="window-controls" aria-hidden="true"><span /><span /><span /></div>
          <strong>Terminal - omos@portfolio</strong>
          <button type="button" onClick={onExit} aria-label="Close terminal">x</button>
        </header>
        <div className="terminal-host" ref={terminalHostRef} />
        <footer className="command-palette" aria-label="Terminal command selection">
          <span className="palette-label">COMMANDS</span>
          <div className="command-options">
            {commandPalette.map((item, index) => (
              <button
                key={item.command}
                type="button"
                className={index === selectedCommandIndex ? 'is-active' : ''}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setSelectedCommandIndex(index)}
              >
                <code>{item.command}</code>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <p>Arrow keys select a command. Enter runs it. Esc returns to desktop.</p>
          <p className="current-prompt">{prompt}</p>
        </footer>
      </section>
    </main>
  );
}

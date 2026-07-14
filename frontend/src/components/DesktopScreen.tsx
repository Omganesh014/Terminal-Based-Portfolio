import { useCallback, useEffect, useState } from 'react';

const desktopItems = [
  { name: 'My Profile', type: 'PROFILE', content: 'Om Ganesh\nFull Stack Developer\nInteractive interfaces, systems thinking, and product engineering.' },
  { name: 'Resume', type: 'RESUME', content: 'Open the terminal and run: cat resume.md' },
  { name: 'Projects', type: 'WORK', content: 'Open the terminal and run: ls projects' },
  { name: 'Skills', type: 'SKILL', content: 'React, TypeScript, Zustand, terminal UX, API integration.' },
  { name: 'Terminal', type: 'TERM', content: '' },
];

type DesktopScreenProps = {
  onOpenTerminal: () => void;
};

export function DesktopScreen({ onOpenTerminal }: DesktopScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openItem, setOpenItem] = useState<number | null>(null);

  const openSelected = useCallback((index: number) => {
    if (desktopItems[index].name === 'Terminal') {
      onOpenTerminal();
      return;
    }
    setOpenItem(index);
  }, [onOpenTerminal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (openItem !== null) {
        if (event.key === 'Escape') {
          setOpenItem(null);
        }
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((index) => (index + 1) % desktopItems.length);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((index) => (index - 1 + desktopItems.length) % desktopItems.length);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        openSelected(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openItem, openSelected, selectedIndex]);

  return (
    <main className="desktop-screen" aria-label="OmOS desktop">
      <header className="desktop-bar">
        <strong>OmOS</strong>
        <span>portfolio@omos</span>
        <span>{new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format()}</span>
      </header>
      <section className="desktop-icons" aria-label="Portfolio applications">
        {desktopItems.map((item, index) => (
          <button
            className={`desktop-icon ${selectedIndex === index ? 'is-selected' : ''}`}
            key={item.name}
            type="button"
            onFocus={() => setSelectedIndex(index)}
            onClick={() => openSelected(index)}
            onDoubleClick={() => openSelected(index)}
          >
            <span className="desktop-icon-glyph">{item.type}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </section>
      <p className="desktop-keyboard-hint">Arrow keys select. Enter opens. Escape closes.</p>
      {openItem !== null && (
        <section className="desktop-window" role="dialog" aria-modal="true" aria-label={desktopItems[openItem].name}>
          <header>
            <strong>{desktopItems[openItem].name}</strong>
            <button type="button" aria-label="Close window" onClick={() => setOpenItem(null)}>x</button>
          </header>
          <p>{desktopItems[openItem].content}</p>
        </section>
      )}
    </main>
  );
}

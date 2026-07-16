import { useEffect, useState } from 'react';
import { OmGlyph } from './OmGlyph';
import { useThemeStore } from '../stores/themeStore';
import { playSound } from '../lib/sound';

type WelcomeScreenProps = {
  onContinue: () => void;
};

const LINES = [
  '',
  '  Welcome to OM\'s portfolio',
  '',
  '  ~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '',
  '  Interactive terminal-based developer showcase.',
  '  Navigate projects, skills, and experience',
  '  through a command-line interface.',
  '',
  '  Loading workspace...',
];

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const theme = useThemeStore((state) => state.theme);
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);
  const [showBlink, setShowBlink] = useState(false);

  useEffect(() => {
    if (visible >= LINES.length) {
      playSound('startup');
      const timer = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisible((v) => v + 1), 80);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!done) return;
    const blink = setInterval(() => setShowBlink((b) => !b), 500);
    return () => clearInterval(blink);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        playSound('success');
        onContinue();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, onContinue]);

  return (
    <main className="welcome-screen" data-theme={theme}>
      <section className="welcome-console" aria-label="OM welcome">
        <div className="welcome-body">
          <OmGlyph className="welcome-logo" />
          {LINES.slice(0, visible + 1).map((line, i) => (
            <p key={i} className="welcome-line" style={{ opacity: 1 - (LINES.length - i) * 0.04 }}>
              {line || '\u00A0'}
            </p>
          ))}
          {done && (
            <p className="welcome-prompt">
              <span className="welcome-blink">{showBlink ? '█' : ' '}</span>
              &nbsp;Press <kbd>Enter</kbd> to continue
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

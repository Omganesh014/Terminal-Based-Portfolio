import { useEffect, useRef } from 'react';
import { OmGlyph } from './OmGlyph';
import { useThemeStore } from '../stores/themeStore';
import { playSound } from '../lib/sound';

type LoginScreenProps = {
  onUnlock: () => void;
  onRestart: () => void;
  onShutdown: () => void;
};

export function LoginScreen({ onUnlock, onRestart, onShutdown }: LoginScreenProps) {
  const theme = useThemeStore((state) => state.theme);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      playSound('success');
      onUnlock();
    };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('keydown', handler, { once: true });
    el.addEventListener('click', handler, { once: true });
    el.focus();
    return () => {
      el.removeEventListener('keydown', handler);
      el.removeEventListener('click', handler);
    };
  }, [onUnlock]);

  return (
    <main className="login-screen terminal-login" data-theme={theme} ref={containerRef} tabIndex={0}>
      <section className="login-console" aria-label="OM login console">
        <header className="login-terminal-bar"><span>OM / ACCESS GATE</span><span>tty0</span></header>
        <div className="login-terminal-body">
        <OmGlyph className="login-logo" />
        <p className="login-subtitle">Omganesh&apos;s interactive portfolio · secure shell</p>
        <p className="login-hint">Press any key or click to enter the workspace.</p>
        <div className="login-actions">
          <button className="restart-button" type="button" onMouseEnter={() => playSound('hover')} onClick={(e) => { e.stopPropagation(); playSound('startup'); onRestart(); }}>[ reboot ]</button>
          <button className="shutdown-button" type="button" onMouseEnter={() => playSound('hover')} onClick={(e) => { e.stopPropagation(); playSound('shutdown'); onShutdown(); }}>[ shutdown ]</button>
        </div>
        </div>
      </section>
    </main>
  );
}

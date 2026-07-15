import { FormEvent, useEffect, useRef, useState } from 'react';
import { OmGlyph } from './OmGlyph';

type LoginScreenProps = {
  onUnlock: () => void;
  onRestart: () => void;
  onShutdown: () => void;
};

export function LoginScreen({ onUnlock, onRestart, onShutdown }: LoginScreenProps) {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  const unlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUnlock();
  };

  return (
    <main className="login-screen terminal-login">
      <section className="login-console" aria-label="OM login console">
        <header className="login-terminal-bar"><span>OM / ACCESS GATE</span><span>tty0</span></header>
        <div className="login-terminal-body">
        <OmGlyph className="login-logo" />
        <p className="login-subtitle">Omganesh&apos;s interactive portfolio · secure shell</p>
        <form onSubmit={unlock}>
          <label htmlFor="password">omganesh@om:~$ unlock --session</label>
          <input
            ref={passwordRef}
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <p className="login-hint">Enter any value to initialize the workspace.</p>
        </form>
        <div className="login-actions">
          <button className="restart-button" type="button" onClick={onRestart}>[ reboot ]</button>
          <button className="shutdown-button" type="button" onClick={onShutdown}>[ shutdown ]</button>
        </div>
        </div>
      </section>
    </main>
  );
}

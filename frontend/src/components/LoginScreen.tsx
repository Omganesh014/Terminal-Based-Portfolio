import { FormEvent, useEffect, useRef, useState } from 'react';

type LoginScreenProps = {
  onUnlock: () => void;
  onRestart: () => void;
};

export function LoginScreen({ onUnlock, onRestart }: LoginScreenProps) {
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
    <main className="login-screen">
      <section className="login-console" aria-label="OmOS login">
        <p className="login-logo">OmOS</p>
        <p className="login-subtitle">Om Ganesh&apos;s interactive portfolio</p>
        <form onSubmit={unlock}>
          <label htmlFor="password">omos@portfolio password:</label>
          <input
            ref={passwordRef}
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <p className="login-hint">Press Enter to unlock</p>
        </form>
        <button className="restart-button" type="button" onClick={onRestart}>
          Restart system
        </button>
      </section>
    </main>
  );
}

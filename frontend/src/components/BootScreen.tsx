import { useEffect, useState } from 'react';

const bootLines = [
  'OmOS firmware v1.0.0',
  'Loading portfolio kernel...                         [ OK ]',
  'Mounting /home/omos...                               [ OK ]',
  'Starting interactive shell services...               [ OK ]',
  'Launching OmOS desktop...',
];

type BootScreenProps = {
  onSkip: () => void;
};

export function BootScreen({ onSkip }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleLines((count) => Math.min(count + 1, bootLines.length));
    }, 620);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="boot-screen" aria-label="OmOS booting">
      <div className="boot-noise" />
      <section className="boot-console">
        <p className="boot-brand">OmOS / portfolio operating system</p>
        <div className="boot-lines" aria-live="polite">
          {bootLines.slice(0, visibleLines).map((line) => (
            <p key={line}>{line}</p>
          ))}
          <span className="terminal-caret" />
        </div>
        <button className="boot-skip" type="button" onClick={onSkip}>
          Skip boot
        </button>
      </section>
    </main>
  );
}

import { useEffect, useState } from 'react';

type ShutdownScreenProps = { onExit: () => void };

const shutdownStages = [
  '[ok] terminating user processes',
  '[ok] flushing virtual filesystem buffers',
  '[ok] filesystem unmounted',
  '[ok] session closed',
  '[ok] display output halted',
];

export function ShutdownScreen({ onExit }: ShutdownScreenProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage < shutdownStages.length - 1) {
      const timer = window.setTimeout(() => setStage((current) => current + 1), 380);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(onExit, 850);
    return () => window.clearTimeout(timer);
  }, [onExit, stage]);

  return (
    <main className="shutdown-screen" aria-label="OM system halted">
      <section className="shutdown-console">
        <p><span>root@om</span>:<b>~</b>$ shutdown --now</p>
        {shutdownStages.slice(0, stage + 1).map((message) => <p className="shutdown-status" key={message}>{message}</p>)}
        <p className="shutdown-status">{stage === shutdownStages.length - 1 ? 'powering off…' : 'shutdown in progress…'}</p>
      </section>
    </main>
  );
}

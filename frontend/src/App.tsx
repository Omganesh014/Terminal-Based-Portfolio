import { useEffect, useState } from 'react';
import { BootScreen } from './components/BootScreen';
import { DesktopScreen } from './components/DesktopScreen';
import { LoginScreen } from './components/LoginScreen';
import { TerminalScreen } from './components/TerminalScreen';
import { useOsStore } from './stores/osStore';

export function App() {
  const stage = useOsStore((state) => state.stage);
  const setStage = useOsStore((state) => state.setStage);
  const markBootComplete = useOsStore((state) => state.markBootComplete);
  const [bootKey, setBootKey] = useState(0);

  useEffect(() => {
    if (stage !== 'boot') {
      return;
    }

    const timer = window.setTimeout(markBootComplete, 4100);
    return () => window.clearTimeout(timer);
  }, [bootKey, markBootComplete, stage]);

  if (stage === 'boot') {
    return <BootScreen onSkip={markBootComplete} key={bootKey} />;
  }

  if (stage === 'login') {
    return <LoginScreen onUnlock={() => setStage('desktop')} onRestart={() => {
      setBootKey((key) => key + 1);
      setStage('boot');
    }} />;
  }

  if (stage === 'terminal') {
    return <TerminalScreen onExit={() => setStage('desktop')} />;
  }

  return <DesktopScreen onOpenTerminal={() => setStage('terminal')} />;
}

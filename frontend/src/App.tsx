import { lazy, Suspense, useEffect, useState } from 'react';
import { BootScreen } from './components/BootScreen';
import { DesktopScreen } from './components/DesktopScreen';
import { LoginScreen } from './components/LoginScreen';
import { ShutdownScreen } from './components/ShutdownScreen';
import { Analytics } from './components/Analytics';
import { useOsStore } from './stores/osStore';
import { useFileSystemStore } from './stores/filesystemStore';
import { useTerminalStore } from './stores/terminalStore';
import { useThemeStore } from './stores/themeStore';
import { initSounds } from './lib/sound';

const TerminalScreen = lazy(() => import('./components/TerminalScreen').then((module) => ({ default: module.TerminalScreen })));

export function App() {
  const stage = useOsStore((state) => state.stage);
  const setStage = useOsStore((state) => state.setStage);
  const markBootComplete = useOsStore((state) => state.markBootComplete);
  const resetFileSystem = useFileSystemStore((state) => state.resetFileSystem);
  const resetTerminalSession = useTerminalStore((state) => state.resetSession);
  const [bootKey, setBootKey] = useState(0);

  const theme = useThemeStore((state) => state.theme);
  useEffect(() => { initSounds(); }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  if (stage === 'boot') {
    return <><Analytics /><BootScreen onComplete={() => { markBootComplete(); }} key={bootKey} /></>;
  }

  if (stage === 'login') {
    return <><Analytics /><LoginScreen onUnlock={() => {
      if (document.documentElement.requestFullscreen) {
        void document.documentElement.requestFullscreen().catch(() => undefined);
      }
      setStage('desktop');
    }} onRestart={() => {
      setBootKey((key) => key + 1);
      setStage('boot');
    }} onShutdown={() => setStage('shutdown')} /></>;
  }

  if (stage === 'shutdown') {
    return <><Analytics /><ShutdownScreen onExit={() => {
      if (document.fullscreenElement) void document.exitFullscreen();
      window.close();
      window.setTimeout(() => window.location.replace('about:blank'), 100);
    }} /></>;
  }

  if (stage === 'terminal') {
    return <><Analytics /><Suspense fallback={<main className="terminal-loading" aria-live="polite">loading terminal runtime…</main>}><TerminalScreen onExit={() => setStage('desktop')} onExitFullscreen={() => { if (document.fullscreenElement) void document.exitFullscreen(); }} /></Suspense></>;
  }

  return <><Analytics /><DesktopScreen
    onOpenTerminal={() => setStage('terminal')}
    onExitFullscreen={() => { if (document.fullscreenElement) void document.exitFullscreen(); }}
    onLogout={() => setStage('login')}
    onSignOut={() => {
      resetFileSystem();
      resetTerminalSession();
      setStage('login');
    }}
    onShutdown={() => setStage('shutdown')}
  /></>;
}

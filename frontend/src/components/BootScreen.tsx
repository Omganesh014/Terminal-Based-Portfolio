import { useEffect, useState } from 'react';
import { OmGlyph } from './OmGlyph';
import { useThemeStore } from '../stores/themeStore';
import { initSounds, playSound } from '../lib/sound';

const bootStages = [
  { command: 'power.signal --stabilize', label: 'power rails stable · system clock enabled' },
  { command: 'uefi.post --verify', label: 'firmware POST passed · chipset initialized' },
  { command: 'pci.enumerate --bus=all', label: 'CPU, memory controller, graphics, and storage discovered' },
  { command: 'mem.test --quick', label: 'memory integrity verified · address space mapped' },
  { command: 'bootloader.load --target=om', label: 'signed bootloader verified · boot target selected' },
  { command: 'kernel.decompress --profile=omganesh', label: 'kernel image expanded · scheduler online' },
  { command: 'initramfs.mount --rootfs', label: 'early userspace mounted · encrypted volume unlocked' },
  { command: 'driver.bind --essential', label: 'display, input, network, and storage drivers attached' },
  { command: 'service.start --target=workspace', label: 'system services online · virtual filesystem mounted' },
  { command: 'display.manager --launch', label: 'display server ready · graphics session initialized' },
  { command: 'session.handoff --user=omganesh', label: 'access gate authorized · preparing user session' },
];

type BootScreenProps = { onComplete: () => void };

export function BootScreen({ onComplete }: BootScreenProps) {
  const theme = useThemeStore((state) => state.theme);
  const [stage, setStage] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [isHandoff, setIsHandoff] = useState(false);

  useEffect(() => {
    let timeout: number | undefined;
    let currentStage = 0;
    const advance = () => {
      setStage(currentStage);
      playSound('keypress');
      if (currentStage < bootStages.length - 1) {
        currentStage += 1;
        timeout = window.setTimeout(advance, 500 + currentStage * 42);
        return;
      }
      timeout = window.setTimeout(() => {
        setIsHandoff(true);
        timeout = window.setTimeout(onComplete, 650);
      }, 900);
    };
    initSounds();
    playSound('startup');
    advance();
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  useEffect(() => {
    const interval = window.setInterval(() => setPulse((current) => (current + 1) % 100), 280);
    return () => window.clearInterval(interval);
  }, []);

  const progress = ((stage + 1) / bootStages.length) * 100;
  const visibleStart = Math.max(0, stage - 4);
  const visibleStages = bootStages.slice(visibleStart, stage + 1);

  return (
    <main className={`boot-screen terminal-boot${isHandoff ? ' is-handoff' : ''}`} data-theme={theme} aria-label="OM is booting">
      <div className="boot-grid" aria-hidden="true" />
      <div className="boot-data-rain" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <section className="boot-console">
        <header className="boot-terminal-bar">
          <span>OM / BOOT CONSOLE</span><span>tty0 · secure session</span>
        </header>
        <div className="boot-terminal-body">
          <p className="boot-prompt"><span>root@om</span>:<b>~</b>$ <em>boot --interactive</em></p>
          <OmGlyph className="boot-glyph" />
          <p className="boot-version">OM system 1.0.0 · portfolio runtime</p>
          <div className="boot-log" aria-live="polite">
            <div className="boot-sequence"><span>BOOT SEQUENCE</span><span>{String(stage + 1).padStart(2, '0')} / {String(bootStages.length).padStart(2, '0')}</span></div>
            {visibleStages.map((item, index) => {
              const actualIndex = visibleStart + index;
              return <p key={item.command} className={actualIndex === stage ? 'is-current' : ''}>
                <span className="boot-log-command">[{String(actualIndex + 1).padStart(2, '0')}] $ {item.command}</span>
                <span className="boot-log-result">{actualIndex < stage ? '[ok]' : item.label}</span>
              </p>
            })}
          </div>
          <div className="boot-diagnostics" aria-label="Live boot diagnostics">
            <div className="boot-radar" aria-hidden="true"><span /></div>
            <div className="boot-metrics">
              <p><span>CORE.CLOCK</span><b>{String(2.84 + pulse / 100).slice(0, 4)} GHz</b></p>
              <p><span>MEM.CHECK</span><b>{String(64 + ((pulse * 7) % 35)).padStart(3, '0')}%</b></p>
              <p><span>NET.LINK</span><b className="is-live">SYNC</b></p>
              <p><span>ENTROPY</span><b>{(0xA1F0 + pulse * 19).toString(16).toUpperCase()}</b></p>
            </div>
          </div>
          <div className="boot-signal" aria-label="System initialization progress">
            <div className="boot-signal-label"><span>SYS.INIT</span><span>{String(Math.round(progress)).padStart(3, '0')}%</span></div>
            <div className="boot-signal-track"><span style={{ width: `${progress}%` }} /></div>
            <div className="boot-signal-pulse" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <p className="boot-cursor-line"><span className="boot-handshake">{stage < bootStages.length - 1 ? 'establishing secure handoff' : isHandoff ? 'switching to access gate' : 'desktop handoff authenticated'}</span><span className="terminal-caret" /></p>
        </div>
        <button className="boot-skip" type="button" onMouseEnter={() => playSound('hover')} onClick={onComplete}>[ skip boot ]</button>
      </section>
    </main>
  );
}

import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({ bootAnimationEnabled: true, commandPaletteEnabled: true });
  });

  it('defaults to enabled', () => {
    const state = useSettingsStore.getState();
    expect(state.bootAnimationEnabled).toBe(true);
    expect(state.commandPaletteEnabled).toBe(true);
  });

  it('disables boot animation', () => {
    useSettingsStore.getState().setBootAnimationEnabled(false);
    expect(useSettingsStore.getState().bootAnimationEnabled).toBe(false);
  });

  it('disables command palette', () => {
    useSettingsStore.getState().setCommandPaletteEnabled(false);
    expect(useSettingsStore.getState().commandPaletteEnabled).toBe(false);
  });

  it('toggles settings independently', () => {
    useSettingsStore.getState().setBootAnimationEnabled(false);
    useSettingsStore.getState().setCommandPaletteEnabled(true);
    const state = useSettingsStore.getState();
    expect(state.bootAnimationEnabled).toBe(false);
    expect(state.commandPaletteEnabled).toBe(true);
  });
});

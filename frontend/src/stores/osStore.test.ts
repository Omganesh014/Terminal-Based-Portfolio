import { beforeEach, describe, expect, it } from 'vitest';
import { useOsStore } from './osStore';

describe('osStore', () => {
  beforeEach(() => {
    useOsStore.setState({ stage: 'boot', booted: false, userName: 'omganesh', hostName: 'om' });
  });

  it('starts in boot stage', () => {
    expect(useOsStore.getState().stage).toBe('boot');
  });

  it('marks boot complete and transitions to login', () => {
    useOsStore.getState().markBootComplete();
    const state = useOsStore.getState();
    expect(state.booted).toBe(true);
    expect(state.stage).toBe('login');
  });

  it('sets stage to desktop', () => {
    useOsStore.getState().setStage('desktop');
    expect(useOsStore.getState().stage).toBe('desktop');
  });

  it('sets stage to shutdown', () => {
    useOsStore.getState().setStage('shutdown');
    expect(useOsStore.getState().stage).toBe('shutdown');
  });

  it('sets stage to terminal', () => {
    useOsStore.getState().setStage('terminal');
    expect(useOsStore.getState().stage).toBe('terminal');
  });

  it('has default user info', () => {
    const state = useOsStore.getState();
    expect(state.userName).toBe('omganesh');
    expect(state.hostName).toBe('om');
  });
});

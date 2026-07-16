import { beforeEach, describe, expect, it } from 'vitest';
import { useWindowStore } from './windowStore';

describe('windowStore', () => {
  beforeEach(() => {
    useWindowStore.setState({ activeWindow: null });
  });

  it('starts with no active window', () => {
    expect(useWindowStore.getState().activeWindow).toBeNull();
  });

  it('opens a window', () => {
    useWindowStore.getState().openWindow('profile');
    expect(useWindowStore.getState().activeWindow).toBe('profile');
  });

  it('closes a window', () => {
    useWindowStore.getState().openWindow('projects');
    useWindowStore.getState().closeWindow();
    expect(useWindowStore.getState().activeWindow).toBeNull();
  });

  it('switches between windows', () => {
    useWindowStore.getState().openWindow('contact');
    useWindowStore.getState().openWindow('about');
    expect(useWindowStore.getState().activeWindow).toBe('about');
  });
});

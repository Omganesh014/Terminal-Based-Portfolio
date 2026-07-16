import { beforeEach, describe, expect, it } from 'vitest';
import { useThemeStore, getNextTheme, themeOrder } from './themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'aurora' });
  });

  it('defaults to aurora theme', () => {
    expect(useThemeStore.getState().theme).toBe('aurora');
  });

  it('sets theme to midnight', () => {
    useThemeStore.getState().setTheme('midnight');
    expect(useThemeStore.getState().theme).toBe('midnight');
  });

  it('sets theme to neon', () => {
    useThemeStore.getState().setTheme('neon');
    expect(useThemeStore.getState().theme).toBe('neon');
  });

  it('cycles theme forward', () => {
    useThemeStore.getState().setTheme('aurora');
    expect(getNextTheme('aurora')).toBe('neon');
    expect(getNextTheme('neon')).toBe('midnight');
    expect(getNextTheme('midnight')).toBe('ember');
    expect(getNextTheme('ember')).toBe('aurora');
  });

  it('has four themes in order', () => {
    expect(themeOrder).toEqual(['midnight', 'ember', 'aurora', 'neon']);
  });
});

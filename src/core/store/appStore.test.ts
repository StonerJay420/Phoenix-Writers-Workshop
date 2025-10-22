import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    const store = useAppStore.getState();
    store.setTheme('system');
    store.setLocale('en');
    store.setAiKillSwitch(false);
    localStorage.clear();
  });

  it('initializes with default values', () => {
    const state = useAppStore.getState();
    expect(state.theme).toBe('system');
    expect(state.locale).toBe('en');
    expect(state.aiKillSwitch).toBe(false);
  });

  it('updates theme', () => {
    const { setTheme } = useAppStore.getState();
    setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('updates locale', () => {
    const { setLocale } = useAppStore.getState();
    setLocale('es');
    expect(useAppStore.getState().locale).toBe('es');
  });

  it('toggles AI kill switch', () => {
    const { toggleAiKillSwitch } = useAppStore.getState();
    expect(useAppStore.getState().aiKillSwitch).toBe(false);
    toggleAiKillSwitch();
    expect(useAppStore.getState().aiKillSwitch).toBe(true);
    toggleAiKillSwitch();
    expect(useAppStore.getState().aiKillSwitch).toBe(false);
  });

  it('sets AI kill switch directly', () => {
    const { setAiKillSwitch } = useAppStore.getState();
    setAiKillSwitch(true);
    expect(useAppStore.getState().aiKillSwitch).toBe(true);
    setAiKillSwitch(false);
    expect(useAppStore.getState().aiKillSwitch).toBe(false);
  });

  it('persists theme to localStorage', () => {
    const { setTheme } = useAppStore.getState();
    setTheme('light');
    const stored = localStorage.getItem('phoenix-workshop-storage');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.theme).toBe('light');
    }
  });

  it('persists locale to localStorage', () => {
    const { setLocale } = useAppStore.getState();
    setLocale('fr');
    const stored = localStorage.getItem('phoenix-workshop-storage');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.locale).toBe('fr');
    }
  });

  it('persists aiKillSwitch to localStorage', () => {
    const { setAiKillSwitch } = useAppStore.getState();
    setAiKillSwitch(true);
    const stored = localStorage.getItem('phoenix-workshop-storage');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.aiKillSwitch).toBe(true);
    }
  });
});

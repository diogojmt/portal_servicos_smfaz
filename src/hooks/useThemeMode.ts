import { useState, useEffect } from 'react';

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export type ThemeMode = typeof THEME_MODES[keyof typeof THEME_MODES];

const STORAGE_KEY = 'portal-theme-mode';

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && Object.values(THEME_MODES).includes(saved as ThemeMode)) {
        return saved as ThemeMode;
      }
    } catch (error) {
      console.warn('Erro ao carregar tema do localStorage:', error);
    }
    return THEME_MODES.AUTO;
  });

  const setThemeModeAndSave = (mode: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.warn('Erro ao salvar tema no localStorage:', error);
      setThemeMode(mode);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeMode);
    } catch (error) {
      console.warn('Erro ao persistir tema:', error);
    }
  }, [themeMode]);

  return {
    themeMode,
    setThemeMode: setThemeModeAndSave,
    THEME_MODES,
  };
}

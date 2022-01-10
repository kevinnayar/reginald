import { useState } from 'react';

export type ThemeType = 'light' | 'dark';

const KEY = 'MARCONI_LAYOUT_UI:THEME';

export type UseThemeHook = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export function useTheme(): UseThemeHook {
  const storage: Storage = window.localStorage;
  const savedTheme: null | ThemeType = storage.getItem(KEY) as ThemeType;
  const fallbackTheme: ThemeType = 'light';
  const [theme, setTheme] = useState<ThemeType>(savedTheme || fallbackTheme);
  const classList: DOMTokenList = document.body.classList;
  const getInverseTheme = (t: ThemeType) => (t === 'light' ? 'dark' : 'light');

  if (!savedTheme) {
    storage.setItem(KEY, fallbackTheme);
  }

  const inverseTheme: ThemeType = getInverseTheme(theme);

  if (classList.contains(inverseTheme)) {
    classList.replace(inverseTheme, theme);
  }

  if (!classList.contains(theme)) {
    classList.add(theme);
  }

  const toggleTheme = () => {
    const newTheme: ThemeType = getInverseTheme(theme);
    document.body.classList.replace(theme, newTheme);
    setTheme(newTheme);
    window.localStorage.setItem(KEY, newTheme);
  };

  return {
    theme,
    toggleTheme,
  };
}



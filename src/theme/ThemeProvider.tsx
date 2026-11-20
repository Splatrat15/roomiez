import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { darkColors, lightColors, type ThemeColors } from '@/theme/main';

const STORAGE_KEY = 'roomiez.darkMode';

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!alive) {
          return;
        }
        if (value === '1') {
          setIsDark(true);
        }
      })
      .finally(() => {
        if (alive) {
          setReady(true);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const setDarkMode = (value: boolean) => {
    setIsDark(value);
    void AsyncStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      setDarkMode,
      toggleDarkMode: () => setDarkMode(!isDark),
    }),
    [isDark],
  );

  // Avoid a light flash once we know the stored preference.
  if (!ready) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return value;
}

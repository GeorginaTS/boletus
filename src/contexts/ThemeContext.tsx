import React, { useEffect, useState } from 'react';
import { Theme, ThemeContext, ThemeContextType } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  // Detectar el tema inicial
  useEffect(() => {
    const detectInitialTheme = (): Theme => {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    };

    const initialTheme = detectInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Aplicar el tema al DOM
  const applyTheme = (newTheme: Theme) => {
    const isDark = newTheme === 'dark';
    
    // Aplicar classe Ionic
    if (isDark) {
      document.body.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('ion-palette-dark');
    }
    
    // Aplicar classe personalitzada per CSS personalitzat
    document.body.classList.toggle('dark-theme', isDark);
    
    // Guardar preferència
    localStorage.setItem('theme', newTheme);
  };

  // Funcions públiques
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Escoltar canvis del sistema (només si no hi ha preferència guardada)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
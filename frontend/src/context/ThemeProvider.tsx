// src/contexts/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Default to 'dark' or get from localStorage
  const [theme, setTheme] = useState<Theme>(
  () => (localStorage.getItem('theme') as Theme) || 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the old theme class if it exists
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    // Add the new theme class
    root.setAttribute('data-theme', theme);

    // Save the theme choice to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access to the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
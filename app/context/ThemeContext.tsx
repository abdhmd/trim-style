// app/context/ThemeContext.tsx
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, initialTheme = 'blue' }: { children: ReactNode; initialTheme?: string }) {
  const [theme, setTheme] = useState(initialTheme);

  // Load persisted theme on client-side only
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || initialTheme;
    setTheme(savedTheme);
  }, [initialTheme]);

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
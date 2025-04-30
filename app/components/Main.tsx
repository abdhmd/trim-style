'use client';

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Main({ children }: { children: React.ReactNode }) {
  const { theme } = useContext(ThemeContext)!; // <-- fix here

  return (
    <main data-theme={theme}>
      {children}
    </main>
  );
}

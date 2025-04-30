'use client'; // Mark as a Client Component
import { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import { ThemeContext } from '../context/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }

  const { theme: selectedTheme } = context;

  // State to track whether the component has mounted
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        dir="rtl"
        data-theme="rose" // Default theme for SSR
        className="min-h-screen flex flex-col lg:flex-row-reverse bg-primary-50"
      >
        <main className="flex-1 p-4 lg:mr-64">
          <div className="bg-white rounded-3xl shadow-sm min-h-[calc(100vh-2rem)]">
            <Sidebar />
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      data-theme={selectedTheme} // Apply the dynamic theme here
      className="min-h-screen flex flex-col lg:flex-row-reverse bg-primary-50"
    >
      <main className="flex-1 p-4 lg:mr-64">
        <div className="bg-white rounded-3xl shadow-sm min-h-[calc(100vh-2rem)]">
          <Sidebar />
          {children}
        </div>
      </main>
    </div>
  );
}
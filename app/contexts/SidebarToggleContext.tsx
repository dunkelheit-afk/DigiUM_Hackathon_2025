// app/contexts/SidebarToggleContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarToggleContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarToggleContext = createContext<SidebarToggleContextProps | undefined>(undefined);

export const SidebarToggleProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SidebarToggleContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarToggleContext.Provider>
  );
};

export const useSidebarToggle = () => {
  const context = useContext(SidebarToggleContext);
  if (!context) {
    throw new Error('useSidebarToggle must be used within a SidebarToggleProvider');
  }
  return context;
};

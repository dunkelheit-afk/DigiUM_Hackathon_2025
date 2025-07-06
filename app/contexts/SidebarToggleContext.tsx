// contexts/SidebarToggleContext.tsx
'use client'; // PENTING: Pastikan ini ada di baris paling atas

import { createContext, useContext } from 'react';
import React from 'react'; // Pastikan React diimpor jika menggunakan JSX di sini (walaupun tidak langsung)

// Definisikan tipe untuk nilai konteks
interface SidebarToggleContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Buat konteks dengan nilai default (yang tidak akan pernah digunakan jika provider ada)
const SidebarToggleContext = createContext<SidebarToggleContextType | undefined>(undefined);

// Hook kustom untuk menggunakan konteks ini
export function useSidebarToggle() {
  const context = useContext(SidebarToggleContext);
  if (context === undefined) {
    // Pesan error yang lebih spesifik
    throw new Error('useSidebarToggle must be used within a SidebarToggleProvider');
  }
  return context;
}

// Komponen provider (akan digunakan di layout)
export function SidebarToggleProvider({ children, isSidebarOpen, toggleSidebar }: React.PropsWithChildren<SidebarToggleContextType>) {
  return (
    <SidebarToggleContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarToggleContext.Provider>
  );
}

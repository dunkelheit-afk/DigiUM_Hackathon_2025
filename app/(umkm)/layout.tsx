// app/(umkm)/layout.tsx
'use client';

import { Sidebar } from '@/components/Dashboard/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import React, { useState } from 'react';
import { SidebarToggleProvider } from '@/app/contexts/SidebarToggleContext';

export default function UmkmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarToggleProvider
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main
          className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}
        >
          {children}
        </main>

        <Toaster />
      </div>
    </SidebarToggleProvider>
  );
}

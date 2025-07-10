// app/(umkm)/layout.tsx
'use client';

import { Sidebar } from '@/components/Dashboard/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import React, { useState } from 'react';
import { SidebarToggleProvider } from '@/app/contexts/SidebarToggleContext';
import { UserProvider } from '@/app/contexts/UserContext';

export default function UmkmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <UserProvider>
      <SidebarToggleProvider
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="flex min-h-screen bg-white">
          {/* PERUBAHAN UTAMA ADA DI SINI:
            Props 'isOpen' dan 'toggleSidebar' dihapus karena Sidebar
            sekarang mengambil nilainya langsung dari SidebarToggleProvider.
          */}
          <Sidebar />

          <main
            className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300`}
          >
            {children}
          </main>

          <Toaster />
        </div>
      </SidebarToggleProvider>
    </UserProvider>
  );
}

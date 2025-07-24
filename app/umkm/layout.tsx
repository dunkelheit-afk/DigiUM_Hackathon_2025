// app/(umkm)/layout.tsx
'use client';

import { Sidebar } from '@/components/Dashboard/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { SidebarToggleProvider } from '@/app/contexts/SidebarToggleContext';
import { UserProvider } from '@/app/contexts/UserContext';

export default function UmkmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserProvider>
      <SidebarToggleProvider
      >
        <div className="flex min-h-screen bg-purple-50">
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

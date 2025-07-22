// app/(LandingPage)/layout.tsx

import { Navbar } from '@/components/sections/Navbar';
import React from 'react';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-l">
      <Navbar />
      <main className="flex-grow"> 
        {children}
      </main>
    </div>
  );
}
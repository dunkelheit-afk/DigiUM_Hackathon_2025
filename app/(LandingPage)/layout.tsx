// app/(LandingPage)/layout.tsx
import { Navbar } from '@/components/sections/Navbar'; // Import Navbar Anda
import React from 'react';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow pt-16"> 
        {children}
      </main>
    </div>
  );
}

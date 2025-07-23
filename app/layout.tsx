// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { UserProvider } from '@/app/contexts/UserContext'; // <-- 1. IMPORT USERPROVIDER

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DigiUM',
  description: 'Platform digital untuk mendukung UMKM Indonesia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <UserProvider> {/* <-- 2. BUNGKUS CHILDREN DENGAN USERPROVIDER */}
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
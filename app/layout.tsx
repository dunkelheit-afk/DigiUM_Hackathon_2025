// app/layout.tsx
import './globals.css'; 
import { Inter } from 'next/font/google'; 
import { Toaster } from '@/components/ui/toaster'; 
import React from 'react';

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
        {children} 
        <Toaster />
      </body>
    </html>
  );
}

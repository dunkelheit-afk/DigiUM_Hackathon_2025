// components/sections/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link href={href}>
    <span className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
      {children}
    </span>
  </Link>
);

// PERBAIKAN: 'onSelect' dihapus
interface NavMenuProps {
  className?: string;
}

const NavMenu = ({ className }: NavMenuProps) => (
  <div className={className}>
    <NavLink href="#features">Fitur</NavLink>
    <NavLink href="#testimonials">Testimoni</NavLink>
    <NavLink href="#pricing">Harga</NavLink>
    <NavLink href="#faq">FAQ</NavLink>
  </div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              {/* PERBAIKAN: <img> diganti dengan <Image> */}
              <Image
                src="/images/logo.svg"
                alt="Financia Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900">Financia</span>
            </div>
          </Link>

          <NavMenu className="hidden md:flex items-center space-x-8" />

          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">Daftar Gratis</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-gray-200">
          <NavMenu className="flex flex-col space-y-4" />
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-2">
            <Link href="/login" passHref>
              <Button variant="outline" className="w-full">Masuk</Button>
            </Link>
            <Link href="/register" passHref>
              <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
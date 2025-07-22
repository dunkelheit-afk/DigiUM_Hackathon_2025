'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

interface NavLinkProps {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    const navbarElement = document.getElementById('main-navbar');

    if (targetElement) {
      const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 24;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href} onClick={handleSmoothScroll}>
      <span className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-300 font-medium">
        {children}
      </span>
    </Link>
  );
};


interface NavMenuProps {
  className?: string;
  onLinkClick?: () => void;
}

const NavMenu = ({ className, onLinkClick }: NavMenuProps) => (
  <div className={className}>
    <NavLink href="#features" onClick={onLinkClick}>Fitur</NavLink>
    <NavLink href="#umkm-showcase" onClick={onLinkClick}>Showcase</NavLink>
    <NavLink href="#testimonials" onClick={onLinkClick}>Testimoni</NavLink>
    <NavLink href="#pricing" onClick={onLinkClick}>Harga</NavLink>
    <NavLink href="#team" onClick={onLinkClick}>Tim</NavLink>
  </div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 bg-transparent transition-all duration-500 ease-in-out ${
      isScrolled ? 'px-4 md:px-8 lg:px-72 xl:px-72' : 'px-0'
    }`}>
      <header
        id="main-navbar"
        className={`
          bg-white/80 backdrop-blur-md transition-all duration-500 ease-in-out
          ${isScrolled ? 'mt-6 shadow-xl border rounded-3xl' : 'mt-0 border- shadow-xl'}
        `}
      >
        <div className={`w-full mx-auto transition-all duration-500 max-w-screen-xl ${
          isScrolled ? 'px-6' : 'px-4'
        }`}>
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-20' : 'h-16'
          }`}>
            {/* Logo */}
            <Link href="/" onClick={handleLinkClick}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="/Digi.svg"
                  alt="DigiUM Logo"
                  width={isScrolled ? 28 : 30}
                  height={isScrolled ? 28 : 30}
                  className="transition-all duration-500"
                />
                <span className={`font-bold transition-all duration-500 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}>
                  <span className="text-black">Digi</span>
                  <span className="text-[#8F87F1]">UM</span>
                </span>
              </div>
            </Link>

            {/* Menu Desktop */}
            <NavMenu className="hidden md:flex items-center space-x-8" />

            {/* Auth Buttons Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" className="text-[#8F87F1] border-[#C68EFD] hover:bg-[#8F87F1] hover:text-white transition-all duration-300">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="text-white bg-gradient-to-r from-[#8F87F1] to-[#C68EFD] hover:shadow-lg hover:shadow-[#8F87F1]/50 transition-all duration-300">
                  Daftar Gratis
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#8F87F1]"
              >
                {isOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white px-4 pt-2 pb-4 border-t border-[#FED2E2]">
            <NavMenu className="flex flex-col space-y-4" onLinkClick={handleLinkClick} />
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-2">
              <Link href="/login" passHref>
                <Button
                  variant="outline"
                  className="w-full text-[#8F87F1] border-[#C68EFD] hover:bg-[#8F87F1] hover:text-white"
                  onClick={handleLinkClick}
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  className="w-full text-white bg-gradient-to-r from-[#8F87F1] to-[#C68EFD]"
                  onClick={handleLinkClick}
                >
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

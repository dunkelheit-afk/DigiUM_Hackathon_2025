// components/sections/Navbar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

// Helper component for items within NavigationMenuContent
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, onSelect, ...props }, ref) => { // Destructure onSelect here
  return (
    <li>
      <NavigationMenuLink
        ref={ref} // Pass ref directly to NavigationMenuLink
        className={"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground " + className} // Concatenate classes
        {...props} // Spread remaining props (onSelect is now omitted)
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';


export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo DigiUM with separated colors and no space */}
        <Link href="#hero" className="font-bold text-xl transition-colors duration-200">
          <span className="text-gray-900 hover:text-gray-700">Digi</span><span className="text-purple-600 hover:text-purple-700">UM</span>
        </Link>

        {/* Main Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            {/* Home Menu Item - Scrolls to Hero Section */}
            <NavigationMenuItem>
              <NavigationMenuLink href="#hero" className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Top MSMEs Menu Item - Scrolls to UMKM Showcase Section */}
            <NavigationMenuItem>
              <NavigationMenuLink href="#umkm-showcase" className={navigationMenuTriggerStyle()}>
                Top MSMEs
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Services Menu Item with Dropdown - Links to specific sections */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    {/* "Main Services" - Links to the main Features Section */}
                    <NavigationMenuLink
                      href="#features" // Link to the main Features Section
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-50 to-purple-100 p-6 no-underline outline-none focus:shadow-md"
                    >
                      <img
                         src="/utama.svg"
                         alt="MSME Services"
                         className="mb-4 h-24 w-auto"
                      />
                      <div className="mb-2 mt-4 text-lg font-medium text-purple-800">
                        Main Services
                      </div>
                      <p className="text-sm leading-tight text-purple-600">
                        Explore our core features supporting MSMEs.
                      </p>
                    </NavigationMenuLink>
                  </li>
                  {/* Digital Accounting - Links to specific Digital Accounting feature */}
                  <ListItem href="#digital-accounting" title="Digital Accounting">
                    Easy, fast, and accurate digital bookkeeping for MSMEs.
                  </ListItem>
                  {/* MSME Showcase - Links to specific MSME Showcase feature */}
                  <ListItem href="#msme-showcase-feature" title="MSME Showcase">
                    Promote your products through exhibitions and collaborative events.
                  </ListItem>
                  {/* Funding - Links to specific Funding feature */}
                  <ListItem href="#funding-feature" title="Funding">
                    Access various funding sources and connect with investors.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* About Menu Item - Scrolls to Team Section */}
            <NavigationMenuItem>
              <NavigationMenuLink href="#team" className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Login Button */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            asChild
            className="
              text-purple-600 border border-purple-600
              hover:bg-purple-600 hover:text-white rounded-xl
              transition-colors duration-200 ease-in-out
            "
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

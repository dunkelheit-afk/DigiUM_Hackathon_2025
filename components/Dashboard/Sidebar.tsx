// components/Dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import {
  Home,
  BarChart,
  ArrowLeftRight,
  Package,
  Users,
  Handshake,
  Settings,
  LogOut,
  Menu, // Icon untuk membuka sidebar
  X, // Icon untuk menutup sidebar
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

// DEFINISI INTERFACE UNTUK PROPS SIDEBAR
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Komponen Sidebar menerima props isOpen dan toggleSidebar
export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Reports', href: '/finance', icon: BarChart },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Investors', href: '/funding', icon: Handshake },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={`
      min-h-screen p-5 flex flex-col shadow-xl
      backdrop-blur-2xl border-t border-b border-r border-purple-300/20
      text-gray-900
      rounded-tr-3xl rounded-br-3xl
      will-change-transform will-change-filter
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'}
      fixed md:relative z-40
    `}>
      {/* Sidebar Header/Toggle Button */}
      <div className="flex justify-between items-center mb-8">
        {isOpen && (
          <div className="text-3xl font-bold text-purple-600">
            Digi<span className="text-gray-900">UM</span>
          </div>
        )}
        {/* Toggle Button for mobile - always visible */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-700 hover:bg-white/20 hover:text-gray-900 md:hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Main Navigation Area */}
      {isOpen && (
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link href={item.href} className={`
                    flex items-center px-4 py-3 rounded-xl font-medium transition duration-200
                    ${isActive
                      ? 'bg-purple-600/70 text-white shadow'
                      : 'text-gray-900 hover:bg-purple-100/20 hover:text-gray-900' /* Hover background ungu transparan */
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Bottom Section: User Profile & Logout */}
      {isOpen && (
        <div className="mt-auto border-t border-purple-300/20 pt-4"> {/* Border ungu transparan */}
          {/* User Profile Info - Diberi container rapi dengan ring */}
          <div className="flex items-center p-3 rounded-lg bg-white/10 mb-4
                          border border-white/20 /* Border halus */
                          transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md
                          hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white/10
                          will-change-transform will-change-shadow will-change-filter">
            <div className="w-10 h-10 bg-purple-200/50 rounded-full flex items-center justify-center text-purple-800 mr-3">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-700">Owner UMKM</p>
            </div>
          </div>
          {/* Logout Button */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-2 px-4 ring-1 ring-purple-600 hover:bg-purple-600 hover:text-white text-black rounded-xl transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      )}
    </aside>
  );
}

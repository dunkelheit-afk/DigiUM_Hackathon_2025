// Contoh path: components/Dashboard/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Settings, HandCoins, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebarToggle } from '@/app/contexts/SidebarToggleContext';
import { useUser } from '@/app/contexts/UserContext';
import { createClient } from '@/lib/supabase/client';

// Definisikan item-item menu di sini agar mudah dikelola
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/financial-analysis', label: 'Financial Suite', icon: HandCoins },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const { profile, isLoading } = useUser();

  const displayName = isLoading ? 'Memuat...' : profile?.full_name || 'Nama Pengguna';
  const umkmName = isLoading ? 'UMKM Anda' : profile?.umkm_name || 'Nama UMKM';
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert('Gagal untuk logout.');
    } else {
      router.push('/login');
    }
  };

  return (
    <aside
      className={`
        flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Header Sidebar dengan Logika Tampilan Baru */}
      <div className={`flex items-center p-4 border-b ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <h1 className={`font-bold text-2xl text-purple-700 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          DigiUM
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={isSidebarOpen ? '' : item.label} // Tooltip saat sidebar tertutup
            className={`
              flex items-center p-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700
              ${pathname === item.href ? 'bg-purple-100 text-purple-700' : ''}
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className={`ml-4 text-sm font-medium transition-all duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Profil Pengguna di Bawah */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className={`ml-3 transition-all duration-200 overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <p className="font-semibold text-sm text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{umkmName}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-start mt-4 bg-white ring- text-black hover:bg-purple-700 hover:text-white ${!isSidebarOpen && 'justify-center'}`}
          onClick={handleLogout}
          title={isSidebarOpen ? '' : 'Logout'} // Tooltip saat sidebar tertutup
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`ml-4 text-sm font-medium transition-all duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
}

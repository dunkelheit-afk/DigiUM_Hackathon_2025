'use client';

import React, { useState } from 'react'; // PERUBAHAN: Mengimpor useState
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Settings, HandCoins, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { createClient } from '@/lib/supabase/client';
// import { useSidebarToggle } from '@/app/contexts/SidebarToggleContext'; // PERUBAHAN: Tidak lagi digunakan
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sidebar as SidebarContainer, SidebarBody, SidebarLink } from '@/components/ui/sidebar';

const menuItems = [
  { href: '/umkm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/umkm/financial-analysis', label: 'Financial Suite', icon: HandCoins },
  { href: '/umkm/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  // PERUBAHAN: Menggunakan state lokal, sama seperti sidebar investor
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const { profile, isLoading } = useUser();

  const displayName = isLoading ? 'Memuat...' : profile?.full_name || 'Nama Pengguna';
  const umkmName = isLoading ? 'UMKM Anda' : profile?.umkm_name || 'Nama UMKM';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className={cn("flex h-screen overflow-hidden")}>
      {/* PERUBAHAN: Menggunakan state lokal untuk mengontrol komponen */}
      <SidebarContainer open={isSidebarOpen} setOpen={setIsSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Link href="/umkm/dashboard" className="mt-2">
              <div className={cn(
                "flex items-center gap-2 cursor-pointer py-1",
                isSidebarOpen ? "justify-start" : "justify-center"
              )}>
                <Image
                  src="/Digi.svg"
                  alt="DigiUM Logo"
                  width={36}
                  height={36}
                  className="transition-all duration-500"
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "font-bold whitespace-pre text-xl",
                    isSidebarOpen ? "inline-block" : "hidden"
                  )}
                >
                  <span className="text-black">Digi</span>
                  <span className="text-[#8F87F1]">UM</span>
                </motion.span>
              </div>
            </Link>

            {/* PERUBAHAN: Tombol toggle sekarang mengontrol state lokal */}
            {isSidebarOpen && (
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                </Button>
              </div>
            )}
            {/* PERUBAHAN: Menambahkan tombol untuk membuka saat tertutup */}
            {!isSidebarOpen && (
                <div className="flex justify-center mt-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <ChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                    </Button>
                </div>
            )}


            <div className="mt-8 flex flex-col gap-2">
              {menuItems.map((item, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    label: item.label,
                    href: item.href,
                    icon: <item.icon className={cn(
                        "h-5 w-5 shrink-0",
                        pathname === item.href ? "text-[#8F87F1]" : "text-neutral-700 dark:text-neutral-200"
                    )} />,
                  }}
                  className={cn(
                    "flex items-center p-2 rounded-lg hover:bg-purple-100",
                    "hover:text-[#8F87F1]",
                    pathname === item.href
                      ? 'bg-purple-100 text-[#8F87F1]'
                      : 'text-gray-700',
                    !isSidebarOpen && "justify-center"
                  )}
                  aria-label={item.label}
                />
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: displayName,
                href: '#',
                icon: (
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                ),
              }}
              className={cn(!isSidebarOpen && "justify-center")}
              aria-label={`Profil ${displayName}`}
            />
            {isSidebarOpen && (
              <p className="ml-3 text-xs text-gray-500 truncate mt-1">
                {umkmName}
              </p>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mt-4 bg-white text-black",
                "hover:bg-[#8F87F1] hover:text-white",
                !isSidebarOpen ? 'justify-center' : ''
              )}
              onClick={handleLogout}
              title={!isSidebarOpen ? 'Logout' : ''}
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              {isSidebarOpen && <span className="ml-4 text-sm font-medium">Logout</span>}
            </Button>
          </div>
        </SidebarBody>
      </SidebarContainer>
    </div>
  );
}

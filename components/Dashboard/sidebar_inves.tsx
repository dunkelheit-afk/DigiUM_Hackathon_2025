'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Mengaktifkan kembali import Link
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// Mengimpor ikon dari @tabler/icons-react sesuai dengan Aceternity UI
import {
  IconDashboard,
  IconSettings,
  IconLogout,
  IconChevronLeft,
} from '@tabler/icons-react';
import { motion } from 'framer-motion'; // Menggunakan framer-motion untuk animasi
import { cn } from '@/lib/utils'; // Utilitas untuk menggabungkan kelas Tailwind
import Image from 'next/image'; // Mengimpor komponen Image dari Next.js

// Mengimpor komponen dasar sidebar dari Aceternity UI
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';

import { useUser } from '@/app/contexts/UserContext';
import { createClient } from '@/lib/supabase/client';

// Definisi menuItems yang disesuaikan untuk SidebarLink Aceternity
const menuItems = [
  {
    label: 'UMKM',
    href: '/investor/dashboard',
    // Ikon langsung dari @tabler/icons-react
    icon: <IconDashboard className="h-5 w-5 shrink-0" />,
  },
  {
    label: 'Settings',
    href: '/investor/settings',
    // Ikon langsung dari @tabler/icons-react
    icon: <IconSettings className="h-5 w-5 shrink-0" />,
  },
];

export function InvestorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  // State lokal untuk mengontrol status buka/tutup sidebar Aceternity
  // Awalnya terbuka (true)
  const [open, setOpen] = useState(true);
  const { profile, isLoading } = useUser();

  const displayName = isLoading ? 'Memuat...' : profile?.full_name || 'Nama Pengguna';
  const umkmName = isLoading ? 'UMKM Anda' : profile?.umkm_name || 'Nama UMKM'; // Variabel ini akan digunakan

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    // Kontainer utama untuk sidebar Aceternity
    // Kelas `h-screen` dan `overflow-hidden` penting untuk layout
    <div className={cn("flex h-screen overflow-hidden")}>
      {/* Komponen Sidebar dari Aceternity UI */}
      {/* `open` dan `setOpen` diteruskan untuk mengontrol status sidebar */}
      {/* `animate` diatur ke true untuk efek transisi */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Header / Logo DigiUM - Disatukan dengan gaya Navbar */}
            <Link href="/investor/dashboard" className="mt-2"> {/* PERUBAHAN: Menambahkan margin top */}
              <div className={cn(
                "flex items-center gap-2 cursor-pointer py-1",
                open ? "justify-start" : "justify-center" // Pusatkan saat tertutup
              )}>
                <Image
                  src="/Digi.svg"
                  alt="DigiUM Logo"
                  width={36} // PERUBAHAN: Ukuran logo diperbesar
                  height={36} // PERUBAHAN: Ukuran logo diperbesar
                  className="transition-all duration-500"
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: open ? 1 : 0 }} // Animasi opacity berdasarkan status buka
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "font-bold whitespace-pre text-xl", // Ukuran teks statis untuk sidebar
                    open ? "inline-block" : "hidden" // Tampilkan/sembunyikan berdasarkan status buka
                  )}
                >
                  <span className="text-black">Digi</span>
                  <span className="text-[#8F87F1]">UM</span>
                </motion.span>
              </div>
            </Link>

            {/* PERUBAHAN: Tombol toggle hanya muncul saat sidebar terbuka */}
            {open && (
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
                  <IconChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                </Button>
              </div>
            )}

            {/* Menu Navigasi */}
            <div className="mt-8 flex flex-col gap-2">
              {menuItems.map((item, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    label: item.label,
                    href: item.href,
                    // Mengkloning ikon untuk menambahkan kelas warna berdasarkan rute aktif
                    icon: React.cloneElement(item.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
                      className: cn(
                        (item.href === pathname || (item.href === '/investor/dashboard' && pathname === '/'))
                          ? 'text-[#8F87F1]' // Warna ikon aktif disesuaikan dengan HeroSection
                          : 'text-neutral-700 dark:text-neutral-200' // Warna ikon non-aktif
                      ),
                    }),
                  }}
                  className={cn(
                    "flex items-center p-2 rounded-lg hover:bg-purple-100",
                    "hover:text-[#8F87F1]",
                    (item.href === pathname || (item.href === '/investor/dashboard' && pathname === '/'))
                      ? 'bg-purple-100 text-[#8F87F1]' // Latar belakang dan teks aktif disesuaikan
                      : 'text-gray-700', // Teks non-aktif
                    // --- PERUBAHAN DI SINI ---
                    !open && "justify-center" // Menambahkan kelas untuk perataan tengah saat sidebar tertutup
                  )}
                  aria-label={item.label}
                />
              ))}
            </div>
          </div>

          {/* Profil Pengguna dan Logout */}
          <div>
            <SidebarLink
              link={{
                label: displayName,
                href: '#', // Ganti dengan rute profil jika ada
                icon: (
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                ),
              }}
              // --- PERUBAHAN DI SINI ---
              className={cn(!open && "justify-center")} // Menambahkan kelas untuk perataan tengah saat sidebar tertutup
              aria-label={`Profil ${displayName}`}
            />
            {/* Menampilkan nama UMKM di bawah nama pengguna */}
            {open && (
              <p className="ml-3 text-xs text-gray-500 truncate mt-1">
                {umkmName}
              </p>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mt-4 bg-white text-black",
                "hover:bg-[#8F87F1] hover:text-white",
                !open ? 'justify-center' : ''
              )}
              onClick={handleLogout}
              title={!open ? 'Logout' : ''}
              aria-label="Logout"
            >
              <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              {open && <span className="ml-4 text-sm font-medium">Logout</span>}
            </Button>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

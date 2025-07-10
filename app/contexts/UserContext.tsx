// app/contexts/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Definisikan tipe data untuk profil
export interface Profile {
  id: string;
  full_name: string | null;
  umkm_name: string | null;
  phone: string | null;
}

// Definisikan tipe untuk nilai context
interface UserContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  refetchProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data profil, dibuat dengan useCallback agar stabil
  const fetchProfile = useCallback(async (currentUser: User) => {
    // Jangan set loading di sini agar UI tidak berkedip saat refetch
    
    // --- PERUBAHAN UTAMA ADA DI SINI ---
    // Mengganti .single() dengan .maybeSingle() agar tidak error jika profil belum ada.
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle(); // Lebih aman, mengembalikan null jika tidak ada data

    if (error) {
      console.error("Gagal mengambil profil:", error.message);
      setProfile(null); // Set profil jadi null jika ada error
    } else if (data) {
      setProfile(data);
    }
  }, [supabase]);

  // Efek ini HANYA berjalan sekali untuk mendapatkan sesi awal
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        await fetchProfile(currentUser);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listener ini HANYA mengubah state 'user', tidak lagi memicu fetch otomatis.
    // Ini mencegah race condition.
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]);


  const value = {
    user,
    profile,
    isLoading,
    // refetchProfile sekarang menjadi satu-satunya cara untuk memuat ulang profil secara manual
    refetchProfile: () => user ? fetchProfile(user) : Promise.resolve(),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook untuk menggunakan context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

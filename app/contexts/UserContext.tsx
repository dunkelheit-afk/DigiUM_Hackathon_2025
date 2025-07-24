'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

// 1. PERBAIKAN: Lengkapi tipe data Profile
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "umkm" | "investor" | "admin" | null;
  has_selected_role: boolean | null;
  umkm_name: string | null;
  umkm_category: string | null;
  umkm_description: string | null;
  umkm_image_url: string | null;
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  refetchProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (currentUser: User) => {
    // 2. PERBAIKAN: Tambahkan kolom yang hilang di statement SELECT
    const { data, error } = await supabase
      .from('profiles')
      .select('*, umkm_category, umkm_description, umkm_image_url') // Ambil semua kolom + kolom spesifik UMKM
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil profil:", error.message);
      setProfile(null);
    } else {
      setProfile(data);

      if (data && !data.has_selected_role && pathname !== '/auth/choose-role') {
        router.push('/auth/choose-role');
      }
    }
  }, [supabase, router, pathname]);

  useEffect(() => {
    const getInitialSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        await fetchProfile(currentUser);
      }
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]);

  const value = {
    user,
    profile,
    isLoading,
    refetchProfile: () => user ? fetchProfile(user) : Promise.resolve(),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
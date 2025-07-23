// app/contexts/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// ✅ Definisikan tipe data untuk profil (tanpa company_name)
export interface Profile {
  id: string;
  full_name: string | null;
  umkm_name: string | null;
  phone: string | null;
}

// ✅ Tipe context
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

  const fetchProfile = useCallback(async (currentUser: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, umkm_name, phone')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil profil:", error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, [supabase]);

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

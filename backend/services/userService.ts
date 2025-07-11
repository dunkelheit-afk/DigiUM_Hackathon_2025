// backend/services/userService.ts
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function getUserProfile() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // PERBAIKAN: Mengganti 'users' menjadi 'profiles' agar cocok dengan definisi tipe
  const { data: profile, error } = await supabase
    .from('profiles') // Nama tabel yang benar adalah 'profiles'
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // Kode 'PGRST116' berarti tidak ada baris yang ditemukan, yang bisa terjadi
    // jika profil belum dibuat. Ini bukan error fatal.
    if (error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
    }
    return null;
  }

  return profile;
}

// backend/utils/server-helpers.ts
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import 'server-only'; // Memastikan file ini hanya berjalan di server

/**
 * Mengambil sesi pengguna yang sedang aktif dari sisi server.
 * Berguna untuk melindungi rute atau melakukan aksi atas nama pengguna.
 * @returns Sesi pengguna atau null jika tidak ada.
 */
export async function getUserSession() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}

/**
 * Mengambil detail pengguna yang sedang aktif.
 * @returns Detail pengguna atau null jika tidak ada.
 */
export async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}
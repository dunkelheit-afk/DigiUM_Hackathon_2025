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

  const { data: profile, error } = await supabase
    .from('users') // Asumsikan Anda punya tabel 'users'
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return profile;
}
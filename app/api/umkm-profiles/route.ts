import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ambil semua profil dengan peran 'umkm' yang sudah melengkapi nama UMKM-nya
    const { data, error } = await supabase
      .from('profiles')
      .select('id, umkm_name, umkm_category, umkm_description, umkm_image_url')
      .eq('role', 'umkm')
      .not('umkm_name', 'is', null); // Filter untuk profil yang sudah diisi

    if (error) {
      console.error('Supabase error fetching UMKM profiles:', error);
      throw error;
    }

    return NextResponse.json(data);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
        JSON.stringify({ message: 'Error fetching UMKM profiles', error: errorMessage }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
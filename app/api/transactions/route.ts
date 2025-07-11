// app/api/transactions/route.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieStore = await cookies();
          try {
            cookieStore.set({ name, value, ...options });
          } catch { // PERBAIKAN: Variabel 'error' yang tidak digunakan telah dihapus.
            // Ini bisa diabaikan jika 'set' dipanggil dari Server Component,
            // karena middleware akan menangani refresh sesi.
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookies();
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch { // PERBAIKAN: Variabel 'error' yang tidak digunakan telah dihapus.
            // Ini bisa diabaikan jika 'remove' dipanggil dari Server Component.
          }
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase error fetching transactions:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
        return new NextResponse(
            JSON.stringify({ message: 'Error fetching transactions', error: error.message }),
            { status: 500 }
        );
    }
    return new NextResponse(
        JSON.stringify({ message: 'An unknown error occurred' }),
        { status: 500 }
    );
  }
}

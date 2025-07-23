// File: app/api/analysis/latest/route.ts
// Versi ini sesuai dengan skema database "flat" Anda.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: 'Akses ditolak: Pengguna tidak terautentikasi.' },
        { status: 401 }
      );
    }

    // Ambil data analisis TERAKHIR dari user yang sedang login
    const { data: latestAnalysis, error: analysisError } = await supabase
      .from('analysis_records')
      .select('*') // Mengambil semua kolom yang sudah dalam format "flat"
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(); // .single() untuk mendapatkan satu objek, bukan array

    if (analysisError) {
      // Jika error karena tidak ada data, kirim pesan yang lebih jelas
      if (analysisError.code === 'PGRST116') {
        return NextResponse.json({ message: 'Belum ada data analisis yang ditemukan.' }, { status: 404 });
      }
      // Untuk error lain, lempar error agar ditangkap oleh blok catch
      throw analysisError;
    }
    
    // Karena skema database Anda sudah "flat", kita tidak perlu melakukan format ulang.
    // Data dari Supabase sudah cocok dengan yang dibutuhkan oleh komponen dashboard.
    // Langsung kirimkan objek `latestAnalysis`.
    return NextResponse.json(latestAnalysis);

  } catch (error: any) {
    console.error('Error di API /analysis/latest:', error);
    return NextResponse.json(
        { message: 'Terjadi kesalahan pada server', error: error.message },
        { status: 500 }
    );
  }
}

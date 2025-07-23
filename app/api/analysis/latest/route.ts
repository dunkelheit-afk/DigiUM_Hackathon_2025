// app/api/analysis/latest/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Dapatkan data pengguna yang sedang login dari sesi mereka
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Akses ditolak: Tidak terautentikasi.' }, { status: 401 });
    }

    // 2. Ambil data analisis TERAKHIR dari database untuk pengguna ini
    const { data, error } = await supabase
      .from('analysis_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 3. Tangani kasus jika tidak ada data analisis yang ditemukan
    if (error) {
      // Kode 'PGRST116' berarti tidak ada baris yang ditemukan, ini bukan error fatal.
      if (error.code === 'PGRST116') {
        return NextResponse.json({ message: 'Belum ada data analisis yang ditemukan untuk pengguna ini.' }, { status: 404 });
      }
      // Untuk error database lainnya
      throw error;
    }

    // 4. Jika berhasil, kirim data sebagai respons JSON
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error pada API /api/analysis/latest:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.', error: error.message }, { status: 500 });
  }
}

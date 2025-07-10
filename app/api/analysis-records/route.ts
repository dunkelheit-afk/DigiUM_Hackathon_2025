import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Ambil data dari form yang dikirim oleh frontend
  const body = await request.json();

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 2. Dapatkan sesi pengguna untuk keamanan
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: You must be logged in.' }, { status: 401 });
  }

  // 3. Masukkan data ke dalam tabel 'analysis_records'
  const { data, error } = await supabase
    .from('analysis_records')
    .insert({
      user_id: session.user.id, // Tautkan record dengan user yang sedang login
      revenue: body.pendapatan,
      cogs: body.hpp,
      operating_expenses: body.biayaOperasional,
      total_assets: body.aset,
      cash: body.kas,
      total_liabilities: body.utang,
      total_equity: body.modal,
    })
    .select() // Kembalikan data yang baru saja disimpan
    .single();

  // 4. Tangani jika ada error dari Supabase
  if (error) {
    console.error('Supabase Insert Error:', error);
    return NextResponse.json({ error: 'Failed to save analysis record.' }, { status: 500 });
  }

  // 5. Kirim kembali respons sukses dengan data yang baru dibuat
  return NextResponse.json({ message: 'Analysis saved successfully!', data });
}
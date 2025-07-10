import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { tanggal, deskripsi, kategori, jumlah } = await request.json();
  
  const cookieStore = cookies();
  const supabase = createServerClient(/* ...konfigurasi Anda... */);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Menyimpan data ke tabel 'transactions'
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: session.user.id,
      tanggal,
      deskripsi,
      kategori,
      jumlah,
    })
    .select() // Penting: Mengambil kembali data yang baru saja dibuat
    .single();

  if (error) {
    console.error('Supabase Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Mengembalikan data baru ke frontend agar bisa langsung ditampilkan
  return NextResponse.json(data);
}
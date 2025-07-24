import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createTransactionSchema } from '@/lib/validations';

// Helper function untuk membuat Supabase client agar tidak duplikasi kode
function getSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Handler untuk mengambil (GET) semua transaksi milik pengguna yang terautentikasi.
 */
export async function GET() {
  const supabase = getSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase error fetching transactions:', error);
      throw error; // Akan ditangkap oleh blok catch di bawah
    }

    return NextResponse.json(data);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
        JSON.stringify({ message: 'Error fetching transactions', error: errorMessage }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handler untuk membuat (POST) transaksi baru dengan validasi input.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseClient();

  try {
    // 1. Dapatkan user dari sesi di server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Dapatkan body request dan validasi dengan Zod
    const requestBody = await request.json();
    const validatedData = createTransactionSchema.parse(requestBody);

    // 3. Siapkan data untuk dimasukkan ke database
    const transactionToInsert = {
      ...validatedData,
      user_id: user.id, // Gunakan user.id dari server, bukan dari client
    };

    // 4. Masukkan data ke Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionToInsert)
      .select()
      .single(); // .single() untuk mendapatkan objek tunggal, bukan array

    if (error) {
      console.error('Supabase error creating transaction:', error);
      // Mungkin ada error spesifik dari database, misal constraint
      return new NextResponse(
        JSON.stringify({ message: "Gagal menyimpan ke database", error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Kembalikan data yang berhasil dibuat dengan status 201 Created
    return new NextResponse(JSON.stringify(data), { status: 201 });

  } catch (error) {
    // Tangani error validasi dari Zod
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ message: 'Input tidak valid', errors: error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Tangani error lainnya
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Terjadi kesalahan pada server', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

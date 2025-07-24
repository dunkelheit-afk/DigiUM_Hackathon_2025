import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { financialAnalysisSchema } from '@/lib/validations';

// Buat skema Zod baru yang menggabungkan skema input keuangan
// dengan hasil prediksi yang akan kita terima.
const analysisRecordSchema = financialAnalysisSchema.extend({
  prediction_status: z.string().min(1, "Status prediksi tidak boleh kosong"),
  recommendation: z.string().min(1, "Rekomendasi tidak boleh kosong"),
});

// Helper function untuk membuat Supabase client
function getSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => (await cookieStore).get(name)?.value,
        set: async (name: string, value: string, options: CookieOptions) => {
          try { (await cookieStore).set({ name, value, ...options }); } catch (error) {}
        },
        remove: async (name: string, options: CookieOptions) => {
          try { (await cookieStore).set({ name, value: '', ...options }); } catch (error) {}
        },
      },
    }
  );
}

/**
 * Handler untuk menyimpan (POST) catatan analisis keuangan yang lengkap.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseClient();

  try {
    // 1. Pastikan pengguna terautentikasi
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validasi data yang masuk (input form + hasil prediksi)
    const requestBody = await request.json();
    const validatedData = analysisRecordSchema.parse(requestBody);

    // 3. Siapkan data lengkap untuk disimpan, tambahkan user_id dari server
    const recordToInsert = {
      ...validatedData,
      user_id: user.id,
    };

    // 4. Simpan ke tabel 'analysis_records' di Supabase
    const { data, error } = await supabase
      .from('analysis_records')
      .insert(recordToInsert)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating analysis record:', error);
      return NextResponse.json({ message: "Gagal menyimpan catatan analisis", error: error.message }, { status: 400 });
    }

    // 5. Kembalikan data yang berhasil disimpan dengan status 201 Created
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    // Tangani error validasi dari Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Input untuk menyimpan catatan tidak valid', errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    // Tangani error lainnya
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
    return NextResponse.json({ message: 'Terjadi kesalahan pada server', error: errorMessage }, { status: 500 });
  }
}

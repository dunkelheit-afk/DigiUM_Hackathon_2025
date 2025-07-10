// app/api/analysis/latest/route.ts
// VERSI FINAL: Memastikan kolom 'recommendation' diambil dan dikirim ke frontend.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
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

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'Tidak terautentikasi.' }), { status: 401 }
      );
    }

    // Ambil data analisis TERAKHIR dari user tersebut
    const { data: latestAnalysis, error } = await supabase
      .from('analysis_records')
      .select('*') // select('*') sudah otomatis mengambil semua kolom, termasuk yang baru
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !latestAnalysis) {
      return new NextResponse(
        JSON.stringify({ message: 'Belum ada data analisis yang ditemukan.' }), { status: 404 }
      );
    }

    // Siapkan data lengkap untuk dikirim ke frontend
    const laba_bersih = latestAnalysis.revenue - latestAnalysis.cogs - latestAnalysis.operating_expenses;
    const beban = latestAnalysis.cogs + latestAnalysis.operating_expenses;

    const responseData = {
      // Data Prediksi & Rasio dari DB
      prediction_status: latestAnalysis.prediction_status,
      net_profit_margin: latestAnalysis.net_profit_margin,
      current_ratio: latestAnalysis.current_ratio,
      debt_to_equity: latestAnalysis.debt_to_equity,
      roa: latestAnalysis.roa,
      asset_turnover: latestAnalysis.asset_turnover,
      recommendation: latestAnalysis.recommendation, // <-- INI YANG PALING PENTING
      
      // Data mentah untuk ditampilkan di Ringkasan Finansial
      revenue: latestAnalysis.revenue,
      cogs: latestAnalysis.cogs,
      operating_expenses: latestAnalysis.operating_expenses,
      total_assets: latestAnalysis.total_assets,
      cash: latestAnalysis.cash,
      total_liabilities: latestAnalysis.total_liabilities,
      total_equity: latestAnalysis.total_equity,
      
      // Data turunan untuk grafik
      expenses: beban,
      net_profit: laba_bersih,
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: 'Terjadi kesalahan pada server', error: error.message }), { status: 500 }
    );
  }
}

// supabase/functions/process-analysis/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

// GANTI DENGAN URL PUBLIK DARI API PYTHON ANDA DI VERCEL
const ML_API_URL = 'http://127.0.0.1:8000/'

serve(async (req) => {
  try {
    // Buat Supabase client untuk berinteraksi dengan database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Ambil data baris baru dari request yang dikirim oleh trigger
    const { record } = await req.json()

    // Kirim data ke API Python untuk prediksi
    const predictionResponse = await fetch(ML_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record), // Kirim seluruh data record
    })

    if (!predictionResponse.ok) {
      throw new Error(`ML API returned an error: ${await predictionResponse.text()}`)
    }

    const predictionResult = await predictionResponse.json()
    const predictedStatus = predictionResult.prediction_status || 'failed'

    // Update baris di database dengan hasil prediksi
    const { error } = await supabaseClient
      .from('analysis_records')
      .update({ prediction_status: predictedStatus })
      .eq('id', record.id) // Targetkan baris yang benar berdasarkan ID

    if (error) {
      throw new Error(`Database update error: ${error.message}`)
    }

    return new Response(JSON.stringify({ success: true, status: predictedStatus }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(String(error?.message ?? error), { status: 500 })
  }
})
// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
// PERBAIKAN: Kembali mengimpor 'cookies' saja, tanpa tipe spesifik.
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase' // Pastikan file ini ada dan benar

// PERBAIKAN: Menggunakan ReturnType<typeof cookies> untuk tipe yang lebih robust.
export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch { // PERBAIKAN: Variabel 'error' yang tidak digunakan telah dihapus
            // Ini bisa diabaikan jika 'set' dipanggil dari Server Component.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch { // PERBAIKAN: Variabel 'error' yang tidak digunakan telah dihapus
            // Ini bisa diabaikan jika 'remove' dipanggil dari Server Component.
          }
        },
      },
    }
  )
}

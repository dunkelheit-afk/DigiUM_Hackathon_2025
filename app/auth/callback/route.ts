import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookieStore).get(name)?.value
          },
          async set(name: string, value: string, options: CookieOptions) {
            (await cookieStore).set({ name, value, ...options })
          },
          async remove(name: string, options: CookieOptions) {
            (await cookieStore).set({ name, value: '', ...options })
          },
        },
      }
    )
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && session) {
        const user = session.user;
        
        // --- PERBAIKAN: Logika Pengalihan Berdasarkan Peran ---
        
        // 1. Ambil profil pengguna dari tabel 'profiles'
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error("Gagal mengambil profil atau profil tidak ditemukan:", profileError);
            // Jika profil atau peran belum ada, arahkan ke halaman pemilihan peran
            return NextResponse.redirect(`${origin}/auth/choose-role`);
        }

        // 2. Arahkan pengguna berdasarkan kolom 'role'
        if (profile.role === 'INVESTOR') {
            return NextResponse.redirect(`${origin}/investor/dashboard`);
        } else if (profile.role === 'UMKM') {
            return NextResponse.redirect(`${origin}/umkm/dashboard`);
        } else {
            // Fallback jika peran tidak dikenali atau null
            return NextResponse.redirect(`${origin}/auth/choose-role`);
        }
    }
  }

  // Fallback jika terjadi error atau tidak ada 'code' di URL
  console.error("Auth callback error: No code provided or session exchange failed.");
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

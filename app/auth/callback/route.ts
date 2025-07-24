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
        
        // --- PERBAIKAN LOGIKA DI SINI ---
        
        // 1. Ambil profil pengguna, pastikan untuk menyertakan 'has_selected_role'
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, has_selected_role') // Ambil kolom has_selected_role
            .eq('id', user.id)
            .single();

        // 2. Jika profil ada DAN peran sudah dipilih, arahkan ke dasbor yang benar
        if (profile && profile.has_selected_role) {
            const redirectUrl = profile.role === 'investor' 
                ? `${origin}/investor/dashboard` 
                : `${origin}/umkm/dashboard`;
            return NextResponse.redirect(redirectUrl);
        }
        
        // 3. Jika profil belum ada, atau peran belum dipilih, arahkan ke halaman pemilihan peran
        // Ini akan menangani pengguna baru dan pengguna lama yang belum selesai mendaftar.
        return NextResponse.redirect(`${origin}/auth/choose-role`);
    }
  }

  // Fallback jika terjadi error atau tidak ada 'code' di URL
  console.error("Auth callback error: No code provided or session exchange failed.");
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
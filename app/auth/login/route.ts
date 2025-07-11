// app/auth/login/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  
  // PERBAIKAN: Menggunakan createClient dari @supabase/ssr
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Redirect kembali ke halaman login dengan pesan error
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        status: 301,
      }
    )
  }

  // Redirect ke dashboard setelah login berhasil
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`, {
    status: 301,
  })
}

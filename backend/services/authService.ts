// backend/services/authService.ts
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { type EmailOtpType } from '@supabase/supabase-js'

export async function signUp(data: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  return { error };
}

export async function signIn(data: any) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    return { error };
}

export async function googleSignIn() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
    });

    return { data, error };
}

export async function signOut() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function verifyOtp(tokenHash: string, type: EmailOtpType) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    return { error };
}
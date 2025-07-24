import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getSupabaseRouteHandlerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name) => (await cookieStore).get(name)?.value,
      },
    }
  );
}

export async function getUserOrRedirect() {
    const supabase = getSupabaseRouteHandlerClient();
    const { data: { user } } = await (await supabase).auth.getUser();
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return user;
}
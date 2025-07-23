// app/api/auth/register/route.ts
import { signUp } from '@/backend/services/authService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error } = await signUp(body);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Registration successful. Please check your email to verify.' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Tangani error jika JSON tidak valid, dll.
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
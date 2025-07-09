// app/api/auth/sign-out/route.ts
import { signOut } from '@/backend/services/authService';
import { NextResponse } from 'next/server';

export async function POST() {
    const { error } = await signOut();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Signed out successfully' });
}
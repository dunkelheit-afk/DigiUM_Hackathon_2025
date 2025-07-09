// backend/utils/apiErrors.ts
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  // Error yang tidak terduga
  return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
}
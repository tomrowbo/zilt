// pages/api/payment-timeout.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Payment timed out:', await request.json());

  return NextResponse.json({ message: 'Timeout received' }, { status: 200 });
}

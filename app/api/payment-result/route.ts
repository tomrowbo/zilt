import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {


  console.log('Payment successful:', request.body);

  return NextResponse.json({data: "Success"}, {status: 200} );
}

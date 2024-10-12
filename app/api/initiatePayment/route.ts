// pages/api/initiate-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getAccessToken } from '@/utils/mpesa';
import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zilt.vercel.app/"; 

export async function POST(request: Request) {
  try {
    const accessToken = await getAccessToken();

    const paymentData = {
      InitiatorName: 'testapi',
      SecurityCredential: 'Safaricom999!#!',
      CommandID: 'BusinessPayment',
      Amount: '1000',
      PartyA: '600000',
      PartyB: '254708374149', // Test customer phone number
      Remarks: 'Test Payment',
      QueueTimeOutURL: `${baseUrl}/api/payment-timeout`,
      ResultURL: `${baseUrl}/api/payment-result`,
      Occasion: 'TestPayment',
    };

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest', paymentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import StellarSdk from 'stellar-sdk';

// Set up the Stellar server
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

export async function POST(request: NextRequest) {
  try {
    const { signedXdr } = await request.json();
    const transaction = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
    const result = await server.submitTransaction(transaction);
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return NextResponse.json({ error: (error as Error) }, { status: 500 });
  }
}


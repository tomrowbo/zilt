import { NextResponse, NextRequest } from 'next/server';
import StellarSdk, { BASE_FEE } from 'stellar-sdk';

// Set up the Stellar server
const STELLAR_SERVER_URL = process.env.STELLAR_SERVER_URL;
if (!STELLAR_SERVER_URL) {
  throw new Error('STELLAR_SERVER_URL environment variable is not set');
}
const server = new StellarSdk.Horizon.Server(STELLAR_SERVER_URL);

// Source wallet (USDC Liquidity Pool wallet)
const SOURCE_SECRET_KEY = process.env.SOURCE_SECRET_KEY;
if (!SOURCE_SECRET_KEY) {
  throw new Error('SOURCE_SECRET_KEY environment variable is not set');
}

// Define the USDC asset parameters
const USDC_ASSET_CODE = 'USDC';
const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export async function POST(request: NextRequest) {
    try {
        const { destinationId, amount } = await request.json();

        if (!destinationId || !amount) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Check if the destination account exists
        let destinationAccount;
        try {
            destinationAccount = await server.loadAccount(destinationId);
        } catch (error) {
            if (error instanceof StellarSdk.NotFoundError) {
                return NextResponse.json({ error: 'Destination account does not exist' }, { status: 404 });
            }
            return NextResponse.json({ error: 'Error loading destination account' }, { status: 500 });
        }

        // Check if USDC is in the trust list
        const hasTrustline = destinationAccount.balances.some(
            (balance: { asset_code: string; asset_issuer: string }) =>
                balance.asset_code === USDC_ASSET_CODE && balance.asset_issuer === USDC_ISSUER
        );

        if (!hasTrustline) {
            // Create a transaction to add USDC to the trust list
            const transaction = await createTrustLine(destinationId);
            
            // Return the transaction XDR for signing
            return NextResponse.json({ 
                requiresTrust: true, 
                transactionXDR: transaction.toXDR(),
                message: 'USDC trust line needs to be added. Please sign the transaction.'
            }, { status: 200 });
        }

        // If USDC is already in the trust list, proceed with the payment
        const result = await createPayment(destinationId, amount);
        return NextResponse.json({ success: true, result }, { status: 200 });

    } catch (error) {
        console.error("Something went wrong!", error);

        if (
            error instanceof Error &&
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            typeof error.response === 'object' &&
            error.response !== null &&
            'data' in error.response
        ) {
            const stellarError = error.response.data as StellarErrorResponse;
            console.error("Error details:", JSON.stringify(stellarError, null, 2));
        }
        throw error;
    }
}


async function createTrustLine(destinationPublicKey: string) {
    const destinationAccount = await server.loadAccount(destinationPublicKey);
    
    // Create a new transaction for creating a trust line
    const transaction = new StellarSdk.TransactionBuilder(
        destinationAccount, {
          fee: BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET
        })
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(USDC_ASSET_CODE, USDC_ISSUER),
            limit: "100",
        }))
        .setTimeout(180)
        .build();

    return transaction;
}


// Function to create a payment
async function createPayment(destinationPublicKey: string, amount: string) {
    const sourceKeys = StellarSdk.Keypair.fromSecret(SOURCE_SECRET_KEY);
    let sourceAccount = await server.loadAccount(sourceKeys.publicKey());

    // Check if source account has USDC trustline
    const hasSourceTrustline = sourceAccount.balances.some(
        (balance: { asset_code: string; asset_issuer: string }) =>
            balance.asset_code === USDC_ASSET_CODE && balance.asset_issuer === USDC_ISSUER
    );

    let transaction;

    if (!hasSourceTrustline) {
        // Create a transaction to add USDC trustline for source account
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: new StellarSdk.Asset(USDC_ASSET_CODE, USDC_ISSUER),
            }))
            .setTimeout(180)
            .build();

        transaction.sign(sourceKeys);
        await server.submitTransaction(transaction);

        // Reload the source account to get the updated state
        sourceAccount = await server.loadAccount(sourceKeys.publicKey());
    }

    // Create the payment transaction
    transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
    })
        .addOperation(
            StellarSdk.Operation.payment({
                destination: destinationPublicKey,
                asset: new StellarSdk.Asset(USDC_ASSET_CODE, USDC_ISSUER),
                amount: amount.toString(),
            })
        )
        .addMemo(StellarSdk.Memo.text("Test Transaction"))
        .setTimeout(180)
        .build();

    transaction.sign(sourceKeys);

    try {
        const result = await server.submitTransaction(transaction);
        console.log("Transaction submitted successfully:", result);
        return result;
    } catch (error) {
        console.error("Transaction submission failed:", error);
        if (
          error instanceof Error &&
          typeof (error as any).response === 'object' &&
          (error as any).response !== null &&
          'data' in (error as any).response
        ) {
          const stellarError = (error as any).response.data as StellarErrorResponse;
          console.error("Error details:", JSON.stringify(stellarError, null, 2));
        }
        throw error;
    }
}

interface StellarError {
    type?: string;
    title?: string;
    extras?: {
        result_codes?: {
            transaction?: string;
            operations?: string[];
        };
        [key: string]: any;
    };
}

interface StellarErrorResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    extras?: {
        envelope_xdr?: string;
        result_codes?: {
            transaction?: string;
            operations?: string[];
        };
        result_xdr?: string;
    };
}

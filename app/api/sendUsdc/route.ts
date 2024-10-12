import { NextResponse, NextRequest } from 'next/server';
import StellarSdk from 'stellar-sdk';

// Set up the Stellar server
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

// Hardcoded source wallet (USDC Liquidity Pool wallet)
const SOURCE_SECRET_KEY = process.env.SOURCE_SECRET_KEY || 'SCR4T2LUTYVOR3ND4FXV6ZKICY3GZECJUCBPSRIIA7RQ7NDHM3ZOBZNC';
const SOURCE_PUBLIC_KEY = StellarSdk.Keypair.fromSecret(SOURCE_SECRET_KEY).publicKey();

// Define the USDC asset parameters
const USDC_ASSET_CODE = 'USDC';
const USDC_ISSUER = 'GCHJ2UR35IBGXMSYWWCON2WG4KLXDU2MKKGTBLFL4QIUBYY26GU7IX7Q';

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

        // Check if the destination account has a trustline for USDC
        const hasTrustline = destinationAccount.balances.some(
            (balance: { asset_code: string; asset_issuer: string }) =>
                balance.asset_code === USDC_ASSET_CODE && balance.asset_issuer === USDC_ISSUER
        );

        if (!hasTrustline) {
            console.log("Creating trustline because the destination lacks a trustline.");
            await createClaimableBalance(destinationId, amount);
        }

        // Now that the trustline is ensured, proceed with the payment
        const result = await createPayment(destinationId, amount);
        return NextResponse.json({ success: true, result }, { status: 200 });

    } catch (error) {
        console.error("Something went wrong!", error);

        if (error instanceof Error && 'response' in error && error.response && 
            typeof (error.response as any).data === 'object' && (error.response as any).data !== null) {
            const stellarError = (error.response as any).data;
            return NextResponse.json({
                error: 'Transaction failed',
                status: 400,
                detail: stellarError.detail || 'The transaction failed when submitted to the Stellar network.',
                resultCodes: stellarError.extras?.result_codes || 'No result codes available',
                type: stellarError.type || 'Unknown error type',
                title: stellarError.title || 'Transaction Failed',
                extras: JSON.stringify(stellarError.extras) || 'No extra information available',
            });
        }

        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}

async function createClaimableBalance(destinationPublicKey: string, amount: string) {
    try {
        const sourceKeys = StellarSdk.Keypair.fromSecret(SOURCE_SECRET_KEY);
        const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
                StellarSdk.Operation.createClaimableBalance({
                    asset: new StellarSdk.Asset(USDC_ASSET_CODE, USDC_ISSUER),
                    amount: amount.toString(),
                    claimants: [
                        new StellarSdk.Claimant(destinationPublicKey, 
                            StellarSdk.Claimant.predicateUnconditional()
                        ),
                    ],
                })
            )
            .setTimeout(180)
            .build();

        transaction.sign(sourceKeys);

        const result = await server.submitTransaction(transaction);
        console.log("Claimable balance created successfully:", result);
        return result;
    } catch (error) {
        console.error("Error creating claimable balance:", error);
        throw error;
    }
}

// Function to create a payment
async function createPayment(destinationPublicKey: string, amount: string) {
    const sourceKeys = StellarSdk.Keypair.fromSecret(SOURCE_SECRET_KEY);
    const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
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

    const result = await server.submitTransaction(transaction);
    console.log("Transaction submitted successfully:", result);
    return result;
}

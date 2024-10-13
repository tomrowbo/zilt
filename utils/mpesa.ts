import axios from 'axios';

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

if (!consumerKey || !consumerSecret) {
  throw new Error('MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET environment variable is not set');
}

export async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  return response.data.access_token;
}

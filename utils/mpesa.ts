import axios from 'axios';

//TODO: Extract to .env
const consumerKey = 'tsMS93qRb8PGq61Prs5e2afzxEfnDnblmjduLkJG1wJDKev7';
const consumerSecret = 'eEeByht1SY6FejjONGOA5iTYP6PuN3OkAsCqkWDYh2kzqxQpdz3LitnumjErrP2G';

export async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  return response.data.access_token;
}

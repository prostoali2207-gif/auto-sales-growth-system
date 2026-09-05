const APP_ID = process.env.META_APP_ID || '1036308845860183';
const CONFIG_ID = process.env.META_LOGIN_CONFIG_ID || '28303278495958378';
const REDIRECT_URI = 'https://auto-sales-growth-system.vercel.app/api/meta/oauth-callback';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');
  const url = new URL('https://www.facebook.com/dialog/oauth');
  url.searchParams.set('client_id', APP_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('config_id', CONFIG_ID);
  res.status(302).setHeader('location', url.toString());
  res.end();
}
const APP_ID = process.env.META_APP_ID || '1036308845860183';
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v26.0';
const REDIRECT_URI = 'https://auto-sales-growth-system.vercel.app/api/meta/oauth-callback';

function html(res, status, title, body) {
  res.status(status).setHeader('content-type', 'text/html; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.send('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title></head><body style="font-family:Arial,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;line-height:1.55">'+body+'</body></html>');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return html(res, 405, 'Method not allowed', '<h1>Method not allowed</h1>');
  if (req.query?.error) return html(res, 400, 'Meta authorization failed', '<h1>Meta authorization failed</h1><p>Authorization was not completed.</p>');

  const code = String(req.query?.code || '');
  if (!code) return html(res, 400, 'Missing authorization code', '<h1>Missing authorization code</h1>');

  const secret = process.env.META_APP_SECRET;
  if (!secret) return html(res, 503, 'Meta app secret not configured', '<h1>Redirect is working</h1><p>The server still needs META_APP_SECRET in Vercel before token exchange.</p>');

  const url = new URL('https://graph.facebook.com/'+GRAPH_VERSION+'/oauth/access_token');
  url.searchParams.set('client_id', APP_ID);
  url.searchParams.set('client_secret', secret);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('code', code);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) return html(res, 502, 'Token exchange failed', '<h1>Token exchange failed</h1>');

  return html(res, 200, 'Meta authorization received', '<h1>Meta authorization received</h1><p>The authorization code was exchanged successfully. The access token is not displayed.</p>');
}
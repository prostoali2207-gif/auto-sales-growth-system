import crypto from 'node:crypto';

function decode(input) {
  const value = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(value + '='.repeat((4 - value.length % 4) % 4), 'base64');
}

function verifySignedRequest(signedRequest, secret) {
  const parts = String(signedRequest || '').split('.');
  if (parts.length !== 2) return null;
  const expected = crypto.createHmac('sha256', secret).update(parts[1]).digest();
  const actual = decode(parts[0]);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
  return JSON.parse(decode(parts[1]).toString('utf8'));
}

export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const secret = process.env.META_APP_SECRET;
  if (!secret) return res.status(503).json({ error: 'meta_app_secret_not_configured' });

  let payload;
  try {
    payload = verifySignedRequest(req.body?.signed_request, secret);
  } catch {
    payload = null;
  }
  if (!payload) return res.status(400).json({ error: 'invalid_signed_request' });

  const confirmation = crypto.createHash('sha256')
    .update(String(payload.user_id || '') + ':' + Date.now())
    .digest('hex')
    .slice(0, 24);

  return res.status(200).json({
    url: 'https://auto-sales-growth-system.vercel.app/api/meta/data-deletion',
    confirmation_code: confirmation
  });
}
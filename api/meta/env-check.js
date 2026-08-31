const DEADLINE = Date.parse('2026-08-31T15:20:00Z');

const NAMES = [
  'META_ACCESS_TOKEN',
  'META_APP_ID',
  'META_APP_SECRET',
  'FACEBOOK_ACCESS_TOKEN',
  'FACEBOOK_PAGE_ACCESS_TOKEN',
  'INSTAGRAM_ACCESS_TOKEN',
  'FB_APP_ID',
  'FB_APP_SECRET'
];

export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  if (Date.now() > DEADLINE) return res.status(410).json({ ok: false, error: 'probe_expired' });

  const present = Object.fromEntries(NAMES.map((name) => [name, Boolean(process.env[name])]));
  return res.status(200).json({ ok: true, present });
}

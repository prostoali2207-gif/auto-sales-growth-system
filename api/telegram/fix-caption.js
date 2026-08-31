const DEADLINE = Date.parse('2026-08-31T14:00:00Z');
const CHAT_ID = '-1003963335180';
const MESSAGE_ID = 149;
const CAPTION = [
  '🚗 Hyundai Elantra GT 2020 — AM-002',
  '💰 AED 21,000',
  'Mileage: 92,500 km',
  'Engine: 2.0L petrol | FWD',
  'Condition: Average',
  'Known history: front-end damage; salvage title (TX).',
  'Status: Available | Payment: cash',
  '',
  '📍 Ajman Auto Market, Showroom 171',
  '📲 WhatsApp +971 50 978 6337',
  'Updated: 31 Aug 2026'
].join('\n');

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  if (Date.now() > DEADLINE) return res.status(410).json({ ok: false, error: 'expired' });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(503).json({ ok: false, error: 'missing_bot_token' });
  const response = await fetch(`https://api.telegram.org/bot${token}/editMessageCaption`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, message_id: MESSAGE_ID, caption: CAPTION })
  });
  const data = await response.json().catch(() => ({}));
  return res.status(response.ok && data.ok ? 200 : 502).json({ ok: Boolean(response.ok && data.ok), description: data.description || null, message_id: data.result?.message_id || null });
}

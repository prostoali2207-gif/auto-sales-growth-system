const DEADLINE = Date.parse('2026-08-21T09:45:00Z');
const WEBHOOK_URL = 'https://auto-sales-growth-system.vercel.app/api/telegram/webhook';

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false });
  if (Date.now() > DEADLINE) return json(res, 410, { ok: false, error: 'bootstrap_expired' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) return json(res, 503, { ok: false, error: 'missing_env' });

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      secret_token: secret,
      allowed_updates: [
        'business_connection',
        'business_message',
        'edited_business_message',
        'deleted_business_messages'
      ],
      drop_pending_updates: false
    })
  });

  const data = await response.json().catch(() => ({}));
  return json(res, response.ok ? 200 : 502, {
    ok: Boolean(data.ok),
    description: data.description || null
  });
}

import crypto from 'node:crypto';

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return json(res, 200, { ok: true, service: 'telegram-business-ingress' });
  }

  if (req.method !== 'POST') return json(res, 405, { ok: false });

  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return json(res, 503, { ok: false, error: 'webhook_not_configured' });

  const supplied = req.headers['x-telegram-bot-api-secret-token'];
  const a = Buffer.from(String(supplied || ''));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return json(res, 401, { ok: false });
  }

  const update = req.body || {};
  const message = update.business_message || update.edited_business_message || null;

  // Transport only: no autonomous customer reply until the existing Sales
  // authority/business-fact gates are wired and tested end-to-end.
  if (message) {
    console.log(JSON.stringify({
      event: 'telegram_business_message_received',
      update_id: update.update_id,
      business_connection_id: message.business_connection_id || null,
      chat_id: message.chat?.id || null,
      message_id: message.message_id || null,
      received_at: new Date().toISOString()
    }));
  }

  return json(res, 200, { ok: true });
}

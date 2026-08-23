import publishHandler from './publish.js';

const DEADLINE = Date.parse('2026-08-23T03:30:00Z');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  if (Date.now() > DEADLINE) {
    res.status(410).json({ ok: false, error: 'smoke_expired' });
    return;
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).json({ ok: false, error: 'missing_secret' });
    return;
  }

  const mockReq = {
    method: 'POST',
    headers: { 'x-telegram-bot-api-secret-token': secret },
    body: {
      platform: 'TELEGRAM',
      chat_id: '-1003963335180',
      text: 'SYSTEM TEST — Telegram publishing connection verified.',
      experiment_id: 'telegram_transport_live_smoke',
      experiment_version: '1',
      content_spec_id: 'telegram_live_smoke_spec',
      creative_id: 'telegram_live_smoke_creative',
      render_id: null,
      distribution_mode: 'OWNED',
      tracking: { attribution_token: null, destination: null, vehicle_ids: [] },
      approval: {
        approved_by: 'HUMAN_USER',
        approved_at: new Date().toISOString(),
        approval_id: 'telegram-live-smoke-user-approved-2026-08-23'
      },
      execute: true
    }
  };

  let statusCode = 200;
  let payload = null;
  const mockRes = {
    status(code) { statusCode = code; return this; },
    setHeader() { return this; },
    send(body) {
      try { payload = JSON.parse(body); } catch { payload = body; }
      return this;
    }
  };

  await publishHandler(mockReq, mockRes);
  res.status(statusCode).json({ smoke: 'telegram_publish_live_once', result: payload });
}

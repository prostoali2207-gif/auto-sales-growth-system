import publishHandler from './publish.js';

const DEADLINE = Date.parse('2026-08-22T20:15:00Z');

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false });
  if (Date.now() > DEADLINE) return json(res, 410, { ok: false, error: 'smoke_expired' });

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return json(res, 503, { ok: false, error: 'missing_secret' });

  let statusCode = 200;
  let payload = null;
  const mockReq = {
    method: 'POST',
    headers: { 'x-telegram-bot-api-secret-token': secret },
    body: {
      platform: 'TELEGRAM',
      chat_id: '-1003963335180',
      text: 'DRY RUN ONLY — no Telegram mutation',
      experiment_id: 'telegram_transport_smoke',
      experiment_version: '1',
      content_spec_id: 'telegram_smoke_spec',
      creative_id: 'telegram_smoke_creative',
      distribution_mode: 'OWNED',
      tracking: { attribution_token: null, destination: null, vehicle_ids: [] },
      approval: {
        approved_by: 'SYSTEM_SMOKE_TEST',
        approved_at: new Date().toISOString(),
        approval_id: 'telegram-smoke-dry-run-2026-08-22'
      },
      execute: false
    }
  };
  const mockRes = {
    status(code) { statusCode = code; return this; },
    setHeader() { return this; },
    send(body) { payload = typeof body === 'string' ? JSON.parse(body) : body; return this; }
  };

  await publishHandler(mockReq, mockRes);
  return json(res, statusCode, {
    smoke: 'telegram_publish_dry_run',
    expected_no_mutation: true,
    result: payload
  });
}

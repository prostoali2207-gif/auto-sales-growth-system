import crypto from 'node:crypto';

const OWNED_TELEGRAM_CHANNEL_ID = '-1003963335180';
const OWNED_TELEGRAM_CHANNEL_USERNAME = 'Almusafir_car_market';

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}

function secureEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function stableId(prefix, ...parts) {
  const digest = crypto.createHash('sha256').update(parts.map(String).join(':')).digest('hex').slice(0, 24);
  return `${prefix}_${digest}`;
}

function validateRequest(body) {
  const errors = [];
  if (String(body?.platform || '') !== 'TELEGRAM') errors.push('platform');
  if (String(body?.chat_id || '') !== OWNED_TELEGRAM_CHANNEL_ID) errors.push('chat_id');
  if (typeof body?.text !== 'string' || !body.text.trim()) errors.push('text');

  for (const key of ['experiment_id', 'experiment_version', 'content_spec_id', 'creative_id']) {
    if (typeof body?.[key] !== 'string' || !body[key].trim()) errors.push(key);
  }

  const approval = body?.approval;
  if (!approval || typeof approval !== 'object') {
    errors.push('approval');
  } else {
    for (const key of ['approved_by', 'approved_at', 'approval_id']) {
      if (typeof approval?.[key] !== 'string' || !approval[key].trim()) errors.push(`approval.${key}`);
    }
    if (approval?.approved_at && Number.isNaN(Date.parse(approval.approved_at))) errors.push('approval.approved_at');
  }

  if (body?.execute !== true && body?.execute !== false) errors.push('execute');
  return [...new Set(errors)];
}

function buildPreview(body) {
  return {
    platform: 'TELEGRAM',
    chat_id: OWNED_TELEGRAM_CHANNEL_ID,
    channel_username: OWNED_TELEGRAM_CHANNEL_USERNAME,
    text: body.text.trim(),
    experiment_id: body.experiment_id,
    experiment_version: body.experiment_version,
    content_spec_id: body.content_spec_id,
    creative_id: body.creative_id,
    render_id: body.render_id ?? null,
    distribution_mode: body.distribution_mode || 'OWNED',
    tracking: body.tracking || { attribution_token: null, destination: null, vehicle_ids: [] },
    approval: body.approval,
    operation_id: stableId('tg_publish_op', body.approval.approval_id, body.creative_id, OWNED_TELEGRAM_CHANNEL_ID)
  };
}

async function sendTelegramChannelMessage(token, text) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: OWNED_TELEGRAM_CHANNEL_ID, text })
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' });

  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return json(res, 503, { ok: false, error: 'publisher_not_configured' });
  if (!secureEqual(req.headers['x-telegram-bot-api-secret-token'], expected)) {
    return json(res, 401, { ok: false, error: 'unauthorized' });
  }

  const body = req.body || {};
  const errors = validateRequest(body);
  if (errors.length) return json(res, 400, { ok: false, error: 'invalid_publish_request', fields: errors });

  const preview = buildPreview(body);

  if (body.execute !== true) {
    console.log(JSON.stringify({
      event: 'telegram_publish_preview_validated',
      operation_id: preview.operation_id,
      approval_id: body.approval.approval_id,
      chat_id: OWNED_TELEGRAM_CHANNEL_ID,
      openai_call: false,
      telegram_mutation: false,
      received_at: new Date().toISOString()
    }));
    return json(res, 200, { ok: true, mode: 'DRY_RUN', mutation_performed: false, preview });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return json(res, 503, { ok: false, error: 'missing_bot_token' });

  const { response, data } = await sendTelegramChannelMessage(token, preview.text);
  const publishedAt = new Date().toISOString();

  if (!response.ok || !data.ok || !data.result?.message_id) {
    console.log(JSON.stringify({
      event: 'telegram_publish_failed',
      operation_id: preview.operation_id,
      approval_id: body.approval.approval_id,
      chat_id: OWNED_TELEGRAM_CHANNEL_ID,
      telegram_http_status: response.status,
      telegram_description: data.description || null,
      openai_call: false,
      received_at: publishedAt
    }));
    return json(res, 502, { ok: false, error: 'telegram_publish_failed', description: data.description || null });
  }

  const platformContentId = String(data.result.message_id);
  const publishRecord = {
    publish_id: stableId('publish', preview.operation_id, platformContentId),
    experiment_id: body.experiment_id,
    experiment_version: body.experiment_version,
    content_spec_id: body.content_spec_id,
    creative_id: body.creative_id,
    render_id: body.render_id ?? null,
    platform: 'TELEGRAM',
    platform_content_id: platformContentId,
    url: `https://t.me/${OWNED_TELEGRAM_CHANNEL_USERNAME}/${platformContentId}`,
    published_at: publishedAt,
    timezone: 'Asia/Dubai',
    distribution_mode: body.distribution_mode || 'OWNED',
    actual_execution: {
      duration_seconds: null,
      block_timestamps: [],
      deviations: []
    },
    tracking: body.tracking || { attribution_token: null, destination: null, vehicle_ids: [] },
    approval: body.approval,
    status: 'PUBLISHED',
    failure_reason: null
  };

  console.log(JSON.stringify({
    event: 'telegram_publish_executed',
    operation_id: preview.operation_id,
    approval_id: body.approval.approval_id,
    chat_id: OWNED_TELEGRAM_CHANNEL_ID,
    platform_content_id: platformContentId,
    publish_id: publishRecord.publish_id,
    openai_call: false,
    telegram_mutation: true,
    published_at: publishedAt
  }));

  return json(res, 200, { ok: true, mode: 'EXECUTED', mutation_performed: true, publish_record: publishRecord });
}

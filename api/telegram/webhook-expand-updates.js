const REQUIRED_UPDATES = [
  'business_connection',
  'business_message',
  'edited_business_message',
  'deleted_business_messages',
  'message',
  'edited_message',
  'channel_post',
  'edited_channel_post'
];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) return res.status(503).json({ ok: false, error: 'missing_telegram_environment' });

  try {
    const infoResponse = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const info = await infoResponse.json().catch(() => ({}));
    const currentUrl = info?.result?.url;
    if (!infoResponse.ok || !info.ok || !currentUrl) {
      return res.status(502).json({ ok: false, error: 'cannot_resolve_existing_webhook' });
    }

    const setResponse = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url: currentUrl,
        secret_token: secret,
        allowed_updates: REQUIRED_UPDATES,
        drop_pending_updates: false
      })
    });
    const setData = await setResponse.json().catch(() => ({}));
    if (!setResponse.ok || !setData.ok) {
      return res.status(502).json({ ok: false, error: 'setWebhook_failed', description: setData.description || null });
    }

    const verifyResponse = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const verify = await verifyResponse.json().catch(() => ({}));
    return res.status(200).json({
      ok: Boolean(verifyResponse.ok && verify.ok),
      allowed_updates: Array.isArray(verify?.result?.allowed_updates) ? verify.result.allowed_updates : null,
      pending_update_count: verify?.result?.pending_update_count ?? null,
      last_error_message: verify?.result?.last_error_message ?? null
    });
  } catch {
    return res.status(502).json({ ok: false, error: 'telegram_request_failed' });
  }
}

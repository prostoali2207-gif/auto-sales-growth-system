export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(503).json({ ok: false, error: 'missing_bot_token' });

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      return res.status(502).json({ ok: false, error: 'telegram_getWebhookInfo_failed', description: data.description || null });
    }

    const result = data.result || {};
    return res.status(200).json({
      ok: true,
      webhook: {
        has_url: Boolean(result.url),
        pending_update_count: result.pending_update_count ?? null,
        max_connections: result.max_connections ?? null,
        allowed_updates: Array.isArray(result.allowed_updates) ? result.allowed_updates : null,
        last_error_date: result.last_error_date ?? null,
        last_error_message: result.last_error_message ?? null,
        has_custom_certificate: Boolean(result.has_custom_certificate),
        ip_address: result.ip_address || null
      }
    });
  } catch {
    return res.status(502).json({ ok: false, error: 'telegram_request_failed' });
  }
}

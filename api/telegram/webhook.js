import crypto from 'node:crypto';

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}

function stableId(prefix, ...parts) {
  const digest = crypto.createHash('sha256').update(parts.map(String).join(':')).digest('hex').slice(0, 24);
  return `${prefix}_${digest}`;
}

function normalizeTelegramBusinessMessage(update, message) {
  const receivedAt = new Date().toISOString();
  const occurredAt = message.date ? new Date(message.date * 1000).toISOString() : receivedAt;
  const businessConnectionId = String(message.business_connection_id || 'unknown');
  const chatId = String(message.chat?.id || 'unknown');
  const messageId = String(message.message_id || 'unknown');
  const eventId = stableId('tg_evt', update.update_id ?? 'unknown', businessConnectionId, chatId, messageId);
  const inquiryId = stableId('tg_inquiry', businessConnectionId, chatId, messageId);
  const threadId = `telegram:${businessConnectionId}:${chatId}`;
  const text = typeof message.text === 'string' ? message.text : (typeof message.caption === 'string' ? message.caption : '');

  const touch = {
    touch_id: stableId('tg_touch', eventId),
    occurred_at: occurredAt,
    channel: 'TELEGRAM',
    source_type: 'DIRECT',
    experiment_id: null,
    content_spec_id: null,
    content_id: null,
    platform_content_id: null,
    campaign_id: null,
    vehicle_id: null,
    cta_keyword: null,
    url: null,
    evidence_type: 'THREAD_METADATA',
    evidence_reference: eventId
  };

  return {
    input: {
      run_context: {
        run_id: stableId('sales_run', eventId),
        occurred_at: receivedAt,
        business_id: businessConnectionId,
        timezone: 'Asia/Dubai',
        agent_version: 'sales-lead-conversion',
        policy_version: 'telegram-ingress-v1',
        // Ingress cannot autonomously send or mutate commercial state.
        permitted_actions: ['DRAFT_MESSAGE', 'READ_FACTS', 'SEARCH_INVENTORY', 'REQUEST_HANDOFF', 'EMIT_EVENT']
      },
      inquiry: {
        inquiry_id: inquiryId,
        event_id: eventId,
        channel: 'TELEGRAM',
        thread_id: threadId,
        received_at: occurredAt,
        direction: 'INBOUND',
        raw_text: text,
        attachments: [],
        identity_hints: {
          telegram_user_id: message.from?.id ? String(message.from.id) : null,
          username: message.from?.username || null,
          first_name: message.from?.first_name || null,
          language_code: message.from?.language_code || null
        }
      },
      lead_snapshot: null,
      attribution: {
        attribution_id: stableId('tg_attr', inquiryId),
        lead_id: null,
        inquiry_id: inquiryId,
        inquiry_channel: 'TELEGRAM',
        inquiry_thread_id: threadId,
        captured_at: receivedAt,
        first_touch: touch,
        last_non_direct_touch: null,
        touches: [touch],
        experiment_id: null,
        content_spec_id: null,
        content_id: null,
        platform_content_id: null,
        campaign_id: null,
        ad_id: null,
        advertised_vehicle_id: null,
        inquired_vehicle_id: null,
        cta_keyword: null,
        landing_url: null,
        referrer_url: null,
        confidence: 'UNKNOWN',
        confidence_reason: 'Telegram thread metadata proves the inquiry channel, but no upstream content/ad touch is established.',
        sale_credit: 'UNKNOWN',
        raw_capture: {
          telegram_update_id: update.update_id ?? null,
          business_connection_id: businessConnectionId,
          chat_id: chatId,
          message_id: messageId
        },
        normalization_version: 'telegram-business-v1',
        correction_history: []
      },
      verified_facts: [],
      conversation_history: {
        messages: [{
          message_id: messageId,
          occurred_at: occurredAt,
          direction: 'INBOUND',
          actor_type: 'CUSTOMER',
          text
        }],
        traceable_summary: null,
        summary_source_event_ids: [eventId]
      }
    }
  };
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

  // Transport + deterministic normalization only. Autonomous customer replies stay
  // disabled until the existing Sales authority/business-fact gates are executable.
  if (message) {
    const turn = normalizeTelegramBusinessMessage(update, message);
    console.log(JSON.stringify({
      event: 'telegram_sales_turn_normalized',
      update_id: update.update_id,
      business_connection_id: message.business_connection_id || null,
      chat_id: message.chat?.id || null,
      message_id: message.message_id || null,
      inquiry_id: turn.input.inquiry.inquiry_id,
      event_id: turn.input.inquiry.event_id,
      channel: turn.input.inquiry.channel,
      attribution_confidence: turn.input.attribution.confidence,
      received_at: new Date().toISOString()
    }));
  }

  return json(res, 200, { ok: true });
}

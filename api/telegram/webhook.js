import crypto from 'node:crypto';

const TELEGRAM_CHAT_ROUTES = Object.freeze({
  '-1003963335180': Object.freeze({
    kind: 'OWNED_CHANNEL',
    owner: 'PUBLISHER_HUMAN',
    workflow_role: 'PUBLICATION_CHANNEL',
    mode: 'OBSERVE_ONLY',
    publish_requires_human_approval: true
  })
});

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}

function stableId(prefix, ...parts) {
  const digest = crypto.createHash('sha256').update(parts.map(String).join(':')).digest('hex').slice(0, 24);
  return `${prefix}_${digest}`;
}

async function sendTelegramBusinessMessage(message, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, reason: 'missing_bot_token' };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      business_connection_id: message.business_connection_id,
      chat_id: message.chat?.id,
      text
    })
  });
  const data = await response.json().catch(() => ({}));
  return { ok: Boolean(response.ok && data.ok), description: data.description || null };
}

async function sendControlledTestAck(message, turn) {
  const text = typeof message.text === 'string' ? message.text.trim() : '';
  if (text !== '#SYSTEM_TEST') return { attempted: false };

  const sent = await sendTelegramBusinessMessage(
    message,
    `SYSTEM TEST PASSED\nchannel=TELEGRAM\ninquiry=${turn.input.inquiry.inquiry_id}`
  );
  return { attempted: true, ...sent };
}

const SALES_DRAFT_TEST_PREFIX = '#SALES_TEST ';

async function runControlledSalesDraftTest(message, turn) {
  const raw = typeof message.text === 'string' ? message.text.trim() : '';
  if (!raw.startsWith(SALES_DRAFT_TEST_PREFIX)) return { attempted: false };

  const customerText = raw.slice(SALES_DRAFT_TEST_PREFIX.length).trim();
  if (!customerText) {
    const sent = await sendTelegramBusinessMessage(message, 'SALES TEST BLOCKED\nreason=empty_test_message');
    return { attempted: true, generated: false, sent };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.SALES_MODEL;
  if (!apiKey || !model) {
    const missing = [!apiKey ? 'OPENAI_API_KEY' : null, !model ? 'SALES_MODEL' : null].filter(Boolean).join(',');
    const sent = await sendTelegramBusinessMessage(message, `SALES TEST BLOCKED\nmissing=${missing}`);
    return { attempted: true, generated: false, reason: `missing:${missing}`, sent };
  }

  const input = structuredClone(turn.input);
  input.inquiry.raw_text = customerText;
  input.conversation_history.messages[0].text = customerText;

  const system = [
    'You are the existing Sales / Lead Conversion specialist for a UAE used-car showroom, running in DRAFT-ONLY TEST mode.',
    'Produce only a concise customer-facing draft reply to the inbound Telegram message.',
    'Use only verified_facts supplied in the input for commercial facts.',
    'Never invent price, availability, mileage, condition/history, discount, finance, warranty, location, appointment slot, scarcity, or approval.',
    'If a requested commercial fact is missing, say it needs confirmation and move the conversation forward with at most one or two useful questions.',
    'Do not claim that any message, appointment, reservation, lead update, or handoff was executed.',
    'Do not negotiate, promise discounts, approve finance, value trade-ins, take deposits, or bind the business.',
    'Prefer the smallest sensible next commitment toward qualification, showroom visit, or test drive, but only using verified facts.',
    'Reply in the same language as the customer where possible.',
    'No markdown labels, no internal reasoning, no policy explanation.'
  ].join(' ');

  let draft;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'developer', content: system },
          { role: 'user', content: JSON.stringify({ input }) }
        ]
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const sent = await sendTelegramBusinessMessage(message, `SALES TEST BLOCKED\nmodel_http=${response.status}`);
      return { attempted: true, generated: false, reason: `model_http:${response.status}`, sent };
    }
    draft = data?.choices?.[0]?.message?.content?.trim();
  } catch (error) {
    const sent = await sendTelegramBusinessMessage(message, 'SALES TEST BLOCKED\nreason=model_request_failed');
    return { attempted: true, generated: false, reason: 'model_request_failed', sent };
  }

  if (!draft) {
    const sent = await sendTelegramBusinessMessage(message, 'SALES TEST BLOCKED\nreason=empty_model_output');
    return { attempted: true, generated: false, reason: 'empty_model_output', sent };
  }

  const sent = await sendTelegramBusinessMessage(
    message,
    `SALES DRAFT TEST\n---\n${draft}\n---\nNOT LIVE AUTO-REPLY`
  );
  return { attempted: true, generated: true, sent };
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
    touch_id: stableId('tg_touch', eventId), occurred_at: occurredAt, channel: 'TELEGRAM', source_type: 'DIRECT',
    experiment_id: null, content_spec_id: null, content_id: null, platform_content_id: null, campaign_id: null,
    vehicle_id: null, cta_keyword: null, url: null, evidence_type: 'THREAD_METADATA', evidence_reference: eventId
  };

  return { input: {
    run_context: { run_id: stableId('sales_run', eventId), occurred_at: receivedAt, business_id: businessConnectionId,
      timezone: 'Asia/Dubai', agent_version: 'sales-lead-conversion', policy_version: 'telegram-ingress-v1',
      permitted_actions: ['DRAFT_MESSAGE', 'READ_FACTS', 'SEARCH_INVENTORY', 'REQUEST_HANDOFF', 'EMIT_EVENT'] },
    inquiry: { inquiry_id: inquiryId, event_id: eventId, channel: 'TELEGRAM', thread_id: threadId, received_at: occurredAt,
      direction: 'INBOUND', raw_text: text, attachments: [], identity_hints: {
        telegram_user_id: message.from?.id ? String(message.from.id) : null, username: message.from?.username || null,
        first_name: message.from?.first_name || null, language_code: message.from?.language_code || null } },
    lead_snapshot: null,
    attribution: { attribution_id: stableId('tg_attr', inquiryId), lead_id: null, inquiry_id: inquiryId, inquiry_channel: 'TELEGRAM',
      inquiry_thread_id: threadId, captured_at: receivedAt, first_touch: touch, last_non_direct_touch: null, touches: [touch],
      experiment_id: null, content_spec_id: null, content_id: null, platform_content_id: null, campaign_id: null, ad_id: null,
      advertised_vehicle_id: null, inquired_vehicle_id: null, cta_keyword: null, landing_url: null, referrer_url: null,
      confidence: 'UNKNOWN', confidence_reason: 'Telegram thread metadata proves the inquiry channel, but no upstream content/ad touch is established.',
      sale_credit: 'UNKNOWN', raw_capture: { telegram_update_id: update.update_id ?? null, business_connection_id: businessConnectionId,
        chat_id: chatId, message_id: messageId }, normalization_version: 'telegram-business-v1', correction_history: [] },
    verified_facts: [],
    conversation_history: { messages: [{ message_id: messageId, occurred_at: occurredAt, direction: 'INBOUND', actor_type: 'CUSTOMER', text }],
      traceable_summary: null, summary_source_event_ids: [eventId] }
  }};
}

function observeTelegramChatUpdate(update) {
  const candidates = [
    ['message', update.message],
    ['edited_message', update.edited_message],
    ['channel_post', update.channel_post],
    ['edited_channel_post', update.edited_channel_post]
  ];
  const [updateType, message] = candidates.find(([, value]) => value) || [];
  if (!message) return null;

  const chat = message.chat || {};
  const chatType = chat.type || 'unknown';
  if (!['group', 'supergroup', 'channel'].includes(chatType)) return null;

  const receivedAt = new Date().toISOString();
  const occurredAt = message.date ? new Date(message.date * 1000).toISOString() : receivedAt;
  const chatId = String(chat.id ?? 'unknown');
  const messageId = String(message.message_id ?? 'unknown');
  const eventId = stableId('tg_chat_evt', update.update_id ?? 'unknown', updateType, chatId, messageId);
  const text = typeof message.text === 'string' ? message.text : (typeof message.caption === 'string' ? message.caption : '');
  const route = TELEGRAM_CHAT_ROUTES[chatId] || null;

  return {
    event: 'telegram_chat_update_observed',
    event_id: eventId,
    update_id: update.update_id ?? null,
    update_type: updateType,
    chat: {
      id: chatId,
      type: chatType,
      title: chat.title || null,
      username: chat.username || null
    },
    message: {
      id: messageId,
      occurred_at: occurredAt,
      text,
      sender: {
        id: message.from?.id ? String(message.from.id) : null,
        username: message.from?.username || null,
        first_name: message.from?.first_name || null,
        is_bot: typeof message.from?.is_bot === 'boolean' ? message.from.is_bot : null
      }
    },
    route: route ? { ...route } : null,
    routing_status: route ? 'ROUTED_BY_EXACT_CHAT_ID' : 'OBSERVED_UNROUTED',
    downstream_dispatch: false,
    openai_call: false,
    telegram_mutation: false,
    received_at: receivedAt
  };
}

export default async function handler(req, res) {
  if (req.method === 'GET') return json(res, 200, { ok: true, service: 'telegram-business-ingress' });
  if (req.method !== 'POST') return json(res, 405, { ok: false });

  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return json(res, 503, { ok: false, error: 'webhook_not_configured' });
  const supplied = req.headers['x-telegram-bot-api-secret-token'];
  const a = Buffer.from(String(supplied || ''));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return json(res, 401, { ok: false });

  const update = req.body || {};
  const businessMessage = update.business_message || update.edited_business_message || null;

  if (businessMessage) {
    const turn = normalizeTelegramBusinessMessage(update, businessMessage);
    const testAck = await sendControlledTestAck(businessMessage, turn);
    const salesDraftTest = await runControlledSalesDraftTest(businessMessage, turn);
    console.log(JSON.stringify({ event: 'telegram_sales_turn_normalized', update_id: update.update_id,
      business_connection_id: businessMessage.business_connection_id || null, chat_id: businessMessage.chat?.id || null,
      message_id: businessMessage.message_id || null, inquiry_id: turn.input.inquiry.inquiry_id, event_id: turn.input.inquiry.event_id,
      channel: turn.input.inquiry.channel, attribution_confidence: turn.input.attribution.confidence,
      controlled_test_ack: testAck, controlled_sales_draft_test: salesDraftTest, received_at: new Date().toISOString() }));
  } else {
    const observed = observeTelegramChatUpdate(update);
    if (observed) console.log(JSON.stringify(observed));
  }

  return json(res, 200, { ok: true });
}

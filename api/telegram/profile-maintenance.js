const DEADLINE = Date.parse('2026-08-31T14:00:00Z');
const CHAT_ID = '-1003963335180';
const CHANNEL_USERNAME = 'Almusafir_car_market';
const TARGET_TITLE = 'Al Musafir Cars | Ajman';
const TARGET_DESCRIPTION = [
  'Used cars for sale | Ajman Auto Market, Showroom 171',
  'Current availability & prices: WhatsApp +971 50 978 6337',
  'English • العربية • Русский'
].join('\n');
const WELCOME_TEXT = [
  '🚗 Al Musafir Cars — used cars in Ajman',
  '',
  '📍 Ajman Auto Market, Showroom 171',
  '📲 For current availability & prices: WhatsApp +971 50 978 6337',
  '',
  'Send the model or a screenshot of the car you are interested in. We will confirm the current details and arrange a viewing / test drive.',
  '',
  'English • العربية • Русский'
].join('\n');

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.send(JSON.stringify(body));
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parsePublicPosts(html) {
  const marker = /data-post="Almusafir_car_market\/(\d+)"/g;
  const found = [];
  let match;
  while ((match = marker.exec(html))) found.push({ id: match[1], start: match.index });
  return found.map((item, index) => {
    const segment = html.slice(item.start, found[index + 1]?.start ?? html.length);
    const textMatch = segment.match(/<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/i);
    return { id: item.id, text: decodeHtml(textMatch?.[1] || '') };
  });
}

function shouldDelete(text) {
  const t = String(text || '').trim();
  if (['telegram test 1', 'telegram test 2', 'telegram test 3', 'SYSTEM TEST — Telegram publishing connection verified.'].includes(t)) return true;
  return t.includes('Hyundai Elantra GT 2020') && t.includes('147700 km');
}

async function telegram(token, method, payload = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  return { ok: Boolean(response.ok && data.ok), status: response.status, result: data.result ?? null, description: data.description ?? null };
}

async function inspect(token) {
  const [me, chat, publicPage] = await Promise.all([
    telegram(token, 'getMe'),
    telegram(token, 'getChat', { chat_id: CHAT_ID }),
    fetch(`https://t.me/s/${CHANNEL_USERNAME}`, { headers: { 'user-agent': 'Mozilla/5.0' } })
  ]);
  const html = publicPage.ok ? await publicPage.text() : '';
  const posts = parsePublicPosts(html);
  const member = me.ok ? await telegram(token, 'getChatMember', { chat_id: CHAT_ID, user_id: me.result.id }) : { ok: false };
  return { me, chat, member, public_page_status: publicPage.status, posts };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method_not_allowed' });
  if (Date.now() > DEADLINE) return json(res, 410, { ok: false, error: 'maintenance_expired' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return json(res, 503, { ok: false, error: 'missing_bot_token' });

  const state = await inspect(token);
  const plannedDeletes = state.posts.filter((p) => shouldDelete(p.text));
  const welcomeExisting = state.posts.find((p) => p.text.startsWith('🚗 Al Musafir Cars — used cars in Ajman')) || null;

  if (String(req.query?.execute || '') !== '1') {
    return json(res, 200, {
      ok: true,
      mode: 'INSPECT',
      channel: {
        id: CHAT_ID,
        username: CHANNEL_USERNAME,
        title: state.chat.result?.title ?? null,
        description: state.chat.result?.description ?? null,
        pinned_message_id: state.chat.result?.pinned_message?.message_id ?? null
      },
      bot: {
        username: state.me.result?.username ?? null,
        status: state.member.result?.status ?? null,
        can_change_info: state.member.result?.can_change_info ?? null,
        can_delete_messages: state.member.result?.can_delete_messages ?? null,
        can_edit_messages: state.member.result?.can_edit_messages ?? null,
        can_post_messages: state.member.result?.can_post_messages ?? null
      },
      public_page_status: state.public_page_status,
      posts: state.posts,
      planned: {
        title: TARGET_TITLE,
        description: TARGET_DESCRIPTION,
        delete_message_ids: plannedDeletes.map((p) => p.id),
        welcome_exists: Boolean(welcomeExisting),
        welcome_text: WELCOME_TEXT
      }
    });
  }

  const actions = [];
  const member = state.member.result || {};
  const isCreator = member.status === 'creator';

  if ((isCreator || member.can_change_info) && state.chat.result?.title !== TARGET_TITLE) {
    actions.push({ action: 'set_title', ...(await telegram(token, 'setChatTitle', { chat_id: CHAT_ID, title: TARGET_TITLE })) });
  }
  if ((isCreator || member.can_change_info) && state.chat.result?.description !== TARGET_DESCRIPTION) {
    actions.push({ action: 'set_description', ...(await telegram(token, 'setChatDescription', { chat_id: CHAT_ID, description: TARGET_DESCRIPTION })) });
  }

  if (isCreator || member.can_delete_messages) {
    for (const post of plannedDeletes) {
      actions.push({ action: 'delete_message', message_id: post.id, text: post.text.slice(0, 120), ...(await telegram(token, 'deleteMessage', { chat_id: CHAT_ID, message_id: Number(post.id) })) });
    }
  }

  let welcomeId = welcomeExisting?.id ? Number(welcomeExisting.id) : null;
  if (!welcomeId && (isCreator || member.can_post_messages)) {
    const sent = await telegram(token, 'sendMessage', { chat_id: CHAT_ID, text: WELCOME_TEXT, disable_web_page_preview: true });
    actions.push({ action: 'send_welcome', ...sent, result: sent.result ? { message_id: sent.result.message_id } : null });
    if (sent.ok) welcomeId = sent.result.message_id;
  }

  if (welcomeId && (isCreator || member.can_edit_messages || member.can_pin_messages)) {
    const pinned = await telegram(token, 'pinChatMessage', { chat_id: CHAT_ID, message_id: welcomeId, disable_notification: true });
    actions.push({ action: 'pin_welcome', message_id: welcomeId, ...pinned, result: null });
  }

  const after = await inspect(token);
  return json(res, 200, {
    ok: actions.every((a) => a.ok !== false),
    mode: 'EXECUTED',
    actions,
    after: {
      title: after.chat.result?.title ?? null,
      description: after.chat.result?.description ?? null,
      pinned_message_id: after.chat.result?.pinned_message?.message_id ?? null,
      posts: after.posts
    }
  });
}

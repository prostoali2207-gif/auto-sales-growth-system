import crypto from 'node:crypto';

const PAGE_ID = '1135061356346488';
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v26.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;
const ARCHIVE_POST_IDS = new Set([
  '1135061356346488_122100661352554950',
  '1135061356346488_122100127040554950',
  '1135061356346488_122100086162554950',
  '1135061356346488_122100084116554950',
  '1135061356346488_122100083270554950',
  '1135061356346488_122100082226554950',
  '1135061356346488_122100067154554950',
  '1135061356346488_122099950184554950'
]);
const TARGET = Object.freeze({
  about: 'Used cars in Ajman | Ajman Auto Market, Showroom 171 | WhatsApp +971 50 978 6337 | English / العربية / Русский',
  description: 'Used cars in Ajman. Current availability and vehicle facts are confirmed before viewing. Ajman Auto Market, Showroom 171. WhatsApp +971 50 978 6337. English / العربية / Русский.',
  phone: '+971 50 978 6337'
});

function json(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json');
  res.send(JSON.stringify(body));
}
function secureEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function url(path, params = {}) {
  const u = new URL(`${GRAPH_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
  return u;
}
async function graph(token, method, path, params = {}, body = null) {
  const r = await fetch(url(path, params), {
    method,
    headers: { authorization: `Bearer ${token}`, ...(body ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
    body
  });
  const data = await r.json().catch(() => ({}));
  return { r, data };
}
function err(x) {
  const e = x?.data?.error;
  return e ? { message: e.message || null, type: e.type || null, code: e.code ?? null, error_subcode: e.error_subcode ?? null } : null;
}
async function readPost(token, postId) {
  return graph(token, 'GET', postId, { fields: 'id,message,created_time,permalink_url' });
}
async function readPage(token, fields) {
  return graph(token, 'GET', PAGE_ID, { fields });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method_not_allowed' });
  const expected = process.env.META_TRANSPORT_SECRET;
  if (!expected || !secureEqual(req.query?.key, expected)) return json(res, 401, { ok: false, error: 'unauthorized' });
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) return json(res, 503, { ok: false, error: 'missing_meta_page_access_token' });

  const action = String(req.query?.action || '').toUpperCase();
  if (action === 'PROBE') {
    const x = await readPage(token, 'id,name,about,description,phone,website,location,category,link,instagram_business_account');
    return json(res, x.r.ok ? 200 : (x.r.status || 502), x.r.ok ? { ok: true, page: x.data, archive_manifest_count: ARCHIVE_POST_IDS.size } : { ok: false, error: 'meta_probe_failed', graph_error: err(x) });
  }

  if (action === 'READ_POST' || action === 'DELETE_POST') {
    const postId = String(req.query?.post_id || '');
    if (!ARCHIVE_POST_IDS.has(postId)) return json(res, 400, { ok: false, error: 'post_not_in_archive_manifest' });
    const before = await readPost(token, postId);
    if (!before.r.ok) return json(res, before.r.status || 502, { ok: false, error: 'prewrite_read_failed', post_id: postId, graph_error: err(before) });
    if (action === 'READ_POST' || String(req.query?.execute) !== 'true') return json(res, 200, { ok: true, mode: 'DRY_RUN', mutation_performed: false, post: before.data, manifest_decision: 'ARCHIVE' });

    const deletion = await graph(token, 'DELETE', postId);
    if (!deletion.r.ok || deletion.data?.success !== true) return json(res, deletion.r.status || 502, { ok: false, error: 'delete_failed', post_id: postId, graph_error: err(deletion), response: deletion.data });
    const after = await readPost(token, postId);
    const gone = !after.r.ok && err(after)?.code === 100;
    return json(res, gone ? 200 : 409, { ok: gone, mutation_performed: true, reconciled: gone, post_id: postId, verification_graph_error: gone ? null : err(after), verification_data: after.r.ok ? after.data : null });
  }

  if (action === 'SYNC_PROFILE') {
    const fields = 'id,name,about,description,phone';
    const before = await readPage(token, fields);
    if (!before.r.ok) return json(res, before.r.status || 502, { ok: false, error: 'profile_read_failed', graph_error: err(before) });
    if (String(req.query?.execute) !== 'true') return json(res, 200, { ok: true, mode: 'DRY_RUN', mutation_performed: false, before: before.data, target: TARGET });

    const results = [];
    for (const [field, value] of Object.entries(TARGET)) {
      if ((before.data?.[field] ?? null) === value) { results.push({ field, status: 'ALREADY_MATCHES', verified: true }); continue; }
      const write = await graph(token, 'POST', PAGE_ID, {}, new URLSearchParams({ [field]: value }));
      if (!write.r.ok || write.data?.success !== true) { results.push({ field, status: 'WRITE_FAILED', verified: false, graph_error: err(write) }); continue; }
      const verify = await readPage(token, `id,${field}`);
      const verified = verify.r.ok && verify.data?.[field] === value;
      results.push({ field, status: verified ? 'EXECUTED' : 'NOT_RECONCILED', verified, value_after: verify.r.ok ? verify.data?.[field] ?? null : null, graph_error: verify.r.ok ? null : err(verify) });
    }
    return json(res, results.every(x => x.verified) ? 200 : 207, { ok: results.every(x => x.verified), mutation_performed: results.some(x => x.status === 'EXECUTED'), results });
  }

  return json(res, 400, { ok: false, error: 'invalid_action' });
}

import crypto from 'node:crypto';

const PAGE_ID = '1135061356346488';
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v26.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

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

function graphUrl(path, params = {}) {
  const url = new URL(`${GRAPH_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url;
}

async function graphGet(token, fields) {
  const response = await fetch(graphUrl(PAGE_ID, { fields }), {
    headers: { authorization: `Bearer ${token}` }
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function resolvePageToken(rootToken) {
  const result = await graphGet(rootToken, 'id,access_token');
  return result.response.ok && result.data?.access_token
    ? { token: result.data.access_token, source: 'derived_page_token' }
    : { token: rootToken, source: 'provided_token' };
}

function valuesEquivalent(field, actual, target) {
  if (field === 'phone') {
    return String(actual || '').replace(/\D/g, '') === String(target || '').replace(/\D/g, '');
  }
  return actual === target;
}

async function graphWriteField(token, field, value) {
  const body = new URLSearchParams({ [field]: value });
  const response = await fetch(graphUrl(PAGE_ID), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

function graphError(result) {
  const err = result?.data?.error;
  return err ? {
    message: err.message || null,
    type: err.type || null,
    code: err.code ?? null,
    error_subcode: err.error_subcode ?? null,
    fbtrace_id: err.fbtrace_id || null
  } : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' });

  const expected = process.env.META_TRANSPORT_SECRET;
  if (!expected) return json(res, 503, { ok: false, error: 'transport_not_configured' });
  if (!secureEqual(req.headers['x-meta-transport-secret'], expected)) {
    return json(res, 401, { ok: false, error: 'unauthorized' });
  }

  const rootToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!rootToken) return json(res, 503, {
    ok: false,
    error: 'missing_meta_page_access_token',
    required_permission: 'pages_manage_metadata',
    page_id: PAGE_ID
  });
  const resolved = await resolvePageToken(rootToken);
  const token = resolved.token;

  const body = req.body || {};
  const action = String(body.action || '').toUpperCase();
  if (!['PROBE', 'SYNC_IDENTITY'].includes(action)) {
    return json(res, 400, { ok: false, error: 'invalid_request', fields: ['action'] });
  }
  if (body.page_id !== undefined && String(body.page_id) !== PAGE_ID) {
    return json(res, 400, { ok: false, error: 'invalid_request', fields: ['page_id'] });
  }
  if (action === 'SYNC_IDENTITY' && body.execute !== true && body.execute !== false) {
    return json(res, 400, { ok: false, error: 'invalid_request', fields: ['execute'] });
  }

  const fields = 'id,name,about,description,phone,website,location,category,link';
  const before = await graphGet(token, fields);
  if (!before.response.ok) {
    return json(res, before.response.status || 502, {
      ok: false,
      error: 'profile_read_failed',
      graph_error: graphError(before)
    });
  }

  if (action === 'PROBE') {
    return json(res, 200, {
      ok: true,
      graph_version: GRAPH_VERSION,
      page: before.data,
      hardcoded_safe_sync_fields: Object.keys(TARGET),
      intentionally_not_mutated: ['name', 'username', 'category', 'location', 'website', 'cta']
    });
  }

  if (body.execute !== true) {
    return json(res, 200, {
      ok: true,
      mode: 'DRY_RUN',
      mutation_performed: false,
      before: before.data,
      target: TARGET,
      note: 'Only about, description, and phone are in this guarded sync. Name/location/category/CTA require separate capability proof.'
    });
  }

  const results = [];
  for (const [field, targetValue] of Object.entries(TARGET)) {
    const currentValue = before.data?.[field] ?? null;
    if (valuesEquivalent(field, currentValue, targetValue)) {
      results.push({ field, status: 'ALREADY_MATCHES', mutation_performed: false, verified: true });
      continue;
    }

    const write = await graphWriteField(token, field, targetValue);
    if (!write.response.ok || write.data?.success !== true) {
      results.push({
        field,
        status: 'WRITE_FAILED',
        mutation_performed: false,
        verified: false,
        graph_error: graphError(write),
        response: write.data
      });
      continue;
    }

    const verify = await graphGet(token, `id,${field}`);
    const verified = verify.response.ok && valuesEquivalent(field, verify.data?.[field] ?? null, targetValue);
    results.push({
      field,
      status: verified ? 'EXECUTED' : 'NOT_RECONCILED',
      mutation_performed: true,
      verified,
      value_after: verify.response.ok ? (verify.data?.[field] ?? null) : null,
      verification_graph_error: verify.response.ok ? null : graphError(verify)
    });
  }

  const failed = results.filter((r) => !r.verified);
  const mutated = results.some((r) => r.mutation_performed);
  return json(res, failed.length ? 207 : 200, {
    ok: failed.length === 0,
    mode: 'EXECUTED',
    mutation_performed: mutated,
    page_id: PAGE_ID,
    results,
    manual_or_separate_capability_fields: ['name', 'username', 'category', 'location', 'website', 'cta']
  });
}

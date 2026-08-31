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

function graphUrl(path, params = {}) {
  const url = new URL(`${GRAPH_BASE}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url;
}

async function graphRequest(token, method, path, params = {}) {
  const url = graphUrl(path, params);
  const response = await fetch(url, {
    method,
    headers: { authorization: `Bearer ${token}` }
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

function isVerifiedGone(result) {
  if (result.response.ok) return false;
  const err = graphError(result);
  if (!err) return false;
  const text = String(err.message || '').toLowerCase();
  return err.code === 100 && (
    text.includes('unsupported get request') ||
    text.includes('does not exist') ||
    text.includes('cannot be loaded')
  );
}

async function readPost(token, postId) {
  return graphRequest(token, 'GET', postId, {
    fields: 'id,message,created_time,permalink_url'
  });
}

function validateBody(body) {
  const action = String(body?.action || '').toUpperCase();
  const errors = [];
  if (!['PROBE', 'READ_POST', 'DELETE_POST'].includes(action)) errors.push('action');
  if (body?.page_id !== undefined && String(body.page_id) !== PAGE_ID) errors.push('page_id');

  if (action === 'READ_POST' || action === 'DELETE_POST') {
    if (typeof body?.post_id !== 'string' || !body.post_id.trim()) errors.push('post_id');
    else if (!ARCHIVE_POST_IDS.has(body.post_id.trim())) errors.push('post_id_not_in_archive_manifest');
  }

  if (action === 'DELETE_POST' && body?.execute !== true && body?.execute !== false) errors.push('execute');
  return { action, errors: [...new Set(errors)] };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' });

  const expected = process.env.META_TRANSPORT_SECRET;
  if (!expected) return json(res, 503, { ok: false, error: 'transport_not_configured' });
  if (!secureEqual(req.headers['x-meta-transport-secret'], expected)) {
    return json(res, 401, { ok: false, error: 'unauthorized' });
  }

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) return json(res, 503, {
    ok: false,
    error: 'missing_meta_page_access_token',
    required_permissions: ['pages_read_engagement', 'pages_manage_posts'],
    page_id: PAGE_ID
  });

  const body = req.body || {};
  const { action, errors } = validateBody(body);
  if (errors.length) return json(res, 400, { ok: false, error: 'invalid_request', fields: errors });

  if (action === 'PROBE') {
    const result = await graphRequest(token, 'GET', PAGE_ID, {
      fields: 'id,name,instagram_business_account'
    });
    if (!result.response.ok) {
      return json(res, result.response.status || 502, {
        ok: false,
        error: 'meta_probe_failed',
        graph_error: graphError(result)
      });
    }
    return json(res, 200, {
      ok: true,
      page: result.data,
      graph_version: GRAPH_VERSION,
      archive_manifest_count: ARCHIVE_POST_IDS.size
    });
  }

  const postId = body.post_id.trim();
  const before = await readPost(token, postId);

  if (!before.response.ok) {
    return json(res, before.response.status || 502, {
      ok: false,
      error: 'prewrite_read_failed',
      post_id: postId,
      graph_error: graphError(before)
    });
  }

  if (action === 'READ_POST') {
    return json(res, 200, { ok: true, post: before.data, manifest_decision: 'ARCHIVE' });
  }

  const operationId = stableId('meta_fb_delete', postId);
  if (body.execute !== true) {
    return json(res, 200, {
      ok: true,
      mode: 'DRY_RUN',
      mutation_performed: false,
      operation_id: operationId,
      page_id: PAGE_ID,
      post_id: postId,
      manifest_decision: 'ARCHIVE',
      before: before.data
    });
  }

  const deletion = await graphRequest(token, 'DELETE', postId);
  if (!deletion.response.ok || deletion.data?.success !== true) {
    return json(res, deletion.response.status || 502, {
      ok: false,
      error: 'facebook_post_delete_failed',
      operation_id: operationId,
      post_id: postId,
      graph_error: graphError(deletion),
      response: deletion.data
    });
  }

  const after = await readPost(token, postId);
  const verifiedDeleted = isVerifiedGone(after);
  if (!verifiedDeleted) {
    return json(res, 409, {
      ok: false,
      error: 'delete_not_reconciled',
      mutation_performed: true,
      operation_id: operationId,
      post_id: postId,
      delete_response: deletion.data,
      verification_http_status: after.response.status,
      verification_graph_error: graphError(after),
      verification_data: after.response.ok ? after.data : null
    });
  }

  console.log(JSON.stringify({
    event: 'meta_facebook_post_deleted',
    operation_id: operationId,
    page_id: PAGE_ID,
    post_id: postId,
    manifest_decision: 'ARCHIVE',
    reconciled: true,
    deleted_at: new Date().toISOString()
  }));

  return json(res, 200, {
    ok: true,
    mode: 'EXECUTED',
    mutation_performed: true,
    reconciled: true,
    operation_id: operationId,
    page_id: PAGE_ID,
    post_id: postId,
    manifest_decision: 'ARCHIVE'
  });
}

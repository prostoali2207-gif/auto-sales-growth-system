import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const mediaUrl = process.argv[2];
const sourcePostUrl = process.argv[3] || null;
const outputDir = process.argv[4] || 'data/analysis/tiktok-hook-frames';

if (!mediaUrl) {
  throw new Error('Usage: node scripts/fetch-sociality-tiktok-media.mjs <tiktok-cdn-media-url> [source-post-url] [output-dir]');
}

const MAX_BYTES = Number(process.env.SOCIAL_MEDIA_MAX_BYTES || 100 * 1024 * 1024);
const TIMEOUT_MS = Number(process.env.SOCIAL_MEDIA_FETCH_TIMEOUT_MS || 20_000);
const KEEP_VIDEO = process.env.KEEP_SOCIAL_VIDEO === '1';
const FRAME_SECONDS = [0, 1, 3];

function validateMediaUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Only HTTPS media URLs are allowed');

  const host = url.hostname.toLowerCase();
  const allowed = /(^|\.)tiktokcdn(?:-[a-z0-9-]+)?\.com$/.test(host);
  if (!allowed) throw new Error(`Blocked media host: ${host}`);

  return url;
}

function safeName(value) {
  return String(value || 'tiktok-video')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'tiktok-video';
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)));
  });
}

async function downloadBounded(url, destination) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error('media fetch timeout')), TIMEOUT_MS);
  let handle;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0' },
    });

    if (!response.ok) throw new Error(`Media download failed: HTTP ${response.status}`);

    const finalUrl = validateMediaUrl(response.url);
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('video/') && !contentType.includes('octet-stream')) {
      throw new Error(`Unexpected content-type: ${contentType || 'missing'}`);
    }

    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength && declaredLength > MAX_BYTES) {
      throw new Error(`Media exceeds maximum size: ${declaredLength} > ${MAX_BYTES}`);
    }

    if (!response.body) throw new Error('Media response has no body');

    handle = await fs.open(destination, 'w');
    const reader = response.body.getReader();
    const hash = crypto.createHash('sha256');
    let total = 0;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        await reader.cancel();
        throw new Error(`Media exceeded maximum size while streaming: ${total} > ${MAX_BYTES}`);
      }
      hash.update(value);
      await handle.write(value);
    }

    return {
      bytes: total,
      sha256: hash.digest('hex'),
      contentType,
      finalHost: finalUrl.hostname,
    };
  } finally {
    clearTimeout(timeout);
    if (handle) await handle.close();
  }
}

const parsed = validateMediaUrl(mediaUrl);
await fs.mkdir(outputDir, { recursive: true });

const sourceId = sourcePostUrl ? sourcePostUrl.split('/').filter(Boolean).at(-1) : parsed.pathname.split('/').filter(Boolean).at(-1);
const base = safeName(sourceId);
const videoPath = path.join(outputDir, `${base}.mp4`);
const frames = [];

let downloadMeta;
try {
  downloadMeta = await downloadBounded(parsed, videoPath);

  for (const second of FRAME_SECONDS) {
    const frameName = `${base}__${second}s.jpg`;
    const framePath = path.join(outputDir, frameName);
    await run('ffmpeg', ['-y', '-ss', String(second), '-i', videoPath, '-frames:v', '1', '-q:v', '2', framePath]);
    frames.push(frameName);
  }

  const manifest = {
    source: 'sociality_tiktok_competitor_post',
    sourcePostUrl,
    mediaHost: downloadMeta.finalHost,
    fetchedAt: new Date().toISOString(),
    bytes: downloadMeta.bytes,
    sha256: downloadMeta.sha256,
    contentType: downloadMeta.contentType,
    frameSeconds: FRAME_SECONDS,
    frames,
    temporaryVideoRetained: KEEP_VIDEO,
  };

  await fs.writeFile(path.join(outputDir, `${base}.manifest.json`), JSON.stringify(manifest, null, 2));
  console.log(`Prepared ${frames.length} TikTok hook frames from ${sourcePostUrl || downloadMeta.finalHost}`);
} finally {
  if (!KEEP_VIDEO) await fs.rm(videoPath, { force: true });
}

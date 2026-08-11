import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const inputDir = process.argv[2] || 'data/raw/instagram';
const outputDir = process.argv[3] || 'data/analysis/hook-frames';

const files = (await fs.readdir(inputDir)).filter((f) => f.endsWith('.normalized.json')).sort();
if (!files.length) throw new Error('No normalized Instagram dataset found');
const inputFile = path.join(inputDir, files.at(-1));
const rows = JSON.parse(await fs.readFile(inputFile, 'utf8'));

const byAccount = new Map();
for (const row of rows) {
  if (!row.ownerUsername || !row.videoUrl || !Number.isFinite(Number(row.plays))) continue;
  if (!byAccount.has(row.ownerUsername)) byAccount.set(row.ownerUsername, []);
  byAccount.get(row.ownerUsername).push(row);
}

function median(values) {
  const a = [...values].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function safeName(s) {
  return String(s || 'item').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)));
    p.on('error', reject);
  });
}

await fs.mkdir(outputDir, { recursive: true });
const manifest = [];

for (const [account, items] of byAccount) {
  const sorted = [...items].sort((a, b) => Number(b.plays) - Number(a.plays));
  const med = median(items.map((x) => Number(x.plays)));
  const top = sorted[0];
  const medianPost = [...items].sort((a, b) => Math.abs(Number(a.plays) - med) - Math.abs(Number(b.plays) - med))[0];
  const selected = [
    { label: 'top', row: top },
    { label: 'median', row: medianPost },
  ];

  for (const { label, row } of selected) {
    const base = `${safeName(account)}__${label}__${safeName(row.shortCode || row.id || 'reel')}`;
    const videoPath = path.join(outputDir, `${base}.mp4`);
    try {
      await download(row.videoUrl, videoPath);
      const framePaths = [];
      for (const sec of [0, 1, 3]) {
        const framePath = path.join(outputDir, `${base}__${sec}s.jpg`);
        await run('ffmpeg', ['-y', '-ss', String(sec), '-i', videoPath, '-frames:v', '1', '-q:v', '2', framePath]);
        framePaths.push(path.basename(framePath));
      }
      await fs.rm(videoPath, { force: true });
      manifest.push({
        account,
        label,
        shortCode: row.shortCode,
        instagramUrl: row.url,
        plays: row.plays,
        accountMedianPlays: med,
        ratioToMedian: med ? Number(row.plays) / med : null,
        caption: row.caption,
        durationSeconds: row.durationSeconds,
        frames: framePaths,
      });
      console.log(`Extracted ${account} ${label}`);
    } catch (error) {
      manifest.push({ account, label, instagramUrl: row.url, plays: row.plays, error: String(error) });
      console.error(`Failed ${account} ${label}:`, error);
      await fs.rm(videoPath, { force: true });
    }
  }
}

await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Prepared ${manifest.filter((x) => !x.error).length} reels for hook analysis.`);

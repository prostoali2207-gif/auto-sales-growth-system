import fs from 'node:fs/promises';
import path from 'node:path';
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('APIFY_TOKEN is required');

const configPath = process.argv[2] || 'config/competitors.json';
const outDir = process.argv[3] || 'data/raw/instagram';
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

if (!Array.isArray(config.usernames) || !config.usernames.length) {
  throw new Error('config.usernames must be a non-empty array');
}

const client = new ApifyClient({ token });
const run = await client.actor('apify/instagram-reel-scraper').call({
  username: config.usernames,
  resultsLimit: Number(config.resultsLimit || 40),
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
const normalized = items.map((item) => ({
  ownerUsername: item.ownerUsername ?? item.owner?.username ?? null,
  url: item.url ?? item.inputUrl ?? null,
  timestamp: item.timestamp ?? item.takenAt ?? null,
  caption: item.caption ?? null,
  transcript: item.transcript ?? null,
  views: item.videoViewCount ?? item.videoPlayCount ?? item.playCount ?? item.views ?? null,
  plays: item.videoPlayCount ?? item.playCount ?? null,
  likes: item.likesCount ?? item.likes ?? null,
  comments: item.commentsCount ?? item.comments ?? null,
  shares: item.sharesCount ?? item.shares ?? null,
  durationSeconds: item.videoDuration ?? item.duration ?? null,
  hashtags: item.hashtags ?? [],
  latestComments: item.latestComments ?? item.commentsData ?? [],
}));

await fs.mkdir(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
await fs.writeFile(path.join(outDir, `${stamp}.json`), JSON.stringify(items, null, 2));
await fs.writeFile(path.join(outDir, `${stamp}.normalized.json`), JSON.stringify(normalized, null, 2));
console.log(`Collected ${items.length} reels.`);

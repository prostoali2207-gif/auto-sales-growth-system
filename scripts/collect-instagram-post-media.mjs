import fs from 'node:fs/promises';
import path from 'node:path';
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('APIFY_TOKEN is required');

const inputs = process.argv.slice(2).filter(Boolean);
if (!inputs.length) {
  throw new Error('Usage: node scripts/collect-instagram-post-media.mjs <instagram-post-url-or-shortcode> [...]');
}

const client = new ApifyClient({ token });
const run = await client.actor('seemuapps/instagram-post-details-scraper').call({
  postUrls: inputs,
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();

const normalized = items.map((item) => ({
  input: item.input ?? null,
  postId: item.postId ?? null,
  shortcode: item.shortcode ?? null,
  postUrl: item.postUrl ?? null,
  mediaType: item.mediaType ?? null,
  productType: item.productType ?? null,
  takenAt: item.takenAt ?? null,
  caption: item.caption ?? null,
  authorUsername: item.authorUsername ?? null,
  locationName: item.locationName ?? null,
  mediaItems: Array.isArray(item.mediaItems)
    ? item.mediaItems.map((media, index) => ({
        index: index + 1,
        type: media.type ?? null,
        imageUrl: media.imageUrl ?? null,
        videoUrl: media.videoUrl ?? null,
      }))
    : [],
}));

const outDir = 'data/raw/instagram/posts';
await fs.mkdir(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
await fs.writeFile(path.join(outDir, `${stamp}.json`), JSON.stringify(items, null, 2));
await fs.writeFile(path.join(outDir, `${stamp}.normalized.json`), JSON.stringify(normalized, null, 2));

for (const post of normalized) {
  console.log(`${post.postUrl ?? post.input}: ${post.mediaItems.length} media item(s)`);
  for (const media of post.mediaItems) {
    console.log(`  ${media.index}. ${media.type ?? 'unknown'} ${media.imageUrl ?? media.videoUrl ?? 'no-media-url'}`);
  }
}

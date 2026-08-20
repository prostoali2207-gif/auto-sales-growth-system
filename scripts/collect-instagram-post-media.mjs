import fs from 'node:fs/promises';
import path from 'node:path';
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('APIFY_TOKEN is required');

const postUrl = process.argv[2];
if (!postUrl) throw new Error('Usage: node scripts/collect-instagram-post-media.mjs <instagram-post-url>');

const outDir = process.argv[3] || 'data/raw/instagram/post-media';
await fs.mkdir(outDir, { recursive: true });

const client = new ApifyClient({ token });
const run = await client.actor('seemuapps/instagram-post-details-scraper').call({
  postUrls: [postUrl],
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
if (!items.length) throw new Error('No Instagram post data returned');

await fs.writeFile(path.join(outDir, 'post.json'), JSON.stringify(items, null, 2));

const post = items[0];
const mediaItems = Array.isArray(post.mediaItems) ? post.mediaItems : [];
if (!mediaItems.length) throw new Error('Post returned no mediaItems');

const normalized = {
  postUrl: post.postUrl ?? post.url ?? postUrl,
  postId: post.postId ?? post.id ?? null,
  shortcode: post.shortcode ?? null,
  mediaType: post.mediaType ?? null,
  caption: post.caption ?? null,
  authorUsername: post.authorUsername ?? post.username ?? null,
  mediaItems: [],
};

for (let i = 0; i < mediaItems.length; i += 1) {
  const media = mediaItems[i];
  const imageUrl = media.imageUrl ?? media.displayUrl ?? media.url ?? null;
  const videoUrl = media.videoUrl ?? null;
  const sourceUrl = imageUrl ?? videoUrl;
  const type = videoUrl ? 'video' : 'image';
  let localFile = null;

  if (sourceUrl) {
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Failed to download media item ${i + 1}: ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    const ext = contentType.includes('video') ? 'mp4' : contentType.includes('png') ? 'png' : 'jpg';
    localFile = `slide-${String(i + 1).padStart(2, '0')}.${ext}`;
    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(path.join(outDir, localFile), bytes);
  }

  normalized.mediaItems.push({
    index: i + 1,
    type,
    imageUrl,
    videoUrl,
    localFile,
  });
}

await fs.writeFile(path.join(outDir, 'normalized.json'), JSON.stringify(normalized, null, 2));
console.log(`Collected ${normalized.mediaItems.length} media item(s) from ${normalized.postUrl}`);

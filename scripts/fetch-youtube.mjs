// Reads the public YouTube channel feed (no API key) and writes src/data/youtube.json.
// The channel id is resolved from the @handle page; if that fails, the id saved in
// the existing file (or YT_CHANNEL_ID) is used. On any failure the existing file is
// kept and the script exits 0, so a YouTube hiccup never breaks the build or workflow.
import { readFile, writeFile } from 'node:fs/promises';

const HANDLE_URL = 'https://www.youtube.com/@slmnkara';
const FEED_URL = (id) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
const OUT = new URL('../src/data/youtube.json', import.meta.url);
const UA = 'Mozilla/5.0 (compatible; portfolio-build)';
const CHANNEL_ID = /^UC[\w-]{22}$/;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
export function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
      if (e[0] === '#') {
        const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e] ?? m;
    })
    .trim();
}

/** Channel id from the HTML of a channel page, or null. */
export function channelIdFromHtml(html) {
  const patterns = [
    /"externalId":"(UC[\w-]{22})"/,
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/,
    /<meta itemprop="identifier" content="(UC[\w-]{22})"/,
    /feeds\/videos\.xml\?channel_id=(UC[\w-]{22})/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

/** Videos from an Atom feed, newest first. Throws if the document is not a YouTube feed. */
export function parseFeed(xml) {
  if (!/<feed[\s>]/.test(xml)) throw new Error('not an Atom feed');
  const videos = [];
  for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const tag = (name) => {
      const m = entry.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
      return m ? decode(m[1]) : '';
    };
    const id = tag('yt:videoId');
    const title = tag('title');
    const published = tag('published');
    if (!/^[\w-]{11}$/.test(id) || !title || Number.isNaN(Date.parse(published))) continue;
    const thumb = entry.match(/<media:thumbnail\s+url="([^"]+)"/);
    videos.push({
      id,
      title,
      published: new Date(published).toISOString(),
      thumbnail: thumb ? decode(thumb[1]) : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  return videos.sort((a, b) => b.published.localeCompare(a.published));
}

async function get(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, 'accept-language': 'en' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const existing = await readExisting();
  let channelId = null;
  try {
    channelId = channelIdFromHtml(await get(HANDLE_URL));
  } catch (e) {
    console.warn(`[youtube] could not read channel page: ${e.message}`);
  }
  channelId ??= [process.env.YT_CHANNEL_ID, existing?.channelId].find((v) => CHANNEL_ID.test(v ?? '')) ?? null;
  if (!channelId) throw new Error('channel id not found');

  const videos = parseFeed(await get(FEED_URL(channelId)));
  // An empty feed for a channel that had videos is more likely a glitch than a purge.
  if (!videos.length && existing?.videos?.length) throw new Error('feed returned no videos');

  const same =
    existing?.channelId === channelId && JSON.stringify(existing?.videos) === JSON.stringify(videos);
  if (same) {
    console.log(`[youtube] no change (${videos.length} videos)`);
    return;
  }
  const data = { fetchedAt: new Date().toISOString(), channelId, videos };
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`[youtube] ${videos.length} videos from ${channelId}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.warn(`[youtube] fetch failed, keeping existing youtube.json: ${e.message}`);
  });
}

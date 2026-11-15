// Build-time content: Markdown posts in content/blog/<slug>/<lang>.md plus the
// auto-imported YouTube videos in src/data/youtube.json. Server-only (uses fs).
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import youtube from '@/data/youtube.json';
import { LANGS, type Lang, type PostKind } from './site';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const KINDS: PostKind[] = ['article', 'note', 'video'];
/** Drafts show in `next dev` only. */
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production';
const WORDS_PER_MINUTE = 200;

export interface Post {
  slug: string;
  lang: Lang;
  title: string;
  date: string; // YYYY-MM-DD
  kind: PostKind;
  summary: string;
  cover?: string;
  youtube?: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  body: string;
}

/** One entry in the blog stream: a Markdown post or an auto-imported video. */
export interface StreamItem {
  key: string;
  kind: PostKind;
  title: string;
  date: string; // YYYY-MM-DD
  summary?: string;
  readingMinutes?: number;
  image?: string;
  href: string;
  external: boolean;
}

interface Video {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
}

function toDate(v: unknown, file: string): string {
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) {
    throw new Error(`${file}: "date" must be YYYY-MM-DD, got ${JSON.stringify(v)}`);
  }
  return s;
}

function readingMinutes(md: string): number {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()!|-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function readPost(slug: string, lang: Lang): Post | null {
  const file = path.join(BLOG_DIR, slug, `${lang}.md`);
  if (!fs.existsSync(file)) return null;
  const rel = path.relative(process.cwd(), file);
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const kind = data.kind as PostKind;
  if (!KINDS.includes(kind)) throw new Error(`${rel}: "kind" must be one of ${KINDS.join(', ')}`);
  if (!data.title || typeof data.title !== 'string') throw new Error(`${rel}: "title" is required`);
  if (!data.summary || typeof data.summary !== 'string') throw new Error(`${rel}: "summary" is required`);
  if (data.youtube != null && !/^[\w-]{11}$/.test(String(data.youtube))) {
    throw new Error(`${rel}: "youtube" must be an 11-character video id`);
  }
  if (data.cover != null && !String(data.cover).startsWith('/')) {
    throw new Error(`${rel}: "cover" must be a path under public/ starting with "/"`);
  }
  return {
    slug,
    lang,
    title: data.title,
    date: toDate(data.date, rel),
    kind,
    summary: data.summary,
    cover: data.cover ? String(data.cover) : undefined,
    youtube: data.youtube ? String(data.youtube) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingMinutes: readingMinutes(content),
    body: content,
  };
}

let cache: Post[] | null = null;

/** Every visible post in every language (drafts only in dev). */
function allPosts(): Post[] {
  if (cache && !SHOW_DRAFTS) return cache;
  const slugs = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];
  const posts: Post[] = [];
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`content/blog/${slug}: folder names must be lowercase words joined by "-"`);
    }
    for (const lang of LANGS) {
      const p = readPost(slug, lang);
      if (p && (SHOW_DRAFTS || !p.draft)) posts.push(p);
    }
  }
  // Newest first; slug breaks ties so the order is stable.
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  cache = posts;
  return posts;
}

export const getPosts = (lang: Lang) => allPosts().filter((p) => p.lang === lang);
export const getPost = (lang: Lang, slug: string) => getPosts(lang).find((p) => p.slug === slug) ?? null;
export const hasPost = (lang: Lang, slug: string) => getPost(lang, slug) !== null;

export const postPath = (slug: string) => `/blog/${slug}/`;

function videos(): Video[] {
  return ((youtube as { videos?: Video[] }).videos ?? []).filter((v) => v && v.id && v.title);
}

/** Posts plus imported videos, newest first. A post with the same `youtube` id replaces the import. */
export function getStream(lang: Lang): StreamItem[] {
  const posts = getPosts(lang);
  const covered = new Set(posts.map((p) => p.youtube).filter(Boolean));
  const items: StreamItem[] = posts.map((p) => ({
    key: `post:${p.slug}`,
    kind: p.kind,
    title: p.title,
    date: p.date,
    summary: p.summary,
    readingMinutes: p.kind === 'article' ? p.readingMinutes : undefined,
    image: p.cover ?? (p.youtube ? `https://i.ytimg.com/vi/${p.youtube}/hqdefault.jpg` : undefined),
    href: postPath(p.slug),
    external: false,
  }));
  for (const v of videos()) {
    if (covered.has(v.id)) continue;
    items.push({
      key: `yt:${v.id}`,
      kind: 'video',
      title: v.title,
      date: v.published.slice(0, 10),
      image: v.thumbnail,
      href: `https://www.youtube.com/watch?v=${v.id}`,
      external: true,
    });
  }
  return items.sort((a, b) => b.date.localeCompare(a.date) || a.key.localeCompare(b.key));
}

/** The home page shows articles only. */
export const getLatestArticles = (lang: Lang, n = 3) =>
  getStream(lang).filter((i) => i.kind === 'article' && !i.external).slice(0, n);

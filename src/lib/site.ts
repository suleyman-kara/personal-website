import type { Lang } from '@/data/portfolioData';

export type { Lang };
export const LANGS: Lang[] = ['en', 'tr'];
export const SITE_URL = 'https://suleymankara.com';
export const DEFAULT_OG_IMAGE = '/og.jpg';
export const LANG_KEY = 'lang';

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'tr' : 'en');

/** Site path for a language: '/projects/' -> '/tr/projects/' for Turkish. Paths end with '/'. */
export function localePath(lang: Lang, path: string): string {
  return lang === 'en' ? path : `/tr${path}`;
}

/** Strip the language prefix: '/tr/projects/' -> '/projects/'. Adds the trailing slash. */
export function basePath(pathname: string): string {
  let p = pathname.replace(/^\/tr(?=\/|$)/, '') || '/';
  if (!p.endsWith('/')) p += '/';
  return p;
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

export const t = (lang: Lang) => (en: string, tr: string) => (lang === 'en' ? en : tr);

export const dateLocale = (lang: Lang) => (lang === 'tr' ? 'tr-TR' : 'en-US');

/** "Nov 15, 2026" / "15 Kas 2026" for a YYYY-MM-DD or ISO date, in UTC. */
export function formatDate(lang: Lang, iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return new Intl.DateTimeFormat(dateLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export type PostKind = 'article' | 'note' | 'video';

export const KIND_LABEL: Record<PostKind, Record<Lang, string>> = {
  article: { en: 'Article', tr: 'Yazı' },
  note: { en: 'Note', tr: 'Not' },
  video: { en: 'Video', tr: 'Video' },
};

export const readingTimeLabel = (lang: Lang, minutes: number) =>
  lang === 'en' ? `${minutes} min read` : `${minutes} dk okuma`;

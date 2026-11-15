import { PROJECTS } from '@/data/portfolioData';
import { getPosts, getStream, hasPost, postPath } from './content';
import { localePath, otherLang, type Lang } from './site';

/** Language-neutral paths of every page that exists in `lang`. */
export function routesFor(lang: Lang): string[] {
  return [
    '/',
    '/projects/',
    ...PROJECTS.map((p) => `/projects/${p.id}/`),
    '/blog/',
    ...getPosts(lang).map((p) => postPath(p.slug)),
    '/about/',
    '/links/',
  ];
}

/** Full paths (with /tr prefix) of every page in `lang`. */
export const localizedRoutes = (lang: Lang) => routesFor(lang).map((p) => localePath(lang, p));

/** Does the page at language-neutral `path` exist in `lang`? */
export function existsIn(lang: Lang, path: string): boolean {
  const m = path.match(/^\/blog\/([^/]+)\/$/);
  if (m) return hasPost(lang, m[1]);
  return routesFor(lang).includes(path);
}

/** Show Blog in the nav and on Links only when the stream has something in it. */
export const hasBlog = (lang: Lang) => getStream(lang).length > 0;

export const counterpartExists = (lang: Lang, path: string) => existsIn(otherLang(lang), path);

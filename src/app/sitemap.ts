import type { MetadataRoute } from 'next';
import { getPost } from '@/lib/content';
import { existsIn, routesFor } from '@/lib/routes';
import { LANGS, absoluteUrl, localePath } from '@/lib/site';

export const dynamic = 'force-static';

/** Every page in both languages, each with its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of LANGS) {
    for (const path of routesFor(lang)) {
      const languages: Record<string, string> = {};
      for (const l of LANGS) if (existsIn(l, path)) languages[l] = absoluteUrl(localePath(l, path));
      if (languages.en && languages.tr) languages['x-default'] = languages.en;
      const slug = path.match(/^\/blog\/([^/]+)\/$/)?.[1];
      const post = slug ? getPost(lang, slug) : null;
      entries.push({
        url: absoluteUrl(localePath(lang, path)),
        ...(post ? { lastModified: post.date } : {}),
        alternates: { languages },
      });
    }
  }
  return entries;
}

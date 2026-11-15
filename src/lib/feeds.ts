import { PROFILE_DATA } from '@/data/portfolioData';
import { getStream } from './content';
import { absoluteUrl, localePath, type Lang } from './site';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

/** RSS 2.0 feed of the blog stream for one language. */
export function rss(lang: Lang): Response {
  const items = getStream(lang);
  const blogUrl = absoluteUrl(localePath(lang, '/blog/'));
  const self = absoluteUrl(localePath(lang, '/rss.xml'));
  const title = lang === 'en' ? `${PROFILE_DATA.name} · Blog` : `${PROFILE_DATA.name} · Blog (Türkçe)`;
  const description =
    lang === 'en' ? `Articles, notes and videos by ${PROFILE_DATA.name}.` : `${PROFILE_DATA.name}: yazılar, notlar ve videolar.`;
  const entries = items
    .map((i) => {
      const link = i.external ? i.href : absoluteUrl(localePath(lang, i.href));
      return `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${rfc822(i.date)}</pubDate>
      <category>${i.kind}</category>${i.summary ? `\n      <description>${esc(i.summary)}</description>` : ''}
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${blogUrl}</link>
    <description>${esc(description)}</description>
    <language>${lang === 'en' ? 'en' : 'tr'}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />${items[0] ? `\n    <lastBuildDate>${rfc822(items[0].date)}</lastBuildDate>` : ''}
${entries}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}

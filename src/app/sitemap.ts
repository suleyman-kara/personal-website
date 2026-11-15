import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function s(): MetadataRoute.Sitemap { return [{ url: 'https://x/', alternates: { languages: { tr: 'https://x/tr/' } } }]; }

import type { Metadata } from 'next';
import { PROFILE_DATA } from '@/data/portfolioData';
import { existsIn } from './routes';
import { DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl, localePath, type Lang } from './site';

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', tr: 'tr_TR' };
const SITE_NAME = PROFILE_DATA.name;

interface PageMeta {
  lang: Lang;
  /** Language-neutral path, e.g. '/projects/'. */
  path: string;
  /** Full title; pass `section` instead to get "Section | Süleyman Kara". */
  title?: string;
  section?: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noindex?: boolean;
}

export function pageMetadata(m: PageMeta): Metadata {
  const title = m.title ?? `${m.section} | ${SITE_NAME}`;
  const url = absoluteUrl(localePath(m.lang, m.path));
  const languages: Record<string, string> = {};
  const enExists = existsIn('en', m.path);
  const trExists = existsIn('tr', m.path);
  if (enExists) languages.en = absoluteUrl(localePath('en', m.path));
  if (trExists) languages.tr = absoluteUrl(localePath('tr', m.path));
  if (enExists && trExists) languages['x-default'] = languages.en;
  else languages['x-default'] = url;

  const image = m.image ?? DEFAULT_OG_IMAGE;
  const isDefaultImage = image === DEFAULT_OG_IMAGE;
  const imageAlt =
    m.imageAlt ??
    (isDefaultImage
      ? m.lang === 'en'
        ? 'Süleyman Kara: machine learning and web products, built end to end.'
        : 'Süleyman Kara: makine öğrenmesi ve web ürünleri, uçtan uca geliştirildi.'
      : title);
  const images = [
    {
      url: image,
      alt: imageAlt,
      ...(isDefaultImage ? { width: 1200, height: 630 } : {}),
    },
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: m.description,
    alternates: {
      canonical: url,
      languages,
      types: {
        'application/rss+xml': [
          {
            url: localePath(m.lang, '/rss.xml'),
            title: m.lang === 'en' ? `${SITE_NAME} · Blog` : `${SITE_NAME} · Blog (Türkçe)`,
          },
        ],
      },
    },
    openGraph: {
      type: m.type ?? 'website',
      url,
      siteName: SITE_NAME,
      title,
      description: m.description,
      images,
      locale: OG_LOCALE[m.lang],
      alternateLocale: OG_LOCALE[m.lang === 'en' ? 'tr' : 'en'],
      ...(m.publishedTime ? { publishedTime: m.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: m.description,
      images: [image],
    },
    icons: { icon: [{ url: '/favicon.png', type: 'image/png' }], apple: '/profile.jpg' },
    ...(m.noindex ? { robots: { index: false } } : {}),
  };
}

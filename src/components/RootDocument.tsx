import type { ReactNode } from 'react';
import '@/index.css';
import '@/fun.css';
import '@/prose.css';
import { LANG_KEY, SITE_URL, otherLang, type Lang } from '@/lib/site';
import { PROFILE_DATA } from '@/data/portfolioData';

// Theme before first paint: stored choice, else the OS setting (kept in sync by src/theme.ts).
// Also arms the scroll reveal (see src/motion.ts) so prerendered content never blinks.
const THEME_SCRIPT = `(function () {
  var root = document.documentElement;
  var dark = false;
  try {
    var s = localStorage.getItem('theme');
    dark = s === 'dark' || (s !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  } catch (e) {
    try { dark = matchMedia('(prefers-color-scheme: dark)').matches; } catch (e2) {}
  }
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
  meta.setAttribute('content', dark ? '#061527' : '#ffffff');
  try {
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('reveal-ready');
      setTimeout(function () { if (!window.__revealAlive) root.classList.remove('reveal-ready'); }, 4000);
    }
  } catch (e) {}
})();`;

/**
 * Language before first paint. Order: ?lang= (old links; remembered), then the stored
 * choice, then, on English pages only, a Turkish browser language. Redirects only to a
 * page that exists in the other language, and never when the wanted language is this one.
 */
function langScript(lang: Lang, otherPaths: string[]) {
  const paths = Object.fromEntries(otherPaths.map((p) => [p, 1]));
  return `(function () {
  var here = ${JSON.stringify(lang)}, other = ${JSON.stringify(otherLang(lang))}, key = ${JSON.stringify(LANG_KEY)};
  var paths = ${JSON.stringify(paths)};
  try {
    var q = new URLSearchParams(location.search), param = q.get('lang'), stored = null;
    try { stored = localStorage.getItem(key); } catch (e) {}
    if (param === 'en' || param === 'tr') {
      stored = param;
      try { localStorage.setItem(key, param); } catch (e) {}
      q.delete('lang');
    }
    var want = stored === 'en' || stored === 'tr' ? stored : null;
    if (!want && here === 'en') {
      var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      if (nav.toLowerCase().indexOf('tr') === 0) want = 'tr';
    }
    var qs = q.toString(), rest = (qs ? '?' + qs : '') + location.hash;
    var path = location.pathname;
    if (path.slice(-1) !== '/') path += '/';
    if (want === other) {
      var target = here === 'en' ? '/tr' + path : path.replace(/^\\/tr(?=\\/)/, '');
      if (paths[target]) {
        document.documentElement.style.visibility = 'hidden';
        location.replace(target + rest);
        return;
      }
    }
    if (param !== null) history.replaceState(history.state, '', location.pathname + rest);
  } catch (e) {}
})();`;
}

/**
 * Structured data that tells search engines who the site is about and which
 * profiles belong to the same person (helps name searches and the knowledge panel).
 */
function personJsonLd(lang: Lang) {
  const personId = `${SITE_URL}/#person`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: PROFILE_DATA.name,
        inLanguage: ['en', 'tr'],
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: PROFILE_DATA.name,
        alternateName: 'Suleyman Kara',
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/profile.jpg`,
        jobTitle: PROFILE_DATA.title[lang],
        description: PROFILE_DATA.summary[lang],
        email: `mailto:${PROFILE_DATA.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Adana', addressCountry: 'TR' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: PROFILE_DATA.education.school[lang] },
        knowsLanguage: ['tr', 'en'],
        sameAs: [
          PROFILE_DATA.linkedin,
          PROFILE_DATA.github,
          PROFILE_DATA.kaggle,
          PROFILE_DATA.instagram,
          PROFILE_DATA.youtube,
        ],
      },
    ],
  };
}

export default function RootDocument({
  lang,
  otherPaths,
  children,
}: {
  lang: Lang;
  /** Full paths of the pages that exist in the other language. */
  otherPaths?: string[];
  children: ReactNode;
}) {
  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {otherPaths && <script dangerouslySetInnerHTML={{ __html: langScript(lang, otherPaths) }} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(lang)).replace(/</g, '\\u003c') }}
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-page text-body antialiased selection:bg-[#635BFF]/20">{children}</body>
    </html>
  );
}

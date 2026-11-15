'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { PROFILE_DATA } from '@/data/portfolioData';
import { prefersReducedMotion, useSlidingPill } from '@/motion';
import { useTheme } from '@/theme';
import { usePointerFx } from '@/pointer';
import { consoleHello, useIndecision } from '@/fun';
import { LANG_KEY, basePath, localePath, otherLang, type Lang } from '@/lib/site';
import { nudgeRight, press } from './styles';

const NAV = [
  { path: '/projects/', en: 'Projects', tr: 'Projeler' },
  { path: '/blog/', en: 'Blog', tr: 'Blog' },
  { path: '/about/', en: 'About', tr: 'Hakkımda' },
];

let greeted = false;

/** Where the language toggle goes: the same page in the other language if it exists. */
function counterpart(lang: Lang, pathname: string, otherPaths: string[]): string {
  const base = basePath(pathname);
  const other = otherLang(lang);
  const target = localePath(other, base);
  if (otherPaths.includes(target)) return target;
  if (base.startsWith('/blog/')) return localePath(other, '/blog/');
  return localePath(other, '/');
}

function LangToggle({ lang, otherPaths }: { lang: Lang; otherPaths: string[] }) {
  const pathname = usePathname();
  const [shown, setShown] = useState<Lang>(lang);
  const pill = useSlidingPill<HTMLDivElement>(shown);
  // Back/forward cache can restore the page after a switch; show the real language again.
  useEffect(() => {
    const onShow = () => setShown(lang);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, [lang]);

  const choose = (l: Lang) => {
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    if (l === lang) return;
    setShown(l);
    const href = counterpart(lang, pathname, otherPaths) + window.location.search + window.location.hash;
    // Let the pill slide before the other language's page loads.
    window.setTimeout(() => window.location.assign(href), prefersReducedMotion() ? 0 : 160);
  };

  return (
    <div ref={pill.containerRef} className="relative inline-flex rounded-full bg-chip p-0.5 text-xs font-semibold">
      <span ref={pill.pillRef} aria-hidden className="seg-pill absolute left-0 top-0 rounded-full bg-pill shadow-sm" />
      {(['en', 'tr'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={shown === l}
          lang={l}
          aria-label={l === 'en' ? 'English' : 'Türkçe'}
          className={`relative px-3 py-1 rounded-full transition-colors duration-300 ${
            shown === l ? 'text-ink' : 'text-subtle hover:text-strong'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle({ lang }: { lang: Lang }) {
  const { theme, toggle } = useTheme();
  const indecision = useIndecision(lang);
  const dark = theme === 'dark';
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  // Icon visibility follows the .dark class (set before paint), so it is right before hydration too.
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => {
          toggle();
          indecision.note();
        }}
        aria-label={dark ? t('Switch to light theme', 'Açık temaya geç') : t('Switch to dark theme', 'Koyu temaya geç')}
        title={dark ? t('Light theme', 'Açık tema') : t('Dark theme', 'Koyu tema')}
        className="-mx-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-subtle hover:text-ink hover:bg-chip transition-colors"
      >
        <span className="relative w-4 h-4" aria-hidden>
          <Moon data-theme-icon className="absolute inset-0 w-4 h-4 transition-[opacity,transform] duration-200 ease-out-expo opacity-100 scale-100 rotate-0 dark:opacity-0 dark:scale-50 dark:-rotate-45" />
          <Sun data-theme-icon className="absolute inset-0 w-4 h-4 transition-[opacity,transform] duration-200 ease-out-expo opacity-0 scale-50 rotate-45 dark:opacity-100 dark:scale-100 dark:rotate-0" />
        </span>
      </button>
      {indecision.nudge}
    </span>
  );
}

export default function Shell({
  lang,
  hasBlog,
  otherPaths,
  children,
}: {
  lang: Lang;
  hasBlog: boolean;
  otherPaths: string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const base = basePath(pathname);
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  usePointerFx();
  useEffect(() => {
    if (!greeted) consoleHello();
    greeted = true;
  }, []);

  const nav = NAV.filter((n) => hasBlog || n.path !== '/blog/');
  const isActive = (path: string) => base.startsWith(path);
  const home = localePath(lang, '/');
  const contact = `${home}#contact`;

  // The Links page is a bare bio-link page: only the language and theme controls.
  if (base === '/links/') {
    return (
      <div className="min-h-screen bg-page text-body font-sans">
        <div className="max-w-md mx-auto px-5 pt-5 flex items-center justify-end gap-3">
          <LangToggle lang={lang} otherPaths={otherPaths} />
          <ThemeToggle lang={lang} />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page text-body font-sans">
      <header className="sticky top-0 z-40 bg-page/80 backdrop-blur-xl border-b border-line/70">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
          <Link href={home} className="flex items-center gap-2.5 font-semibold text-ink min-w-0">
            <img src="/profile.jpg" alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            <span className="truncate">{PROFILE_DATA.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted">
            {nav.map((n) => (
              <Link
                key={n.path}
                href={localePath(lang, n.path)}
                aria-current={isActive(n.path) ? 'page' : undefined}
                className={`nav-link transition-colors ${isActive(n.path) ? 'text-accent' : 'hover:text-accent'}`}
              >
                {t(n.en, n.tr)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <LangToggle lang={lang} otherPaths={otherPaths} />
            <ThemeToggle lang={lang} />
            <Link
              href={contact}
              className={`group hidden sm:inline-flex items-center gap-1 rounded-full bg-[#635BFF] hover:bg-[#5249e6] text-white text-sm font-medium px-4 py-2 ${press}`}
            >
              {t('Contact', 'İletişim')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
            </Link>
          </div>
        </div>
        <nav className="md:hidden border-t border-line/70">
          <div className="flex items-center gap-6 px-5 h-11 text-sm font-medium text-muted whitespace-nowrap">
            {nav.map((n) => (
              <Link
                key={n.path}
                href={localePath(lang, n.path)}
                aria-current={isActive(n.path) ? 'page' : undefined}
                className={`transition-colors ${isActive(n.path) ? 'text-accent' : 'hover:text-accent'}`}
              >
                {t(n.en, n.tr)}
              </Link>
            ))}
            <Link href={contact} className="ml-auto text-accent font-semibold">
              {t('Contact', 'İletişim')}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line/70">
        <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 {PROFILE_DATA.name}</span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href={PROFILE_DATA.github} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
            <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">LinkedIn</a>
            <a href={PROFILE_DATA.kaggle} target="_blank" rel="noreferrer" className="hover:text-accent">Kaggle</a>
            <a href={PROFILE_DATA.instagram} target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a>
            <a href={PROFILE_DATA.youtube} target="_blank" rel="noreferrer" className="hover:text-accent">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

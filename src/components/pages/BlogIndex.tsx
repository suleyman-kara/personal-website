'use client';

import { useEffect, useState } from 'react';
import { useSlidingPill } from '@/motion';
import type { StreamItem } from '@/lib/content';
import type { Lang, PostKind } from '@/lib/site';
import { SectionHeader } from '../ui';
import PostCard from '../PostCard';

type Filter = 'all' | PostKind;
// The filter lives in the URL hash (#articles, #notes, #videos) so it can be linked without a server.
const HASH: Record<Filter, string> = { all: '', article: 'articles', note: 'notes', video: 'videos' };
const fromHash = (hash: string): Filter =>
  (Object.keys(HASH) as Filter[]).find((k) => HASH[k] && HASH[k] === hash.replace(/^#/, '')) ?? 'all';

export default function BlogIndex({ lang, items }: { lang: Lang; items: StreamItem[] }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const [filter, setFilter] = useState<Filter>('all');
  const [touched, setTouched] = useState(false);
  const pill = useSlidingPill<HTMLDivElement>(filter);

  useEffect(() => {
    const sync = () => setFilter(fromHash(window.location.hash));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const choose = (f: Filter) => {
    if (f === filter) return;
    setFilter(f);
    setTouched(true);
    const url = window.location.pathname + window.location.search + (HASH[f] ? `#${HASH[f]}` : '');
    window.history.replaceState(window.history.state, '', url);
  };

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('All', 'Tümü') },
    { id: 'article', label: t('Articles', 'Yazılar') },
    { id: 'note', label: t('Notes', 'Notlar') },
    { id: 'video', label: t('Videos', 'Videolar') },
  ];
  const shown = items.filter((i) => filter === 'all' || i.kind === filter);

  return (
    <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
      <SectionHeader
        as="h1"
        eyebrow="Blog"
        title={t('Writing, notes and videos', 'Yazılar, notlar ve videolar')}
      />
      {items.length === 0 ? (
        <p className="text-muted">{t('No posts yet.', 'Henüz yazı yok.')}</p>
      ) : (
        <>
          <div
            ref={pill.containerRef}
            className="relative flex flex-wrap sm:inline-flex gap-1 rounded-2xl sm:rounded-full bg-card border border-line p-1 mb-8 shadow-sm dark:shadow-none"
          >
            <span ref={pill.pillRef} aria-hidden className="seg-pill absolute left-0 top-0 rounded-full bg-ink" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => choose(f.id)}
                aria-pressed={filter === f.id}
                className={`relative px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  filter === f.id ? 'text-on-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <p className="text-muted">{t('Nothing here yet.', 'Burada henüz bir şey yok.')}</p>
          ) : (
            <div key={filter} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((item, i) => (
                <PostCard
                  key={item.key}
                  item={item}
                  lang={lang}
                  reveal={!touched}
                  className={touched ? 'filter-in' : ''}
                  style={touched ? { animationDelay: `${Math.min(i, 3) * 30}ms` } : undefined}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

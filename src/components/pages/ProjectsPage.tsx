'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Globe, Terminal } from 'lucide-react';
import { MINI_PROJECTS, PROJECTS } from '@/data/portfolioData';
import { rv, useSlidingPill } from '@/motion';
import { localePath, type Lang } from '@/lib/site';
import { SectionHeader } from '../ui';
import { card, chip, lift } from '../styles';

type Filter = 'all' | 'ml' | 'web' | 'systems';

export default function ProjectsPage({ lang }: { lang: Lang }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const [filter, setFilter] = useState<Filter>('all');
  const [filterTouched, setFilterTouched] = useState(false);
  const filterPill = useSlidingPill<HTMLDivElement>(filter);

  // Projects with a screenshot come first so image cards share a row (sort is stable).
  const projects = PROJECTS.filter((p) => filter === 'all' || p.category === filter).sort(
    (a, b) => Number(!!b.image) - Number(!!a.image),
  );
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t(`All (${PROJECTS.length})`, `Tümü (${PROJECTS.length})`) },
    { id: 'ml', label: t('Machine Learning', 'Makine Öğrenmesi') },
    { id: 'web', label: t('Web & Full-Stack', 'Web & Full-Stack') },
    { id: 'systems', label: t('Systems & Automation', 'Sistem & Otomasyon') },
  ];

  return (
    <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
      <SectionHeader
        as="h1"
        eyebrow={t('Projects', 'Projeler')}
        title={t('Things I’ve built', 'Geliştirdiklerim')}
        desc={t(
          'Competition entries, products and tools, grouped by focus area.',
          'Yarışma projeleri, ürünler ve araçlar; odak alanına göre gruplandı.',
        )}
      />
      <div {...rv}>
        <div
          ref={filterPill.containerRef}
          className="relative flex flex-wrap sm:inline-flex gap-1 rounded-2xl sm:rounded-full bg-card border border-line p-1 mb-8 shadow-sm dark:shadow-none"
        >
          <span ref={filterPill.pillRef} aria-hidden className="seg-pill absolute left-0 top-0 rounded-full bg-ink" />
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                if (f.id === filter) return;
                setFilter(f.id);
                setFilterTouched(true);
              }}
              aria-pressed={filter === f.id}
              className={`relative px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                filter === f.id ? 'text-on-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyed by filter so a filter change re-mounts the cards with a quick fade-in. */}
      <div key={filter} className="grid lg:grid-cols-2 gap-6">
        {projects.map((p, i) => {
          const href = localePath(lang, `/projects/${p.id}/`);
          return (
            <article
              key={p.id}
              {...(filterTouched ? {} : rv)}
              style={filterTouched ? { animationDelay: `${Math.min(i, 3) * 30}ms` } : undefined}
              data-glow
              className={`${card} p-5 sm:p-7 flex flex-col ${lift} ${filterTouched ? 'filter-in' : ''}`}
            >
              {p.image && (
                <Link
                  href={href}
                  tabIndex={-1}
                  className="block -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 mb-5 sm:mb-7 overflow-hidden rounded-t-2xl border-b border-line/80"
                >
                  <img
                    src={`/${p.image}`}
                    alt={t(`${p.name} screenshot`, `${p.name} ekran görüntüsü`)}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="block w-full aspect-[2/1] object-cover object-top"
                  />
                </Link>
              )}
              <div className="flex items-center justify-between gap-3 text-sm">
                {p.badge ? (
                  <span className="rounded-full bg-accent/10 text-accent font-medium px-3 py-1 text-xs">{p.badge[lang]}</span>
                ) : (
                  <span />
                )}
                <span className="text-faint shrink-0">{p.period[lang]}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <h2 className="text-xl font-semibold text-ink">
                  <Link href={href} className="hover:text-accent transition-colors">
                    {p.name}
                  </Link>
                </h2>
                <div className="flex gap-3 text-sm font-medium shrink-0">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                      <Globe className="w-4 h-4" /> {t('Live', 'Canlı')}
                    </a>
                  )}
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.summary[lang]}</p>

              {p.metrics && (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-inset p-4">
                  {p.metrics.map((m, i) => (
                    <div key={i}>
                      <div className="text-xs text-subtle">{m.label[lang]}</div>
                      <div className="mt-0.5 font-semibold text-ink">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <ul className="mt-5 space-y-2.5 text-sm leading-relaxed">
                {p.bullets[lang].map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-line-strong shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {p.agentNote && (
                <div className="mt-5 flex gap-2.5 rounded-xl bg-accent/5 dark:bg-accent/[0.08] text-sm text-body p-3.5">
                  <Terminal className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{p.agentNote[lang]}</span>
                </div>
              )}

              <div className="mt-auto pt-6 flex flex-wrap gap-2">
                {p.tech.map((x) => (
                  <span key={x} className={chip}>
                    {x}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <h2 {...rv} className="mt-16 mb-5 text-lg font-semibold text-ink">
        {t('Smaller projects', 'Diğer küçük projeler')}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MINI_PROJECTS.map((m) => (
          <div key={m.name} {...rv} data-glow className={`${card} p-5 ${lift}`}>
            <div className="text-xs font-medium text-accent">{m.tech}</div>
            <div className="mt-1.5 font-semibold text-ink">{m.name}</div>
            <p className="mt-2 text-sm text-muted leading-relaxed">{m.desc[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

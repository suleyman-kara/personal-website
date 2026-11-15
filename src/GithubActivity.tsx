'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import activity from './data/github.json';
import { rv } from './motion';
import type { Lang } from './data/portfolioData';

// src/data/github.json is rewritten daily by scripts/fetch-github.mjs (.github/workflows/github-activity.yml).
interface Day {
  date: string;
  count: number;
  level: number;
}
interface Repo {
  name: string;
  url: string;
  description: string;
  pushedAt: string;
  language: string | null;
  languageColor: string | null;
}
interface Activity {
  fetchedAt: string | null;
  total: number;
  weeks: Day[][];
  repos: Repo[];
}

const data = activity as Activity;
// Dark mode steps up from the card toward the light accent tint, so busier days read brighter.
const LEVEL = [
  'bg-chip',
  'bg-[#635BFF]/25 dark:bg-[#32389C]',
  'bg-[#635BFF]/50 dark:bg-[#4943C4]',
  'bg-[#635BFF]/75 dark:bg-[#6E66F2]',
  'bg-[#635BFF] dark:bg-[#ABA6FF]',
];
const locale = (lang: Lang) => (lang === 'tr' ? 'tr-TR' : 'en-US');
const utc = (iso: string) => new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);

export default function GithubActivity({
  lang,
  profileUrl,
  cardClass,
}: {
  lang: Lang;
  profileUrl: string;
  cardClass: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  // On narrow screens the calendar scrolls sideways; start at the most recent weeks.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  if (!data.weeks.length) return null;

  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const month = new Intl.DateTimeFormat(locale(lang), { month: 'short', timeZone: 'UTC' });
  const dayFmt = new Intl.DateTimeFormat(locale(lang), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const shortFmt = new Intl.DateTimeFormat(locale(lang), { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const total = data.total.toLocaleString(locale(lang));

  // Label a column when its week starts a new month (skip a partial first column).
  const labels = data.weeks.map((w, i) => {
    const m = utc(w[0].date).getUTCMonth();
    const prev = i > 0 ? utc(data.weeks[i - 1][0].date).getUTCMonth() : m;
    return i > 0 && m !== prev ? month.format(utc(w[0].date)) : '';
  });

  return (
    <div {...rv} data-glow className={`${cardClass} p-5 sm:p-7 grid lg:grid-cols-12 gap-8`}>
        <div className="lg:col-span-8 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-semibold text-ink">
              {t(`${total} contributions in the last year`, `Son bir yılda ${total} katkı`)}
            </h3>
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              <Github className="w-4 h-4" /> GitHub
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div
            ref={scroller}
            className="mt-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              className="grid grid-flow-col auto-cols-[10px] grid-rows-[14px_repeat(7,10px)] gap-[3px] w-max"
              role="img"
              aria-label={t(
                `Contribution calendar: ${total} contributions in the last year`,
                `Katkı takvimi: son bir yılda ${total} katkı`,
              )}
            >
              {data.weeks.map((week, i) => (
                <div key={week[0].date} className="contents">
                  <div className="text-[10px] leading-[14px] text-faint whitespace-nowrap overflow-visible">
                    {labels[i]}
                  </div>
                  {/* The first week can start mid-week: pad so days stay on their weekday row. */}
                  {i === 0 &&
                    Array.from({ length: 7 - week.length }, (_, k) => <div key={`pad-${k}`} />)}
                  {week.map((d) => (
                    <div
                      key={d.date}
                      title={`${dayFmt.format(utc(d.date))}: ${d.count}`}
                      className={`rounded-[2px] ${LEVEL[d.level] ?? LEVEL[0]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-faint">
            {t('Less', 'Az')}
            {LEVEL.map((c) => (
              <span key={c} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
            ))}
            {t('More', 'Çok')}
          </div>
        </div>

        {data.repos.length > 0 && (
          <div className="lg:col-span-4 min-w-0">
            <div className="text-sm text-subtle">{t('Recently updated', 'Son güncellenenler')}</div>
            <ul className="mt-3 space-y-3 text-sm">
              {data.repos.map((r) => (
                <li key={r.name} className="flex items-baseline justify-between gap-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 truncate font-medium text-ink hover:text-accent transition-colors"
                  >
                    {r.name}
                  </a>
                  <span className="shrink-0 inline-flex items-center gap-2 text-subtle">
                    {r.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: r.languageColor ?? '#94a3b8' }}
                        />
                        {r.language}
                      </span>
                    )}
                    <span className="text-faint">{shortFmt.format(utc(r.pushedAt))}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Globe, Terminal } from 'lucide-react';
import { PROJECTS, type ProjectItem } from '@/data/portfolioData';
import { localePath, type Lang } from '@/lib/site';
import { card, chip, lift, nudgeLeft, nudgeRight, nudgeUpRight, primaryBtn, secondaryBtn } from '../styles';

const CATEGORY: Record<ProjectItem['category'], { en: string; tr: string }> = {
  ml: { en: 'Machine Learning', tr: 'Makine Öğrenmesi' },
  web: { en: 'Web & Full-Stack', tr: 'Web & Full-Stack' },
  systems: { en: 'Systems & Automation', tr: 'Sistem & Otomasyon' },
};

export default function ProjectDetail({ lang, project: p }: { lang: Lang; project: ProjectItem }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const i = PROJECTS.findIndex((x) => x.id === p.id);
  const prev = i > 0 ? PROJECTS[i - 1] : null;
  const next = i < PROJECTS.length - 1 ? PROJECTS[i + 1] : null;
  const projectHref = (x: ProjectItem) => localePath(lang, `/projects/${x.id}/`);

  return (
    <article className="max-w-3xl mx-auto px-5 pt-10 sm:pt-14 pb-16 sm:pb-24">
      <Link href={localePath(lang, '/projects/')} className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors">
        <ArrowLeft className={`w-4 h-4 ${nudgeLeft}`} /> {t('All projects', 'Tüm projeler')}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          {p.badge && <span className="rounded-full bg-accent/10 text-accent font-medium px-3 py-1 text-xs">{p.badge[lang]}</span>}
          <span className="text-faint">{p.period[lang]}</span>
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-ink">{p.name}</h1>
        <p className="mt-5 text-lg sm:text-xl leading-relaxed text-muted">{p.summary[lang]}</p>
        {(p.liveUrl || p.repoUrl) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className={primaryBtn}>
                <Globe className="w-4 h-4" /> {t('Live site', 'Canlı site')} <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
              </a>
            )}
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noreferrer" className={secondaryBtn}>
                <Github className="w-4 h-4" /> GitHub <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
              </a>
            )}
          </div>
        )}
      </header>

      {p.image && (
        <figure className="mt-10 overflow-hidden rounded-2xl border border-line/80 shadow-[0_13px_27px_-5px_rgba(50,50,93,0.15),0_8px_16px_-8px_rgba(0,0,0,0.1)] dark:shadow-none">
          <img
            src={`/${p.image}`}
            alt={t(`${p.name} screenshot`, `${p.name} ekran görüntüsü`)}
            width={1280}
            height={800}
            className="block w-full h-auto"
          />
        </figure>
      )}

      {p.metrics && (
        <dl className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5 rounded-2xl bg-inset border border-line/60 p-5 sm:p-6">
          {p.metrics.map((m, k) => (
            <div key={k}>
              <dt className="text-xs text-subtle">{m.label[lang]}</dt>
              <dd className="mt-1 font-semibold text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-ink">{t('Highlights', 'Öne çıkanlar')}</h2>
        <ul className="mt-5 space-y-4 text-[17px] leading-relaxed">
          {p.bullets[lang].map((b, k) => (
            <li key={k} className="flex gap-3.5">
              <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {p.agentNote && (
          <div className="mt-8 flex gap-3 rounded-xl bg-accent/5 dark:bg-accent/[0.08] text-[15px] leading-relaxed text-body p-4">
            <Terminal className="w-4 h-4 text-accent shrink-0 mt-1" />
            <span>{p.agentNote[lang]}</span>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-ink">{t('Tech', 'Teknolojiler')}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`${chip} bg-accent/10 text-accent`}>{CATEGORY[p.category][lang]}</span>
          {p.tech.map((x) => (
            <span key={x} className={chip}>
              {x}
            </span>
          ))}
        </div>
      </section>

      <nav aria-label={t('More projects', 'Diğer projeler')} className="mt-16 pt-8 border-t border-line/70 grid sm:grid-cols-2 gap-4">
        {prev ? (
          <Link href={projectHref(prev)} data-glow className={`group ${card} ${lift} p-5 block`}>
            <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
              <ArrowLeft className={`w-3.5 h-3.5 ${nudgeLeft}`} /> {t('Previous project', 'Önceki proje')}
            </span>
            <span className="mt-1.5 block font-semibold text-ink">{prev.name}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link href={projectHref(next)} data-glow className={`group ${card} ${lift} p-5 block sm:text-right`}>
            <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
              {t('Next project', 'Sonraki proje')} <ArrowRight className={`w-3.5 h-3.5 ${nudgeRight}`} />
            </span>
            <span className="mt-1.5 block font-semibold text-ink">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}

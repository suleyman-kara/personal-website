'use client';

import { Award, Github, Globe, Trophy } from 'lucide-react';
import { COMPETITIONS, EXPERIENCES, PROFILE_DATA, SKILL_GROUPS } from '@/data/portfolioData';
import { rv } from '@/motion';
import GithubActivity from '@/GithubActivity';
import LiveForecast from '../LiveForecast';
import type { Lang } from '@/lib/site';
import { SectionHeader } from '../ui';
import { card, chip } from '../styles';

const SECTIONS = [
  { id: 'experience', en: 'Experience', tr: 'Deneyim' },
  { id: 'skills', en: 'Skills', tr: 'Beceriler' },
  { id: 'github', en: 'GitHub', tr: 'GitHub' },
  { id: 'awards', en: 'Awards', tr: 'Dereceler' },
  { id: 'education', en: 'Education', tr: 'Eğitim' },
];
const anchor = 'scroll-mt-28 md:scroll-mt-20';

export default function AboutPage({ lang }: { lang: Lang }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);

  return (
    <>
      <section className="max-w-6xl mx-auto px-5 pt-16 sm:pt-24">
        <div {...rv} className="max-w-3xl">
          <div className="text-sm font-semibold text-accent mb-3">{t('About', 'Hakkımda')}</div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{PROFILE_DATA.title[lang]}</h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">{PROFILE_DATA.summary[lang]}</p>
        </div>
        <nav {...rv} aria-label={t('On this page', 'Bu sayfada')} className="mt-8 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full bg-chip text-muted hover:text-accent text-sm font-medium px-3.5 py-1.5 transition-colors"
            >
              {t(s.en, s.tr)}
            </a>
          ))}
        </nav>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className={`max-w-6xl mx-auto px-5 py-16 sm:py-24 ${anchor}`}>
        <SectionHeader
          eyebrow={t('Experience', 'Deneyim')}
          title={t('Where I’ve worked', 'Çalıştığım yerler')}
          desc={t(
            'Internship, team and freelance work across ML, backend and web.',
            'ML, backend ve web alanlarında staj, takım ve freelance işler.',
          )}
        />
        <div className="space-y-5">
          {EXPERIENCES.map((exp) => (
            <article key={exp.id} {...rv} data-glow className={`${card} p-6 sm:p-8 grid lg:grid-cols-12 gap-6`}>
              <div className="lg:col-span-4">
                <div className="text-sm text-subtle">{exp.period[lang]}</div>
                <h3 className="mt-2 text-xl font-semibold text-ink">{exp.role[lang]}</h3>
                <div className="text-accent font-medium">{exp.company}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={chip}>{exp.type[lang]}</span>
                  <span className={chip}>{exp.location[lang]}</span>
                </div>
                {exp.mentors && <p className="mt-3 text-sm text-subtle">{exp.mentors[lang]}</p>}
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                  {exp.liveUrl && (
                    <a href={exp.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                      <Globe className="w-4 h-4" /> {t('Live site', 'Canlı site')}
                    </a>
                  )}
                  {exp.repoUrl && (
                    <a href={exp.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                      <Github className="w-4 h-4" /> Repo
                    </a>
                  )}
                </div>
                {exp.image && (
                  <a href={exp.liveUrl} target="_blank" rel="noreferrer" className="mt-5 block overflow-hidden rounded-xl border border-line/80 max-w-sm">
                    <img
                      src={`/${exp.image}`}
                      alt={t(`${exp.company} website`, `${exp.company} web sitesi`)}
                      loading="lazy"
                      width={1280}
                      height={800}
                      className="block w-full aspect-[16/10] object-cover object-top"
                    />
                  </a>
                )}
              </div>
              <div className="lg:col-span-8">
                <ul className="space-y-3 text-[15px] leading-relaxed">
                  {exp.bullets[lang].map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className={chip}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className={`bg-band border-y border-line/70 ${anchor}`}>
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <SectionHeader eyebrow={t('Skills', 'Beceriler')} title={t('Technical stack', 'Teknik yetkinlikler')} />
          <div className="grid md:grid-cols-2 gap-5">
            {SKILL_GROUPS.map((g) => (
              <div key={g.code} {...rv} data-glow className={`${card} p-5 sm:p-7`}>
                <h3 className="font-semibold text-ink mb-4">{g.title[lang]}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span key={s} className={chip}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div id="github" className={`mt-5 ${anchor}`}>
            <GithubActivity lang={lang} profileUrl={PROFILE_DATA.github} cardClass={card} />
          </div>
          <div className="mt-5">
            <LiveForecast lang={lang} variant="compact" />
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section id="awards" className={`max-w-6xl mx-auto px-5 py-16 sm:py-24 ${anchor}`}>
        <SectionHeader eyebrow={t('Competitions', 'Yarışmalar')} title={t('Awards & events', 'Dereceler ve etkinlikler')} />
        <div className="grid md:grid-cols-2 gap-5">
          {COMPETITIONS.map((c, i) => (
            <div key={i} {...rv} data-glow className={`${card} p-6 flex gap-4 ${c.highlight ? 'ring-1 ring-accent/30' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.highlight ? 'bg-[#635BFF] text-white' : 'bg-chip text-subtle'}`}>
                {c.highlight ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm text-subtle">{typeof c.date === 'string' ? c.date : c.date[lang]}</div>
                <h3 className="mt-1 font-semibold text-ink leading-snug">{c.title[lang]}</h3>
                <p className="mt-1.5 text-sm text-muted">{c.result[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION & COMMUNITY */}
      <section id="education" className={`bg-band border-t border-line/70 ${anchor}`}>
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <SectionHeader eyebrow={t('Background', 'Geçmiş')} title={t('Education & community', 'Eğitim ve topluluk')} />
          <div className="grid md:grid-cols-3 gap-5">
            <div {...rv} data-glow className={`${card} p-7`}>
              <div className="text-sm text-subtle">{t('Education', 'Eğitim')}</div>
              <h3 className="mt-2 text-lg font-semibold text-ink">{PROFILE_DATA.education.school[lang]}</h3>
              <p className="text-accent font-medium text-sm">{PROFILE_DATA.education.degree[lang]}</p>
              <p className="mt-3 text-sm text-subtle">{PROFILE_DATA.education.period[lang]}</p>
              <p className="mt-1 text-sm font-medium text-strong">GPA {PROFILE_DATA.education.gpa}</p>
            </div>
            <div {...rv} data-glow className={`${card} p-7`}>
              <div className="text-sm text-subtle">{t('Languages', 'Diller')}</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between">
                  <span>{t('Turkish', 'Türkçe')}</span>
                  <span className="font-medium text-ink">{t('Native', 'Ana dil')}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('English', 'İngilizce')}</span>
                  <span className="font-medium text-ink">C1</span>
                </li>
              </ul>
            </div>
            <div {...rv} data-glow className={`${card} p-7`}>
              <div className="text-sm text-subtle">{t('Community', 'Topluluk')}</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between gap-3">
                  <span>CENGA</span>
                  <span className="font-medium text-ink text-right">{t('Social Events Coordinator', 'Sosyal Etkinlikler Koordinatörü')}</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>TEMA</span>
                  <span className="font-medium text-ink text-right">{t('Volunteer (5 yrs, passive)', 'Gönüllü (5 yıl, pasif)')}</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Kaggle</span>
                  <a href={PROFILE_DATA.kaggle} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
                    @sleymankara
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

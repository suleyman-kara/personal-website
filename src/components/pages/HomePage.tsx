'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  GraduationCap,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Medal,
  Trophy,
} from 'lucide-react';
import { PROFILE_DATA, PROJECTS } from '@/data/portfolioData';
import { rv } from '@/motion';
import { HeroPhoto } from '@/fun';
import type { StreamItem } from '@/lib/content';
import { localePath, type Lang } from '@/lib/site';
import { SectionHeader } from '../ui';
import { card, lift, nudgeRight, nudgeUpRight, press, primaryBtn, secondaryBtn, textLink } from '../styles';
import PostCard from '../PostCard';

const AI_STEPS = [
  {
    title: { en: 'Agent rules & memory', tr: 'Ajan kuralları & hafıza' },
    desc: {
      en: 'CLAUDE.md files define document priority, target metrics and changelog rules so the agent understands the project across sessions.',
      tr: 'CLAUDE.md dosyaları doküman önceliğini, hedef metrikleri ve değişiklik kaydı kurallarını tanımlar; ajan projeyi oturumlar arası doğru anlar.',
    },
    tag: 'PathGuard · Shock Convert',
  },
  {
    title: { en: 'Agentic development', tr: 'Ajan destekli geliştirme' },
    desc: {
      en: 'Claude Code, downloaded Claude skills and sub-agents speed up delivery while I own architecture, decisions and review.',
      tr: 'Claude Code, indirilen Claude skill’leri ve alt ajanlar hızı artırır; mimari, kararlar ve inceleme bende kalır.',
    },
    tag: 'Claude Code · Gemini SDK',
  },
  {
    title: { en: 'Verification', tr: 'Doğrulama' },
    desc: {
      en: 'Database rules with RLS and triggers, leakage-safe ML validation, and Vitest / Jest / Rust test suites.',
      tr: 'RLS ve trigger ile veritabanı kuralları, sızıntısız ML doğrulaması ve Vitest / Jest / Rust test paketleri.',
    },
    tag: 'Supabase RLS · Stratified CV',
  },
  {
    title: { en: 'CI/CD & releases', tr: 'CI/CD & sürümler' },
    desc: {
      en: 'GitHub Actions for PR pre-releases, label-driven semantic versions, scheduled rebuilds and Cloudflare Pages deploys.',
      tr: 'PR ön sürümleri, etiketle yönetilen semantik sürümler, zamanlanmış derlemeler ve Cloudflare Pages yayını için GitHub Actions.',
    },
    tag: 'GitHub Actions · Cloudflare',
  },
];

const HIGHLIGHT_STYLES = [
  { icon: Trophy, border: 'border-t-amber-400', iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300', value: 'text-amber-600 dark:text-amber-300' },
  { icon: Medal, border: 'border-t-[#635BFF]', iconBg: 'bg-accent/10 text-accent', value: 'text-accent' },
  { icon: GraduationCap, border: 'border-t-sky-400', iconBg: 'bg-sky-100 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300', value: 'text-sky-600 dark:text-sky-300' },
  { icon: Languages, border: 'border-t-emerald-400', iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300', value: 'text-emerald-600 dark:text-emerald-300' },
];

const FEATURED = ['suiz', 'pathguard', 'shock-convert'];

export default function HomePage({ lang, articles }: { lang: Lang; articles: StreamItem[] }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const featured = FEATURED.map((id) => PROJECTS.find((p) => p.id === id)!).filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section data-hero-light className="relative overflow-hidden">
        <div className="stripe-hero absolute inset-x-0 top-0 h-[560px] -skew-y-6 origin-top-left -translate-y-24" />
        <div className="hero-light" />
        <div className="relative max-w-6xl mx-auto px-5 pt-12 sm:pt-20 pb-16 sm:pb-24 lg:pt-28">
          <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-10 lg:gap-16">
            <div className="max-w-3xl">
              <h1 className="hero-in text-4xl min-[400px]:text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-ink">
                {t('Machine learning and web products,', 'Makine öğrenmesi ve web ürünleri,')}{' '}
                <span className="bg-gradient-to-r from-[#635BFF] to-[#00A3FF] dark:from-[#8F88FF] dark:to-[#3CC3FF] bg-clip-text text-transparent">
                  {t('built end to end.', 'uçtan uca geliştirildi.')}
                </span>
              </h1>
              <p className="hero-in mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl" style={{ animationDelay: '70ms' }}>
                {PROFILE_DATA.summary[lang]}
              </p>
              <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '140ms' }}>
                <Link href={localePath(lang, '/projects/')} className={primaryBtn}>
                  {t('View projects', 'Projeleri gör')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
                </Link>
                <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className={secondaryBtn}>
                  <Linkedin className="w-4 h-4" /> LinkedIn <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
                </a>
                <a href={PROFILE_DATA.github} target="_blank" rel="noreferrer" className={secondaryBtn}>
                  <Github className="w-4 h-4" /> GitHub <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
                </a>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full text-muted hover:text-accent text-sm font-medium px-3 py-3 transition-colors"
                >
                  <span className="relative w-4 h-4" aria-hidden>
                    <Copy className={`absolute inset-0 w-4 h-4 transition-[opacity,transform] duration-200 ease-out-expo ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} />
                    <Check className={`absolute inset-0 w-4 h-4 text-emerald-500 transition-[opacity,transform] duration-200 ease-out-expo ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                  </span>
                  {copied ? t('Copied!', 'Kopyalandı!') : PROFILE_DATA.email}
                </button>
              </div>
              <div className="hero-in mt-8 flex flex-wrap gap-5 text-sm text-subtle" style={{ animationDelay: '210ms' }}>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {PROFILE_DATA.location[lang]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> {PROFILE_DATA.education.school[lang]}
                </span>
              </div>
            </div>
            <HeroPhoto src="/profile.jpg" alt={PROFILE_DATA.name} lang={lang} className="hero-in" style={{ animationDelay: '100ms' }} />
          </div>

          {/* Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROFILE_DATA.systemMetrics.map((m, i) => {
              const s = HIGHLIGHT_STYLES[i % HIGHLIGHT_STYLES.length];
              const Icon = s.icon;
              return (
                <div key={m.code} className={`hero-in ${card} p-6 border-t-4 ${s.border}`} style={{ animationDelay: `${280 + i * 50}ms` }}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`mt-5 text-3xl font-semibold tracking-tight ${s.value}`}>{m.value}</div>
                  <div className="mt-2 text-sm font-semibold text-strong">{m.label[lang]}</div>
                  <div className="mt-1 text-sm text-subtle">{m.sub[lang]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-band border-y border-line/70">
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <SectionHeader eyebrow={t('Projects', 'Projeler')} title={t('Featured projects', 'Öne çıkan projeler')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => {
              const href = localePath(lang, `/projects/${p.id}/`);
              return (
                <article key={p.id} {...rv} data-glow className={`${card} p-5 sm:p-6 flex flex-col ${lift}`}>
                  {p.image && (
                    <Link
                      href={href}
                      tabIndex={-1}
                      className="block -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl border-b border-line/80"
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
                  {p.badge && (
                    <span className="self-start rounded-full bg-accent/10 text-accent font-medium px-3 py-1 text-xs">{p.badge[lang]}</span>
                  )}
                  <h3 className="mt-4 text-xl font-semibold text-ink">
                    <Link href={href} className="hover:text-accent transition-colors">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary[lang]}</p>
                  {!p.image && p.metrics && (
                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-inset p-4">
                      {p.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="text-xs text-subtle">{m.label[lang]}</div>
                          <div className="mt-0.5 font-semibold text-ink">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-5">
                    <Link href={href} className={textLink} aria-label={t(`${p.name} details`, `${p.name} ayrıntıları`)}>
                      {t('Details', 'Ayrıntılar')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div {...rv} className="mt-10">
            <Link href={localePath(lang, '/projects/')} className={`${secondaryBtn} text-sm`}>
              {t('All projects', 'Tüm projeler')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST WRITING (articles only) */}
      {articles.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <SectionHeader eyebrow="Blog" title={t('Latest writing', 'Son yazılar')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <PostCard key={a.key} item={a} lang={lang} />
            ))}
          </div>
          <div {...rv} className="mt-10">
            <Link href={localePath(lang, '/blog/')} className={`${secondaryBtn} text-sm`}>
              {t('All posts', 'Tüm yazılar')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
            </Link>
          </div>
        </section>
      )}

      {/* AI ENGINEERING (dark navy, Stripe-style) */}
      <section id="ai" className="bg-feature text-slate-300 dark:border-y dark:border-white/[0.06] relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#635BFF]/30 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24">
          <div {...rv} className="max-w-2xl mb-12">
            <div className="text-sm font-semibold text-[#A29BFE] mb-3">{t('AI-assisted engineering', 'Yapay zeka destekli geliştirme')}</div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {t('Shipping with AI coding agents', 'AI kodlama ajanlarıyla yayına alma')}
            </h2>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{PROFILE_DATA.agenticStatement[lang]}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AI_STEPS.map((s, i) => (
              <div key={i} {...rv} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
                <div className="text-sm font-semibold text-[#A29BFE]">0{i + 1}</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{s.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.desc[lang]}</p>
                <div className="mt-4 text-xs font-medium text-[#00D4FF]">{s.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-5 py-16 sm:py-24 scroll-mt-28 md:scroll-mt-16">
        <div {...rv} className="max-w-6xl mx-auto rounded-3xl stripe-cta text-white px-5 sm:px-8 py-14 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t('Let’s work together', 'Birlikte çalışalım')}</h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            {t(
              'Open to ML, full-stack and software engineering internships. Reach out any time.',
              'ML, full-stack ve yazılım mühendisliği stajlarına açığım. Dilediğiniz zaman ulaşın.',
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${PROFILE_DATA.email}`} className={`inline-flex items-center gap-2 rounded-full bg-white text-[#0A2540] font-medium px-5 sm:px-6 py-3 text-[13px] sm:text-base hover:bg-slate-100 ${press}`}>
              <Mail className="w-4 h-4" /> {PROFILE_DATA.email}
            </a>
            <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 hover:bg-white/20 font-medium px-6 py-3 ${press}`}>
              <Linkedin className="w-4 h-4" /> LinkedIn <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
            </a>
            <a href={PROFILE_DATA.github} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 hover:bg-white/20 font-medium px-6 py-3 ${press}`}>
              <Github className="w-4 h-4" /> GitHub <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

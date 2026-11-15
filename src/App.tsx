import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  Copy,
  Github,
  Languages,
  Linkedin,
  Medal,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Moon,
  Sun,
  Terminal,
  Trophy,
} from 'lucide-react';
import {
  Lang,
  PROFILE_DATA,
  EXPERIENCES,
  PROJECTS,
  MINI_PROJECTS,
  SKILL_GROUPS,
  COMPETITIONS,
} from './data/portfolioData';
import { reveal, useKeepActiveInView, useScrollSpy, useSlidingPill } from './motion';
import GithubActivity from './GithubActivity';
import { useTheme } from './theme';

type Filter = 'all' | 'ml' | 'web' | 'systems';

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

const NAV = [
  { id: 'experience', en: 'Experience', tr: 'Deneyim' },
  { id: 'projects', en: 'Projects', tr: 'Projeler' },
  { id: 'ai', en: 'AI Engineering', tr: 'AI Mühendisliği' },
  { id: 'skills', en: 'Skills', tr: 'Beceriler' },
  { id: 'awards', en: 'Awards', tr: 'Dereceler' },
  { id: 'about', en: 'Education', tr: 'Eğitim' },
];
const SPY_IDS = [...NAV.map((n) => n.id), 'contact'];

const HIGHLIGHT_STYLES = [
  { icon: Trophy, border: 'border-t-amber-400', iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300', value: 'text-amber-600 dark:text-amber-300' },
  { icon: Medal, border: 'border-t-[#635BFF]', iconBg: 'bg-accent/10 text-accent', value: 'text-accent' },
  { icon: GraduationCap, border: 'border-t-sky-400', iconBg: 'bg-sky-100 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300', value: 'text-sky-600 dark:text-sky-300' },
  { icon: Languages, border: 'border-t-emerald-400', iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300', value: 'text-emerald-600 dark:text-emerald-300' },
];

const card =
  'rounded-2xl bg-card border border-line/80 shadow-[0_2px_5px_-1px_rgba(50,50,93,0.08),0_1px_3px_-1px_rgba(0,0,0,0.06)] dark:shadow-none';
// Shared hover/press polish. Lift: project-family cards. Press: primary/secondary buttons.
const lift =
  'transition-[transform,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_13px_27px_-5px_rgba(50,50,93,0.15),0_8px_16px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] dark:hover:border-line-strong';
const press = 'transition-[color,background-color,border-color,transform] duration-200 ease-out-expo active:scale-[0.98]';
const nudgeRight = 'transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5';
const nudgeUpRight = `${nudgeRight} group-hover:-translate-y-0.5`;
const chip =
  'inline-flex items-center rounded-full bg-chip text-muted text-xs font-medium px-2.5 py-1';

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div ref={reveal} className="max-w-2xl mb-12">
      <div className="text-sm font-semibold text-accent mb-3">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{title}</h2>
      {desc && <p className="mt-4 text-lg text-muted leading-relaxed">{desc}</p>}
    </div>
  );
}

const LANG_KEY = 'lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'tr';

// Order: ?lang= in the URL, then a remembered choice, then the browser language.
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(initialLang);
  // An explicit choice is remembered and reflected in the URL so a link keeps its language.
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState(null, '', url);
  };
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const [filter, setFilter] = useState<Filter>('all');
  const [copied, setCopied] = useState(false);
  const [filterTouched, setFilterTouched] = useState(false);
  const { active: activeSection, select: selectSection } = useScrollSpy(SPY_IDS);
  const mobileNavRef = useRef<HTMLElement>(null);
  useKeepActiveInView(mobileNavRef, activeSection);
  const langPill = useSlidingPill<HTMLDivElement>(lang);
  const filterPill = useSlidingPill<HTMLDivElement>(filter);

  // The page renders client-side, so the browser's own jump to a URL hash (e.g. /#awards)
  // happens before the target exists. Jump once after mount.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const { theme, toggle: toggleTheme } = useTheme();
  const dark = theme === 'dark';

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="min-h-screen bg-page text-body font-sans">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-page/80 backdrop-blur-xl border-b border-line/70">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-semibold text-ink">
            <img src="profile.jpg" alt="" className="w-8 h-8 rounded-full object-cover" />
            {PROFILE_DATA.name}
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => selectSection(n.id)}
                aria-current={activeSection === n.id ? 'true' : undefined}
                className={`nav-link transition-colors ${activeSection === n.id ? 'text-accent' : 'hover:text-accent'}`}
              >
                {t(n.en, n.tr)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div ref={langPill.containerRef} className="relative inline-flex rounded-full bg-chip p-0.5 text-xs font-semibold">
              <span ref={langPill.pillRef} aria-hidden className="seg-pill absolute left-0 top-0 rounded-full bg-pill shadow-sm" />
              {(['en', 'tr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`relative px-3 py-1 rounded-full transition-colors duration-300 ${
                    lang === l ? 'text-ink' : 'text-subtle hover:text-strong'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? t('Switch to light theme', 'Açık temaya geç') : t('Switch to dark theme', 'Koyu temaya geç')}
              title={dark ? t('Light theme', 'Açık tema') : t('Dark theme', 'Koyu tema')}
              className="-mx-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-subtle hover:text-ink hover:bg-chip transition-colors"
            >
              <span className="relative w-4 h-4" aria-hidden>
                <Moon data-theme-icon className={`absolute inset-0 w-4 h-4 transition-[opacity,transform] duration-200 ease-out-expo ${dark ? 'opacity-0 scale-50 -rotate-45' : 'opacity-100 scale-100 rotate-0'}`} />
                <Sun data-theme-icon className={`absolute inset-0 w-4 h-4 transition-[opacity,transform] duration-200 ease-out-expo ${dark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-45'}`} />
              </span>
            </button>
            <a
              href="#contact"
              className={`group hidden sm:inline-flex items-center gap-1 rounded-full bg-[#635BFF] hover:bg-[#5249e6] text-white text-sm font-medium px-4 py-2 ${press}`}
            >
              {t('Contact', 'İletişim')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
            </a>
          </div>
        </div>
        <nav ref={mobileNavRef} className="md:hidden border-t border-line/70 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-5 px-5 h-11 text-sm font-medium text-muted whitespace-nowrap w-max">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                data-spy={n.id}
                onClick={() => selectSection(n.id)}
                aria-current={activeSection === n.id ? 'true' : undefined}
                className={`transition-colors ${activeSection === n.id ? 'text-accent' : 'hover:text-accent'}`}
              >
                {t(n.en, n.tr)}
              </a>
            ))}
            <a href="#contact" data-spy="contact" onClick={() => selectSection('contact')} className="text-accent font-semibold">{t('Contact', 'İletişim')}</a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="stripe-hero absolute inset-x-0 top-0 h-[560px] -skew-y-6 origin-top-left -translate-y-24" />
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
                <a
                  href="#projects"
                  className={`group inline-flex items-center gap-2 rounded-full bg-[#635BFF] hover:bg-[#5249e6] text-white font-medium px-6 py-3 shadow-lg shadow-[#635BFF]/25 ${press}`}
                >
                  {t('View projects', 'Projeleri gör')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
                </a>
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`group inline-flex items-center gap-1.5 rounded-full bg-card border border-line hover:border-line-strong text-ink font-medium px-6 py-3 shadow-sm ${press}`}
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn <ArrowUpRight className={`w-4 h-4 ${nudgeUpRight}`} />
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`group inline-flex items-center gap-1.5 rounded-full bg-card border border-line hover:border-line-strong text-ink font-medium px-6 py-3 shadow-sm ${press}`}
                >
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
            <img
              src="profile.jpg"
              alt={PROFILE_DATA.name}
              style={{ animationDelay: '100ms' }}
              className="hero-in w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-3xl object-cover shrink-0 shadow-2xl shadow-[#635BFF]/20 ring-4 ring-card"
            />
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

        {/* EXPERIENCE */}
        <section id="experience" className="max-w-6xl mx-auto px-5 py-16 sm:py-24 scroll-mt-28 md:scroll-mt-16">
          <SectionHeader
            eyebrow={t('Experience', 'Deneyim')}
            title={t('Where I’ve worked', 'Çalıştığım yerler')}
            desc={t(
              'Internship, team and freelance work across ML, backend and web.',
              'ML, backend ve web alanlarında staj, takım ve freelance işler.'
            )}
          />
          <div className="space-y-5">
            {EXPERIENCES.map((exp) => (
              <article key={exp.id} ref={reveal} className={`${card} p-6 sm:p-8 grid lg:grid-cols-12 gap-6`}>
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
                    <a
                      href={exp.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 block overflow-hidden rounded-xl border border-line/80 max-w-sm"
                    >
                      <img
                        src={exp.image}
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
                      <span key={tag} className={chip}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="bg-band border-y border-line/70 scroll-mt-28 md:scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
            <SectionHeader
              eyebrow={t('Projects', 'Projeler')}
              title={t('Things I’ve built', 'Geliştirdiklerim')}
              desc={t(
                'Competition entries, products and tools, grouped by focus area.',
                'Yarışma projeleri, ürünler ve araçlar; odak alanına göre gruplandı.'
              )}
            />
            <div ref={reveal}>
            <div ref={filterPill.containerRef} className="relative flex flex-wrap sm:inline-flex gap-1 rounded-2xl sm:rounded-full bg-card border border-line p-1 mb-8 shadow-sm dark:shadow-none">
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
              {projects.map((p, i) => (
                <article
                  key={p.id}
                  ref={filterTouched ? undefined : reveal}
                  style={filterTouched ? { animationDelay: `${Math.min(i, 3) * 30}ms` } : undefined}
                  className={`${card} p-5 sm:p-7 flex flex-col ${lift} ${filterTouched ? 'filter-in' : ''}`}
                >
                  {p.image && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 mb-5 sm:mb-7 overflow-hidden rounded-t-2xl border-b border-line/80"
                    >
                      <img
                        src={p.image}
                        alt={t(`${p.name} screenshot`, `${p.name} ekran görüntüsü`)}
                        loading="lazy"
                        width={1280}
                        height={800}
                        className="block w-full aspect-[2/1] object-cover object-top"
                      />
                    </a>
                  )}
                  <div className="flex items-center justify-between gap-3 text-sm">
                    {p.badge ? (
                      <span className="rounded-full bg-accent/10 text-accent font-medium px-3 py-1 text-xs">
                        {p.badge[lang]}
                      </span>
                    ) : <span />}
                    <span className="text-faint shrink-0">{p.period[lang]}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <h3 className="text-xl font-semibold text-ink">{p.name}</h3>
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
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-band p-4">
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
                    <div className="mt-5 flex gap-2.5 rounded-xl bg-accent/5 text-sm text-body p-3.5">
                      <Terminal className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{p.agentNote[lang]}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-6 flex flex-wrap gap-2">
                    {p.tech.map((x) => (
                      <span key={x} className={chip}>{x}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <h3 ref={reveal} className="mt-16 mb-5 text-lg font-semibold text-ink">
              {t('Smaller projects', 'Diğer küçük projeler')}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MINI_PROJECTS.map((m) => (
                <div key={m.name} ref={reveal} className={`${card} p-5 ${lift}`}>
                  <div className="text-xs font-medium text-accent">{m.tech}</div>
                  <div className="mt-1.5 font-semibold text-ink">{m.name}</div>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{m.desc[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI ENGINEERING (dark navy, Stripe-style) */}
        <section id="ai" className="bg-feature text-slate-300 dark:border-y dark:border-white/[0.06] scroll-mt-28 md:scroll-mt-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#635BFF]/30 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24">
            <div ref={reveal} className="max-w-2xl mb-12">
              <div className="text-sm font-semibold text-[#A29BFE] mb-3">{t('AI-assisted engineering', 'Yapay zeka destekli geliştirme')}</div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {t('Shipping with AI coding agents', 'AI kodlama ajanlarıyla yayına alma')}
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">{PROFILE_DATA.agenticStatement[lang]}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AI_STEPS.map((s, i) => (
                <div key={i} ref={reveal} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
                  <div className="text-sm font-semibold text-[#A29BFE]">0{i + 1}</div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{s.title[lang]}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.desc[lang]}</p>
                  <div className="mt-4 text-xs font-medium text-[#00D4FF]">{s.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="max-w-6xl mx-auto px-5 py-16 sm:py-24 scroll-mt-28 md:scroll-mt-16">
          <SectionHeader
            eyebrow={t('Skills', 'Beceriler')}
            title={t('Technical stack', 'Teknik yetkinlikler')}
          />
          <div className="grid md:grid-cols-2 gap-5">
            {SKILL_GROUPS.map((g) => (
              <div key={g.code} ref={reveal} className={`${card} p-5 sm:p-7`}>
                <h3 className="font-semibold text-ink mb-4">{g.title[lang]}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span key={s} className={chip}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <GithubActivity lang={lang} profileUrl={PROFILE_DATA.github} cardClass={card} />

        {/* AWARDS */}
        <section id="awards" className="bg-band border-y border-line/70 scroll-mt-28 md:scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
            <SectionHeader
              eyebrow={t('Competitions', 'Yarışmalar')}
              title={t('Awards & events', 'Dereceler ve etkinlikler')}
            />
            <div className="grid md:grid-cols-2 gap-5">
              {COMPETITIONS.map((c, i) => (
                <div key={i} ref={reveal} className={`${card} p-6 flex gap-4 ${c.highlight ? 'ring-1 ring-accent/30' : ''}`}>
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
          </div>
        </section>

        {/* EDUCATION & COMMUNITY */}
        <section id="about" className="max-w-6xl mx-auto px-5 py-16 sm:py-24 scroll-mt-28 md:scroll-mt-16">
          <SectionHeader
            eyebrow={t('Background', 'Geçmiş')}
            title={t('Education & community', 'Eğitim ve topluluk')}
          />
          <div className="grid md:grid-cols-3 gap-5">
            <div ref={reveal} className={`${card} p-7`}>
              <div className="text-sm text-subtle">{t('Education', 'Eğitim')}</div>
              <h3 className="mt-2 text-lg font-semibold text-ink">{PROFILE_DATA.education.school[lang]}</h3>
              <p className="text-accent font-medium text-sm">{PROFILE_DATA.education.degree[lang]}</p>
              <p className="mt-3 text-sm text-subtle">{PROFILE_DATA.education.period[lang]}</p>
              <p className="mt-1 text-sm font-medium text-strong">GPA {PROFILE_DATA.education.gpa}</p>
            </div>
            <div ref={reveal} className={`${card} p-7`}>
              <div className="text-sm text-subtle">{t('Languages', 'Diller')}</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between"><span>{t('Turkish', 'Türkçe')}</span><span className="font-medium text-ink">{t('Native', 'Ana dil')}</span></li>
                <li className="flex justify-between"><span>{t('English', 'İngilizce')}</span><span className="font-medium text-ink">C1</span></li>
              </ul>
            </div>
            <div ref={reveal} className={`${card} p-7`}>
              <div className="text-sm text-subtle">{t('Community', 'Topluluk')}</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between gap-3"><span>CENGA</span><span className="font-medium text-ink text-right">{t('Social Events Coordinator', 'Sosyal Etkinlikler Koordinatörü')}</span></li>
                <li className="flex justify-between gap-3"><span>TEMA</span><span className="font-medium text-ink text-right">{t('Volunteer (5 yrs, passive)', 'Gönüllü (5 yıl, pasif)')}</span></li>
                <li className="flex justify-between gap-3"><span>Kaggle</span><a href={PROFILE_DATA.kaggle} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">@sleymankara</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-5 pb-24 scroll-mt-28 md:scroll-mt-16">
          <div ref={reveal} className="max-w-6xl mx-auto rounded-3xl stripe-cta text-white px-5 sm:px-8 py-14 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t('Let’s work together', 'Birlikte çalışalım')}</h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
              {t(
                'Open to ML, full-stack and software engineering internships. Reach out any time.',
                'ML, full-stack ve yazılım mühendisliği stajlarına açığım. Dilediğiniz zaman ulaşın.'
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
      </main>

      <footer className="border-t border-line/70">
        <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 {PROFILE_DATA.name}</span>
          <div className="flex gap-5">
            <a href={PROFILE_DATA.github} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
            <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">LinkedIn</a>
            <a href={PROFILE_DATA.kaggle} target="_blank" rel="noreferrer" className="hover:text-accent">Kaggle</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

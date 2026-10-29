import React, { useState } from 'react';
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

const HIGHLIGHT_STYLES = [
  { icon: Trophy, border: 'border-t-amber-400', iconBg: 'bg-amber-100 text-amber-600', value: 'text-amber-600' },
  { icon: Medal, border: 'border-t-[#635BFF]', iconBg: 'bg-[#635BFF]/10 text-[#635BFF]', value: 'text-[#635BFF]' },
  { icon: GraduationCap, border: 'border-t-sky-400', iconBg: 'bg-sky-100 text-sky-600', value: 'text-sky-600' },
  { icon: Languages, border: 'border-t-emerald-400', iconBg: 'bg-emerald-100 text-emerald-600', value: 'text-emerald-600' },
];

const card =
  'rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_5px_-1px_rgba(50,50,93,0.08),0_1px_3px_-1px_rgba(0,0,0,0.06)]';
const chip =
  'inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1';

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="max-w-2xl mb-12">
      <div className="text-sm font-semibold text-[#635BFF] mb-3">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0A2540]">{title}</h2>
      {desc && <p className="mt-4 text-lg text-slate-600 leading-relaxed">{desc}</p>}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [filter, setFilter] = useState<Filter>('all');
  const [copied, setCopied] = useState(false);
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const projects = PROJECTS.filter((p) => filter === 'all' || p.category === filter);
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t(`All (${PROJECTS.length})`, `Tümü (${PROJECTS.length})`) },
    { id: 'ml', label: t('Machine Learning', 'Makine Öğrenmesi') },
    { id: 'web', label: t('Web & Full-Stack', 'Web & Full-Stack') },
    { id: 'systems', label: t('Systems & Automation', 'Sistem & Otomasyon') },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-semibold text-[#0A2540]">
            <img src="profile.jpg" alt="" className="w-8 h-8 rounded-full object-cover" />
            {PROFILE_DATA.name}
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="hover:text-[#635BFF] transition-colors">
                {t(n.en, n.tr)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full bg-slate-100 p-0.5 text-xs font-semibold">
              {(['en', 'tr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    lang === l ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#635BFF] hover:bg-[#5249e6] text-white text-sm font-medium px-4 py-2 transition-colors"
            >
              {t('Contact', 'İletişim')} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <nav className="md:hidden border-t border-slate-200/70 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-5 px-5 h-11 text-sm font-medium text-slate-600 whitespace-nowrap w-max">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="hover:text-[#635BFF] transition-colors">
                {t(n.en, n.tr)}
              </a>
            ))}
            <a href="#contact" className="text-[#635BFF] font-semibold">{t('Contact', 'İletişim')}</a>
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
              <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-[#0A2540]">
                {t('Machine learning and web products,', 'Makine öğrenmesi ve web ürünleri,')}{' '}
                <span className="bg-gradient-to-r from-[#635BFF] to-[#00A3FF] bg-clip-text text-transparent">
                  {t('built end to end.', 'uçtan uca geliştirildi.')}
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                {PROFILE_DATA.summary[lang]}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-[#635BFF] hover:bg-[#5249e6] text-white font-medium px-6 py-3 shadow-lg shadow-[#635BFF]/25 transition-colors"
                >
                  {t('View projects', 'Projeleri gör')} <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-[#0A2540] font-medium px-6 py-3 shadow-sm transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-[#0A2540] font-medium px-6 py-3 shadow-sm transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full text-slate-600 hover:text-[#635BFF] text-sm font-medium px-3 py-3 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? t('Copied!', 'Kopyalandı!') : PROFILE_DATA.email}
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
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
              className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-3xl object-cover shrink-0 shadow-2xl shadow-[#635BFF]/20 ring-4 ring-white"
            />
            </div>

            {/* Highlights */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROFILE_DATA.systemMetrics.map((m, i) => {
                const s = HIGHLIGHT_STYLES[i % HIGHLIGHT_STYLES.length];
                const Icon = s.icon;
                return (
                  <div key={m.code} className={`${card} p-6 border-t-4 ${s.border}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`mt-5 text-3xl font-semibold tracking-tight ${s.value}`}>{m.value}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-800">{m.label[lang]}</div>
                    <div className="mt-1 text-sm text-slate-500">{m.sub[lang]}</div>
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
              <article key={exp.id} className={`${card} p-6 sm:p-8 grid lg:grid-cols-12 gap-6`}>
                <div className="lg:col-span-4">
                  <div className="text-sm text-slate-500">{exp.period[lang]}</div>
                  <h3 className="mt-2 text-xl font-semibold text-[#0A2540]">{exp.role[lang]}</h3>
                  <div className="text-[#635BFF] font-medium">{exp.company}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={chip}>{exp.type[lang]}</span>
                    <span className={chip}>{exp.location[lang]}</span>
                  </div>
                  {exp.mentors && <p className="mt-3 text-sm text-slate-500">{exp.mentors[lang]}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                    {exp.liveUrl && (
                      <a href={exp.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#635BFF] hover:underline">
                        <Globe className="w-4 h-4" /> {t('Live site', 'Canlı site')}
                      </a>
                    )}
                    {exp.repoUrl && (
                      <a href={exp.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#635BFF] hover:underline">
                        <Github className="w-4 h-4" /> Repo
                      </a>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <ul className="space-y-3 text-[15px] leading-relaxed">
                    {exp.bullets[lang].map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#635BFF] shrink-0" />
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
        <section id="projects" className="bg-slate-50 border-y border-slate-200/70 scroll-mt-28 md:scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
            <SectionHeader
              eyebrow={t('Projects', 'Projeler')}
              title={t('Things I’ve built', 'Geliştirdiklerim')}
              desc={t(
                'Competition entries, products and tools, grouped by focus area.',
                'Yarışma projeleri, ürünler ve araçlar; odak alanına göre gruplandı.'
              )}
            />
            <div className="flex flex-wrap sm:inline-flex gap-1 rounded-2xl sm:rounded-full bg-white border border-slate-200 p-1 mb-8 shadow-sm">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === f.id ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:text-[#0A2540]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {projects.map((p) => (
                <article key={p.id} className={`${card} p-5 sm:p-7 flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all`}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    {p.badge ? (
                      <span className="rounded-full bg-[#635BFF]/10 text-[#635BFF] font-medium px-3 py-1 text-xs">
                        {p.badge[lang]}
                      </span>
                    ) : <span />}
                    <span className="text-slate-400 shrink-0">{p.period[lang]}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <h3 className="text-xl font-semibold text-[#0A2540]">{p.name}</h3>
                    <div className="flex gap-3 text-sm font-medium shrink-0">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#635BFF] hover:underline">
                          <Globe className="w-4 h-4" /> {t('Live', 'Canlı')}
                        </a>
                      )}
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#635BFF] hover:underline">
                          <Github className="w-4 h-4" /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{p.summary[lang]}</p>

                  {p.metrics && (
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4">
                      {p.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="text-xs text-slate-500">{m.label[lang]}</div>
                          <div className="mt-0.5 font-semibold text-[#0A2540]">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <ul className="mt-5 space-y-2.5 text-sm leading-relaxed">
                    {p.bullets[lang].map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {p.agentNote && (
                    <div className="mt-5 flex gap-2.5 rounded-xl bg-[#635BFF]/5 text-sm text-slate-700 p-3.5">
                      <Terminal className="w-4 h-4 text-[#635BFF] shrink-0 mt-0.5" />
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

            <h3 className="mt-16 mb-5 text-lg font-semibold text-[#0A2540]">
              {t('Smaller projects', 'Diğer küçük projeler')}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MINI_PROJECTS.map((m) => (
                <div key={m.name} className={`${card} p-5`}>
                  <div className="text-xs font-medium text-[#635BFF]">{m.tech}</div>
                  <div className="mt-1.5 font-semibold text-[#0A2540]">{m.name}</div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{m.desc[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI ENGINEERING (dark navy, Stripe-style) */}
        <section id="ai" className="bg-[#0A2540] text-slate-300 scroll-mt-28 md:scroll-mt-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#635BFF]/30 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24">
            <div className="max-w-2xl mb-12">
              <div className="text-sm font-semibold text-[#A29BFE] mb-3">{t('AI-assisted engineering', 'Yapay zeka destekli geliştirme')}</div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {t('Shipping with AI coding agents', 'AI kodlama ajanlarıyla yayına alma')}
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">{PROFILE_DATA.agenticStatement[lang]}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AI_STEPS.map((s, i) => (
                <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
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
              <div key={g.code} className={`${card} p-5 sm:p-7`}>
                <h3 className="font-semibold text-[#0A2540] mb-4">{g.title[lang]}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span key={s} className={chip}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AWARDS */}
        <section id="awards" className="bg-slate-50 border-y border-slate-200/70 scroll-mt-28 md:scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24">
            <SectionHeader
              eyebrow={t('Competitions', 'Yarışmalar')}
              title={t('Awards & events', 'Dereceler ve etkinlikler')}
            />
            <div className="grid md:grid-cols-2 gap-5">
              {COMPETITIONS.map((c, i) => (
                <div key={i} className={`${card} p-6 flex gap-4 ${c.highlight ? 'ring-1 ring-[#635BFF]/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.highlight ? 'bg-[#635BFF] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {c.highlight ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">{typeof c.date === 'string' ? c.date : c.date[lang]}</div>
                    <h3 className="mt-1 font-semibold text-[#0A2540] leading-snug">{c.title[lang]}</h3>
                    <p className="mt-1.5 text-sm text-slate-600">{c.result[lang]}</p>
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
            <div className={`${card} p-7`}>
              <div className="text-sm text-slate-500">{t('Education', 'Eğitim')}</div>
              <h3 className="mt-2 text-lg font-semibold text-[#0A2540]">{PROFILE_DATA.education.school[lang]}</h3>
              <p className="text-[#635BFF] font-medium text-sm">{PROFILE_DATA.education.degree[lang]}</p>
              <p className="mt-3 text-sm text-slate-500">{PROFILE_DATA.education.period[lang]}</p>
              <p className="mt-1 text-sm font-medium text-slate-800">GPA {PROFILE_DATA.education.gpa}</p>
            </div>
            <div className={`${card} p-7`}>
              <div className="text-sm text-slate-500">{t('Languages', 'Diller')}</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between"><span>{t('Turkish', 'Türkçe')}</span><span className="font-medium text-[#0A2540]">{t('Native', 'Ana dil')}</span></li>
                <li className="flex justify-between"><span>{t('English', 'İngilizce')}</span><span className="font-medium text-[#0A2540]">C1</span></li>
              </ul>
            </div>
            <div className={`${card} p-7`}>
              <div className="text-sm text-slate-500">{t('Community', 'Topluluk')}</div>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex justify-between gap-3"><span>CENGA</span><span className="font-medium text-[#0A2540] text-right">{t('Social Events Coordinator', 'Sosyal Etkinlikler Koordinatörü')}</span></li>
                <li className="flex justify-between gap-3"><span>TEMA</span><span className="font-medium text-[#0A2540] text-right">{t('Volunteer (5 yrs, passive)', 'Gönüllü (5 yıl, pasif)')}</span></li>
                <li className="flex justify-between gap-3"><span>Kaggle</span><a href={PROFILE_DATA.kaggle} target="_blank" rel="noreferrer" className="font-medium text-[#635BFF] hover:underline">@sleymankara</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-5 pb-24 scroll-mt-28 md:scroll-mt-16">
          <div className="max-w-6xl mx-auto rounded-3xl stripe-cta text-white px-5 sm:px-8 py-14 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t('Let’s work together', 'Birlikte çalışalım')}</h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
              {t(
                'Open to ML, full-stack and software engineering internships. Reach out any time.',
                'ML, full-stack ve yazılım mühendisliği stajlarına açığım. Dilediğiniz zaman ulaşın.'
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${PROFILE_DATA.email}`} className="inline-flex items-center gap-2 rounded-full bg-white text-[#0A2540] font-medium px-5 sm:px-6 py-3 text-[13px] sm:text-base hover:bg-slate-100 transition-colors">
                <Mail className="w-4 h-4" /> {PROFILE_DATA.email}
              </a>
              <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 hover:bg-white/20 font-medium px-6 py-3 transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href={PROFILE_DATA.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/25 hover:bg-white/20 font-medium px-6 py-3 transition-colors">
                <Github className="w-4 h-4" /> GitHub <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70">
        <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 {PROFILE_DATA.name}</span>
          <div className="flex gap-5">
            <a href={PROFILE_DATA.github} target="_blank" rel="noreferrer" className="hover:text-[#635BFF]">GitHub</a>
            <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#635BFF]">LinkedIn</a>
            <a href={PROFILE_DATA.kaggle} target="_blank" rel="noreferrer" className="hover:text-[#635BFF]">Kaggle</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

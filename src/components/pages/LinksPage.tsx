import Link from 'next/link';
import { ArrowRight, ArrowUpRight, FolderGit2, Github, Instagram, Linkedin, Mail, NotebookPen, Trophy, Youtube } from 'lucide-react';
import { PROFILE_DATA } from '@/data/portfolioData';
import { localePath, type Lang } from '@/lib/site';
import { card, lift } from '../styles';

type Item = { label: string; href: string; icon: typeof Github; internal?: boolean };

export default function LinksPage({ lang, hasBlog }: { lang: Lang; hasBlog: boolean }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const items: Item[] = [
    { label: t('Projects', 'Projeler'), href: localePath(lang, '/projects/'), icon: FolderGit2, internal: true },
    ...(hasBlog ? [{ label: 'Blog', href: localePath(lang, '/blog/'), icon: NotebookPen, internal: true }] : []),
    { label: 'YouTube', href: PROFILE_DATA.youtube, icon: Youtube },
    { label: 'Instagram', href: PROFILE_DATA.instagram, icon: Instagram },
    { label: 'LinkedIn', href: PROFILE_DATA.linkedin, icon: Linkedin },
    { label: 'GitHub', href: PROFILE_DATA.github, icon: Github },
    { label: 'Kaggle', href: PROFILE_DATA.kaggle, icon: Trophy },
    { label: PROFILE_DATA.email, href: `mailto:${PROFILE_DATA.email}`, icon: Mail },
  ];
  const row = `group ${card} ${lift} flex items-center gap-3 px-5 py-4 font-medium text-ink hover:border-line-strong`;

  return (
    <main className="max-w-md mx-auto px-5 pt-8 pb-16">
      <div className="flex flex-col items-center text-center">
        <Link href={localePath(lang, '/')} aria-label={t('Home', 'Ana sayfa')}>
          <img src="/profile.jpg" alt={PROFILE_DATA.name} width={96} height={96} className="w-24 h-24 rounded-full object-cover ring-4 ring-card shadow-xl shadow-[#635BFF]/20" />
        </Link>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          <Link href={localePath(lang, '/')} className="hover:text-accent transition-colors">
            {PROFILE_DATA.name}
          </Link>
        </h1>
        <p className="mt-2 text-sm text-muted">{PROFILE_DATA.title[lang]}</p>
      </div>
      <ul className="mt-8 space-y-3">
        {items.map(({ label, href, icon: Icon, internal }) => (
          <li key={href}>
            {internal ? (
              <Link href={href} className={row}>
                <Icon className="w-5 h-5 text-accent shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                <ArrowRight className="w-4 h-4 text-subtle transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className={row}>
                <Icon className="w-5 h-5 text-accent shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-subtle transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

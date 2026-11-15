import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/content';
import { KIND_LABEL, formatDate, localePath, otherLang, readingTimeLabel, type Lang } from '@/lib/site';
import YouTubeEmbed from '../YouTubeEmbed';
import LangLink from '../LangLink';
import { card, lift, nudgeLeft, nudgeRight } from '../styles';

type Neighbor = Pick<Post, 'slug' | 'title'> | null;

export default function PostPage({
  lang,
  post,
  html,
  older,
  newer,
  otherExists,
}: {
  lang: Lang;
  post: Post;
  html: string;
  older: Neighbor;
  newer: Neighbor;
  otherExists: boolean;
}) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const postHref = (slug: string) => localePath(lang, `/blog/${slug}/`);
  const other = otherLang(lang);

  return (
    <article className="max-w-3xl mx-auto px-5 pt-10 sm:pt-14 pb-16 sm:pb-24">
      <Link href={localePath(lang, '/blog/')} className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors">
        <ArrowLeft className={`w-4 h-4 ${nudgeLeft}`} /> {t('All posts', 'Tüm yazılar')}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
          <span className="rounded-full bg-accent/10 text-accent font-medium px-2.5 py-1 text-xs">{KIND_LABEL[post.kind][lang]}</span>
          <time dateTime={post.date} className="text-faint">
            {formatDate(lang, post.date)}
          </time>
          {post.kind === 'article' && <span className="text-faint">· {readingTimeLabel(lang, post.readingMinutes)}</span>}
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-ink">{post.title}</h1>
        <p className="mt-5 text-lg sm:text-xl leading-relaxed text-muted">{post.summary}</p>
        {otherExists && (
          <p className="mt-5 text-sm text-subtle">
            <LangLink lang={other} href={localePath(other, `/blog/${post.slug}/`)} className="font-medium text-accent hover:underline">
              {lang === 'en' ? 'Bu yazının Türkçesi de var.' : 'This post is also available in English.'}
            </LangLink>
          </p>
        )}
      </header>

      {post.youtube ? (
        <div className="mt-10">
          <YouTubeEmbed id={post.youtube} title={post.title} lang={lang} />
        </div>
      ) : (
        post.cover && (
          <figure className="mt-10 overflow-hidden rounded-2xl border border-line/80">
            <img src={post.cover} alt="" className="block w-full h-auto" />
          </figure>
        )
      )}

      <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: html }} />

      {post.tags.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-2" aria-label={t('Tags', 'Etiketler')}>
          {post.tags.map((tag) => (
            <li key={tag} className="inline-flex items-center rounded-full bg-chip text-muted text-xs font-medium px-2.5 py-1">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {(older || newer) && (
        <nav aria-label={t('More posts', 'Diğer yazılar')} className="mt-16 pt-8 border-t border-line/70 grid sm:grid-cols-2 gap-4">
          {older ? (
            <Link href={postHref(older.slug)} data-glow className={`group ${card} ${lift} p-5 block`}>
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <ArrowLeft className={`w-3.5 h-3.5 ${nudgeLeft}`} /> {t('Older post', 'Önceki yazı')}
              </span>
              <span className="mt-1.5 block font-semibold text-ink">{older.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {newer && (
            <Link href={postHref(newer.slug)} data-glow className={`group ${card} ${lift} p-5 block sm:text-right`}>
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                {t('Newer post', 'Sonraki yazı')} <ArrowRight className={`w-3.5 h-3.5 ${nudgeRight}`} />
              </span>
              <span className="mt-1.5 block font-semibold text-ink">{newer.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

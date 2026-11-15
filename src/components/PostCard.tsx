import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { rv } from '@/motion';
import type { StreamItem } from '@/lib/content';
import { KIND_LABEL, formatDate, localePath, readingTimeLabel, type Lang } from '@/lib/site';
import { card, lift } from './styles';

function CardLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

// Used from client components only (the reveal ref is a function).
export default function PostCard({
  item,
  lang,
  reveal = true,
  className = '',
  style,
}: {
  item: StreamItem;
  lang: Lang;
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const href = item.external ? item.href : localePath(lang, item.href);

  return (
    <article {...(reveal ? rv : {})} style={style} data-glow className={`${card} ${lift} p-5 sm:p-6 flex flex-col ${className}`}>
      {item.image && (
        <CardLink href={href} external={item.external} className="block -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl border-b border-line/80 bg-inset">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            width={480}
            height={270}
            className="block w-full aspect-video object-cover"
          />
        </CardLink>
      )}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
        <span className="rounded-full bg-accent/10 text-accent font-medium px-2.5 py-1">{KIND_LABEL[item.kind][lang]}</span>
        <span className="text-faint">{formatDate(lang, item.date)}</span>
        {item.readingMinutes && <span className="text-faint">· {readingTimeLabel(lang, item.readingMinutes)}</span>}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">
        <CardLink href={href} external={item.external} className="hover:text-accent transition-colors">
          {item.title}
          {item.external && (
            <>
              {' '}
              <ArrowUpRight className="inline w-4 h-4 align-[-2px] text-subtle" aria-label={lang === 'en' ? '(opens YouTube)' : '(YouTube’da açılır)'} />
            </>
          )}
        </CardLink>
      </h3>
      {item.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>}
    </article>
  );
}

'use client';

import type { ReactNode } from 'react';
import { LANG_KEY, type Lang } from '@/lib/site';

/** A link into the other language that records the choice, so the redirect script does not send the reader back. */
export default function LangLink({ lang, href, className, children }: { lang: Lang; href: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      lang={lang}
      className={className}
      onClick={() => {
        try {
          localStorage.setItem(LANG_KEY, lang);
        } catch {
          /* storage unavailable */
        }
      }}
    >
      {children}
    </a>
  );
}

import type { ReactNode } from 'react';
import RootDocument from './RootDocument';
import Shell from './Shell';
import { hasBlog, localizedRoutes } from '@/lib/routes';
import { otherLang, type Lang } from '@/lib/site';

/** Root layout for one language (each language is its own root layout, so <html lang> is right). */
export default function LangLayout({ lang, children }: { lang: Lang; children: ReactNode }) {
  const otherPaths = localizedRoutes(otherLang(lang));
  return (
    <RootDocument lang={lang} otherPaths={otherPaths}>
      <Shell lang={lang} hasBlog={hasBlog(lang)} otherPaths={otherPaths}>
        {children}
      </Shell>
    </RootDocument>
  );
}

import type { ReactNode } from 'react';
import LangLayout from '@/components/LangLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <LangLayout lang="tr">{children}</LangLayout>;
}

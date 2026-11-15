'use client';

import { rv } from '@/motion';

export function SectionHeader({
  eyebrow,
  title,
  desc,
  as: Heading = 'h2',
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div {...rv} className="max-w-2xl mb-12">
      <div className="text-sm font-semibold text-accent mb-3">{eyebrow}</div>
      <Heading className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{title}</Heading>
      {desc && <p className="mt-4 text-lg text-muted leading-relaxed">{desc}</p>}
    </div>
  );
}

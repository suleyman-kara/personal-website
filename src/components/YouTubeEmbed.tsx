'use client';

import { useState } from 'react';
import type { Lang } from '@/lib/site';

/** Thumbnail first; the privacy-enhanced player loads only after a click. */
export default function YouTubeEmbed({ id, title, lang }: { id: string; title: string; lang: Lang }) {
  const [playing, setPlaying] = useState(false);
  const label = lang === 'en' ? `Play video: ${title}` : `Videoyu oynat: ${title}`;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line/80 bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={label} className="group absolute inset-0 w-full h-full">
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-11 rounded-xl bg-[#635BFF] text-white shadow-lg transition-transform duration-200 ease-out-expo group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

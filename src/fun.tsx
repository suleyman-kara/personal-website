import { useEffect, useRef, useState } from 'react';
import type { Lang } from './data/portfolioData';

// Small hidden jokes. Nothing here shows unless someone goes poking.

const PHOTO_LINES: { en: string; tr: string }[] = [
  { en: "Yes, that's me.", tr: 'Evet, benim.' },
  { en: 'Still here?', tr: 'Hâlâ buradasın?' },
  { en: "The photo isn't going to change.", tr: 'Fotoğraf değişmiyor kanka.' },
  { en: 'There are projects below, by the way.', tr: 'Aşağıda projeler var bu arada.' },
  { en: "That's five. Maybe just hire me?", tr: '5 oldu. İşe alsan mı artık?' },
  { en: 'That tickles.', tr: 'Gıdıklanıyorum.' },
  { en: "You'd be halfway through the projects by now.", tr: 'Bu enerjiyle projelerin yarısı okunurdu.' },
  { en: 'Okay, now it is getting personal.', tr: 'Tamam, artık kişisel algılıyorum.' },
  { en: 'Last warning.', tr: 'Son uyarı.' },
  { en: 'Fine, I give up. Email me.', tr: 'Tamam, pes ediyorum. Mail at.' },
];
const BUBBLE_MS = 2600;

/** Shows a line for a moment; a new line restarts the timer. */
function useBubble() {
  const [bubble, setBubble] = useState<{ text: string; id: number } | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const say = (text: string) => {
    window.clearTimeout(timer.current);
    setBubble((b) => ({ text, id: (b?.id ?? 0) + 1 }));
    timer.current = window.setTimeout(() => setBubble(null), BUBBLE_MS);
  };
  return { bubble, say };
}

const bubbleBase =
  'egg-bubble pointer-events-none absolute z-10 rounded-xl bg-ink text-on-ink text-sm font-medium leading-snug px-3 py-2 shadow-lg';

/** The hero photo. Click it a few times. */
export function HeroPhoto({
  src,
  alt,
  lang,
  className,
  style,
}: {
  src: string;
  alt: string;
  lang: Lang;
  className: string;
  style?: React.CSSProperties;
}) {
  const [clicks, setClicks] = useState(0);
  const [move, setMove] = useState<{ kind: 'wobble' | 'spin'; id: number } | null>(null);
  const { bubble, say } = useBubble();
  const scrollTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  const onClick = () => {
    const n = clicks % PHOTO_LINES.length;
    const last = n === PHOTO_LINES.length - 1;
    setClicks(clicks + 1);
    setMove((m) => ({ kind: last ? 'spin' : 'wobble', id: (m?.id ?? 0) + 1 }));
    say(PHOTO_LINES[n][lang]);
    if (last) {
      scrollTimer.current = window.setTimeout(
        () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
        1500,
      );
    }
  };

  return (
    <div className={`relative shrink-0 ${className}`} style={style}>
      <div data-tilt>
        <button
          type="button"
          onClick={onClick}
          aria-label={alt}
          className="block rounded-3xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#635BFF]"
        >
          <img
            key={move?.id ?? 0}
            src={src}
            alt=""
            draggable={false}
            className={`w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-3xl object-cover shadow-2xl shadow-[#635BFF]/20 ring-4 ring-card select-none ${
              move ? `egg-${move.kind}` : ''
            }`}
          />
        </button>
      </div>
      {/* Beside the photo on small screens, above it on large ones. */}
      <div aria-live="polite">
        {bubble && (
          <div
            key={bubble.id}
            className={`${bubbleBase} left-full top-5 ml-3 w-max max-w-[min(11rem,calc(100vw-13.5rem))] sm:max-w-[14rem] lg:left-1/2 lg:top-auto lg:bottom-full lg:ml-0 lg:mb-4 lg:-translate-x-1/2 lg:max-w-[16rem] lg:text-center lg:[--egg-from:translate(-50%,4px)]`}
          >
            {bubble.text}
          </div>
        )}
      </div>
    </div>
  );
}

const INDECISION_COUNT = 6;
const INDECISION_WINDOW_MS = 5000;

/** Call `note()` on every theme toggle; flip it back and forth enough and it says something. */
export function useIndecision(lang: Lang) {
  const times = useRef<number[]>([]);
  const { bubble, say } = useBubble();
  const note = () => {
    const now = Date.now();
    times.current = [...times.current.filter((t) => now - t < INDECISION_WINDOW_MS), now];
    if (times.current.length >= INDECISION_COUNT) {
      times.current = [];
      say(lang === 'tr' ? 'Karar ver kanka.' : 'Pick one already.');
    }
  };
  const nudge = (
    <span aria-live="polite">
      {bubble && (
        <span key={bubble.id} className={`${bubbleBase} right-0 top-full mt-2 w-max`}>
          {bubble.text}
        </span>
      )}
    </span>
  );
  return { note, nudge };
}

/** A hello for whoever opens DevTools. */
export function consoleHello() {
  const big = 'font: 600 15px Inter, system-ui, sans-serif; color: #635BFF;';
  const small = 'font: 13px Inter, system-ui, sans-serif; color: inherit;';
  console.log(
    '%cSelam / Hi.%c\nKodu merak ettiysen / If you came for the code:\nhttps://github.com/suleyman-kara/personal-website',
    big,
    small,
  );
}

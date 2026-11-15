import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */
// Elements pass through data-reveal="pending" -> "in" -> "done".
// Pages are prerendered, so revealed elements carry data-reveal="pending" in the
// HTML (spread `rv`). The hidden style only applies while <html> has .reveal-ready,
// which the inline head script adds before paint (never without
// IntersectionObserver or with reduced motion) and removes again if this module
// never reports in. "done" drops every reveal rule so the element's own
// transitions (e.g. hover lift) take over again with no delay.

const STAGGER = 70;
const MAX_DELAY = 280;
const DURATION = 560;

let observer: IntersectionObserver | null = null;
let observerAlive = false;

function show(el: HTMLElement, delay: number) {
  el.style.setProperty('--reveal-delay', `${delay}ms`);
  el.dataset.reveal = 'in';
  window.setTimeout(() => {
    el.dataset.reveal = 'done';
    el.style.removeProperty('--reveal-delay');
  }, delay + DURATION + 50);
}

function getObserver() {
  if (observer) return observer;
  const io = new IntersectionObserver(
    (entries) => {
      observerAlive = true;
      (window as unknown as { __revealAlive?: boolean }).__revealAlive = true;
      const entering: IntersectionObserverEntry[] = [];
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        // The huge top margin makes anything scrolled past count as intersecting,
        // so jumping over content (hash links, fast scroll) never leaves it hidden.
        if (entry.boundingClientRect.bottom <= 0) el.dataset.reveal = 'done';
        else entering.push(entry);
      }
      entering
        .sort(
          (a, b) =>
            Math.round(a.boundingClientRect.top / 8) - Math.round(b.boundingClientRect.top / 8) ||
            a.boundingClientRect.left - b.boundingClientRect.left
        )
        .forEach((entry, i) => show(entry.target as HTMLElement, Math.min(i * STAGGER, MAX_DELAY)));
    },
    { rootMargin: '99999px 0px -48px 0px' }
  );
  // Failsafe: if the observer never reports, show everything.
  window.setTimeout(() => {
    if (!observerAlive) document.documentElement.classList.remove('reveal-ready');
  }, 2500);
  observer = io;
  return io;
}

/** Ref callback: fade/rise the element in once when it enters the viewport. */
export function reveal(el: HTMLElement | null) {
  if (!el || el.dataset.reveal === 'in' || el.dataset.reveal === 'done') return;
  if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
    el.dataset.reveal = 'done';
    return;
  }
  document.documentElement.classList.add('reveal-ready');
  el.dataset.reveal = 'pending';
  const io = getObserver();
  io.observe(el);
  return () => io.unobserve(el);
}

/** Spread on an element to reveal it on scroll: `<div {...rv}>`. */
export const rv = { ref: reveal, 'data-reveal': 'pending' } as const;

/* ------------------------------------------------------------------ */
/* Sliding pill for segmented controls                                 */
/* ------------------------------------------------------------------ */
// Positions an absolutely placed pill under the button with aria-pressed="true".
// Animates only when the active option changes; resize / label changes jump.

export function useSlidingPill<T extends HTMLElement>(active: string) {
  const containerRef = useRef<T>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const prevActive = useRef<string | null>(null);

  const place = useCallback((animate: boolean) => {
    const container = containerRef.current;
    const pill = pillRef.current;
    const btn = container?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!pill || !btn) return;
    pill.style.transition = animate && !prefersReducedMotion() ? '' : 'none';
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.height = `${btn.offsetHeight}px`;
    pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
    pill.style.opacity = '1';
  }, []);

  useLayoutEffect(() => {
    place(prevActive.current !== null && prevActive.current !== active);
    prevActive.current = active;
  }, [active, place]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(container);
    container.querySelectorAll('button').forEach((b) => ro.observe(b));
    return () => ro.disconnect();
  }, [place]);

  return { containerRef, pillRef };
}

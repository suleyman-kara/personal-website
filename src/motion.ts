import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */
// Elements pass through data-reveal="pending" -> "in" -> "done".
// The hidden "pending" style only applies while <html> has .reveal-ready,
// which is added here (never without JS, IntersectionObserver or with
// reduced motion). "done" drops every reveal rule so the element's own
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
  if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;
  document.documentElement.classList.add('reveal-ready');
  el.dataset.reveal = 'pending';
  const io = getObserver();
  io.observe(el);
  return () => io.unobserve(el);
}

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

/* ------------------------------------------------------------------ */
/* Nav scroll-spy                                                      */
/* ------------------------------------------------------------------ */

export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const locked = useRef(false);
  const unlockTimer = useRef(0);

  // While a nav click's smooth scroll runs, keep the clicked link active;
  // release once scrolling has been idle briefly.
  const holdUnlock = () => {
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => (locked.current = false), 150);
  };

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const header = document.querySelector('header');
      const top = header ? header.getBoundingClientRect().height : 0;
      const line = top + (window.innerHeight - top) * 0.3;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (locked.current) return holdUnlock();
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(unlockTimer.current);
    };
  }, [ids]);

  const select = (id: string) => {
    locked.current = true;
    setActive(id);
    holdUnlock();
  };

  return { active, select };
}

/** Keep the [data-spy=active] link horizontally visible inside a scroller (no vertical page scroll). */
export function useKeepActiveInView(scrollerRef: RefObject<HTMLElement | null>, active: string | null) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) return;
    const link = scroller.querySelector<HTMLElement>(`[data-spy="${active}"]`);
    if (!link) return;
    const s = scroller.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    scroller.scrollBy({
      left: l.left - s.left - (s.width - l.width) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [scrollerRef, active]);
}

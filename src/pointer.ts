import { useEffect } from 'react';

// Pointer-reactive touches. Mouse/trackpad only, and off under reduced motion:
//  [data-hero-light]  soft light that trails the pointer inside the hero
//  [data-glow]        card border lights up on the side nearest the pointer
//  [data-tilt]        element leans a few degrees toward the pointer
// Everything is written as CSS variables; the look lives in src/fun.css.

const GLOW_RANGE = 140; // px outside a card at which its border starts to light
const TILT_MAX = 5; // degrees
const TILT_RANGE = 520; // px from the element's center where the lean reaches its max

export function usePointerFx() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;

    const root = document.documentElement;
    root.classList.add('pointer-fx');

    let x = -1;
    let y = -1;
    let frame = 0;
    // Smoothed values for the trailing light and the tilt.
    let lx = 0;
    let ly = 0;
    let rx = 0;
    let ry = 0;
    let lightStarted = false;

    const tick = () => {
      frame = 0;
      let settling = false;

      const hero = document.querySelector<HTMLElement>('[data-hero-light]');
      if (hero) {
        const r = hero.getBoundingClientRect();
        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        if (inside) {
          const tx = x - r.left;
          const ty = y - r.top;
          if (!lightStarted) {
            lx = tx;
            ly = ty;
            lightStarted = true;
          }
          lx += (tx - lx) * 0.12;
          ly += (ty - ly) * 0.12;
          if (Math.abs(tx - lx) + Math.abs(ty - ly) > 0.5) settling = true;
          hero.style.setProperty('--lx', `${lx.toFixed(1)}px`);
          hero.style.setProperty('--ly', `${ly.toFixed(1)}px`);
        }
        hero.style.setProperty('--lo', inside ? '1' : '0');
      }

      const tilt = document.querySelector<HTMLElement>('[data-tilt]');
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const onScreen = r.bottom > 0 && r.top < window.innerHeight;
        const dx = x - (r.left + r.width / 2);
        const dy = y - (r.top + r.height / 2);
        const clamp = (v: number) => Math.max(-1, Math.min(1, v / TILT_RANGE));
        const tx = onScreen && x >= 0 ? -clamp(dy) * TILT_MAX : 0;
        const ty = onScreen && x >= 0 ? clamp(dx) * TILT_MAX : 0;
        rx += (tx - rx) * 0.1;
        ry += (ty - ry) * 0.1;
        if (Math.abs(tx - rx) + Math.abs(ty - ry) > 0.02) settling = true;
        tilt.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        tilt.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      }

      document.querySelectorAll<HTMLElement>('[data-glow]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const near =
          x >= r.left - GLOW_RANGE &&
          x <= r.right + GLOW_RANGE &&
          y >= r.top - GLOW_RANGE &&
          y <= r.bottom + GLOW_RANGE;
        if (near) {
          el.style.setProperty('--gx', `${(x - r.left).toFixed(0)}px`);
          el.style.setProperty('--gy', `${(y - r.top).toFixed(0)}px`);
          el.style.setProperty('--go', '1');
        } else if (el.style.getPropertyValue('--go') === '1') {
          el.style.setProperty('--go', '0');
        }
      });

      if (settling) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      x = e.clientX;
      y = e.clientY;
      schedule();
    };
    const onLeave = () => {
      x = -1;
      y = -1;
      schedule();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
      root.classList.remove('pointer-fx');
    };
  }, []);
}

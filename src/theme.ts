import { useEffect, useState } from 'react';

// The first paint is themed by the inline script in src/components/RootDocument.tsx (same key and colors).
export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';
const META_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#061527' };
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null; // storage unavailable
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Flip everything in one frame: existing color transitions would otherwise fade parts of the page.
  root.classList.add('theme-switching');
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
  void window.getComputedStyle(root).color; // commit styles while transitions are off
  window.setTimeout(() => root.classList.remove('theme-switching'), 0);
}

/** Current theme plus a toggle. An explicit choice is stored; until then the OS setting is followed live. */
export function useTheme() {
  // Prerendered as light; the real value is read from <html> (set before paint) on mount.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    const mq = darkQuery();
    const onChange = () => {
      if (storedTheme()) return;
      const next: Theme = mq.matches ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const current: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    applyTheme(next);
    setTheme(next);
  };

  return { theme, toggle };
}

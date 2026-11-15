/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Semantic theme colors. Values live in src/index.css as RGB channels
      // (:root = light, .dark = dark) so opacity modifiers like border-line/70 work.
      colors: Object.fromEntries(
        ['page', 'band', 'card', 'chip', 'inset', 'pill', 'line', 'line-strong', 'ink', 'on-ink', 'strong', 'body', 'muted', 'subtle', 'faint', 'accent', 'feature'].map(
          (name) => [name, `rgb(var(--c-${name}) / <alpha-value>)`]
        )
      ),
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}

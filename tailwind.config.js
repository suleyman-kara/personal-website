/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cf: {
          orange: '#F6821F',
          amber: '#FBAD41',
          dark: '#0A0A0B',
          card: '#111215',
          border: '#22242A',
          lightBg: '#F9FAFB',
          lightCard: '#FFFFFF',
          lightBorder: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}

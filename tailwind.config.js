/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // --- ACCENT (Custom Cyan/Teal Theme) ---
        primary: '#028FA2',
        'primary-container': '#15AEC3',
        secondary: '#03B1C9',
        'primary-fixed': '#013D45',

        // --- LIGHT SURFACES ---
        surface: '#F7F9FB',
        'surface-low': '#F2F4F6',
        'surface-lowest': '#FFFFFF',
        'surface-highest': '#EAEAF2',
        'surface-variant': '#E0E0ED',

        // --- LIGHT TEXT ---
        'outline-variant': '#C7C4D7',
        'on-surface': '#1C1C28',
        'on-surface-variant': '#4A4A68',

        // --- DARK MODE (Deep black) ---
        'dark-surface': '#050505',
        'dark-surface-low': '#0a0a0a',
        'dark-surface-lowest': '#0f0f0f',
        'dark-surface-highest': '#171717',
        'dark-outline-variant': '#262626',
        'dark-on-surface': '#FAFAFA',
        'dark-on-surface-variant': '#A1A1AA',
      },
      boxShadow: {
        'ambient': '0px 12px 32px rgba(2, 143, 162, 0.06)',
        'ambient-dark': '0px 12px 32px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(2, 143, 162, 0.15)',
        'glow-strong': '0 0 40px rgba(2, 143, 162, 0.25)',
      },
    },
  },
  plugins: [],
}

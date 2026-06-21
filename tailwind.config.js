/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        // Dark theme
        dark: {
          bg: '#0A0A0A',
          fg: '#EDEDED',
          accent: '#D1FF4C',
        },
        // Light purple theme
        purple: {
          deep: '#78578C',
          muted: '#89689D',
          rose: '#C286A0',
          mauve: '#CFA3BA',
          pink: '#DEA8C8',
          bg: '#FAF7FA',
        },
      },
      letterSpacing: {
        tightest: '-0.06em',
      },
      lineHeight: {
        tightest: '0.85',
        tight2: '0.9',
      },
    },
  },
  plugins: [],
};

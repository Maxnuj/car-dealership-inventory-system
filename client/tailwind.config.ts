import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: { card: '0 8px 30px rgb(15 23 42 / 0.08)' },
    },
  },
  plugins: [],
} satisfies Config;

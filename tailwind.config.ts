import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ea4c89',
        background: '#faf8f5',
        foreground: '#1a1a1a',
        surface: '#ffffff',
        muted: '#6b7280',
        border: '#e7e5e4',
      },
    },
  },
  plugins: [],
};

export default config;

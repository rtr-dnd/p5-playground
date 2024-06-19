import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: [
          'var(--font-archivo)',
          'var(--font-noto-sans-jp)',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
export default config;

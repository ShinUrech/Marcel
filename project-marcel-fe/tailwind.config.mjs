/* eslint-disable import/no-anonymous-default-export */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // For Next.js App Router
    './pages/**/*.{js,ts,jsx,tsx}', // If you're still using Pages Router
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#134074',
      },
    },
  },
  plugins: [import('@tailwindcss/line-clamp').then((mod) => mod.default)],
};

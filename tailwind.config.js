/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#eefbfb',
        secondary: '#60a0a1',
        faint: '#589a93',
        warning: '#E30B5C'
      },
    },
  },
  plugins: [],
}

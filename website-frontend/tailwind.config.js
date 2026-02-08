/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f8ed',
          100: '#e1efd6',
          200: '#c5dfb1',
          300: '#a1ca83',
          400: '#7caf5b',
          500: '#5c8d37',
          600: '#48712a',
          700: '#385823',
          800: '#2f471f',
          900: '#293d1d',
          950: '#14210d',
        },
      },
    },
  },
  plugins: [],
}

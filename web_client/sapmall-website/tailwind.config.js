/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f6f3',
        brand: {
          50: '#ecfeff',
          100: '#e1f3fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#61dafb',
          500: '#149eca',
          600: '#0e7ea3',
          700: '#0c6a8a',
          800: '#0a5570',
          900: '#084058',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

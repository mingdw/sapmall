/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'help-vote-bubble': {
          '0%': { opacity: '0', transform: 'translateX(-50%) translateY(6px) scale(0.8)' },
          '25%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(-50%) translateY(-10px) scale(0.92)' },
        },
        'dao-announcement-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'help-vote-bubble': 'help-vote-bubble 0.55s ease forwards',
        'dao-announcement-scroll': 'dao-announcement-scroll 36s linear infinite',
      },
      colors: {
        'sapphire': {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      }
    },
  },
  plugins: [],
}

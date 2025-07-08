/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./design/prototypes/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        dark: '#1F2937',
        light: '#F9FAFB'
      }
    }
  },
  plugins: [],
} 
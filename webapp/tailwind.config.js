/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: '#E0BE36',
        },
        green: {
          DEFAULT: '#1E852C',
        },
      },
    },
  },
  plugins: [],
} 
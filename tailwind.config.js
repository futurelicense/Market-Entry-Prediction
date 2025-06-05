/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        'slate-750': '#1e293b',  // Custom color used in hover states
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', 'sans-serif'],
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
      },
      gridTemplateRows: {
        layout: '1fr',
      },
    },
  },
}

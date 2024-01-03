/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        layout: '1fr',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['retro'],
  },
}

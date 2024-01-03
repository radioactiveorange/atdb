import preact from '@preact/preset-vite'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  plugins: [preact()],
  base: '/atdb/',
})

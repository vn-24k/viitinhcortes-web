import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    // Isso desativa o lightningcss que está implicando com o @tailwind
    transformer: 'postcss',
  },
  build: {
    minify: 'esbuild',
  }
})

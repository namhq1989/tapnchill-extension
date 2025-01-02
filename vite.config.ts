import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'scripts/background.js'),
        offscreen: path.resolve(__dirname, 'scripts/offscreen.js'),
        highlight: path.resolve(__dirname, 'scripts/highlight.js'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
        dir: 'dist',
      },
    },
  },
  optimizeDeps: {
    include: ['howler'],
  },
  server: {
    port: 3050,
  },
})

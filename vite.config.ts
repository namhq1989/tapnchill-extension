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
        playAmbience: path.resolve(__dirname, 'scripts/play-ambiences.js'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
        dir: 'dist',
      },
    },
  },
  server: {
    port: 3050,
  },
})

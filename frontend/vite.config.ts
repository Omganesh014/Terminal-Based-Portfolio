import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD
export default defineConfig({
  plugins: [
    react(),
=======
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'OM — Terminal-Based Portfolio',
        short_name: 'OM',
        description: 'Interactive terminal-based developer portfolio by OmGanesh.',
        theme_color: '#07090d',
        background_color: '#07090d',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
>>>>>>> 8fac277 (feat: local portfolio search with Fuse.js + switch to Groq API)
  ],
  base: process.env.VITE_BASE_PATH || '/Terminal-Based-Portfolio/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
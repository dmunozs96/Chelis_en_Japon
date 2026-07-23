import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'JapanPics/*.jpg', 'pois/*.jpg', 'pois/*.json'],
      manifest: {
        name: 'Chelis en Japón',
        short_name: 'Chelis Japón',
        description: 'Guía interactiva del viaje a Japón — agosto 2026',
        lang: 'es',
        start_url: '/',
        display: 'standalone',
        background_color: '#060610',
        theme_color: '#060610',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,jpg,json}'],
        globIgnores: ['visual-library/**/*', 'poi-galleries/**/*'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/visual-library/') || url.pathname.startsWith('/poi-galleries/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'grand-tour-visuals',
              expiration: { maxEntries: 90, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/data/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'trip-data',
              expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.png'],
  server: {
    port: 5173,
    proxy: {
      // Forward /api and /data requests to the Express server during development.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/data': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

// Vite build: React, Tailwind and the install-only PWA, the `@/` alias, vendor chunks and no source maps.
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const THEME_COLOR = '#1b2030';
const MAX_PRECACHE_BYTES = 4 * 1024 * 1024;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      devOptions: { enabled: false },
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon-180.png'],
      manifest: {
        id: '/',
        name: 'FireflyBC',
        short_name: 'FireflyBC',
        description: 'Fly a 3D drone over British Columbia and see where active wildfires are.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: THEME_COLOR,
        theme_color: THEME_COLOR,
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,glb,woff2}'],
        maximumFileSizeToCacheInBytes: MAX_PRECACHE_BYTES,
        runtimeCaching: [],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'mapbox-gl', test: /node_modules[\\/]mapbox-gl/ },
            { name: 'three', test: /node_modules[\\/]three/ },
          ],
        },
      },
    },
  },
});

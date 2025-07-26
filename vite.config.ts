import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'images/Logo_consulta_unificada.png',
        'images/Logo_consulta_unificada2.png',
        'images/Marca.webp'
      ],
      manifest: {
        name: 'Portal de Serviços SMFAZ',
        short_name: 'Portal Serviços',
        description: 'Portal de Serviços da Secretaria Municipal da Fazenda de Arapiraca',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
        orientation: 'portrait',
        icons: [
          {
            src: '/images/Logo_consulta_unificada.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/Logo_consulta_unificada2.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/images/Marca.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
            }
          },
          // ...existing code...
        ],
        navigateFallback: '/offline.html'
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: true,
    allowedHosts: [
      '961b160b-34b3-433d-a5db-bbade269e4ee-00-gipi472sgmd4.riker.replit.dev'
    ],
    open: true,
    proxy: {
      '/api-documento': {
        target: 'https://homologacao.abaco.com.br',
        changeOrigin: true,
        rewrite: (_path) => '/arapiraca_proj_hml_eagata/servlet/apapidocumento',
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('documento proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Documento Request to the Target:', req.method, req.url);
            if (req.headers['dadosapidocumento']) {
              proxyReq.setHeader('DadosAPIDocumento', req.headers['dadosapidocumento']);
            }
            if (req.headers['DadosAPIDocumento']) {
              proxyReq.setHeader('DadosAPIDocumento', req.headers['DadosAPIDocumento']);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Documento Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/api': {
        target: 'https://homologacao.abaco.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/arapiraca_proj_hml_eagata/servlet'),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});

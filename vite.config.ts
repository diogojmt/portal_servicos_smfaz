import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: true,
    allowedHosts: [
      '961b160b-34b3-433d-a5db-bbade269e4ee-00-gipi472sgmd4.riker.replit.dev'
    ],
    open: true,
    proxy: {
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
        },
      },
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
            // Adicionar os headers necessários para a API de documentos
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
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
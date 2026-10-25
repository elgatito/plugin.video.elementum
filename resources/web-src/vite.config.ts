import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import translations from './translations';

export default defineConfig({
  base: '/web/',
  plugins: [react(), translations()],
  // semantic-ui-css has a few invalid selectors, skip them instead of failing the build
  css: { lightningcss: { errorRecovery: true } },
  build: {
    outDir: '../web',
    emptyOutDir: true,
    // Daemon serves only /web/index.html, /web/favicon.ico and /web/static/*
    assetsDir: 'static',
  },
  server: {
    // Everything outside of /web/ is the daemon API
    proxy: {
      '^/(?!web(/|$))': 'http://127.0.0.1:65220',
    },
  },
});

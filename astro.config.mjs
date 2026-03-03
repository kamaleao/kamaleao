import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  output: 'static',
  integrations: [
    react(), 
    markdoc()
  ],
  base: '/',
  // Configuração reforçada para o Netlify Studio
  vite: {
    server: {
      allowedHosts: [
        'devserver-preview--kamaleao.netlify.app',
        '.netlify.app' // Isso libera qualquer subdomínio do Netlify
      ]
    }
  },
  // Algumas versões do Astro/Netlify pedem isso aqui também:
  server: {
    host: true,
    allowedHosts: true
  }
});

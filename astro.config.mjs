import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  // Garante que o site seja gerado como arquivos estáticos (HTML puro)
  output: 'static',
  
  // As integrações essenciais para o seu conteúdo
  integrations: [
    react(), 
    markdoc()
  ],

  // Se o seu site estiver em uma subpasta no futuro, ajustar o 'base'
  // Mas por enquanto, deixamos o padrão da raiz
  base: '/',
});
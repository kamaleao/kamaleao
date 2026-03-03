import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  // Removemos o keystatic() daqui
  integrations: [react(), markdoc()],
});

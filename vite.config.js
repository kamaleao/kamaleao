import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou seu plugin (vue, etc)

export default defineConfig({
  plugins: [react()], // mantenha seus plugins se já existirem
  server: {
    allowedHosts: [
      'devserver-preview--kamaleao.netlify.app'
    ]
  }
})

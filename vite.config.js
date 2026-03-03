import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Libera todos os hosts para o Vite 6+
    allowedHosts: true,
    // Libera todos os hosts para o Vite 5 e anteriores
    disableHostCheck: true,
    // Garante que o servidor aceite conexões externas
    host: true,
    // Configurações extras de rede para evitar engasgos
    hmr: {
      overlay: false
    }
  },
  // Garante que o preview do Netlify não seja bloqueado por headers de segurança
  preview: {
    allowedHosts: true
  }
})

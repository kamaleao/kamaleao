import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    // Para versões que não aceitam allowedHosts:
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }
})

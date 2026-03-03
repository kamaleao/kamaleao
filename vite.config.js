import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true // Isso aqui é o que vai sumir com aquele erro da imagem
  }
})

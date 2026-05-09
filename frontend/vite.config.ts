import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Esto ayuda a que los imports sean más limpios y evita errores de rutas
      '@': path.resolve(__dirname, './src'),
    },
  },
})
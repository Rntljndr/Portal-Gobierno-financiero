import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Formato alternativo del Paso 7: build normal (multi-archivo), sin vite-plugin-singlefile,
// para comprimir en un .zip cuando el .html autocontenido no sea aceptado por la plataforma.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'export-zip',
    emptyOutDir: true,
  },
})

/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pagina = (caminho: string) => fileURLToPath(new URL(caminho, import.meta.url))

export default defineConfig({
  // O Cloudflare Pages serve o site na raiz do endereço (ADR-0006), então o `base` é o padrão, "/".
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        principal: pagina('./index.html'),
        admin: pagina('./admin/index.html'),
        previa: pagina('./previa/index.html'),
        prancha: pagina('./previa/prancha.html'),
      },
    },
  },
})

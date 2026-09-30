/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const pagina = (caminho: string) => fileURLToPath(new URL(caminho, import.meta.url))

export default defineConfig({
  // O Pages serve o site em /albummania/ (o nome do repositório); sem isso, CSS e JS dão 404 em produção.
  base: '/albummania/',
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        principal: pagina('./index.html'),
        previa: pagina('./previa/index.html'),
        prancha: pagina('./previa/prancha.html'),
      },
    },
  },
})

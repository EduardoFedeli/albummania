/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // O Pages serve o site em /catalogo-figurinhas/; sem isso, CSS e JS dão 404 em produção.
  base: '/catalogo-figurinhas/',
  plugins: [react()],
})

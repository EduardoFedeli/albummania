/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // O site fica em eduardofedeli.github.io/catalogo-figurinhas/, e não na raiz
  // do domínio. Sem isso, o CSS e o JS dão 404 em produção.
  base: '/catalogo-figurinhas/',
  plugins: [react()],
})

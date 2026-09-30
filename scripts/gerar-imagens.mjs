// Gera a prancha do design system e a imagem da prévia do link a partir do build: npm run imagens
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'
import { preview } from 'vite'

const PORTA = 4173

async function capturar(navegador, { url, largura, altura, escala, destino }) {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: altura }, deviceScaleFactor: escala })
  await pagina.goto(url, { waitUntil: 'networkidle' })
  await pagina.evaluate(() => document.fonts.ready)
  await pagina.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0))
  await pagina.screenshot({ path: destino })
  await pagina.close()
  console.log(`✓ ${destino}`)
}

mkdirSync('public/previa', { recursive: true })
const servidor = await preview({ preview: { port: PORTA, strictPort: true, open: false } })
// O caminho vem do `base` do vite.config.ts: renomear o repositório não quebra o script.
const PRANCHA = `http://localhost:${PORTA}${servidor.config.base}previa/prancha.html`
// No Windows, o Edge já instalado basta; em outros ambientes, defina PLAYWRIGHT_CHANNEL (ex.: chromium).
const navegador = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'msedge' })

try {
  await capturar(navegador, { url: PRANCHA, largura: 1920, altura: 1080, escala: 2, destino: 'docs/design/prancha.png' })
  await capturar(navegador, {
    url: `${PRANCHA}?formato=og`,
    largura: 1200,
    altura: 630,
    escala: 1,
    destino: 'public/previa/og.png',
  })
} finally {
  await navegador.close()
  await servidor.close()
}

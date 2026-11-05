// Compressão da Foto no navegador, antes do envio (ADR-0005): o Storage gratuito tem 1 GB.

const LADO_MAXIMO = 1000
const LIMITE_EM_BYTES = 900 * 1024

/** Reduz para o lado maior caber em `maximo`, mantendo a proporção. Foto pequena fica como está. */
export function dimensoesReduzidas(
  largura: number,
  altura: number,
  maximo: number,
): { largura: number; altura: number } {
  const escala = Math.min(1, maximo / Math.max(largura, altura))
  return {
    largura: Math.max(1, Math.round(largura * escala)),
    altura: Math.max(1, Math.round(altura * escala)),
  }
}

const gerar = (canvas: HTMLCanvasElement, tipo: string, qualidade: number) =>
  new Promise<Blob | null>((resolver) => canvas.toBlob(resolver, tipo, qualidade))

/**
 * Transforma a foto do celular (vários MB) numa imagem de ~100 KB.
 * Tenta WebP; o navegador que não sabe gerar WebP devolve outro formato, e aí vai JPEG.
 */
export async function comprimirFoto(arquivo: File): Promise<Blob> {
  let imagem: ImageBitmap
  try {
    imagem = await createImageBitmap(arquivo)
  } catch {
    throw new Error('Não deu para abrir essa imagem. Use uma foto em JPG, PNG ou WebP.')
  }

  const { largura, altura } = dimensoesReduzidas(imagem.width, imagem.height, LADO_MAXIMO)
  const canvas = document.createElement('canvas')
  canvas.width = largura
  canvas.height = altura
  const contexto = canvas.getContext('2d')
  if (!contexto) throw new Error('Este navegador não consegue preparar a foto. Tente outro navegador.')
  contexto.drawImage(imagem, 0, 0, largura, altura)
  imagem.close()

  for (const tipo of ['image/webp', 'image/jpeg']) {
    for (const qualidade of [0.82, 0.7, 0.55]) {
      const foto = await gerar(canvas, tipo, qualidade)
      if (!foto || foto.type !== tipo) break
      if (foto.size <= LIMITE_EM_BYTES) return foto
    }
  }
  throw new Error('Não deu para deixar a foto com menos de 1 MB. Tente outra foto.')
}

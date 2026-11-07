import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Bloqueadores de anúncio (uBlock, AdBlock, Brave) escondem elementos cujo nome parece propaganda.
// A EasyList, a lista que eles usam, tem por exemplo a regra "##.ad-item": foi assim que todos os
// Itens do Admin sumiram da tela de quem tinha bloqueador, sem nenhum erro no console.
const PARECE_ANUNCIO = /(?:^|[\s."'`#])(?:ads?|advert\w*|banner|sponsor\w*)[-_]/

function arquivos(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome)
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho]
  })
}

describe('nomes de classe e de id', () => {
  it('nenhum tem cara de anúncio para um bloqueador', () => {
    const suspeitos = arquivos('src')
      .filter((arquivo) => /\.(css|tsx)$/.test(arquivo))
      .flatMap((arquivo) =>
        readFileSync(arquivo, 'utf8')
          .split('\n')
          .map((linha, i) => ({ onde: `${arquivo}:${i + 1}`, linha })),
      )
      .filter(({ linha }) => PARECE_ANUNCIO.test(linha))
      .map(({ onde }) => onde)

    expect(suspeitos).toEqual([])
  })
})

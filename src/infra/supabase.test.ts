import { describe, expect, it } from 'vitest'
import { buscarCatalogo, itemDaLinha, lerEmPaginas, urlDaFoto, type LinhaDoItem } from './supabase'

const PROJETO = 'https://abcdefgh.supabase.co'

const linha: LinhaDoItem = {
  id: 7,
  colecao_id: 2,
  codigo: 'HR-013',
  nome: 'Alexis Guendouz',
  equipe: 'Argélia',
  raridade: 'Hero',
  preco_centavos: 150,
  estoque: 3,
  foto: 'a1b2c3.webp',
}

describe('urlDaFoto', () => {
  it('aponta para o endereço público do bucket de Fotos', () => {
    expect(urlDaFoto(PROJETO, 'a1b2c3.webp')).toBe(
      'https://abcdefgh.supabase.co/storage/v1/object/public/fotos/a1b2c3.webp',
    )
  })

  it('codifica espaços e acentos sem estragar as pastas', () => {
    expect(urlDaFoto(PROJETO, 'copa/foto nova é.webp')).toBe(
      'https://abcdefgh.supabase.co/storage/v1/object/public/fotos/copa/foto%20nova%20%C3%A9.webp',
    )
  })
})

describe('itemDaLinha', () => {
  it('traduz os nomes do banco para os do domínio e monta a URL da Foto', () => {
    expect(itemDaLinha(linha, PROJETO)).toEqual({
      id: 7,
      colecaoId: 2,
      codigo: 'HR-013',
      nome: 'Alexis Guendouz',
      equipe: 'Argélia',
      raridade: 'Hero',
      precoCentavos: 150,
      estoque: 3,
      foto: 'https://abcdefgh.supabase.co/storage/v1/object/public/fotos/a1b2c3.webp',
    })
  })

  it('Item sem Foto continua sem Foto', () => {
    expect(itemDaLinha({ ...linha, foto: null }, PROJETO).foto).toBeNull()
  })
})

describe('lerEmPaginas', () => {
  // A API do Supabase devolve no máximo 1.000 linhas por pedido (ADR-0005).
  it('continua pedindo até vir uma página incompleta', async () => {
    const banco = ['a', 'b', 'c', 'd', 'e']
    const pedidos: Array<[number, number]> = []

    const tudo = await lerEmPaginas(async (inicio, fim) => {
      pedidos.push([inicio, fim])
      return banco.slice(inicio, fim + 1)
    }, 2)

    expect(tudo).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(pedidos).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
    ])
  })

  it('quando o total é múltiplo da página, faz um último pedido que volta vazio', async () => {
    const banco = ['a', 'b', 'c', 'd']
    let pedidos = 0

    const tudo = await lerEmPaginas(async (inicio, fim) => {
      pedidos++
      return banco.slice(inicio, fim + 1)
    }, 2)

    expect(tudo).toEqual(['a', 'b', 'c', 'd'])
    expect(pedidos).toBe(3)
  })
})

describe('buscarCatalogo', () => {
  const CHAVE = 'sb_publishable_teste'
  const tabelas: Record<string, unknown[]> = {
    colecoes: [{ id: 2, nome: 'Copa 2026: figurinhas', ordem: 1 }],
    itens: [linha],
    loja: [{ nome: 'Cards do Sergio', whatsapp: '5511999999999' }],
  }

  it('pede só os Itens com Estoque, em páginas, mandando a chave publicável', async () => {
    const pedidos: Array<{ url: URL; chave: string | null }> = []

    const catalogo = await buscarCatalogo({ url: PROJETO, chave: CHAVE }, async (url, init) => {
      const endereco = new URL(url)
      pedidos.push({ url: endereco, chave: new Headers(init.headers).get('apikey') })
      return Response.json(tabelas[endereco.pathname.split('/').pop()!])
    })

    expect(catalogo).toEqual({
      loja: { nome: 'Cards do Sergio', whatsapp: '5511999999999' },
      colecoes: [{ id: 2, nome: 'Copa 2026: figurinhas', ordem: 1 }],
      itens: [
        {
          id: 7,
          colecaoId: 2,
          codigo: 'HR-013',
          nome: 'Alexis Guendouz',
          equipe: 'Argélia',
          raridade: 'Hero',
          precoCentavos: 150,
          estoque: 3,
          foto: 'https://abcdefgh.supabase.co/storage/v1/object/public/fotos/a1b2c3.webp',
        },
      ],
    })
    const itens = pedidos.find((p) => p.url.pathname === '/rest/v1/itens')!.url.searchParams
    expect(itens.get('estoque')).toBe('gt.0')
    expect(itens.get('order')).toBe('id')
    expect(itens.get('limit')).toBe('1000')
    expect(itens.get('offset')).toBe('0')
    expect(pedidos.map((p) => p.chave)).toEqual([CHAVE, CHAVE, CHAVE])
  })

  it('falha com o status quando o banco responde com erro', async () => {
    const resposta = buscarCatalogo({ url: PROJETO, chave: CHAVE }, async () => new Response('', { status: 503 }))

    await expect(resposta).rejects.toThrow('503')
  })
})

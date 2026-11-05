import { describe, expect, it } from 'vitest'
import { formatarPreco, ordenarColecoes, ordenarItens, type Colecao, type Item } from './catalogo'

const item = (campos: Partial<Item>): Item => ({
  id: 1,
  colecaoId: 1,
  codigo: null,
  nome: 'Sem nome',
  equipe: null,
  raridade: null,
  precoCentavos: 150,
  estoque: 1,
  foto: null,
  ...campos,
})

describe('formatarPreco', () => {
  // O Intl separa "R$" do número com um espaço que não quebra linha (\u00a0).
  it.each([
    [150, 'R$\u00a01,50'],
    [4990, 'R$\u00a049,90'],
    [0, 'R$\u00a00,00'],
    [123456, 'R$\u00a01.234,56'],
  ])('%i centavos viram %s', (centavos, esperado) => {
    expect(formatarPreco(centavos)).toBe(esperado)
  })
})

describe('ordenarColecoes', () => {
  it('segue a ordem definida pelo Vendedor e desempata pelo nome, sem alterar a lista recebida', () => {
    const colecoes: Colecao[] = [
      { id: 1, nome: 'Match Attax 26/27', ordem: 2 },
      { id: 2, nome: 'Copa 2026: figurinhas', ordem: 1 },
      { id: 3, nome: 'Brasileirão 2026', ordem: 1 },
    ]

    expect(ordenarColecoes(colecoes).map((c) => c.id)).toEqual([3, 2, 1])
    expect(colecoes.map((c) => c.id)).toEqual([1, 2, 3])
  })
})

describe('ordenarItens', () => {
  const colecoes: Colecao[] = [
    { id: 1, nome: 'Match Attax 26/27', ordem: 2 },
    { id: 2, nome: 'Copa 2026: figurinhas', ordem: 1 },
    { id: 3, nome: 'Brasileirão 2026', ordem: 1 },
  ]
  const rotulos = (itens: Item[]) => ordenarItens(itens, colecoes).map((i) => i.codigo ?? i.nome)

  it('segue a ordem das Coleções e desempata pelo nome da Coleção', () => {
    const itens = [
      item({ colecaoId: 1, codigo: 'MA-1' }),
      item({ colecaoId: 2, codigo: 'BRA 1' }),
      item({ colecaoId: 3, codigo: 'FLA-1' }),
    ]

    expect(rotulos(itens)).toEqual(['FLA-1', 'BRA 1', 'MA-1'])
  })

  it('dentro da Coleção, lê o número do Código como número ("HR-2" antes de "HR-10")', () => {
    const itens = [
      item({ codigo: 'HR-10' }),
      item({ codigo: 'HR-2' }),
      item({ codigo: 'HR-1' }),
    ]

    expect(rotulos(itens)).toEqual(['HR-1', 'HR-2', 'HR-10'])
  })

  it('Itens sem Código entram pelo Nome, e o acento não joga o Item para o fim', () => {
    const itens = [item({ nome: 'Envelope fechado' }), item({ nome: 'Álbum capa dura' })]

    expect(rotulos(itens)).toEqual(['Álbum capa dura', 'Envelope fechado'])
  })

  it('não altera a lista recebida', () => {
    const itens = [item({ codigo: 'HR-2' }), item({ codigo: 'HR-1' })]

    ordenarItens(itens, colecoes)

    expect(itens.map((i) => i.codigo)).toEqual(['HR-2', 'HR-1'])
  })
})

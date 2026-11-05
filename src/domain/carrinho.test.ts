import { describe, expect, it } from 'vitest'
import {
  adicionar,
  descreverAjustes,
  diminuir,
  lerCarrinhoSalvo,
  quantidadeNoCarrinho,
  reconciliar,
  resumir,
  type Carrinho,
} from './carrinho'
import type { Colecao, Item } from './catalogo'

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

const raphinha = item({ id: 3, codigo: 'BRA 19', nome: 'Raphinha', estoque: 2 })
const messi = item({ id: 4, codigo: 'ARG 17', nome: 'Lionel Messi', estoque: 1 })
const album = item({ id: 5, colecaoId: 2, nome: 'Álbum capa dura', precoCentavos: 4990, estoque: 2 })

describe('adicionar', () => {
  it('um Item novo entra com 1 unidade, e de novo vira 2', () => {
    const umaVez = adicionar([], raphinha)

    expect(umaVez).toEqual([{ itemId: 3, quantidade: 1 }])
    expect(adicionar(umaVez, raphinha)).toEqual([{ itemId: 3, quantidade: 2 }])
  })

  it('não passa do Estoque', () => {
    const cheio: Carrinho = [{ itemId: 3, quantidade: 2 }]

    expect(adicionar(cheio, raphinha)).toEqual(cheio)
  })

  it('Item sem Estoque não entra', () => {
    expect(adicionar([], item({ estoque: 0 }))).toEqual([])
  })

  it('não altera o Carrinho recebido', () => {
    const antes: Carrinho = [{ itemId: 3, quantidade: 1 }]

    adicionar(antes, raphinha)

    expect(antes).toEqual([{ itemId: 3, quantidade: 1 }])
  })
})

describe('diminuir', () => {
  it('tira uma unidade', () => {
    expect(diminuir([{ itemId: 3, quantidade: 2 }], 3)).toEqual([{ itemId: 3, quantidade: 1 }])
  })

  it('com a última unidade, o Item sai do Carrinho', () => {
    expect(diminuir([{ itemId: 3, quantidade: 1 }], 3)).toEqual([])
  })

  it('Item que não está no Carrinho não muda nada', () => {
    expect(diminuir([{ itemId: 3, quantidade: 1 }], 99)).toEqual([{ itemId: 3, quantidade: 1 }])
  })
})

describe('quantidadeNoCarrinho', () => {
  it('diz quantas unidades do Item estão no Carrinho, ou 0', () => {
    const carrinho: Carrinho = [{ itemId: 3, quantidade: 2 }]

    expect(quantidadeNoCarrinho(carrinho, 3)).toBe(2)
    expect(quantidadeNoCarrinho(carrinho, 4)).toBe(0)
  })
})

describe('reconciliar', () => {
  it('Item que saiu do Catálogo (acabou ou foi apagado) sai do Carrinho', () => {
    const resultado = reconciliar(
      [
        { itemId: 3, quantidade: 1 },
        { itemId: 99, quantidade: 2 },
      ],
      [raphinha],
    )

    expect(resultado).toEqual({ carrinho: [{ itemId: 3, quantidade: 1 }], removidos: 1, reduzidos: 0 })
  })

  it('quantidade acima do Estoque atual cai para o Estoque', () => {
    const resultado = reconciliar([{ itemId: 3, quantidade: 5 }], [raphinha])

    expect(resultado).toEqual({ carrinho: [{ itemId: 3, quantidade: 2 }], removidos: 0, reduzidos: 1 })
  })

  it('Carrinho em dia continua igual', () => {
    const carrinho: Carrinho = [{ itemId: 3, quantidade: 2 }]

    expect(reconciliar(carrinho, [raphinha])).toEqual({ carrinho, removidos: 0, reduzidos: 0 })
  })
})

describe('resumir', () => {
  const colecoes: Colecao[] = [
    { id: 1, nome: 'Copa 2026: figurinhas', ordem: 1 },
    { id: 2, nome: 'Colecionáveis', ordem: 2 },
  ]

  it('junta o Carrinho com o Catálogo, na ordem da Vitrine, com subtotal e total', () => {
    const carrinho: Carrinho = [
      { itemId: 5, quantidade: 1 },
      { itemId: 3, quantidade: 2 },
      { itemId: 4, quantidade: 1 },
    ]

    const resumo = resumir(carrinho, [raphinha, messi, album], colecoes)

    expect(resumo.linhas.map((l) => [l.item.nome, l.quantidade, l.subtotalCentavos])).toEqual([
      ['Lionel Messi', 1, 150],
      ['Raphinha', 2, 300],
      ['Álbum capa dura', 1, 4990],
    ])
    expect(resumo.quantidade).toBe(4)
    expect(resumo.totalCentavos).toBe(5440)
  })

  it('ignora o que não está mais no Catálogo', () => {
    const resumo = resumir([{ itemId: 99, quantidade: 3 }], [raphinha], colecoes)

    expect(resumo).toEqual({ linhas: [], quantidade: 0, totalCentavos: 0 })
  })
})

describe('lerCarrinhoSalvo', () => {
  it('lê o que foi salvo no navegador', () => {
    expect(lerCarrinhoSalvo('[{"itemId":3,"quantidade":2}]')).toEqual([{ itemId: 3, quantidade: 2 }])
  })

  it.each([
    ['nada salvo', null],
    ['texto que não é JSON', 'carrinho'],
    ['JSON com outro formato', '{"itens":[]}'],
  ])('%s vira Carrinho vazio, sem quebrar o site', (_, texto) => {
    expect(lerCarrinhoSalvo(texto)).toEqual([])
  })

  it('descarta as linhas estragadas e fica com as boas', () => {
    const salvo = JSON.stringify([
      { itemId: 3, quantidade: 2 },
      { itemId: 4, quantidade: 0 },
      { itemId: 5, quantidade: -1 },
      { itemId: 6, quantidade: 1.5 },
      { itemId: '7', quantidade: 1 },
      null,
    ])

    expect(lerCarrinhoSalvo(salvo)).toEqual([{ itemId: 3, quantidade: 2 }])
  })
})

describe('descreverAjustes', () => {
  it.each([
    [0, 0, null],
    [1, 0, '1 item do seu pedido acabou e saiu do pedido.'],
    [2, 0, '2 itens do seu pedido acabaram e saíram do pedido.'],
    [0, 1, '1 item do seu pedido teve a quantidade reduzida, porque o estoque diminuiu.'],
    [0, 2, '2 itens do seu pedido tiveram a quantidade reduzida, porque o estoque diminuiu.'],
    [
      1,
      1,
      '1 item do seu pedido acabou e saiu do pedido. 1 item do seu pedido teve a quantidade reduzida, porque o estoque diminuiu.',
    ],
  ])('%i removidos e %i reduzidos', (removidos, reduzidos, esperado) => {
    expect(descreverAjustes(removidos, reduzidos)).toBe(esperado)
  })
})

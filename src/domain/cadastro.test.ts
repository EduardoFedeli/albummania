import { describe, expect, it } from 'vitest'
import {
  lerEstoque,
  lerPreco,
  lerWhatsapp,
  moverColecao,
  precoParaEdicao,
  validarItem,
  type Rascunho,
} from './cadastro'
import type { Colecao } from './catalogo'

describe('lerPreco', () => {
  it.each([
    ['1,50', 150],
    ['1,5', 150],
    ['1', 100],
    ['R$ 1,50', 150],
    [' 2,00 ', 200],
    ['0,99', 99],
    ['0', 0],
    ['350', 35000],
    // O Vendedor também digita com ponto: com 1 ou 2 casas é decimal, com 3 é milhar.
    ['1.50', 150],
    ['1.5', 150],
    ['1.500', 150000],
    ['1.234,56', 123456],
  ])('"%s" vira %i centavos', (texto, centavos) => {
    expect(lerPreco(texto)).toBe(centavos)
  })

  it.each(['', '   ', 'R$', 'abc', '-1', '1,555', '1,2,3', '1.5.0'])('"%s" não é um preço', (texto) => {
    expect(lerPreco(texto)).toBeNull()
  })
})

describe('precoParaEdicao', () => {
  it.each([
    [150, '1,50'],
    [4990, '49,90'],
    [0, '0,00'],
    [123456, '1234,56'],
  ])('%i centavos aparecem no campo como "%s"', (centavos, texto) => {
    expect(precoParaEdicao(centavos)).toBe(texto)
    expect(lerPreco(texto)).toBe(centavos)
  })
})

describe('lerEstoque', () => {
  it.each([
    ['3', 3],
    [' 3 ', 3],
    ['0', 0],
    ['12', 12],
  ])('"%s" vira %i', (texto, estoque) => {
    expect(lerEstoque(texto)).toBe(estoque)
  })

  it.each(['', '3,5', '3.5', '-1', 'dois'])('"%s" não é um Estoque', (texto) => {
    expect(lerEstoque(texto)).toBeNull()
  })
})

describe('lerWhatsapp', () => {
  it.each([
    ['5511912345678', '5511912345678'],
    ['+55 (11) 91234-5678', '5511912345678'],
    // Sem o DDI, o número é do Brasil: o 55 entra sozinho.
    ['(11) 91234-5678', '5511912345678'],
    ['11 3456-7890', '551134567890'],
  ])('"%s" vira "%s"', (texto, numero) => {
    expect(lerWhatsapp(texto)).toBe(numero)
  })

  it.each(['', '1234', 'abc'])('"%s" não é um WhatsApp', (texto) => {
    expect(lerWhatsapp(texto)).toBeNull()
  })
})

describe('validarItem', () => {
  const rascunho: Rascunho = {
    colecaoId: '2',
    codigo: ' HR-013 ',
    nome: ' Alexis Guendouz ',
    equipe: 'Argélia',
    raridade: '',
    preco: '1,50',
    estoque: '3',
  }

  it('aceita o rascunho, tira os espaços das pontas e transforma campo vazio em nulo', () => {
    expect(validarItem(rascunho)).toEqual({
      ok: true,
      item: {
        colecaoId: 2,
        codigo: 'HR-013',
        nome: 'Alexis Guendouz',
        equipe: 'Argélia',
        raridade: null,
        precoCentavos: 150,
        estoque: 3,
      },
    })
  })

  it('aponta todos os campos com problema de uma vez', () => {
    const resultado = validarItem({ ...rascunho, colecaoId: '', nome: '  ', preco: 'abc', estoque: '-1' })

    expect(resultado.ok).toBe(false)
    expect(resultado.ok === false && Object.keys(resultado.erros).sort()).toEqual([
      'colecaoId',
      'estoque',
      'nome',
      'preco',
    ])
  })

  it('Código, Equipe e Raridade são opcionais', () => {
    const resultado = validarItem({ ...rascunho, codigo: '', equipe: ' ', raridade: '' })

    expect(resultado.ok && resultado.item).toMatchObject({ codigo: null, equipe: null, raridade: null })
  })
})

describe('moverColecao', () => {
  const colecoes: Colecao[] = [
    { id: 1, nome: 'A', ordem: 1 },
    { id: 2, nome: 'B', ordem: 2 },
    { id: 3, nome: 'C', ordem: 3 },
  ]
  const resumo = (lista: Colecao[]) => lista.map((c) => `${c.nome}${c.ordem}`).join(' ')

  it('sobe uma Coleção, trocando de lugar com a de cima', () => {
    expect(resumo(moverColecao(colecoes, 2, -1))).toBe('B1 A2 C3')
  })

  it('desce uma Coleção, trocando de lugar com a de baixo', () => {
    expect(resumo(moverColecao(colecoes, 2, 1))).toBe('A1 C2 B3')
  })

  it('a primeira não sobe e a última não desce', () => {
    expect(resumo(moverColecao(colecoes, 1, -1))).toBe('A1 B2 C3')
    expect(resumo(moverColecao(colecoes, 3, 1))).toBe('A1 B2 C3')
  })

  it('renumera quando várias Coleções têm a mesma ordem, para a troca valer de verdade', () => {
    const empatadas = colecoes.map((c) => ({ ...c, ordem: 0 }))

    expect(resumo(moverColecao(empatadas, 3, -1))).toBe('A1 C2 B3')
  })
})

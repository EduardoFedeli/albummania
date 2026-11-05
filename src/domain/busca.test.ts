import { describe, expect, it } from 'vitest'
import { combinaComBusca, normalizar } from './busca'
import type { Item } from './catalogo'

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

const guendouz = item({ codigo: 'HR-013', nome: 'Alexis Guendouz', equipe: 'Argélia' })
const vini = item({ codigo: 'BRA 10', nome: 'Vinícius Jr.', equipe: 'Brasil' })
const escudo = item({ codigo: 'BRA 1', nome: 'Escudo', equipe: 'Brasil', raridade: 'Brilhante' })
const lata = item({ nome: 'Lata colecionável' })

describe('normalizar', () => {
  it.each([
    ['Vinícius Jr.', 'vinicius jr.'],
    ['ÁLBUM', 'album'],
    ['Conceição', 'conceicao'],
    ['Mbappé', 'mbappe'],
  ])('"%s" vira "%s"', (texto, esperado) => {
    expect(normalizar(texto)).toBe(esperado)
  })
})

// Cenários da busca da Vitrine. A implementação é do Eduardo (veja o TODO em busca.ts).
describe('combinaComBusca', () => {
  it('sem termo, mostra tudo', () => {
    expect(combinaComBusca(guendouz, '')).toBe(true)
    expect(combinaComBusca(guendouz, '   ')).toBe(true)
  })

  it('acha pelo Nome, sem acento e sem diferenciar maiúsculas', () => {
    expect(combinaComBusca(vini, 'vinicius')).toBe(true)
    expect(combinaComBusca(vini, 'VINÍ')).toBe(true)
  })

  it('acha pela Equipe', () => {
    expect(combinaComBusca(guendouz, 'argelia')).toBe(true)
  })

  it('acha pela Raridade', () => {
    expect(combinaComBusca(escudo, 'brilhante')).toBe(true)
  })

  it.each(['HR-013', 'hr013', 'hr 013', 'Hr-013'])('acha o Código "HR-013" digitado como "%s"', (termo) => {
    expect(combinaComBusca(guendouz, termo)).toBe(true)
  })

  it('com várias palavras, cada uma pode estar num campo diferente', () => {
    expect(combinaComBusca(guendouz, 'guendouz argelia')).toBe(true)
  })

  it('não acha quando uma das palavras não aparece em nenhum campo', () => {
    expect(combinaComBusca(guendouz, 'guendouz brasil')).toBe(false)
  })

  it('não acha quando nada combina', () => {
    expect(combinaComBusca(guendouz, 'messi')).toBe(false)
  })

  it('não confunde o Código de outro Item', () => {
    expect(combinaComBusca(vini, 'hr013')).toBe(false)
  })

  it('funciona com Item sem Código, Equipe nem Raridade', () => {
    expect(combinaComBusca(lata, 'lata')).toBe(true)
    expect(combinaComBusca(lata, 'brasil')).toBe(false)
  })
})

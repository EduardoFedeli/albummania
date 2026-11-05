import { describe, expect, it } from 'vitest'
import type { Item } from '../domain/catalogo'
import { numeral } from './numeral'

const item = (codigo: string | null, nome = 'Sem nome'): Item => ({
  id: 1,
  colecaoId: 1,
  codigo,
  nome,
  equipe: null,
  raridade: null,
  precoCentavos: 150,
  estoque: 1,
  foto: null,
})

// O numeral gigante ocupa o lugar da Foto quando o Item não tem uma (design-system.md).
describe('numeral', () => {
  it.each([
    ['HR-013', '13'],
    ['BRA 10', '10'],
    ['FWC 1', '1'],
    ['00', '00'],
    ['MA-2-117', '117'],
  ])('o Código "%s" vira o numeral "%s"', (codigo, esperado) => {
    expect(numeral(item(codigo))).toBe(esperado)
  })

  it('Código sem número usa a primeira letra', () => {
    expect(numeral(item('WH-MD'))).toBe('W')
  })

  it('sem Código, usa a primeira letra do Nome', () => {
    expect(numeral(item(null, 'álbum capa dura'))).toBe('Á')
  })
})

import { describe, expect, it } from 'vitest'
import { dimensoesReduzidas } from './foto'

// A Foto vai para o Storage com o lado maior de até 1.000 px (ADR-0005).
describe('dimensoesReduzidas', () => {
  it.each([
    [4000, 3000, 1000, 750],
    [3000, 4000, 750, 1000],
    [800, 600, 800, 600],
    [1000, 1000, 1000, 1000],
    [5000, 3, 1000, 1],
  ])('%ix%i vira %ix%i', (largura, altura, esperadaL, esperadaA) => {
    expect(dimensoesReduzidas(largura, altura, 1000)).toEqual({ largura: esperadaL, altura: esperadaA })
  })
})

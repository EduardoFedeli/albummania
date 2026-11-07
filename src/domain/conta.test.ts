import { describe, expect, it } from 'vitest'
import { validarNovaSenha } from './conta'

describe('validarNovaSenha', () => {
  it('aceita uma senha de 8 caracteres ou mais, repetida igual', () => {
    expect(validarNovaSenha('cards2026', 'cards2026')).toBeNull()
    expect(validarNovaSenha('12345678', '12345678')).toBeNull()
  })

  it('recusa senha curta', () => {
    expect(validarNovaSenha('1234567', '1234567')).toBe('Use pelo menos 8 caracteres.')
  })

  it('recusa quando a repetição não bate', () => {
    expect(validarNovaSenha('cards2026', 'cards2027')).toBe('As duas senhas não estão iguais.')
  })

  it('não tira os espaços: espaço também faz parte da senha', () => {
    expect(validarNovaSenha(' cards2026', 'cards2026')).toBe('As duas senhas não estão iguais.')
  })
})

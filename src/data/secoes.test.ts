import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SECOES } from './secoes'

const checklist = readFileSync('dados/checklist-copa-2026.csv', 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((linha) => {
    const [, codigo, nome, tipo] = linha.split(',')
    return { codigo, nome, tipo }
  })

const selecoes = SECOES.filter((secao) => secao.grupo)

describe('SECOES', () => {
  it('tem as 48 seleções em 12 grupos de 4, mais as duas seções especiais', () => {
    expect(SECOES).toHaveLength(50)
    expect(selecoes).toHaveLength(48)
    const porGrupo = new Map<string, number>()
    for (const { grupo } of selecoes) porGrupo.set(grupo!, (porGrupo.get(grupo!) ?? 0) + 1)
    expect([...porGrupo.keys()]).toEqual('ABCDEFGHIJKL'.split(''))
    expect([...porGrupo.values()].every((quantidade) => quantidade === 4)).toBe(true)
  })

  it('não repete siglas e só usa cores hexadecimais', () => {
    expect(new Set(SECOES.map((secao) => secao.sigla)).size).toBe(SECOES.length)
    expect(SECOES.flatMap((secao) => secao.cores).every((cor) => /^#[0-9A-F]{6}$/.test(cor))).toBe(true)
  })
})

describe('checklist da Copa 2026', () => {
  it('tem as 980 figurinhas, 68 delas especiais', () => {
    expect(checklist).toHaveLength(980)
    expect(new Set(checklist.map((f) => f.codigo)).size).toBe(980)
    expect(checklist.filter((f) => f.tipo === 'Especial')).toHaveLength(68)
  })

  it('só usa siglas de Seções conhecidas', () => {
    const siglas = new Set(SECOES.map((secao) => secao.sigla))
    expect(checklist.every((f) => siglas.has(f.codigo.split(' ')[0]))).toBe(true)
  })

  it('tem as figurinhas 1 a 20 de cada seleção, com o escudo na 1 e a foto do time na 13', () => {
    for (const { sigla } of selecoes) {
      const daSelecao = checklist.filter((f) => f.codigo.startsWith(`${sigla} `))
      expect(daSelecao.map((f) => f.codigo)).toEqual(
        Array.from({ length: 20 }, (_, i) => `${sigla} ${i + 1}`),
      )
      expect(daSelecao[0]).toMatchObject({ nome: 'Escudo', tipo: 'Especial' })
      expect(daSelecao[12]).toMatchObject({ nome: 'Foto do time', tipo: 'Comum' })
    }
  })
})

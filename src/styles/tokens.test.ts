import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SECOES } from '../data/secoes'

type Tokens = Record<string, string>

const css = readFileSync('src/styles/tokens.css', 'utf8')

function bloco(seletor: string): Tokens {
  const inicio = css.indexOf(`${seletor} {`)
  const fim = css.indexOf('}', inicio)
  const declaracoes = css.slice(inicio, fim).matchAll(/(--[\w-]+):\s*([^;]+);/g)
  return Object.fromEntries([...declaracoes].map(([, nome, valor]) => [nome, valor.trim()]))
}

const miolo = bloco(':root')
const temas = { miolo, capa: { ...miolo, ...bloco("[data-tema='capa']") } }

function resolver(tokens: Tokens, nome: string): string {
  const valor = tokens[nome]
  const referencia = valor?.match(/^var\((--[\w-]+)\)$/)
  return referencia ? resolver(tokens, referencia[1]) : valor
}

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

// Igual ao color-mix(in srgb, cor P%, fundo) do CSS.
const misturar = (cor: string, fundo: string, proporcao: number) => {
  const [a, b] = [rgb(cor), rgb(fundo)]
  return '#' + a.map((canal, i) => Math.round(canal * proporcao + b[i] * (1 - proporcao)).toString(16).padStart(2, '0')).join('')
}

const luminancia = (hex: string) => {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contraste = (a: string, b: string) => {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

const TEXTO_AA = 4.5
const ELEMENTO_AA = 3

describe.each(Object.entries(temas))('tema %s', (_, tokens) => {
  const cor = (nome: string) => resolver(tokens, `--cor-${nome}`)

  it.each([
    ['texto', 'fundo'],
    ['texto', 'superficie'],
    ['texto-fraco', 'fundo'],
    ['texto-fraco', 'superficie'],
    ['texto-sobre-acao', 'acao'],
    ['texto-sobre-destaque', 'destaque'],
    ['erro', 'fundo'],
  ])('texto %s sobre %s passa no AA', (frente, fundo) => {
    expect(contraste(cor(frente), cor(fundo))).toBeGreaterThanOrEqual(TEXTO_AA)
  })

  it.each([
    ['foco', 'fundo'],
    ['borda-forte', 'fundo'],
    ['acao', 'fundo'],
  ])('elemento %s se distingue de %s', (frente, fundo) => {
    expect(contraste(cor(frente), cor(fundo))).toBeGreaterThanOrEqual(ELEMENTO_AA)
  })

  it('o texto é legível sobre o espaço de qualquer uma das 50 Seções', () => {
    const proporcao = parseFloat(resolver(tokens, '--mistura-espaco')) / 100
    const reprovadas = SECOES.filter(
      (secao) => contraste(cor('texto'), misturar(secao.cores[0], cor('fundo'), proporcao)) < TEXTO_AA,
    ).map((secao) => secao.sigla)

    expect(reprovadas).toEqual([])
  })
})

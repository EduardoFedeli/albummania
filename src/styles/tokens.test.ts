import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SECOES } from '../data/secoes'

type Tokens = Record<string, string>

const css = readFileSync('src/styles/tokens.css', 'utf8')

function bloco(seletor: string): Tokens {
  const inicio = css.indexOf(`${seletor} {`)
  if (inicio === -1) throw new Error(`O bloco "${seletor}" não existe em tokens.css`)
  const fim = css.indexOf('}', inicio)
  const declaracoes = css.slice(inicio, fim).matchAll(/(--[\w-]+):\s*([^;]+);/g)
  return Object.fromEntries([...declaracoes].map(([, nome, valor]) => [nome, valor.trim()]))
}

// O escuro é o padrão (:root). O claro troca só as cores, por cima dele, como acontece no navegador.
const TEMAS: Array<[string, Tokens]> = [
  ['escuro', bloco(':root')],
  ['claro', { ...bloco(':root'), ...bloco(":root[data-tema='claro']") }],
]

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
  const [maisClara, maisEscura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (maisClara + 0.05) / (maisEscura + 0.05)
}

const TEXTO_AA = 4.5
const ELEMENTO_AA = 3

describe.each(TEMAS)('contraste dos tokens no tema %s', (tema, tokens) => {
  const resolver = (nome: string): string => {
    const valor = tokens[nome]
    const referencia = valor?.match(/^var\((--[\w-]+)\)$/)
    return referencia ? resolver(referencia[1]) : valor
  }
  const cor = (nome: string) => resolver(`--cor-${nome}`)

  it(`o fundo é ${tema === 'escuro' ? 'mais escuro' : 'mais claro'} que o texto`, () => {
    const fundoMaisEscuro = luminancia(cor('fundo')) < luminancia(cor('texto'))
    expect(fundoMaisEscuro).toBe(tema === 'escuro')
  })

  it.each([
    ['texto', 'fundo'],
    ['texto', 'superficie'],
    ['texto', 'apagado'],
    ['texto-fraco', 'fundo'],
    ['texto-fraco', 'superficie'],
    ['texto-sobre-acao', 'acao'],
    ['texto-sobre-destaque', 'destaque'],
    ['erro', 'fundo'],
    ['erro', 'superficie'],
  ])('texto %s sobre %s passa no AA', (frente, fundo) => {
    expect(contraste(cor(frente), cor(fundo))).toBeGreaterThanOrEqual(TEXTO_AA)
  })

  it.each([
    ['foco', 'fundo'],
    ['foco', 'superficie'],
    ['borda-forte', 'fundo'],
    ['borda-forte', 'superficie'],
    ['acao', 'fundo'],
    ['destaque', 'superficie'],
  ])('elemento %s se distingue de %s', (frente, fundo) => {
    expect(contraste(cor(frente), cor(fundo))).toBeGreaterThanOrEqual(ELEMENTO_AA)
  })

  it('o texto é legível sobre o espaço de qualquer uma das 50 Seções', () => {
    const proporcao = parseFloat(resolver('--mistura-espaco')) / 100
    const reprovadas = SECOES.filter(
      (secao) => contraste(cor('texto'), misturar(secao.cores[0], cor('superficie'), proporcao)) < TEXTO_AA,
    ).map((secao) => secao.sigla)

    expect(reprovadas).toEqual([])
  })
})

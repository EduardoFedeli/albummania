// Regras do cadastro no Admin (CONTEXT.md). TypeScript puro: sem React e sem rede (ADR-0004).
import type { Colecao } from './catalogo'

/** O formulário do Item, do jeito que o Vendedor digitou: tudo texto. */
export interface Rascunho {
  colecaoId: string
  codigo: string
  nome: string
  equipe: string
  raridade: string
  preco: string
  estoque: string
}

/** O Item pronto para gravar, com os tipos certos. */
export interface ItemParaSalvar {
  colecaoId: number
  codigo: string | null
  nome: string
  equipe: string | null
  raridade: string | null
  precoCentavos: number
  estoque: number
}

export type Validacao =
  | { ok: true; item: ItemParaSalvar }
  | { ok: false; erros: Partial<Record<keyof Rascunho, string>> }

/**
 * Lê o Preço do jeito que o Vendedor digitar e devolve centavos, ou null se não for um preço.
 * Vírgula é sempre decimal ("1,50"). O ponto é milhar quando vem com 3 dígitos ("1.500")
 * e decimal quando vem com 1 ou 2 ("1.50"). A conta é feita com texto, sem número quebrado.
 */
export function lerPreco(texto: string): number | null {
  const limpo = texto.replace(/R\$/gi, '').replace(/\s/g, '')
  let inteiro: string
  let decimal = ''

  if (/^\d{1,3}(\.\d{3})+,\d{1,2}$/.test(limpo)) {
    ;[inteiro, decimal] = limpo.replace(/\./g, '').split(',')
  } else if (/^\d+,\d{1,2}$/.test(limpo)) {
    ;[inteiro, decimal] = limpo.split(',')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    inteiro = limpo.replace(/\./g, '')
  } else if (/^\d+\.\d{1,2}$/.test(limpo)) {
    ;[inteiro, decimal] = limpo.split('.')
  } else if (/^\d+$/.test(limpo)) {
    inteiro = limpo
  } else {
    return null
  }

  return Number(inteiro) * 100 + Number(decimal.padEnd(2, '0'))
}

/** 150 → "1,50": o Preço como ele aparece no campo do formulário. */
export function precoParaEdicao(centavos: number): string {
  return `${Math.floor(centavos / 100)},${String(centavos % 100).padStart(2, '0')}`
}

/** Estoque é um número inteiro, 0 ou mais. */
export function lerEstoque(texto: string): number | null {
  const limpo = texto.trim()
  return /^\d+$/.test(limpo) ? Number(limpo) : null
}

/** Só os dígitos, com DDI. Com 10 ou 11 dígitos, o número é do Brasil e ganha o 55. */
export function lerWhatsapp(texto: string): string | null {
  const digitos = texto.replace(/\D/g, '')
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`
  if (digitos.length >= 12 && digitos.length <= 15) return digitos
  return null
}

const opcional = (texto: string) => texto.trim() || null

export function validarItem(rascunho: Rascunho): Validacao {
  const erros: Partial<Record<keyof Rascunho, string>> = {}

  const colecaoId = Number(rascunho.colecaoId)
  if (!rascunho.colecaoId || !Number.isInteger(colecaoId) || colecaoId <= 0) erros.colecaoId = 'Escolha a Coleção.'

  const nome = rascunho.nome.trim()
  if (!nome) erros.nome = 'Escreva o nome do Item.'

  const precoCentavos = lerPreco(rascunho.preco)
  if (precoCentavos === null) erros.preco = 'Use um valor como 1,50.'

  const estoque = lerEstoque(rascunho.estoque)
  if (estoque === null) erros.estoque = 'Use um número inteiro, 0 ou mais.'

  if (precoCentavos === null || estoque === null || Object.keys(erros).length > 0) return { ok: false, erros }

  return {
    ok: true,
    item: {
      colecaoId,
      codigo: opcional(rascunho.codigo),
      nome,
      equipe: opcional(rascunho.equipe),
      raridade: opcional(rascunho.raridade),
      precoCentavos,
      estoque,
    },
  }
}

/**
 * Troca a Coleção de lugar com a vizinha e renumera todas (1, 2, 3…).
 * Recebe as Coleções já na ordem da Vitrine (ordenarColecoes). Renumerar garante
 * que a troca vale mesmo quando várias Coleções tinham a mesma ordem.
 */
export function moverColecao(colecoes: Colecao[], id: number, direcao: -1 | 1): Colecao[] {
  const lista = [...colecoes]
  const de = lista.findIndex((c) => c.id === id)
  const para = de + direcao
  if (de >= 0 && para >= 0 && para < lista.length) [lista[de], lista[para]] = [lista[para], lista[de]]
  return lista.map((colecao, indice) => ({ ...colecao, ordem: indice + 1 }))
}

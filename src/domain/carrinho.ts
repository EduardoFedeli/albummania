// O Carrinho (CONTEXT.md). TypeScript puro: sem React e sem rede (ADR-0004).
import { ordenarItens, type Colecao, type Item } from './catalogo'

/** O Carrinho guarda só a referência ao Item e a quantidade. Preço e Estoque vêm sempre do Catálogo atual. */
export interface ItemDoCarrinho {
  itemId: number
  quantidade: number
}

export type Carrinho = ItemDoCarrinho[]

export interface LinhaDoPedido {
  item: Item
  quantidade: number
  subtotalCentavos: number
}

export interface Resumo {
  linhas: LinhaDoPedido[]
  quantidade: number
  totalCentavos: number
}

export function quantidadeNoCarrinho(carrinho: Carrinho, itemId: number): number {
  return carrinho.find((linha) => linha.itemId === itemId)?.quantidade ?? 0
}

/** Uma unidade a mais, sem passar do Estoque. Item sem Estoque não entra. */
export function adicionar(carrinho: Carrinho, item: Item): Carrinho {
  const atual = quantidadeNoCarrinho(carrinho, item.id)
  if (atual >= item.estoque) return carrinho
  if (atual === 0) return [...carrinho, { itemId: item.id, quantidade: 1 }]
  return carrinho.map((linha) => (linha.itemId === item.id ? { ...linha, quantidade: linha.quantidade + 1 } : linha))
}

/** Uma unidade a menos. Com a última, o Item sai do Carrinho. */
export function diminuir(carrinho: Carrinho, itemId: number): Carrinho {
  return carrinho.flatMap((linha) => {
    if (linha.itemId !== itemId) return [linha]
    return linha.quantidade > 1 ? [{ ...linha, quantidade: linha.quantidade - 1 }] : []
  })
}

/**
 * Acerta um Carrinho salvo com o Catálogo de agora (system design §5.1): o Item que sumiu
 * (acabou ou foi apagado) sai, e a quantidade acima do Estoque cai para o Estoque.
 * Os contadores servem para avisar o Comprador do que mudou.
 */
export function reconciliar(
  carrinho: Carrinho,
  itens: Item[],
): { carrinho: Carrinho; removidos: number; reduzidos: number } {
  const porId = new Map(itens.map((item) => [item.id, item]))
  let removidos = 0
  let reduzidos = 0

  const ajustado = carrinho.flatMap((linha) => {
    const item = porId.get(linha.itemId)
    if (!item || item.estoque <= 0) {
      removidos++
      return []
    }
    if (linha.quantidade > item.estoque) {
      reduzidos++
      return [{ ...linha, quantidade: item.estoque }]
    }
    return [linha]
  })

  return { carrinho: ajustado, removidos, reduzidos }
}

/** O Carrinho junto com o Catálogo: as linhas na ordem da Vitrine, com subtotal, e os totais. */
export function resumir(carrinho: Carrinho, itens: Item[], colecoes: Colecao[]): Resumo {
  const quantidades = new Map(carrinho.map((linha) => [linha.itemId, linha.quantidade]))
  const linhas = ordenarItens(
    itens.filter((item) => quantidades.has(item.id)),
    colecoes,
  ).map((item) => {
    const quantidade = quantidades.get(item.id) ?? 0
    return { item, quantidade, subtotalCentavos: item.precoCentavos * quantidade }
  })

  return {
    linhas,
    quantidade: linhas.reduce((soma, linha) => soma + linha.quantidade, 0),
    totalCentavos: linhas.reduce((soma, linha) => soma + linha.subtotalCentavos, 0),
  }
}

/**
 * Lê o Carrinho guardado no navegador. O texto pode vir de uma versão antiga do site
 * ou ter sido mexido à mão, então tudo que não tiver o formato certo é descartado.
 */
export function lerCarrinhoSalvo(texto: string | null): Carrinho {
  if (!texto) return []
  let dados: unknown
  try {
    dados = JSON.parse(texto)
  } catch {
    return []
  }
  if (!Array.isArray(dados)) return []
  return dados.filter(
    (linha): linha is ItemDoCarrinho =>
      typeof linha === 'object' &&
      linha !== null &&
      Number.isInteger(linha.itemId) &&
      Number.isInteger(linha.quantidade) &&
      linha.quantidade > 0,
  )
}

/** O aviso para o Comprador quando a reconciliação mudou o Carrinho dele. */
export function descreverAjustes(removidos: number, reduzidos: number): string | null {
  const frases: string[] = []
  if (removidos === 1) frases.push('1 item do seu pedido acabou e saiu do pedido.')
  if (removidos > 1) frases.push(`${removidos} itens do seu pedido acabaram e saíram do pedido.`)
  if (reduzidos === 1) frases.push('1 item do seu pedido teve a quantidade reduzida, porque o estoque diminuiu.')
  if (reduzidos > 1)
    frases.push(`${reduzidos} itens do seu pedido tiveram a quantidade reduzida, porque o estoque diminuiu.`)
  return frases.length > 0 ? frases.join(' ') : null
}

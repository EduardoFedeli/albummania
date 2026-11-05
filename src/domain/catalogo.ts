// O Catálogo da Vitrine (CONTEXT.md). TypeScript puro: sem React e sem rede (ADR-0004).

export interface Colecao {
  id: number
  nome: string
  ordem: number
}

export interface Item {
  id: number
  colecaoId: number
  codigo: string | null
  nome: string
  equipe: string | null
  raridade: string | null
  precoCentavos: number
  estoque: number
  /** URL pública da Foto, ou null quando o Item não tem Foto. */
  foto: string | null
}

export interface Loja {
  nome: string
  /** Só dígitos, com DDI e DDD. Vazio enquanto o Vendedor não configurar. */
  whatsapp: string
}

export interface Catalogo {
  loja: Loja
  colecoes: Colecao[]
  /** Só os Itens com Estoque maior que zero. */
  itens: Item[]
}

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 150 → "R$ 1,50". O Preço vive em centavos inteiros e só vira reais na hora de exibir. */
export function formatarPreco(centavos: number): string {
  return reais.format(centavos / 100)
}

// Compara como um colecionador lê: o número pelo valor ("HR-2" antes de "HR-10"),
// e sem diferenciar acento nem maiúscula ("Álbum" fica junto de "album", antes de "Envelope").
const comoSeLe = new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' })

/** A ordem que o Vendedor deu às Coleções; as empatadas vão pelo nome. */
export function ordenarColecoes(colecoes: Colecao[]): Colecao[] {
  return [...colecoes].sort((a, b) => a.ordem - b.ordem || comoSeLe.compare(a.nome, b.nome))
}

/** Ordem da Vitrine: pela ordem das Coleções e, dentro de cada uma, pelo Código (ou pelo Nome, se não houver Código). */
export function ordenarItens(itens: Item[], colecoes: Colecao[]): Item[] {
  const posicao = new Map(ordenarColecoes(colecoes).map((colecao, indice) => [colecao.id, indice]))
  const lugar = (item: Item) => posicao.get(item.colecaoId) ?? posicao.size
  const rotulo = (item: Item) => item.codigo ?? item.nome

  return [...itens].sort((a, b) => lugar(a) - lugar(b) || comoSeLe.compare(rotulo(a), rotulo(b)))
}

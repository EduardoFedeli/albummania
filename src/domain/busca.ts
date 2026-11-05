// A busca da Vitrine (CONTEXT.md). TypeScript puro: sem React e sem rede (ADR-0004).
import type { Item } from './catalogo'

/**
 * Minúsculas e sem acento: "Vinícius" → "vinicius".
 * O normalize('NFD') separa cada letra do seu acento ("í" vira "i" + "´"),
 * e o replace apaga os acentos soltos, que ficam todos na faixa \u0300–\u036f.
 */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

/** Sem acento, sem maiúscula, sem espaço e sem hífen: "HR-013" e "hr 013" viram "hr013". */
const compacto = (texto: string) => normalizar(texto).replace(/[\s-]/g, '')

/**
 * Diz se um Item aparece na Vitrine para o termo digitado na busca (cenários em busca.test.ts).
 * Cada palavra do termo precisa aparecer em algum campo, mas pode ser um campo diferente para cada uma.
 * Os dois lados são compactados, e assim o Código acha o Item digitado de qualquer jeito.
 */
export function combinaComBusca(item: Item, termo: string): boolean {
  const campos = [item.codigo, item.nome, item.equipe, item.raridade]
    .filter((campo) => campo !== null)
    .map(compacto)

  return normalizar(termo)
    .split(/\s+/)
    .filter(Boolean)
    .every((palavra) => campos.some((campo) => campo.includes(compacto(palavra))))
}

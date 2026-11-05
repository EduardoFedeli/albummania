import type { Item } from '../domain/catalogo'

/**
 * O que aparece em tamanho gigante no lugar da Foto, como no espaço vazio do álbum:
 * o último número do Código, sem zeros à esquerda ("HR-013" → "13"), ou então uma letra.
 */
export function numeral(item: Pick<Item, 'codigo' | 'nome'>): string {
  const numero = item.codigo?.match(/\d+(?!.*\d)/)?.[0]
  if (numero) return numero.replace(/^0+/, '') || numero
  return (item.codigo ?? item.nome).trim().charAt(0).toLocaleUpperCase('pt-BR')
}

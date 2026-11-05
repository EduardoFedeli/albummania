// O Pedido (CONTEXT.md): a mensagem de WhatsApp gerada a partir do Carrinho. TypeScript puro (ADR-0004).
import { formatarPreco, type Colecao } from './catalogo'
import type { Resumo } from './carrinho'

// Na mensagem, o "R$ 1,50" usa um espaço comum. O Intl põe um espaço que não quebra linha,
// que na URL ocupa 6 caracteres (%C2%A0) em vez de 3 (%20).
const preco = (centavos: number) => formatarPreco(centavos).replace(/\s/g, ' ')

/**
 * A mensagem que o Comprador manda ao Vendedor: os Itens agrupados por Coleção, cada um com
 * a quantidade e o subtotal, e o total estimado. O valor final é o que for combinado na Venda.
 */
export function montarMensagem(resumo: Resumo, colecoes: Colecao[]): string {
  const nomeDaColecao = new Map(colecoes.map((colecao) => [colecao.id, colecao.nome]))
  const corpo: string[] = []
  let colecaoAtual: number | null = null

  for (const { item, quantidade, subtotalCentavos } of resumo.linhas) {
    if (item.colecaoId !== colecaoAtual) {
      colecaoAtual = item.colecaoId
      // No WhatsApp, o texto entre asteriscos aparece em negrito.
      corpo.push('', `*${nomeDaColecao.get(item.colecaoId) ?? 'Outros'}*`)
    }
    const nome = [item.codigo, item.nome].filter(Boolean).join(' ')
    const vezes = quantidade > 1 ? ` (${quantidade}x)` : ''
    corpo.push(`• ${nome}${vezes} · ${preco(subtotalCentavos)}`)
  }

  const itens = resumo.quantidade === 1 ? '1 item' : `${resumo.quantidade} itens`
  return [
    'Olá! Tenho interesse nestes itens:',
    ...corpo,
    '',
    `Total estimado: ${preco(resumo.totalCentavos)} (${itens})`,
    'Sujeito a confirmação de disponibilidade. Frete e pagamento a combinar.',
  ].join('\n')
}

/** O link que abre a conversa com o Vendedor, com a mensagem já escrita. */
export function urlDoWhatsapp(whatsapp: string, mensagem: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`
}

/** "5511912345678" → "+55 (11) 91234-5678": o número como uma pessoa lê. */
export function formatarWhatsapp(whatsapp: string): string {
  const brasil = whatsapp.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return brasil ? `+55 (${brasil[1]}) ${brasil[2]}-${brasil[3]}` : `+${whatsapp}`
}

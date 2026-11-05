import { describe, expect, it } from 'vitest'
import type { Colecao, Item } from './catalogo'
import type { Resumo } from './carrinho'
import { formatarWhatsapp, montarMensagem, urlDoWhatsapp } from './pedido'

const item = (campos: Partial<Item>): Item => ({
  id: 1,
  colecaoId: 1,
  codigo: null,
  nome: 'Sem nome',
  equipe: null,
  raridade: null,
  precoCentavos: 150,
  estoque: 1,
  foto: null,
  ...campos,
})

const colecoes: Colecao[] = [
  { id: 1, nome: 'Copa 2026: figurinhas', ordem: 1 },
  { id: 2, nome: 'Colecionáveis', ordem: 2 },
]

describe('montarMensagem', () => {
  it('agrupa por Coleção, mostra quantidade e subtotal e fecha com o total estimado', () => {
    const resumo: Resumo = {
      linhas: [
        { item: item({ codigo: 'ARG 17', nome: 'Lionel Messi' }), quantidade: 1, subtotalCentavos: 150 },
        { item: item({ codigo: 'BRA 19', nome: 'Raphinha' }), quantidade: 2, subtotalCentavos: 300 },
        { item: item({ colecaoId: 2, nome: 'Álbum capa dura' }), quantidade: 1, subtotalCentavos: 4990 },
      ],
      quantidade: 4,
      totalCentavos: 5440,
    }

    expect(montarMensagem(resumo, colecoes)).toBe(
      [
        'Olá! Tenho interesse nestes itens:',
        '',
        '*Copa 2026: figurinhas*',
        '• ARG 17 Lionel Messi · R$ 1,50',
        '• BRA 19 Raphinha (2x) · R$ 3,00',
        '',
        '*Colecionáveis*',
        '• Álbum capa dura · R$ 49,90',
        '',
        'Total estimado: R$ 54,40 (4 itens)',
        'Sujeito a confirmação de disponibilidade. Frete e pagamento a combinar.',
      ].join('\n'),
    )
  })

  it('com um Item só, fala em "1 item"', () => {
    const resumo: Resumo = {
      linhas: [{ item: item({ nome: 'Envelope fechado' }), quantidade: 1, subtotalCentavos: 700 }],
      quantidade: 1,
      totalCentavos: 700,
    }

    expect(montarMensagem(resumo, colecoes)).toContain('Total estimado: R$ 7,00 (1 item)')
  })
})

describe('urlDoWhatsapp', () => {
  it('abre a conversa com o número da loja e a mensagem já escrita', () => {
    expect(urlDoWhatsapp('5511912345678', 'Olá! 2x')).toBe('https://wa.me/5511912345678?text=Ol%C3%A1!%202x')
  })

  it('codifica as quebras de linha e os símbolos da mensagem', () => {
    const url = new URL(urlDoWhatsapp('5511912345678', 'Total: R$ 1,50\n& mais'))

    expect(url.searchParams.get('text')).toBe('Total: R$ 1,50\n& mais')
  })
})

describe('formatarWhatsapp', () => {
  it.each([
    ['5511912345678', '+55 (11) 91234-5678'],
    ['551134567890', '+55 (11) 3456-7890'],
    // Número de fora do Brasil fica só com o "+" na frente.
    ['14155550123', '+14155550123'],
  ])('"%s" aparece como "%s"', (numero, esperado) => {
    expect(formatarWhatsapp(numero)).toBe(esperado)
  })
})

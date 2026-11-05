import { describe, expect, it } from 'vitest'
import { mensagemDoBanco } from './erros'

describe('mensagemDoBanco', () => {
  it.each([
    ['23505', 'Já existe uma Coleção com esse nome.'],
    ['23503', 'Essa Coleção ainda tem Itens. Mova ou apague os Itens antes.'],
    ['42501', 'Sem permissão. Saia e entre de novo com uma conta de administrador.'],
  ])('o erro %s do banco vira uma frase que o Vendedor entende', (code, frase) => {
    expect(mensagemDoBanco({ code, message: 'texto técnico do Postgres' })).toBe(frase)
  })

  it('erro desconhecido vira um pedido para tentar de novo, sem o texto técnico', () => {
    expect(mensagemDoBanco({ code: 'XX000', message: 'texto técnico do Postgres' })).toBe(
      'Não deu para salvar agora. Confira a internet e tente de novo.',
    )
  })
})

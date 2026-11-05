// Os erros do banco viram frases que o Vendedor entende. O texto técnico vai só para o console.

const frases: Record<string, string> = {
  // unique_violation: o único campo único que o Admin grava é o nome da Coleção.
  '23505': 'Já existe uma Coleção com esse nome.',
  // foreign_key_violation: apagar uma Coleção que ainda tem Itens ("on delete restrict").
  '23503': 'Essa Coleção ainda tem Itens. Mova ou apague os Itens antes.',
  // check_violation: Preço ou Estoque negativo, nome vazio.
  '23514': 'Algum valor está fora do permitido: o Preço e o Estoque não podem ser negativos.',
  // insufficient_privilege: a conta não está na tabela administradores.
  '42501': 'Sem permissão. Saia e entre de novo com uma conta de administrador.',
  // JWT expirado.
  PGRST301: 'A sessão expirou. Saia e entre de novo.',
}

export function mensagemDoBanco(erro: { code?: string; message?: string }): string {
  return (erro.code && frases[erro.code]) || 'Não deu para salvar agora. Confira a internet e tente de novo.'
}

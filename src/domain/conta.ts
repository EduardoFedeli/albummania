// A senha do Admin. TypeScript puro: sem React e sem rede (ADR-0004).

const TAMANHO_MINIMO = 8

/**
 * Confere a nova senha antes de mandá-la ao Supabase. Devolve o problema, ou null se estiver tudo certo.
 * A senha não é aparada: um espaço digitado de propósito faz parte dela.
 */
export function validarNovaSenha(senha: string, confirmacao: string): string | null {
  if (senha.length < TAMANHO_MINIMO) return `Use pelo menos ${TAMANHO_MINIMO} caracteres.`
  if (senha !== confirmacao) return 'As duas senhas não estão iguais.'
  return null
}

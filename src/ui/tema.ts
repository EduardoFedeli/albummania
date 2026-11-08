import { gravarNoNavegador } from '../infra/armazenamento'

/** O escuro é o padrão (design-system.md). O claro só vale para quem escolheu no botão. */
export type Tema = 'escuro' | 'claro'

/**
 * Chave no localStorage. O script do <head> (index.html e admin/index.html) lê a mesma chave
 * antes da primeira pintura: se mudar aqui, mude lá também.
 */
const CHAVE = 'tema'

/** Lê o tema que o script do <head> já aplicou no <html>. */
export function temaAtual(): Tema {
  return document.documentElement.dataset.tema === 'claro' ? 'claro' : 'escuro'
}

export function aplicarTema(tema: Tema): void {
  if (tema === 'claro') document.documentElement.dataset.tema = 'claro'
  else delete document.documentElement.dataset.tema
  gravarNoNavegador(CHAVE, tema)
}

// O localStorage pode não existir (aba anônima, cookies bloqueados) ou estar cheio.
// Nesses casos o site segue funcionando só com a memória: o Carrinho some ao fechar a aba.

export function lerDoNavegador(chave: string): string | null {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

export function gravarNoNavegador(chave: string, valor: string): void {
  try {
    localStorage.setItem(chave, valor)
  } catch {
    // Sem armazenamento: o Carrinho continua só na memória desta aba.
  }
}

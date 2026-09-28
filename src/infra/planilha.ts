// Fronteira com a planilha Google: baixa o CSV publicado de uma aba (ADR-0003).

// O navegador guarda o CSV do Google por 5 minutos (spike S1). Um parâmetro que
// muda a cada chamada força uma resposta nova. `agora` vem de fora para que a
// função seja pura e testável.
export function urlSemCache(url: string, agora: number): string {
  const endereco = new URL(url)
  endereco.searchParams.set('_', String(agora))
  return endereco.toString()
}

export async function buscarCsv(url: string): Promise<string> {
  const resposta = await fetch(urlSemCache(url, Date.now()))
  if (!resposta.ok) {
    throw new Error(`A planilha respondeu com status ${resposta.status}`)
  }
  return resposta.text()
}

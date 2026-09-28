// O Google deixa o CSV em cache no navegador por 5 min (spike S1); o parâmetro força uma resposta nova.
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

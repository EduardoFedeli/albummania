// Leitura do Catálogo pela API REST do Supabase (ADR-0005).
// A Vitrine usa fetch puro, sem a biblioteca do Supabase, para o JavaScript continuar pequeno.
import type { Catalogo, Colecao, Item, Loja } from '../domain/catalogo'

export interface Conexao {
  /** Ex.: https://abcdefgh.supabase.co */
  url: string
  /** A chave publicável (sb_publishable_…). Não é segredo: quem protege os dados é a RLS. */
  chave: string
}

/** Uma linha da tabela itens, com os nomes de coluna do banco. */
export interface LinhaDoItem {
  id: number
  colecao_id: number
  codigo: string | null
  nome: string
  equipe: string | null
  raridade: string | null
  preco_centavos: number
  estoque: number
  foto: string | null
}

type Buscar = (url: string, init: RequestInit) => Promise<Response>

const ITENS_POR_PAGINA = 1000

export function conexaoDoAmbiente(): Conexao {
  const url = import.meta.env.VITE_SUPABASE_URL
  const chave = import.meta.env.VITE_SUPABASE_CHAVE_PUBLICA
  if (!url || !chave) {
    throw new Error('Faltam VITE_SUPABASE_URL e VITE_SUPABASE_CHAVE_PUBLICA no .env (veja o .env.example)')
  }
  return { url: url.replace(/\/+$/, ''), chave }
}

export function urlDaFoto(urlDoProjeto: string, caminho: string): string {
  const partes = caminho.split('/').map(encodeURIComponent).join('/')
  return `${urlDoProjeto}/storage/v1/object/public/fotos/${partes}`
}

export function itemDaLinha(linha: LinhaDoItem, urlDoProjeto: string): Item {
  return {
    id: linha.id,
    colecaoId: linha.colecao_id,
    codigo: linha.codigo,
    nome: linha.nome,
    equipe: linha.equipe,
    raridade: linha.raridade,
    precoCentavos: linha.preco_centavos,
    estoque: linha.estoque,
    foto: linha.foto ? urlDaFoto(urlDoProjeto, linha.foto) : null,
  }
}

/** Junta todas as páginas: pede a próxima enquanto a anterior vier cheia. */
export async function lerEmPaginas<T>(
  lerPagina: (inicio: number, fim: number) => Promise<T[]>,
  tamanho = ITENS_POR_PAGINA,
): Promise<T[]> {
  const todas: T[] = []
  for (let inicio = 0; ; inicio += tamanho) {
    const pagina = await lerPagina(inicio, inicio + tamanho - 1)
    todas.push(...pagina)
    if (pagina.length < tamanho) return todas
  }
}

export async function buscarCatalogo(
  conexao: Conexao = conexaoDoAmbiente(),
  buscar: Buscar = (url, init) => fetch(url, init),
): Promise<Catalogo> {
  const ler = async <T>(caminho: string): Promise<T[]> => {
    const resposta = await buscar(`${conexao.url}/rest/v1/${caminho}`, { headers: { apikey: conexao.chave } })
    if (!resposta.ok) throw new Error(`O banco respondeu com status ${resposta.status}`)
    return (await resposta.json()) as T[]
  }

  const colunas = 'id,colecao_id,codigo,nome,equipe,raridade,preco_centavos,estoque,foto'
  const [colecoes, linhas, lojas] = await Promise.all([
    ler<Colecao>('colecoes?select=id,nome,ordem'),
    // O Catálogo são só os Itens com Estoque > 0 (CONTEXT.md). A ordem por id deixa as páginas estáveis.
    lerEmPaginas((inicio) =>
      ler<LinhaDoItem>(`itens?select=${colunas}&estoque=gt.0&order=id&limit=${ITENS_POR_PAGINA}&offset=${inicio}`),
    ),
    ler<Loja>('loja?select=nome,whatsapp&limit=1'),
  ])

  return {
    loja: lojas[0] ?? { nome: 'GuGiu Cards', whatsapp: '' },
    colecoes,
    itens: linhas.map((linha) => itemDaLinha(linha, conexao.url)),
  }
}

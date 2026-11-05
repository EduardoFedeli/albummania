// O Admin fala com o Supabase pela biblioteca oficial: login, gravações e Fotos (ADR-0005).
// Só a página do Admin importa este arquivo, então a Vitrine nunca carrega a biblioteca.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ItemParaSalvar } from '../domain/cadastro'
import type { Colecao, Item, Loja } from '../domain/catalogo'
import { mensagemDoBanco } from './erros'
import { conexaoDoAmbiente, itemDaLinha, lerEmPaginas, type LinhaDoItem } from './supabase'

/** No Admin, o Item guarda também o caminho da Foto no Storage, para poder trocá-la ou apagá-la. */
export interface ItemDoAdmin extends Item {
  caminhoDaFoto: string | null
}

export interface DadosDoAdmin {
  loja: Loja
  colecoes: Colecao[]
  /** Todos os Itens, inclusive os de Estoque zero (a Vitrine só recebe os que têm Estoque). */
  itens: ItemDoAdmin[]
}

const COLUNAS = 'id,colecao_id,codigo,nome,equipe,raridade,preco_centavos,estoque,foto'

let cliente: SupabaseClient | null = null
function supabase(): SupabaseClient {
  if (!cliente) {
    const { url, chave } = conexaoDoAmbiente()
    cliente = createClient(url, chave)
  }
  return cliente
}

function falhar(erro: { code?: string; message?: string }): never {
  console.error('Erro do Supabase:', erro)
  throw new Error(mensagemDoBanco(erro))
}

/**
 * Um UPDATE ou DELETE barrado pela RLS não dá erro: ele só altera zero linhas.
 * Por isso cada gravação pede de volta as linhas alteradas e reclama quando não vem nenhuma.
 * Sem isso, uma Baixa "daria certo" na tela sem mudar nada no banco.
 */
function conferirAlteracao(resposta: { data: unknown[] | null; error: { code?: string; message?: string } | null }) {
  if (resposta.error) falhar(resposta.error)
  if (!resposta.data || resposta.data.length === 0) {
    console.error('A gravação não alterou nenhuma linha (RLS ou linha que não existe mais).')
    throw new Error('Nada foi salvo. Recarregue a página e tente de novo; se continuar, saia e entre de novo.')
  }
}

const doItem = (linha: LinhaDoItem): ItemDoAdmin => ({
  ...itemDaLinha(linha, conexaoDoAmbiente().url),
  caminhoDaFoto: linha.foto,
})

const paraLinha = (item: ItemParaSalvar, foto: string | null) => ({
  colecao_id: item.colecaoId,
  codigo: item.codigo,
  nome: item.nome,
  equipe: item.equipe,
  raridade: item.raridade,
  preco_centavos: item.precoCentavos,
  estoque: item.estoque,
  foto,
})

// ─── Sessão ──────────────────────────────────────────────────────────────

/**
 * Avisa quando alguém entra ou sai. O Supabase dispara também INITIAL_SESSION ao assinar,
 * então isso cobre a primeira visita. O callback não pode chamar o Supabase direto
 * (a biblioteca está segurando a sessão nesse momento), por isso o setTimeout.
 */
export function aoMudarSessao(avisar: (logado: boolean) => void): () => void {
  const { data } = supabase().auth.onAuthStateChange((evento, sessao) => {
    if (evento === 'TOKEN_REFRESHED' || evento === 'USER_UPDATED') return
    setTimeout(() => avisar(sessao !== null), 0)
  })
  return () => data.subscription.unsubscribe()
}

export async function entrar(email: string, senha: string): Promise<void> {
  const { error } = await supabase().auth.signInWithPassword({ email: email.trim(), password: senha })
  if (!error) return
  console.error('Erro ao entrar:', error)
  throw new Error(
    error.code === 'invalid_credentials' || error.message === 'Invalid login credentials'
      ? 'E-mail ou senha incorretos.'
      : 'Não deu para entrar agora. Confira a internet e tente de novo.',
  )
}

export async function sair(): Promise<void> {
  await supabase().auth.signOut()
}

export async function ehAdministrador(): Promise<boolean> {
  const { data, error } = await supabase().rpc('eh_administrador')
  if (error) falhar(error)
  return data === true
}

// ─── Leitura ─────────────────────────────────────────────────────────────

export async function buscarTudo(): Promise<DadosDoAdmin> {
  const banco = supabase()
  const [colecoes, linhas, loja] = await Promise.all([
    banco
      .from('colecoes')
      .select('id,nome,ordem')
      .then(({ data, error }) => (error ? falhar(error) : (data as Colecao[]))),
    lerEmPaginas(async (inicio, fim) => {
      const { data, error } = await banco.from('itens').select(COLUNAS).order('id').range(inicio, fim)
      if (error) falhar(error)
      return data as LinhaDoItem[]
    }),
    banco
      .from('loja')
      .select('nome,whatsapp')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => (error ? falhar(error) : (data as Loja))),
  ])
  return { loja, colecoes, itens: linhas.map(doItem) }
}

// ─── Itens ───────────────────────────────────────────────────────────────

export async function criarItem(item: ItemParaSalvar, foto: string | null): Promise<ItemDoAdmin> {
  const { data, error } = await supabase().from('itens').insert(paraLinha(item, foto)).select(COLUNAS).single()
  if (error) falhar(error)
  return doItem(data as LinhaDoItem)
}

export async function atualizarItem(id: number, item: ItemParaSalvar, foto: string | null): Promise<ItemDoAdmin> {
  const { data, error } = await supabase()
    .from('itens')
    .update(paraLinha(item, foto))
    .eq('id', id)
    .select(COLUNAS)
    .single()
  if (error) falhar(error)
  return doItem(data as LinhaDoItem)
}

export async function mudarEstoque(id: number, estoque: number): Promise<void> {
  conferirAlteracao(await supabase().from('itens').update({ estoque }).eq('id', id).select('id'))
}

export async function apagarItem(item: ItemDoAdmin): Promise<void> {
  conferirAlteracao(await supabase().from('itens').delete().eq('id', item.id).select('id'))
  if (item.caminhoDaFoto) await apagarFoto(item.caminhoDaFoto)
}

// ─── Fotos ───────────────────────────────────────────────────────────────

/** Envia a Foto já comprimida e devolve o caminho dela no bucket. */
export async function enviarFoto(foto: Blob): Promise<string> {
  const caminho = `${crypto.randomUUID()}.${foto.type === 'image/webp' ? 'webp' : 'jpg'}`
  // O nome é único, então o conteúdo de um endereço nunca muda: o navegador pode guardar por 1 ano.
  const { error } = await supabase()
    .storage.from('fotos')
    .upload(caminho, foto, { contentType: foto.type, cacheControl: '31536000' })
  if (error) {
    console.error('Erro ao enviar a Foto:', error)
    throw new Error('Não deu para enviar a foto. Confira a internet e tente de novo.')
  }
  return caminho
}

/** Apagar a Foto antiga é faxina: se falhar, o Item continua certo, então só registra no console. */
export async function apagarFoto(caminho: string): Promise<void> {
  const { error } = await supabase().storage.from('fotos').remove([caminho])
  if (error) console.error('A Foto antiga não foi apagada:', caminho, error)
}

// ─── Coleções e Loja ─────────────────────────────────────────────────────

export async function criarColecao(nome: string, ordem: number): Promise<Colecao> {
  const { data, error } = await supabase().from('colecoes').insert({ nome, ordem }).select('id,nome,ordem').single()
  if (error) falhar(error)
  return data as Colecao
}

export async function renomearColecao(id: number, nome: string): Promise<void> {
  conferirAlteracao(await supabase().from('colecoes').update({ nome }).eq('id', id).select('id'))
}

export async function salvarOrdem(colecoes: Colecao[]): Promise<void> {
  const respostas = await Promise.all(
    colecoes.map((c) => supabase().from('colecoes').update({ ordem: c.ordem }).eq('id', c.id).select('id')),
  )
  respostas.forEach(conferirAlteracao)
}

export async function apagarColecao(id: number): Promise<void> {
  conferirAlteracao(await supabase().from('colecoes').delete().eq('id', id).select('id'))
}

export async function salvarLoja(loja: Loja): Promise<void> {
  conferirAlteracao(await supabase().from('loja').update(loja).eq('id', 1).select('id'))
}

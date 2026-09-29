// PROTÓTIPO descartável (Fase 5): leitura rápida e sem validação. A leitura de verdade vem na Fase 6.
import { useEffect, useState } from 'react'
import { SECOES, type Secao } from '../data/secoes'
import { buscarCsv } from '../infra/planilha'

export interface FigurinhaP {
  codigo: string
  secao: string
  numero: number
  nome: string
  tipo: string
  estoque: number
}

export interface SecaoComFigurinhas extends Secao {
  figurinhas: FigurinhaP[]
}

const colunas = (linha: string) =>
  linha.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim())

function lerCatalogo(csv: string): FigurinhaP[] {
  return csv
    .split(/\r?\n/)
    .slice(1)
    .map(colunas)
    .filter((c) => c[1])
    .map(([, codigo, nome, tipo, estoque]) => {
      const [sigla, numero] = codigo === '00' ? ['00', '0'] : codigo.split(' ')
      return { codigo, secao: sigla, numero: Number(numero), nome, tipo, estoque: Number(estoque) || 0 }
    })
}

function lerConfig(csv: string) {
  const precos: Record<string, number> = {}
  let nomeLoja = 'Figurinhas'
  let whatsapp = ''
  for (const [chave, valor] of csv.split(/\r?\n/).map(colunas)) {
    if (chave?.startsWith('Preço ')) precos[chave.slice(6)] = Number(valor.replace(',', '.'))
    if (chave === 'Nome da loja' && valor) nomeLoja = valor
    if (chave === 'WhatsApp' && valor) whatsapp = valor.replace(/\D/g, '')
  }
  return { precos, nomeLoja, whatsapp }
}

export interface DadosP {
  secoes: SecaoComFigurinhas[]
  precos: Record<string, number>
  nomeLoja: string
  whatsapp: string
}

export function useDadosPrototipo(): DadosP | null {
  const [dados, setDados] = useState<DadosP | null>(null)
  useEffect(() => {
    Promise.all([
      buscarCsv(import.meta.env.VITE_CSV_CATALOGO_URL),
      buscarCsv(import.meta.env.VITE_CSV_CONFIG_URL),
    ]).then(([catalogo, config]) => {
      const figurinhas = lerCatalogo(catalogo)
      setDados({
        ...lerConfig(config),
        secoes: SECOES.map((s) => ({ ...s, figurinhas: figurinhas.filter((f) => f.secao === s.sigla) })),
      })
    })
  }, [])
  return dados
}

export function useCarrinhoP(precos: Record<string, number> | undefined) {
  const [itens, setItens] = useState<Map<string, { f: FigurinhaP; qtd: number }>>(new Map())
  const alterar = (f: FigurinhaP, delta: number) =>
    setItens((atual) => {
      const novo = new Map(atual)
      const qtd = Math.min(f.estoque, Math.max(0, (atual.get(f.codigo)?.qtd ?? 0) + delta))
      if (qtd === 0) novo.delete(f.codigo)
      else novo.set(f.codigo, { f, qtd })
      return novo
    })
  const lista = [...itens.values()]
  return {
    lista,
    qtdDe: (codigo: string) => itens.get(codigo)?.qtd ?? 0,
    alterar,
    limpar: () => setItens(new Map()),
    total: lista.reduce((soma, { f, qtd }) => soma + qtd * (precos?.[f.tipo] ?? 0), 0),
    unidades: lista.reduce((soma, { qtd }) => soma + qtd, 0),
  }
}

export const reais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function interpretar(texto: string): string[] {
  const codigos: string[] = []
  let sigla = ''
  for (const token of texto.toUpperCase().match(/[A-Z]{3}|\d{1,2}/g) ?? []) {
    if (/^[A-Z]{3}$/.test(token)) sigla = token
    else if (token === '00') codigos.push('00')
    else if (sigla) codigos.push(`${sigla} ${Number(token)}`)
  }
  return [...new Set(codigos)]
}

export function montarMensagem(lista: { f: FigurinhaP; qtd: number }[], secoes: Secao[], total: number): string {
  const ordem = new Map(secoes.map((s, i) => [s.sigla, i]))
  const ordenada = [...lista].sort(
    (a, b) => ordem.get(a.f.secao)! - ordem.get(b.f.secao)! || a.f.numero - b.f.numero,
  )
  const porSecao = new Map<string, string[]>()
  for (const { f, qtd } of ordenada) {
    const rotulo = `${f.codigo === '00' ? '00' : f.numero}${qtd > 1 ? ` (${qtd}x)` : ''}`
    porSecao.set(f.secao, [...(porSecao.get(f.secao) ?? []), rotulo])
  }
  const unidades = lista.reduce((soma, { qtd }) => soma + qtd, 0)
  return [
    'Olá! Tenho interesse nestas figurinhas (Copa 2026):',
    '',
    ...[...porSecao].map(([sigla, numeros]) => (sigla === '00' ? numeros.join(', ') : `${sigla}: ${numeros.join(', ')}`)),
    '',
    `Total: ${unidades} ${unidades === 1 ? 'figurinha' : 'figurinhas'}, ${reais(total)} estimado`,
    'Sujeito a confirmação de disponibilidade.',
  ].join('\n')
}

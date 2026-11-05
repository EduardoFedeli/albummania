import { useMemo, useState, type FormEvent } from 'react'
import { moverColecao } from '../domain/cadastro'
import { ordenarColecoes, type Colecao } from '../domain/catalogo'
import {
  apagarColecao,
  criarColecao,
  renomearColecao,
  salvarOrdem,
  type DadosDoAdmin,
} from '../infra/admin'
import { Campo } from './Campo'

interface Props {
  dados: DadosDoAdmin
  atualizar: (mudar: (atuais: DadosDoAdmin) => DadosDoAdmin) => void
}

export function AbaColecoes({ dados, atualizar }: Props) {
  const ordenadas = ordenarColecoes(dados.colecoes)
  const totais = useMemo(() => {
    const total = new Map<number, number>()
    for (const item of dados.itens) total.set(item.colecaoId, (total.get(item.colecaoId) ?? 0) + 1)
    return total
  }, [dados.itens])

  const [nova, setNova] = useState('')
  const [nomes, setNomes] = useState<Record<number, string>>({})
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState('')

  /** Roda uma gravação travando os botões e mostrando o erro, se houver. */
  const gravar = async (acao: () => Promise<void>) => {
    setErro('')
    setOcupado(true)
    try {
      await acao()
    } catch (falha) {
      setErro((falha as Error).message)
    } finally {
      setOcupado(false)
    }
  }

  const criar = (evento: FormEvent) => {
    evento.preventDefault()
    const nome = nova.trim()
    if (!nome) return
    void gravar(async () => {
      const criada = await criarColecao(nome, ordenadas.length + 1)
      atualizar((atuais) => ({ ...atuais, colecoes: [...atuais.colecoes, criada] }))
      setNova('')
    })
  }

  const renomear = (colecao: Colecao) => {
    const nome = (nomes[colecao.id] ?? colecao.nome).trim()
    if (!nome || nome === colecao.nome) return
    void gravar(async () => {
      await renomearColecao(colecao.id, nome)
      atualizar((atuais) => ({
        ...atuais,
        colecoes: atuais.colecoes.map((c) => (c.id === colecao.id ? { ...c, nome } : c)),
      }))
      setNomes((atuais) => {
        const resto = { ...atuais }
        delete resto[colecao.id]
        return resto
      })
    })
  }

  const mover = (colecao: Colecao, direcao: -1 | 1) =>
    void gravar(async () => {
      const novaOrdem = moverColecao(ordenadas, colecao.id, direcao)
      // Só grava as Coleções que mudaram de número.
      const mudaram = novaOrdem.filter((c) => ordenadas.find((o) => o.id === c.id)?.ordem !== c.ordem)
      await salvarOrdem(mudaram)
      atualizar((atuais) => ({ ...atuais, colecoes: novaOrdem }))
    })

  const apagar = (colecao: Colecao) => {
    if (!window.confirm(`Apagar a Coleção "${colecao.nome}"?`)) return
    void gravar(async () => {
      await apagarColecao(colecao.id)
      atualizar((atuais) => ({ ...atuais, colecoes: atuais.colecoes.filter((c) => c.id !== colecao.id) }))
    })
  }

  return (
    <>
      <form className="ad-cartao ad-nova-colecao" onSubmit={criar}>
        <Campo rotulo="Nova Coleção" dica='Ex.: "Match Attax 26/27" ou "Colecionáveis"'>
          {(controle) => <input {...controle} value={nova} onChange={(e) => setNova(e.target.value)} />}
        </Campo>
        <button className="ad-botao ad-botao-principal" disabled={ocupado || !nova.trim()}>
          Criar
        </button>
      </form>

      {erro && (
        <p className="ad-erro" role="alert">
          {erro}
        </p>
      )}

      {ordenadas.length > 0 && (
        <p className="ad-dica">
          A ordem desta lista é a ordem dos botões de Coleção na loja. Só dá para apagar uma Coleção sem Itens.
        </p>
      )}

      <ol className="ad-colecoes">
        {ordenadas.map((colecao, indice) => {
          const nome = nomes[colecao.id] ?? colecao.nome
          const total = totais.get(colecao.id) ?? 0
          return (
            <li key={colecao.id} className="ad-colecao">
              <div className="ad-colecao-ordem">
                <button
                  className="ad-passo"
                  aria-label={`Subir ${colecao.nome}`}
                  disabled={ocupado || indice === 0}
                  onClick={() => mover(colecao, -1)}
                >
                  ↑
                </button>
                <button
                  className="ad-passo"
                  aria-label={`Descer ${colecao.nome}`}
                  disabled={ocupado || indice === ordenadas.length - 1}
                  onClick={() => mover(colecao, 1)}
                >
                  ↓
                </button>
              </div>
              <div className="ad-colecao-nome">
                <label className="so-leitor" htmlFor={`ad-colecao-${colecao.id}`}>
                  Nome da Coleção
                </label>
                <input
                  id={`ad-colecao-${colecao.id}`}
                  value={nome}
                  onChange={(e) => setNomes((atuais) => ({ ...atuais, [colecao.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') renomear(colecao)
                  }}
                />
                <p className="ad-colecao-total">{total === 1 ? '1 item' : `${total} itens`}</p>
              </div>
              <div className="ad-colecao-acoes">
                {nome.trim() !== colecao.nome && (
                  <button className="ad-botao" disabled={ocupado} onClick={() => renomear(colecao)}>
                    Salvar nome
                  </button>
                )}
                <button
                  className="ad-botao ad-botao-perigo"
                  disabled={ocupado || total > 0}
                  title={total > 0 ? 'Só dá para apagar uma Coleção sem Itens' : undefined}
                  onClick={() => apagar(colecao)}
                >
                  Apagar
                </button>
              </div>
            </li>
          )
        })}
      </ol>
    </>
  )
}

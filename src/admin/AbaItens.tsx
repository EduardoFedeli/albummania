import { useMemo, useState } from 'react'
import { combinaComBusca } from '../domain/busca'
import { formatarPreco, ordenarColecoes, ordenarItens } from '../domain/catalogo'
import { mudarEstoque, type DadosDoAdmin, type ItemDoAdmin } from '../infra/admin'
import { numeral } from '../ui/numeral'
import { FormularioDoItem } from './FormularioDoItem'

const POR_VEZ = 60

interface Props {
  dados: DadosDoAdmin
  atualizar: (mudar: (atuais: DadosDoAdmin) => DadosDoAdmin) => void
  irParaColecoes: () => void
}

export function AbaItens({ dados, atualizar, irParaColecoes }: Props) {
  const [termo, setTermo] = useState('')
  const [colecaoId, setColecaoId] = useState<number | null>(null)
  const [quantos, setQuantos] = useState(POR_VEZ)
  const [editando, setEditando] = useState<ItemDoAdmin | 'novo' | null>(null)
  const [gravando, setGravando] = useState<ReadonlySet<number>>(new Set())
  const [erro, setErro] = useState('')

  const nomeDaColecao = useMemo(() => new Map(dados.colecoes.map((c) => [c.id, c.nome])), [dados.colecoes])
  const ordenados = useMemo(() => ordenarItens(dados.itens, dados.colecoes), [dados.itens, dados.colecoes])
  const visiveis = ordenados.filter(
    (item) => (colecaoId === null || item.colecaoId === colecaoId) && combinaComBusca(item, termo),
  )
  const comEstoque = dados.itens.filter((item) => item.estoque > 0).length

  /** Põe o Item salvo na lista: troca o antigo ou acrescenta o novo. */
  const guardar = (salvo: ItemDoAdmin) =>
    atualizar((atuais) => ({
      ...atuais,
      itens: atuais.itens.some((i) => i.id === salvo.id)
        ? atuais.itens.map((i) => (i.id === salvo.id ? salvo : i))
        : [...atuais.itens, salvo],
    }))

  /** Baixa rápida: − e + gravam na hora. Os botões do Item ficam travados até o banco confirmar. */
  const mudar = async (item: ItemDoAdmin, passo: 1 | -1) => {
    const estoque = item.estoque + passo
    if (estoque < 0) return
    setErro('')
    setGravando((ids) => new Set(ids).add(item.id))
    try {
      await mudarEstoque(item.id, estoque)
      guardar({ ...item, estoque })
    } catch (falha) {
      setErro(`${item.nome}: ${(falha as Error).message}`)
    } finally {
      setGravando((ids) => {
        const restantes = new Set(ids)
        restantes.delete(item.id)
        return restantes
      })
    }
  }

  if (dados.colecoes.length === 0) {
    return (
      <div className="adm-cartao adm-vazio">
        <p>Para cadastrar Itens, crie primeiro uma Coleção, como "Match Attax 26/27" ou "Colecionáveis".</p>
        <button className="adm-botao adm-botao-principal" onClick={irParaColecoes}>
          Criar a primeira Coleção
        </button>
      </div>
    )
  }

  const total = dados.itens.length

  return (
    <>
      <div className="adm-barra">
        <label className="adm-busca">
          <span className="so-leitor">Buscar Item</span>
          <input
            type="search"
            placeholder="Nome, número ou time"
            value={termo}
            onChange={(e) => {
              setTermo(e.target.value)
              setQuantos(POR_VEZ)
            }}
          />
        </label>
        <label className="adm-filtro">
          <span className="so-leitor">Coleção</span>
          <select
            value={colecaoId ?? ''}
            onChange={(e) => {
              setColecaoId(e.target.value ? Number(e.target.value) : null)
              setQuantos(POR_VEZ)
            }}
          >
            <option value="">Todas as Coleções</option>
            {ordenarColecoes(dados.colecoes).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <button className="adm-botao adm-botao-principal" onClick={() => setEditando('novo')}>
          + Novo item
        </button>
      </div>

      <p className="adm-contagem" role="status">
        {visiveis.length === total
          ? `${total} ${total === 1 ? 'item cadastrado' : 'itens cadastrados'}, ${comEstoque} com Estoque`
          : `Mostrando ${visiveis.length} de ${total} itens`}
      </p>

      {erro && (
        <p className="adm-erro" role="alert">
          {erro}
        </p>
      )}

      {visiveis.length === 0 ? (
        <p className="adm-cartao adm-vazio">
          {total === 0 ? 'Nenhum item cadastrado ainda. Comece pelo "+ Novo item".' : 'Nenhum item encontrado.'}
        </p>
      ) : (
        <ul className="adm-lista">
          {visiveis.slice(0, quantos).map((item) => {
            const ocupado = gravando.has(item.id)
            return (
              <li key={item.id} className="adm-item" data-esgotado={item.estoque === 0 || undefined}>
                <div className="adm-item-foto">
                  {item.foto ? (
                    <img src={item.foto} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span aria-hidden="true">{numeral(item)}</span>
                  )}
                </div>
                <div className="adm-item-dados">
                  <p className="adm-item-detalhe">
                    {[item.codigo, nomeDaColecao.get(item.colecaoId)].filter(Boolean).join(' · ')}
                  </p>
                  <p className="adm-item-nome">{item.nome}</p>
                  <p className="adm-item-preco">
                    {formatarPreco(item.precoCentavos)}
                    {item.estoque === 0 && <span className="adm-selo">Esgotado</span>}
                  </p>
                </div>
                <div className="adm-estoque" role="group" aria-label={`Estoque de ${item.nome}`} aria-busy={ocupado}>
                  <button
                    className="adm-passo"
                    aria-label={`Tirar 1 de ${item.nome}`}
                    disabled={ocupado || item.estoque === 0}
                    onClick={() => void mudar(item, -1)}
                  >
                    −
                  </button>
                  <output className="adm-estoque-valor">{item.estoque}</output>
                  <button
                    className="adm-passo"
                    aria-label={`Pôr mais 1 de ${item.nome}`}
                    disabled={ocupado}
                    onClick={() => void mudar(item, 1)}
                  >
                    +
                  </button>
                </div>
                <button className="adm-botao adm-botao-leve adm-editar" onClick={() => setEditando(item)}>
                  Editar
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {visiveis.length > quantos && (
        <button className="adm-botao adm-mais" onClick={() => setQuantos((n) => n + POR_VEZ)}>
          Mostrar mais ({visiveis.length - quantos} restantes)
        </button>
      )}

      {editando && (
        <FormularioDoItem
          item={editando === 'novo' ? null : editando}
          dados={dados}
          colecaoInicial={colecaoId}
          aoSalvar={(salvo, continuar) => {
            guardar(salvo)
            if (!continuar) setEditando(null)
          }}
          aoApagar={(id) => {
            atualizar((atuais) => ({ ...atuais, itens: atuais.itens.filter((i) => i.id !== id) }))
            setEditando(null)
          }}
          aoFechar={() => setEditando(null)}
        />
      )}
    </>
  )
}

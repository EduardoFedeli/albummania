import { useEffect, useMemo, useState } from 'react'
import { combinaComBusca } from '../domain/busca'
import { quantidadeNoCarrinho, resumir } from '../domain/carrinho'
import { ordenarColecoes, ordenarItens, type Catalogo } from '../domain/catalogo'
import { formatarWhatsapp } from '../domain/pedido'
import { BarraDoPedido } from './BarraDoPedido'
import { BotaoDoTema } from './BotaoDoTema'
import { CartaoDoItem } from './CartaoDoItem'
import { PainelDoPedido } from './PainelDoPedido'
import { useCarrinho } from './useCarrinho'

/** Quantos Itens aparecem de cada vez. O resto vem no "Mostrar mais". */
const POR_VEZ = 48

const contarItens = (n: number) => (n === 1 ? '1 item' : `${n} itens`)

export function Vitrine({ catalogo }: { catalogo: Catalogo }) {
  const { loja, colecoes } = catalogo
  const [colecaoId, setColecaoId] = useState<number | null>(null)
  const [termo, setTermo] = useState('')
  const [quantos, setQuantos] = useState(POR_VEZ)
  const [painelAberto, setPainelAberto] = useState(false)
  const pedido = useCarrinho(catalogo.itens)
  const resumo = useMemo(
    () => resumir(pedido.carrinho, catalogo.itens, colecoes),
    [pedido.carrinho, catalogo.itens, colecoes],
  )

  useEffect(() => {
    document.title = loja.nome
  }, [loja.nome])

  const ordenados = useMemo(() => ordenarItens(catalogo.itens, colecoes), [catalogo.itens, colecoes])

  const totalPorColecao = useMemo(() => {
    const total = new Map<number, number>()
    for (const item of catalogo.itens) total.set(item.colecaoId, (total.get(item.colecaoId) ?? 0) + 1)
    return total
  }, [catalogo.itens])

  // Coleção sem nenhum Item à venda não vira botão.
  const comItens = useMemo(
    () => ordenarColecoes(colecoes).filter((c) => totalPorColecao.has(c.id)),
    [colecoes, totalPorColecao],
  )

  const visiveis = ordenados.filter(
    (item) => (colecaoId === null || item.colecaoId === colecaoId) && combinaComBusca(item, termo),
  )

  const escolherColecao = (id: number | null) => {
    setColecaoId(id)
    setQuantos(POR_VEZ)
  }

  const limpar = () => {
    setTermo('')
    escolherColecao(null)
  }

  const total = ordenados.length

  return (
    <>
      <main className="vt-pagina">
        <header className="vt-topo">
          <div className="vt-topo-linha">
            <p className="vt-sobretitulo">Figurinhas · Cards · Colecionáveis</p>
            <BotaoDoTema className="vt-tema" soIcone />
          </div>
          <h1 className="vt-marca">{loja.nome}</h1>
          <p className="vt-chamada">Itens avulsos para completar a sua coleção, com foto, preço e estoque.</p>

          <label className="vt-busca">
            <span className="so-leitor">Buscar no catálogo</span>
            <input
              type="search"
              placeholder="Nome, número, time ou seleção"
              value={termo}
              onChange={(e) => {
                setTermo(e.target.value)
                setQuantos(POR_VEZ)
              }}
            />
          </label>
        </header>

        {pedido.aviso && (
          <div className="vt-aviso-pedido" role="status">
            <p>{pedido.aviso}</p>
            <button className="vt-botao" onClick={pedido.fecharAviso}>
              Entendi
            </button>
          </div>
        )}

        {comItens.length > 1 && (
          <nav className="vt-colecoes" aria-label="Coleções">
            <button className="vt-colecao" aria-pressed={colecaoId === null} onClick={() => escolherColecao(null)}>
              Todas <span className="vt-colecao-total">{total}</span>
            </button>
            {comItens.map((c) => (
              <button
                key={c.id}
                className="vt-colecao"
                aria-pressed={colecaoId === c.id}
                onClick={() => escolherColecao(c.id)}
              >
                {c.nome} <span className="vt-colecao-total">{totalPorColecao.get(c.id)}</span>
              </button>
            ))}
          </nav>
        )}

        <section aria-labelledby="vt-catalogo-titulo">
          <h2 id="vt-catalogo-titulo" className="so-leitor">
            Catálogo
          </h2>
          <p className="vt-contagem" role="status">
            {visiveis.length === total ? `${contarItens(total)} à venda` : `${visiveis.length} de ${contarItens(total)}`}
          </p>

          {total === 0 ? (
            <div className="vt-aviso">
              <p>Ainda não há itens à venda. Volte em breve!</p>
            </div>
          ) : visiveis.length === 0 ? (
            <div className="vt-aviso">
              <p>Nenhum item encontrado{termo.trim() && ` para “${termo.trim()}”`}.</p>
              <button className="vt-botao" onClick={limpar}>
                Limpar a busca
              </button>
            </div>
          ) : (
            <>
              <ul className="vt-grade">
                {visiveis.slice(0, quantos).map((item) => (
                  <CartaoDoItem
                    key={item.id}
                    item={item}
                    quantidade={quantidadeNoCarrinho(pedido.carrinho, item.id)}
                    aoAdicionar={() => pedido.adicionar(item)}
                    aoDiminuir={() => pedido.diminuir(item.id)}
                  />
                ))}
              </ul>
              {visiveis.length > quantos && (
                <button className="vt-botao vt-mais" onClick={() => setQuantos((n) => n + POR_VEZ)}>
                  Mostrar mais ({visiveis.length - quantos} restantes)
                </button>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="vt-rodape" data-com-barra={resumo.quantidade > 0 || undefined}>
        {loja.whatsapp && (
          <p className="vt-rodape-contato">
            Atendimento pelo WhatsApp:{' '}
            <a href={`https://wa.me/${loja.whatsapp}`} target="_blank" rel="noopener noreferrer">
              {formatarWhatsapp(loja.whatsapp)}
            </a>
          </p>
        )}
        <p>
          Loja independente, sem vínculo com Panini, Topps ou FIFA. As marcas citadas pertencem aos seus donos.
        </p>
      </footer>

      <BarraDoPedido resumo={resumo} aoAbrir={() => setPainelAberto(true)} />

      {painelAberto && (
        <PainelDoPedido
          resumo={resumo}
          colecoes={colecoes}
          loja={loja}
          aoAdicionar={pedido.adicionar}
          aoDiminuir={pedido.diminuir}
          aoLimpar={pedido.limpar}
          aoFechar={() => setPainelAberto(false)}
        />
      )}
    </>
  )
}

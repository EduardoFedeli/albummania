// PROTÓTIPO · Variante D (direção escolhida): abertura da C, páginas da B, esgotadas apagadas como na A.
import { useMemo, useRef, useState } from 'react'
import '../styles/tokens.css'
import './varianteD.css'
import { urlDaBandeira } from '../ui/bandeiras'
import { interpretar, montarMensagem, reais, useCarrinhoP, type DadosP, type FigurinhaP } from './dados'

export const nomeD = 'Direção escolhida: C + B + A'

const listaDeNomes = (nomes: string[]) =>
  nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes.at(-1)}` : nomes[0]

export function VarianteD({ secoes, precos, nomeLoja, whatsapp }: DadosP) {
  const carrinho = useCarrinhoP(precos)
  const [texto, setTexto] = useState('BRA 2, 3, 11, 17\nARG 22\nFWC 4\nESP 10, 15')
  const [procurado, setProcurado] = useState(texto)
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set())
  const [enviado, setEnviado] = useState(false)
  const [copiada, setCopiada] = useState(false)
  const painel = useRef<HTMLDialogElement>(null)
  const inicioDasPaginas = useRef<HTMLDivElement>(null)

  const porCodigo = useMemo(
    () => new Map(secoes.flatMap((s) => s.figurinhas).map((f) => [f.codigo, f])),
    [secoes],
  )
  const secaoDe = useMemo(() => new Map(secoes.map((s) => [s.sigla, s])), [secoes])
  const posicaoNoAlbum = useMemo(() => new Map(secoes.map((s, i) => [s.sigla, i])), [secoes])
  const codigos = interpretar(procurado)
  const achadas = codigos.map((c) => porCodigo.get(c)).filter((f): f is FigurinhaP => !!f)
  const disponiveis = achadas.filter((f) => f.estoque > 0)
  const inexistentes = codigos.filter((c) => !porCodigo.has(c))
  const visiveis = selecionadas.size ? secoes.filter((s) => selecionadas.has(s.sigla)) : secoes

  const grupos = [
    { titulo: 'Especiais', secoes: secoes.filter((s) => !s.grupo) },
    ...[...new Set(secoes.map((s) => s.grupo).filter(Boolean))].map((g) => ({
      titulo: `Grupo ${g}`,
      secoes: secoes.filter((s) => s.grupo === g),
    })),
  ]

  const mensagem = montarMensagem(carrinho.lista, secoes, carrinho.total)
  const numeroDe = (f: FigurinhaP) => (f.codigo === '00' ? '00' : String(f.numero))
  const preco = (f: FigurinhaP) => reais(precos[f.tipo] ?? 0)

  const bandeira = (codigo: string | undefined, classe: string) =>
    codigo && <img className={classe} src={urlDaBandeira(codigo)} alt="" loading="lazy" />

  const alternarSelecao = (sigla: string) => {
    setSelecionadas((atual) => {
      const nova = new Set(atual)
      if (nova.has(sigla)) nova.delete(sigla)
      else nova.add(sigla)
      return nova
    })
    inicioDasPaginas.current?.scrollIntoView({ block: 'start' })
  }

  const passo = (f: FigurinhaP, qtd: number) => (
    <div className="vd-passo">
      <button onClick={() => carrinho.alterar(f, -1)} aria-label={`Tirar uma ${f.codigo}`}>−</button>
      <output aria-live="polite">{qtd}</output>
      <button
        onClick={() => carrinho.alterar(f, 1)}
        disabled={qtd >= f.estoque}
        aria-label={`Mais uma ${f.codigo}`}
      >
        +
      </button>
    </div>
  )

  const espaco = (f: FigurinhaP) => {
    const qtd = carrinho.qtdDe(f.codigo)
    const esgotada = f.estoque === 0
    return (
      <li key={f.codigo} style={{ '--c1': secaoDe.get(f.secao)!.cores[0] } as React.CSSProperties}>
        <div className={`vd-espaco${qtd ? ' no-pedido' : ''}${esgotada ? ' esgotada' : ''}`}>
          <span className="vd-codigo">{f.codigo}</span>
          <span className="vd-numeral" aria-hidden>{numeroDe(f)}</span>
          <span className="vd-nome">{f.nome}</span>
          <span className="vd-rodape">
            {esgotada ? 'acabou' : preco(f)}
            {f.tipo === 'Especial' && !esgotada && <span className="vd-brilho"> ✦</span>}
          </span>
          {!esgotada && (
            <span className="vd-estoque">
              {f.estoque} {f.estoque === 1 ? 'disponível' : 'disponíveis'}
            </span>
          )}
          {!esgotada &&
            (qtd === 0 ? (
              <button
                className="vd-adicionar"
                onClick={() => carrinho.alterar(f, 1)}
                aria-label={`Adicionar ${f.codigo}, ${f.nome}, ${preco(f)}`}
              />
            ) : (
              passo(f, qtd)
            ))}
        </div>
      </li>
    )
  }

  return (
    <div className="vd">
      <header className="vd-topo">
        <div className="vd-formas" aria-hidden><i /><i /><i /></div>
        <p className="vd-loja">{nomeLoja}</p>
        <h1>Quais faltam no seu álbum?</h1>
        <p className="vd-dica" id="vd-dica">
          Cole a lista do jeito que você anota, por exemplo: BRA 3, 7, 12; ARG 10.
        </p>
        <label className="vd-oculto" htmlFor="vd-lista">Sua lista de faltantes</label>
        <textarea
          id="vd-lista"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          spellCheck={false}
          aria-describedby="vd-dica"
          placeholder="Ex.: BRA 3, 7, 12; ARG 10"
        />
        <button className="vd-procurar" onClick={() => setProcurado(texto)}>
          Procurar
        </button>
      </header>

      {codigos.length > 0 && (
        <section className="vd-resultado" aria-live="polite">
          <div className="vd-resultado-cabecalho">
            <h2>
              Você procurou {codigos.length}. Temos {disponiveis.length}.
            </h2>
            {disponiveis.length > 0 && (
              <button
                className="vd-adicionar-todas"
                onClick={() => disponiveis.forEach((f) => !carrinho.qtdDe(f.codigo) && carrinho.alterar(f, 1))}
              >
                {disponiveis.length === 1 ? 'Adicionar ao pedido' : `Adicionar as ${disponiveis.length}`}
              </button>
            )}
          </div>
          <ul className="vd-espacos">{achadas.map(espaco)}</ul>
          {inexistentes.length > 0 && (
            <p className="vd-inexistentes">
              {inexistentes.join(', ')} {inexistentes.length === 1 ? 'não existe' : 'não existem'} no álbum.
            </p>
          )}
        </section>
      )}

      <div className="vd-corpo">
        <nav className="vd-indice" aria-label="Filtrar por seleção">
          {grupos.map((grupo) => (
            <div key={grupo.titulo} className="vd-grupo">
              <span className="vd-grupo-titulo">{grupo.titulo}</span>
              {grupo.secoes.map((s) => (
                <button
                  key={s.sigla}
                  title={s.nome}
                  aria-pressed={selecionadas.has(s.sigla)}
                  onClick={() => alternarSelecao(s.sigla)}
                >
                  {bandeira(s.bandeira, 'vd-indice-bandeira')}
                  {s.sigla}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="vd-paginas" ref={inicioDasPaginas}>
          {selecionadas.size > 0 && (
            <div className="vd-filtro">
              <p>Mostrando: {listaDeNomes(visiveis.map((s) => s.nome))}.</p>
              <button onClick={() => setSelecionadas(new Set())}>Mostrar todas</button>
            </div>
          )}
          {visiveis.map((secao) => {
            const aVenda = secao.figurinhas.filter((f) => f.estoque > 0)
            return (
              <section
                key={secao.sigla}
                id={secao.sigla}
                className="vd-pagina"
                style={
                  {
                    '--c1': secao.cores[0],
                    '--c2': secao.cores[1] ?? secao.cores[0],
                    '--c3': secao.cores[2] ?? secao.cores[0],
                  } as React.CSSProperties
                }
              >
                <div className="vd-cabecalho">
                  <div className="vd-blocos" aria-hidden><i /><i /><i /></div>
                  <div className="vd-rotulo">
                    <h2>
                      {bandeira(secao.bandeira, 'vd-rotulo-bandeira')}
                      {secao.nome}
                    </h2>
                    <p>
                      {secao.grupo ? `Grupo ${secao.grupo}, ` : ''}
                      {aVenda.length ? `${aVenda.length} de ${secao.figurinhas.length} à venda` : 'nenhuma à venda agora'}
                    </p>
                  </div>
                </div>
                <ol
                  className="vd-tira"
                  role="img"
                  aria-label={`À venda: ${aVenda.map(numeroDe).join(', ') || 'nenhuma'}`}
                >
                  {secao.figurinhas.map((f) => (
                    <li
                      key={f.codigo}
                      className={
                        f.estoque === 0 ? 'esgotada' : carrinho.qtdDe(f.codigo) ? 'no-pedido' : 'disponivel'
                      }
                    >
                      {numeroDe(f)}
                    </li>
                  ))}
                </ol>
                {aVenda.length > 0 && <ul className="vd-espacos">{aVenda.map(espaco)}</ul>}
              </section>
            )
          })}
        </div>
      </div>

      <footer className="vd-pedido">
        <div>
          <strong>Meu pedido</strong>
          <span>
            {carrinho.unidades} {carrinho.unidades === 1 ? 'figurinha' : 'figurinhas'}, {reais(carrinho.total)}
          </span>
        </div>
        <button onClick={() => painel.current?.showModal()}>Ver pedido</button>
      </footer>

      <dialog ref={painel} className="vd-painel" aria-labelledby="vd-painel-titulo">
        <div className="vd-painel-topo">
          <h2 id="vd-painel-titulo">Seu pedido</h2>
          <button className="vd-fechar" onClick={() => painel.current?.close()} aria-label="Fechar">×</button>
        </div>
        {carrinho.lista.length === 0 ? (
          <p className="vd-painel-vazio">Seu pedido está vazio. Toque numa figurinha para adicionar.</p>
        ) : (
          <>
            <ul className="vd-painel-itens">
              {[...carrinho.lista]
                .sort(
                  (a, b) =>
                    posicaoNoAlbum.get(a.f.secao)! - posicaoNoAlbum.get(b.f.secao)! || a.f.numero - b.f.numero,
                )
                .map(({ f, qtd }) => (
                  <li key={f.codigo}>
                    <div>
                      <strong>{f.codigo}</strong> {f.nome}
                      <span>{preco(f)} cada, {f.estoque} {f.estoque === 1 ? 'disponível' : 'disponíveis'}</span>
                    </div>
                    {passo(f, qtd)}
                  </li>
                ))}
            </ul>
            <div className="vd-painel-rodape">
              <p>
                <span>Total estimado</span>
                <strong>{reais(carrinho.total)}</strong>
              </p>
              <a
                className="vd-finalizar"
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setEnviado(true)}
              >
                Finalizar pedido no WhatsApp
              </a>
              {enviado && (
                <div className="vd-pos-envio">
                  <button
                    onClick={() => {
                      carrinho.limpar()
                      setEnviado(false)
                      painel.current?.close()
                    }}
                  >
                    Pedido enviado? Limpar pedido
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(mensagem).then(() => setCopiada(true))}
                  >
                    {copiada ? 'Mensagem copiada' : 'Não abriu? Copiar mensagem'}
                  </button>
                </div>
              )}
              <p className="vd-aviso">O valor final e a disponibilidade são confirmados na conversa.</p>
            </div>
          </>
        )}
      </dialog>
    </div>
  )
}

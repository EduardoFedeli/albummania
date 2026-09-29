// PROTÓTIPO · Variante D (direção escolhida): abertura da C, páginas da B, esgotadas apagadas como na A.
import { useMemo, useState } from 'react'
import '../styles/tokens.css'
import './varianteD.css'
import { interpretar, reais, useCarrinhoP, type DadosP, type FigurinhaP } from './dados'

export const nomeD = 'Direção escolhida: C + B + A'

export function VarianteD({ secoes, precos, nomeLoja }: DadosP) {
  const carrinho = useCarrinhoP(precos)
  const [texto, setTexto] = useState('BRA 2, 3, 11, 17\nARG 22\nFWC 4\nESP 10, 15')
  const [procurado, setProcurado] = useState(texto)
  const [tema, setTema] = useState<'miolo' | 'capa'>(
    new URLSearchParams(location.search).get('tema') === 'capa' ? 'capa' : 'miolo',
  )

  const porCodigo = useMemo(
    () => new Map(secoes.flatMap((s) => s.figurinhas).map((f) => [f.codigo, f])),
    [secoes],
  )
  const secaoDe = useMemo(() => new Map(secoes.map((s) => [s.sigla, s])), [secoes])
  const codigos = interpretar(procurado)
  const achadas = codigos.map((c) => porCodigo.get(c)).filter((f): f is FigurinhaP => !!f)
  const disponiveis = achadas.filter((f) => f.estoque > 0)
  const inexistentes = codigos.filter((c) => !porCodigo.has(c))

  const numeroDe = (f: FigurinhaP) => (f.codigo === '00' ? '00' : String(f.numero))

  const espaco = (f: FigurinhaP) => {
    const qtd = carrinho.qtdDe(f.codigo)
    const esgotada = f.estoque === 0
    return (
      <li key={f.codigo} style={{ '--c1': secaoDe.get(f.secao)!.cores[0] } as React.CSSProperties}>
        <button
          className={`vd-espaco${qtd ? ' no-pedido' : ''}`}
          disabled={esgotada}
          onClick={() => carrinho.alterar(f, qtd >= f.estoque ? -qtd : 1)}
          aria-label={`${f.codigo}, ${f.nome}, ${esgotada ? 'acabou' : `${reais(precos[f.tipo] ?? 0)}, adicionar ao pedido`}`}
        >
          <span className="vd-codigo">{f.codigo}</span>
          <span className="vd-numeral" aria-hidden>{numeroDe(f)}</span>
          <span className="vd-nome">{f.nome}</span>
          <span className="vd-rodape">
            {esgotada ? 'acabou' : reais(precos[f.tipo] ?? 0)}
            {f.tipo === 'Especial' && !esgotada && <span className="vd-brilho"> ✦</span>}
          </span>
          {qtd > 0 && <em className="vd-qtd">{qtd}</em>}
        </button>
      </li>
    )
  }

  return (
    <div className="vd" data-tema={tema}>
      <header className="vd-topo">
        <div className="vd-formas" aria-hidden><i /><i /><i /></div>
        <div className="vd-barra">
          <p className="vd-loja">{nomeLoja}</p>
          <button
            className="vd-tema"
            aria-pressed={tema === 'capa'}
            onClick={() => setTema(tema === 'capa' ? 'miolo' : 'capa')}
          >
            {tema === 'capa' ? 'Tema claro' : 'Tema escuro'}
          </button>
        </div>
        <h1>Quais faltam no seu álbum?</h1>
        <label className="vd-oculto" htmlFor="vd-lista">Sua lista de faltantes</label>
        <textarea
          id="vd-lista"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          spellCheck={false}
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

      <nav className="vd-indice" aria-label="Seções">
        {secoes.map((s) => (
          <a key={s.sigla} href={`#${s.sigla}`}>{s.sigla}</a>
        ))}
      </nav>

      {secoes.map((secao) => {
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
                <h2>{secao.nome}</h2>
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

      <footer className="vd-pedido">
        <div>
          <strong>Meu pedido</strong>
          <span>
            {carrinho.unidades} {carrinho.unidades === 1 ? 'figurinha' : 'figurinhas'}, {reais(carrinho.total)}
          </span>
        </div>
        <button disabled={!carrinho.unidades}>Finalizar pedido</button>
      </footer>
    </div>
  )
}

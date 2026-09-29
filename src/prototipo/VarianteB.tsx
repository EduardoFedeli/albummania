// PROTÓTIPO · Variante B (Álbum 2026): cada Seção é uma página, cada Figurinha é um espaço.
import { useState } from 'react'
import './varianteB.css'
import { reais, useCarrinhoP, type DadosP } from './dados'

export const nomeB = 'Álbum 2026: páginas e espaços'

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function VarianteB({ secoes, precos, nomeLoja }: DadosP) {
  const carrinho = useCarrinhoP(precos)
  const [busca, setBusca] = useState('')
  const termo = semAcento(busca.trim()).replace(/\s+/g, '')

  const visiveis = secoes
    .map((s) => ({
      ...s,
      figurinhas: s.figurinhas.filter(
        (f) =>
          f.estoque > 0 &&
          (!termo ||
            semAcento(f.codigo).replace(/\s+/g, '').includes(termo) ||
            semAcento(f.nome).replace(/\s+/g, '').includes(termo) ||
            semAcento(s.nome).includes(termo)),
      ),
    }))
    .filter((s) => s.figurinhas.length)

  return (
    <div className="vb">
      <header className="vb-topo">
        <div className="vb-formas" aria-hidden>
          <i /><i /><i /><i />
        </div>
        <h1>{nomeLoja}</h1>
        <p>Figurinhas da Copa 2026 à venda. Monte seu pedido e finalize no WhatsApp.</p>
        <label className="vb-busca">
          <span className="vb-oculto">Buscar</span>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código ou nome, ex.: BRA 10"
          />
        </label>
      </header>

      <nav className="vb-indice" aria-label="Seções">
        {visiveis.map((s) => (
          <a key={s.sigla} href={`#${s.sigla}`}>{s.sigla}</a>
        ))}
      </nav>

      {visiveis.map((secao) => (
        <section
          key={secao.sigla}
          id={secao.sigla}
          className="vb-pagina"
          style={
            {
              '--c1': secao.cores[0],
              '--c2': secao.cores[1] ?? secao.cores[0],
              '--c3': secao.cores[2] ?? secao.cores[0],
            } as React.CSSProperties
          }
        >
          <div className="vb-cabecalho">
            <div className="vb-blocos" aria-hidden><i /><i /><i /></div>
            <div className="vb-rotulo">
              <h2>{secao.nome}</h2>
              <p>
                {secao.grupo ? `Grupo ${secao.grupo}, ` : ''}
                {secao.figurinhas.length} à venda
              </p>
            </div>
          </div>

          <ul className="vb-espacos">
            {secao.figurinhas.map((f) => {
              const qtd = carrinho.qtdDe(f.codigo)
              return (
                <li key={f.codigo} className={`vb-espaco${qtd ? ' no-pedido' : ''}`}>
                  <span className="vb-codigo">
                    {f.codigo}
                    {f.tipo === 'Especial' && <span className="vb-especial"> Especial</span>}
                  </span>
                  <span className="vb-numeral" aria-hidden>{f.codigo === '00' ? '00' : f.numero}</span>
                  <span className="vb-nome">{f.nome}</span>
                  <div className="vb-acoes">
                    <span>{reais(precos[f.tipo] ?? 0)}</span>
                    {qtd > 0 && (
                      <button onClick={() => carrinho.alterar(f, -1)} aria-label={`Tirar uma ${f.codigo}`}>
                        −
                      </button>
                    )}
                    {qtd > 0 && <output>{qtd}</output>}
                    <button
                      onClick={() => carrinho.alterar(f, 1)}
                      disabled={qtd >= f.estoque}
                      aria-label={`Adicionar ${f.codigo}`}
                    >
                      +
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <footer className="vb-pedido">
        <div>
          <strong>Meu pedido: {carrinho.unidades}</strong>
          <span>{reais(carrinho.total)} estimado</span>
        </div>
        <button disabled={!carrinho.unidades}>Finalizar pedido</button>
      </footer>
    </div>
  )
}

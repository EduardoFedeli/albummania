// PROTÓTIPO · Variante A (Retrô 70): o álbum inteiro como tabela de números.
import './varianteA.css'
import { reais, useCarrinhoP, type DadosP } from './dados'

export const nomeA = 'Retrô 70: tabela de números'

export function VarianteA({ secoes, precos, nomeLoja }: DadosP) {
  const carrinho = useCarrinhoP(precos)

  return (
    <div className="va">
      <header className="va-topo">
        <h1>{nomeLoja}</h1>
        <p>Copa 2026, figurinhas avulsas</p>
      </header>
      <div className="va-listras" aria-hidden />

      <p className="va-instrucao">
        Toque nos números que faltam no seu álbum. Os apagados já saíram.
      </p>

      {secoes.map((secao) => (
        <section key={secao.sigla} className="va-secao" id={secao.sigla}>
          <div className="va-secao-titulo">
            <h2>{secao.nome}</h2>
            {secao.grupo && <span>Grupo {secao.grupo}</span>}
          </div>
          <div className="va-bandeira" aria-hidden>
            {secao.cores.map((cor) => (
              <i key={cor} style={{ background: cor }} />
            ))}
          </div>
          <ol className="va-grade">
            {secao.figurinhas.map((f) => {
              const qtd = carrinho.qtdDe(f.codigo)
              const disponivel = f.estoque > 0
              return (
                <li key={f.codigo}>
                  <button
                    className={`va-numero${qtd ? ' no-pedido' : ''}${f.tipo === 'Especial' ? ' especial' : ''}`}
                    disabled={!disponivel}
                    onClick={() => carrinho.alterar(f, qtd >= f.estoque ? -qtd : 1)}
                    aria-label={`${f.codigo}, ${f.nome}${disponivel ? `, ${f.estoque} disponíveis` : ', esgotada'}`}
                  >
                    <b>{f.codigo === '00' ? '00' : f.numero}</b>
                    <small>{f.nome}</small>
                    {qtd > 0 && <em>{qtd}</em>}
                    {disponivel && f.estoque > 1 && !qtd && <span className="va-estoque">×{f.estoque}</span>}
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      <footer className={`va-cupom${carrinho.unidades ? ' ativo' : ''}`}>
        <div>
          <strong>{carrinho.unidades} figurinhas</strong>
          <span>{reais(carrinho.total)} estimado</span>
        </div>
        <button disabled={!carrinho.unidades}>Pedir no WhatsApp</button>
      </footer>
    </div>
  )
}

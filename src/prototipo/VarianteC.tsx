// PROTÓTIPO · Variante C (Caderno do colecionador): a Lista de Faltantes vem primeiro.
import { useMemo, useState } from 'react'
import './varianteC.css'
import { interpretar, reais, useCarrinhoP, type DadosP, type FigurinhaP } from './dados'

export const nomeC = 'Caderno: lista de faltantes primeiro'

export function VarianteC({ secoes, precos, nomeLoja }: DadosP) {
  const carrinho = useCarrinhoP(precos)
  const [texto, setTexto] = useState('BRA 2, 3, 11, 17\nARG 22\nFWC 4\nESP 10, 15')
  const [procurado, setProcurado] = useState(texto)
  const [folheando, setFolheando] = useState('BRA')

  const porCodigo = useMemo(
    () => new Map(secoes.flatMap((s) => s.figurinhas).map((f) => [f.codigo, f])),
    [secoes],
  )
  const resultado = interpretar(procurado).map((codigo) => ({ codigo, f: porCodigo.get(codigo) }))
  const encontradas = resultado.filter((r) => r.f && r.f.estoque > 0).map((r) => r.f!)
  const secao = secoes.find((s) => s.sigla === folheando)!

  const linha = (f: FigurinhaP) => {
    const qtd = carrinho.qtdDe(f.codigo)
    return (
      <li key={f.codigo}>
        <button
          className={`vc-linha${qtd ? ' marcada' : ''}`}
          onClick={() => carrinho.alterar(f, qtd ? -qtd : 1)}
          aria-pressed={qtd > 0}
        >
          <span className="vc-caixa" aria-hidden>{qtd ? '✓' : ''}</span>
          <span className="vc-codigo">{f.codigo}</span>
          <span className="vc-nome">{f.nome}</span>
          <span className="vc-preco">{reais(precos[f.tipo] ?? 0)}</span>
        </button>
      </li>
    )
  }

  return (
    <div className="vc">
      <main className="vc-folha">
        <p className="vc-loja">{nomeLoja}</p>
        <h1>Quais faltam no seu álbum?</h1>
        <label className="vc-oculto" htmlFor="vc-lista">Sua lista de faltantes</label>
        <textarea
          id="vc-lista"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          spellCheck={false}
        />
        <button className="vc-procurar" onClick={() => setProcurado(texto)}>
          Procurar na loja
        </button>

        <p className="vc-anotacao">
          Você procurou {resultado.length}. Temos {encontradas.length}.
        </p>
        {encontradas.length > 0 && (
          <button
            className="vc-marca-texto"
            onClick={() => encontradas.forEach((f) => !carrinho.qtdDe(f.codigo) && carrinho.alterar(f, 1))}
          >
            {encontradas.length === 1
              ? 'Adicionar ao pedido'
              : `Adicionar as ${encontradas.length} ao pedido`}
          </button>
        )}

        <ul className="vc-lista">
          {resultado.map(({ codigo, f }) =>
            f && f.estoque > 0 ? (
              linha(f)
            ) : (
              <li key={codigo} className="vc-faltou">
                <span className="vc-codigo">{codigo}</span>
                <span className="vc-nome">{f ? `${f.nome}, acabou` : 'essa figurinha não existe'}</span>
              </li>
            ),
          )}
        </ul>

        <h2>Ou folheie por seleção</h2>
        <nav className="vc-abas" aria-label="Seções">
          {secoes.map((s) => (
            <button
              key={s.sigla}
              className={s.sigla === folheando ? 'atual' : ''}
              onClick={() => setFolheando(s.sigla)}
            >
              {s.sigla}
            </button>
          ))}
        </nav>
        <h3>{secao.nome}</h3>
        <ul className="vc-lista">{secao.figurinhas.filter((f) => f.estoque > 0).map(linha)}</ul>
      </main>

      <footer className="vc-bilhete">
        <p>
          Seu pedido: <strong>{carrinho.unidades} figurinhas</strong>, {reais(carrinho.total)}
        </p>
        <button disabled={!carrinho.unidades}>Enviar no WhatsApp</button>
      </footer>
    </div>
  )
}

import type { Resumo } from '../domain/carrinho'
import { formatarPreco } from '../domain/catalogo'

/** A barra fixa no pé da tela: o resumo do Carrinho e o botão que abre o painel "Meu pedido". */
export function BarraDoPedido({ resumo, aoAbrir }: { resumo: Resumo; aoAbrir: () => void }) {
  if (resumo.quantidade === 0) return null

  return (
    <div className="vt-barra">
      <p className="vt-barra-resumo" role="status">
        <strong>{resumo.quantidade === 1 ? '1 item' : `${resumo.quantidade} itens`}</strong>
        <span>{formatarPreco(resumo.totalCentavos)}</span>
      </p>
      <button className="vt-barra-botao" onClick={aoAbrir}>
        Ver pedido
      </button>
    </div>
  )
}

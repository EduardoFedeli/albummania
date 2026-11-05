import { formatarPreco, type Item } from '../domain/catalogo'
import { numeral } from './numeral'

interface Props {
  item: Item
  /** Quantas unidades deste Item já estão no Carrinho. */
  quantidade: number
  aoAdicionar: () => void
  aoDiminuir: () => void
}

export function CartaoDoItem({ item, quantidade, aoAdicionar, aoDiminuir }: Props) {
  return (
    <li className="vt-item" data-no-pedido={quantidade > 0 || undefined}>
      <div className="vt-item-foto">
        {item.foto ? (
          <img
            src={item.foto}
            alt={item.codigo ? `${item.nome} (${item.codigo})` : item.nome}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="vt-item-numeral" aria-hidden="true">
            {numeral(item)}
          </span>
        )}
        {item.raridade && <span className="vt-item-raridade">{item.raridade}</span>}
      </div>

      <div className="vt-item-dados">
        {item.codigo && <p className="vt-item-codigo">{item.codigo}</p>}
        <h3 className="vt-item-nome">{item.nome}</h3>
        {item.equipe && <p className="vt-item-equipe">{item.equipe}</p>}
        <div className="vt-item-rodape">
          <p className="vt-item-preco">{formatarPreco(item.precoCentavos)}</p>
          <p className="vt-item-estoque">
            {item.estoque === 1 ? 'Última unidade' : `${item.estoque} disponíveis`}
          </p>
        </div>

        {quantidade === 0 ? (
          <button className="vt-adicionar" onClick={aoAdicionar} aria-label={`Adicionar ${item.nome} ao pedido`}>
            + Adicionar
          </button>
        ) : (
          <div className="vt-passos" role="group" aria-label={`${item.nome} no pedido`}>
            <button className="vt-passo" onClick={aoDiminuir} aria-label={`Tirar 1 de ${item.nome}`}>
              −
            </button>
            <output className="vt-passos-valor" aria-live="polite">
              {quantidade}
            </output>
            <button
              className="vt-passo"
              onClick={aoAdicionar}
              disabled={quantidade >= item.estoque}
              aria-label={`Pôr mais 1 de ${item.nome}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

import { formatarPreco, type Item } from '../domain/catalogo'
import { numeral } from './numeral'

export function CartaoDoItem({ item }: { item: Item }) {
  return (
    <li className="vt-item">
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
      </div>
    </li>
  )
}

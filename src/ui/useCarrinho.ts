import { useEffect, useState } from 'react'
import { adicionar, descreverAjustes, diminuir, lerCarrinhoSalvo, reconciliar, type Carrinho } from '../domain/carrinho'
import type { Item } from '../domain/catalogo'
import { gravarNoNavegador, lerDoNavegador } from '../infra/armazenamento'

// O sufixo versiona o formato. Se ele mudar, o Carrinho antigo é ignorado em vez de quebrar o site.
const CHAVE = 'carrinho:v2'

/**
 * Hook customizado: junta num lugar só o estado do Carrinho, a gravação no navegador e a
 * reconciliação com o Catálogo. A Vitrine só chama adicionar, diminuir e limpar.
 */
export function useCarrinho(itens: Item[]) {
  // A função passada ao useState roda só na primeira vez: lê o Carrinho salvo e acerta com o Catálogo atual.
  const [inicio] = useState(() => reconciliar(lerCarrinhoSalvo(lerDoNavegador(CHAVE)), itens))
  const [carrinho, setCarrinho] = useState<Carrinho>(inicio.carrinho)
  const [aviso, setAviso] = useState(() => descreverAjustes(inicio.removidos, inicio.reduzidos))

  // Toda mudança no Carrinho vai para o navegador, para sobreviver a fechar a aba.
  useEffect(() => {
    gravarNoNavegador(CHAVE, JSON.stringify(carrinho))
  }, [carrinho])

  return {
    carrinho,
    aviso,
    fecharAviso: () => setAviso(null),
    adicionar: (item: Item) => setCarrinho((atual) => adicionar(atual, item)),
    diminuir: (itemId: number) => setCarrinho((atual) => diminuir(atual, itemId)),
    limpar: () => setCarrinho([]),
  }
}

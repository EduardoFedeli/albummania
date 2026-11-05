import { useEffect, useRef, useState } from 'react'
import type { Resumo } from '../domain/carrinho'
import { formatarPreco, type Colecao, type Item, type Loja } from '../domain/catalogo'
import { formatarWhatsapp, montarMensagem, urlDoWhatsapp } from '../domain/pedido'

interface Props {
  resumo: Resumo
  colecoes: Colecao[]
  loja: Loja
  aoAdicionar: (item: Item) => void
  aoDiminuir: (itemId: number) => void
  aoLimpar: () => void
  aoFechar: () => void
}

/**
 * O painel "Meu pedido": o Comprador revisa, ajusta as quantidades e finaliza no WhatsApp.
 * O site não sabe se o WhatsApp abriu (system design §8), por isso depois de finalizar
 * aparecem "Copiar mensagem" e "Limpar pedido", e o Carrinho não some sozinho.
 */
export function PainelDoPedido({ resumo, colecoes, loja, aoAdicionar, aoDiminuir, aoLimpar, aoFechar }: Props) {
  const janela = useRef<HTMLDialogElement>(null)
  const [enviado, setEnviado] = useState(false)
  const [copia, setCopia] = useState<'nada' | 'copiada' | 'falhou'>('nada')

  useEffect(() => {
    if (!janela.current?.open) janela.current?.showModal()
  }, [])

  const mensagem = montarMensagem(resumo, colecoes)
  const url = loja.whatsapp ? urlDoWhatsapp(loja.whatsapp, mensagem) : null
  const vazio = resumo.linhas.length === 0

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensagem)
      setCopia('copiada')
    } catch {
      setCopia('falhou')
    }
  }

  return (
    <dialog ref={janela} className="vt-painel" aria-labelledby="vt-painel-titulo" onClose={aoFechar}>
      <div className="vt-painel-topo">
        <h2 id="vt-painel-titulo" className="vt-painel-titulo">
          Meu pedido
        </h2>
        <button className="vt-fechar" aria-label="Fechar" onClick={aoFechar}>
          ×
        </button>
      </div>

      {vazio ? (
        <p className="vt-painel-vazio">Seu pedido está vazio. Toque em "Adicionar" nos itens que quiser.</p>
      ) : (
        <ul className="vt-painel-itens">
          {resumo.linhas.map(({ item, quantidade, subtotalCentavos }) => (
            <li key={item.id} className="vt-painel-item">
              <div className="vt-painel-dados">
                <p className="vt-painel-nome">{[item.codigo, item.nome].filter(Boolean).join(' · ')}</p>
                <p className="vt-painel-unitario">{formatarPreco(item.precoCentavos)} cada</p>
              </div>
              <div className="vt-passos" role="group" aria-label={`${item.nome} no pedido`}>
                <button className="vt-passo" onClick={() => aoDiminuir(item.id)} aria-label={`Tirar 1 de ${item.nome}`}>
                  −
                </button>
                <output className="vt-passos-valor" aria-live="polite">
                  {quantidade}
                </output>
                <button
                  className="vt-passo"
                  onClick={() => aoAdicionar(item)}
                  disabled={quantidade >= item.estoque}
                  aria-label={`Pôr mais 1 de ${item.nome}`}
                >
                  +
                </button>
              </div>
              <p className="vt-painel-subtotal">{formatarPreco(subtotalCentavos)}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="vt-painel-rodape">
        <p className="vt-painel-total">
          <span>Total estimado</span>
          <strong>{formatarPreco(resumo.totalCentavos)}</strong>
        </p>
        <p className="vt-painel-nota">Sujeito a confirmação de disponibilidade. Frete e pagamento você combina no WhatsApp.</p>

        {url ? (
          <a
            className="vt-finalizar"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={vazio || undefined}
            onClick={(e) => {
              if (vazio) e.preventDefault()
              else setEnviado(true)
            }}
          >
            Finalizar pedido no WhatsApp
          </a>
        ) : (
          <p className="vt-painel-nota">A loja ainda não informou o WhatsApp. Copie a mensagem e mande para o vendedor.</p>
        )}

        {(enviado || !url) && !vazio && (
          <div className="vt-painel-depois">
            <button className="vt-botao" onClick={() => void copiar()}>
              {url ? 'Não abriu? Copiar mensagem' : 'Copiar mensagem'}
            </button>
            {enviado && (
              <button
                className="vt-botao"
                onClick={() => {
                  aoLimpar()
                  aoFechar()
                }}
              >
                Pedido enviado? Limpar pedido
              </button>
            )}
          </div>
        )}

        {copia === 'copiada' && (
          <p className="vt-painel-nota" role="status">
            Mensagem copiada!{loja.whatsapp && ` Cole na conversa com ${formatarWhatsapp(loja.whatsapp)}.`}
          </p>
        )}
        {copia === 'falhou' && (
          <label className="vt-painel-copia">
            <span>Não deu para copiar sozinho. Selecione o texto abaixo e copie:</span>
            <textarea readOnly rows={6} value={mensagem} onFocus={(e) => e.currentTarget.select()} />
          </label>
        )}
      </div>
    </dialog>
  )
}

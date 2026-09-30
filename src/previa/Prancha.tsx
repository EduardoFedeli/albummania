// Prancha do design system e imagem da prévia do link, montadas com os componentes e tokens reais.
import { useState } from 'react'
import '../styles/tokens.css'
import '../prototipo/varianteD.css'
import './prancha.css'
import { SECOES } from '../data/secoes'
import { urlDaBandeira } from '../ui/bandeiras'

const secao = (sigla: string) => SECOES.find((s) => s.sigla === sigla)!

const coresDa = (sigla: string) => {
  const [c1, c2 = c1, c3 = c1] = secao(sigla).cores
  return { '--c1': c1, '--c2': c2, '--c3': c3 } as React.CSSProperties
}

const CORES = [
  ['Texto e barra', '--cor-destaque'],
  ['Botões', '--cor-acao'],
  ['Fundo', '--cor-fundo'],
  ['Cartões', '--cor-superficie'],
  ['Legendas', '--cor-texto-fraco'],
  ['Especiais', '--cor-brilho'],
] as const

// O build minifica #ffffff para #fff; na prancha, sempre seis dígitos.
const hexCompleto = (valor: string) => {
  const hex = valor.trim().toUpperCase()
  return /^#[0-9A-F]{3}$/.test(hex) ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex
}

function lerValoresDosTokens(): Record<string, string> {
  const estilo = getComputedStyle(document.documentElement)
  return Object.fromEntries(CORES.map(([, token]) => [token, hexCompleto(estilo.getPropertyValue(token))]))
}

function Bandeira({ sigla, className }: { sigla: string; className: string }) {
  return <img className={className} src={urlDaBandeira(secao(sigla).bandeira!)} alt="" />
}

interface EspacoDemoProps {
  sigla: string
  numero: string
  nome: string
  preco: string
  estoque: number
  qtd?: number
  especial?: boolean
}

function EspacoDemo({ sigla, numero, nome, preco, estoque, qtd = 0, especial = false }: EspacoDemoProps) {
  const esgotada = estoque === 0
  return (
    <li style={{ '--c1': secao(sigla).cores[0] } as React.CSSProperties}>
      <div className={`vd-espaco${qtd ? ' no-pedido' : ''}${esgotada ? ' esgotada' : ''}`}>
        <span className="vd-codigo">
          {sigla} {numero}
        </span>
        <span className="vd-numeral">{numero}</span>
        <span className="vd-nome">{nome}</span>
        <span className="vd-rodape">
          {esgotada ? 'acabou' : preco}
          {especial && <span className="vd-brilho"> ✦</span>}
        </span>
        {!esgotada && (
          <span className="vd-estoque">
            {estoque} {estoque === 1 ? 'disponível' : 'disponíveis'}
          </span>
        )}
        {qtd > 0 && (
          <div className="vd-passo">
            <button tabIndex={-1}>−</button>
            <output>{qtd}</output>
            <button tabIndex={-1}>+</button>
          </div>
        )}
      </div>
    </li>
  )
}

const TIRA_BRASIL = { disponivel: [4, 11, 13, 14, 17], noPedido: [2] }

export function Prancha() {
  const [valores] = useState(lerValoresDosTokens)

  return (
    <div className="vd pr">
      <div className="pr-formas" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>

      <header className="pr-topo">
        <h1>ÁlbumMania</h1>
        <p>Figurinhas da Copa 2026. Guia visual do site: as cores, as letras e as peças da página.</p>
      </header>

      <section className="pr-cartao pr-cores">
        <h2>Cores</h2>
        <p className="pr-legenda">Azul-marinho sobre papel claro. Cada seleção ganha as cores da sua bandeira.</p>
        <ul className="pr-amostras">
          {CORES.map(([nome, token]) => (
            <li key={token}>
              <span className="pr-amostra" style={{ background: `var(${token})` }} />
              <strong>{nome}</strong>
              <span>{valores[token]}</span>
            </li>
          ))}
        </ul>
        <ul className="pr-tons">
          {['BRA', 'ARG', 'ESP', 'FRA', 'MEX', 'JPN', 'GER', 'POR'].map((sigla) => (
            <li key={sigla} style={{ '--c1': secao(sigla).cores[0] } as React.CSSProperties}>
              <Bandeira sigla={sigla} className="vd-indice-bandeira" />
              {sigla}
            </li>
          ))}
        </ul>
      </section>

      <section className="pr-cartao pr-letras">
        <h2>Letras</h2>
        <div className="pr-fontes">
          <div>
            <p className="pr-fonte-nome">Unbounded, para títulos e números grandes</p>
            <p className="pr-amostra-titulo">Quais faltam no seu álbum?</p>
          </div>
          <div>
            <p className="pr-fonte-nome">Instrument Sans, para todo o resto</p>
            <p className="pr-amostra-texto">
              Toque na figurinha para colocar no pedido. O estoque aparece em cada uma, e o pedido é finalizado
              pelo WhatsApp.
            </p>
            <p className="pr-amostra-digitos">BRA 0 1 2 3 4 5 6 7 8 9</p>
          </div>
          <p className="pr-amostra-numeral" style={coresDa('BRA')}>
            14
          </p>
        </div>
      </section>

      <section className="pr-cartao pr-figurinha">
        <h2>A figurinha</h2>
        <p className="pr-legenda">À venda, já no pedido e esgotada.</p>
        <ul className="vd-espacos">
          <EspacoDemo sigla="BRA" numero="14" nome="Vinícius Júnior" preco="R$ 1,50" estoque={3} />
          <EspacoDemo sigla="ARG" numero="10" nome="Rodrigo De Paul" preco="R$ 1,50" estoque={3} qtd={2} />
          <EspacoDemo sigla="ESP" numero="15" nome="Lamine Yamal" preco="R$ 1,50" estoque={0} />
        </ul>
      </section>

      <section className="pr-cartao pr-selecao">
        <h2>Página da seleção</h2>
        <p className="pr-legenda">A bandeira, as cores e os 20 números do álbum de relance.</p>
        <div className="vd-pagina" style={coresDa('BRA')}>
          <div className="vd-cabecalho">
            <div className="vd-blocos" aria-hidden>
              <i />
              <i />
              <i />
            </div>
            <div className="vd-rotulo">
              <h3>
                <Bandeira sigla="BRA" className="vd-rotulo-bandeira" />
                Brasil
              </h3>
              <p>Grupo C, 6 de 20 à venda</p>
            </div>
          </div>
          <ol className="vd-tira">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <li
                key={n}
                className={
                  TIRA_BRASIL.noPedido.includes(n)
                    ? 'no-pedido'
                    : TIRA_BRASIL.disponivel.includes(n)
                      ? 'disponivel'
                      : 'esgotada'
                }
              >
                {n}
              </li>
            ))}
          </ol>
          <ul className="vd-espacos">
            <EspacoDemo sigla="BRA" numero="4" nome="Marquinhos" preco="R$ 1,50" estoque={1} />
            <EspacoDemo sigla="BRA" numero="11" nome="Bruno Guimarães" preco="R$ 1,50" estoque={2} />
            <EspacoDemo sigla="BRA" numero="13" nome="Foto do time" preco="R$ 1,50" estoque={2} />
          </ul>
        </div>
      </section>

      <section className="pr-cartao pr-filtro">
        <h2>Filtro por seleção</h2>
        <p className="pr-legenda">O comprador marca só as seleções que procura.</p>
        <div className="vd-indice">
          {(
            [
              ['BRA', true],
              ['ARG', false],
              ['SUI', true],
              ['MEX', false],
            ] as const
          ).map(([sigla, marcada]) => (
            <button key={sigla} aria-pressed={marcada} tabIndex={-1}>
              <Bandeira sigla={sigla} className="vd-indice-bandeira" />
              {sigla}
            </button>
          ))}
        </div>
        <div className="vd-filtro">
          <p>Mostrando: Brasil e Suíça.</p>
          <button tabIndex={-1}>Mostrar todas</button>
        </div>
      </section>

      <section className="pr-cartao pr-pedido">
        <h2>Pedido</h2>
        <p className="pr-legenda">Revisado no painel e finalizado pelo WhatsApp.</p>
        <div className="vd-pedido">
          <div>
            <strong>Meu pedido</strong>
            <span>3 figurinhas, R$ 4,50</span>
          </div>
          <button tabIndex={-1}>Ver pedido</button>
        </div>
        <span className="vd-finalizar">Finalizar pedido no WhatsApp</span>
      </section>

      <p className="pr-rodape">
        Letras Unbounded e Instrument Sans (Google Fonts). Bandeiras do projeto flag-icons, licença MIT.
      </p>
    </div>
  )
}

export function ImagemDoLink() {
  return (
    <div className="vd pr-og">
      <div className="pr-formas" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="pr-og-texto">
        <h1>ÁlbumMania</h1>
        <p>Figurinhas da Copa 2026: veja o que tem à venda e peça pelo WhatsApp.</p>
        <div className="pr-og-bandeiras">
          {['BRA', 'ARG', 'FRA', 'ESP', 'POR', 'GER'].map((sigla) => (
            <Bandeira key={sigla} sigla={sigla} className="pr-og-bandeira" />
          ))}
        </div>
      </div>
      <ul className="vd-espacos">
        <EspacoDemo sigla="BRA" numero="14" nome="Vinícius Júnior" preco="R$ 1,50" estoque={3} />
        <EspacoDemo sigla="ARG" numero="10" nome="Rodrigo De Paul" preco="R$ 1,50" estoque={2} />
        <EspacoDemo sigla="FWC" numero="4" nome="Slogan oficial" preco="R$ 5,00" estoque={1} especial />
      </ul>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { aoMudarSessao, buscarTudo, ehAdministrador, sair, type DadosDoAdmin } from '../infra/admin'
import { AbaColecoes } from './AbaColecoes'
import { AbaItens } from './AbaItens'
import { AbaLoja } from './AbaLoja'
import { Entrar } from './Entrar'

type Acesso =
  | { tipo: 'verificando' }
  | { tipo: 'fora' }
  | { tipo: 'sem-permissao' }
  | { tipo: 'dentro' }
  | { tipo: 'erro'; mensagem: string }

/** Porta do Admin: sem login mostra o Entrar; com login, confere no banco se a conta é de administrador. */
export function Admin() {
  const [acesso, setAcesso] = useState<Acesso>({ tipo: 'verificando' })

  useEffect(() => {
    let ativo = true
    const mudar = (novo: Acesso) => {
      if (ativo) setAcesso(novo)
    }

    let parar = () => {}
    try {
      parar = aoMudarSessao(async (logado) => {
        if (!logado) return mudar({ tipo: 'fora' })
        mudar({ tipo: 'verificando' })
        try {
          mudar({ tipo: (await ehAdministrador()) ? 'dentro' : 'sem-permissao' })
        } catch (falha) {
          mudar({ tipo: 'erro', mensagem: (falha as Error).message })
        }
      })
    } catch (falha) {
      mudar({ tipo: 'erro', mensagem: (falha as Error).message })
    }

    return () => {
      ativo = false
      parar()
    }
  }, [])

  switch (acesso.tipo) {
    case 'verificando':
      return (
        <main className="ad-centro">
          <p role="status">Carregando…</p>
        </main>
      )
    case 'fora':
      return <Entrar />
    case 'sem-permissao':
      return (
        <main className="ad-centro">
          <div className="ad-cartao">
            <p>Esta conta não tem acesso ao Admin.</p>
            <button className="ad-botao" onClick={() => void sair()}>
              Sair
            </button>
          </div>
        </main>
      )
    case 'erro':
      return (
        <main className="ad-centro">
          <div className="ad-cartao" role="alert">
            <p>{acesso.mensagem}</p>
            <button className="ad-botao" onClick={() => location.reload()}>
              Tentar de novo
            </button>
          </div>
        </main>
      )
    case 'dentro':
      return <AreaDoAdmin />
  }
}

type Aba = 'itens' | 'colecoes' | 'loja'

const ABAS: Array<[Aba, string]> = [
  ['itens', 'Itens'],
  ['colecoes', 'Coleções'],
  ['loja', 'Loja'],
]

function AreaDoAdmin() {
  const [dados, setDados] = useState<DadosDoAdmin | null>(null)
  const [falhou, setFalhou] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const [aba, setAba] = useState<Aba>('itens')

  useEffect(() => {
    let ativo = true
    buscarTudo()
      .then((lidos) => {
        if (ativo) setDados(lidos)
      })
      .catch((falha: unknown) => {
        console.error('Não foi possível carregar o Admin:', falha)
        if (ativo) setFalhou(true)
      })
    return () => {
      ativo = false
    }
  }, [tentativa])

  /** Cada aba muda os dados por esta função, depois que o banco confirma a gravação. */
  const atualizar = (mudar: (atuais: DadosDoAdmin) => DadosDoAdmin) => setDados((atuais) => atuais && mudar(atuais))

  if (falhou) {
    return (
      <main className="ad-centro">
        <div className="ad-cartao" role="alert">
          <p>Não deu para carregar os dados. Confira a internet e tente de novo.</p>
          <button
            className="ad-botao"
            onClick={() => {
              setFalhou(false)
              setTentativa((n) => n + 1)
            }}
          >
            Tentar de novo
          </button>
        </div>
      </main>
    )
  }

  if (!dados) {
    return (
      <main className="ad-centro">
        <p role="status">Carregando os itens…</p>
      </main>
    )
  }

  return (
    <>
      <header className="ad-topo">
        <div>
          <p className="ad-sobretitulo">Admin</p>
          <p className="ad-marca">{dados.loja.nome}</p>
        </div>
        <div className="ad-topo-acoes">
          <a className="ad-botao ad-botao-leve" href="../" target="_blank" rel="noreferrer">
            Ver a loja
          </a>
          <button className="ad-botao ad-botao-leve" onClick={() => void sair()}>
            Sair
          </button>
        </div>
      </header>

      <nav className="ad-abas" aria-label="Partes do Admin">
        {ABAS.map(([id, rotulo]) => (
          <button
            key={id}
            className="ad-aba"
            aria-current={aba === id ? 'page' : undefined}
            onClick={() => setAba(id)}
          >
            {rotulo}
          </button>
        ))}
      </nav>

      <main className="ad-pagina">
        {aba === 'itens' && <AbaItens dados={dados} atualizar={atualizar} irParaColecoes={() => setAba('colecoes')} />}
        {aba === 'colecoes' && <AbaColecoes dados={dados} atualizar={atualizar} />}
        {aba === 'loja' && <AbaLoja dados={dados} atualizar={atualizar} />}
      </main>
    </>
  )
}

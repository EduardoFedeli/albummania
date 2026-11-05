import { useState, type FormEvent } from 'react'
import { entrar } from '../infra/admin'
import { Campo } from './Campo'

export function Entrar() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [entrando, setEntrando] = useState(false)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro('')
    setEntrando(true)
    try {
      // Deu certo: o Admin percebe o login sozinho (aoMudarSessao) e troca de tela.
      await entrar(email, senha)
    } catch (falha) {
      setErro((falha as Error).message)
      setEntrando(false)
    }
  }

  return (
    <main className="ad-centro">
      <form className="ad-cartao ad-entrar" onSubmit={enviar}>
        <p className="ad-sobretitulo">Área do Vendedor</p>
        <h1 className="ad-titulo">Entrar no Admin</h1>
        <Campo rotulo="E-mail">
          {(controle) => (
            <input
              {...controle}
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Campo>
        <Campo rotulo="Senha">
          {(controle) => (
            <input
              {...controle}
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          )}
        </Campo>
        {erro && (
          <p className="ad-erro" role="alert">
            {erro}
          </p>
        )}
        <button className="ad-botao ad-botao-principal" disabled={entrando}>
          {entrando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="ad-dica">Esqueceu a senha? Peça uma nova a quem cuida do site.</p>
      </form>
    </main>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { validarNovaSenha } from '../domain/conta'
import { emailDaConta, trocarSenha } from '../infra/admin'
import { Campo } from './Campo'

/** A conta de quem está usando o Admin: o e-mail do login e a troca de senha. */
export function AbaConta() {
  const [email, setEmail] = useState<string | null>(null)
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [situacao, setSituacao] = useState<'editando' | 'trocando' | 'trocada'>('editando')

  useEffect(() => {
    let ativo = true
    void emailDaConta().then((lido) => {
      if (ativo) setEmail(lido)
    })
    return () => {
      ativo = false
    }
  }, [])

  const trocar = async (evento: FormEvent) => {
    evento.preventDefault()
    const problema = validarNovaSenha(senha, confirmacao)
    if (problema) {
      setErro(problema)
      return
    }
    setErro('')
    setSituacao('trocando')
    try {
      await trocarSenha(senha)
      setSenha('')
      setConfirmacao('')
      setSituacao('trocada')
    } catch (falha) {
      setErro((falha as Error).message)
      setSituacao('editando')
    }
  }

  const editar = (mudar: (valor: string) => void) => (valor: string) => {
    mudar(valor)
    setErro('')
    setSituacao('editando')
  }

  return (
    <form className="adm-cartao adm-form-loja" onSubmit={trocar} noValidate>
      {email && <p>Você entrou como {email}.</p>}
      <h2 className="adm-titulo">Trocar a senha</h2>
      <Campo rotulo="Nova senha" dica="Pelo menos 8 caracteres.">
        {(controle) => (
          <input
            {...controle}
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => editar(setSenha)(e.target.value)}
          />
        )}
      </Campo>
      <Campo rotulo="Repita a nova senha">
        {(controle) => (
          <input
            {...controle}
            type="password"
            autoComplete="new-password"
            value={confirmacao}
            onChange={(e) => editar(setConfirmacao)(e.target.value)}
          />
        )}
      </Campo>
      {erro && (
        <p className="adm-erro" role="alert">
          {erro}
        </p>
      )}
      <button className="adm-botao adm-botao-principal" disabled={situacao === 'trocando'}>
        {situacao === 'trocando' ? 'Trocando…' : 'Trocar a senha'}
      </button>
      {situacao === 'trocada' && (
        <p className="adm-aviso" role="status">
          Senha trocada! Use a nova senha no próximo acesso.
        </p>
      )}
    </form>
  )
}

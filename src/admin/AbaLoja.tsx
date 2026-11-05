import { useState, type FormEvent } from 'react'
import { lerWhatsapp } from '../domain/cadastro'
import { salvarLoja, type DadosDoAdmin } from '../infra/admin'
import { Campo } from './Campo'

interface Props {
  dados: DadosDoAdmin
  atualizar: (mudar: (atuais: DadosDoAdmin) => DadosDoAdmin) => void
}

export function AbaLoja({ dados, atualizar }: Props) {
  const [nome, setNome] = useState(dados.loja.nome)
  const [whatsapp, setWhatsapp] = useState(dados.loja.whatsapp)
  const [erros, setErros] = useState<{ nome?: string; whatsapp?: string }>({})
  const [situacao, setSituacao] = useState<'editando' | 'salvando' | 'salvo'>('editando')
  const [erro, setErro] = useState('')

  const salvar = async (evento: FormEvent) => {
    evento.preventDefault()
    const nomeLimpo = nome.trim()
    // Vazio é permitido: a loja só fica sem o botão de WhatsApp até alguém configurar.
    const numero = whatsapp.trim() ? lerWhatsapp(whatsapp) : ''

    const encontrados: typeof erros = {}
    if (!nomeLimpo) encontrados.nome = 'Escreva o nome da loja.'
    if (numero === null) encontrados.whatsapp = 'Use o número com DDD. Ex.: (11) 91234-5678'
    setErros(encontrados)
    if (!nomeLimpo || numero === null) return

    setErro('')
    setSituacao('salvando')
    try {
      const loja = { nome: nomeLimpo, whatsapp: numero }
      await salvarLoja(loja)
      atualizar((atuais) => ({ ...atuais, loja }))
      setNome(loja.nome)
      setWhatsapp(loja.whatsapp)
      setSituacao('salvo')
    } catch (falha) {
      setErro((falha as Error).message)
      setSituacao('editando')
    }
  }

  return (
    <form className="ad-cartao ad-form-loja" onSubmit={salvar} noValidate>
      <Campo rotulo="Nome da loja" erro={erros.nome}>
        {(controle) => (
          <input
            {...controle}
            value={nome}
            onChange={(e) => {
              setNome(e.target.value)
              setErros((atuais) => ({ ...atuais, nome: undefined }))
              setSituacao('editando')
            }}
          />
        )}
      </Campo>
      <Campo
        rotulo="WhatsApp que recebe os pedidos"
        dica="Com DDD. Ex.: (11) 91234-5678"
        erro={erros.whatsapp}
      >
        {(controle) => (
          <input
            {...controle}
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value)
              setErros((atuais) => ({ ...atuais, whatsapp: undefined }))
              setSituacao('editando')
            }}
          />
        )}
      </Campo>
      {erro && (
        <p className="ad-erro" role="alert">
          {erro}
        </p>
      )}
      <button className="ad-botao ad-botao-principal" disabled={situacao === 'salvando'}>
        {situacao === 'salvando' ? 'Salvando…' : 'Salvar'}
      </button>
      {situacao === 'salvo' && (
        <p className="ad-aviso" role="status">
          Salvo! A loja já mostra os dados novos.
        </p>
      )}
    </form>
  )
}

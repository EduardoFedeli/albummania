import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { precoParaEdicao, validarItem, type Rascunho } from '../domain/cadastro'
import { ordenarColecoes } from '../domain/catalogo'
import {
  apagarFoto,
  apagarItem,
  atualizarItem,
  criarItem,
  enviarFoto,
  type DadosDoAdmin,
  type ItemDoAdmin,
} from '../infra/admin'
import { numeral } from '../ui/numeral'
import { Campo } from './Campo'
import { comprimirFoto } from './foto'

interface Props {
  /** null para cadastrar um Item novo. */
  item: ItemDoAdmin | null
  dados: DadosDoAdmin
  colecaoInicial: number | null
  aoSalvar: (salvo: ItemDoAdmin, continuar: boolean) => void
  aoApagar: (id: number) => void
  aoFechar: () => void
}

const rascunhoDoItem = (item: ItemDoAdmin): Rascunho => ({
  colecaoId: String(item.colecaoId),
  codigo: item.codigo ?? '',
  nome: item.nome,
  equipe: item.equipe ?? '',
  raridade: item.raridade ?? '',
  preco: precoParaEdicao(item.precoCentavos),
  estoque: String(item.estoque),
})

const rascunhoNovo = (colecaoId: number | null): Rascunho => ({
  colecaoId: colecaoId ? String(colecaoId) : '',
  codigo: '',
  nome: '',
  equipe: '',
  raridade: '',
  preco: '',
  estoque: '1',
})

/** Os valores já usados viram sugestões no campo, para "Brilhante" não virar "brilhante" e "Brilhantes". */
const sugestoes = (valores: Array<string | null>) =>
  [...new Set(valores.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

export function FormularioDoItem({ item, dados, colecaoInicial, aoSalvar, aoApagar, aoFechar }: Props) {
  const janela = useRef<HTMLDialogElement>(null)
  const campoCodigo = useRef<HTMLInputElement>(null)
  const campoFoto = useRef<HTMLInputElement>(null)

  const unica = dados.colecoes.length === 1 ? dados.colecoes[0].id : null
  const [rascunho, setRascunho] = useState<Rascunho>(() =>
    item ? rascunhoDoItem(item) : rascunhoNovo(colecaoInicial ?? unica),
  )
  const [erros, setErros] = useState<Partial<Record<keyof Rascunho, string>>>({})
  const [fotoNova, setFotoNova] = useState<File | null>(null)
  const [removerFoto, setRemoverFoto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    if (!janela.current?.open) janela.current?.showModal()
  }, [])

  // A prévia da foto escolhida vive num endereço temporário do navegador, liberado quando ela sai da tela.
  const previa = useMemo(() => (fotoNova ? URL.createObjectURL(fotoNova) : null), [fotoNova])
  useEffect(
    () => () => {
      if (previa) URL.revokeObjectURL(previa)
    },
    [previa],
  )
  const fotoNaTela = previa ?? (removerFoto ? null : (item?.foto ?? null))

  const equipes = useMemo(() => sugestoes(dados.itens.map((i) => i.equipe)), [dados.itens])
  const raridades = useMemo(() => sugestoes(dados.itens.map((i) => i.raridade)), [dados.itens])

  // Mexer num campo apaga o erro dele: a mensagem vale para o valor antigo, não para o que está sendo digitado.
  const mudar = (campo: keyof Rascunho) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRascunho((atual) => ({ ...atual, [campo]: e.target.value }))
    setErros((atuais) => ({ ...atuais, [campo]: undefined }))
  }

  const esquecerFoto = () => {
    setFotoNova(null)
    if (campoFoto.current) campoFoto.current.value = ''
  }

  const salvar = async (continuar: boolean) => {
    const validacao = validarItem(rascunho)
    setErros(validacao.ok ? {} : validacao.erros)
    if (!validacao.ok) return

    setErro('')
    setAviso('')
    setSalvando(true)
    let caminhoNovo: string | null = null
    try {
      if (fotoNova) caminhoNovo = await enviarFoto(await comprimirFoto(fotoNova))
      const foto = caminhoNovo ?? (removerFoto ? null : (item?.caminhoDaFoto ?? null))
      const salvo = item ? await atualizarItem(item.id, validacao.item, foto) : await criarItem(validacao.item, foto)
      if (item?.caminhoDaFoto && item.caminhoDaFoto !== foto) void apagarFoto(item.caminhoDaFoto)

      aoSalvar(salvo, continuar)
      if (continuar) {
        // Cadastro em sequência: mantém Coleção, Equipe, Raridade e Preço, e limpa o resto.
        setRascunho((atual) => ({ ...rascunhoNovo(salvo.colecaoId), equipe: atual.equipe, raridade: atual.raridade, preco: atual.preco }))
        esquecerFoto()
        setAviso(`"${salvo.nome}" salvo. Pode cadastrar o próximo.`)
        campoCodigo.current?.focus()
      }
    } catch (falha) {
      // A Foto foi enviada, mas o Item não foi salvo: apaga a Foto para não sobrar arquivo solto.
      if (caminhoNovo) void apagarFoto(caminhoNovo)
      setErro((falha as Error).message)
    } finally {
      setSalvando(false)
    }
  }

  const apagar = async () => {
    if (!item || !window.confirm(`Apagar "${item.nome}"? Não dá para desfazer.`)) return
    setErro('')
    setSalvando(true)
    try {
      await apagarItem(item)
      aoApagar(item.id)
    } catch (falha) {
      setErro((falha as Error).message)
      setSalvando(false)
    }
  }

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
    void salvar(false)
  }

  return (
    <dialog ref={janela} className="adm-janela" aria-labelledby="adm-form-titulo" onClose={aoFechar}>
      <form className="adm-form" onSubmit={enviar} noValidate>
        <div className="adm-form-topo">
          <h2 id="adm-form-titulo" className="adm-titulo">
            {item ? 'Editar item' : 'Novo item'}
          </h2>
          <button type="button" className="adm-fechar" aria-label="Fechar" onClick={aoFechar}>
            ×
          </button>
        </div>

        <div className="adm-foto-campo">
          <div className="adm-foto-previa">
            {fotoNaTela ? (
              <img src={fotoNaTela} alt="Foto do item" />
            ) : (
              <span aria-hidden="true">{numeral({ codigo: rascunho.codigo || null, nome: rascunho.nome || '?' })}</span>
            )}
          </div>
          <div className="adm-foto-acoes">
            <label className="adm-botao adm-botao-leve">
              {fotoNaTela ? 'Trocar foto' : 'Tirar ou escolher foto'}
              <input
                ref={campoFoto}
                className="so-leitor"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const escolhida = e.target.files?.[0] ?? null
                  setFotoNova(escolhida)
                  if (escolhida) setRemoverFoto(false)
                }}
              />
            </label>
            {fotoNaTela && (
              <button
                type="button"
                className="adm-link"
                onClick={() => {
                  esquecerFoto()
                  setRemoverFoto(true)
                }}
              >
                Remover foto
              </button>
            )}
            <p className="adm-dica">Use uma foto do próprio item. O site reduz o tamanho sozinho.</p>
          </div>
        </div>

        <Campo rotulo="Coleção" erro={erros.colecaoId}>
          {(controle) => (
            <select {...controle} value={rascunho.colecaoId} onChange={mudar('colecaoId')}>
              <option value="">Escolha…</option>
              {ordenarColecoes(dados.colecoes).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}
        </Campo>

        <div className="adm-dupla">
          <Campo rotulo="Código" dica="Opcional. Ex.: BRA 10" erro={erros.codigo}>
            {(controle) => <input {...controle} ref={campoCodigo} value={rascunho.codigo} onChange={mudar('codigo')} />}
          </Campo>
          <Campo rotulo="Equipe" dica="Opcional. Ex.: Brasil">
            {(controle) => <input {...controle} list="adm-equipes" value={rascunho.equipe} onChange={mudar('equipe')} />}
          </Campo>
        </div>

        <Campo rotulo="Nome" erro={erros.nome}>
          {(controle) => <input {...controle} value={rascunho.nome} onChange={mudar('nome')} />}
        </Campo>

        <Campo rotulo="Raridade" dica="Opcional. Aparece como selo na foto. Ex.: Brilhante">
          {(controle) => (
            <input {...controle} list="adm-raridades" value={rascunho.raridade} onChange={mudar('raridade')} />
          )}
        </Campo>

        <div className="adm-dupla">
          <Campo rotulo="Preço (R$)" erro={erros.preco}>
            {(controle) => (
              <input
                {...controle}
                inputMode="decimal"
                placeholder="1,50"
                value={rascunho.preco}
                onChange={mudar('preco')}
              />
            )}
          </Campo>
          <Campo rotulo="Estoque" erro={erros.estoque}>
            {(controle) => (
              <input {...controle} inputMode="numeric" value={rascunho.estoque} onChange={mudar('estoque')} />
            )}
          </Campo>
        </div>

        <datalist id="adm-equipes">
          {equipes.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
        <datalist id="adm-raridades">
          {raridades.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>

        {erro && (
          <p className="adm-erro" role="alert">
            {erro}
          </p>
        )}
        {aviso && (
          <p className="adm-aviso" role="status">
            {aviso}
          </p>
        )}

        <div className="adm-form-acoes">
          <button type="submit" className="adm-botao adm-botao-principal" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
          {!item && (
            <button type="button" className="adm-botao" disabled={salvando} onClick={() => void salvar(true)}>
              Salvar e cadastrar outro
            </button>
          )}
          {item && (
            <button type="button" className="adm-botao adm-botao-perigo" disabled={salvando} onClick={() => void apagar()}>
              Apagar item
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}

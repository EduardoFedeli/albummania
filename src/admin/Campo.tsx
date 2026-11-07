import { useId, type ReactNode } from 'react'

interface PropsDoControle {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

interface Props {
  rotulo: string
  dica?: string
  erro?: string
  /** Recebe o id e os atributos de acessibilidade e devolve o input ou o select. */
  children: (controle: PropsDoControle) => ReactNode
}

/** Um campo de formulário: rótulo, controle e, embaixo, a dica ou o erro, lidos junto pelo leitor de tela. */
export function Campo({ rotulo, dica, erro, children }: Props) {
  const id = useId()
  const texto = erro ?? dica
  const descricao = texto ? `${id}-descricao` : undefined

  return (
    <div className="adm-campo">
      <label htmlFor={id}>{rotulo}</label>
      {children({ id, 'aria-invalid': erro ? true : undefined, 'aria-describedby': descricao })}
      {texto && (
        <p id={descricao} className={erro ? 'adm-campo-erro' : 'adm-campo-dica'}>
          {texto}
        </p>
      )}
    </div>
  )
}

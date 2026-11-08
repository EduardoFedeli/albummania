import { useState } from 'react'
import { aplicarTema, temaAtual, type Tema } from './tema'

type Props = {
  className: string
  /** Na Vitrine o botão é só o desenho; o nome continua lá para o leitor de tela. */
  soIcone?: boolean
}

/** Troca entre o tema escuro (padrão) e o claro. O botão mostra o tema para onde vai. */
export function BotaoDoTema({ className, soIcone = false }: Props) {
  const [tema, setTema] = useState<Tema>(temaAtual)
  const proximo: Tema = tema === 'escuro' ? 'claro' : 'escuro'
  const rotulo = proximo === 'claro' ? 'Modo claro' : 'Modo escuro'

  return (
    <button
      type="button"
      className={className}
      title={soIcone ? rotulo : undefined}
      onClick={() => {
        aplicarTema(proximo)
        setTema(proximo)
      }}
    >
      <svg
        className="icone-tema"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {proximo === 'claro' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        )}
      </svg>
      <span className={soIcone ? 'so-leitor' : undefined}>{rotulo}</span>
    </button>
  )
}

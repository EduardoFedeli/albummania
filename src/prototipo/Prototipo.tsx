// PROTÓTIPO: variantes na mesma página, trocadas por ?variante=A|B|C|D (só em desenvolvimento).
import { useEffect, useState } from 'react'
import { useDadosPrototipo } from './dados'
import { nomeA, VarianteA } from './VarianteA'
import { nomeB, VarianteB } from './VarianteB'
import { nomeC, VarianteC } from './VarianteC'
import { nomeD, VarianteD } from './VarianteD'

const variantes = { A: [nomeA, VarianteA], B: [nomeB, VarianteB], C: [nomeC, VarianteC], D: [nomeD, VarianteD] } as const
type Chave = keyof typeof variantes
const chaves = Object.keys(variantes) as Chave[]

function lerChave(): Chave {
  const v = new URLSearchParams(location.search).get('variante')?.toUpperCase()
  return chaves.includes(v as Chave) ? (v as Chave) : 'D'
}

export function Prototipo() {
  const { estado } = useDadosPrototipo()
  const [chave, setChave] = useState<Chave>(lerChave)

  const ir = (passo: number) => {
    const proxima = chaves[(chaves.indexOf(chave) + passo + chaves.length) % chaves.length]
    const url = new URL(location.href)
    url.searchParams.set('variante', proxima)
    history.replaceState(null, '', url)
    setChave(proxima)
    scrollTo(0, 0)
  }

  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowLeft') ir(-1)
      if (e.key === 'ArrowRight') ir(1)
    }
    addEventListener('keydown', teclas)
    return () => removeEventListener('keydown', teclas)
  })

  const [nome, Variante] = variantes[chave]
  return (
    <>
      {estado.tipo === 'pronto' ? (
        <Variante {...estado.dados} />
      ) : (
        <p style={{ padding: '2rem' }}>{estado.tipo === 'erro' ? 'Erro ao ler a planilha.' : 'Carregando a planilha…'}</p>
      )}
      <div className="seletor-prototipo" role="toolbar" aria-label="Variantes do protótipo">
        <button onClick={() => ir(-1)} aria-label="Variante anterior">‹</button>
        <span>{chave}: {nome}</span>
        <button onClick={() => ir(1)} aria-label="Próxima variante">›</button>
      </div>
      <style>{`
        body { padding: 0; }
        .seletor-prototipo { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 99;
          display: flex; align-items: center; gap: .5rem; padding: .3rem .4rem; border-radius: 999px;
          background: #ff00aa; color: #fff; font: 600 13px system-ui; box-shadow: 0 2px 10px rgba(0,0,0,.3); }
        .seletor-prototipo button { width: 30px; height: 30px; border: 0; border-radius: 50%;
          background: rgba(255,255,255,.25); color: #fff; font-size: 18px; cursor: pointer; }
      `}</style>
    </>
  )
}

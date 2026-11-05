import { useEffect, useState } from 'react'
import type { Catalogo } from './domain/catalogo'
import { buscarCatalogo } from './infra/supabase'
import { Vitrine } from './ui/Vitrine'
import './ui/vitrine.css'

// União discriminada: é impossível estar "carregando" e "com erro" ao mesmo tempo.
type Estado = { tipo: 'carregando' } | { tipo: 'pronto'; catalogo: Catalogo } | { tipo: 'erro' }

export default function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    buscarCatalogo()
      .then((catalogo) => {
        if (ativo) setEstado({ tipo: 'pronto', catalogo })
      })
      .catch((erro: unknown) => {
        console.error('Não foi possível carregar o Catálogo:', erro)
        if (ativo) setEstado({ tipo: 'erro' })
      })
    // Se o componente sair da tela antes da resposta, a resposta atrasada é ignorada.
    return () => {
      ativo = false
    }
  }, [tentativa])

  if (estado.tipo === 'pronto') return <Vitrine catalogo={estado.catalogo} />

  if (estado.tipo === 'erro') {
    return (
      <main className="vt-pagina">
        <div className="vt-aviso" role="alert">
          <p>Não deu para carregar o catálogo agora. Confira a sua internet e tente de novo.</p>
          <button
            className="vt-botao"
            onClick={() => {
              setEstado({ tipo: 'carregando' })
              setTentativa((n) => n + 1)
            }}
          >
            Tentar de novo
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="vt-pagina" aria-busy="true">
      <p className="so-leitor" role="status">
        Carregando o catálogo…
      </p>
      <div className="vt-esqueleto-topo" />
      <ul className="vt-grade" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="vt-esqueleto" />
        ))}
      </ul>
    </main>
  )
}

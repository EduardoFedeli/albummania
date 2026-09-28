import { useEffect, useState } from 'react'
import { buscarCsv } from './infra/planilha'

// Esqueleto andante (Fase 3): prova que o caminho código → CI → GitHub Pages →
// planilha funciona. A leitura de verdade, com validação, vem na Fase 6.

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; linhas: number }
  | { tipo: 'erro'; mensagem: string }

export default function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' })

  useEffect(() => {
    buscarCsv(import.meta.env.VITE_CSV_CATALOGO_URL)
      .then((csv) => {
        // Provisório: conta as linhas com conteúdo, descontando o cabeçalho.
        const comConteudo = csv
          .split(/\r?\n/)
          .filter((linha) => linha.replaceAll(',', '').trim() !== '')
        setEstado({ tipo: 'pronto', linhas: comConteudo.length - 1 })
      })
      .catch((erro: unknown) => {
        setEstado({ tipo: 'erro', mensagem: String(erro) })
      })
  }, [])

  return (
    <main>
      <h1>Catálogo de Figurinhas</h1>
      {estado.tipo === 'carregando' && <p>Carregando a planilha…</p>}
      {estado.tipo === 'pronto' && <p>{estado.linhas} figurinhas carregadas da planilha.</p>}
      {estado.tipo === 'erro' && <p>Não foi possível carregar a planilha: {estado.mensagem}</p>}
      <p>
        <small>Versão: {import.meta.env.VITE_VERSAO?.slice(0, 7) ?? 'local'}</small>
      </p>
    </main>
  )
}

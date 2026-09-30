import { useEffect, useState } from 'react'
import { buscarCsv } from './infra/planilha'

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; linhas: number }
  | { tipo: 'erro'; mensagem: string }

export default function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' })

  useEffect(() => {
    buscarCsv(import.meta.env.VITE_CSV_CATALOGO_URL)
      .then((csv) => {
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
      <h1>ÁlbumMania</h1>
      {estado.tipo === 'carregando' && <p>Carregando a planilha…</p>}
      {estado.tipo === 'pronto' && <p>{estado.linhas} figurinhas carregadas da planilha.</p>}
      {estado.tipo === 'erro' && <p>Não foi possível carregar a planilha: {estado.mensagem}</p>}
      <p>
        <a href="previa/">Ver a prévia do catálogo</a>
      </p>
      <p>
        <small>Versão: {import.meta.env.VITE_VERSAO?.slice(0, 7) ?? 'local'}</small>
      </p>
    </main>
  )
}

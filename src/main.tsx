import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Prototipo } from './prototipo/Prototipo.tsx'

const Raiz =
  import.meta.env.DEV && new URLSearchParams(location.search).has('variante') ? Prototipo : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Raiz />
  </StrictMode>,
)

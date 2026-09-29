import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const raiz = createRoot(document.getElementById('root')!)

// Import dinâmico dentro do bloco de desenvolvimento: assim nem o CSS nem as imagens do protótipo entram no build.
if (import.meta.env.DEV && new URLSearchParams(location.search).has('variante')) {
  import('./prototipo/Prototipo.tsx').then(({ Prototipo }) =>
    raiz.render(
      <StrictMode>
        <Prototipo />
      </StrictMode>,
    ),
  )
} else {
  raiz.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

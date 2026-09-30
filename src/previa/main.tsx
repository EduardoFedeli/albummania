import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Previa } from './Previa'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Previa />
  </StrictMode>,
)

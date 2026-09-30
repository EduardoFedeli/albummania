import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ImagemDoLink, Prancha } from './Prancha'

const formato = new URLSearchParams(location.search).get('formato')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{formato === 'og' ? <ImagemDoLink /> : <Prancha />}</StrictMode>,
)

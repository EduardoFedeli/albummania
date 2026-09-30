// Prévia para o Vendedor: a Variante D do protótipo publicada numa URL própria, com dados reais da planilha.
import '../styles/tokens.css'
import './previa.css'
import { useDadosPrototipo } from '../prototipo/dados'
import { VarianteD } from '../prototipo/VarianteD'

export function Previa() {
  const { estado, tentarDeNovo } = useDadosPrototipo()

  return (
    <>
      <p className="pv-aviso">Prévia do site: as quantidades e os preços são de exemplo.</p>
      {estado.tipo === 'pronto' && <VarianteD {...estado.dados} />}
      {estado.tipo === 'carregando' && (
        <p className="pv-estado" role="status">
          Carregando as figurinhas…
        </p>
      )}
      {estado.tipo === 'erro' && (
        <div className="pv-estado" role="alert">
          <p>Não deu para carregar as figurinhas agora. Confira a sua internet e tente de novo.</p>
          <button onClick={tentarDeNovo}>Tentar de novo</button>
        </div>
      )}
    </>
  )
}

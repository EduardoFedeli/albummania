const arquivos = import.meta.glob<string>('../assets/bandeiras/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

export const urlDaBandeira = (codigo: string): string | undefined =>
  arquivos[`../assets/bandeiras/${codigo}.svg`]

// Tipos das variáveis de ambiente lidas com import.meta.env (definidas no .env).
interface ImportMetaEnv {
  readonly VITE_CSV_CATALOGO_URL: string
  readonly VITE_CSV_CONFIG_URL: string
  readonly VITE_VERSAO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

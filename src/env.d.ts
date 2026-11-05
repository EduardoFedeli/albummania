interface ImportMetaEnv {
  /** Endereço do projeto no Supabase (ADR-0005). */
  readonly VITE_SUPABASE_URL?: string
  /** Chave publicável do Supabase (sb_publishable_…). Não é segredo: quem protege os dados é a RLS. */
  readonly VITE_SUPABASE_CHAVE_PUBLICA?: string
  /** Só a prévia da V1 ainda lê a planilha. */
  readonly VITE_CSV_CATALOGO_URL: string
  readonly VITE_CSV_CONFIG_URL: string
  readonly VITE_VERSAO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

# Roadmap

Do início à entrega. Cada etapa termina num resultado verificável. O projeto é solo: commits pequenos direto na `main`, sem PRs.

**📍 Estamos aqui: V2, Etapa 2** (o Admin).

**Estratégia com o Vendedor:** ele quer soluções, não perguntas. Entregamos o site funcionando, com o Admin, e só depois perguntamos o que sobrar. O valor é fixo, sem mensalidade, e o Eduardo opera o site.

## V1: figurinhas da Copa 2026 com planilha ✅ (até 2026-11-02)

Descoberta, documentação, spikes, esqueleto andante, checklist das 980 figurinhas, design system e a prévia em `/previa/`. Está tudo na tag `v1-planilha`, e as decisões, nos ADRs 0001 a 0004.

## V2: loja de qualquer Coleção, com Admin

### Etapa 1: fundação e Vitrine ✅

- [x] [ADR-0005](./adr/0005-catalogo-no-supabase-com-admin.md) (Supabase e Admin), vocabulário novo no [CONTEXT.md](../CONTEXT.md) e a [pesquisa sobre fotos](./fotos-e-direitos.md)
- [x] Esquema do banco com RLS ([`supabase/schema.sql`](../supabase/schema.sql)) e dados de exemplo
- [x] Projeto criado no Supabase (São Paulo), SQL rodado e conta de administrador do Eduardo
- [x] Vitrine lendo o Catálogo do Supabase: Coleções, cartões com Foto ou numeral, Preço e Estoque
- [x] Busca tolerante: sem acento e com o Código digitado de qualquer jeito ("HR-013", "hr013", "hr 013")

### Etapa 2: Admin

- [ ] Login com e-mail e senha, e sair
- [ ] Coleções: criar, renomear e ordenar
- [ ] Itens: cadastrar, editar e apagar, com a Foto comprimida no navegador
- [ ] Baixa rápida: achar o Item e usar − / + no Estoque, pensada para o celular
- [ ] Loja: nome e número do WhatsApp

### Etapa 3: Carrinho e Pedido

- [ ] Carrinho (domínio com TDD): adicionar, quantidade até o Estoque, persistência e reconciliação
- [ ] Pedido: total, mensagem, `wa.me`, "copiar mensagem" e "limpar carrinho"

### Etapa 4: no ar

- [ ] ADR-0006: hospedagem no Cloudflare Pages (o GitHub Pages proíbe loja on-line, e o plano Hobby da Vercel não permite uso comercial). Confirmar os termos da Cloudflare
- [ ] Deploy, `base` do Vite na raiz e domínio
- [ ] Acesso automático diário, para o Supabase não pausar, e alerta se o site cair
- [ ] Rodapé com o contato do Vendedor, e README e system design atualizados para a V2

### Etapa 5: entrega

- [ ] Mostrar ao Vendedor e cadastrar uma Coleção com ele
- [ ] Manual de 1 página
- [ ] Perguntas que sobrarem, depois que ele vir o site funcionando

### Se ele pedir depois

- Importação em massa (planilha mais Fotos em lote)
- Lista de Faltantes colada na busca, como na V1
- Analytics de visitas e Pedidos

## Portfólio

- [ ] Fechar o estudo de caso com a virada da V1 para a V2
- [ ] Post no LinkedIn e página do projeto no portfólio

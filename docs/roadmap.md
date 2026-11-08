# Roadmap

Do início à entrega. Cada etapa termina num resultado verificável. O projeto é solo: commits pequenos direto na `main`, sem PRs.

**📍 Estamos aqui: V2, Etapa 4** (no ar: hospedagem, domínio e o site se cuidando sozinho).

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

### Etapa 2: Admin ✅

- [x] Login com e-mail e senha, e sair (`/admin/`, página separada: a Vitrine não carrega a biblioteca do Supabase, e o CI confere)
- [x] Coleções: criar, renomear, ordenar e apagar (só as vazias)
- [x] Itens: cadastrar, editar e apagar, com a Foto comprimida no navegador (WebP, lado maior de até 1.000 px), e "Salvar e cadastrar outro" para cadastrar em sequência
- [x] Baixa rápida: achar o Item e usar − / + no Estoque, pensada para o celular
- [x] Loja: nome e número do WhatsApp, aceitando o número digitado com máscara
- [x] Teste no projeto real: o Eduardo entrou com a própria conta e cadastrou uma Foto, que apareceu na Vitrine (as políticas do Storage funcionam)
- [x] Gravação barrada pela RLS avisa "Nada foi salvo" em vez de parecer que deu certo (um UPDATE barrado não dá erro, só altera zero linhas)

### Etapa 3: Carrinho e Pedido ✅

- [x] Carrinho (domínio com TDD): adicionar, quantidade até o Estoque, persistência no navegador e reconciliação com aviso ao Comprador
- [x] Pedido: mensagem agrupada por Coleção com subtotais e total estimado, `wa.me`, "Não abriu? Copiar mensagem" e "Pedido enviado? Limpar pedido"
- [x] Loja sem WhatsApp configurado: o painel oferece só copiar a mensagem
- [ ] **Eduardo:** pôr um número na aba Loja do Admin e fazer um Pedido de teste pelo celular

### Etapa 4: no ar

- [x] [ADR-0006](./adr/0006-hospedagem-no-cloudflare-pages.md): Cloudflare Pages no endereço gratuito `*.pages.dev`, sem comprar domínio. Termos conferidos: o plano gratuito não restringe uso comercial, só proíbe coletar dados de cartão no site
- [x] `base` do Vite na raiz e o workflow publicando no Cloudflare com o wrangler (pula a publicação, com aviso, enquanto o token não existir)
- [x] Rodapé com o WhatsApp da loja, prévia do link (Open Graph) com título e descrição
- [x] README, README em inglês (com prints novos) e system design reescritos para a V2; [manual de operação](./operacao.md)
- [x] Conta na Cloudflare, token e Account ID no GitHub ([operacao.md](./operacao.md#1-cloudflare-pages))
- [x] Primeiro deploy no Cloudflare: a loja está em https://albummania-966.pages.dev (o nome sem número já era de outra pessoa), lendo o Supabase real. A prévia da V1 passou a apontar para lá
- [x] GitHub Pages desligado (o endereço antigo responde 404)
- [ ] **Eduardo:** acesso diário ao banco no cron-job.org, com aviso de falha por e-mail ([operacao.md](./operacao.md#2-acesso-diário-ao-banco-cron-joborg))

### Etapa 5: entrega

- [ ] Apagar os dados de exemplo e criar a conta do Vendedor no Admin ([operacao.md](./operacao.md#criar-a-conta-do-vendedor-ou-de-outro-administrador))
- [ ] Mostrar ao Vendedor e cadastrar uma Coleção com ele
- [ ] Manual de 1 página para o Vendedor
- [x] "Trocar senha" no Admin (aba Conta). O "esqueci a senha" por e-mail ficou de fora: o e-mail gratuito do Supabase só entrega para membros da organização
- [x] Admin invisível para quem usa bloqueador de anúncio: a EasyList esconde `.ad-item`, e as classes do Admin passaram de `ad-` para `adm-`, com um teste que barra nomes com cara de anúncio
- [ ] Loja renomeada para **GuGiu Cards**, a pedido do Vendedor: título, prévia do link e endereço novo, https://gugiucards.pages.dev (o código está pronto). **Eduardo:** push, nome na aba Loja do Admin, links novos para o Vendedor e só então apagar o projeto `albummania` no Cloudflare
- [x] Modo escuro como padrão, com o botão de tema na Vitrine e no Admin. O teste de contraste passou a conferir os dois temas
- [ ] Imagem da prévia do link da loja (Open Graph)
- [ ] Levar os scripts de teste ponta a ponta (Vitrine e Admin) para o repositório
- [ ] Perguntas que sobrarem, depois que ele vir o site funcionando (nome e domínio, rodapé com CPF ou CNPJ, autorização para o portfólio)

### Se ele pedir depois

- Importação em massa (planilha mais Fotos em lote)
- Lista de Faltantes colada na busca, como na V1
- Analytics de visitas e Pedidos

## Portfólio

- [ ] Fechar o estudo de caso com a virada da V1 para a V2
- [ ] Post no LinkedIn e página do projeto no portfólio

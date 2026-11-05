---
status: accepted
substitui: ADR-0001, ADR-0003
---

# Catálogo no Supabase, com um Admin para o Vendedor

Em 2026-11-04, o Vendedor voltou com outro pedido. Ele quer cadastrar qualquer figurinha, card ou colecionável, com foto e preço por Item, em Coleções que ele mesmo cria, numa área com usuário e senha. A referência dele é o Tramujas Cards. A planilha deixou de servir: cada Item precisa de Foto, e o Vendedor não vai manter colunas nem links. Ele também não mexe em banco de dados. Se algo quebrar, ele chama o Eduardo, que opera o site.

## Decisão

- **Dados:** Coleções, Itens e a configuração da loja (nome e WhatsApp) ficam num Postgres do **Supabase**. As Fotos ficam no **Storage** do Supabase, num bucket público.
- **Vitrine:** lê o Catálogo direto do navegador, pela API REST do Supabase, com `fetch` e a chave publicável. Ela não carrega a biblioteca do Supabase, para o JavaScript continuar pequeno.
- **Admin (`/admin/`):** outra página do mesmo build, como já é a prévia. Usa o `supabase-js` para o login, as gravações e o envio das Fotos. O código do Admin nunca entra na Vitrine.
- **Quem pode gravar** é decidido dentro do banco, pela RLS (Row Level Security). A leitura é pública, e a escrita fica restrita a quem está na tabela `administradores`. O cadastro público de usuários fica desligado, e o Eduardo cria à mão a conta do Vendedor.
- **Fotos:** comprimidas no navegador antes do envio (WebP, até ~1.000 px). O bucket recusa arquivos acima de 1 MB.
- O esquema do banco está em [`supabase/schema.sql`](../../supabase/schema.sql), versionado como qualquer código.

## Opções consideradas

- **Manter a planilha e pôr links de fotos do Google Drive:** o Drive não foi feito para servir imagens a um site, e o Vendedor ficaria sem o Admin com login, que já foi combinado com ele.
- **CMS pronto (Sanity):** daria menos código, mas o painel é genérico. As duas tarefas mais frequentes do Vendedor ficariam piores: dar Baixa pelo celular e cadastrar muitos Itens seguidos.
- **Backend próprio (servidor Node + banco):** um servidor para manter e pagar, justamente o que o projeto evita desde o início.
- **JSON versionado no repositório (o que o Tramujas faz):** toda mudança depende de um deploy, como já registrava o ADR-0001.

## Consequências

- **O custo continua zero.** O plano gratuito do Supabase permite 2 projetos ativos por conta, 500 MB de banco e 1 GB de arquivos. Com Fotos de ~80 KB, cabem mais de 10 mil Itens.
- **Um projeto gratuito pausa depois de 7 dias sem acesso.** Antes da entrega, um acesso automático diário evita a pausa. O agendamento do GitHub não serve para isso, porque ele se desliga depois de 60 dias sem atividade no repositório.
- **A chave publicável vai no JavaScript e não é segredo.** A segurança está toda na RLS. A chave secreta nunca entra no repositório nem no navegador.
- **A edição do Vendedor aparece na hora.** Acabam os ~5 minutos de atraso do CSV publicado.
- **A API devolve no máximo 1.000 linhas por pedido.** A Vitrine lê os Itens em páginas.
- **O projeto fica na conta do Eduardo,** que opera o site. O Vendedor usa só o Admin.
- **Continuam valendo** o [ADR-0002](./0002-pedido-nao-reserva-estoque.md) (o Pedido não reserva Estoque) e o [ADR-0004](./0004-react-na-interface-dominio-em-typescript-puro.md) (regras em TypeScript puro).

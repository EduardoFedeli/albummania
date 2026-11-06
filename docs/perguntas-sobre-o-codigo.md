# Perguntas sobre o código

As perguntas que aparecem ao fim de cada etapa, para estudar com calma depois. **Tente responder antes de abrir a resposta**: é a parte que fixa o aprendizado. Quando você já respondeu na conversa, a sua resposta aparece junto.

## V2, Etapa 1: a Vitrine lendo do Supabase

### 1. A Vitrine usa `fetch` puro, mas o Admin usa a biblioteca `supabase-js`. Por que essa diferença?

<details>
<summary>Resposta</summary>

Por causa do tamanho do JavaScript. A biblioteca do Supabase traz login, envio de arquivos e tempo real, e tem uns 60 KB comprimidos. A Vitrine só precisa **ler** três tabelas, e o Comprador abre a loja pelo celular, às vezes com 4G ruim. A meta do projeto é no máximo 100 KB de JavaScript. O Admin precisa de login e de envio de Fotos, que a biblioteca resolve bem, e só o Vendedor carrega essa página. Um passo do CI barra o deploy se o código do Admin vazar para a Vitrine. Arquivos: [`src/infra/supabase.ts`](../src/infra/supabase.ts) e [`src/infra/admin.ts`](../src/infra/admin.ts).

</details>

### 2. Se o cadastro público de usuários fosse ligado por engano e um estranho criasse uma conta, o que no `schema.sql` impediria essa pessoa de apagar os Itens?

<details>
<summary>Resposta</summary>

As políticas de RLS de escrita exigem `eh_administrador()`, e essa função só responde "sim" para quem está na tabela `administradores`. Uma conta nova não está lá, e ninguém consegue se colocar lá pela API: o papel `authenticated` não tem permissão (GRANT) de inserir nessa tabela. As linhas só entram pelo SQL Editor, que só o Eduardo acessa. O mesmo vale para as Fotos: as políticas do bucket também pedem `eh_administrador()`. Arquivo: [`supabase/schema.sql`](../supabase/schema.sql).

</details>

### 3. O que aconteceria com os 1.895 Itens do Tramujas se a `lerEmPaginas` não existisse?

<details>
<summary>Resposta</summary>

A API do Supabase devolve no máximo 1.000 linhas por pedido. Sem ler em páginas, a Vitrine mostraria os primeiros 1.000 Itens, e os outros 895 sumiriam **sem nenhum erro**: a resposta vem com status 200, só que incompleta. É o tipo de defeito que ninguém percebe até um Comprador procurar um Item que existe e não aparece. Arquivo: [`src/infra/supabase.ts`](../src/infra/supabase.ts).

</details>

## V2, Etapa 2: o Admin

### 4. Por que o "Salvar e cadastrar outro" mantém Coleção, Equipe, Raridade e Preço, mas limpa Código, Nome e Foto?

<details>
<summary>Resposta</summary>

Porque cadastrar em sequência quase sempre é cadastrar Itens parecidos: o Vendedor pega a pilha de cards do Brasil e vai um atrás do outro. Coleção, Equipe, Raridade e Preço se repetem, então manter poupa digitação. Código, Nome e Foto são de cada Item. Se ficassem preenchidos, um clique distraído salvaria o mesmo Item duas vezes. Por isso o cursor também volta para o Código, o próximo campo que muda. Arquivo: [`src/admin/FormularioDoItem.tsx`](../src/admin/FormularioDoItem.tsx).

</details>

### 5. Se a RLS já protege o banco, por que o Admin chama `ehAdministrador()` logo depois do login?

<details>
<summary>Resposta</summary>

A RLS cuida da segurança; o `ehAdministrador()` deixa a tela honesta. Uma conta com login que não está em `administradores` veria o Admin inteiro. E tem um detalhe traiçoeiro: **um UPDATE barrado pela RLS não dá erro, ele só altera zero linhas.** A Baixa pareceria funcionar e nada mudaria no banco. Perguntando antes, a tela já diz "Esta conta não tem acesso". A checagem da tela não protege nada sozinha, porque quem chama a API direto continua barrado pela RLS.

Essa pergunta revelou um ponto fraco, já corrigido: agora cada gravação pede de volta as linhas alteradas e avisa "Nada foi salvo" quando não vem nenhuma (`conferirAlteracao` em [`src/infra/admin.ts`](../src/infra/admin.ts)).

</details>

## V2, Etapa 3: o Carrinho e o Pedido

### 6. O Carrinho guarda só o `itemId` e a quantidade, nunca o preço. O que daria errado se ele guardasse o preço?

> **Sua resposta:** se o vendedor alterar o preço e o item continuar no carrinho, o preço pode não atualizar.

<details>
<summary>Resposta</summary>

**Certo.** O Carrinho fica guardado no navegador e sobrevive a fechar a aba. Se o Vendedor fizer uma liquidação ou corrigir um preço, quem já tinha o Item no Carrinho veria o valor velho, e a mensagem sairia com o total errado.

Tem um segundo motivo, mais grave: **tudo que fica no navegador pode ser editado por quem usa o navegador.** Com o preço guardado ali, dava para trocar R$ 350 por R$ 0,01 nas ferramentas do navegador e mandar o Pedido assim. Por isso o Carrinho guarda só "qual Item e quantos", e Preço e Estoque vêm sempre do banco. Arquivo: [`src/domain/carrinho.ts`](../src/domain/carrinho.ts).

</details>

### 7. Por que tocar em "Finalizar pedido no WhatsApp" não esvazia o Carrinho na hora?

> **Sua resposta:** porque ele ainda pode não continuar com a compra.

<details>
<summary>Resposta</summary>

**Certo.** E o site não tem como saber se a mensagem foi enviada. No computador sem o app, o WhatsApp Web pede para escanear um QR code, e muita gente desiste ali. Se o Carrinho sumisse no clique, o Comprador perderia tudo o que montou. Por isso, depois de finalizar, aparecem "Não abriu? Copiar mensagem" e "Pedido enviado? Limpar pedido": quem decide quando limpar é o Comprador. Arquivo: [`src/ui/PainelDoPedido.tsx`](../src/ui/PainelDoPedido.tsx).

</details>

## V2, Etapa 4: no ar

### 8. No workflow, por que o token da Cloudflare só aparece nos passos de publicar, e não no job inteiro?

<details>
<summary>Resposta</summary>

Porque o `npm ci` e o build rodam código de terceiros: as dependências, os scripts de instalação delas e os plugins do Vite. Se o token estivesse no ambiente do job inteiro, um pacote malicioso (ou invadido) conseguiria lê-lo e mandá-lo para fora, e quem tivesse o token poderia publicar qualquer coisa no lugar da loja. Deixando o token só nos passos do wrangler, ele nunca fica visível para o resto. É o princípio do menor privilégio, o mesmo do token com permissão só de "Cloudflare Pages: Edit". O passo "Conferir se o Cloudflare está configurado" existe porque o GitHub não deixa usar `secrets` num `if`. Arquivo: [`.github/workflows/publicar.yml`](../.github/workflows/publicar.yml).

</details>

### 9. O título da aba vem do banco (`document.title = loja.nome`), mas o nome da loja nas tags Open Graph está escrito à mão no `index.html`. Por quê?

<details>
<summary>Resposta</summary>

Porque quem lê as tags Open Graph é o robô do WhatsApp, que monta a prévia do link sem rodar JavaScript. O título da aba só muda depois que o React carrega e lê o banco, e o robô nunca chega a ver isso. Por isso as tags precisam estar no HTML. O custo é que, se o Vendedor trocar o nome da loja no Admin, a prévia do link continua com o nome antigo até alguém mudar o `index.html`. Arquivo: [`index.html`](../index.html).

</details>

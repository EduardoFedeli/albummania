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

## V2, Etapa 5: preparando a entrega

### 10. Os Itens sumiram do Admin no seu navegador, mas apareciam no navegador de teste. O que explicava a diferença, e por que o console não mostrou erro nenhum?

<details>
<summary>Resposta</summary>

O seu navegador tem um bloqueador de anúncio. Esses bloqueadores usam listas públicas, como a EasyList, com regras do tipo `##.ad-item`: "esconda todo elemento com a classe `ad-item`". As classes do Admin começavam com `ad-` (de "admin"), e o bloqueador achou que os Itens eram propaganda. Ele esconde o elemento com CSS (`display: none`), então o React montou tudo certo e não havia erro para mostrar: a contagem dizia "10 itens", e os 10 estavam no HTML, só que invisíveis.

A depuração seguiu o caminho certo: reproduzir com os dados reais (apareceu tudo), comparar com o seu ambiente (a diferença era a extensão) e provar a causa aplicando as regras da EasyList no navegador de teste (0 de 10 visíveis antes, 10 de 10 depois). O conserto foi na raiz: o prefixo virou `adm-`, e o teste [`src/nomes-de-classe.test.ts`](../src/nomes-de-classe.test.ts) reprova qualquer nome com cara de anúncio (`ad-`, `ads-`, `banner-`, `sponsor-`) que alguém crie no futuro.

</details>

### 11. O Supabase também confere a senha nova. Por que validar o tamanho e a repetição no navegador antes?

<details>
<summary>Resposta</summary>

Por causa da conversa com quem está usando. O Supabase não sabe que existe um campo "Repita a nova senha": essa conferência só pode ser feita na tela. E o erro do tamanho, vindo do banco, chega em inglês e depois de uma ida e volta pela internet. Validando antes, o Vendedor recebe na hora uma frase clara em português ("Use pelo menos 8 caracteres"). A regra fica em TypeScript puro, com testes ([`src/domain/conta.ts`](../src/domain/conta.ts)), e o Supabase continua sendo a última palavra: os erros dele (como "a nova senha precisa ser diferente da atual") também viram frases em português, em [`src/infra/admin.ts`](../src/infra/admin.ts).

</details>

### 12. O tema escolhido fica no `localStorage`, mas quem lê primeiro é um `<script>` solto no `index.html`, e não o React. Por quê?

<details>
<summary>Resposta</summary>

Por causa da ordem em que o navegador trabalha. O `<script>` do `<head>` roda enquanto a página ainda está sendo lida, antes de qualquer pixel aparecer. O React só roda depois que o JavaScript do site chega, e até lá o navegador já pintou a tela uma vez. Se a escolha fosse lida pelo React, quem escolheu o claro veria a loja **piscar escura** em cada visita, até o React trocar. O script é minúsculo e faz uma coisa só: se a escolha salva for "claro", marca o `<html>` com `data-tema="claro"`, e o CSS faz o resto.

Repare que o escuro é o padrão no próprio CSS (`:root`), e não no script. Assim, se o `localStorage` estiver bloqueado ou o script falhar, o site fica no escuro, que é o padrão, e nunca num estado quebrado. O teste prova isso: com o JavaScript do site bloqueado, a página já abre no tema certo. Arquivos: [`index.html`](../index.html) e [`src/ui/tema.ts`](../src/ui/tema.ts).

</details>

### 13. Para criar o tema escuro, nenhum componente mudou de cor no seu CSS. Como isso foi possível?

<details>
<summary>Resposta</summary>

Graças às duas camadas de tokens. Os componentes nunca usam uma cor direta: usam o **nome do uso**, como `--cor-superficie` ou `--cor-destaque`. O tema escuro só redefine o que cada nome significa: `--cor-superficie` passa de branco para azul-noite, e `--cor-destaque` passa de azul-marinho para uma névoa clara. Os cartões, botões e janelas continuam pedindo "a cor de superfície" e recebem a do tema da vez. É o que o design system prometia: "trocar a paleta é mexer só nos primitivos".

A única cor solta que existia, o véu atrás das janelas (`rgb(20 33 61 / 0.55)`), virou o token `--cor-veu`. Tem um detalhe: navegadores antigos não deixam o `::backdrop` herdar variáveis CSS, então ele tem um valor reserva, `var(--cor-veu, ...)`. E o `color-scheme: dark` avisa o navegador para desenhar no escuro o que é dele, como a barra de rolagem e a lista do `<select>`. Arquivos: [`src/styles/tokens.css`](../src/styles/tokens.css) e [`src/styles/tokens.test.ts`](../src/styles/tokens.test.ts).

</details>

### 14. Depois do push com o nome novo, o endereço antigo (`albummania-966`) continua no ar. O que ele mostra?

<details>
<summary>Resposta</summary>

A mesma loja, com os mesmos Itens, porque os dois sites leem o **mesmo banco**: o Cloudflare só guarda os arquivos (HTML, CSS e JavaScript), e os dados vêm do Supabase na hora em que a página abre. Assim que o nome for trocado na aba Loja, o título grande da página muda nos dois endereços.

Mas a aba do navegador e a prévia do link no WhatsApp continuam dizendo "ÁlbumMania" no endereço antigo. Esse nome está escrito no `index.html`, que entrou no site na hora do build. O site antigo é um build antigo, e ninguém vai publicar nele de novo. É a diferença entre o que vem **do banco, na hora** e o que vem **do build, congelado**. Por isso o projeto antigo deve ser apagado depois que o Vendedor tiver o link novo: dois endereços para a mesma loja confundem quem compra.

</details>

### 15. Por que o nome do projeto no Cloudflare virou uma variável (`PROJETO_CLOUDFLARE`) no topo do job, em vez de ficar escrito nos dois passos?

<details>
<summary>Resposta</summary>

Porque os dois passos precisam concordar. O primeiro cria o projeto e o segundo publica nele. Se alguém trocasse o nome só no segundo, a publicação falharia, porque o projeto ainda não existe. Se trocasse só no primeiro, o site novo seria criado vazio e a loja continuaria saindo no endereço antigo, sem erro nenhum. Com o nome num lugar só, não dá para os dois discordarem. A variável fica no `env` do job, e não nos Secrets, porque o nome não é segredo: ele aparece no próprio endereço do site. Arquivo: [`.github/workflows/publicar.yml`](../.github/workflows/publicar.yml).

</details>

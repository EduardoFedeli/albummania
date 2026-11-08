# Operação

O manual de quem cuida do site (o Eduardo). O Vendedor usa só o Admin. As decisões por trás disto estão no [ADR-0005](./adr/0005-catalogo-no-supabase-com-admin.md) (Supabase) e no [ADR-0006](./adr/0006-hospedagem-no-cloudflare-pages.md) (hospedagem).

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Loja (Vitrine) | https://gugiucards.pages.dev, no projeto `gugiucards` do Cloudflare Pages. A loja se chama **GuGiu Cards**, nome escolhido pelo Vendedor em 2026-11-08. Antes, ficava em `albummania-966.pages.dev` (ÁlbumMania é o nome do projeto no repositório) |
| Admin | https://gugiucards.pages.dev/admin/ |
| Banco, login e Fotos | Supabase, projeto `albummania` (região São Paulo), organização E.J Studios, na conta do Eduardo |
| Publicação | GitHub Actions ([`publicar.yml`](../.github/workflows/publicar.yml)), a cada push na `main` |
| Acesso diário e alarme | cron-job.org, na conta do Eduardo |

### Variáveis e segredos

| Nome | Onde fica | É segredo? |
|---|---|---|
| `VITE_SUPABASE_URL` e `VITE_SUPABASE_CHAVE_PUBLICA` | `.env` (no computador) e Variables do GitHub | Não: vão no JavaScript que qualquer visitante baixa |
| `CLOUDFLARE_ACCOUNT_ID` | Variables do GitHub | Não |
| `CLOUDFLARE_API_TOKEN` | Secrets do GitHub | **Sim.** Só os passos de publicar do workflow têm acesso |
| Chave *secret* do Supabase (`sb_secret_…`) | só no painel do Supabase | **Sim.** Nunca entra no repositório nem no site |
| Senha do banco | gerenciador de senhas do Eduardo | **Sim** |

## Configuração inicial (uma vez só)

### 1. Cloudflare Pages

1. Crie uma conta gratuita em https://dash.cloudflare.com/sign-up e confirme o e-mail.
2. **Crie o token.** Clique no ícone de perfil, no canto de cima, e vá em **Profile → API Tokens → Create Token → Create Custom Token**. Dê o nome `albummania-github` e, em **Permissions**, escolha `Account` · `Cloudflare Pages` · `Edit`. Avance até **Create Token** e copie o token, que só aparece uma vez.
3. **Ache o Account ID.** Abra **Workers & Pages** no menu da esquerda: o *Account ID* fica na coluna da direita. Ele também aparece no endereço do painel, logo depois de `dash.cloudflare.com/`.
4. **Cadastre os dois no GitHub**, em **Settings → Secrets and variables → Actions**:
   - na aba **Secrets**, em **New repository secret**: `CLOUDFLARE_API_TOKEN`, com o token;
   - na aba **Variables**, em **New repository variable**: `CLOUDFLARE_ACCOUNT_ID`, com o Account ID.
5. **Publique:** em **Actions → Publicar site → Run workflow**. Na primeira vez, o passo "Criar o projeto no Cloudflare Pages" cria o projeto, e o passo "Publicar no Cloudflare Pages" mostra no log o endereço do site.
6. **Desligue o GitHub Pages**, em **Settings → Pages**, depois de conferir o site no ar. A loja não pode ficar lá (ADR-0006).

### 2. Acesso diário ao banco (cron-job.org)

O Supabase gratuito pausa depois de 7 dias sem acesso. Este acesso faz uma consulta de verdade ao banco uma vez por dia e manda e-mail se ela falhar.

1. Crie uma conta gratuita em https://cron-job.org.
2. Crie um cronjob com:
   - **Title:** `ÁlbumMania: banco`
   - **URL:** o endereço do `VITE_SUPABASE_URL` seguido de `/rest/v1/loja?select=nome&limit=1`
   - **Agenda:** todos os dias, às 9h
   - **Headers** (nas opções avançadas): chave `apikey`, com o valor da `VITE_SUPABASE_CHAVE_PUBLICA`
   - **Notificações:** ligue o aviso por e-mail quando a execução falhar
3. Salve e rode um teste. A resposta certa tem status 200 e o corpo `[{"nome":"…"}]`.

## Tarefas do dia a dia

### Criar a conta do Vendedor (ou de outro administrador)

1. No Supabase, em **Authentication → Users → Add user → Create new user**: o e-mail da pessoa, uma senha e **Auto Confirm User** marcado.
2. No **SQL Editor**, rode, trocando o e-mail:

   ```sql
   insert into public.administradores (user_id)
   select id from auth.users where email = 'email-da-pessoa@exemplo.com'
   on conflict do nothing;
   ```

3. Mande o endereço do Admin e a senha provisória por uma conversa privada. No primeiro acesso, a pessoa troca por uma senha que só ela sabe, na aba **Conta**.

O cadastro público fica desligado (**Authentication → Sign In / Providers**), então uma conta só nasce desse jeito.

### O Vendedor esqueceu a senha

O Admin tem "trocar senha" (aba **Conta**), mas não tem "esqueci a senha" por e-mail: o envio de e-mail do Supabase gratuito só entrega para os membros da organização, e o Vendedor não é membro. Então apague a conta em **Authentication → Users** e crie de novo, com os passos acima e uma senha provisória. Apagar a conta tira a linha dela de `administradores` sozinho (`on delete cascade`). As Coleções e os Itens não mudam.

### A loja mostra "Não deu para carregar o catálogo"

1. **O Supabase pausou?** Abra o painel do Supabase. Se o projeto aparecer como pausado, clique em **Restore project** e espere alguns minutos. Depois descubra por que o cron-job.org não evitou a pausa.
2. **O erro técnico** aparece no console do navegador: abra a loja com o F12 aberto, na aba Console.
3. **As variáveis mudaram?** Confira `VITE_SUPABASE_URL` e `VITE_SUPABASE_CHAVE_PUBLICA` nas Variables do GitHub. Depois de trocar uma variável, publique de novo (**Actions → Publicar site → Run workflow**), porque elas entram no site na hora do build.

### Trocar o nome ou o endereço da loja

O nome aparece em dois lugares, e o endereço vem de um terceiro:

1. **Nome na página:** no Admin, aba **Loja**. Vale na hora, para todo mundo.
2. **Nome na aba do navegador e na prévia do link no WhatsApp:** no [`index.html`](../index.html) (`<title>`, `og:site_name` e `og:title`). O robô do WhatsApp não roda JavaScript, então não lê o nome do banco. Muda no próximo push.
3. **Endereço:** é o nome do projeto no Cloudflare, na variável `PROJETO_CLOUDFLARE` do [`publicar.yml`](../.github/workflows/publicar.yml). Trocar o nome e fazer o push **cria um projeto novo**, num endereço novo. O projeto antigo continua no ar, lendo o mesmo banco, até ser apagado em **Workers & Pages → (projeto antigo) → Settings → Delete project**. Apague só depois de mandar o endereço novo ao Vendedor. Se o nome já for de outra pessoa, o Cloudflare acrescenta um número, como aconteceu com o `albummania-966`: confira o endereço no log do passo "Publicar no Cloudflare Pages".

O nome do projeto no Supabase é só um rótulo do painel (**Project Settings → General**): trocá-lo não muda o endereço do banco nem as chaves.

### Publicar uma mudança

Faça o push na `main`. O GitHub Actions confere tipos, testes e travas e só então publica. Se algo falhar, o site continua na versão anterior. Para publicar de novo sem mudar o código, use **Actions → Publicar site → Run workflow**.

### Cópia de segurança dos dados

Uma vez por mês, no Supabase, abra o **Table Editor**, exporte a tabela `itens` como CSV e faça o mesmo com `colecoes`. Guarde os arquivos com a data no nome. As Fotos ficam no Storage, no bucket `fotos`.

## Limites do plano gratuito

| Serviço | Limite | Onde vigiar |
|---|---|---|
| Supabase | 500 MB de banco, 1 GB de Fotos, 2 projetos ativos por conta, pausa depois de 7 dias sem acesso | Painel do Supabase, em Usage |
| Cloudflare Pages | Acessos aos arquivos ilimitados, até 20.000 arquivos por site | Não deve preocupar: o site tem poucas dezenas de arquivos |
| cron-job.org | Gratuito. Desativa o cronjob sozinho depois de mais de 25 falhas seguidas | O e-mail de falha |

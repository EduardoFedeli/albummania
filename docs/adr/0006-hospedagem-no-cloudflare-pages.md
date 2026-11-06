---
status: accepted
---

# Hospedagem no Cloudflare Pages, com um acesso diário para o Supabase não pausar

O site precisa sair do GitHub Pages: a documentação dele proíbe usá-lo para "online business, e-commerce site". O Vendedor não quer mensalidade e, por enquanto, nem domínio próprio. E o projeto gratuito do Supabase pausa depois de 7 dias sem acesso, o que derrubaria a loja numa semana fraca.

## Decisão

- **O site inteiro (Vitrine, Admin e a prévia da V1) fica no Cloudflare Pages**, no endereço gratuito `*.pages.dev`. Um domínio próprio é opcional e pode entrar depois, sem mudar o código.
- **O deploy continua no GitHub Actions**, no mesmo workflow que confere tipos, testes e as travas: só publica se tudo passar. O wrangler (a ferramenta de linha de comando da Cloudflare) envia a pasta `dist` com `pages deploy`. O token da Cloudflare tem só a permissão "Cloudflare Pages: Edit" e fica nos segredos do repositório, visível apenas aos passos de deploy.
- O `base` do Vite volta para a raiz (`/`).
- **O cron-job.org faz um acesso diário ao banco**: uma consulta à tabela `loja` com a chave publicável. Se a consulta falhar, ele manda e-mail para o Eduardo. É ao mesmo tempo o que mantém o projeto acordado e o alarme de "a loja caiu".

## Opções consideradas

- **Vercel:** o plano Hobby é só para uso pessoal e não comercial. Uma loja precisaria do Pro, por US$ 20 por mês.
- **Workers com arquivos estáticos**, que a Cloudflare recomenda para projetos novos: o endereço inclui o subdomínio da conta (`nome.conta.workers.dev`), e o Pages dá um mais curto (`nome.pages.dev`). Se a Cloudflare aposentar o Pages, a migração é trocar o comando de deploy, porque a pasta `dist` é a mesma.
- **A Cloudflare fazer o build, ligada ao GitHub:** duplicaria a verificação em dois lugares. Com o wrangler no Actions, o pipeline é um só.
- **Acesso diário pelo agendamento do GitHub Actions:** ele se desliga depois de 60 dias sem atividade num repositório público (ADR-0003), justo quando o projeto estiver pronto e parado.
- **Um Worker com Cron Trigger:** funciona, mas não avisa ninguém quando falha. O cron-job.org faz as duas coisas sem código.

## Consequências

- **O custo continua zero.** O contrato da Cloudflare (Self-Serve Subscription Agreement, versão de 12/09/2025) não restringe uso comercial no plano gratuito. A única restrição específica dele é não coletar dados de cartão de crédito no site (cláusula 2.2.1(h)), e a loja não coleta: o pagamento é combinado no WhatsApp.
- **A Cloudflare pode encerrar um serviço gratuito sem aviso** (cláusulas 2.6 e 8). O site é uma pasta de arquivos estáticos, então mudar de hospedagem é questão de trocar o comando de deploy.
- **O endereço `*.pages.dev` não pode ser trocado depois**, só apagando o projeto e criando outro. O nome precisa estar decidido antes de o link ser divulgado.
- **Um acesso diário não é garantia absoluta**: há relatos de projeto pausado mesmo com acesso agendado. O e-mail de falha e o passo a passo de [operacao.md](../operacao.md) cobrem esse caso.
- O Eduardo ganha dois serviços para cuidar (Cloudflare e cron-job.org), ambos documentados em [operacao.md](../operacao.md).

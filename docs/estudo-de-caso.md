# Estudo de caso: Catálogo de Figurinhas

> Diário de bordo do projeto. Uma entrada por fase ou PR, com a decisão mais importante e o que eu aprendi. No fim, vira o post do LinkedIn e a página do portfólio.

## O problema

Um colecionador vende as suas figurinhas repetidas do álbum da Copa 2026 e mandava a lista inteira pelo WhatsApp a cada interessado. Ele queria um link para compartilhar, onde a pessoa escolhe as figurinhas e já manda o pedido no WhatsApp dele.

As restrições: custo zero, sem pagamento online e, principalmente, **ele precisa atualizar o estoque sozinho**, sem depender de mim.

## Diário de bordo

### Fase 0: Descoberta, antes de qualquer código

**Decisão:** o site não tem backend nem banco de dados. O estoque mora numa planilha Google que o próprio vendedor edita, e o site só lê essa planilha. Cheguei a desenhar uma "V2" que registrava cada pedido para o vendedor confirmar depois se a venda fechou ou não. Era o modelo mais correto, mas exigiria um backend (endpoint público, spam, pedidos abandonados). Deixei registrada como alternativa rejeitada num ADR.

**Aprendi:**

- **Nomear as coisas é design.** "Comprar" parecia o nome óbvio do botão, mas ninguém compra nada no site. O site gera um **Pedido** (uma intenção), e a **Venda** acontece na conversa. Separar os dois termos no glossário evitou que o código prometesse algo que ele não faz.
- **Pesquisar a referência por dentro.** O site em que me inspirei guardava os dados num JSON de 1.322 itens editado à mão, com a mesma coleção escrita de dois jeitos e um campo de status redundante com o estoque. Isso me mostrou o que acontece quando não existe um modelo de dados.
- **Dizer não também é engenharia.** A V2 era mais elegante, mas o problema não pedia isso. O ADR explica o porquê para quem vier depois.

### PR #1: System design

**Decisão:** o código fica em camadas. As regras de negócio vivem em TypeScript puro (`domain/`), separadas de tudo o que toca o mundo externo (rede, armazenamento, tela). O navegador faz o papel que um backend faria.

**Aprendi:**

- **Primeiro impedir, depois reagir.** Na análise de modos de falha, a melhor resposta para "o vendedor apaga uma linha sem querer" não é um aviso no site. É proteger as colunas da planilha para que isso não aconteça.
- **Guardar a referência, não a cópia.** O carrinho guarda só "qual figurinha e quantas". Preço e estoque sempre vêm do catálogo atual, senão uma liquidação feita ontem não apareceria para quem montou o carrinho antes.
- **Os nomes das colunas da planilha são um contrato**, como uma API. Se o vendedor renomear "Estoque", o código não encontra a coluna, e o site precisa ter um plano para isso.
- **Núcleo funcional, casca imperativa.** A função que monta a mensagem do pedido recebe dados e devolve texto, sem internet. Por isso ela é testável em milissegundos e continua certa mesmo se o Google cair.
- Uma melhoria saiu da minha própria análise de falhas: o site não tem como saber se o WhatsApp abriu no computador do comprador, então ganhou um botão **"Não abriu? Copie a mensagem"**.

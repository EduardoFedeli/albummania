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

### Fase 2: Spikes, testar os riscos antes de escrever código

**Decisão:** a leitura da planilha direto pelo navegador foi aprovada ([ADR-0003](./adr/0003-planilha-lida-no-navegador-via-csv-publicado.md)), agora com medições reais em vez de suposições. No processo, também abandonei os pull requests: num projeto solo, eles viravam burocracia. A proteção contra código quebrado fica no CI, que só publica o site se todos os testes passarem.

**Aprendi:**

- **CORS na prática.** O navegador só deixa o nosso site ler o CSV porque o Google responde "pode ler". O teste mostrou um detalhe que nenhuma documentação conta: a URL redireciona para outro servidor, e os dois precisam liberar.
- **Consistência eventual.** Depois que mudei o estoque de uma figurinha, o CSV ficou uns 4 minutos alternando entre o valor novo e o antigo, conforme o servidor do Google que respondia. Em 40 leituras seguidas, 24 vieram novas e 16 antigas. Como o projeto já aceitava estoque defasado ("sujeito a confirmação"), a arquitetura ficou de pé, e o manual do vendedor vai avisar que uma mudança leva até 5 minutos.
- **Dados reais são bagunçados.** Um `[` digitado sem querer numa célula distante virou cinco linhas vazias no CSV, e eu esqueci de pôr cabeçalho numa aba. Os dois "erros" melhoraram o design: agora o código ignora linhas vazias e não exige cabeçalho na aba de configuração.
- **Um spike é uma pergunta com prazo.** O pior cenário de mensagem (200 figurinhas) cabia com folga no WhatsApp. Descobri isso em minutos, testando no celular, em vez de descobrir em produção.

### Fase 3: Esqueleto andante

**Decisão:** antes de qualquer tela bonita, pus no ar a versão mais simples possível que percorre o caminho inteiro: código, testes automáticos, build, GitHub Pages e leitura da planilha. O site só dizia "3 figurinhas carregadas da planilha" e mostrava a versão do commit, mas cada `git push` já publicava sozinho.

**Aprendi:**

- **O que acontece entre o `git push` e o site no ar.** O GitHub Actions liga um computador temporário que instala as dependências, verifica os tipos, roda os testes e faz o build. Só então o Pages recebe os arquivos. Se um teste falha, a publicação nem começa, e o site continua na versão anterior.
- **Por que existe build.** O navegador não entende TypeScript nem JSX. O Vite traduz o código para HTML, CSS e JavaScript comum.
- **Buscar dados no React fica dentro de um `useEffect`.** O corpo do componente roda a cada redesenho, então buscar dados ali criaria um laço infinito: busca, atualiza o estado, redesenha, busca de novo...
- **Variáveis `VITE_` são públicas.** Elas vão parar dentro do JavaScript que qualquer visitante baixa, então nunca podem guardar segredo, nem no `.env.local`.
- **Confiança também é requisito.** Um link com o meu nome (`eduardofedeli.github.io`) pode parecer estranho para os compradores do vendedor, então o endereço virou uma pergunta para ele.

### Fase 4: Dados

**Decisão:** em vez de pedir ao vendedor que cadastrasse as figurinhas, montei eu mesmo o checklist completo do álbum (980 figurinhas) e deixei para ele só a coluna de estoque. A planilha tem as outras colunas protegidas, validação no estoque e já está publicada com um estoque de demonstração para o beta.

**Aprendi:**

- **Uma fonte de dados só não basta.** Cruzei três checklists da internet. Um tinha a grafia certa, mas a numeração errada no Brasil e no Paraguai. Os outros dois tinham a numeração certa, mas nomes estragados por OCR ("Kusini **V**engi"). A regra final: numeração de quem tinha duas confirmações, grafia de quem escrevia certo, e correções à mão onde todos erravam.
- **A verdade de campo decide.** Uma foto da página da Espanha no álbum real bateu figurinha por figurinha. E os totais bateram com os números oficiais: 980 figurinhas, 68 especiais. Se o BRA 16 estivesse errado, quem procurasse o "BRA 16" receberia o jogador errado.
- **Testar os dados, não só o código.** Um teste automático confere, a cada push, que existem exatamente 980 figurinhas, sem repetição, de 1 a 20 em cada seleção. Uma linha perdida entre 980 passaria despercebida por qualquer revisão manual.
- **Fato fixo mora no código, dado vivo mora na planilha.** As cores das bandeiras e a ordem das seleções nunca mudam, então ficam no código, onde o vendedor não consegue estragar sem querer. Estoque e preço mudam toda semana, então ficam na planilha, onde ele consegue mexer sozinho.

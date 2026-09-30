# Design System

> Documento vivo. As seções marcadas como *a definir* serão fechadas na fase de exploração visual.

## Conceito: Álbum de papel

O site parece as páginas internas do próprio álbum. Cada Figurinha é mostrada como o **espaço vazio do álbum**, com o Código em destaque, porque é isso que o colecionador procura quando folheia as páginas. A metáfora vem do domínio, não é decoração: ela reforça a busca por Código.

- **Tema único, claro**: as páginas internas do álbum. O tema escuro foi descartado em 2026-09-29, porque é complexidade sem retorno para quem abre um link de WhatsApp para comprar figurinhas.

### O que o álbum real ensina

Referências: fotos das páginas de Espanha e Argentina (fotos reais). A imagem "We Are Brazil" que circula na internet parece **gerada por IA** (nomes com erros, como "Rodryoo" e "Marceco") e não serve como referência fiel.

- **O espaço vazio** é um retângulo arredondado **chapado**, numa versão clara da cor da página, com um numeral gigante ao fundo, o Código pequeno no topo ("ESP 2") e o nome do jogador na base. Não tem tracejado.
- **Cada seleção tem a sua paleta**, tirada da bandeira (Espanha: vermelho, laranja e amarelo; Argentina: azul-celeste e laranja; México: verde e vermelho), aplicada em **blocos de cor chapada e geométricos**, sem gradientes.
- **Tipografia display** muito pesada e arredondada nos títulos ("WE ARE SPAIN"), e texto pequeno em caixa alta nos nomes.
- **Elementos de apoio:** bloco "GROUP H" com bandeiras e a tabela de jogos no rodapé da página.
- O numeral gigante "26" é a **marca registrada da FIFA** e não pode ser usado. **No nosso espaço, o numeral gigante é o próprio número da Figurinha** ("10" enorme, "BRA" pequeno), o que é ao mesmo tempo nosso e mais útil para a busca.

## Processo de exploração

1. Três variações radicalmente diferentes dentro do conceito, como protótipos descartáveis com dados reais: **Retrô 70**, **Álbum 2026** e **Caderno do colecionador**.
2. Screenshot, crítica e iteração (2 ou 3 ciclos).
3. A escolhida (ou a mistura) vira os tokens oficiais e a página `/styleguide`.
4. Auditoria de acessibilidade AA e, depois, o envio para o Vendedor aprovar.

**Interação-assinatura:** ao adicionar, a Figurinha "cola" no espaço. Com `prefers-reduced-motion`, vira só uma troca de estado, sem animação.

## Direção escolhida (2026-09-28)

Das três variações do protótipo, a escolha foi uma **mistura**, montada como Variante D (`npm run dev` → `?variante=D`). As telas de cada variação estão em [`docs/design/prototipo/`](./design/prototipo/).

| Da variação | Vem |
|---|---|
| **C · Caderno** | a **estrutura**: a página abre com "Quais faltam no seu álbum?" e o campo para colar a Lista de Faltantes; o resultado diz "Você procurou 8. Temos 5." e oferece "Adicionar as 5" |
| **B · Álbum 2026** | o **visual**: página branca, tinta azul-marinho, uma página por Seção com blocos geométricos nas cores da bandeira, e cada Figurinha como espaço tom sobre tom com o numeral gigante |
| **A · Retrô 70** | as **esgotadas continuam visíveis, mas apagadas** (borda tracejada, numeral quase invisível e a palavra "acabou"), para o Comprador ver o álbum inteiro e não só o que está à venda |

**Descartado:** a paleta e a tipografia dos anos 70 (Shrikhand), a letra de mão do caderno (Caveat) e o papel quadriculado.

**Base provisória, até os tokens:** Unbounded (títulos e numerais) + Instrument Sans (texto), tinta `#14213D`, ação `#00A650`, espaços em 3 colunas no celular. Tocar num espaço adiciona a Figurinha, e ela ganha contorno e um selo com a quantidade.

**Os 4 pontos em aberto, resolvidos nos tokens (2026-09-29):**

1. **`0` × `O`:** na Unbounded eles são quase iguais. Por isso ela fica **só em títulos e no numeral decorativo**, que sempre vem junto do Código escrito. Códigos, índice, quantidades e preços usam a Instrument Sans, com números tabulares.
2. **Rolagem longa:** cada Seção mostra uma **tira com os 20 números** (disponíveis tingidas, as do pedido em azul-marinho, as esgotadas tracejadas), e embaixo ficam os espaços grandes **só das disponíveis**. A página do Brasil caiu de ~2.200px para ~1.000px. No resultado da Lista de Faltantes, as esgotadas continuam como espaços apagados, com "acabou".
3. **Contraste AA:** garantido por teste automático ([`tokens.test.ts`](../src/styles/tokens.test.ts)): cada par de texto e fundo, e o texto sobre o espaço de **cada uma das 50 Seções**. O teste foi sabotado de propósito para provar que reprova quando deve.
4. **Tirar do Carrinho:** fica a cargo do componente Painel do Carrinho, com − e +. Tocar num espaço só adiciona.

## Critérios de pronto (acessibilidade)

- WCAG 2.1 **AA** obrigatório (texto com contraste de 4.5:1).
- Alvos de toque de pelo menos 44px.
- Carrinho anunciado por leitor de tela.
- Tudo navegável por teclado.
- Tipo nunca diferenciado só por cor.

## Decisões

- **Tema:** só claro. Sem botão de tema e sem seguir a preferência do sistema.
- **Layout:** mobile-first. No celular, o conteúdo ocupa a tela com margem de 1rem. Em telas largas, fica numa coluna de no máximo `--largura-conteudo` (64rem), centralizada, com a grade de espaços se adaptando à largura (3 colunas no celular, 6 no desktop), a tira de números numa linha só e a barra do pedido como pílula centralizada de até `--largura-leitura` (38rem). [Tela no desktop](./design/layout-desktop.png).
- **Índice de seleções = filtro:** no celular é uma lista horizontal de arrastar; no desktop largo (a partir de 72rem), uma **barra lateral fixa agrupada por Grupo**, como a tabela de grupos da Copa. Cada seleção é um botão de marcar: nenhuma marcada mostra todas, e marcar Brasil e Suíça mostra só as páginas delas, com o aviso "Mostrando: Suíça e Brasil." e o botão "Mostrar todas".
- **Espaço de Figurinha:** mostra o Estoque real ("3 disponíveis"). Tocar no espaço adiciona uma unidade, e no lugar aparece o controle **− quantidade +** (botões de 44px). O + fica desativado quando a quantidade chega ao Estoque.
- **Barra e Painel do Carrinho:** a barra mostra o resumo e o botão **"Ver pedido"**, que abre o Painel (de baixo para cima no celular, centralizado no desktop), com − / + em cada item, o total estimado e **"Finalizar pedido no WhatsApp"**. O comprador sempre revisa antes de enviar. Depois do envio aparecem "Pedido enviado? Limpar pedido" e "Não abriu? Copiar mensagem".
- **Cabeçalho da Seção:** bandeira, nome e contagem direto sobre a faixa tingida, sem caixa branca. O texto reserva o lado direito para as formas decorativas, e no celular estreito o terceiro bloco some para os nomes longos ("Bósnia e Herzegovina") caberem.
- **Fundo:** azul-acinzentado bem claro (`#EEF1F6`) com uma **retícula de impressão** sutil (`--textura-fundo`), e os elementos de destaque (espaços, rótulos, caixas, campos) em **superfície branca** por cima. O branco puro em tela cheia cansava a vista, e isso resolve para todo mundo, sem precisar de tema escuro. Bege foi evitado de propósito, porque é o clichê nº 1 de design gerado por IA. Com o fundo novo, o teste de contraste reprovou o verde de ação antigo, que foi escurecido para `#007A3B`, com texto branco.
- **Bandeiras:** SVGs do projeto open source [flag-icons](https://github.com/lipis/flag-icons) (licença MIT, cópia em [`src/assets/bandeiras/LICENSE`](../src/assets/bandeiras/LICENSE)), só as 48 que usamos. Aparecem no índice e no rótulo de cada Seção, sempre com um contorno fino, para as bandeiras brancas (Japão, Inglaterra) não sumirem. Não usamos emoji de bandeira porque ele **não funciona no Windows**: o Edge e o Chrome mostram as letras ("BR") em vez da bandeira.
- **Sem imagens das figurinhas:** não existe API oficial, e a arte é da Panini. O numeral gigante cumpre o papel visual. Se o Vendedor quiser, a coluna Imagem aceita fotos que ele mesmo tirar.
- **Tokens em duas camadas**, em CSS custom properties:
  - *primitivos*: valores brutos (`--green-700: …`);
  - *semânticos*: o uso (`--color-action: var(--green-700)`).
  Os componentes só usam tokens semânticos. Trocar a paleta a pedido do Vendedor significa mexer só nos primitivos.
- **Styleguide:** a página `/styleguide` é publicada junto com o site e mostra paleta, tipografia e todos os componentes em todos os estados.
- **Prancha:** uma imagem de apresentação (paleta, tipografia e componentes numa composição só) enviada ao Vendedor junto com a prévia. A página [`previa/prancha.html`](../previa/prancha.html) monta a prancha com **os componentes e o CSS reais**, e lê os códigos das cores direto dos tokens. O comando `npm run imagens` faz o build, abre essa página e captura [`docs/design/prancha.png`](./design/prancha.png) (1920×1080 em 2x) e a imagem da prévia do link no WhatsApp, `public/previa/og.png` (1200×630). Assim é uma única fonte da verdade: se um token muda, é só rodar o comando de novo, sem retrabalho num editor de imagens.
- **Cor por Seção:** cada Seção tem de 2 a 3 cores tiradas da bandeira, guardadas num arquivo de dados no código (é um fato fixo, e o Vendedor não mexe nisso). A cor aparece **só no cabeçalho da Seção e na tinta de fundo dos espaços**, como decoração. O texto fica sempre sobre o papel neutro. Os componentes recebem a cor como parâmetro e precisam funcionar com qualquer uma das 48.
- **Crédito no rodapé:** "feito por Eduardo Fedeli", discreto, com link. Depende da autorização do Vendedor.
- **Canal:** só WhatsApp. A prévia do link (Open Graph) faz parte do design system.
- **Links para uma Seção:** `…/#BRA` abre a página já na Seção.

## Anti-lista (o que nos faria parecer um site genérico)

- Inter/Roboto/fonte do sistema como identidade.
- Gradientes roxo/azul, glassmorphism, brilho neon.
- Cards brancos genéricos com sombra suave e cantos muito arredondados.
- Ícones de emoji ou ícones decorativos que não comunicam nada.
- Imitar a identidade verde-escuro + dourado do site de referência (Tramujas Cards).
- Marcas registradas da Panini/FIFA (logo, troféu oficial, o numeral "26", a tipografia proprietária do "We Are").
- Colocar fotos da internet dentro do repositório público (as referências ficam fora do Git).

## Componentes

- Espaço de Figurinha (disponível, no pedido, esgotada)
- Tira de números da Seção
- Cabeçalho de Seção (blocos da bandeira + rótulo)
- Índice de Seções
- Busca pela Lista de Faltantes e o seu resultado
- Barra do Pedido (fixa no rodapé)
- Painel do Carrinho (com − e +)
- Chip de Tipo
- Aviso de reconciliação do Carrinho
- Aviso de catálogo defasado / erro
- Skeleton de carregamento
- Imagem de prévia do link (Open Graph)
- Prancha do design system

## Tokens

A fonte da verdade é [`src/styles/tokens.css`](../src/styles/tokens.css). Os componentes usam **só os tokens semânticos** (`--cor-texto`, `--espaco-4`...), nunca os primitivos nem valores soltos. [Tela com os tokens aplicados](./design/tokens-miolo.png).

| Grupo | Tokens | Regra |
|---|---|---|
| **Cor** | fundo, superfície, texto, texto fraco/apagado, borda, ação, destaque, foco, erro, brilho | tinta azul-marinho `#14213D`; ação verde |
| **Cor da Seção** | `--mistura-cabecalho`, `--mistura-espaco`, `--mistura-numeral` | a cor da bandeira é misturada ao fundo com `color-mix()`, então se adapta a qualquer fundo; texto nunca fica direto sobre a cor pura |
| **Tipografia** | `--fonte-titulo` (Unbounded), `--fonte-texto` (Instrument Sans), escala 1,25 de 0,8 a 3,05rem | Unbounded só em títulos e no numeral decorativo |
| **Espaço** | `--espaco-1` a `--espaco-8` (4px a 64px) | múltiplos de 4px |
| **Forma** | raios 8/12/16px e pílula; `--alvo-minimo: 44px` | todo controle tocável tem pelo menos 44px |
| **Layout** | `--largura-conteudo: 64rem`, `--largura-leitura: 38rem` | conteúdo centralizado em telas largas; campos de texto e a barra do pedido não passam da largura de leitura |
| **Movimento** | `--duracao-rapida: 150ms` | zera com `prefers-reduced-motion` |

**Pegadinha registrada:** uma variável CSS é calculada **onde é declarada**, não onde é usada. A mistura com a cor da Seção precisa ser declarada no elemento que conhece `--c1` (a Seção ou o espaço), e não na raiz.

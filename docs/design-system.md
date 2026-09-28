# Design System

> Documento vivo. As seções marcadas como *a definir* serão fechadas na fase de exploração visual.

## Conceito: Álbum de papel

O site parece as páginas internas do próprio álbum. Cada Figurinha é mostrada como o **espaço vazio do álbum**, com o Código em destaque, porque é isso que o colecionador procura quando folheia as páginas. A metáfora vem do domínio, não é decoração: ela reforça a busca por Código.

- **Tema claro = miolo** (as páginas internas).
- **Tema escuro = capa** (papelão escuro, com o Código em destaque metalizado).

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

## Critérios de pronto (acessibilidade)

- WCAG 2.1 **AA** obrigatório (texto com contraste de 4.5:1).
- Alvos de toque de pelo menos 44px.
- Carrinho anunciado por leitor de tela.
- Tudo navegável por teclado.
- Tipo nunca diferenciado só por cor.

## Decisões

- **Tema:** claro por padrão, sempre (não segue a preferência do sistema). Existe um botão para o tema escuro, e a escolha fica salva no navegador.
- **Tokens em duas camadas**, em CSS custom properties:
  - *primitivos*: valores brutos (`--green-700: …`);
  - *semânticos*: o uso (`--color-action: var(--green-700)`).
  Os componentes só usam tokens semânticos. Trocar a paleta a pedido do Vendedor significa mexer só nos primitivos, e cada tema é um conjunto de valores semânticos.
- **Styleguide:** a página `/styleguide` é publicada junto com o site e mostra paleta, tipografia e todos os componentes em todos os estados.
- **Prancha:** uma imagem de apresentação (paleta, tipografia e componentes numa composição só) enviada ao Vendedor junto com o beta. Ela é **gerada automaticamente** a partir de uma seção do `/styleguide`, com uma captura de tela em alta resolução. Assim é uma única fonte da verdade: se um token muda, a prancha muda junto, sem retrabalho num editor de imagens. O formato de "prancha" é inspiração, mas o estilo segue o nosso conceito, e não o visual genérico de kits de UI.
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

- Linha de Figurinha
- Cabeçalho de Seção
- Índice de Seções
- Chip de Tipo
- Busca / Lista de Faltantes
- Barra do Carrinho (fixa no rodapé)
- Painel do Carrinho
- Aviso de reconciliação do Carrinho
- Aviso de catálogo defasado / erro
- Skeleton de carregamento
- Imagem de prévia do link (Open Graph)

## Tipografia, paleta e espaçamento

*A definir na exploração visual.*

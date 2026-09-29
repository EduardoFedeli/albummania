# Roadmap

Do início à entrega. Cada fase termina num resultado verificável. O projeto é solo: commits pequenos direto na `main`, sem PRs.

**📍 Estamos aqui: Fase 5 (design system).** Direção escolhida e tokens prontos; próximo passo: os componentes e a página `/styleguide`. O esqueleto andante está no ar em https://eduardofedeli.github.io/catalogo-figurinhas/.

**Estratégia com o Vendedor:** as perguntas só vão junto com algo para ele avaliar, ou seja, o **beta** (marco 🎯 na Fase 6). Até lá, trabalhamos com o checklist oficial e um Estoque de demonstração.

## Fase 0: Descoberta e decisões ✅

- [x] Entender o problema, o domínio e as restrições (sessão de perguntas)
- [x] Glossário do domínio: [CONTEXT.md](../CONTEXT.md)
- [x] Decisões de arquitetura: [ADR-0001 a 0004](./adr/)
- [x] Conceito visual: [design-system.md](./design-system.md)
- [x] Lista de perguntas ao Vendedor: [perguntas-ao-vendedor.md](./perguntas-ao-vendedor.md)

## Fase 1: Documentação de engenharia ✅

- [x] System design: [system-design.md](./system-design.md)
- [x] Roadmap (este arquivo) e início do [estudo de caso](./estudo-de-caso.md)

## Fase 2: Spikes, validar os riscos antes de codar ✅

- [x] **S1:** CORS liberado; a edição aparece para todos em até ~5 min ([ADR-0003](./adr/0003-planilha-lida-no-navegador-via-csv-publicado.md))
- [x] **S3:** números chegam como `"1,5"` (formatados, com vírgula)
- [x] **S2:** um Pedido de 200 figurinhas (~1.100 caracteres) abre inteiro no celular e no computador
- [x] Registrar os resultados: ADR-0003 `accepted`
- (movido para a Fase 4) testar se a proteção de colunas impede o Vendedor de apagar linhas, na planilha real

**Pronto quando:** nenhum risco da §13 do system design estiver sem resposta.

## Fase 3: Esqueleto andante (walking skeleton) ✅

- [x] Projeto Vite + React + TypeScript e Vitest (o Playwright entra com o primeiro teste E2E, quando houver um fluxo para testar)
- [x] CI no GitHub Actions (typecheck, testes e build a cada push na `main`): `.github/workflows/publicar.yml`
- [ ] Deploy automático no GitHub Pages, só se o CI passar (com o `base` do Vite)
- [x] Uma página que lê o CSV da planilha de teste e mostra quantas linhas vieram
- [x] Ativar o GitHub Pages (Settings → Pages → Source: GitHub Actions) e confirmar o site no ar

**Pronto quando:** um merge na `main` publica sozinho um site que lê a planilha. Não tem nada bonito ainda, mas o caminho inteiro, do código até o site no ar, funciona.

## Fase 4: Dados ✅

- [x] Checklist oficial da Copa 2026 → 980 linhas, com Código, Nome e Tipo, cruzando 3 fontes ([origem](./modelo-da-planilha.md#de-onde-vem-o-checklist))
- [x] `src/data/secoes.ts`: sigla, nome, Grupo, ordem no Álbum e cores da bandeira de cada Seção (as cores serão ajustadas na Fase 5)
- [x] Planilha real: abas Catálogo e Config, validação de células, colunas protegidas e publicação
- [ ] Testar, com outra conta Google como editora, se a proteção impede apagar linhas (quando o Vendedor for adicionado)
- [x] [`docs/modelo-da-planilha.md`](./modelo-da-planilha.md): o contrato da planilha, documentado
- [x] Estoque de demonstração para o beta: `dados/catalogo-demo.csv`
- [ ] Preencher o Estoque real com a lista do Vendedor (depois do beta)

## Fase 5: Design system

- [x] 3 variações descartáveis (Retrô 70, Álbum 2026, Caderno do colecionador) com dados reais, em `?variante=A|B|C`
- [x] Escolher a direção: mistura de C (abertura com a Lista de Faltantes) + B (páginas e espaços) + A (esgotadas apagadas), como Variante D ([decisão](./design-system.md#direção-escolhida-2026-09-28))
- [x] `tokens.css`: primitivos e semânticos, tema claro, com contraste AA garantido por teste nas 50 Seções; os 4 pontos abertos resolvidos ([tokens](./design-system.md#tokens))
- [ ] Componentes do design system, com todos os estados
- [ ] Página `/styleguide`
- [ ] Remover `src/prototipo/` da `main` quando os componentes oficiais existirem
- [ ] Revisão de acessibilidade AA
- [ ] **Prancha do design system**: imagem PNG com paleta, tipografia e componentes, gerada automaticamente a partir do `/styleguide`

## Fase 6: Funcionalidades (commits pequenos por funcionalidade, domínio com TDD)

### 6a. O mínimo para o beta

- [ ] Ler e validar as abas + carregamento com cache (stale-while-revalidate)
- [ ] Página de diagnóstico (`?diagnostico`): as linhas ignoradas pela validação, em português
- [ ] Catálogo agrupado por Seção, índice de Seções e links `#SEÇÃO`
- [ ] Carrinho: adicionar, quantidade, persistência e reconciliação
- [ ] Pedido: total por Tipo, mensagem, `wa.me`, "copiar mensagem" e "limpar carrinho"

### 🎯 Marco: beta para o Vendedor

- [ ] Beta publicado com o checklist completo e Estoque de demonstração
- [ ] Enviar ao Vendedor: link do beta + prancha do design system + [perguntas](./perguntas-ao-vendedor.md) (oferta de cadastrar as figurinhas, manual de Estoque, preço por Tipo)
- [ ] Incorporar as respostas (preços, nome, cores, ajustes de visual)

### 6b. O restante

- [ ] Busca tolerante (código, nome sem acento, Seção)
- [ ] Lista de Faltantes
- [ ] Filtro de Tipo
- [ ] Prévia de link (Open Graph), analytics e crédito no rodapé

## Fase 7: Qualidade

- [ ] Teste E2E do fluxo completo
- [ ] Auditoria de acessibilidade e de performance (metas da §2 do system design)
- [ ] Teste em celulares reais (Android e iPhone), com rede ruim

## Fase 8: Entrega

- [ ] Manual do Vendedor (1 página, com prints)
- [ ] Apresentar o site e a planilha ao Vendedor, e ele fazer uma Baixa sozinho na sua frente
- [ ] Trocar a planilha de teste pela real e publicar o link
- [ ] Acompanhar a primeira semana (analytics e dúvidas)

## Fase 9: Portfólio

- [ ] Fechar o estudo de caso com resultados (Pedidos gerados, aprendizados)
- [ ] Post no LinkedIn
- [ ] Página do projeto no portfólio

# Roadmap

Do início à entrega. Cada fase termina num resultado verificável. O projeto é solo: commits pequenos direto na `main`, sem PRs.

**📍 Estamos aqui: fim da Fase 1.** Próximo passo: enviar as perguntas ao Vendedor e começar a Fase 2 (spikes).

## Fase 0: Descoberta e decisões ✅

- [x] Entender o problema, o domínio e as restrições (sessão de perguntas)
- [x] Glossário do domínio: [CONTEXT.md](../CONTEXT.md)
- [x] Decisões de arquitetura: [ADR-0001 a 0004](./adr/)
- [x] Conceito visual: [design-system.md](./design-system.md)
- [x] Lista de perguntas ao Vendedor: [perguntas-ao-vendedor.md](./perguntas-ao-vendedor.md)

## Fase 1: Documentação de engenharia ✅

- [x] System design: [system-design.md](./system-design.md)
- [x] Roadmap (este arquivo) e início do [estudo de caso](./estudo-de-caso.md)

## Fase 2: Spikes, validar os riscos antes de codar

- [ ] **Enviar as perguntas ao Vendedor** (roda em paralelo com tudo daqui em diante, porque a resposta demora)
- [ ] **S1:** planilha de teste → o CSV publicado aceita `fetch` de outro domínio (CORS)? Quanto tempo uma edição leva para aparecer?
- [ ] **S3:** na mesma planilha → formato dos números ("1,50" ou "1.50") e se a proteção de colunas impede apagar linhas
- [ ] **S2:** tamanho máximo prático de uma mensagem no `wa.me` (Android, iOS e desktop)
- [ ] Registrar os resultados. O ADR-0003 passa a `accepted`, ou entra o plano B

**Pronto quando:** nenhum risco da §13 do system design estiver sem resposta.

## Fase 3: Esqueleto andante (walking skeleton)

- [ ] Projeto Vite + React + TypeScript, Vitest e Playwright
- [ ] CI no GitHub Actions (typecheck, testes e build a cada push na `main`)
- [ ] Deploy automático no GitHub Pages, só se o CI passar (com o `base` do Vite)
- [ ] Uma página que lê o CSV da planilha de teste e mostra quantas linhas vieram

**Pronto quando:** um merge na `main` publica sozinho um site que lê a planilha. Não tem nada bonito ainda, mas o caminho inteiro, do código até o site no ar, funciona.

## Fase 4: Dados

- [ ] Checklist oficial da Copa 2026 → 980 linhas, com Código, Nome e Tipo
- [ ] `src/data/secoes.ts`: sigla, nome, ordem no Álbum e cores da bandeira de cada Seção
- [ ] Planilha real: abas Catálogo e Config, validação de células, colunas protegidas e publicação
- [ ] `docs/modelo-da-planilha.md`: o contrato da planilha, documentado
- [ ] Preencher o Estoque com a lista do Vendedor (quando ele responder)

## Fase 5: Design system

- [ ] 3 variações descartáveis (Retrô 70, Álbum 2026, Caderno do colecionador) com dados reais → escolha
- [ ] `tokens.css`: primitivos e semânticos, tema miolo (claro) e capa (escuro)
- [ ] Componentes do design system, com todos os estados
- [ ] Página `/styleguide`
- [ ] Revisão de acessibilidade AA
- [ ] Enviar o `/styleguide` ao Vendedor para aprovação (pergunta 8)

## Fase 6: Funcionalidades (commits pequenos por funcionalidade, domínio com TDD)

- [ ] Ler e validar as abas + carregamento com cache (stale-while-revalidate)
- [ ] Catálogo agrupado por Seção, índice de Seções e links `#SEÇÃO`
- [ ] Busca tolerante (código, nome sem acento, Seção)
- [ ] Carrinho: adicionar, quantidade, persistência e reconciliação
- [ ] Pedido: total por Tipo, mensagem, `wa.me`, "copiar mensagem" e "limpar carrinho"
- [ ] Lista de Faltantes
- [ ] Filtro de Tipo e tema escuro
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

# Interface em React, regras de negócio em TypeScript puro

A interface usa Vite + React + TypeScript. Toda regra de negócio fica em `src/domain/` como funções puras, **sem importar React**: ler e validar o CSV, interpretar a Lista de Faltantes, reconciliar o Carrinho, calcular o total por Tipo e montar a mensagem do Pedido. O React só desenha a tela e reage ao Comprador. O domínio é testado com Vitest, sem navegador.

## Opções consideradas

- **TypeScript sem framework:** é mais leve, mas a interface (centenas de Figurinhas, filtros, busca, Carrinho, tema) obrigaria a sincronizar o DOM à mão. Esse código é mais difícil de ler para quem está aprendendo e acabaria reinventando um mini-framework.
- **Regras dentro dos componentes React:** é mais rápido no começo, mas mistura regra com tela e torna os testes dependentes de renderização.

## Consequências

- Cerca de 45 KB (gzip) a mais de JavaScript, o que é aceitável para o projeto.
- Trocar de framework no futuro não afeta o domínio.

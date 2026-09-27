# Planilha Google como fonte da verdade, sem backend nem banco de dados

O Catálogo é lido de uma Planilha Google que o próprio Vendedor edita. O site é estático e não tem backend, banco de dados nem painel administrativo. O Vendedor precisa se virar sozinho, já usa planilhas e o projeto não justifica o custo de manter um servidor, autenticação e segurança.

## Opções consideradas

- **JSON versionado no repositório** (o que o site de referência faz): toda alteração de Estoque depende de um dev fazer um deploy. Na referência isso gerou dados inconsistentes, como a mesma coleção escrita de dois jeitos e um `status` redundante com o estoque.
- **Painel admin com login e banco**: resolve o problema, mas vira um software de verdade para manter, bem desproporcional à demanda.
- **Headless CMS**: mais uma ferramenta para o Vendedor aprender, sem ganho real sobre a planilha.
- **Registro de Pedidos via Google Apps Script (a antiga "V2")**: descartado. Seria um backend disfarçado. Ver [ADR-0002](./0002-pedido-nao-reserva-estoque.md).

## Consequências

- Tudo o que estiver publicado da planilha é público. Anotações privadas do Vendedor (custo, contatos) nunca podem ficar na parte publicada.
- O site precisa tolerar dados malformados (célula vazia, texto num campo numérico, linha apagada) sem quebrar.
- A qualidade dos dados depende de a planilha ter validação nas células e um formato bem definido.

# Finalizar um Pedido não reserva nem baixa Estoque

Clicar em "Finalizar pedido" só abre o WhatsApp com a mensagem pronta. Nada é gravado e o Estoque não muda. A Baixa é sempre feita à mão pelo Vendedor, editando o Estoque na planilha, depois de a Venda se concretizar.

## Opções consideradas

- **Baixa automática ao finalizar**: rejeitada. O Comprador pode desistir no WhatsApp, fechar só parte do Pedido ou nem enviar a mensagem, e o Vendedor teria que caçar e desfazer baixas fantasmas.
- **Registrar Pedidos e o Vendedor confirmar "fechou / parcial / recusou"** (Estoque derivado das vendas confirmadas): era o modelo mais correto, mas exige gravar dados a partir do site, o que traz um endpoint público, spam e pedidos abandonados. Descartado para manter o projeto sem backend ([ADR-0001](./0001-planilha-google-como-fonte-da-verdade.md)).

## Consequências

- Dois Compradores podem pedir a última unidade da mesma Figurinha. O Pedido informa que tudo está "sujeito a confirmação de disponibilidade", e o Vendedor resolve por ordem de chegada no WhatsApp.
- O Estoque exibido pode ficar defasado entre uma Venda e a Baixa. É um risco aceito.

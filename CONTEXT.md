# ÁlbumMania

Catálogo público onde um Vendedor anuncia as suas figurinhas avulsas de álbum. O site só monta o Pedido: a negociação e a Venda acontecem no WhatsApp, fora do sistema.

## Pessoas

**Vendedor**:
O dono das figurinhas, que mantém o Estoque e negocia pelo WhatsApp.
_Evitar_: gerente, admin, lojista

**Comprador**:
O visitante do site que monta um Carrinho e envia um Pedido.
_Evitar_: cliente, usuário

## Catálogo

**Figurinha**:
Um cromo avulso de um Álbum Panini, identificado pelo seu Código.
_Evitar_: card, carta, produto, item (cards como Adrenalyn/Match Attax são outro produto e estão fora do escopo)

**Álbum**:
A coleção Panini à qual a Figurinha pertence (ex.: Copa do Mundo 2026).
_Evitar_: coleção, categoria

**Seção**:
Um agrupamento de Figurinhas dentro do Álbum, normalmente uma seleção (BRA, ARG) ou uma seção especial (FWC).
_Evitar_: categoria, time

**Grupo**:
Um conjunto de quatro seleções da fase de grupos da Copa (A a L), que define a ordem das Seções no Álbum. As seções especiais não têm Grupo.
_Evitar_: chave

**Código**:
O identificador impresso na Figurinha, formado pela sigla da Seção e um número (ex.: "BRA 10", "FWC 3"). A única exceção é a figurinha de abertura, cujo Código é só "00".
_Evitar_: ID, número

**Estoque**:
Quantas unidades de uma Figurinha o Vendedor tem para vender. Só o Vendedor altera, sempre à mão.
_Evitar_: quantidade (reservado para o que o Comprador escolhe no Carrinho), status, disponível

**Tipo**:
A classificação da Figurinha que define o seu Preço. No álbum da Copa 2026 há dois: **Especial** (as metalizadas: "00", FWC e os escudos) e **Comum** (todas as outras, inclusive a foto do time). Vem do checklist oficial do Álbum, não do Vendedor.
_Evitar_: raridade, categoria

**Preço**:
O valor unitário de uma Figurinha, definido pelo seu Tipo. O valor final é sempre o que for acertado na Venda.
_Evitar_: valor, "a combinar"

**Catálogo**:
O conjunto de Figurinhas com Estoque maior que zero, exibido no site.

## Pedido

**Lista de Faltantes**:
Os Códigos que o Comprador procura, colados de uma vez na busca (ex.: "BRA 3, 7, 12; ARG 1").
_Evitar_: wishlist, lista de desejos

**Carrinho**:
As Figurinhas e quantidades que o Comprador está escolhendo. Existe só no navegador dele.
_Evitar_: lista; "Meu pedido" é só o rótulo na interface

**Pedido**:
A mensagem de WhatsApp gerada a partir do Carrinho no momento de "Finalizar pedido". É uma intenção de compra, não uma compra.
_Evitar_: compra, checkout, ordem

**Venda**:
O acordo fechado entre Comprador e Vendedor no WhatsApp. Acontece fora do sistema, que nunca fica sabendo dela.
_Evitar_: compra

**Baixa**:
Quando o Vendedor reduz o Estoque à mão depois de uma Venda, ou de uma venda feita fora do site.

## Relações

- Uma Figurinha pertence a exatamente uma Seção de um Álbum.
- Uma Figurinha tem exatamente um Tipo, e todas as Figurinhas do mesmo Tipo têm o mesmo Preço.
- Um Pedido nasce de um Carrinho e não reserva nem baixa Estoque.
- Uma Venda pode cobrir o Pedido inteiro, parte dele ou nada. A Baixa reflete só o que foi de fato vendido.

## Ambiguidades resolvidas

- "gerente": é a relação dele com o seu amigo, não um papel no sistema. No domínio, ele é o **Vendedor**.
- "comprar": o site não vende. O botão cria um **Pedido**, e a **Venda** acontece no WhatsApp.

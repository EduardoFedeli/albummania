# ÁlbumMania

Loja on-line onde um Vendedor anuncia as suas figurinhas, cards e colecionáveis avulsos, organizados nas Coleções que ele mesmo cria. O site só monta o Pedido: a negociação, o pagamento e a Venda acontecem no WhatsApp, fora do sistema.

## Pessoas e lugares

**Vendedor**:
O dono da loja, que cadastra Coleções e Itens no Admin e negocia pelo WhatsApp.
_Evitar_: gerente, lojista, usuário

**Comprador**:
O visitante do site que monta um Carrinho e envia um Pedido.
_Evitar_: cliente, usuário

**Vitrine**:
A parte pública do site, onde o Comprador vê o Catálogo.
_Evitar_: loja, home

**Admin**:
A área do site protegida por login (`/admin/`), onde o Vendedor cadastra Coleções e Itens e dá Baixa.
_Evitar_: painel (esse nome já é do Painel do Carrinho), dashboard

## Catálogo

**Coleção**:
Um grupo de Itens criado pelo Vendedor, com o nome que ele quiser (ex.: "Match Attax 26/27", "Adrenalyn XL Copa 2026: Brilhantes", "Colecionáveis").
_Evitar_: categoria, álbum

**Item**:
O que está à venda: uma figurinha, um card ou um colecionável (lata, envelope, álbum). Tem Nome, Preço e Estoque, e pode ter Código, Equipe, Raridade e Foto.
_Evitar_: produto, card (card é um tipo de Item, não o nome geral)

**Código**:
O identificador impresso no Item (ex.: "HR-013", "BRA 10"). É opcional, porque colecionáveis normalmente não têm.
_Evitar_: ID, número

**Equipe**:
A seleção ou o clube do jogador do Item, quando houver. Serve para a busca.
_Evitar_: time (em código, `time` parece hora), país, seleção

**Raridade**:
Um selo opcional, escrito pelo Vendedor (ex.: "Brilhante", "Edição limitada", "1 em 540 pacotes"). Só é exibido e não muda o Preço.
_Evitar_: tipo, categoria

**Preço**:
O valor unitário de um Item, definido pelo Vendedor Item a Item e guardado em centavos. O valor final é sempre o que for acertado na Venda.
_Evitar_: valor, "a combinar"

**Estoque**:
Quantas unidades de um Item o Vendedor tem para vender. Só o Vendedor altera, no Admin.
_Evitar_: quantidade (reservado para o que o Comprador escolhe no Carrinho), status, disponível

**Foto**:
A imagem do Item, enviada pelo Vendedor no Admin. O combinado é ser uma foto do próprio Item, nunca uma imagem tirada de outro site ([fotos-e-direitos.md](docs/fotos-e-direitos.md)).
_Evitar_: imagem oficial

**Catálogo**:
O conjunto de Itens com Estoque maior que zero, exibido na Vitrine.

## Pedido

**Carrinho**:
Os Itens e quantidades que o Comprador está escolhendo. Existe só no navegador dele.
_Evitar_: lista; "Meu pedido" é só o rótulo na interface

**Pedido**:
A mensagem de WhatsApp gerada a partir do Carrinho no momento de "Finalizar pedido". É uma intenção de compra, não uma compra.
_Evitar_: compra, checkout, ordem

**Venda**:
O acordo fechado entre Comprador e Vendedor no WhatsApp, com pagamento e frete combinados ali. Acontece fora do sistema, que nunca fica sabendo dela.
_Evitar_: compra

**Baixa**:
Quando o Vendedor reduz o Estoque no Admin depois de uma Venda, ou de uma venda feita fora do site.

## Relações

- Um Item pertence a exatamente uma Coleção. Uma Coleção que ainda tem Itens não pode ser apagada.
- Cada Item tem o seu Preço. Não existe preço por Raridade nem por Coleção.
- Um Pedido nasce de um Carrinho e não reserva nem baixa Estoque ([ADR-0002](docs/adr/0002-pedido-nao-reserva-estoque.md)).
- Uma Venda pode cobrir o Pedido inteiro, parte dele ou nada. A Baixa reflete só o que foi de fato vendido.

## Ambiguidades resolvidas

- "categoria" e "coleção": no domínio é **Coleção**, a palavra do colecionador. O site de referência (Tramujas Cards) usa as duas para coisas que se misturam.
- "card": é um tipo de **Item**, ao lado da figurinha e do colecionável.
- "admin": é a área do site (**Admin**). A pessoa que a usa é o **Vendedor**.
- "comprar": o site não vende. O botão cria um **Pedido**, e a **Venda** acontece no WhatsApp.

## Antes da V2

Até 2026-11-02, o site vendia só figurinhas do álbum da Copa 2026, lidas de uma planilha, e usava os termos Álbum, Seção, Grupo, Tipo (Comum/Especial, com preço por Tipo) e Lista de Faltantes. Eles saíram do domínio com o [ADR-0005](docs/adr/0005-catalogo-no-supabase-com-admin.md). A versão antiga está na tag `v1-planilha`.

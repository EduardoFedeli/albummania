---
status: proposed
---

# A planilha é lida pelo navegador, via CSV publicado, a cada visita

O site busca, direto do navegador e em paralelo, duas abas publicadas como CSV ("Publicar na web", uma URL por aba) toda vez que alguém abre a página:

- `Catálogo`: as Figurinhas e o Estoque.
- `Config`: o Preço por Tipo, o número do WhatsApp e o nome da loja. Isso permite, por exemplo, fazer uma liquidação ou trocar de número sem precisar de deploy.

Não existe etapa de build nem cópia intermediária dos dados. Assim, a edição do Vendedor chega ao site sem depender de ninguém. Publicar só essas abas também garante que o restante da planilha nunca fique público ([ADR-0001](./0001-planilha-google-como-fonte-da-verdade.md)).

Fica como `proposed` até o spike confirmar dois pontos: o tempo real de cache do CSV publicado pelo Google e se ele responde com CORS liberado para `fetch` a partir do domínio do site.

## Opções consideradas

- **Gerar o JSON no build com um GitHub Action agendado**: o site ficaria mais rápido e resistente a uma queda do Google, mas as edições atrasariam até a próxima execução. Pior: o GitHub desativa workflows agendados em repositórios públicos depois de 60 dias sem atividade, e o site congelaria em silêncio justamente quando o projeto estivesse "pronto".
- **Sheets API com chave**: exige gerenciar uma chave de API exposta no front, sem ganho sobre o CSV publicado.
- **Endpoint `gviz`**: exige compartilhar a planilha inteira por link, o que tornaria públicas todas as abas.

## Consequências

- A edição do Vendedor aparece em alguns minutos, não na hora (cache do Google).
- Se o Google estiver fora do ar ou a rede estiver ruim, o site mostra o **último Catálogo válido salvo no navegador** (stale-while-revalidate), com o aviso da idade dos dados ("catálogo de 2 horas atrás"). Só na primeira visita sem rede aparece o erro amigável com "tentar de novo". Um Estoque defasado já é um risco aceito pelo [ADR-0002](./0002-pedido-nao-reserva-estoque.md).
- A validação dos dados acontece no navegador, a cada carregamento.
- Uma Figurinha cujo Tipo não tem Preço na aba `Config` não aparece no Catálogo, e o problema é registrado no console. Nunca exibimos Figurinha sem Preço.

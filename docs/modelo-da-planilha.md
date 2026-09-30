# Modelo da planilha

O contrato entre a planilha Google e o código. Os nomes das abas e das colunas funcionam como uma API: se mudarem, o site deixa de ler os dados (system design §7). Decisões relacionadas: [ADR-0001](./adr/0001-planilha-google-como-fonte-da-verdade.md) e [ADR-0003](./adr/0003-planilha-lida-no-navegador-via-csv-publicado.md).

## Aba `Catálogo`

Uma linha por Figurinha, na ordem do Álbum. Cabeçalho na linha 1.

| Coluna | Conteúdo | Quem edita | Validação na planilha |
|---|---|---|---|
| **Álbum** | `Copa 2026` | ninguém (protegida) | — |
| **Código** | `00`, `FWC 1`…`FWC 19`, `BRA 1`…`BRA 20` | ninguém (protegida) | coluna em texto simples, para o `00` não virar `0` |
| **Nome** | nome do jogador, `Escudo`, `Foto do time`… | ninguém (protegida) | — |
| **Tipo** | `Comum` ou `Especial` | ninguém (protegida) | menu suspenso |
| **Estoque** | quantas unidades o Vendedor tem | **Vendedor** | número ≥ 0, rejeita outra coisa |
| **Imagem** | URL `https://` opcional | Vendedor | — |

## Aba `Config`

Pares chave e valor nas colunas A e B, **sem cabeçalho obrigatório** (spike S3). Linhas vazias e chaves desconhecidas são ignoradas.

| A (chave) | B (valor) | Observação |
|---|---|---|
| `WhatsApp` | `5511999999999` | só dígitos, com DDI e DDD |
| `Nome da loja` | `Figurinhas do Fulano` | |
| `Preço Comum` | `1,50` | uma linha `Preço <Tipo>` para cada Tipo |
| `Preço Especial` | `5,00` | |

## De onde vem o checklist

O arquivo [`dados/checklist-copa-2026.csv`](../dados/checklist-copa-2026.csv) (980 figurinhas, Estoque 0) é a base da aba Catálogo. O [`dados/catalogo-demo.csv`](../dados/catalogo-demo.csv) é igual, mas com um Estoque de demonstração para o beta: 367 figurinhas com estoque, 700 unidades, sorteio com semente fixa.

O checklist foi montado **cruzando três fontes independentes**, porque nenhuma delas, sozinha, era confiável:

| Fonte | O que trouxe | Problema |
|---|---|---|
| [digitouachou.com.br](https://digitouachou.com.br/album-copa-2026/lista-figurinhas/) | estrutura do álbum, grafia correta dos nomes | sem as siglas; ordem errada em 2 seleções |
| [scanini.app](https://scanini.app/albums/world-cup-2026) | siglas, numeração de 1 a 20 por seleção | nomes com erros de OCR ("Kusini Vengi", "Math Freese") |
| [checklistinsider.com](https://www.checklistinsider.com/2026-panini-fifa-world-cup-sticker) | ordem das seleções no álbum | mesmos erros de grafia do Scanini |

**Regra de reconciliação:** a numeração segue o Scanini (confirmada pelo checklistinsider, e as duas diferem da digitouachou só no Brasil e no Paraguai). A grafia segue a digitouachou quando o nome é o mesmo com erro de digitação. Nove nomes foram corrigidos à mão, onde as duas fontes erravam ou discordavam (ex.: TUN 4 **Yan Valery**, SEN 2 **Édouard Mendy**, SCO 20 **Ben Gannon-Doak**).

**Validação contra o álbum real:** a página da Espanha, fotografada, bate figurinha por figurinha, e a ordem dos grupos bate com as páginas do México e da Espanha. Os totais batem com os números oficiais: 980 figurinhas, sendo 68 especiais (`00`, FWC 1 a 19 e os 48 escudos) e 912 comuns. Um teste automático ([`secoes.test.ts`](../src/data/secoes.test.ts)) garante esses invariantes em todo push.

## Como criar a planilha

Feito uma vez só, pelo dono da conta.

1. **Criar** uma planilha nova no Google Drive e renomear para `ÁlbumMania`.
2. **Importar o catálogo:** Arquivo → Importar → Fazer upload → `dados/catalogo-demo.csv` → *Substituir a página atual*. Depois, renomear a aba para `Catálogo`.
3. **Consertar os códigos que o Google converteu:** numa planilha em português, a importação transforma `00` em `0` e os códigos de Marrocos (`MAR 1`…`MAR 20`) em **datas** ("mar. 1" = 1º de março). Selecione a coluna B → Formatar → Número → **Texto simples**. Depois digite `00` na célula B2 e cole `MAR 1` a `MAR 20` nas células B202 a B221. Nenhuma outra sigla coincide com abreviação de mês.
4. **Congelar o cabeçalho:** Ver → Congelar → 1 linha.
5. **Validar o Estoque:** selecione `E2:E981` → Dados → Validação de dados → *Maior ou igual a* `0` → **Rejeitar a entrada**, com o texto de ajuda "Use um número inteiro, 0 ou mais".
6. **Menu do Tipo:** selecione `D2:D981` → Dados → Validação de dados → *Menu suspenso* com `Comum` e `Especial`.
7. **Proteger:** Dados → Proteger páginas e intervalos → intervalo `A1:D981` → *Restringir quem pode editar* → **Somente você**. Faça o mesmo para `E1:F1` (os cabeçalhos de Estoque e Imagem). Assim, o Vendedor, como editor, só consegue mudar Estoque e Imagem.
8. **Criar a aba `Config`** com as quatro linhas da tabela acima.
9. **Publicar:** Arquivo → Compartilhar → Publicar na Web → escolha a aba **Catálogo**, formato **CSV** → Publicar. Repita para a aba **Config**. Confira se a opção *Republicar automaticamente quando forem feitas alterações* está marcada.
10. **Atualizar o site:** as duas URLs publicadas vão no [`.env`](../.env).

**Pendência:** confirmar que a proteção impede um *editor* de apagar linhas. O dono da planilha nunca é bloqueado pela proteção, então o teste precisa ser feito com outra conta Google, como editora.
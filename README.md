# ÁlbumMania

Catálogo online para um colecionador vender as suas figurinhas repetidas do álbum da Copa do Mundo 2026. O comprador monta o pedido no site e finaliza pelo WhatsApp. Não há pagamento online, backend nem banco de dados: o estoque vive numa planilha Google que o próprio vendedor atualiza.

> **Status:** a [prévia para o Vendedor](https://eduardofedeli.github.io/albummania/previa/) está no ar, com dados reais da planilha; o site definitivo está em construção ([roadmap](docs/roadmap.md)).

## Como rodar

```bash
npm install       # instala as dependências
npm run dev       # site local em http://localhost:5173/albummania/
npm test          # roda os testes
npm run imagens   # gera a prancha do design system e a imagem da prévia do link
```

A cada push na `main`, o GitHub Actions verifica tipos, roda os testes, faz o build e publica no GitHub Pages ([publicar.yml](.github/workflows/publicar.yml)).

## Documentação

- [docs/roadmap.md](docs/roadmap.md): as fases do projeto e em que ponto estamos.
- [CONTEXT.md](CONTEXT.md): o glossário do domínio.
- [docs/system-design.md](docs/system-design.md): a arquitetura, os fluxos, os modos de falha e os riscos.
- [docs/adr/](docs/adr/): as decisões de arquitetura e o porquê de cada uma.
- [docs/design-system.md](docs/design-system.md): o conceito visual, os tokens e os componentes.
- [docs/perguntas-ao-vendedor.md](docs/perguntas-ao-vendedor.md): o que falta saber do cliente.

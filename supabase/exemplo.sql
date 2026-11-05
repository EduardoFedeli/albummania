-- Dados de exemplo, para ver a Vitrine funcionando antes de o Admin existir.
-- Rode depois do schema.sql. Rodar de novo não duplica nada.
-- Antes de entregar ao Vendedor, apague tudo:
--   delete from public.itens; delete from public.colecoes;

insert into public.colecoes (nome, ordem) values
  ('Copa 2026: figurinhas', 1),
  ('Colecionáveis', 2)
on conflict (nome) do nothing;

insert into public.itens (colecao_id, codigo, nome, equipe, raridade, preco_centavos, estoque)
select c.id, v.codigo, v.nome, v.equipe, v.raridade, v.preco_centavos, v.estoque
from (values
  ('Copa 2026: figurinhas', '00', 'Abertura', null, 'Brilhante', 500, 1),
  ('Copa 2026: figurinhas', 'FWC 1', 'Emblema oficial', null, 'Brilhante', 500, 2),
  ('Copa 2026: figurinhas', 'BRA 1', 'Escudo', 'Brasil', 'Brilhante', 500, 1),
  ('Copa 2026: figurinhas', 'BRA 2', 'Alisson', 'Brasil', null, 150, 3),
  ('Copa 2026: figurinhas', 'BRA 19', 'Raphinha', 'Brasil', null, 150, 2),
  ('Copa 2026: figurinhas', 'ARG 17', 'Lionel Messi', 'Argentina', null, 150, 1),
  ('Copa 2026: figurinhas', 'ESP 15', 'Lamine Yamal', 'Espanha', null, 150, 4),
  ('Copa 2026: figurinhas', 'FRA 20', 'Kylian Mbappé', 'França', null, 150, 2),
  ('Colecionáveis', null, 'Álbum capa dura', null, null, 4990, 2),
  ('Colecionáveis', null, 'Envelope fechado', null, null, 700, 10)
) as v (colecao, codigo, nome, equipe, raridade, preco_centavos, estoque)
join public.colecoes c on c.nome = v.colecao
where not exists (
  select 1 from public.itens i where i.colecao_id = c.id and i.nome = v.nome
);

-- ÁlbumMania V2: o banco do Catálogo (ADR-0005).
--
-- Como usar: no Supabase, abra SQL Editor → New query, cole este arquivo inteiro e clique em Run.
-- Pode rodar de novo quando ele mudar: tudo aqui é "crie se não existir" ou "troque".
--
-- Duas camadas de proteção, e as duas precisam deixar passar:
--   1. GRANT: o que cada papel pode TENTAR fazer numa tabela
--      (anon = visitante sem login; authenticated = quem fez login).
--   2. RLS (Row Level Security): em QUAIS linhas a tentativa vale.
--      Com a RLS ligada, uma tabela sem política que libere não deixa passar nada.

-- ─── Tabelas ─────────────────────────────────────────────────────────────

create table if not exists public.colecoes (
  id bigint generated always as identity primary key,
  nome text not null unique check (btrim(nome) <> ''),
  ordem integer not null default 0,
  criada_em timestamptz not null default now()
);

create table if not exists public.itens (
  id bigint generated always as identity primary key,
  -- "restrict": o banco não deixa apagar uma Coleção que ainda tem Itens.
  colecao_id bigint not null references public.colecoes (id) on delete restrict,
  codigo text check (codigo is null or btrim(codigo) <> ''),
  nome text not null check (btrim(nome) <> ''),
  equipe text,
  raridade text,
  -- Dinheiro em centavos inteiros: R$ 1,50 vira 150, e nenhuma conta perde centavo arredondando.
  preco_centavos integer not null check (preco_centavos >= 0),
  estoque integer not null default 0 check (estoque >= 0),
  -- Caminho da Foto dentro do bucket "fotos" (ex.: "3f9c….webp"), ou nulo se não tiver Foto.
  foto text,
  criado_em timestamptz not null default now()
);

create index if not exists itens_colecao_id_idx on public.itens (colecao_id);

-- A configuração da loja tem uma linha só: o "check (id = 1)" impede uma segunda.
create table if not exists public.loja (
  id integer primary key default 1 check (id = 1),
  nome text not null default 'ÁlbumMania' check (btrim(nome) <> ''),
  -- Só dígitos, com DDI e DDD (ex.: 5511999999999). Fica vazio até ser configurado.
  whatsapp text not null default '' check (whatsapp ~ '^[0-9]*$')
);

insert into public.loja (id) values (1) on conflict (id) do nothing;

-- Quem pode usar o Admin. As linhas são criadas à mão, no SQL Editor (veja o fim do arquivo).
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ─── Quem é administrador ────────────────────────────────────────────────

-- Roda com as permissões de quem chamou. Funciona porque a política da tabela
-- administradores deixa cada pessoa logada ver a própria linha (mais abaixo).
create or replace function public.eh_administrador()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores
    where user_id = (select auth.uid())
  );
$$;

-- ─── GRANT: o que cada papel pode tentar ─────────────────────────────────
-- O projeto foi criado com "Automatically expose new tables" desligado: nada fica
-- exposto na API sem um GRANT escrito aqui (o menor privilégio possível).

grant usage on schema public to anon, authenticated;
grant select on public.colecoes, public.itens, public.loja to anon, authenticated;
grant insert, update, delete on public.colecoes, public.itens to authenticated;
grant update on public.loja to authenticated;
grant usage on sequence public.colecoes_id_seq, public.itens_id_seq to authenticated;
grant select on public.administradores to authenticated;
grant execute on function public.eh_administrador() to authenticated;

-- ─── RLS: em quais linhas ────────────────────────────────────────────────

alter table public.colecoes enable row level security;
alter table public.itens enable row level security;
alter table public.loja enable row level security;
alter table public.administradores enable row level security;

drop policy if exists "todos leem as coleções" on public.colecoes;
create policy "todos leem as coleções" on public.colecoes
  for select to anon, authenticated
  using (true);

drop policy if exists "administradores alteram as coleções" on public.colecoes;
create policy "administradores alteram as coleções" on public.colecoes
  for all to authenticated
  using (public.eh_administrador())
  with check (public.eh_administrador());

drop policy if exists "todos leem os itens" on public.itens;
create policy "todos leem os itens" on public.itens
  for select to anon, authenticated
  using (true);

drop policy if exists "administradores alteram os itens" on public.itens;
create policy "administradores alteram os itens" on public.itens
  for all to authenticated
  using (public.eh_administrador())
  with check (public.eh_administrador());

drop policy if exists "todos leem a loja" on public.loja;
create policy "todos leem a loja" on public.loja
  for select to anon, authenticated
  using (true);

drop policy if exists "administradores alteram a loja" on public.loja;
create policy "administradores alteram a loja" on public.loja
  for update to authenticated
  using (public.eh_administrador())
  with check (public.eh_administrador());

drop policy if exists "cada um vê se é administrador" on public.administradores;
create policy "cada um vê se é administrador" on public.administradores
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ─── Fotos ───────────────────────────────────────────────────────────────

-- Bucket público: qualquer pessoa vê uma Foto pelo endereço dela, mas só administradores
-- enviam e apagam. O limite de 1 MB é uma rede de segurança: o Admin comprime antes de enviar.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 1048576, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "administradores veem as fotos" on storage.objects;
create policy "administradores veem as fotos" on storage.objects
  for select to authenticated
  using (bucket_id = 'fotos' and public.eh_administrador());

drop policy if exists "administradores enviam fotos" on storage.objects;
create policy "administradores enviam fotos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos' and public.eh_administrador());

drop policy if exists "administradores apagam fotos" on storage.objects;
create policy "administradores apagam fotos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos' and public.eh_administrador());

-- ─── Depois de criar a conta (uma vez por pessoa) ────────────────────────
--
-- 1. Authentication → Sign In / Providers: desligue "Allow new users to sign up".
-- 2. Authentication → Users → Add user → Create new user, com "Auto Confirm User" marcado.
-- 3. Rode, trocando o e-mail:
--
--    insert into public.administradores (user_id)
--    select id from auth.users where email = 'email-da-conta@exemplo.com'
--    on conflict do nothing;

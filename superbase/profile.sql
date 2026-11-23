-- Jalankan di Supabase → SQL Editor.

-- 1) Tabel profil: satu baris saja (id selalu 1), isinya JSON dua bahasa.
create table if not exists public.site_profile (
  id         int primary key default 1 check (id = 1),
  content    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_profile enable row level security;

drop policy if exists "profile_read_public" on public.site_profile;
create policy "profile_read_public"
  on public.site_profile for select
  using (true);

-- Kalau policy tabel `projects` kamu membatasi ke email admin tertentu,
-- samakan syarat di bawah ini dengan policy tersebut.
drop policy if exists "profile_write_admin" on public.site_profile;
create policy "profile_write_admin"
  on public.site_profile for all
  to authenticated
  using (true)
  with check (true);

-- 2) Ganti slug pkl-ds3 menjadi intern-ds3.
--    (Bisa juga lewat Admin → Edit proyek → kolom Slug; hasilnya sama.)
update public.projects
set slug = 'intern-ds3'
where slug = 'pkl-ds3';
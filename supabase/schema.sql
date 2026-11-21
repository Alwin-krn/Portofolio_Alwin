-- =====================================================================
-- schema.sql — jalankan SEKALI di Supabase > SQL Editor
-- Isi: tabel, RLS, bucket Storage, storage policy, fungsi reorder
-- =====================================================================

-- ---------- 0. Helper -------------------------------------------------
-- Satu tempat untuk menentukan siapa admin.
-- Default: user yang sudah login. Karena Public Sign Up dimatikan dan hanya
-- ada 1 akun, ini sudah cukup. Untuk lebih ketat, ganti isi fungsi dengan:
--   select auth.uid() = 'UUID-ADMIN-KAMU'::uuid
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- 1. Proyek & Dokumentasi ----------------------------------
create table if not exists public.projects (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique check (slug ~ '^[a-z0-9-]+$'),
  back_section        text not null default 'proyek',   -- id section di beranda untuk tombol Kembali
  badge_icon          text not null default 'wrench',   -- wrench | server | globe | presentation | code | users | building
  photo_style         text not null default 'photo' check (photo_style in ('photo', 'screenshot')),
  is_published        boolean not null default true,
  sort_order          int not null default 0,

  badge_id            text not null default '',
  badge_en            text not null default '',
  title_id            text not null,
  title_en            text not null default '',
  subtitle_id         text not null default '',
  subtitle_en         text not null default '',
  period_id           text not null default '',
  period_en           text not null default '',
  location_id         text not null default '',
  location_en         text not null default '',
  description_id      text not null default '',
  description_en      text not null default '',
  activities_title_id text not null default 'Kegiatan Utama',
  activities_title_en text not null default 'Key Activities',
  gallery_title_id    text not null default 'Galeri Dokumentasi',
  gallery_title_en    text not null default 'Documentation Gallery',

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.project_activities (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  icon        text,                         -- null = tampil nomor 01, 02, ...
  title_id    text not null default '',
  title_en    text not null default '',
  desc_id     text not null default '',
  desc_en     text not null default '',
  sort_order  int not null default 0
);

create table if not exists public.project_photos (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  image_path  text not null,                -- path di bucket project-photos (URL dibuat di frontend)
  caption_id  text not null default '',
  caption_en  text not null default '',
  sort_order  int not null default 0
);

create index if not exists project_activities_project_idx on public.project_activities(project_id, sort_order);
create index if not exists project_photos_project_idx     on public.project_photos(project_id, sort_order);

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------- 2. Tentang saya, pengalaman, keahlian ---------------------
create table if not exists public.about_section (
  id          int primary key default 1 check (id = 1),   -- hanya boleh 1 baris
  headline_id text not null default '',
  headline_en text not null default '',
  bio_id      text not null default '',
  bio_en      text not null default '',
  updated_at  timestamptz not null default now()
);
insert into public.about_section (id) values (1) on conflict (id) do nothing;

drop trigger if exists about_updated_at on public.about_section;
create trigger about_updated_at before update on public.about_section
  for each row execute function public.set_updated_at();

create table if not exists public.experiences (
  id              uuid primary key default gen_random_uuid(),
  category        text not null check (category in ('experience', 'education')),
  title_id        text not null default '',
  title_en        text not null default '',
  organization    text not null default '',
  period_id       text not null default '',
  period_en       text not null default '',
  description_id  text not null default '',
  description_en  text not null default '',
  project_slug    text references public.projects(slug) on update cascade on delete set null, -- link ke halaman detail (opsional)
  image_path      text,                     -- bucket experience-images
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists public.technical_skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  level       text,
  pdf_path    text,                         -- bucket skill-certificates
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- 3. Row Level Security ------------------------------------
alter table public.projects           enable row level security;
alter table public.project_activities enable row level security;
alter table public.project_photos     enable row level security;
alter table public.about_section      enable row level security;
alter table public.experiences        enable row level security;
alter table public.technical_skills   enable row level security;

-- Baca: publik. Proyek yang belum dipublikasikan hanya terlihat admin.
drop policy if exists "projects read" on public.projects;
create policy "projects read" on public.projects
  for select using (is_published or public.is_admin());

drop policy if exists "activities read" on public.project_activities;
create policy "activities read" on public.project_activities
  for select using (exists (
    select 1 from public.projects p
    where p.id = project_id and (p.is_published or public.is_admin())
  ));

drop policy if exists "photos read" on public.project_photos;
create policy "photos read" on public.project_photos
  for select using (exists (
    select 1 from public.projects p
    where p.id = project_id and (p.is_published or public.is_admin())
  ));

drop policy if exists "about read" on public.about_section;
create policy "about read" on public.about_section for select using (true);

drop policy if exists "experiences read" on public.experiences;
create policy "experiences read" on public.experiences for select using (true);

drop policy if exists "skills read" on public.technical_skills;
create policy "skills read" on public.technical_skills for select using (true);

-- Tulis (insert/update/delete): hanya admin
do $$
declare t text;
begin
  foreach t in array array[
    'projects', 'project_activities', 'project_photos',
    'about_section', 'experiences', 'technical_skills'
  ]
  loop
    execute format('drop policy if exists "%1$s admin insert" on public.%1$s', t);
    execute format('drop policy if exists "%1$s admin update" on public.%1$s', t);
    execute format('drop policy if exists "%1$s admin delete" on public.%1$s', t);
    execute format('create policy "%1$s admin insert" on public.%1$s for insert with check (public.is_admin())', t);
    execute format('create policy "%1$s admin update" on public.%1$s for update using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "%1$s admin delete" on public.%1$s for delete using (public.is_admin())', t);
  end loop;
end $$;

-- ---------- 4. Fungsi urutan (atomik, tetap tunduk RLS) ---------------
create or replace function public.reorder_projects(ids uuid[])
returns void
language sql
as $$
  update public.projects p
     set sort_order = o.ord - 1
    from unnest(ids) with ordinality as o(id, ord)
   where p.id = o.id
$$;

-- ---------- 5. Storage bucket -----------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('project-photos',     'project-photos',     true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('experience-images',  'experience-images',  true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('skill-certificates', 'skill-certificates', true, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Storage policy: semua orang boleh lihat, hanya admin boleh ubah
drop policy if exists "portfolio files read"   on storage.objects;
drop policy if exists "portfolio files insert" on storage.objects;
drop policy if exists "portfolio files update" on storage.objects;
drop policy if exists "portfolio files delete" on storage.objects;

create policy "portfolio files read" on storage.objects
  for select using (bucket_id in ('project-photos', 'experience-images', 'skill-certificates'));

create policy "portfolio files insert" on storage.objects
  for insert with check (
    bucket_id in ('project-photos', 'experience-images', 'skill-certificates') and public.is_admin()
  );

create policy "portfolio files update" on storage.objects
  for update using (
    bucket_id in ('project-photos', 'experience-images', 'skill-certificates') and public.is_admin()
  );

create policy "portfolio files delete" on storage.objects
  for delete using (
    bucket_id in ('project-photos', 'experience-images', 'skill-certificates') and public.is_admin()
  );

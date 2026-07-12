-- ====================================================================
--                      ANATOMYA AI SUPABASE SCHEMA
-- ====================================================================
-- Ushbu SQL scriptni Supabase loyihangizning "SQL Editor" bo'limida ishga tushiring.
-- Bu barcha jadvallarni, munosabatlarni, foydalanuvchi profillarini sinxronlash 
-- triggerlarini hamda xavfsizlik qoidalarini (RLS) avtomatik sozlaydi.

-- UTF-8 formatini ta'minlash va ba'zi qo'shimchalarni yoqish
create extension if not exists "uuid-ossp";

-- 1. FOYDALANUVCHILAR UCHUN PROFILLAR JADVALI (users o'rniga profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  photo_url text,
  is_admin boolean default false,
  role text default 'user',
  purchased_semesters integer[] default array[]::integer[],
  is_blocked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SEMESTRLAR JADVALI
create table if not exists public.semesters (
  id uuid default gen_random_uuid() primary key,
  number integer unique not null,
  title jsonb not null, -- {"uz": "1-Semester", "ru": "...", "en": "..."}
  description jsonb, -- {"uz": "...", "ru": "...", "en": "..."}
  is_active boolean default true,
  "order" integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MAVZULAR JADVALI (topics)
create table if not exists public.topics (
  id uuid default gen_random_uuid() primary key,
  semester integer not null, -- Semestr raqami (1 yoki 2)
  "order" integer not null,
  title jsonb not null, -- {"uz": "...", "ru": "...", "en": "..."}
  theory jsonb default '{"uz": ""}'::jsonb, -- {"uz": "...", "ru": "...", "en": "..."}
  latin_terms text[] default array[]::text[],
  videos jsonb default '[]'::jsonb, -- Video havolalar ro'yxati
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SAVOLLAR JADVALI (quizzes)
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  topic_id text not null, -- Mavzu IDsi (String/UUID)
  question jsonb not null, -- {"uz": "...", "ru": "...", "en": "..."}
  options jsonb not null, -- {"uz": ["A", "B", "C"], "ru": [...]}
  answer_index integer not null,
  explanation jsonb default '{"uz": ""}'::jsonb, -- {"uz": "...", "ru": "...", "en": "..."}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ATLAS JADVALI (anatomik atlas)
create table if not exists public.atlas (
  id uuid default gen_random_uuid() primary key,
  latin_name text not null,
  uzbek_name text not null,
  english_name text,
  russian_name text,
  image_url text not null,
  model_url text, -- ✅ 3D Model URL
  details jsonb, -- Pinlar yoki qo'shimcha koordinatalar
  semester integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5b. 3D MODELLAR JADVALI (anatomy_models)
create table if not exists public.anatomy_models (
  "id" text primary key,
  "title" jsonb not null, -- {"uz": "...", "ru": "...", "en": "..."}
  "description" jsonb, -- {"uz": "...", "ru": "...", "en": "..."}
  "system" text not null, -- 'skeletal', 'muscular', etc.
  "region" text not null, -- 'head', 'torso', etc.
  "fileUrl" text, -- GLB file URL
  "embedUrl" text, -- Embed URL (Sketchfab)
  "thumbnail" text, -- Preview image URL
  "source" text, -- e.g. Sketchfab, CGTrader
  "sourceUrl" text,
  "license" text,
  "author" text,
  "tags" text[] default array[]::text[],
  "pins" jsonb default '[]'::jsonb, -- Pinlar koordinatalari va ma'lumotlari
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TO'LOVLAR JADVALI (payments)
create table if not exists public.payments (
  id text primary key, -- "user_uid_semester_id" formatda
  user_id uuid references auth.users on delete cascade not null,
  semester_id integer not null,
  status text default 'pending' not null, -- 'pending', 'approved', 'rejected'
  receipt_url text,
  amount integer,
  card_holder text,
  phone_number text,
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. LATIN TERMINLARI (glossary)
create table if not exists public.latin_terms (
  id uuid default gen_random_uuid() primary key,
  latin text unique not null,
  uzbek text not null,
  english text,
  russian text,
  pronunciation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. E'LONLAR JADVALI (announcements)
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  title jsonb not null, -- {"uz": "...", "ru": "...", "en": "..."}
  content jsonb not null, -- {"uz": "...", "ru": "...", "en": "..."}
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. SOZLAMALAR JADVALI (app_settings)
create table if not exists public.app_settings (
  id text primary key, -- 'global' optimal
  telegram_bot_username text default '@AnatomyaAISupportBot',
  card_number text,
  card_holder text,
  price_semester_1 integer default 49000,
  price_semester_2 integer default 49000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sozlamalar uchun dastlabki qatorni joylashtirish
insert into public.app_settings (id, card_number, card_holder)
values ('global', '8600123456789012', 'Anatomya AI Support')
on conflict (id) do nothing;


-- ====================================================================
--             ROW LEVEL SECURITY (RLS) - XAVFSIZLIK QOIDALARI
-- ====================================================================
-- Supabase dagi jadvallarni himoya qilish va rollarga ko'ra ruxsat berish.

alter table public.profiles enable row level security;
alter table public.semesters enable row level security;
alter table public.topics enable row level security;
alter table public.quizzes enable row level security;
alter table public.atlas enable row level security;
alter table public.anatomy_models enable row level security;
alter table public.payments enable row level security;
alter table public.latin_terms enable row level security;
alter table public.announcements enable row level security;
alter table public.app_settings enable row level security;

-- 1. PROFILLAR UCHUN POLICY
create policy "Foydalanuvchilar o'z profillarini ko'ra oladilar"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Foydalanuvchilar o'z profillarini o'zgartira oladilar"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Adminga barcha profillarni o'qish/yozish ruxsati"
  on public.profiles for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and (profiles.is_admin = true or profiles.role = 'admin')
    )
  );

-- 2. SEMESTRLAR, MAVZULAR, SAVOLLAR, ATLAS, LATIN TERMINLARI, E'LONLAR, SOZLAMALAR (O'qish barchaga, yozish faqat adminga)
create policy "Barcha semestrlarni ko'ra oladi" on public.semesters for select using (true);
create policy "Faqat Admin semestrlarni tahrirlay oladi" on public.semesters for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Barcha mavzularni ko'ra oladi" on public.topics for select using (true);
create policy "Faqat Admin mavzularni tahrirlay oladi" on public.topics for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Barcha testlarni ko'ra oladi" on public.quizzes for select using (true);
create policy "Faqat Admin testlarni tahrirlay oladi" on public.quizzes for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Barcha atlaslarni ko'ra oladi" on public.atlas for select using (true);
create policy "Faqat Admin atlaslarni tahrirlay oladi" on public.atlas for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Barcha 3D modellarni ko'ra oladi" on public.anatomy_models for select using (true);
create policy "Faqat Admin 3D modellarni tahrirlay oladi" on public.anatomy_models for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and (profiles.is_admin = true or profiles.role = 'admin'))
);

create policy "Barcha latin terminlarini ko'ra oladi" on public.latin_terms for select using (true);
create policy "Faqat Admin latin terminlarini tahrirlay oladi" on public.latin_terms for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Barcha e'lonlarni ko'ra oladi" on public.announcements for select using (true);
create policy "Faqat Admin e'lonlarni tahrirlay oladi" on public.announcements for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Barcha sozlamalarni ko'ra oladi" on public.app_settings for select using (true);
create policy "Faqat Admin sozlamalarni tahrirlay oladi" on public.app_settings for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

-- 3. TO'LOVLAR (Foydalanuvchi faqat o'zinikini ko'ra/yarata oladi, admin hammasini tahrir qila oladi)
create policy "Foydalanuvchi o'z to'lovlarini ko'radi" on public.payments for select using (auth.uid() = user_id);
create policy "Foydalanuvchi to'lov ariza bera oladi" on public.payments for insert with check (auth.uid() = user_id);
create policy "Faqat Admin barcha to'lovlarni boshqaradi" on public.payments for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);


-- ====================================================================
--            AVTOMATIK PROFILLAR SINXRONIZATSIYASI (TRIGGER)
-- ====================================================================
-- Har gal yangi foydalanuvchi ro'yxatdan o'tganda public.profiles jadvalida 
-- avtomatik qator yaratish. Bosh admin pochtasiga ko'ra avtomatik is_admin qilish.

create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_admin_check boolean;
  role_check text;
begin
  if new.email = 'asadbekistamov99::gmail.com' or new.email = 'asadbekistamov99@gmail.com' then
    is_admin_check := true;
    role_check := 'admin';
  else
    is_admin_check := false;
    role_check := 'user';
  end if;

  insert into public.profiles (id, email, display_name, photo_url, is_admin, role, purchased_semesters, is_blocked)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', 'Tibbiyot Talabasi'),
    new.raw_user_meta_data->>'avatar_url',
    is_admin_check,
    role_check,
    array[]::integer[],
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

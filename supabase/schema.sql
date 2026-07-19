-- CzechHub — Supabase schema, row-level security, and seed data.
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query → paste → Run).
-- It is safe to re-run: tables are created only if missing and seed rows are
-- inserted only when a table is still empty, so your edits are never overwritten.

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.areas (
  code    text primary key,
  name    text not null default '',
  "desc"  text not null default '',
  mcvp    text not null default '',
  slides  text not null default '',
  sort    int  not null default 0
);

create table if not exists public.mc_members (
  id       bigint generated always as identity primary key,
  role     text not null default 'MCVP',
  name     text not null default '',
  area     text not null default '',
  bio       text not null default '',
  area_desc text not null default '',
  slides    text not null default '',
  linkedin  text not null default '',
  instagram text not null default '',
  facebook  text not null default '',
  twitter   text not null default '',
  tiktok    text not null default '',
  email     text not null default '',
  photo     text,
  sort      int  not null default 0
);

create table if not exists public.lcs (
  id         bigint generated always as identity primary key,
  slug       text unique not null,
  name       text not null default '',
  city       text not null default '',
  university text not null default '',
  lcp        text not null default '',
  intro      text not null default '',
  color      text not null default '#037ef3',
  sort       int  not null default 0
);

create table if not exists public.lc_members (
  id      bigint generated always as identity primary key,
  lc_slug text not null references public.lcs(slug) on delete cascade,
  name    text not null default '',
  role    text not null default 'LCVP',
  area    text not null default '',
  bio       text not null default '',
  email     text not null default '',
  linkedin  text not null default '',
  instagram text not null default '',
  facebook  text not null default '',
  twitter   text not null default '',
  tiktok    text not null default '',
  photo   text,
  sort    int  not null default 0
);

create table if not exists public.resources (
  id     bigint generated always as identity primary key,
  cat    text not null default '',
  label  text not null default '',
  "desc" text not null default '',
  url    text not null default '',
  type   text not null default 'link',
  sort   int  not null default 0
);

create table if not exists public.events (
  id       bigint generated always as identity primary key,
  name     text not null default '',
  date     date not null,
  "end"    date not null,
  location text not null default '',
  type     text not null default 'National',
  reg      text,
  sort     int  not null default 0
);

create table if not exists public.news (
  id    bigint generated always as identity primary key,
  date  date not null,
  title text not null default '',
  body  text not null default '',
  sort  int  not null default 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Grants (Supabase roles) — RLS below still governs row visibility for anon.
-- ─────────────────────────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated, service_role;
grant select on public.areas, public.mc_members, public.lcs, public.lc_members,
  public.resources, public.events, public.news to anon, authenticated;
grant all on public.areas, public.mc_members, public.lcs, public.lc_members,
  public.resources, public.events, public.news to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row-level security: everyone may READ; only the service_role (used by the
-- server-side admin API) may write. The public/anon key cannot modify data.
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array['areas','mc_members','lcs','lc_members','resources','events','news']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "public read %1$s" on public.%1$I;', t);
    execute format('create policy "public read %1$s" on public.%1$I for select using (true);', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data (only runs while a table is empty)
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.areas (code, name, "desc", mcvp, slides, sort)
select * from (values
  ('MKT','Marketing & Communications','Brand, digital presence, and member engagement across Czech Republic.','To be announced','',1),
  ('OGX','Outgoing Exchange','Facilitating outgoing volunteer & professional exchange opportunities.','To be announced','',2),
  ('ICX','Incoming Exchange','Managing incoming global talent and volunteer exchange programs.','To be announced','',3),
  ('BD','Business Development','Building partnerships and corporate relationships nationwide.','To be announced','',4),
  ('TM','Talent Management','Recruitment, member development, and HR practices across all LCs.','To be announced','',5),
  ('FIN','Finance','Financial governance, reporting, and accountability for the entity.','To be announced','',6)
) v(code,name,"desc",mcvp,slides,sort)
where not exists (select 1 from public.areas);

insert into public.mc_members (role, name, area, bio, linkedin, photo, sort)
select * from (values
  ('MCP','To be announced','President','','',null::text,1),
  ('MCVP','To be announced','MKT','','',null::text,2),
  ('MCVP','To be announced','OGX','','',null::text,3),
  ('MCVP','To be announced','ICX','','',null::text,4),
  ('MCVP','To be announced','BD','','',null::text,5),
  ('MCVP','To be announced','TM','','',null::text,6),
  ('MCVP','To be announced','FIN','','',null::text,7)
) v(role,name,area,bio,linkedin,photo,sort)
where not exists (select 1 from public.mc_members);

insert into public.lcs (slug, name, city, university, lcp, intro, color, sort)
select * from (values
  ('prague','AIESEC in Prague','Prague','Charles University / CTU','To be announced','The largest and oldest LC in Czech Republic, based in Prague at Charles University and CTU.','#037ef3',1),
  ('brno','AIESEC in Brno','Brno','Masaryk University / BUT','To be announced','A vibrant LC at Masaryk University and Brno University of Technology.','#0cb9c1',2),
  ('ostrava','AIESEC in Ostrava','Ostrava','VŠB-TUO','To be announced','Growing LC focused on industrial and business partnerships in the Moravian-Silesian region.','#f48924',3),
  ('liberec','AIESEC in Liberec','Liberec','TU Liberec','To be announced','Dynamic LC with strong exchange track record at TU Liberec.','#7552cc',4),
  ('olomouc','AIESEC in Olomouc','Olomouc','Palacký University','To be announced','Palacký University LC known for high-quality incoming volunteer projects.','#00c16e',5)
) v(slug,name,city,university,lcp,intro,color,sort)
where not exists (select 1 from public.lcs);

insert into public.lc_members (lc_slug, name, role, area, sort)
select * from (values
  ('prague','To be announced','LCP','President',1),
  ('prague','To be announced','LCVP','MKT',2),
  ('prague','To be announced','LCVP','OGX',3),
  ('prague','To be announced','LCVP','ICX',4),
  ('prague','To be announced','LCVP','TM',5),
  ('prague','To be announced','LCVP','BD',6),
  ('brno','To be announced','LCP','President',1),
  ('brno','To be announced','LCVP','OGX',2),
  ('brno','To be announced','LCVP','ICX',3),
  ('brno','To be announced','LCVP','TM',4),
  ('ostrava','To be announced','LCP','President',1),
  ('ostrava','To be announced','LCVP','BD',2),
  ('ostrava','To be announced','LCVP','OGX',3),
  ('liberec','To be announced','LCP','President',1),
  ('liberec','To be announced','LCVP','MKT',2),
  ('liberec','To be announced','LCVP','TM',3),
  ('olomouc','To be announced','LCP','President',1),
  ('olomouc','To be announced','LCVP','ICX',2),
  ('olomouc','To be announced','LCVP','FIN',3)
) v(lc_slug,name,role,area,sort)
where not exists (select 1 from public.lc_members);

insert into public.resources (cat, label, "desc", url, type, sort)
select * from (values
  ('MKT','How to Handle the Promotion of Multiple Products at Once','Guide to promoting several AIESEC products simultaneously without diluting your message.','https://drive.google.com/file/d/1k1I7LolQOqGnt8-sy43jN5oqtm7RofGJ/view?usp=sharing','pdf',1),
  ('MKT','Pre-Attraction Period 101','Fundamentals of running an effective pre-attraction period for your marketing funnel.','https://drive.google.com/file/d/15mR2nxTTCSdJg59x6Tn83eubnn5vvTOB/view?usp=sharing','pdf',2),
  ('MKT','What AIESEC Offers — Value & Benefits of Our Products','Overview of the value and benefits behind AIESEC''s products for messaging and positioning.','https://drive.google.com/file/d/1G7K8z6SzKc-9AY8QX0XLB8TsyFzpv5im/view?usp=sharing','pdf',3)
) v(cat,label,"desc",url,type,sort)
where not exists (select 1 from public.resources);

-- events and news start empty (their "coming soon" state on the site).

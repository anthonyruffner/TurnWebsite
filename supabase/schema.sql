-- =============================================
-- Turn – Supabase schema for demo & contact forms
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================

-- Demo requests (from "Get Demo" form)
create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  created_at timestamptz not null default now()
);

-- Contact messages (from Contact page form)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company text,
  message text,
  created_at timestamptz not null default now()
);

-- Optional: enable Row Level Security (RLS) and allow anonymous inserts only.
-- This lets anyone insert rows (needed for your public forms) but not read/update/delete.
alter table public.demo_requests enable row level security;
alter table public.contact_messages enable row level security;

create policy "Allow anonymous insert on demo_requests"
  on public.demo_requests for insert
  to anon
  with check (true);

create policy "Allow anonymous insert on contact_messages"
  on public.contact_messages for insert
  to anon
  with check (true);

-- Optional: only allow authenticated users (e.g. you) to read rows.
-- Uncomment and run if you want to restrict reads to logged-in users.
-- create policy "Allow authenticated read on demo_requests"
--   on public.demo_requests for select
--   to authenticated
--   using (true);
-- create policy "Allow authenticated read on contact_messages"
--   on public.contact_messages for select
--   to authenticated
--   using (true);

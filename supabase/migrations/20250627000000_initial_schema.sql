-- SPEEDHOME Rental Price Dashboard — initial schema (Phase 4 prep)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- search_sessions
-- ---------------------------------------------------------------------------
create table if not exists public.search_sessions (
  id uuid primary key default gen_random_uuid(),
  search_type text not null check (search_type in ('url', 'area')),
  search_query text not null,
  status text not null default 'pending' check (
    status in ('pending', 'scraping', 'completed', 'failed')
  ),
  error_message text,
  listing_count integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_search_sessions_created_at
  on public.search_sessions (created_at desc);

-- ---------------------------------------------------------------------------
-- property_listings
-- ---------------------------------------------------------------------------
create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.search_sessions (id) on delete cascade,
  listing_url text not null,
  title text not null default 'Not Available',
  property_name text not null default 'Not Available',
  area text not null default 'Not Available',
  monthly_price numeric(12, 2),
  annual_price numeric(12, 2),
  bedrooms text not null default 'Not Available',
  furniture_status text not null default 'Not Available',
  property_size_sqft numeric(10, 2),
  property_type text not null default 'Not Available',
  scraped_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_listings_listing_url_key unique (listing_url)
);

create index if not exists idx_property_listings_session_id
  on public.property_listings (session_id);

create index if not exists idx_property_listings_area
  on public.property_listings (area);

create index if not exists idx_property_listings_property_type
  on public.property_listings (property_type);

-- ---------------------------------------------------------------------------
-- search_statistics
-- ---------------------------------------------------------------------------
create table if not exists public.search_statistics (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.search_sessions (id) on delete cascade,
  property_type text not null default 'all',
  listing_count integer not null default 0,
  average_price numeric(12, 2),
  median_price numeric(12, 2),
  mode_price numeric(12, 2),
  fair_price numeric(12, 2),
  average_size_sqft numeric(10, 2),
  calculated_at timestamptz not null default now(),
  constraint search_statistics_session_property_type_key
    unique (session_id, property_type)
);

create index if not exists idx_search_statistics_session_id
  on public.search_statistics (session_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists property_listings_set_updated_at on public.property_listings;

create trigger property_listings_set_updated_at
before update on public.property_listings
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security (MVP: no auth — server uses service role)
-- ---------------------------------------------------------------------------
alter table public.search_sessions enable row level security;
alter table public.property_listings enable row level security;
alter table public.search_statistics enable row level security;

create policy "Allow anon read search_sessions"
  on public.search_sessions
  for select
  to anon, authenticated
  using (true);

create policy "Allow anon read property_listings"
  on public.property_listings
  for select
  to anon, authenticated
  using (true);

create policy "Allow anon read search_statistics"
  on public.search_statistics
  for select
  to anon, authenticated
  using (true);

-- Writes are performed server-side with the service role key only.

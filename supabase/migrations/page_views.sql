-- Visitor tracking table for SOS Work Abroad
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  referrer text,
  device text, -- 'mobile', 'tablet', 'desktop'
  visitor_id text not null,
  created_at timestamptz not null default now()
);

-- Fast query indices for analytics
create index if not exists idx_page_views_created_at on public.page_views (created_at desc);
create index if not exists idx_page_views_page on public.page_views (page);
create index if not exists idx_page_views_visitor on public.page_views (visitor_id);

-- Enable RLS (Service role can read and insert; public cannot read)
alter table public.page_views enable row level security;

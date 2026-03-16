-- The Creative Record Customer Portal Database Schema
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase Auth)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Purchases table (linked to Stripe)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete set null,
  email text not null, -- for linking before account creation
  stripe_session_id text unique,
  product_id text not null,
  product_name text not null,
  product_type text not null, -- 'skill', 'script_desk', 'script_review', 'custom_skill'
  amount_paid integer not null, -- in cents
  currency text default 'usd',
  status text default 'active', -- 'active', 'refunded', 'expired'
  scripts_remaining integer, -- for script desk packages
  expires_at timestamp with time zone, -- for script desk validity
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Service requests table (briefs, reviews, etc)
create table if not exists public.service_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete set null,
  email text not null,
  purchase_id uuid references public.purchases(id) on delete set null,
  request_type text not null, -- 'script_desk', 'script_review', 'custom_skill'
  status text default 'received', -- 'received', 'acknowledged', 'in_progress', 'delivered', 'completed'
  title text not null,
  description text,
  request_data jsonb, -- store form data
  delivery_url text,
  notes text,
  time_logged_minutes integer default 0,
  received_at timestamp with time zone default timezone('utc'::text, now()) not null,
  acknowledged_at timestamp with time zone,
  started_at timestamp with time zone,
  delivered_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- Row Level Security (RLS) policies

-- Users can only see their own user data
alter table public.users enable row level security;
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Purchases: users can only see their own
alter table public.purchases enable row level security;
create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- Service requests: users can only see their own
alter table public.service_requests enable row level security;
create policy "Users can view own requests"
  on public.service_requests for select
  using (auth.uid() = user_id);

-- Functions

-- Update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger purchases_updated_at
  before update on public.purchases
  for each row execute function public.handle_updated_at();

-- Indexes
create index if not exists idx_purchases_user_id on public.purchases(user_id);
create index if not exists idx_purchases_email on public.purchases(email);
create index if not exists idx_service_requests_user_id on public.service_requests(user_id);
create index if not exists idx_service_requests_email on public.service_requests(email);
create index if not exists idx_service_requests_status on public.service_requests(status);

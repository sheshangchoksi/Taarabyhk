-- TaaraByHK — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project → SQL Editor → New query).

create table if not exists orders (
  id bigint generated always as identity primary key,
  order_code text unique not null,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  pincode text not null,
  items jsonb not null,
  subtotal numeric not null,
  status text not null default 'pending', -- pending | verified | shipped | delivered
  payment_ref text,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- Anyone (using the public anon key) can create an order at checkout.
create policy "Anyone can insert an order"
  on orders for insert
  to anon
  with check (true);

-- Note: there is deliberately NO general "select" policy for the anon
-- role. If there were, anyone holding the public anon key could list
-- every customer's name, phone number and address. Instead, order
-- lookups for the "Track your order" page go through the function
-- below, which only ever returns the single row matching an exact
-- order_code the visitor already knows.

create or replace function get_order_by_code(code text)
returns setof orders
language sql
security definer
set search_path = public
as $$
  select * from orders where order_code = code limit 1;
$$;

grant execute on function get_order_by_code(text) to anon;

-- Only signed-in admins (created in Authentication → Users) can update
-- order status from the admin dashboard.
create policy "Authenticated users can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read all orders"
  on orders for select
  to authenticated
  using (true);

-- Helpful index for the tracking page lookups.
create index if not exists idx_orders_order_code on orders (order_code);

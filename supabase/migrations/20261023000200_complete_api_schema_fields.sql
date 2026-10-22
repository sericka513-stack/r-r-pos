-- Bring the PostgreSQL schema up to the current API's declared data shape.
-- This is schema-only; no production data or credentials are imported.
create table if not exists public.cash_management_report_daily (
  date text primary key,
  fund_from_yesterday_override double precision,
  total_expenses double precision not null default 0,
  manual_cash_adjustment double precision not null default 0,
  physical_cash_on_hand double precision not null default 0,
  saved_by text not null default '',
  saved_by_id text not null default '',
  saved_at text not null default ''
);
alter table public.gcash_transactions add column if not exists provider_fee double precision not null default 0;
alter table public.gcash_transactions add column if not exists fee_option text not null default '';
alter table public.gcash_transactions add column if not exists customer_payment_amount double precision not null default 0;
alter table public.gcash_transactions add column if not exists payout_amount double precision not null default 0;
alter table public.gcash_transactions add column if not exists fee_payment_source text not null default '';
alter table public.gcash_transactions add column if not exists bank_transfer_fee double precision not null default 0;
alter table public.gcash_transactions add column if not exists transfer_destination text not null default '';
alter table public.gcash_transactions add column if not exists amount_transferred double precision not null default 0;
alter table public.gcash_transactions add column if not exists wallet_deduction double precision not null default 0;
alter table public.gcash_transactions add column if not exists cash_collected double precision not null default 0;
alter table public.gcash_transactions add column if not exists transaction_status text not null default '';
alter table public.gcash_transactions add column if not exists bank_transfer_reference text not null default '';
alter table public.cash_management_report_daily enable row level security;
revoke all on table public.cash_management_report_daily from anon, authenticated;
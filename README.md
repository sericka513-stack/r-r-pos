# R&R POS

R&R POS is the current Supabase-backed POS workspace hosted on Cloudflare Workers. Its visual reference is the uploaded JEDS Minimart project.

## Preview

- **JEDS-style R&R POS preview:** https://rr-pos-jeds-preview.rrpos.workers.dev
- **Production Worker (unchanged by this preview):** https://rr-pos.rrpos.workers.dev
- **GitHub review:** https://github.com/sericka513-stack/r-r-pos/pull/2

The preview Worker was deployed separately so the updated layout can be checked before changing production.

## Stack

- **Hosting:** Cloudflare Workers
- **Authentication:** Supabase Auth email/password
- **Database:** Supabase PostgreSQL
- **API:** Supabase Edge Function `pos-api`
- **D1:** Not used by this deployment

Supabase project: https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd

## Current preview features

The preview uses the JEDS Minimart-style dark-green sidebar, cream background, rounded white cards, responsive navigation and compact tables. It connects to the existing Supabase API for Dashboard data, checkout, inventory, sales, customers and suppliers.

Reports, cash management, GCash operations, account administration, activity logs, rollback/history and the full multi-item POS workflow have not yet been ported feature-for-feature. They are labelled in the UI instead of being represented as working features when they are not yet backed by the current API.

## Account and data status

- One confirmed Supabase Auth user currently exists.
- That Auth user has no trusted POS role in `app_metadata`; the API accepts `admin`, `manager` or `cashier` only. Role assignment must be done through a trusted admin workflow, not user-editable metadata.
- The public POS tables currently contain no imported store records.
- No D1 database was found in the currently connected Cloudflare account.
- The uploaded JEDS Minimart archive contains the original interface and D1-oriented code, but no production data export. Consequently, legacy custom username/password accounts and historical sales/inventory are not imported by this code update.

Before production rollout, assign the intended existing account its correct trusted role and import original data only from a verified backup/export, if one is available. Do not expose a Supabase service-role key in the browser.

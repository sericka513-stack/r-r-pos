# R&R POS

Repository for the R&R POS Supabase migration and Cloudflare hosting.

## Cloudflare hosting

- **Cloudflare Worker (deployed):** https://rr-pos.rrpos.workers.dev
- Health endpoint: https://rr-pos.rrpos.workers.dev/health
- **Cloudflare Pages project (created):** [rr-pos Pages project](https://dash.cloudflare.com/def2642ca524b7ba17d3de7372c2ec36/pages/view/rr-pos)
- Pages project URL when deployed: https://rr-pos.pages.dev
- Cloudflare Pages Git integration could not be connected through the API because Cloudflare returned an internal Git installation authorization error. The Pages project exists, but has no deployment yet.
- Worker source: `workers/rr-pos/index.js`; the hosted HTML is currently embedded in the Worker bundle. Future frontend changes should be redeployed to the Worker or Pages.

## Supabase backend

- Supabase project: [rr-pos](https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd)
- Project URL: `https://mwywfsuoedjcdahkiepd.supabase.co`
- Edge Function: [pos-api](https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd/functions)
- Function endpoint: `https://mwywfsuoedjcdahkiepd.supabase.co/functions/v1/pos-api`
- Edge Function JWT verification: enabled.
- Database schema: 29 public tables; RLS enabled on all tables.
- Production data: not imported.

## Current frontend status

The initial interface supports Supabase Auth email/password sign-in, inventory viewing and adding products, recent sales, and a basic single-product checkout flow. It is **not a full feature-for-feature port** of the original Cloudflare/D1 POS app. Legacy admin/user workflows, GCash operations, receipts, reports, reconciliation, offline support, rollback/history and multi-item checkout still need migration and testing.

## Authentication setup required

The frontend uses Supabase Auth email/password sign-in. A user must be created by a project administrator, and their **app metadata** must contain a trusted role of `admin`, `manager`, or `cashier`. Do not set roles in user-editable metadata. No login account has been provisioned, and old D1 username/password accounts have not been imported.

For the first administrator:
1. Open Supabase Dashboard → Authentication → Users and create/invite the intended administrator account.
2. Assign `app_metadata.role = admin` using a trusted server/admin workflow (not browser code).
3. Sign in to the hosted POS and test with non-production data.

## Security and data notes

- The API requires a valid Supabase JWT and checks trusted `app_metadata.role`.
- Direct `anon` and `authenticated` table grants are revoked; the Edge Function uses its server-side service key only after verifying the user.
- Sale checkout uses a PostgreSQL transaction function to validate stock, decrement stock, write stock movements, and insert the sale atomically.
- Do not expose a service-role key in frontend code.
- No production data has been imported. The archive's production SQL dump and Wrangler account cache are intentionally excluded.
- The old app's plaintext-password compatibility path was not ported.

## Database choice

Supabase is the sole database for this deployment. Cloudflare D1 is not needed unless we intentionally decide to migrate the app back to D1.

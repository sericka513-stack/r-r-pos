# R&R POS

Repository for the R&R POS Supabase migration.

## Live backend

- Supabase project: [rr-pos](https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd)
- Project URL: `https://mwywfsuoedjcdahkiepd.supabase.co`
- Edge Function: [pos-api](https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd/functions)
- Function endpoint: `https://mwywfsuoedjcdahkiepd.supabase.co/functions/v1/pos-api`
- Edge Function JWT verification: enabled.
- Database schema: 29 public tables; RLS enabled on all tables.
- Production data: not imported.

## Current frontend

`public/index.html` is an initial Supabase-connected starter interface for sign-in, inventory listing/addition, recent sales, and a one-product checkout flow. It is **not a full feature-for-feature port** of the supplied Cloudflare/D1 POS app. The legacy API actions for users/admin workflows, full GCash operations, receipts, reports, reconciliation, offline support, rollback/history and multi-item checkout still need migration and testing.

## Authentication setup required

The frontend uses Supabase Auth email/password sign-in. A user must be created by a project administrator, and their **app metadata** must contain a trusted role of `admin`, `manager`, or `cashier`. Do not set roles in user-editable metadata. No login account has been provisioned by this deployment, and the old D1 username/password accounts have not been imported.

For the first administrator:
1. Open Supabase Dashboard → Authentication → Users and create/invite the intended administrator account.
2. Assign `app_metadata.role = admin` using a trusted server/admin workflow (not from browser code).
3. Test sign-in at the deployed frontend after hosting is configured.

## Security and data notes

- The API requires a valid Supabase JWT and checks trusted `app_metadata.role`.
- Direct `anon` and `authenticated` table grants are revoked; the Edge Function uses its server-side service key only after verifying the user.
- Sale checkout uses a PostgreSQL transaction function to validate stock, decrement stock, write stock movements, and insert the sale atomically.
- Do not expose a service-role key in frontend code.
- No production data has been imported. The archive's production SQL dump and Wrangler account cache are intentionally excluded.
- The old app's plaintext-password compatibility path was not ported.

## Hosting status

The code is in GitHub, but the frontend is not yet published to a public website. Connect this repository to a static host such as Cloudflare Pages or configure GitHub Pages before treating the site as live. Test with non-production data before importing any approved business data.

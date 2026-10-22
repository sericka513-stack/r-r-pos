# Jeds Minimart — Supabase-only backend

This branch restores the original Jeds Minimart frontend from the supplied `R&R POS.zip`. The UI, CSS, labels, navigation, workflows and PWA assets have not been redesigned.

## Architecture

- Cloudflare Pages serves the original `public/index.html` and static assets.
- The existing same-origin `/api` route forwards requests to the Supabase Edge Function `jeds-api`.
- The original API contract and legacy account/session checks are preserved; the backend query adapter connects to Supabase PostgreSQL through `SUPABASE_DB_URL`.
- No Cloudflare D1 database or binding is used.

## Original data and accounts

The current Supabase project has the compatible tables but did not have the original Jeds Minimart rows when checked. The source export is inside the user-provided `R&R POS with SQL.zip` file at `jeds-minimart-cloudflare-main/jeds-minimart-production.sql`. This export contains sensitive account/session data, so it is intentionally not stored in GitHub.

To import it safely on your own computer:

1. Extract `jeds-minimart-production.sql` from your private ZIP. Keep that SQL file private.
2. Use Node.js 22.13 or newer and install the pinned client in this project folder: `npm install --no-save postgres@3.4.7`.
3. In Supabase Dashboard → Connect, copy a PostgreSQL connection URI. If your network has no IPv6 support, choose the Session Pooler connection. In your local terminal set it as `SUPABASE_DB_URL`; never paste it into chat or commit it.
4. Run `node scripts/import-jeds-sql.mjs "/path/to/jeds-minimart-production.sql"`.

The script checks destination tables and columns first, refuses to import over existing rows, imports within a PostgreSQL transaction, preserves legacy user hashes/salts/session records, resets the stock-movement identity sequence, and verifies row counts. It only prints table names and row counts. Do not run it twice against a non-empty database.

## Verify before production

Use the preview deployment first, test a known existing username/password, checkout, inventory, reports, activity log, account management, trash approvals, cash-management and GCash actions. Keep production and the original SQL backup untouched until login and data counts are verified.

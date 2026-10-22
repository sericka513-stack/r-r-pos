# R&R POS

Repository for the R&R POS application.

## Deployment status

- Supabase project: [rr-pos](https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd)
- Region: `ap-southeast-1` (Singapore)
- Project URL: `https://mwywfsuoedjcdahkiepd.supabase.co`
- PostgreSQL schema: **created and verified** (29 tables; row-level security enabled on all 29).
- Application source and API port: **not yet deployed**.
- Production data: **not imported**.

The supplied application is built around Cloudflare Pages/D1. The schema migrations in `supabase/migrations/` establish the PostgreSQL tables, but the existing SQLite/D1 API cannot run against Supabase unchanged. The API and authentication must be ported and tested before the site can be considered deployable.

## Security

The database currently has no production records. Operational tables have row-level security enabled and direct `anon`/`authenticated` table grants revoked until the API has proper authentication and authorization. The legacy users table deliberately has no plaintext password column. Use Supabase Auth or an equivalently secure server-side auth design; never expose a service-role key in browser code.

Never commit production database exports, customer/transaction data, credentials, `.env` files, or local Cloudflare/Wrangler account state. The original archive's production SQL dump and `.wrangler` cache are intentionally excluded.

## Next steps

1. Port the D1 API actions to a secure Supabase-backed API.
2. Migrate authentication and role checks; remove plaintext-password retrieval and compatibility paths.
3. Upload the sanitized frontend/assets and configure deployment secrets outside Git.
4. Test with non-production data before importing any approved production data.

# R&R POS

Repository for the R&R POS application.

## Deployment status

- Supabase project: [rr-pos](https://supabase.com/dashboard/project/mwywfsuoedjcdahkiepd)
- Region: `ap-southeast-1` (Singapore)
- Project URL: `https://mwywfsuoedjcdahkiepd.supabase.co`
- Database schema and application API migration: not yet deployed.
- Application source files: not yet uploaded.

The supplied archive is built around Cloudflare Pages/D1. Its SQLite/D1 schema and API are not directly compatible with Supabase PostgreSQL. A PostgreSQL migration and API/authentication adaptation must be completed and tested before this repository can be considered deployable.

## Security

Never commit production database exports, real customer/transaction data, credentials, `.env` files, or local Cloudflare/Wrangler account state. The original archive's production SQL dump and `.wrangler` cache are intentionally excluded. Review authentication and remove plaintext-password compatibility before public production use.

## Next steps

1. Port and test the D1 schema/migrations to PostgreSQL.
2. Adapt the API to Supabase/Postgres and use secure authentication.
3. Upload sanitized application source and configure deployment secrets outside Git.
4. Test with non-production data before importing approved production data.

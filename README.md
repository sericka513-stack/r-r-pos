# Jeds Minimart — Supabase backend

This deployment preserves the original supplied Jeds Minimart frontend and API request/response shape. Cloudflare Pages hosts the static UI and proxies `/api` to the Supabase Edge Function `jeds-api`. Supabase PostgreSQL is the only database; no Cloudflare D1 binding is used.

The current `public/index.html` is preserved from the uploaded source. Do not redesign or replace it while making backend changes. Apply `migrations/20261023_jeds_supabase_compat.sql` and import the supplied private production export before switching production over. Never commit the production SQL export, user passwords or session data to GitHub.

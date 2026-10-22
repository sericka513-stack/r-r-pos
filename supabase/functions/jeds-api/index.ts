import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { handleStoreApi } from "./api-core.js";
import { createPostgresCompat } from "./db-compat.ts";
const connectionString = Deno.env.get("SUPABASE_DB_URL");
const db = connectionString ? createPostgresCompat(connectionString) : null;
const env = { DB: db, JED_ADMIN_SETUP_KEY: Deno.env.get("JED_ADMIN_SETUP_KEY") || "" };
Deno.serve(async (request: Request) => {
  if (!db) return new Response(JSON.stringify({ ok: false, error: "Supabase PostgreSQL connection is not configured." }), {
    status: 503, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
  try { return await handleStoreApi(request, env); }
  catch (error) {
    console.error("JEDS Supabase API failed:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ ok: false, error: "The store API encountered an unexpected error." }), {
      status: 500, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
});

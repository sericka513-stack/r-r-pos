const SUPABASE_FUNCTION_URL = "https://mwywfsuoedjcdahkiepd.supabase.co/functions/v1/jeds-api";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_RtnRZ7hSk-Pxlzj-ZEh86A_nTOAy8c_";
export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return new Response(JSON.stringify({ ok: false, error: "Use POST for store API requests." }), {
    status: 405, headers: { "Content-Type": "application/json; charset=utf-8", "Allow": "POST", "Cache-Control": "no-store" },
  });
  let body;
  try { body = await request.arrayBuffer(); } catch {
    return new Response(JSON.stringify({ ok: false, error: "Could not read the API request body." }), {
      status: 400, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (body.byteLength > 1000000) return new Response(JSON.stringify({ ok: false, error: "The request is too large." }), {
    status: 413, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
  const headers = new Headers({ "Content-Type": "application/json", "apikey": SUPABASE_PUBLISHABLE_KEY, "Cache-Control": "no-store" });
  const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For");
  if (clientIp) headers.set("X-Forwarded-For", clientIp.split(",")[0].trim());
  let upstream;
  try { upstream = await fetch(SUPABASE_FUNCTION_URL, { method: "POST", headers, body }); }
  catch {
    return new Response(JSON.stringify({ ok: false, error: "The Supabase store API could not be reached. Please retry." }), {
      status: 502, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return new Response(upstream.body, { status: upstream.status, headers: {
    "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff",
  } });
}

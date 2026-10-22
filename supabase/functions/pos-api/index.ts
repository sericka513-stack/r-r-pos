import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const TABLES = [
  "products", "sales", "customers", "suppliers", "categories", "stock_movement",
  "settings", "trash", "trash_requests", "activity_log", "cash_reconciliation",
  "cash_management_daily", "cash_management_expenses", "cash_management_corrections",
  "cash_management_record_history", "gcash_transactions", "gcash_wallet_balance",
  "gcash_balance_movements", "cash_management_report_daily",
  "cash_management_report_expenses", "cash_management_report_cash_movements",
  "password_requests", "change_history", "activity_reads", "account_change_requests",
  "user_access_log"
];

const PRIMARY_KEYS: Record<string, string> = {
  products: "product_id", sales: "transaction_id", customers: "customer_id",
  suppliers: "supplier_id", categories: "category", stock_movement: "movement_id",
  settings: "key", trash: "trash_id", trash_requests: "request_id",
  activity_log: "log_id", cash_reconciliation: "date", cash_management_daily: "date",
  cash_management_expenses: "expense_id", cash_management_corrections: "correction_id",
  cash_management_record_history: "history_id", gcash_transactions: "transaction_id",
  gcash_wallet_balance: "wallet_id", gcash_balance_movements: "movement_id",
  cash_management_report_daily: "date", cash_management_report_expenses: "expense_id",
  cash_management_report_cash_movements: "movement_id", password_requests: "request_id",
  change_history: "history_id", account_change_requests: "request_id",
  user_access_log: "device_id"
};

const CASHIER_TABLES = new Set(["products", "sales", "customers", "categories", "stock_movement", "gcash_transactions", "gcash_wallet_balance", "gcash_balance_movements"]);
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ ok: false, error: "POST required" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return reply({ ok: false, error: "Server configuration missing" }, 500);

  const authorization = req.headers.get("Authorization") || "";
  const jwt = authorization.replace(/^Bearer\s+/i, "");
  if (!jwt) return reply({ ok: false, error: "Sign-in required" }, 401);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(jwt);
  if (authError || !authData.user) return reply({ ok: false, error: "Invalid or expired session" }, 401);

  // Privileges must be assigned by a trusted administrator in app_metadata, never user_metadata.
  const role = String(authData.user.app_metadata?.role || "").toLowerCase();
  if (!["admin", "cashier", "manager"].includes(role)) {
    return reply({ ok: false, error: "Account has no POS role; ask an administrator to assign one" }, 403);
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply({ ok: false, error: "Invalid JSON" }, 400); }
  const action = String(body.action || "");
  const isAdmin = role === "admin" || role === "manager";

  try {
    if (action === "ping") return reply({ ok: true, database: "Supabase PostgreSQL", role });
    if (action === "authStatus") return reply({ ok: true, authenticated: true, user: { id: authData.user.id, email: authData.user.email, role } });

    if (action === "recordSale") {
      if (!["admin", "manager", "cashier"].includes(role)) return reply({ ok: false, error: "Insufficient role" }, 403);
      const sale = body.sale;
      const items = body.items;
      if (!sale || typeof sale !== "object" || !Array.isArray(items)) return reply({ ok: false, error: "Expected sale and items" }, 400);
      const { data, error } = await admin.rpc("record_pos_sale", { p_sale: sale, p_items: items });
      if (error) {
        const expected = /Insufficient stock|Product not found|Invalid sale|Each sale item/i.test(error.message);
        return reply({ ok: false, error: expected ? error.message : "Could not record sale" }, expected ? 409 : 500);
      }
      return reply({ ok: true, data });
    }

    const legacyUpserts: Record<string, string> = {
      saveProduct: "products", saveCustomer: "customers", saveSupplier: "suppliers",
      saveSettings: "settings", saveCashManagementReport: "cash_management_report_daily",
      saveReconciliation: "cash_reconciliation"
    };
    if (Object.hasOwn(legacyUpserts, action)) {
      const table = legacyUpserts[action];
      const row = body.row ?? body.product ?? body.customer ?? body.supplier ?? body.settings;
      if (!row || typeof row !== "object" || Array.isArray(row)) return reply({ ok: false, error: "Missing record payload" }, 400);
      if (!isAdmin && table !== "customers") return reply({ ok: false, error: "Only an administrator can modify this table" }, 403);
      const key = PRIMARY_KEYS[table];
      if (!key || !Object.hasOwn(row, key)) return reply({ ok: false, error: `Missing primary key: ${key || "not configured"}` }, 400);
      const { data, error } = await admin.from(table).upsert(row, { onConflict: key }).select().single();
      if (error) throw new Error(error.message);
      return reply({ ok: true, data });
    }

    if (action === "getData") {
      const requested = Array.isArray(body.tables) ? body.tables.map(String) : TABLES;
      const names = [...new Set(requested)].filter(t => TABLES.includes(t) && (isAdmin || CASHIER_TABLES.has(t)));
      const result: Record<string, unknown[]> = {};
      for (const table of names) {
        const { data, error } = await admin.from(table).select("*").limit(5000);
        if (error) throw new Error(`${table}: ${error.message}`);
        result[table] = data || [];
      }
      return reply({ ok: true, data: result });
    }

    if (action === "upsert") {
      const table = String(body.table || "");
      const row = body.row;
      if (!TABLES.includes(table) || table === "users" || table === "user_sessions" || !row || typeof row !== "object" || Array.isArray(row)) {
        return reply({ ok: false, error: "Unsupported table or invalid row" }, 400);
      }
      if (!isAdmin && action !== "saveCustomer") return reply({ ok: false, error: "Only an administrator can modify this table" }, 403);
      const key = PRIMARY_KEYS[table];
      if (!key || !Object.hasOwn(row, key)) return reply({ ok: false, error: `Missing primary key: ${key || "not configured"}` }, 400);
      const { data, error } = await admin.from(table).upsert(row, { onConflict: key }).select().single();
      if (error) throw new Error(error.message);
      return reply({ ok: true, data });
    }

    if (action === "delete") {
      const table = String(body.table || "");
      const key = PRIMARY_KEYS[table];
      const id = body.id;
      if (!TABLES.includes(table) || !key || id === undefined || table === "users" || table === "user_sessions") {
        return reply({ ok: false, error: "Unsupported table or missing record ID" }, 400);
      }
      if (!isAdmin) return reply({ ok: false, error: "Only an administrator can delete records" }, 403);
      const { error } = await admin.from(table).delete().eq(key, id);
      if (error) throw new Error(error.message);
      return reply({ ok: true });
    }

    return reply({ ok: false, error: "Unsupported action. This API is a secure migration foundation; remaining legacy POS actions still need porting." }, 400);
  } catch (e) {
    console.error("pos-api request failed", e);
    return reply({ ok: false, error: "Request failed. Check server logs." }, 500);
  }
});
import postgres from "npm:postgres@3.4.7";
type Prepared = {
  query: string; params: unknown[];
  run: () => Promise<Record<string, unknown>>;
  first: (columnName?: string) => Promise<unknown>;
  all: () => Promise<{ results: Record<string, unknown>[]; success: boolean; meta: { changes: number } }>;
  bind: (...params: unknown[]) => Prepared;
  execute: (client: any) => Promise<any>;
};
function translate(sqlText: string, params: unknown[]) {
  const pragma = sqlText.match(/^\s*PRAGMA\s+table_info\s*\(\s*([a-z_][a-z0-9_]*)\s*\)\s*;?\s*$/i);
  if (pragma) return {
    sql: "SELECT (ordinal_position - 1)::int AS cid, column_name AS name, data_type AS type, CASE WHEN is_nullable='NO' THEN 1 ELSE 0 END AS notnull, column_default AS dflt_value, 0::int AS pk FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position",
    params: [pragma[1].toLowerCase()], ignoreConflict: false
  };
  let q = sqlText.trim();
  const ignoreConflict = /^\s*INSERT\s+OR\s+IGNORE\s+INTO\b/i.test(q);
  if (ignoreConflict) q = q.replace(/^\s*INSERT\s+OR\s+IGNORE\s+INTO\b/i, "INSERT INTO");
  q = q.replace(/\browid\b/gi, "legacy_order").replace(/\bchar\s*\(/gi, "chr(");
  let output = "", single = false, double = false, count = 0;
  for (let i = 0; i < q.length; i++) {
    const ch = q[i];
    if (single) { output += ch; if (ch === "'" && q[i+1] === "'") output += q[++i]; else if (ch === "'") single = false; continue; }
    if (double) { output += ch; if (ch === '"' && q[i+1] === '"') output += q[++i]; else if (ch === '"') double = false; continue; }
    if (ch === "'") { single = true; output += ch; continue; }
    if (ch === '"') { double = true; output += ch; continue; }
    if (ch === "?") { output += "$" + (++count); continue; }
    output += ch;
  }
  if (count !== params.length) throw new Error("Database placeholder mismatch: expected " + count + " values but received " + params.length + ".");
  if (ignoreConflict && !/\bON\s+CONFLICT\b/i.test(output)) output = output.replace(/;\s*$/, "").trim() + " ON CONFLICT DO NOTHING";
  return { sql: output, params: params.map(v => v === undefined ? null : v), ignoreConflict };
}
function resultCount(result: any): number {
  return Number.isFinite(result?.count) ? Number(result.count) : Number(result?.length || 0);
}
class PgPreparedStatement implements Prepared {
  query: string; params: unknown[];
  constructor(private readonly pool: any, query: string, params: unknown[] = []) { this.query = query; this.params = params; }
  bind(...params: unknown[]): Prepared { return new PgPreparedStatement(this.pool, this.query, params); }
  async execute(client: any) { const q = translate(this.query, this.params); return await client.unsafe(q.sql, q.params); }
  async all() { const result = await this.execute(this.pool); return { results: Array.from(result) as Record<string, unknown>[], success: true, meta: { changes: resultCount(result) } }; }
  async first(columnName?: string) { const result = await this.execute(this.pool), row = result[0] ?? null; if (columnName) return row ? row[columnName] ?? null : null; return row; }
  async run() { const result = await this.execute(this.pool); return { success: true, results: [], meta: { changes: resultCount(result), last_row_id: null, duration: 0 } }; }
}
export function createD1Compat(connectionString: string) {
  const pool = postgres(connectionString, { max: 1, prepare: false, connect_timeout: 10, idle_timeout: 5, onnotice: () => {} });
  return {
    prepare(query: string): Prepared { return new PgPreparedStatement(pool, query); },
    async batch(statements: Prepared[]) {
      if (!Array.isArray(statements)) throw new Error("Database batch must be an array.");
      return await pool.begin(async (tx: any) => {
        const out = [];
        for (const statement of statements) {
          if (!statement || typeof statement.execute !== "function") throw new Error("Unsupported statement supplied to database batch.");
          const result = await statement.execute(tx);
          out.push({ success: true, results: [], meta: { changes: resultCount(result), last_row_id: null, duration: 0 } });
        }
        return out;
      });
    },
  };
}

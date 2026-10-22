#!/usr/bin/env node
/**
 * Import the original Jeds Minimart SQLite SQL export into Supabase PostgreSQL.
 * The export and database credentials remain local; neither is committed.
 *
 * Requires Node.js >=22.13 and postgres.js 3.4.7:
 *   npm install --no-save postgres@3.4.7
 * Usage:
 *   SUPABASE_DB_URL='postgresql://...' node scripts/import-jeds-sql.mjs /path/to/jeds-minimart-production.sql
 *
 * It refuses to write if a destination table represented in the export is non-empty.
 * It logs table names and counts only, never row contents or credentials.
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import postgres from "postgres";

const inputPath = process.argv[2];
const connectionString = process.env.SUPABASE_DB_URL;

if (!inputPath) {
  console.error("Usage: node scripts/import-jeds-sql.mjs /path/to/jeds-minimart-production.sql");
  process.exit(2);
}
if (!connectionString) {
  console.error("Set SUPABASE_DB_URL in your local terminal first. Do not paste this secret into chat or commit it to GitHub.");
  process.exit(2);
}
if (!fs.existsSync(inputPath)) {
  console.error("SQL export file not found: " + path.resolve(inputPath));
  process.exit(2);
}

const quoteIdent = (value) => '"' + String(value).replaceAll('"', '""') + '"';
const sourceSql = fs.readFileSync(inputPath, "utf8");
const sqlite = new DatabaseSync(":memory:");
const pg = postgres(connectionString, {
  max: 1,
  prepare: false,
  connect_timeout: 15,
  idle_timeout: 5,
  onnotice: () => {},
});

function sourceTables() {
  return sqlite.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  ).all().map((r) => String(r.name));
}

async function targetMetadata() {
  const rows = await pg.unsafe(
    "SELECT table_name, column_name FROM information_schema.columns " +
    "WHERE table_schema='public' ORDER BY table_name, ordinal_position"
  );
  const result = new Map();
  for (const row of rows) {
    const table = String(row.table_name);
    if (!result.has(table)) result.set(table, new Set());
    result.get(table).add(String(row.column_name));
  }
  return result;
}

function sourceRowCount(table) {
  const row = sqlite.prepare("SELECT COUNT(*) AS n FROM " + quoteIdent(table)).get();
  return Number(row.n || 0);
}

async function validateDestination(tables, metadata) {
  const problems = [];
  const counts = {};
  for (const table of tables) {
    const destinationColumns = metadata.get(table);
    if (!destinationColumns) {
      problems.push(table + ": destination table missing");
      continue;
    }
    const columns = sqlite.prepare("PRAGMA table_info(" + quoteIdent(table) + ")").all().map((r) => String(r.name));
    const missing = columns.filter((c) => !destinationColumns.has(c));
    if (missing.length) problems.push(table + ": missing column(s) " + missing.join(", "));
    const result = await pg.unsafe("SELECT COUNT(*)::bigint AS n FROM public." + quoteIdent(table));
    const current = Number(result[0]?.n || 0);
    counts[table] = { source: sourceRowCount(table), destination: current };
    if (current !== 0) problems.push(table + ": destination is not empty (" + current + " rows)");
  }
  if (problems.length) {
    console.error("Import stopped before writing any data. Resolve these checks first:");
    for (const problem of problems) console.error(" - " + problem);
    process.exitCode = 1;
    return null;
  }
  return counts;
}

function createInsert(table, columns, rows) {
  const colSql = columns.map(quoteIdent).join(", ");
  const parameters = [];
  const valueGroups = rows.map((row, rowIndex) => {
    const values = columns.map((col, colIndex) => {
      parameters.push(row[col] === undefined ? null : row[col]);
      return "$" + (rowIndex * columns.length + colIndex + 1);
    });
    return "(" + values.join(", ") + ")";
  });
  return {
    query: "INSERT INTO public." + quoteIdent(table) + " (" + colSql + ") VALUES " + valueGroups.join(", "),
    parameters,
  };
}

async function main() {
  sqlite.exec(sourceSql);
  const tables = sourceTables();
  if (!tables.length) throw new Error("The SQL export did not contain any tables.");
  const metadata = await targetMetadata();
  const before = await validateDestination(tables, metadata);
  if (!before) return;

  const summary = [];
  const chunkSize = 75;
  await pg.begin(async (tx) => {
    for (const table of tables) {
      const sourceColumns = sqlite.prepare("PRAGMA table_info(" + quoteIdent(table) + ")").all().map((r) => String(r.name));
      if (!sourceColumns.length) continue;
      const rows = sqlite.prepare("SELECT * FROM " + quoteIdent(table) + " ORDER BY rowid").all();
      for (let offset = 0; offset < rows.length; offset += chunkSize) {
        const statement = createInsert(table, sourceColumns, rows.slice(offset, offset + chunkSize));
        await tx.unsafe(statement.query, statement.parameters);
      }
      summary.push({ table: table, rows: rows.length });
      console.log("Imported " + table + ": " + rows.length + " row(s)");
    }

    // Explicitly inserted SQLite AUTOINCREMENT IDs do not advance a PostgreSQL
    // identity sequence automatically. Preserve the original IDs and reset it.
    const sequenceResult = await tx.unsafe(
      "SELECT pg_get_serial_sequence('public.stock_movement', 'movement_id') AS sequence"
    );
    const sequence = sequenceResult[0]?.sequence;
    if (sequence) {
      const maxResult = await tx.unsafe("SELECT MAX(movement_id)::bigint AS max_id FROM public.stock_movement");
      const maxId = maxResult[0]?.max_id;
      if (maxId === null || maxId === undefined) {
        await tx.unsafe("SELECT setval($1, 1, false)", [sequence]);
      } else {
        await tx.unsafe("SELECT setval($1, $2, true)", [sequence, maxId]);
      }
    }
  });

  const verify = [];
  for (const table of tables) {
    const result = await pg.unsafe("SELECT COUNT(*)::bigint AS n FROM public." + quoteIdent(table));
    verify.push({ table: table, expected: before[table].source, actual: Number(result[0]?.n || 0) });
  }
  const failed = verify.filter((r) => r.expected !== r.actual);
  console.log("\nImport verification summary:");
  console.table(summary);
  if (failed.length) {
    console.error("Row count mismatch in: " + failed.map((r) => r.table).join(", "));
    process.exitCode = 1;
  } else {
    console.log("Verified " + verify.length + " tables. Legacy users and records have been copied to Supabase PostgreSQL.");
  }
}

try {
  await main();
} catch (error) {
  console.error("Import failed. The PostgreSQL transaction was rolled back where applicable.");
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  sqlite.close();
  await pg.end({ timeout: 5 });
}

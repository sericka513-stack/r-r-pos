const TZ = "Asia/Manila";
const BASELINE = "__BASELINE__";
const PASSWORD_ALGORITHM = "pbkdf2_sha256_150000";
const PASSWORD_ITERATIONS = 150000;
const PASSWORD_MAX = 200;
const PASSWORD_MIN = 10;
const TABLES = {
  products: { pk: "product_id", cols: ["product_id","product_name","category","brand","unit","cost_price","selling_price","stock","min_stock","supplier","pack_size","unit_price","stock_units","pack_type","pack_cost","flavor","added_at","sku_barcode","expiration_date","sku_barcode_2","owner_name"] },
  sales: { pk: "transaction_id", cols: ["date","transaction_id","items","total","profit","payment","change","item_details","time","payment_method","datetime","payment_transaction_id"] },
  customers: { pk: "customer_id", cols: ["customer_id","name","contact","utang_balance","last_transaction","last_datetime"] },
  suppliers: { pk: "supplier_id", cols: ["supplier_id","supplier_name","contact","products","last_purchase","last_datetime"] },
  categories: { pk: "category", cols: ["category"] },
  stock_movement: { pk: "movement_id", cols: ["movement_id","date","product_id","type","quantity","reason","datetime"] },
  settings: { pk: "key", cols: ["key","value"] },
  trash: { pk: "trash_id", cols: ["trash_id","source_tab","record_id","record_name","reason","deleted_at","record_json"] },
  trash_requests: { pk: "request_id", cols: ["request_id","request_type","trash_ids","trash_names","requested_by","requester_id","requested_at","proposed_reason","status","reviewed_by","reviewed_at","decision_note"] },
  activity_log: { pk: "log_id", cols: ["datetime","action","record","details","user","ip_address","device_id","log_id"] },
  cash_reconciliation: { pk: "date", cols: ["date","expected_cash_sales","opening_float","cash_expenses","actual_counted","notes","saved_at"] },
  cash_management_report_daily: { pk: "date", cols: ["date","fund_from_yesterday_override","total_expenses","manual_cash_adjustment","physical_cash_on_hand","saved_by","saved_by_id","saved_at"] },
  cash_management_report_expenses: { pk: "expense_id", cols: ["expense_id","date","category","description","amount","receipt_data","receipt_file_name","receipt_content_type","receipt_size","created_at","created_by","created_by_id","updated_at","updated_by","updated_by_id"] },
  gcash_transactions: { pk: "transaction_id", cols: ["transaction_id","date","time","service_type","customer_name","biller_name","amount","fee","provider_fee","payment_source","fee_option","customer_payment_amount","payout_amount","fee_payment_source","bank_transfer_fee","transfer_destination","amount_transferred","wallet_deduction","cash_collected","transaction_status","bank_transfer_reference","sale_transaction_id","created_at","created_by","created_by_id","receipt_data","receipt_file_name","receipt_content_type","receipt_size","receipt_uploaded_at","receipt_uploaded_by"] },
  gcash_wallet_balance: { pk: "wallet_id", cols: ["wallet_id","balance","updated_at","updated_by","updated_by_id","baseline_date"] },
  gcash_balance_movements: { pk: "movement_id", cols: ["movement_id","movement_date","movement_type","reference_id","description","amount_delta","created_at","created_by","created_by_id"] },
  cash_management_report_cash_movements: { pk: "movement_id", cols: ["movement_id","movement_date","movement_type","reference_id","description","amount_delta","created_at","created_by","created_by_id"] },
  users: { pk: "user_id", cols: ["user_id","username","display_name","password_hash","password_plain_text","password_salt","role","active","created_at","last_login","device_id","auth_version","password_algorithm"] },
  user_sessions: { pk: "token_hash", cols: ["token_hash","user_id","auth_version","issued_at","device_id"] },
  password_requests: { pk: "request_id", cols: ["request_id","username","user_id","display_name","requested_at","status","handled_by","handled_at","request_details"] },
  change_history: { pk: "history_id", cols: ["history_id","log_id","datetime","target_date","action","user","changes_json","status","rolled_back_by","rolled_back_at"] },
  activity_reads: { pk: null, cols: ["user_id","log_id","read_at"] },
  account_change_requests: { pk: "request_id", cols: ["request_id","request_type","user_id","current_username","proposed_value","requested_auth_version","requested_at","status","reviewed_by","reviewed_at","decision_note"] },
  user_access_log: { pk: "device_id", cols: ["device_id","device_name","user_name","ip_address","first_seen","last_seen","visits","user_agent","enabled","notes"] }
};
const HEADERS = {
  products: {"Product ID":"product_id","Product Name":"product_name","Category":"category","Brand":"brand","Unit":"unit","Cost Price":"cost_price","Selling Price":"selling_price","Stock":"stock","Min Stock":"min_stock","Supplier":"supplier","Pack Size":"pack_size","Unit Price":"unit_price","Stock Units":"stock_units","Pack Type":"pack_type","Pack Cost":"pack_cost","Flavor":"flavor","Added At":"added_at","SKU / Barcode":"sku_barcode","Expiration Date":"expiration_date","SKU / Barcode 2":"sku_barcode_2","Owner Name":"owner_name"},
  sales: {"Date":"date","Transaction ID":"transaction_id","Items":"items","Total":"total","Profit":"profit","Payment":"payment","Change":"change","Item Details":"item_details","Time":"time","Payment Method":"payment_method","DateTime":"datetime","Payment Transaction ID":"payment_transaction_id"},
  customers: {"Customer ID":"customer_id","Name":"name","Contact":"contact","Utang Balance":"utang_balance","Last Transaction":"last_transaction","Last DateTime":"last_datetime"},
  suppliers: {"Supplier ID":"supplier_id","Supplier Name":"supplier_name","Contact":"contact","Products":"products","Last Purchase":"last_purchase","Last DateTime":"last_datetime"},
  categories: {"Category":"category"},
  settings: {"Key":"key","Value":"value"},
  trash: {"Trash ID":"trash_id","Source Tab":"source_tab","Record ID":"record_id","Record Name":"record_name","Reason":"reason","Deleted At":"deleted_at","Record JSON":"record_json"},
  trash_requests: {"Request ID":"request_id","Request Type":"request_type","Trash IDs":"trash_ids","Trash Names":"trash_names","Requested By":"requested_by","Requester ID":"requester_id","Requested At":"requested_at","Proposed Reason":"proposed_reason","Status":"status","Reviewed By":"reviewed_by","Reviewed At":"reviewed_at","Decision Note":"decision_note"},
  activity_log: {"DateTime":"datetime","Action":"action","Record":"record","Details":"details","User":"user","IP Address":"ip_address","Device ID":"device_id","Log ID":"log_id"},
  cash_reconciliation: {"Date":"date","Expected Cash Sales":"expected_cash_sales","Opening Float":"opening_float","Cash Expenses":"cash_expenses","Actual Counted":"actual_counted","Notes":"notes","Saved At":"saved_at"},
  stock_movement: {"Date":"date","Product ID":"product_id","Type":"type","Quantity":"quantity","Reason":"reason","DateTime":"datetime"},
  password_requests: {"Request ID":"request_id","Username":"username","User ID":"user_id","Display Name":"display_name","Requested At":"requested_at","Status":"status","Handled By":"handled_by","Handled At":"handled_at","Request Details":"request_details"},
  account_change_requests: {"Request ID":"request_id","Request Type":"request_type","User ID":"user_id","Current Username":"current_username","Proposed Value":"proposed_value","Requested Auth Version":"requested_auth_version","Requested At":"requested_at","Status":"status","Reviewed By":"reviewed_by","Reviewed At":"reviewed_at","Decision Note":"decision_note"},
  users: {"User ID":"user_id","Username":"username","Display Name":"display_name","Password Hash":"password_hash","Password (Plain Text)":"password_plain_text","Salt":"password_salt","Role":"role","Active":"active","Created At":"created_at","Last Login":"last_login","Device ID":"device_id","Auth Version":"auth_version"},
  change_history: {"History ID":"history_id","Log ID":"log_id","DateTime":"datetime","Target Date":"target_date","Action":"action","User":"user","Changes JSON":"changes_json","Status":"status","Rolled Back By":"rolled_back_by","Rolled Back At":"rolled_back_at"}
};
function qi(s) { if (!/^[a-z_][a-z0-9_]*$/i.test(s)) throw new Error("Invalid database identifier."); return '"' + s + '"'; }
function n(v) { const x = Number(v); return Number.isFinite(x) ? x : 0; }
function str(v) { return v === null || v === undefined ? "" : String(v); }
function optionalNum(v) { return v === "" || v === null || v === undefined ? "" : n(v); }
function bool(v) { return v === true || String(v || "").toLowerCase() === "true" || String(v || "") === "1"; }
function normUser(v) { return str(v).trim().toLowerCase(); }
function makeId(prefix) { return prefix + crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase(); }
function phParts(date = new Date()) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const x = {}; p.forEach(v => { x[v.type] = v.value; });
  return x;
}
function phDate(date = new Date()) { const p = phParts(date); return p.year + "-" + p.month + "-" + p.day; }
function phTime(date = new Date()) { const p = phParts(date); return p.hour + ":" + p.minute + ":" + p.second; }
function phDateTime(date = new Date()) { return phDate(date) + " " + phTime(date); }
function phDateTimePrecise(date = new Date()) { return phDateTime(date) + "." + String(date.getMilliseconds()).padStart(3, "0"); }
function normalizeDate(v) {
  if (!v) return "";
  const s = str(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : phDate(d);
}
function normalizeDateTime(v, date, time) {
  if (v) { const s = str(v); if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(s)) return s.replace("T", " ").slice(0, 19); }
  if (date) return str(date).slice(0, 10) + " " + str(time || "00:00:00").slice(0, 8);
  return "";
}
function base64(bytes) { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s); }
function base64Url(bytes) { return base64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
function fromBase64(s) { const raw = atob(str(s)); return Uint8Array.from(raw, c => c.charCodeAt(0)); }
function randomBase64(size = 24) { return base64(crypto.getRandomValues(new Uint8Array(size))); }
async function sha256Base64Url(value) { return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str(value))))); }
async function passwordHash(password, salt) {
  const saltBytes = fromBase64(salt);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(str(password)), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations: PASSWORD_ITERATIONS }, key, 256);
  return base64(new Uint8Array(bits));
}
async function verifyPassword(password, user) {
  if (!user) return false;
  const algorithm = str(user.password_algorithm || PASSWORD_ALGORITHM).toLowerCase();
  // Existing spreadsheet accounts are intentionally stored as plain text per
  // the owner's requirement. Support these records for sign-in and account edits.
  if (algorithm === "plaintext" || ((!user.password_hash || !user.password_salt) && str(user.password_plain_text) !== "")) {
    return constantTimeEqual(str(password), str(user.password_plain_text));
  }
  if (!user.password_hash || !user.password_salt) return false;
  if (algorithm.indexOf("pbkdf2") === 0) {
    const actual = await passwordHash(password, user.password_salt);
    return constantTimeEqual(actual, user.password_hash);
  }
  if (algorithm === "hmac_sha256_4096") {
    let digest = await hmacSha256(str(user.password_salt), str(password));
    for (let i = 1; i < 4096; i++) digest = await hmacSha256(str(user.password_salt), base64(digest) + ":" + i);
    return constantTimeEqual(base64(digest), user.password_hash);
  }
  return false;
}
async function hmacSha256(secret, value) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}
function constantTimeEqual(a, b) {
  a = str(a); b = str(b); let mismatch = a.length ^ b.length; const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) mismatch |= (a.charCodeAt(i % Math.max(1, a.length)) || 0) ^ (b.charCodeAt(i % Math.max(1, b.length)) || 0);
  return mismatch === 0;
}
function userDto(u) { return { id: str(u.user_id), username: str(u.username), displayName: str(u.display_name || u.username), role: str(u.role || "Staff"), active: bool(u.active), createdAt: normalizeDateTime(u.created_at), lastLogin: normalizeDateTime(u.last_login), deviceId: str(u.device_id) }; }
function userLabel(u) { return str(u.display_name || u.username || "User") + " (@" + str(u.username) + ")"; }
function canDirectlyChange(session) { return !!session && (session.role === "Owner" || (session.role === "Staff" && normUser(session.username) === "owner_jed")); }
async function dbRun(env, sql, ...args) { const s = env.DB.prepare(sql); return (args.length ? s.bind(...args) : s).run(); }
async function dbFirst(env, sql, ...args) { const s = env.DB.prepare(sql); return (args.length ? s.bind(...args) : s).first(); }
async function dbAll(env, sql, ...args) { const s = env.DB.prepare(sql); const r = args.length ? await s.bind(...args).all() : await s.all(); return r.results || []; }
function insertStmt(env, table, obj) {
  const def = TABLES[table]; if (!def) throw new Error("Unsupported database table.");
  const keys = Object.keys(obj).filter(k => def.cols.includes(k) && obj[k] !== undefined);
  if (!keys.length) throw new Error("No database fields supplied.");
  return env.DB.prepare("INSERT INTO " + qi(table) + " (" + keys.map(qi).join(",") + ") VALUES (" + keys.map(() => "?").join(",") + ")").bind(...keys.map(k => obj[k] === undefined ? null : obj[k]));
}
async function insertObj(env, table, obj) { return insertStmt(env, table, obj).run(); }
async function updateObj(env, table, key, value, obj) {
  const def = TABLES[table]; if (!def || !def.pk) throw new Error("Unsupported update target.");
  const keys = Object.keys(obj).filter(k => def.cols.includes(k) && k !== def.pk && obj[k] !== undefined);
  if (!keys.length) return { meta: { changes: 0 } };
  return dbRun(env, "UPDATE " + qi(table) + " SET " + keys.map(k => qi(k) + "=?").join(",") + " WHERE " + qi(def.pk) + "=?", ...keys.map(k => obj[k]), value);
}
async function deleteBy(env, table, key, value) { return dbRun(env, "DELETE FROM " + qi(table) + " WHERE " + qi(key) + "=?", value); }
async function getBy(env, table, key, value) { return dbFirst(env, "SELECT * FROM " + qi(table) + " WHERE " + qi(key) + "=? LIMIT 1", value); }
function fromLegacy(table, record) {
  const map = HEADERS[table] || {}; const out = {};
  Object.keys(record || {}).forEach(h => { const col = map[h]; if (col && TABLES[table].cols.includes(col)) out[col] = record[h]; });
  return out;
}
function toLegacy(table, row) {
  const map = HEADERS[table] || {}; const out = {};
  Object.keys(map).forEach(h => { const c = map[h]; if (row && Object.prototype.hasOwnProperty.call(row, c)) out[h] = row[c]; });
  return out;
}
function changeRecord(table, before, after) {
  const def = TABLES[table]; if (!def || !def.pk) return null;
  const a = before || null, b = after || null; const keyValue = (b || a || {})[def.pk];
  if (keyValue === undefined || keyValue === null) return null;
  const columns = [...new Set(Object.keys(a || {}).concat(Object.keys(b || {})))].filter(k => (a || {})[k] !== (b || {})[k]);
  if (!columns.length && a && b) return null;
  return { table: table, keyColumn: def.pk, keyValue: keyValue, before: a, after: b, changedColumns: columns };
}
async function audit(env, action, record, details, meta = {}, changes = []) {
  const dt = phDateTime(), logId = makeId("AL");
  const event = { datetime: dt, action: str(action || "OTHER").slice(0, 100), record: str(record).slice(0, 180), details: str(details).slice(0, 1000), user: str(meta.userName || meta.user || "Unassigned").slice(0, 120), ip_address: str(meta.ipAddress || "").slice(0, 80), device_id: str(meta.deviceId || "").slice(0, 120), log_id: logId };
  try {
    await insertObj(env, "activity_log", event);
    if (changes && changes.length) {
      await insertObj(env, "change_history", { history_id: makeId("CH"), log_id: logId, datetime: dt, target_date: dt.slice(0, 10), action: event.action, user: event.user, changes_json: JSON.stringify(changes), status: "Available", rolled_back_by: "", rolled_back_at: "" });
    }
  } catch (e) { console.error("Supabase audit write failed; business operation was not rolled back.", str(e && e.message || e)); }
  return logId;
}
async function recordOfflineActivity(env,event,meta,session){
 if(!event||!str(event.offlineEventId).startsWith("OFFACT-"))throw new Error("A valid offline activity ID is required.");
 const allowed=new Set(["OFFLINE_PRODUCT_SAVED","OFFLINE_PRODUCT_EDITED","OFFLINE_MODE_ENABLED","OFFLINE_MODE_DISABLED","OFFLINE_SESSION_RESTORED","OFFLINE_SYNC_FAILED","OFFLINE_SYNC_COMPLETED"]),action=str(event.action||"");
 if(!allowed.has(action))throw new Error("This offline activity type is not allowed.");
 const id="OFF-"+str(event.offlineEventId).replace(/[^a-zA-Z0-9_-]/g,"").slice(0,100);
 if(await getBy(env,"activity_log","log_id",id))return {ok:true,duplicate:true};
 const originalDate=str(event.dateTime||""),dt=/^\d{4}-\d{2}-\d{2}/.test(originalDate)?originalDate.slice(0,30):phDateTime();
 await insertObj(env,"activity_log",{log_id:id,datetime:dt,action:action,record:str(event.record||"Offline activity").slice(0,180),details:("Offline event recorded; "+str(event.details||"")).slice(0,1000),user:userLabel(session),ip_address:str(meta.ipAddress||"").slice(0,80),device_id:str(meta.deviceId||"").slice(0,120)});
 return {ok:true};
}
function productDto(r) {
  const pack = Math.max(1, n(r.pack_size) || 1), stock = n(r.stock_units !== null && r.stock_units !== undefined ? r.stock_units : r.stock), price = n(r.selling_price);
  return { id: str(r.product_id), name: str(r.product_name), category: str(r.category), brand: str(r.brand), flavor: str(r.flavor), unit: str(r.unit || "pcs"), cost: optionalNum(r.cost_price), price: price, unitPrice: pack > 1 ? (n(r.unit_price) || price / pack) : price, packSize: pack, stockUnits: stock, stock: stock, min: n(r.min_stock), supplier: str(r.supplier), packType: str(r.pack_type || "None"), packCost: optionalNum(r.pack_cost), createdAt: normalizeDateTime(r.added_at), sku: str(r.sku_barcode), sku2: str(r.sku_barcode_2), expiryDate: normalizeDate(r.expiration_date), ownerName: str(r.owner_name) };
}
function normalizeBarcodeCode(value) { return str(value).replace(/\s+/g, "").toLowerCase(); }

// Match the same whitespace-insensitive barcode format as normalizeBarcodeCode(),
// while letting SQLite use expression indexes instead of returning every product row
// to the Worker each time a barcode is scanned.
const BARCODE_WHITESPACE_CODEPOINTS = [9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,65279];
function barcodeNormalizedSql(column) {
  return "LOWER(" + BARCODE_WHITESPACE_CODEPOINTS.reduce((expression, cp) => "REPLACE(" + expression + ",char(" + cp + "),'')", column) + ")";
}
let barcodeLookupIndexPromise = null;
async function ensureBarcodeLookupIndexes(env) {
  if (!barcodeLookupIndexPromise) {
    barcodeLookupIndexPromise = Promise.all([
      dbRun(env, "CREATE INDEX IF NOT EXISTS idx_products_sku_barcode_norm ON products(" + barcodeNormalizedSql("sku_barcode") + ")"),
      dbRun(env, "CREATE INDEX IF NOT EXISTS idx_products_sku_barcode2_norm ON products(" + barcodeNormalizedSql("sku_barcode_2") + ")")
    ]).catch(error => {
      barcodeLookupIndexPromise = null;
      throw error;
    });
  }
  return barcodeLookupIndexPromise;
}
async function prepareBarcodeLookupIndexes(env) {
  try { await ensureBarcodeLookupIndexes(env); }
  catch (error) {
    // The filtered SQL lookup below remains correct without the indexes. Avoid making
    // initial sign-in or barcode scanning fail if an index cannot be created.
    console.warn("Barcode lookup indexes could not be prepared:", str(error && error.message || error));
  }
}
async function lookupBarcodeProducts(env, barcode, session) {
  const code = normalizeBarcodeCode(barcode);
  if (!code) return {ok:true, products:[]};
  await prepareBarcodeLookupIndexes(env);
  const skuExpression = barcodeNormalizedSql("sku_barcode");
  const secondSkuExpression = barcodeNormalizedSql("sku_barcode_2");
  const rows = await dbAll(env,
    "SELECT * FROM products WHERE " + skuExpression + "=? OR " + secondSkuExpression + "=? ORDER BY rowid",
    code, code
  );
  // Keep the original JavaScript normalization check as a safety net for parity with
  // existing barcode matching, including shared barcodes that belong to multiple owners.
  const matches = rows.map(productDto).filter(p =>
    normalizeBarcodeCode(p.sku) === code || normalizeBarcodeCode(p.sku2) === code
  );
  // Cashiers need owner labels only for resolving a shared barcode; do not expose cost or supplier data.
  const products = session.role === "Cashier" ? matches.map(p => ({
    id:p.id,name:p.name,category:p.category,brand:p.brand,flavor:p.flavor,unit:p.unit,
    price:p.price,unitPrice:p.unitPrice,packSize:p.packSize,stockUnits:p.stockUnits,
    stock:p.stock,min:p.min,packType:p.packType,sku:p.sku,sku2:p.sku2,
    expiryDate:p.expiryDate,ownerName:p.ownerName
  })) : matches;
  return {ok:true, products:products};
}
function saleDto(r) {
  let lines = []; try { lines = r.item_details ? JSON.parse(str(r.item_details)) : []; } catch (_) {}
  return { date: normalizeDate(r.date), time: str(r.time).slice(0, 8), dateTime: normalizeDateTime(r.datetime, r.date, r.time), transactionId: str(r.transaction_id), paymentTransactionId: str(r.payment_transaction_id), items: n(r.items), total: n(r.total), profit: r.profit === "" || r.profit === null || r.profit === undefined ? null : n(r.profit), payment: n(r.payment), change: n(r.change), paymentMethod: str(r.payment_method || "Cash"), lines: lines };
}
function gcashTransactionDto(r) { return { transactionId: str(r.transaction_id), date: normalizeDate(r.date), time: str(r.time).slice(0,8), serviceType: str(r.service_type), customerName: str(r.customer_name), billerName: str(r.biller_name), amount: n(r.amount), fee: n(r.fee), providerFee: n(r.provider_fee), paymentSource: str(r.payment_source||""), feeOption: str(r.fee_option||""), customerPaymentAmount: n(r.customer_payment_amount), payoutAmount: n(r.payout_amount), feePaymentSource: str(r.fee_payment_source||""), bankTransferFee: n(r.bank_transfer_fee), transferDestination: str(r.transfer_destination||""), amountTransferred: n(r.amount_transferred), walletDeduction: n(r.wallet_deduction), cashCollected: n(r.cash_collected), transactionStatus: str(r.transaction_status||""), bankTransferReference: str(r.bank_transfer_reference||""), saleTransactionId: str(r.sale_transaction_id), createdAt: normalizeDateTime(r.created_at, r.date, r.time), createdBy: str(r.created_by), createdById: str(r.created_by_id), hasReceipt: !!str(r.receipt_data||""), receiptFileName: str(r.receipt_file_name||""), receiptContentType: str(r.receipt_content_type||""), receiptSize: n(r.receipt_size), receiptUploadedAt: str(r.receipt_uploaded_at||""), receiptUploadedBy: str(r.receipt_uploaded_by||"") }; }
function gcashCashFlowDetails(type, amount, fee, option, bankTransferFee, transferDestination) {
  type = str(type).toUpperCase(); option = str(option).toUpperCase();
  amount = roundMoney(n(amount)); fee = roundMoney(n(fee));
  bankTransferFee = roundMoney(n(bankTransferFee));
  transferDestination = str(transferDestination || "").trim();
  if (type === "CASH_IN") {
    if (option === "A") return { feeOption:"A", customerPaymentAmount:amount, payoutAmount:roundMoney(amount-fee), feePaymentSource:"INCLUDED", walletDelta:roundMoney(-(amount-fee)), physicalDelta:amount, bankTransferFee:0, transferDestination:"GCash", amountTransferred:roundMoney(amount-fee), walletDeduction:roundMoney(amount-fee), cashCollected:amount };
    if (option === "B") return { feeOption:"B", customerPaymentAmount:roundMoney(amount+fee), payoutAmount:amount, feePaymentSource:"CASH", walletDelta:roundMoney(-amount), physicalDelta:roundMoney(amount+fee), bankTransferFee:0, transferDestination:"GCash", amountTransferred:amount, walletDeduction:amount, cashCollected:roundMoney(amount+fee) };
    if (option === "C" && bankTransferFee >= 0 && transferDestination) return {
      feeOption:"C", customerPaymentAmount:roundMoney(amount+fee+bankTransferFee), payoutAmount:amount,
      feePaymentSource:"CASH", walletDelta:roundMoney(-(amount+bankTransferFee)),
      physicalDelta:roundMoney(amount+fee+bankTransferFee), bankTransferFee:bankTransferFee,
      transferDestination:transferDestination, amountTransferred:amount,
      walletDeduction:roundMoney(amount+bankTransferFee), cashCollected:roundMoney(amount+fee+bankTransferFee)
    };
  }
  if (type === "CASH_OUT") {
    if (option === "A") return { feeOption:"A", customerPaymentAmount:amount, payoutAmount:roundMoney(amount-fee), feePaymentSource:"INCLUDED", walletDelta:amount, physicalDelta:roundMoney(-(amount-fee)), bankTransferFee:0, transferDestination:"", amountTransferred:0, walletDeduction:0, cashCollected:0 };
    if (option === "B") return { feeOption:"B", customerPaymentAmount:roundMoney(amount+fee), payoutAmount:amount, feePaymentSource:"GCASH", walletDelta:roundMoney(amount+fee), physicalDelta:roundMoney(-amount), bankTransferFee:0, transferDestination:"", amountTransferred:0, walletDeduction:0, cashCollected:0 };
    if (option === "C") return { feeOption:"C", customerPaymentAmount:amount, payoutAmount:amount, feePaymentSource:"CASH", walletDelta:amount, physicalDelta:roundMoney(-amount+fee), bankTransferFee:0, transferDestination:"", amountTransferred:0, walletDeduction:0, cashCollected:roundMoney(fee) };
  }
  return null;
}
async function ensureGcashCashFlowColumns(env) {
  const columns = await dbAll(env, "PRAGMA table_info(gcash_transactions)");
  const existing = new Set(columns.map(c => str(c.name)));
  const definitions = {
    fee_option: "TEXT NOT NULL DEFAULT ''",
    customer_payment_amount: "REAL NOT NULL DEFAULT 0",
    payout_amount: "REAL NOT NULL DEFAULT 0",
    fee_payment_source: "TEXT NOT NULL DEFAULT ''",
    bank_transfer_fee: "REAL NOT NULL DEFAULT 0",
    transfer_destination: "TEXT NOT NULL DEFAULT ''",
    amount_transferred: "REAL NOT NULL DEFAULT 0",
    wallet_deduction: "REAL NOT NULL DEFAULT 0",
    cash_collected: "REAL NOT NULL DEFAULT 0",
    transaction_status: "TEXT NOT NULL DEFAULT ''",
    bank_transfer_reference: "TEXT NOT NULL DEFAULT ''"
  };
  for (const [name, type] of Object.entries(definitions)) if (!existing.has(name)) await dbRun(env, "ALTER TABLE gcash_transactions ADD COLUMN " + qi(name) + " " + type);
}

function customerDto(r) { return { id: str(r.customer_id), name: str(r.name), contact: str(r.contact), utang: n(r.utang_balance), last: str(r.last_transaction), lastDateTime: normalizeDateTime(r.last_datetime, r.last_transaction, "00:00:00") }; }
function supplierDto(r) { return { id: str(r.supplier_id), name: str(r.supplier_name), contact: str(r.contact), products: str(r.products), last: str(r.last_purchase), lastDateTime: normalizeDateTime(r.last_datetime, r.last_purchase, "00:00:00") }; }
function trashDto(r) { return { trashId: str(r.trash_id), sourceTab: str(r.source_tab), recordId: str(r.record_id), recordName: str(r.record_name), reason: str(r.reason), deletedAt: normalizeDateTime(r.deleted_at), recordJson: str(r.record_json) }; }
function trashRequestDto(r) {
  let ids = [], names = []; try { ids = JSON.parse(str(r.trash_ids || "[]")); } catch (_) {} try { names = JSON.parse(str(r.trash_names || "[]")); } catch (_) {}
  return { requestId: str(r.request_id), type: str(r.request_type).trim().toUpperCase(), trashIds: Array.isArray(ids) ? ids.map(String) : [], trashNames: Array.isArray(names) ? names.map(String) : [], requestedBy: str(r.requested_by), requesterId: str(r.requester_id), requestedAt: normalizeDateTime(r.requested_at), proposedReason: str(r.proposed_reason), status: str(r.status).trim(), reviewedBy: str(r.reviewed_by), reviewedAt: normalizeDateTime(r.reviewed_at), decisionNote: str(r.decision_note) };
}
function accountChangeDto(r, includeSensitive) {
  const type = str(r.request_type), item = { requestId: str(r.request_id), type: type, userId: str(r.user_id), username: str(r.current_username), requestedAt: normalizeDateTime(r.requested_at), status: str(r.status), reviewedBy: str(r.reviewed_by), reviewedAt: normalizeDateTime(r.reviewed_at), decisionNote: str(r.decision_note), proposedValue: includeSensitive || type === "USERNAME" ? str(r.proposed_value) : "" };
  return item;
}
function activityDto(r, status) {
  return { logId: str(r.log_id), dateTime: normalizeDateTime(r.datetime), action: str(r.action), record: str(r.record), details: str(r.details), user: str(r.user), ipAddress: str(r.ip_address), deviceId: str(r.device_id), historyStatus: str(status || ""), canRevert: str(status || "") === "Available", isReverted: str(status || "") === "Rolled Back", hasSnapshot: !!status };
}
function settingObj(rows) { const out = {}; rows.forEach(r => { if (r.key) out[str(r.key)] = str(r.value); }); return out; }
async function settingsObject(env) { return settingObj(await dbAll(env, "SELECT key,value FROM settings")); }
function parseSalesDeductions(value){try{const list=JSON.parse(str(value||"[]"));return Array.isArray(list)?list.filter(d=>d&&str(d.id)&&str(d.description)&&Number(d.amount)>0).map(d=>({id:str(d.id),description:str(d.description).slice(0,120),amount:Math.round(Number(d.amount)*100)/100})):[];}catch(_){return [];}}
async function publicBranding(env) { const s = await settingsObject(env); return { name: s.name || "Jed's Minimart", tagline: s.tagline || "Your Everyday Essentials, Always Near You", logoText: s.logoText || "Jed's", logoImage: s.logoImage || "" }; }
async function getSession(env, token) {
  const t = str(token);
  if (!/^[A-Fa-f0-9]{64,80}$/.test(t)) return null;
  const tokenHash = await sha256Base64Url(t);
  const sr = await getBy(env, "user_sessions", "token_hash", tokenHash);
  if (!sr) return null;
  const user = await getBy(env, "users", "user_id", sr.user_id);
  if (!user || !bool(user.active) || n(user.auth_version || 1) !== n(sr.auth_version || 1)) {
    await deleteBy(env, "user_sessions", "token_hash", tokenHash);
    return null;
  }
  return { id: str(user.user_id), username: str(user.username), displayName: str(user.display_name || user.username), role: str(user.role || "Staff"), authVersion: n(user.auth_version || 1), issuedAt: str(sr.issued_at), deviceId: str(sr.device_id) };
}
async function createSession(env, user, meta) {
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const u = userDto(user), authVersion = n(user.auth_version || 1), tokenHash = await sha256Base64Url(token), dt = phDateTime();
  await insertObj(env, "user_sessions", { token_hash: tokenHash, user_id: u.id, auth_version: authVersion, issued_at: dt, device_id: str(meta && meta.deviceId).slice(0, 120) });
  await updateObj(env, "users", "user_id", u.id, { last_login: dt, device_id: str(meta && meta.deviceId).slice(0, 120) });
  const label = userLabel(u);
  await audit(env, "LOGIN", label, "Successful sign-in.", Object.assign({}, meta, { userName: label }));
  return { ok: true, token: token, user: u };
}
async function createUserRecord(env, input, role, meta) {
  const username = normUser(input.username), displayName = str(input.displayName).trim(), password = str(input.password);
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw new Error("Username must be 3–40 characters and use only letters, numbers, periods, underscores, or hyphens.");
  if (!displayName || displayName.length > 100) throw new Error("Please enter a display name (up to 100 characters).");
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) throw new Error("Password must be at least 10 characters long.");
  const existing = await dbFirst(env, "SELECT user_id FROM users WHERE lower(username)=? LIMIT 1", username);
  if (existing) throw new Error("That username is already in use. Please choose another.");
  const selectedRole = ["Admin","Owner","Staff","Cashier"].includes(str(role)) ? str(role) : "Staff";
  const id = makeId("U"), dt = phDateTime();
  await insertObj(env, "users", { user_id: id, username: username, display_name: displayName, password_hash: "", password_plain_text: password, password_salt: "", role: selectedRole, active: 1, created_at: dt, last_login: "", device_id: "", auth_version: 1, password_algorithm: "plaintext" });
  await audit(env, "CREATE_USER", username, "Created account " + username + " (" + selectedRole + ").", meta);
  return { id: id, username: username, displayName: displayName, role: selectedRole, active: true, createdAt: dt, lastLogin: "", deviceId: "" };
}
async function removeSessionsForUser(env, userId) { await dbRun(env, "DELETE FROM user_sessions WHERE user_id=?", userId); }
async function accountUsers(env) { return dbAll(env, "SELECT * FROM users"); }
async function publicUsers(env) { return (await accountUsers(env)).map(userDto).sort((a,b) => a.username.localeCompare(b.username)); }
async function checkSessionBaseline(env) {
  const users = await accountUsers(env); if (!users.length) return;
  const marked = new Set((await dbAll(env, "SELECT user_id FROM activity_reads WHERE log_id=?", BASELINE)).map(r => str(r.user_id)));
  const pendingUsers = users.filter(u => !marked.has(str(u.user_id)));
  // This check runs from several normal read endpoints. Do not read the entire activity
  // table unless a user actually needs the one-time baseline for historical notifications.
  if (!pendingUsers.length) return;
  const logs = await dbAll(env, "SELECT * FROM activity_log ORDER BY rowid");
  const admins = users.filter(u => str(u.role) === "Admin");
  for (const u of pendingUsers) {
    const readRows = [];
    for (const log of logs) if (str(u.role) === "Admin" || activityVisible(str(log.action), str(u.role), str(log.user), admins)) readRows.push({ user_id: str(u.user_id), log_id: str(log.log_id), read_at: phDateTime() });
    readRows.push({ user_id: str(u.user_id), log_id: BASELINE, read_at: phDateTime() });
    for (let i=0;i<readRows.length;i+=90) {
      const chunk=readRows.slice(i,i+90);
      await env.DB.batch(chunk.map(r => env.DB.prepare("INSERT INTO activity_reads(user_id,log_id,read_at) VALUES(?,?,?) ON CONFLICT(user_id,log_id) DO NOTHING").bind(r.user_id,r.log_id,r.read_at)));
    }
  }
}
function activityVisible(action, role, userLabelText, adminRows) {
  if (str(role) === "Admin") return true;
  const a = str(action || "OTHER").trim().toUpperCase().replace(/[\s-]+/g, "_"), label = str(userLabelText);
  const isAdminDevActivity = /admin_dev/i.test(label) || /\(@admin_dev\)/i.test(label);
  if (isAdminDevActivity) return false;
  const wasAdmin = (adminRows || []).some(u => (str(u.username) && label.indexOf("(@" + str(u.username) + ")") >= 0) || (str(u.display_name) && label === str(u.display_name))) || /\(@admin_dev\)/i.test(label);
  if (a === "ADMIN_LOGOUT") return false;
  if (a === "LOGIN" || a === "LOGOUT") return !wasAdmin;
  const hidden = ["VIEW_USER_PASSWORD","RESET_USER_PASSWORD","DELETE_USER","CREATE_USER","ACTIVATE_USER","DEACTIVATE_USER","CHANGE_PASSWORD","FULFILL_FORGOT_PASSWORD","DISMISS_FORGOT_PASSWORD","DELETE_ACTIVITY_LOGS","REVERT_ACTIVITY_LOG","ROLLBACK_DATE_CHANGES","SAVE_SETTINGS","SETUP","BOOTSTRAP_ADMIN"];
  if (hidden.includes(a)) return false;
  const patterns = [/USER/,/PASSWORD/,/FORGOT_PASSWORD/,/AUTHENTICATION/,/AUTH_STATUS/,/SESSION/,/ROLE_CHANGE/,/ADMIN_/,/SETTING/,/ADMIN_NOTIFICATION/,/TRASH_DELETE_REQUEST/,/TRASH_REASON_REQUEST/,/TRASH_REQUEST_REVIEW/,/^EDIT_TRASH_REASON$/, /^APPROVE_/,/^DECLINE_/,/^PERMANENT_DELETE_/,/^REVERT_/,/^ROLLBACK_/,/^DELETE_ACTIVITY_/,/^BOOTSTRAP_/,/^SETUP$/];
  return !patterns.some(re => re.test(a));
}
async function activityRowsForRole(env, role) {
  const logs = await dbAll(env, "SELECT * FROM activity_log ORDER BY rowid");
  const hist = await dbAll(env, "SELECT log_id,status FROM change_history");
  const statusMap = {}; hist.forEach(h => { if (h.log_id) statusMap[str(h.log_id)] = str(h.status); });
  if (str(role) === "Admin") return logs.map(r => activityDto(r, statusMap[str(r.log_id)]));
  const admins = (await accountUsers(env)).filter(u => str(u.role) === "Admin");
  return logs.filter(r => activityVisible(r.action, role, r.user, admins)).map(r => activityDto(r, statusMap[str(r.log_id)]));
}
async function notifyRowsForRole(env, role) {
  const logs = await dbAll(env, "SELECT log_id,action,user FROM activity_log ORDER BY rowid");
  if (str(role) === "Admin") return logs;
  const admins = (await accountUsers(env)).filter(u => str(u.role) === "Admin");
  return logs.filter(r => activityVisible(r.action, role, r.user, admins));
}
async function unreadCount(env, userId, role) {
  // Query PostgreSQL for unread entries only instead of loading every activity row and every
  // read marker into the Worker on each notification refresh.
  const unreadRows = await dbAll(env,
    "SELECT l.log_id,l.action,l.user FROM activity_log l WHERE NOT EXISTS (SELECT 1 FROM activity_reads r WHERE r.user_id=? AND r.log_id=l.log_id) ORDER BY l.rowid",
    userId
  );
  if (str(role) === "Admin") return unreadRows.length;
  const admins = (await accountUsers(env)).filter(u => str(u.role) === "Admin");
  return unreadRows.filter(r => activityVisible(r.action, role, r.user, admins)).length;
}
async function unreadLogs(env, userId, role) {
  await checkSessionBaseline(env);
  const visible = await activityRowsForRole(env, role);
  const seen = new Set((await dbAll(env, "SELECT log_id FROM activity_reads WHERE user_id=?", userId)).map(r => str(r.log_id)));
  return visible.filter(r => r.logId && !seen.has(r.logId));
}
async function markActivityRead(env, ids, session) {
  await checkSessionBaseline(env);
  const visible = new Set((await notifyRowsForRole(env, session.role)).map(r => str(r.log_id)));
  const wanted = [...new Set((Array.isArray(ids) ? ids : []).map(str).filter(x => x && x !== BASELINE && visible.has(x)))];
  const existing = new Set((await dbAll(env, "SELECT log_id FROM activity_reads WHERE user_id=?", session.id)).map(r => str(r.log_id)));
  const stmts = wanted.filter(id => !existing.has(id)).map(id => env.DB.prepare("INSERT INTO activity_reads(user_id,log_id,read_at) VALUES(?,?,?) ON CONFLICT(user_id,log_id) DO NOTHING").bind(session.id,id,phDateTime()));
  for (let i=0;i<stmts.length;i+=90) await env.DB.batch(stmts.slice(i,i+90));
  return { ok: true, marked: stmts.length, unreadCount: await unreadCount(env, session.id, session.role) };
}

async function requestMeta(request, data, session) {
  const client = data && data.meta && typeof data.meta === "object" ? data.meta : {};
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
  if (session) {
    const u = await getBySafeUser(request, session);
    return { userName: userLabel(u || session), userId: session.id, username: session.username, role: session.role, deviceId: str(client.deviceId || session.deviceId).slice(0,120), ipAddress: str(ip).split(",")[0].slice(0,80) };
  }
  return { userName: str(client.userName || client.user || "Unassigned"), userId: str(client.userId), username: str(client.username), role: str(client.role), deviceId: str(client.deviceId).slice(0,120), ipAddress: str(ip).split(",")[0].slice(0,80) };
}
async function getBySafeUser(request, session) {
  try {
    const env = request.__env;
    return env ? await getBy(env, "users", "user_id", session.id) : null;
  } catch (_) { return null; }
}
async function authStatus(env, token) {
  const session = await getSession(env, token), users = await accountUsers(env);
  return { ok: true, authenticated: !!session, user: session ? { id:session.id, username:session.username, displayName:session.displayName, role:session.role, canChangeOwnAccountDirectly:canDirectlyChange(session) } : null, branding: await publicBranding(env), needsSetup: users.length === 0, setupKeyConfigured: !!str(env.JED_ADMIN_SETUP_KEY) };
}
function validateAccountInput(input) {
  const username = normUser(input.username), displayName = str(input.displayName).trim(), password = str(input.password);
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw new Error("Username must be 3–40 characters and use only letters, numbers, periods, underscores, or hyphens.");
  if (!displayName || displayName.length > 100) throw new Error("Please enter a display name (up to 100 characters).");
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) throw new Error("Password must be at least 10 characters long.");
  return { username, displayName, password };
}
async function login(env, data, meta) {
  const username = normUser(data.username);
  const ipKey = await sha256Base64Url(str(meta.ipAddress || "unknown"));
  const usernameKey = await sha256Base64Url(username);
  const fail = await dbFirst(env, "SELECT attempts,window_start FROM login_attempts WHERE username_key=? AND ip_key=?", usernameKey, ipKey);
  const windowStart = fail ? Date.parse(str(fail.window_start)) : 0;
  if (fail && n(fail.attempts) >= 8 && Number.isFinite(windowStart) && Date.now()-windowStart < 15*60*1000) throw new Error("Too many sign-in attempts. Please wait 15 minutes and try again.");
  const user = await dbFirst(env, "SELECT * FROM users WHERE lower(username)=? LIMIT 1", username);
  const valid = !!(user && bool(user.active) && await verifyPassword(str(data.password || ""), user));
  if (!valid) {
    const attempts = fail && Number.isFinite(windowStart) && Date.now()-windowStart < 15*60*1000 ? n(fail.attempts)+1 : 1;
    await dbRun(env, "INSERT INTO login_attempts(username_key,ip_key,attempts,window_start) VALUES(?,?,?,?) ON CONFLICT(username_key,ip_key) DO UPDATE SET attempts=excluded.attempts,window_start=excluded.window_start", usernameKey, ipKey, attempts, new Date().toISOString());
    throw new Error("Username or password is incorrect, or this account is inactive.");
  }
  await dbRun(env, "DELETE FROM login_attempts WHERE username_key=? AND ip_key=?", usernameKey, ipKey);
  return createSession(env, user, meta);
}
async function createFirstAdmin(env, data, meta) {
  const expected = str(env.JED_ADMIN_SETUP_KEY);
  if (!expected) throw new Error("Initial admin setup is not enabled. Configure the JED_ADMIN_SETUP_KEY secret in Supabase Edge Function secrets, then reload this page.");
  if (!constantTimeEqual(str(data.setupKey || ""), expected)) throw new Error("The setup key is incorrect. Check the JED_ADMIN_SETUP_KEY Cloudflare secret.");
  if ((await accountUsers(env)).length) throw new Error("An account has already been created. Please sign in instead.");
  const user = await createUserRecord(env, data, "Admin", Object.assign({}, meta, { userName: str(data.displayName || data.username || "Initial administrator") }));
  const row = await getBy(env, "users", "user_id", user.id);
  return createSession(env, row, meta);
}
async function forgotPassword(env, data) {
  const username = normUser(data.username);
  const msg = "Your forgot password request has been sent. You will get a new password shortly.";
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) return { ok: true, message: msg };
  const user = await dbFirst(env, "SELECT * FROM users WHERE lower(username)=? AND active=1 LIMIT 1", username);
  if (user) {
    const pending = await dbFirst(env, "SELECT request_id FROM password_requests WHERE lower(username)=? AND status='Pending' LIMIT 1", username);
    if (!pending) await insertObj(env,"password_requests",{request_id:makeId("PR"),username:username,user_id:str(user.user_id),display_name:str(user.display_name||username),requested_at:phDateTime(),status:"Pending",handled_by:"",handled_at:"",request_details:"Forgot password from sign-in page"});
  }
  return { ok: true, message: msg };
}
function temporaryPassword() { return "Jm!" + crypto.randomUUID().replace(/-/g,"") + crypto.randomUUID().replace(/-/g,"").slice(0,5) + "9"; }
async function fulfillPasswordRequest(env, requestId, meta) {
  const req = await getBy(env,"password_requests","request_id",str(requestId));
  if (!req) throw new Error("Password recovery request not found.");
  if (str(req.status)!=="Pending") throw new Error("This password recovery request has already been handled.");
  const user = await getBy(env,"users","user_id",req.user_id);
  if (!user || !bool(user.active)) throw new Error("The account is no longer active. No password was changed.");
  const password = temporaryPassword(), nextVersion=n(user.auth_version||1)+1;
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_salt=?,password_hash=?,password_plain_text=?,auth_version=?,password_algorithm=? WHERE user_id=?").bind("","",password,nextVersion,"plaintext",user.user_id),
    env.DB.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(user.user_id),
    env.DB.prepare("UPDATE password_requests SET status='Completed',handled_by=?,handled_at=? WHERE request_id=?").bind(str(meta.userName||"Administrator"),phDateTime(),requestId)
  ]);
  await audit(env,"FULFILL_FORGOT_PASSWORD",str(user.username),"Administrator created a replacement password for a forgot-password request. Password value was not written to the Activity Log.",meta);
  return {ok:true,username:str(user.username),displayName:str(user.display_name||user.username),temporaryPassword:password};
}
async function dismissPasswordRequest(env, requestId, meta) {
  const req = await getBy(env,"password_requests","request_id",str(requestId));
  if (!req) throw new Error("Password recovery request not found.");
  if (str(req.status)!=="Pending") throw new Error("This password recovery request has already been handled.");
  await updateObj(env,"password_requests","request_id",requestId,{status:"Dismissed",handled_by:str(meta.userName||"Administrator"),handled_at:phDateTime()});
  await audit(env,"DISMISS_FORGOT_PASSWORD","Password request "+requestId,"Administrator dismissed a password recovery request.",meta);
  return {ok:true};
}
async function updateUsername(env, data, session, meta) {
  const next = normUser(data.username);
  if (!/^[a-z0-9._-]{3,40}$/.test(next)) throw new Error("Username must be 3–40 characters and use only letters, numbers, periods, underscores, or hyphens.");
  const admin = session.role === "Admin", id = admin ? str(data.userId) : session.id;
  if (!admin && data.userId && str(data.userId)!==session.id) throw new Error("Staff can only change their own username.");
  const target = await getBy(env,"users","user_id",id);
  if (!target) throw new Error("User account not found.");
  if (!admin) {
    if (!str(data.currentPassword)) throw new Error("Please enter your current password to change your username.");
    if (!await verifyPassword(str(data.currentPassword),target)) throw new Error("Your current password is incorrect.");
  }
  const duplicate = await dbFirst(env,"SELECT user_id FROM users WHERE lower(username)=? AND user_id<>? LIMIT 1",next,id);
  if (duplicate) throw new Error("That username is already in use. Please choose another.");
  const old = str(target.username);
  if (normUser(old)===next) return {ok:true,unchanged:true,user:userDto(target)};
  await updateObj(env,"users","user_id",id,{username:next});
  await audit(env,"UPDATE_USERNAME",old,"Username changed from "+old+" to "+next+".",meta);
  return {ok:true,user:userDto(await getBy(env,"users","user_id",id))};
}
async function updateUserRole(env, userId, role, actor, meta) {
  const next = str(role).trim();
  if (!["Admin","Owner","Staff","Cashier"].includes(next)) throw new Error("Choose Admin, Owner, Staff, or Cashier for the account role.");
  const target = await getBy(env,"users","user_id",userId);
  if (!target) throw new Error("User account not found.");
  if (str(target.user_id)===str(actor.id)) throw new Error("You cannot change the role of the account currently in use.");
  const old = str(target.role||"Staff");
  if (old===next) return {ok:true,unchanged:true,user:userDto(target)};
  const users = await accountUsers(env);
  if (old==="Admin" && bool(target.active) && next!=="Admin" && users.filter(u=>str(u.role)==="Admin"&&bool(u.active)).length<=1) throw new Error("At least one active administrator account must remain.");
  await updateObj(env,"users","user_id",userId,{role:next});
  await audit(env,"UPDATE_USER_ROLE",str(target.username),"Role changed from "+old+" to "+next+".",meta);
  return {ok:true,user:userDto(await getBy(env,"users","user_id",userId)),role:next};
}
async function setUserActive(env, userId, active, actor, meta) {
  const target = await getBy(env,"users","user_id",userId);
  if (!target) throw new Error("User account not found.");
  const users = await accountUsers(env);
  if (str(target.user_id)===str(actor.id)&&!active) throw new Error("You cannot deactivate the account you are currently using.");
  if (!active&&str(target.role)==="Admin"&&bool(target.active)&&users.filter(u=>str(u.role)==="Admin"&&bool(u.active)).length<=1) throw new Error("At least one active administrator account must remain.");
  await updateObj(env,"users","user_id",userId,{active:active?1:0});
  if (!active) await removeSessionsForUser(env,userId);
  await audit(env,active?"ACTIVATE_USER":"DEACTIVATE_USER",str(target.username),(active?"Activated":"Deactivated")+" account "+str(target.username)+".",meta);
  return {ok:true};
}
async function deleteUser(env, userId, actor, meta) {
  const user = await getBy(env,"users","user_id",userId);
  if (!user) throw new Error("User account not found.");
  if (str(user.user_id)===str(actor.id)) throw new Error("You cannot remove the account you are currently using. Sign in with another administrator account to remove it.");
  const users = await accountUsers(env);
  if (str(user.role)==="Admin"&&bool(user.active)&&users.filter(u=>str(u.role)==="Admin"&&bool(u.active)).length<=1) throw new Error("At least one active administrator account must remain.");
  await audit(env,"DELETE_USER",str(user.username),"Administrator permanently removed account "+str(user.username)+". Existing activity records were retained.",meta);
  await env.DB.batch([env.DB.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(userId),env.DB.prepare("DELETE FROM users WHERE user_id=?").bind(userId)]);
  return {ok:true};
}
async function resetUserPassword(env, userId, password, meta) {
  const pw = str(password);
  if (pw.length<PASSWORD_MIN||pw.length>PASSWORD_MAX) throw new Error("Password must be at least 10 characters long.");
  const user = await getBy(env,"users","user_id",userId);
  if (!user) throw new Error("User account not found.");
  const version=n(user.auth_version||1)+1;
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_salt=?,password_hash=?,password_plain_text=?,auth_version=?,password_algorithm=? WHERE user_id=?").bind("","",pw,version,"plaintext",userId),
    env.DB.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(userId)
  ]);
  await audit(env,"RESET_USER_PASSWORD",str(user.username),"Administrator reset the password for "+str(user.username)+". The password itself was not written to the Activity Log.",meta);
  return {ok:true};
}
async function changeMyPassword(env, session, currentPassword, newPassword, oldToken, meta) {
  const current=str(currentPassword||""), next=str(newPassword||"");
  if(next.length<PASSWORD_MIN||next.length>PASSWORD_MAX) throw new Error("Your new password must be between 10 and 200 characters long.");
  if(!current) throw new Error("Please enter your current password.");
  const user=await getBy(env,"users","user_id",session.id);
  if(!user||!bool(user.active)) throw new Error("Your account is not active. Please contact an administrator.");
  if(!await verifyPassword(current,user)) throw new Error("Your current password is incorrect.");
  if(await verifyPassword(next,user)) throw new Error("Please choose a new password that is different from your current password.");
  const version=n(user.auth_version||1)+1;
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_salt=?,password_hash=?,password_plain_text=?,auth_version=?,password_algorithm=? WHERE user_id=?").bind("","",next,version,"plaintext",session.id),
    env.DB.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(session.id)
  ]);
  const refreshed=await getBy(env,"users","user_id",session.id);
  const created=await createSession(env,refreshed,meta);
  await deleteBy(env,"user_sessions","token_hash",await sha256Base64Url(oldToken));
  await audit(env,"CHANGE_PASSWORD",userLabel(userDto(refreshed)),"User changed their own password. Other active sessions for this account were invalidated.",meta);
  return {ok:true,token:created.token};
}
async function requestAccountChange(env, data, session, meta) {
  if (session.role!=="Staff") throw new Error("Only Staff accounts submit username or password change requests.");
  const user=await getBy(env,"users","user_id",session.id);
  if(!user||!bool(user.active)) throw new Error("Your account is not active. Please contact an administrator.");
  if(!str(data.currentPassword)||!await verifyPassword(str(data.currentPassword),user)) throw new Error("Your current password is incorrect.");
  const type=str(data.requestType||"").toUpperCase();
  if(type!=="USERNAME"&&type!=="PASSWORD") throw new Error("Choose a username or password change request.");
  let proposed=type==="USERNAME"?normUser(data.username):str(data.newPassword||"");
  if(type==="USERNAME"){
    if(!/^[a-z0-9._-]{3,40}$/.test(proposed)) throw new Error("Username must be 3–40 characters and use only letters, numbers, periods, underscores, or hyphens.");
    if(normUser(user.username)===proposed) return {ok:true,unchanged:true,message:"Your username is unchanged."};
    if(await dbFirst(env,"SELECT user_id FROM users WHERE lower(username)=? AND user_id<>? LIMIT 1",proposed,session.id)) throw new Error("That username is already in use. Please choose another.");
  }else{
    if(proposed.length<PASSWORD_MIN||proposed.length>PASSWORD_MAX) throw new Error("Your new password must be between 10 and 200 characters long.");
    if(await verifyPassword(proposed,user)) throw new Error("Please choose a password different from your current password.");
  }
  if(await dbFirst(env,"SELECT request_id FROM account_change_requests WHERE user_id=? AND request_type=? AND status='Pending' LIMIT 1",session.id,type)) throw new Error("You already have a pending "+(type==="USERNAME"?"username":"password")+" change request. Please wait for the Admin decision.");
  const requestId=makeId("ACR");
  await insertObj(env,"account_change_requests",{request_id:requestId,request_type:type,user_id:session.id,current_username:str(user.username),proposed_value:proposed,requested_auth_version:n(user.auth_version||1),requested_at:phDateTime(),status:"Pending",reviewed_by:"",reviewed_at:"",decision_note:""});
  await audit(env,type==="USERNAME"?"REQUEST_STAFF_USERNAME_CHANGE":"REQUEST_STAFF_PASSWORD_CHANGE",str(user.username),type==="USERNAME"?"Staff requested a username change; the current username remains active until Admin approval.":"Staff requested a password change; no password was changed until Admin approval.",meta);
  return {ok:true,requestId:requestId,status:"Pending",requestType:type,message:type==="USERNAME"?"Username change request sent to Admin for approval.":"Password change request sent to Admin for approval."};
}
async function reviewAccountChange(env, requestId, decision, meta) {
  const req=await getBy(env,"account_change_requests","request_id",requestId);
  if(!req) throw new Error("Account change request not found.");
  if(str(req.status)!=="Pending") throw new Error("This account change request has already been handled.");
  const verdict=str(decision).toLowerCase();
  if(!["approve","decline"].includes(verdict)) throw new Error("Choose Approve or Decline.");
  const type=str(req.request_type),userId=str(req.user_id),user=await getBy(env,"users","user_id",userId);
  if(!user||!bool(user.active)) throw new Error("The requesting account is no longer active. The request was not applied.");
  const version=n(user.auth_version||1),requestedVersion=n(req.requested_auth_version||1),proposed=str(req.proposed_value),oldUsername=str(user.username),now=phDateTime(),handler=str(meta.userName||"Administrator");
  if(verdict==="approve"&&version!==requestedVersion) throw new Error("The account credentials changed after this request was submitted. Decline this stale request and ask the user to submit a new one.");
  let note="Request declined by Admin.";
  const stmts=[];
  if(verdict==="approve"&&type==="USERNAME"){
    const next=normUser(proposed);
    if(!/^[a-z0-9._-]{3,40}$/.test(next)) throw new Error("The requested username is invalid.");
    if(await dbFirst(env,"SELECT user_id FROM users WHERE lower(username)=? AND user_id<>? LIMIT 1",next,userId)) throw new Error("The requested username is now in use by another account. No change was made.");
    note="Username change approved: "+oldUsername+" -> "+next+". The user must sign in again with the new username.";
    stmts.push(env.DB.prepare("UPDATE users SET username=?,auth_version=? WHERE user_id=?").bind(next,version+1,userId));
    stmts.push(env.DB.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(userId));
    await audit(env,"APPROVE_STAFF_USERNAME_CHANGE",oldUsername,"Administrator approved staff username change from "+oldUsername+" to "+next+".",meta);
  } else if(verdict==="approve"&&type==="PASSWORD"){
    if(proposed.length<PASSWORD_MIN||proposed.length>PASSWORD_MAX) throw new Error("The requested password is no longer valid. No change was made.");
    note="Password change approved. The user must sign in again with the approved password.";
    stmts.push(env.DB.prepare("UPDATE users SET password_salt=?,password_hash=?,password_plain_text=?,password_algorithm=?,auth_version=? WHERE user_id=?").bind("","",proposed,"plaintext",version+1,userId));
    stmts.push(env.DB.prepare("DELETE FROM user_sessions WHERE user_id=?").bind(userId));
    await audit(env,"APPROVE_STAFF_PASSWORD_CHANGE",oldUsername,"Administrator approved a staff password change request. The password value was not written to the Activity Log.",meta);
  } else if(verdict==="approve") throw new Error("Unknown account change request type.");
  else await audit(env,type==="PASSWORD"?"DECLINE_STAFF_PASSWORD_CHANGE":"DECLINE_STAFF_USERNAME_CHANGE",oldUsername,"Administrator declined a staff "+(type==="PASSWORD"?"password":"username")+" change request.",meta);
  stmts.push(env.DB.prepare("UPDATE account_change_requests SET status=?,reviewed_by=?,reviewed_at=?,decision_note=?,proposed_value=? WHERE request_id=?").bind(verdict==="approve"?"Approved":"Declined",handler,now,note,type==="PASSWORD"?"":proposed,requestId));
  await env.DB.batch(stmts);
  return {ok:true,status:verdict==="approve"?"Approved":"Declined",requestType:type,username:oldUsername,decisionNote:note};
}

async function loadCashierData(env, session) {
  await prepareBarcodeLookupIndexes(env);
  const products=(await dbAll(env,"SELECT * FROM products ORDER BY rowid")).map(productDto).filter(p=>p.id&&p.name).map(p=>({id:p.id,name:p.name,category:p.category,brand:p.brand,flavor:p.flavor,unit:p.unit,price:p.price,unitPrice:p.unitPrice,packSize:p.packSize,stockUnits:p.stockUnits,stock:p.stock,min:p.min,packType:p.packType,sku:p.sku,sku2:p.sku2,expiryDate:p.expiryDate,ownerName:p.ownerName}));
  const customers=(await dbAll(env,"SELECT * FROM customers ORDER BY rowid")).map(r=>({id:str(r.customer_id),name:str(r.name),contact:str(r.contact)})).filter(c=>c.id&&c.name);
  const categories=(await dbAll(env,"SELECT category FROM categories ORDER BY rowid")).map(r=>str(r.category).trim()).filter(Boolean);
  const s=await settingsObject(env);
  return {ok:true,products:products,sales:[],customers:customers,suppliers:[],categories:categories,trash:[],trashRequests:[],passwordRequests:[],accountChangeRequests:[],stockMovements:[],activityLogs:[],unreadActivityCount:0,reconciliations:[],settings:{name:s.name||"Jed's Minimart",tagline:s.tagline||"Your Everyday Essentials, Always Near You",logoText:s.logoText||"Jed's",logoImage:s.logoImage||"",categoriesInitialized:"true"},salesDeductions:parseSalesDeductions(s.salesDeductions),currentUser:{id:session.id,username:session.username,displayName:session.displayName,role:session.role},timeZone:TZ};
}
async function loadAllData(env, session) {
  await ensureGcashCashFlowColumns(env);
  await checkSessionBaseline(env);
  await reconcileTrashRequests(env);
  await prepareBarcodeLookupIndexes(env);
  const products=(await dbAll(env,"SELECT * FROM products ORDER BY rowid")).map(productDto).filter(p=>p.name);
  const sales=(await dbAll(env,"SELECT * FROM sales ORDER BY rowid")).map(saleDto).filter(s=>s.date||s.total||s.items);
  const customers=(await dbAll(env,"SELECT * FROM customers ORDER BY rowid")).map(customerDto).filter(c=>c.name);
  const gcashTransactions=(await dbAll(env,"SELECT * FROM gcash_transactions ORDER BY rowid DESC LIMIT 2000")).map(gcashTransactionDto).filter(g=>g.transactionId);
  const suppliers=(await dbAll(env,"SELECT * FROM suppliers ORDER BY rowid")).map(supplierDto).filter(s=>s.name);
  const categories=(await dbAll(env,"SELECT category FROM categories ORDER BY rowid")).map(r=>str(r.category).trim()).filter(Boolean);
  const trash=(await dbAll(env,"SELECT * FROM trash ORDER BY rowid")).map(trashDto).filter(t=>t.trashId);
  const settings=await settingsObject(env);
  const stockMovements=(await dbAll(env,"SELECT * FROM (SELECT rowid AS _ord,* FROM stock_movement ORDER BY rowid DESC LIMIT 500) ORDER BY _ord ASC")).map(r=>({date:normalizeDate(r.date),dateTime:normalizeDateTime(r.datetime,r.date,""),productId:str(r.product_id),type:str(r.type),quantity:n(r.quantity),reason:str(r.reason)}));
  const activityLogs=await activityRowsForRole(env,session.role);
  const trashRequests=(await dbAll(env,"SELECT * FROM trash_requests ORDER BY rowid")).map(trashRequestDto).filter(r=>r.requestId);
  const passwordRequests=(await dbAll(env,"SELECT * FROM password_requests ORDER BY rowid")).map(r=>({requestId:str(r.request_id),username:str(r.username),userId:str(r.user_id),displayName:str(r.display_name||r.username),requestedAt:normalizeDateTime(r.requested_at),status:str(r.status),handledBy:str(r.handled_by),handledAt:normalizeDateTime(r.handled_at)})).filter(r=>r.requestId);
  const accountRequests=(await dbAll(env,"SELECT * FROM account_change_requests ORDER BY rowid")).map(r=>accountChangeDto(r,session.role==="Admin")).filter(r=>r.requestId);
  const reconciliations=(await dbAll(env,"SELECT * FROM cash_reconciliation ORDER BY date")).map(r=>({date:normalizeDate(r.date),expected:n(r.expected_cash_sales),opening:n(r.opening_float),expenses:n(r.cash_expenses),actual:n(r.actual_counted),notes:str(r.notes),savedAt:normalizeDateTime(r.saved_at)}));
  const currentUser={id:session.id,username:session.username,displayName:session.displayName,role:session.role,canChangeOwnAccountDirectly:canDirectlyChange(session)};
  const forRoleTrash=session.role==="Admin"?trashRequests:trashRequests.filter(r=>r.requesterId===session.id).map(r=>({requestId:r.requestId,type:r.type,trashIds:r.trashIds,requesterId:r.requesterId,status:r.status,requestedAt:r.requestedAt,reviewedAt:r.reviewedAt}));
  const visibleAccountRequests=session.role==="Admin"?accountRequests:accountRequests.filter(r=>r.userId===session.id);
  const allowedSettings=Object.assign({},settings);
  if(session.role!=="Admin") ["sheetEndpoint","scriptWebAppUrl","webAppUrl","appsScriptUrl"].forEach(k=>delete allowedSettings[k]);
  return {ok:true,products:products,sales:sales,customers:customers,gcashTransactions:gcashTransactions,suppliers:suppliers,categories:categories,trash:trash,trashRequests:forRoleTrash,passwordRequests:session.role==="Admin"?passwordRequests:[],accountChangeRequests:visibleAccountRequests,settings:allowedSettings,salesDeductions:parseSalesDeductions(settings.salesDeductions),stockMovements:stockMovements,activityLogs:activityLogs,reconciliations:reconciliations,currentUser:currentUser,unreadActivityCount:await unreadCount(env,session.id,session.role),timeZone:TZ};
}
async function readTrashRequests(env) { return (await dbAll(env,"SELECT * FROM trash_requests ORDER BY rowid")).map(trashRequestDto).filter(r=>r.requestId); }
async function reconcileTrashRequests(env) {
  const reqs=await readTrashRequests(env),trashRows=await dbAll(env,"SELECT trash_id,record_name FROM trash"),active=new Map(trashRows.map(r=>[str(r.trash_id),str(r.record_name)]));
  let deleted=0;
  for(const req of reqs.filter(r=>r.type==="DELETE"&&str(r.status).toLowerCase()==="approved")) {
    for(const id of req.trashIds) if(active.has(str(id))) { await deleteBy(env,"trash","trash_id",str(id)); active.delete(str(id)); deleted++; }
  }
  if(deleted) await audit(env,"RECONCILE_APPROVED_TRASH_DELETIONS","Trash","Completed "+deleted+" Trash removal(s) for requests already approved by Admin.",{userName:"System",role:"System"});
  const now=phDateTime();
  for(const req of (await readTrashRequests(env)).filter(r=>str(r.status).toLowerCase()==="pending")) {
    const pairs=req.trashIds.map((id,i)=>({id:str(id),name:str(req.trashNames[i]||id)})),present=pairs.filter(p=>active.has(p.id));
    if(present.length===pairs.length) continue;
    if(req.type==="DELETE"&&present.length) {
      await updateObj(env,"trash_requests","request_id",req.requestId,{trash_ids:JSON.stringify(present.map(p=>p.id)),trash_names:JSON.stringify(present.map(p=>active.get(p.id)||p.name)),decision_note:"Automatically reconciled: records already removed from Trash were removed from this pending request. Remaining records are still pending."});
    } else {
      await updateObj(env,"trash_requests","request_id",req.requestId,{status:"Resolved",reviewed_by:"System",reviewed_at:now,decision_note:"Automatically resolved because the referenced Trash record(s) no longer exist in Trash."});
      await audit(env,"RESOLVE_STALE_TRASH_REQUEST",req.requestId,"Automatically resolved a stale "+req.type+" Trash request because its target record(s) no longer existed in Trash.",{userName:"System",role:"System"});
    }
  }
}
function tableForSource(sourceTab) {
  const m={"Products":"products","Sales":"sales","Customers":"customers","Suppliers":"suppliers","Categories":"categories"};
  return m[str(sourceTab)] || "";
}
function displayNameForRecord(sourceTab, record) {
  if(sourceTab==="Products") return str(record["Product Name"]||"Product");
  if(sourceTab==="Sales") return "Sale "+str(record["Transaction ID"]||"");
  if(sourceTab==="Customers") return str(record.Name||"Customer");
  if(sourceTab==="Suppliers") return str(record["Supplier Name"]||"Supplier");
  if(sourceTab==="Categories") return str(record.Category||"Category");
  return str(sourceTab||"Record");
}
function parseItemLines(row) {
  try { const l=JSON.parse(str(row && row.item_details || "[]")); return Array.isArray(l)?l:[]; } catch (_) { return []; }
}
async function stockMove(env, productId, type, quantity, reason, dt) {
  const item={date:dt.slice(0,10),product_id:str(productId),type:str(type),quantity:n(quantity),reason:str(reason),datetime:dt};
  await insertObj(env,"stock_movement",item);
  return await dbFirst(env,"SELECT * FROM stock_movement ORDER BY movement_id DESC LIMIT 1");
}
async function moveToTrash(env, data, meta) {
  const sourceTab=str(data.sourceTab||""), table=tableForSource(sourceTab);
  if(!table) throw new Error("This type of record cannot be moved to Trash.");
  const reason=str(data.reason||"").trim(); if(!reason) throw new Error("A deletion reason is required.");
  const id=str(data.id||""); const key=TABLES[table].pk;
  const old=table==="categories" ? await dbFirst(env,"SELECT * FROM categories WHERE lower(category)=lower(?) LIMIT 1",id) : await getBy(env,table,key,id);
  if(!old) throw new Error("The selected record could not be found. Refresh the page and try again.");
  const record=toLegacy(table,old),trashId=makeId("TR"),dt=phDateTime(),display=displayNameForRecord(sourceTab,record);
  const changes=[changeRecord(table,old,null)].filter(Boolean),stmts=[];
  const trashRow={trash_id:trashId,source_tab:sourceTab,record_id:id,record_name:display,reason:reason,deleted_at:dt,record_json:JSON.stringify(record)};
  changes.push(changeRecord("trash",null,trashRow));
  stmts.push(insertStmt(env,"trash",trashRow));
  if(table==="sales") {
    const walletContribution=await dbFirst(env,"SELECT COUNT(*) AS movement_count,COALESCE(SUM(amount_delta),0) AS total_delta FROM gcash_balance_movements WHERE reference_id=? AND movement_type IN ('POS_SALE','POS_SALE_CORRECTION')",id);
    if(n(walletContribution&&walletContribution.movement_count)>0){const reverseDelta=roundMoney(-n(walletContribution.total_delta)),wallet=await ensureGcashWalletBalance(env);if(reverseDelta<0&&n(wallet.balance)+reverseDelta < -0.005)throw new Error("The GCash sale reversal would make the recorded wallet balance negative. Reconcile the balance before deleting this sale.");stmts.push(insertStmt(env,"gcash_balance_movements",gcashWalletMovementRow("TRASH:"+trashId,phDate(),"SALE_REVERSAL",id,"Reverse tracked GCash wallet effect after moving a sale to Trash",reverseDelta,meta,null,dt)));if(Math.abs(reverseDelta)>0.0001)stmts.push(gcashWalletUpdateStatement(env,reverseDelta,meta,null,dt));}
    // A trashed sale must reverse its physical-cash effect as well as its GCash wallet effect.
    // Post the reversal on the current business date so today's physical balance reflects the undo,
    // while retaining the original movement for audit history.
    const physicalContribution=await dbFirst(env,"SELECT COUNT(*) AS movement_count,COALESCE(SUM(amount_delta),0) AS total_delta FROM cash_management_report_cash_movements WHERE reference_id=? AND movement_type='POS_SALE_CASH'",id);
    const alreadyReversed=await dbFirst(env,"SELECT COUNT(*) AS movement_count FROM cash_management_report_cash_movements WHERE movement_id=? AND movement_type='SALE_REVERSAL_CASH'","TRASH:"+trashId);
    if(n(physicalContribution&&physicalContribution.movement_count)>0&&n(alreadyReversed&&alreadyReversed.movement_count)===0) {
      const reversePhysicalDelta=roundMoney(-n(physicalContribution.total_delta));
      if(Math.abs(reversePhysicalDelta)>0.0001) stmts.push(insertStmt(env,"cash_management_report_cash_movements",cashManagementReportCashMovementRow("TRASH:"+trashId,phDate(),"SALE_REVERSAL_CASH",id,"Reverse physical cash effect after moving sale to Trash",reversePhysicalDelta,meta,null,dt)));
    }
    const lines=parseItemLines(old), grouped=new Map();
    for(const line of lines) {
      const pid=str(line.id||""); if(!pid) continue;
      if(line.gcashService||line.salesDeduction) continue;
      const qty=n(line.baseQty!==undefined?line.baseQty:line.qty); grouped.set(pid,(grouped.get(pid)||0)+qty);
    }
    for(const [pid,qty] of grouped) {
      const p=await getBy(env,"products","product_id",pid); if(!p) continue;
      const before=p, next=n(p.stock_units!==null&&p.stock_units!==undefined?p.stock_units:p.stock)+qty;
      const after=Object.assign({},p,{stock_units:next,stock:next});
      stmts.push(env.DB.prepare("UPDATE products SET stock_units=?,stock=? WHERE product_id=?").bind(next,next,pid));
      const movement={date:dt.slice(0,10),product_id:pid,type:"SALE_REVERSAL",quantity:qty,reason:"Moved to Trash: "+str(old.transaction_id)+" — "+reason,datetime:dt};
      stmts.push(insertStmt(env,"stock_movement",movement));
      changes.push(changeRecord("products",before,after));
    }
  }
  stmts.push(env.DB.prepare("DELETE FROM "+qi(table)+" WHERE "+qi(key)+"=?").bind(id));
  await env.DB.batch(stmts);
  const movementRows=table==="sales"?await dbAll(env,"SELECT * FROM stock_movement WHERE datetime=? AND type='SALE_REVERSAL' AND reason LIKE ?",dt,"%Moved to Trash: "+str(old.transaction_id)+"%"):[];
  movementRows.forEach(r=>{const ch=changeRecord("stock_movement",null,r);if(ch)changes.push(ch);});
  await audit(env,"MOVE_TO_TRASH",sourceTab+" "+id,"Moved "+display+" to Trash. Reason: "+reason,meta,changes);
  return {ok:true,trashId:trashId};
}
async function permanentlyDeleteTrashAsAdmin(env, ids, meta) {
  await reconcileTrashRequests(env);
  const selected=[...new Set((Array.isArray(ids)?ids:[]).map(str).filter(Boolean))];
  if(!selected.length) throw new Error("Select at least one Trash item.");
  const rows=await dbAll(env,"SELECT * FROM trash");
  const byId=new Map(rows.map(r=>[str(r.trash_id),r]));
  selected.forEach(id=>{if(!byId.has(id))throw new Error("A selected Trash item was not found. Refresh and try again.");});
  const selectedRows=selected.map(id=>byId.get(id));
  const names=selectedRows.map(r=>str(r.record_name||r.trash_id));
  const reviewedAt=phDateTime(),adminName=str(meta.userName||"Administrator");
  const requestId=makeId("TRQ");
  const requestRow={
    request_id:requestId,request_type:"DELETE",trash_ids:JSON.stringify(selected),trash_names:JSON.stringify(names),
    requested_by:adminName,requester_id:str(meta.userId||""),requested_at:reviewedAt,proposed_reason:"",
    status:"Approved",reviewed_by:adminName,reviewed_at:reviewedAt,
    decision_note:"Automatically approved because permanent deletion was initiated by an Admin."
  };
  const changes=selectedRows.map(row=>changeRecord("trash",row,null)).filter(Boolean);
  const stmts=[insertStmt(env,"trash_requests",requestRow)];
  selected.forEach(id=>stmts.push(env.DB.prepare("DELETE FROM trash WHERE trash_id=?").bind(id)));
  await env.DB.batch(stmts);
  // Remove deleted IDs from older staff requests, or resolve those requests if all targets were deleted.
  await reconcileTrashRequests(env);
  await audit(env,"ADMIN_PERMANENT_TRASH_DELETE",selected.join(", "),"Admin permanently deleted "+selected.length+" Trash item(s); the deletion was automatically approved without a separate approval step.",meta,changes);
  return {ok:true,requested:false,approved:true,status:"Approved",requestId:requestId,count:selected.length,deleted:selected.length};
}
async function requestTrashDeletion(env, ids, meta) {
  await reconcileTrashRequests(env);
  const selected=[...new Set((Array.isArray(ids)?ids:[]).map(str).filter(Boolean))];
  if(!selected.length) throw new Error("Select at least one Trash item.");
  const allTrash=(await dbAll(env,"SELECT * FROM trash")).map(trashDto);
  selected.forEach(id=>{if(!allTrash.some(t=>t.trashId===id))throw new Error("A selected Trash item was not found. Refresh and try again.");});
  const reqs=await readTrashRequests(env),pendingIds=new Set();
  reqs.filter(r=>str(r.status).toLowerCase()==="pending").forEach(r=>r.trashIds.forEach(id=>{if(allTrash.some(t=>t.trashId===str(id)))pendingIds.add(str(id));}));
  if(selected.some(id=>pendingIds.has(id))) throw new Error("A request is already pending for one or more selected items. Refresh the Trash tab before submitting another request.");
  const names=selected.map(id=>{const t=allTrash.find(x=>x.trashId===id);return str(t.recordName||id);});
  const requestId=makeId("TRQ"),row={request_id:requestId,request_type:"DELETE",trash_ids:JSON.stringify(selected),trash_names:JSON.stringify(names),requested_by:str(meta.userName||"User"),requester_id:str(meta.userId||""),requested_at:phDateTime(),proposed_reason:"",status:"Pending",reviewed_by:"",reviewed_at:"",decision_note:""};
  await insertObj(env,"trash_requests",row);
  await audit(env,"REQUEST_TRASH_DELETE",selected.join(", "),"Requested permanent deletion of "+selected.length+" Trash item(s). No items were deleted.",meta);
  return {ok:true,requested:true,requestId:requestId,count:selected.length,status:"Pending"};
}
async function requestTrashReason(env, trashId, reason, meta) {
  const id=str(trashId||""),value=str(reason||"").trim();
  if(!id) throw new Error("A Trash item is required."); if(!value) throw new Error("A reason category is required.");
  const t=await getBy(env,"trash","trash_id",id); if(!t) throw new Error("Trash item not found. Refresh and try again.");
  const pending=(await readTrashRequests(env)).some(r=>r.status==="Pending"&&r.trashIds.includes(id));
  if(pending) throw new Error("A request is already pending for this item. Please wait for the Admin decision before submitting another request.");
  const requestId=makeId("TRQ");
  await insertObj(env,"trash_requests",{request_id:requestId,request_type:"EDIT_REASON",trash_ids:JSON.stringify([id]),trash_names:JSON.stringify([str(t.record_name||id)]),requested_by:str(meta.userName||"User"),requester_id:str(meta.userId||""),requested_at:phDateTime(),proposed_reason:value,status:"Pending",reviewed_by:"",reviewed_at:"",decision_note:""});
  await audit(env,"REQUEST_TRASH_REASON_EDIT",id,"Requested a change to a Trash reason. The current reason was not changed yet.",meta);
  return {ok:true,requested:true,requestId:requestId};
}
async function reviewTrashRequest(env, requestId, decision, meta) {
  const req=(await readTrashRequests(env)).find(r=>r.requestId===str(requestId));
  if(!req) throw new Error("Trash request not found."); if(req.status!=="Pending") throw new Error("This request has already been reviewed.");
  const verdict=str(decision).toLowerCase(); if(!["approve","decline"].includes(verdict)) throw new Error("Choose approve or decline.");
  const changes=[],stmts=[]; let affected=0;
  if(verdict==="approve"&&req.type==="DELETE") {
    for(const id of req.trashIds) {
      const t=await getBy(env,"trash","trash_id",id);
      if(t){changes.push(changeRecord("trash",t,null));stmts.push(env.DB.prepare("DELETE FROM trash WHERE trash_id=?").bind(id));affected++;}
    }
    if(!affected) throw new Error("None of the requested Trash items remain. The request was not changed.");
  } else if(verdict==="approve"&&req.type==="EDIT_REASON") {
    const id=req.trashIds[0],t=await getBy(env,"trash","trash_id",id); if(!t) throw new Error("The Trash item no longer exists. The request was not approved.");
    changes.push(changeRecord("trash",t,Object.assign({},t,{reason:req.proposedReason})));
    stmts.push(env.DB.prepare("UPDATE trash SET reason=? WHERE trash_id=?").bind(req.proposedReason,id)); affected=1;
  }
  stmts.push(env.DB.prepare("UPDATE trash_requests SET status=?,reviewed_by=?,reviewed_at=? WHERE request_id=?").bind(verdict==="approve"?"Approved":"Declined",str(meta.userName||"Administrator"),phDateTime(),requestId));
  await env.DB.batch(stmts);
  if(verdict==="approve"&&req.type==="DELETE") await reconcileTrashRequests(env);
  await audit(env,verdict==="approve"?(req.type==="DELETE"?"APPROVE_TRASH_DELETE_REQUEST":"APPROVE_TRASH_REASON_REQUEST"):"DECLINE_TRASH_REQUEST",req.requestId,(verdict==="approve"?"Approved":"Declined")+" "+req.type+" Trash request. Affected records: "+affected+".",meta,changes);
  return {ok:true,status:verdict==="approve"?"Approved":"Declined",affected:affected,type:req.type};
}
async function clearCompletedTrashRequestLogs(env, meta) {
  const trashIds=new Set((await dbAll(env,"SELECT trash_id FROM trash")).map(r=>str(r.trash_id)));
  const reqs=await readTrashRequests(env),ids=[];
  for(const r of reqs) if(r.type==="DELETE"&&r.status==="Approved"&&r.trashIds.length&&r.trashIds.every(id=>!trashIds.has(str(id)))) ids.push(r.requestId);
  for(const id of ids) await deleteBy(env,"trash_requests","request_id",id);
  await audit(env,"CLEAR_COMPLETED_TRASH_DELETE_REQUESTS","Trash Requests","Administrator cleared "+ids.length+" completed permanent-deletion request log(s). Pending requests and request logs for items still in Trash were retained.",meta);
  return {ok:true,cleared:ids.length};
}
async function restoreTrash(env, trashId, meta) {
  const tr=await getBy(env,"trash","trash_id",trashId); if(!tr) throw new Error("Trash item not found.");
  const source=str(tr.source_tab),table=tableForSource(source);
  if(!table) throw new Error("This item cannot be restored.");
  let record={}; try{record=JSON.parse(str(tr.record_json||"{}"));}catch(_){throw new Error("The saved record details could not be read.");}
  const rec=fromLegacy(table,record),key=TABLES[table].pk,keyValue=rec[key]===undefined?str(tr.record_id):rec[key];
  const changes=[changeRecord("trash",tr,null)].filter(Boolean);
  if(table==="categories") {
    const exists=await dbFirst(env,"SELECT category FROM categories WHERE lower(category)=lower(?) LIMIT 1",str(rec.category||tr.record_name));
    if(!exists) {
      const cat={category:str(rec.category||tr.record_name).trim()};
      await insertObj(env,"categories",cat); changes.push(changeRecord("categories",null,cat));
    }
    await deleteBy(env,"trash","trash_id",trashId);
  } else {
    if(await getBy(env,table,key,keyValue)) throw new Error("A record with this ID already exists. Refresh the data before restoring.");
    const stmts=[insertStmt(env,table,rec)];
    if(table==="sales") {
      const walletContribution=await dbFirst(env,"SELECT COUNT(*) AS movement_count,COALESCE(SUM(amount_delta),0) AS total_delta FROM gcash_balance_movements WHERE reference_id=? AND movement_type IN ('POS_SALE','POS_SALE_CORRECTION')",str(keyValue));
      if(n(walletContribution&&walletContribution.movement_count)>0){const restoreDelta=roundMoney(n(walletContribution.total_delta)),wallet=await ensureGcashWalletBalance(env);if(restoreDelta<0&&n(wallet.balance)+restoreDelta < -0.005)throw new Error("Restoring this sale would make the recorded GCash wallet balance negative. Reconcile the balance before continuing.");stmts.push(insertStmt(env,"gcash_balance_movements",gcashWalletMovementRow("RESTORE:"+trashId,phDate(),"SALE_RESTORE",str(keyValue),"Re-apply tracked GCash wallet effect after restoring a sale",restoreDelta,meta,null,phDateTime())));if(Math.abs(restoreDelta)>0.0001)stmts.push(gcashWalletUpdateStatement(env,restoreDelta,meta,null,phDateTime()));}
      const restoredTx=str(rec.transaction_id||"");
      const originalPhysical=await dbFirst(env,"SELECT COUNT(*) AS movement_count,COALESCE(SUM(amount_delta),0) AS total_delta FROM cash_management_report_cash_movements WHERE reference_id=? AND movement_type='POS_SALE_CASH'",restoredTx);
      const originalPhysicalDelta=n(originalPhysical&&originalPhysical.total_delta);
      const priorPhysicalRestore=await dbFirst(env,"SELECT COUNT(*) AS movement_count FROM cash_management_report_cash_movements WHERE movement_id=? AND movement_type='SALE_RESTORE_CASH'","RESTORE:"+trashId);
      if(n(originalPhysical&&originalPhysical.movement_count)>0&&n(priorPhysicalRestore&&priorPhysicalRestore.movement_count)===0&&Math.abs(originalPhysicalDelta)>0.0001) {
        stmts.push(insertStmt(env,"cash_management_report_cash_movements",cashManagementReportCashMovementRow("RESTORE:"+trashId,phDate(),"SALE_RESTORE_CASH",restoredTx,"Re-apply physical cash effect after restoring a sale",originalPhysicalDelta,meta,null,phDateTimePrecise())));
      }
      for(const line of parseItemLines({item_details:rec.item_details})) {
        if(line.gcashService||line.salesDeduction) continue;
        const pid=str(line.id||""),qty=n(line.baseQty!==undefined?line.baseQty:line.qty),p=await getBy(env,"products","product_id",pid);
        if(!p) throw new Error("Cannot restore this sale because a sold product is no longer in inventory: "+str(line.name||pid));
        const old=n(p.stock_units!==null&&p.stock_units!==undefined?p.stock_units:p.stock);
        if(old<qty) throw new Error("Cannot restore this sale because stock is insufficient for "+str(line.name||pid)+". Available: "+old+".");
        const next=old-qty,after=Object.assign({},p,{stock_units:next,stock:next});
        stmts.push(env.DB.prepare("UPDATE products SET stock_units=?,stock=? WHERE product_id=? AND COALESCE(stock_units,stock,0)>=?").bind(next,next,pid,qty));
        const movement={date:phDate(),product_id:pid,type:"SALE_RESTORE",quantity:qty,reason:"Restored sale "+str(rec.transaction_id||""),datetime:phDateTime()};
        stmts.push(insertStmt(env,"stock_movement",movement));
        changes.push(changeRecord("products",p,after));
      }
    }
    stmts.push(env.DB.prepare("DELETE FROM trash WHERE trash_id=?").bind(trashId));
    await env.DB.batch(stmts);
    const inserted=await getBy(env,table,key,keyValue); changes.push(changeRecord(table,null,inserted));
  }
  const afterTrash=await getBy(env,"trash","trash_id",trashId); if(afterTrash) await deleteBy(env,"trash","trash_id",trashId);
  await audit(env,"RESTORE_FROM_TRASH",source+" "+str(tr.record_id||trashId),"Restored "+str(tr.record_name||source)+" from Trash.",meta,changes);
  return {ok:true,sourceTab:source};
}
async function deleteActivityLogs(env, ids, meta) {
  const selected=[...new Set((Array.isArray(ids)?ids:[]).map(str).filter(Boolean))];
  if(!selected.length) throw new Error("Select at least one Activity Log record.");
  const rows=[];
  for(const id of selected){const r=await getBy(env,"activity_log","log_id",id);if(r)rows.push(r);}
  if(!rows.length) throw new Error("The selected Activity Log entries were not found. Refresh the page and try again.");
  for(const r of rows) await deleteBy(env,"activity_log","log_id",r.log_id);
  await audit(env,"DELETE_ACTIVITY_LOGS","Activity_Log","Administrator permanently deleted "+rows.length+" selected Activity Log record(s). The deleted Log IDs were not included in the audit details.",meta);
  return {ok:true,deleted:rows.length};
}

async function uniqueBarcode(env, barcode, exceptId) {
  if (!str(barcode).trim()) return;
  const q = await dbFirst(env,"SELECT product_id,product_name FROM products WHERE lower(trim(COALESCE(sku_barcode,'')))=lower(trim(?)) AND product_id<>? LIMIT 1",str(barcode),str(exceptId||""));
  if(q) throw new Error("This barcode is already assigned to \""+str(q.product_name||"another product")+"\". Please use a unique barcode.");
}
async function saveProduct(env, p, meta) {
  if(!p||!str(p.name).trim()) throw new Error("Product name is required.");
  const id=str(p.id||makeId("P")), old=await getBy(env,"products","product_id",id), pack=Math.max(1,n(p.packSize)||1),stock=Math.max(0,n(p.stockUnits!==undefined?p.stockUnits:p.stock));
  const cost=optionalNum(p.cost), packCost=p.packCost!==undefined&&p.packCost!==null&&p.packCost!==""?n(p.packCost):(cost===""?"":n(cost)*pack);
  const row={
    product_id:id,product_name:str(p.name).trim(),category:str(p.category),brand:str(p.brand),unit:str(p.unit||"units"),
    cost_price:cost===""?null:n(cost),selling_price:n(p.price),stock:stock,min_stock:n(p.min),supplier:str(p.supplier),
    pack_size:pack,unit_price:n(p.unitPrice)||n(p.price)/pack,stock_units:stock,pack_type:str(p.packType||"None"),
    pack_cost:packCost===""?null:n(packCost),flavor:str(p.flavor),added_at:str(p.createdAt||(old&&old.added_at)||phDateTime()),
    sku_barcode:str(p.sku!==undefined?p.sku:(old&&old.sku_barcode)||""),expiration_date:str(p.expiryDate||""),
    sku_barcode_2:str(p.sku2!==undefined?p.sku2:(old&&old.sku_barcode_2)||""),owner_name:str(p.ownerName!==undefined?p.ownerName:(old&&old.owner_name)||"")
  };
  // Shared barcodes are supported so checkout can ask which owner's product was scanned.
  if(old) await updateObj(env,"products","product_id",id,row); else await insertObj(env,"products",row);
  const saved=await getBy(env,"products","product_id",id);
  const ch=changeRecord("products",old,saved);
  await audit(env,old?"EDIT_PRODUCT":"ADD_PRODUCT",id,"Product "+row.product_name+" saved; SKU "+(row.sku_barcode||"—")+"; stock "+stock+".",meta,ch?[ch]:[]);
  return {ok:true,product:Object.assign({},p,{id:id,cost:cost,price:row.selling_price,stockUnits:stock,stock:stock,packSize:pack,unitPrice:row.unit_price,packType:row.pack_type,packCost:packCost,createdAt:row.added_at,sku:row.sku_barcode,sku2:row.sku_barcode_2,expiryDate:row.expiration_date,ownerName:row.owner_name})};
}
async function updateProductBarcode(env, id, sku, meta) {
  if(id===undefined||id===null||str(id)==="") throw new Error("A product ID is required to update its barcode.");
  const barcode=str(sku===undefined||sku===null?"":sku).trim();
  if(barcode.length>128) throw new Error("Barcode / SKU must be 128 characters or fewer.");
  const old=await getBy(env,"products","product_id",id);
  if(!old) throw new Error("Product not found. Refresh the Product tab and try again.");
  // Do not reject shared barcodes; the checkout picker resolves multiple matches.
  const before=str(old.sku_barcode).trim(),name=str(old.product_name||id);
  if(before===barcode) return {ok:true,id:str(id),name:name,sku:barcode,unchanged:true};
  await updateObj(env,"products","product_id",id,{sku_barcode:barcode});
  const saved=await getBy(env,"products","product_id",id);
  const action=barcode?(before?"EDIT_PRODUCT_BARCODE":"ADD_PRODUCT_BARCODE"):"REMOVE_PRODUCT_BARCODE";
  const details=barcode?(before?"Barcode changed from "+before+" to "+barcode:"Barcode added: "+barcode):"Barcode removed: "+before;
  const ch=changeRecord("products",old,saved);
  await audit(env,action,name,details,meta,ch?[ch]:[]);
  return {ok:true,id:str(id),name:name,sku:barcode};
}
async function adjustStock(env,id,quantity,reason,meta) {
  if(!Number.isFinite(Number(quantity))||Number(quantity)<0) throw new Error("Stock quantity must be zero or greater.");
  const old=await getBy(env,"products","product_id",id); if(!old) return {ok:false,error:"Product not found"};
  const q=Math.max(0,n(quantity)),dt=phDateTime(),after=Object.assign({},old,{stock_units:q,stock:q});
  const movement={date:dt.slice(0,10),product_id:str(id),type:"ADJUSTMENT",quantity:q,reason:str(reason||"Manual stock adjustment"),datetime:dt};
  await env.DB.batch([
    env.DB.prepare("UPDATE products SET stock_units=?,stock=? WHERE product_id=?").bind(q,q,id),
    insertStmt(env,"stock_movement",movement)
  ]);
  const saved=await getBy(env,"products","product_id",id),movementSaved=await dbFirst(env,"SELECT * FROM stock_movement ORDER BY movement_id DESC LIMIT 1");
  const changes=[changeRecord("products",old,saved),changeRecord("stock_movement",null,movementSaved)].filter(Boolean);
  await audit(env,"STOCK_ADJUSTMENT",str(id),"Stock set to "+q+" base units. Reason: "+str(reason||"Manual stock adjustment"),meta,changes);
  return {ok:true};
}
function roundMoney(value) { return Math.round(n(value) * 100) / 100; }
// Authoritative combined-cash formula: never add profit or subtract expenses here.
function cashManagementReportTotalFromBalances(gcashWalletBalance, physicalCashOnHand) {
  return roundMoney(n(gcashWalletBalance) + n(physicalCashOnHand));
}
function isGcashPaymentMethod(method) { return /gcash/i.test(str(method||"")); }
async function ensureGcashWalletBalance(env) {
  let row=await dbFirst(env,"SELECT * FROM gcash_wallet_balance WHERE wallet_id='default' LIMIT 1");
  if(row) return row;
  await dbRun(env,"INSERT OR IGNORE INTO gcash_wallet_balance(wallet_id,balance,updated_at,updated_by,updated_by_id,baseline_date) VALUES('default',0,?,?,?,?)",phDateTime(),"Initial GCash wallet balance","","");
  row=await dbFirst(env,"SELECT * FROM gcash_wallet_balance WHERE wallet_id='default' LIMIT 1");
  if(!row) throw new Error("The GCash wallet balance could not be initialized. Please refresh the page and try again.");
  return row;
}
function gcashWalletDeltaForSale(saleRow,gcashRows) {
  // Cash In/Out fee-option movements are independent of the normal checkout tender;
  // remove those fee lines from the tender total, then apply the complete service flow once.
  let tenderTotal=n(saleRow&&saleRow.total);
  for(const g of (gcashRows||[])) if(gcashCashFlowDetails(g.service_type,g.amount,g.fee,g.fee_option,g.bank_transfer_fee,g.transfer_destination)) tenderTotal-=n(g.fee);
  let delta=isGcashPaymentMethod(saleRow&&saleRow.payment_method)?tenderTotal:0;
  for(const g of (gcashRows||[])) {
    const amount=n(g.amount),type=str(g.service_type).toUpperCase(),source=str(g.payment_source||g.paymentSource||"").toUpperCase();
    const flow=gcashCashFlowDetails(type,amount,g.fee,g.fee_option,g.bank_transfer_fee,g.transfer_destination);
    if(flow){delta+=flow.walletDelta;continue;}
    if(type==="CASH_IN") delta-=amount;
    else if(type==="CASH_OUT") delta+=amount;
    else if((type==="LOAD"||type==="BILLS_PAYMENT")&&source!=="GCASH") delta-=amount;
    if(type==="LOAD"||type==="BILLS_PAYMENT") delta-=n(g.provider_fee!==undefined?g.provider_fee:g.providerFee);
  }
  return roundMoney(delta);
}
function cashManagementReportPhysicalCashDeltaForSale(saleRow, gcashRows) {
  // Cash In/Out options control both the principal and the fee collection, irrespective
  // of the normal checkout tender. The fee is removed from the tender total to prevent double counting.
  let tenderTotal=n(saleRow&&saleRow.total);
  for(const g of (gcashRows||[])) if(gcashCashFlowDetails(g.service_type,g.amount,g.fee,g.fee_option,g.bank_transfer_fee,g.transfer_destination)) tenderTotal-=n(g.fee);
  let delta = isGcashPaymentMethod(saleRow && saleRow.payment_method) ? 0 : tenderTotal;
  for (const g of (gcashRows || [])) {
    const amount = n(g.amount), type = str(g.service_type).toUpperCase();
    const source = str(g.payment_source || g.paymentSource || "").toUpperCase();
    const flow=gcashCashFlowDetails(type,amount,g.fee,g.fee_option,g.bank_transfer_fee,g.transfer_destination);
    if(flow){delta+=flow.physicalDelta;continue;}
    if (type === "CASH_IN") delta += amount;
    else if (type === "CASH_OUT") delta -= amount;
    else if (type === "BILLS_PAYMENT" && source === "CASH") delta += amount;
  }
  return roundMoney(delta);
}
function cashManagementReportCashMovementRow(movementId, date, type, referenceId, description, delta, meta, session, createdAt) {
  return {
    movement_id: movementId,
    movement_date: date,
    movement_type: type,
    reference_id: str(referenceId),
    description: str(description || ""),
    amount_delta: roundMoney(delta),
    created_at: createdAt || phDateTimePrecise(),
    created_by: str(meta && meta.userName || session && session.username || "System"),
    created_by_id: str(session && session.id || "")
  };
}
function gcashWalletMovementRow(movementId,date,type,referenceId,description,delta,meta,session,createdAt) {
  return {movement_id:movementId,movement_date:date,movement_type:type,reference_id:str(referenceId),description:str(description||""),amount_delta:roundMoney(delta),created_at:createdAt||phDateTime(),created_by:str(meta&&meta.userName||session&&session.username||"System"),created_by_id:str(session&&session.id||"")};
}
function gcashWalletUpdateStatement(env,delta,meta,session,at) {
  return env.DB.prepare("UPDATE gcash_wallet_balance SET balance=ROUND(balance+?,2),updated_at=?,updated_by=?,updated_by_id=? WHERE wallet_id='default'").bind(roundMoney(delta),at||phDateTime(),str(meta&&meta.userName||session&&session.username||"System"),str(session&&session.id||""));
}
function gcashWalletSetStatement(env,balance,meta,session,at) {
  return env.DB.prepare("UPDATE gcash_wallet_balance SET balance=?,updated_at=?,updated_by=?,updated_by_id=? WHERE wallet_id='default'").bind(roundMoney(balance),at||phDateTime(),str(meta&&meta.userName||session&&session.username||"System"),str(session&&session.id||""));
}
async function recordSale(env, sale, meta, session) {
  await ensureGcashCashFlowColumns(env);
  if(!sale||!Array.isArray(sale.lines)||!sale.lines.length) throw new Error("Sale must contain at least one item");
  let lines=sale.lines.map(x=>Object.assign({},x));
  const cashier=session.role==="Cashier",freeAiceSale=sale.isFreeAiceSale===true;
  const products = new Map((await dbAll(env,"SELECT * FROM products")).map(p=>[str(p.product_id),p]));
  const appSettings=await settingsObject(env);
  const configuredDeductions=parseSalesDeductions(appSettings.salesDeductions);
  const configuredBankFeeRaw=str(appSettings.gcashCashInBankTransferFee||"").trim();
  const configuredBankTransferFee=configuredBankFeeRaw===""?10:Number(configuredBankFeeRaw);
  if(!Number.isFinite(configuredBankTransferFee)||configuredBankTransferFee<0||configuredBankTransferFee>100000) throw new Error("The configured Cash In bank transfer fee is invalid. Ask an Admin to correct it in Settings.");
  const gcashTypes={CASH_IN:"Cash In",CASH_OUT:"Cash Out",LOAD:"GCash Load",BILLS_PAYMENT:"Bills Payment"};
  const seenGcashNumbers=new Set();
  for(let i=0;i<lines.length;i++) {
    const line=lines[i];
    if(!line.gcashService) continue;
    if(freeAiceSale) throw new Error("GCash service transactions cannot be combined with a free Aice order.");
    const g=line.gcashTransaction||{},type=str(g.type||"").trim().toUpperCase();
    if(!Object.prototype.hasOwnProperty.call(gcashTypes,type)) throw new Error("Choose a valid GCash transaction type.");
    const amount=n(g.amount);
    if(!Number.isFinite(amount)||amount<=0||amount>100000000) throw new Error("The GCash transaction amount must be greater than zero.");
    const transactionNumber=str(g.transactionNumber||"").trim();
    if(!transactionNumber||transactionNumber.length>120) throw new Error("A valid GCash transaction number is required.");
    const normalizedNumber=transactionNumber.toLowerCase();
    if(seenGcashNumbers.has(normalizedNumber)) throw new Error("A GCash transaction number cannot be used more than once in the same checkout.");
    seenGcashNumbers.add(normalizedNumber);
    const priorGcash=await dbFirst(env,"SELECT transaction_id,sale_transaction_id FROM gcash_transactions WHERE lower(transaction_id)=lower(?) LIMIT 1",transactionNumber);
    if(priorGcash && str(priorGcash.sale_transaction_id)!==str(sale.transactionId||"")) throw new Error("GCash transaction number "+transactionNumber+" has already been recorded.");
    const customerName=str(g.customerName||"").trim().slice(0,120),billerName=str(g.billerName||"").trim().slice(0,160),paymentSource=str(g.paymentSource||"").trim().toUpperCase();
    if(type==="LOAD"&&!customerName) throw new Error("Customer name is required for GCash Load.");
    if(type==="BILLS_PAYMENT"&&!billerName) throw new Error("Enter the type of bill or biller for Bills Payment.");
    if((type==="LOAD"||type==="BILLS_PAYMENT")&&!["GCASH","CASH"].includes(paymentSource)) throw new Error("Choose whether the Load or Bills Payment principal was paid via GCash or Cash.");
    const providerFee=type==="LOAD"?2:type==="BILLS_PAYMENT"?n(g.providerFee):0;
    if(!Number.isFinite(providerFee)||providerFee<0||providerFee>1000000) throw new Error("Enter a valid actual GCash wallet fee between ₱0 and ₱1,000,000.");
    const fee=type==="CASH_IN"||type==="CASH_OUT"?Math.ceil(amount/500)*10:type==="LOAD"?Math.ceil(amount/100)*10:Math.ceil(amount/1000)*25;
    const feeOption=str(g.feeOption||"").trim().toUpperCase();
    const transferDestination=str(g.transferDestination||"").trim();
    const bankTransferFee=type==="CASH_IN"&&feeOption==="C"?configuredBankTransferFee:0;
    if(type==="CASH_IN"&&!["B","C"].includes(feeOption)) throw new Error("For Cash In, choose Option B or Option C. Option A is not available.");
    if(type==="CASH_OUT"&&!["A","B","C"].includes(feeOption)) throw new Error("Choose a Cash Out fee option before completing checkout.");
    if((type==="CASH_IN"||type==="CASH_OUT")&&feeOption==="A"&&amount<=fee) throw new Error("The requested amount must be greater than the service fee when the fee is deducted from the amount.");
    if(type==="CASH_IN"&&feeOption==="C") {
      if(!transferDestination||transferDestination.length>120) throw new Error("Enter a transfer destination / bank name of 1–120 characters.");
      if(Math.abs(n(g.bankTransferFee)-configuredBankTransferFee)>0.005) throw new Error("The configured bank transfer fee changed while this transaction was open. Refresh the Checkout Page and start the transaction again.");
      if(str(g.transactionStatus||"").toUpperCase()!=="COMPLETED") throw new Error("The bank transfer must be marked successfully completed before checkout can be saved.");
      if(str(g.bankTransferReference||"").trim().toLowerCase()!==transactionNumber.toLowerCase()) throw new Error("The bank transfer reference is missing or does not match the transaction reference.");
    }
    const flow=(type==="CASH_IN"||type==="CASH_OUT")?gcashCashFlowDetails(type,amount,fee,feeOption,bankTransferFee,transferDestination):null;
    if((type==="CASH_IN"||type==="CASH_OUT")&&!flow) throw new Error("Choose a valid GCash Cash In/Cash Out fee option before completing checkout.");
    const detail=type==="LOAD"?" · "+customerName:type==="BILLS_PAYMENT"?" · "+billerName:"";
    const serviceLineName=type==="LOAD"?"GCash Load Customer Charge · "+customerName:(type==="CASH_IN"||type==="CASH_OUT"?"GCash "+gcashTypes[type]+" Service Fee · Option "+feeOption:"GCash "+gcashTypes[type]+" Service Charge")+detail;
    lines[i]=Object.assign({},line,{id:"GCASH-SERVICE",name:serviceLineName,brand:"GCash",flavor:"",ownerName:"GCash Services",qty:1,saleUnit:"service fee",price:type==="LOAD"?roundMoney(amount+fee+1):fee,cost:0,baseQty:0,gcashService:true,gcashTransaction:{
      type:type,transactionNumber:transactionNumber,customerName:customerName,billerName:billerName,
      paymentSource:type==="CASH_IN"?"CASH":type==="CASH_OUT"?"GCASH":paymentSource,
      amount:roundMoney(amount),fee:fee,providerFee:roundMoney(providerFee),feeOption:flow?flow.feeOption:"",
      customerPaymentAmount:flow?flow.customerPaymentAmount:0,payoutAmount:flow?flow.payoutAmount:0,
      feePaymentSource:flow?flow.feePaymentSource:"",bankTransferFee:flow?flow.bankTransferFee||0:0,
      transferDestination:flow?flow.transferDestination||"":"",amountTransferred:flow?flow.amountTransferred||0:0,
      walletDeduction:flow?flow.walletDeduction||0:0,cashCollected:flow?flow.cashCollected||0:0,
      transactionStatus:type==="CASH_IN"&&feeOption==="C"?"COMPLETED":"COMPLETED",
      bankTransferReference:type==="CASH_IN"&&feeOption==="C"?transactionNumber:""
    }});
  }
  const gcashServiceTypesInCheckout=lines.filter(line=>line&&line.gcashService).map(line=>str(line.gcashTransaction&&line.gcashTransaction.type).toUpperCase());
  if(gcashServiceTypesInCheckout.includes("LOAD")&&gcashServiceTypesInCheckout.length>1) {
    throw new Error("A GCash Load must be recorded without other GCash service transactions in the same checkout. This order includes another GCash service line that would add an extra wallet movement. Remove the other GCash service line or record it in a separate checkout, then retry.");
  }
  for(let i=0;i<lines.length;i++){
    const line=lines[i];if(!line.salesDeduction)continue;
    const d=configuredDeductions.find(x=>x.id===str(line.deductionId||str(line.id).replace(/^DEDUCTION-/,"")));
    if(!d)throw new Error("This sales deduction is no longer configured. Refresh checkout and try again.");
    const qty=n(line.qty);if(!Number.isInteger(qty)||qty<1||qty>1000)throw new Error("Sales deduction quantity must be a whole number between 1 and 1,000.");
    lines[i]={id:"DEDUCTION-"+d.id,deductionId:d.id,name:d.description,brand:"",flavor:"",ownerName:"Sales Deductions",sku:"",qty:qty,saleUnit:"deduction",price:-d.amount,cost:0,baseQty:0,salesDeduction:true};
  }
  if(cashier||freeAiceSale) {
    lines=lines.map(line=>{
      if(line.gcashService||line.salesDeduction) return line;
      const id=str(line.id||""),p=products.get(id);
      if(!p) throw new Error("A product in this checkout is no longer available. Refresh the checkout and try again.");
      if(freeAiceSale&&!/\baice\b/i.test(str(p.brand)+" "+str(p.product_name))) throw new Error("The Free option can only be used when every checkout item is an Aice product.");
      const qty=n(line.qty); if(!Number.isInteger(qty)||qty<=0) throw new Error("Each checkout quantity must be a whole number greater than zero.");
      const pack=Math.max(1,n(p.pack_size)||1),packType=str(p.pack_type||"None"),isPack=pack>1&&str(line.saleUnit)===packType;
      const selling=n(p.selling_price),unitPrice=pack>1?(n(p.unit_price)||selling/pack):selling,trusted=isPack?selling:unitPrice;
      const submittedPrice=freeAiceSale&&line.regularPrice!==undefined?line.regularPrice:line.price;
      if(Math.abs(n(submittedPrice)-trusted)>0.01) throw new Error("The price for "+str(p.product_name||"a product")+" has changed. Please refresh the checkout before recording this sale.");
      return {id:id,name:str(p.product_name),brand:str(p.brand),flavor:str(p.flavor),ownerName:str(p.owner_name||""),qty:qty,saleUnit:isPack?packType:str(p.unit||"pcs"),price:freeAiceSale?0:trusted,...(freeAiceSale?{regularPrice:trusted}:{}),baseQty:qty*(isPack?pack:1)};
    });
  }
  const requestedTotal=n(sale.total),paid=n(sale.payment),calculated=lines.reduce((sum,l)=>sum+(l.salesDeduction?n(l.qty)*n(l.price):Math.max(0,n(l.qty))*Math.max(0,n(l.price))),0);
  if(freeAiceSale&&(Math.abs(requestedTotal)>0.02||Math.abs(paid)>0.02)) throw new Error("Free Aice sales must have a zero total and zero payment.");
  if(requestedTotal<0&&!lines.some(l=>l.salesDeduction)) throw new Error("A negative total requires a valid sales deduction.");
  if(paid<requestedTotal) throw new Error("Payment must be at least the sale total.");
  if(Math.abs(calculated-requestedTotal)>0.02) throw new Error("Sale total does not match the item subtotals. Refresh the cart and try again.");
  const tx=str(sale.transactionId||makeId("TX"));
  const existingSale=await getBy(env,"sales","transaction_id",tx);
  if(existingSale){
    let existingLines=[];try{existingLines=JSON.parse(str(existingSale.item_details||"[]"));}catch(_){}
    const existingGrouped=new Map();for(const line of existingLines){const id=str(line.id||""),qty=n(line.baseQty!==undefined?line.baseQty:line.qty);if(id)existingGrouped.set(id,(existingGrouped.get(id)||0)+qty);}
    const stockChanges=[];for(const [id,qty] of existingGrouped){const p=await getBy(env,"products","product_id",id);if(p)stockChanges.push({id,quantity:qty,stock:n(p.stock_units!==null&&p.stock_units!==undefined?p.stock_units:p.stock)});}
    let outLines=existingLines;if(cashier)outLines=existingLines.map(line=>{const clean={};Object.keys(line||{}).forEach(k=>{if(k!=="cost")clean[k]=line[k];});return clean;});
    const existingGcash=(await dbAll(env,"SELECT * FROM gcash_transactions WHERE sale_transaction_id=? ORDER BY rowid",tx)).map(gcashTransactionDto);
    return {ok:true,duplicate:true,transactionId:tx,profit:existingSale.profit===""||existingSale.profit===null?null:n(existingSale.profit),date:str(existingSale.date),time:str(existingSale.time),dateTime:str(existingSale.datetime),lines:outLines,stockChanges,gcashTransactions:existingGcash};
  }
  const grouped=new Map();
  for(const line of lines) {
    if(line.gcashService||line.salesDeduction) continue;
    const id=str(line.id||""),qty=n(line.baseQty!==undefined?line.baseQty:line.qty);
    if(!id) throw new Error("A sale item is missing its product ID.");
    if(qty<=0) throw new Error("Invalid sale quantity for "+str(line.name||id));
    const g=grouped.get(id)||{id:id,qty:0,name:str(line.name||id)};g.qty+=qty;grouped.set(id,g);
  }
  for(const [id,g] of grouped) {
    const p=products.get(id); if(!p) throw new Error("Product not found: "+g.name+". Refresh inventory and try again.");
    const stock=n(p.stock_units!==null&&p.stock_units!==undefined?p.stock_units:p.stock);
    if(stock<g.qty) throw new Error("Not enough stock for "+g.name+". Available: "+stock+" base units.");
  }
  let costComplete=true;
  const trustedLines=lines.map(line=>{
    if(line.salesDeduction){costComplete=false;return Object.assign({},line,{cost:0,ownerName:"Sales Deductions",baseQty:0});}
    if(line.gcashService) { const clean=Object.assign({},line,{id:"GCASH-SERVICE",cost:0,ownerName:"GCash Services",price:n(line.gcashTransaction&&line.gcashTransaction.fee),qty:1,baseQty:0}); return clean; }
    const p=products.get(str(line.id)),pack=Math.max(1,n(p&&p.pack_size)||1),isPack=!!p&&pack>1&&str(line.saleUnit)===str(p.pack_type||"None");
    let cost=null;
    if(p) cost=isPack?(p.pack_cost!==null&&p.pack_cost!==""?n(p.pack_cost):(p.cost_price!==null&&p.cost_price!==""?n(p.cost_price)*pack:null)):(p.cost_price!==null&&p.cost_price!==""?n(p.cost_price):null);
    if(cost===null) costComplete=false;
    const clean=Object.assign({},line,{cost:cost,ownerName:str(p&&p.owner_name||line.ownerName||"")});return clean;
  });
  const gcashWalletCosts=trustedLines.filter(l=>l.gcashService).reduce((sum,l)=>{
    const g=l.gcashTransaction||{},type=str(g.type).toUpperCase();
    return sum+(type==="LOAD"?n(g.amount):0)+((type==="LOAD"||type==="BILLS_PAYMENT")?n(g.providerFee):0);
  },0);
  const totalProductCost=trustedLines.filter(l=>!l.gcashService&&!l.salesDeduction).reduce((sum,l)=>sum+n(l.cost)*n(l.qty),0);
  const profit=costComplete&&!trustedLines.some(l=>l.salesDeduction)?roundMoney(requestedTotal-totalProductCost-gcashWalletCosts):null;
  const dt=phDateTime(),date=dt.slice(0,10),time=dt.slice(11,19);
  const itemCount=sale.items===undefined?trustedLines.reduce((s,l)=>s+n(l.qty),0):n(sale.items);
  const saleGcashLines=trustedLines.filter(line=>line.gcashService===true);
  const gcashRows=saleGcashLines.map(line=>{
    const g=line.gcashTransaction||{},type=str(g.type).toUpperCase(),amount=n(g.amount),fee=n(g.fee),option=str(g.feeOption||"").toUpperCase();
    const flow=gcashCashFlowDetails(type,amount,fee,option,n(g.bankTransferFee),str(g.transferDestination||""));
    if((type==="CASH_IN"||type==="CASH_OUT")&&!flow) throw new Error("Choose a valid GCash Cash In/Cash Out fee option before completing checkout.");
    if(flow&&option==="A"&&amount<=fee) throw new Error("The requested amount must be greater than the fee when the fee is deducted from the amount.");
    return {
      transaction_id:g.transactionNumber,date:date,time:time,service_type:g.type,customer_name:g.customerName||"",biller_name:g.billerName||"",
      amount:amount,fee:fee,provider_fee:["LOAD","BILLS_PAYMENT"].includes(type)?roundMoney(n(g.providerFee)):0,
      payment_source:type==="CASH_IN"?"CASH":type==="CASH_OUT"?"GCASH":str(g.paymentSource||""),
      fee_option:flow?flow.feeOption:"",customer_payment_amount:flow?flow.customerPaymentAmount:0,
      payout_amount:flow?flow.payoutAmount:0,fee_payment_source:flow?flow.feePaymentSource:"",
      bank_transfer_fee:flow?roundMoney(n(flow.bankTransferFee)):0,transfer_destination:flow?str(flow.transferDestination||""):"",
      amount_transferred:flow?roundMoney(n(flow.amountTransferred)):0,wallet_deduction:flow?roundMoney(n(flow.walletDeduction)):0,
      cash_collected:flow?roundMoney(n(flow.cashCollected)):0,transaction_status:str(g.transactionStatus||"COMPLETED").toUpperCase(),
      bank_transfer_reference:str(g.bankTransferReference||""),sale_transaction_id:tx,created_at:dt,created_by:userLabel(session),created_by_id:str(session.id)
    };
  });
  const saleRow={date:date,transaction_id:tx,items:itemCount,total:requestedTotal,profit:profit,payment:paid,change:freeAiceSale||requestedTotal<0?0:n(sale.change),item_details:JSON.stringify(trustedLines),time:time,payment_method:freeAiceSale?"Free (Aice)":str(sale.paymentMethod||"Cash"),datetime:dt,payment_transaction_id:freeAiceSale?"":str(sale.paymentTransactionId||(gcashRows.length===1?gcashRows[0].transaction_id:"")||"")};
  // Ordinary checkout payments made through GCash must appear in the GCash log too.
  // Keep the customer's GCash reference as the log ID and link it to this sale.
  if(!freeAiceSale && isGcashPaymentMethod(saleRow.payment_method) && requestedTotal>0) {
    const paymentReference=str(sale.paymentTransactionId||saleRow.payment_transaction_id||"").trim();
    if(!paymentReference) throw new Error("A GCash payment reference number is required to record this checkout in GCash Transactions.");
    const matchingService=gcashRows.find(row=>str(row.transaction_id).toLowerCase()===paymentReference.toLowerCase());
    const isCashOutFeeViaGcashOnly=!!matchingService &&
      str(matchingService.service_type).toUpperCase()==="CASH_OUT" &&
      str(matchingService.fee_option).toUpperCase()==="B" &&
      trustedLines.every(line=>line.gcashService===true || line.salesDeduction===true);
    if(matchingService && !isCashOutFeeViaGcashOnly) {
      throw new Error("The GCash payment reference matches a GCash service transaction in this same checkout. Please verify the payment reference.");
    }
    if(!isCashOutFeeViaGcashOnly) {
      const priorCheckoutGcash=await dbFirst(env,"SELECT transaction_id,sale_transaction_id FROM gcash_transactions WHERE lower(transaction_id)=lower(?) LIMIT 1",paymentReference);
      if(priorCheckoutGcash) throw new Error("GCash transaction reference "+paymentReference+" has already been recorded. Please verify the reference before completing this sale.");
      gcashRows.push({transaction_id:paymentReference,date:date,time:time,service_type:"POS_SALE",customer_name:"Checkout Sale",biller_name:"",amount:requestedTotal,fee:0,payment_source:"GCASH",sale_transaction_id:tx,created_at:dt,created_by:userLabel(session),created_by_id:str(session.id)});
    }
  }
  if(gcashRows.some(row=>["LOAD","BILLS_PAYMENT"].includes(str(row.service_type).toUpperCase()))) await ensureGcashProviderFeeColumn(env);
  await ensureGcashCashFlowColumns(env);
  const providerFeeTotal=roundMoney(gcashRows.reduce((sum,row)=>sum+(["LOAD","BILLS_PAYMENT"].includes(str(row.service_type).toUpperCase())?n(row.provider_fee):0),0));
  const bankTransferRows=gcashRows.filter(row=>str(row.service_type).toUpperCase()==="CASH_IN"&&str(row.fee_option).toUpperCase()==="C"&&str(row.transaction_status).toUpperCase()==="COMPLETED");
  const bankTransferFeeTotal=roundMoney(bankTransferRows.reduce((sum,row)=>sum+n(row.bank_transfer_fee),0));
  const bankTransferAudit=bankTransferRows.map(row=>"Bank transfer Option C to "+str(row.transfer_destination||"Bank")+
    ": ref "+str(row.bank_transfer_reference||row.transaction_id)+", principal ₱"+n(row.amount_transferred).toFixed(2)+
    ", bank fee ₱"+n(row.bank_transfer_fee).toFixed(2)+", cash collected ₱"+n(row.cash_collected).toFixed(2)+
    ", wallet deduction ₱"+n(row.wallet_deduction).toFixed(2)+", status "+str(row.transaction_status)).join("; ");
  const walletDelta=gcashWalletDeltaForSale(saleRow,gcashRows),wallet=await ensureGcashWalletBalance(env);
  if(walletDelta < 0 && n(wallet.balance)+walletDelta < -0.005) throw new Error("This GCash transaction would exceed the recorded wallet balance. Check the recorded GCash wallet balance before continuing.");
  const walletMovementDescription=(providerFeeTotal>0
    ?"POS payment received plus GCash service principal movements; GCash Load / Bills Payment wallet fees ₱"+providerFeeTotal.toFixed(2)+" included"
    :"POS payment received plus GCash service principal movements")+
    (bankTransferRows.length?"; bank transfer fee pass-through ₱"+bankTransferFeeTotal.toFixed(2)+". "+bankTransferAudit:"");
  const walletMovement=gcashWalletMovementRow("SALE:"+tx,date,"POS_SALE",tx,walletMovementDescription,walletDelta,meta,session,dt);
  const physicalCashDelta=cashManagementReportPhysicalCashDeltaForSale(saleRow,gcashRows);
  const physicalDescription="Physical cash effect of checkout "+tx+(bankTransferRows.length?"; bank-transfer Option C physical cash collected ₱"+roundMoney(bankTransferRows.reduce((sum,row)=>sum+n(row.cash_collected),0)).toFixed(2)+". "+bankTransferAudit:"");
  const physicalCashMovement= Math.abs(physicalCashDelta)>0.0001 ? cashManagementReportCashMovementRow("SALE:"+tx,date,"POS_SALE_CASH",tx,physicalDescription,physicalCashDelta,meta,session,phDateTimePrecise()) : null;
  const stmts=[insertStmt(env,"sales",saleRow),insertStmt(env,"gcash_balance_movements",walletMovement)];
  if(Math.abs(walletDelta)>0.0001) stmts.push(gcashWalletUpdateStatement(env,walletDelta,meta,session,dt));
  if(physicalCashMovement) stmts.push(insertStmt(env,"cash_management_report_cash_movements",physicalCashMovement));
  
  gcashRows.forEach(row=>stmts.push(insertStmt(env,"gcash_transactions",row)));
  const beforeProducts=new Map(),movementRows=[];
  for(const [id,g] of grouped) {
    const p=products.get(id),old=n(p.stock_units!==null&&p.stock_units!==undefined?p.stock_units:p.stock),next=old-g.qty;
    beforeProducts.set(id,p);
    stmts.push(env.DB.prepare("UPDATE products SET stock_units=?,stock=? WHERE product_id=? AND COALESCE(stock_units,stock,0)>=?").bind(next,next,id,g.qty));
    movementRows.push({date:date,product_id:id,type:"SALE",quantity:g.qty,reason:"POS Sale "+tx,datetime:dt});
    stmts.push(insertStmt(env,"stock_movement",movementRows[movementRows.length-1]));
  }
  await env.DB.batch(stmts);
  const savedSale=await getBy(env,"sales","transaction_id",tx),changes=[changeRecord("sales",null,savedSale)].filter(Boolean),stockChanges=[];
  const savedGcashTransactions=[];
  for(const row of gcashRows){const savedGcash=await getBy(env,"gcash_transactions","transaction_id",row.transaction_id);if(savedGcash){savedGcashTransactions.push(gcashTransactionDto(savedGcash));const gc=changeRecord("gcash_transactions",null,savedGcash);if(gc)changes.push(gc);}}
  for(const [id,g] of grouped) {
    const before=beforeProducts.get(id),after=await getBy(env,"products","product_id",id);
    changes.push(changeRecord("products",before,after));
    stockChanges.push({id:id,quantity:g.qty,stock:n(after.stock_units!==null&&after.stock_units!==undefined?after.stock_units:after.stock)});
  }
  const movements=await dbAll(env,"SELECT * FROM stock_movement WHERE type='SALE' AND reason=? AND datetime=? ORDER BY movement_id", "POS Sale "+tx,dt);
  movements.forEach(r=>{const c=changeRecord("stock_movement",null,r);if(c)changes.push(c);});
  const auditMeta=Object.assign({},meta||{});
  await audit(env,"SALE_RECORDED",tx,"Total "+requestedTotal.toFixed(2)+"; payment "+(freeAiceSale?"Free (Aice)":str(sale.paymentMethod||"Cash"))+"; items "+itemCount,auditMeta,changes);
  let outLines=trustedLines;
  if(cashier) outLines=trustedLines.map(line=>{const clean={};Object.keys(line||{}).forEach(k=>{if(k!=="cost")clean[k]=line[k];});return clean;});
  return {ok:true,transactionId:tx,profit:cashier?null:profit,costComplete:cashier?false:costComplete,date:date,time:time,dateTime:dt,lines:outLines,stockChanges:stockChanges,gcashTransactions:savedGcashTransactions};
}

function gcashTransactionForAudit(row) {
  if (!row) return row;
  const copy = Object.assign({}, row);
  copy.receipt_data = str(copy.receipt_data) ? "[receipt attached]" : "";
  return copy;
}
function gcashTransactionSaleContribution(row) {
  const type = str(row && (row.service_type !== undefined ? row.service_type : row.serviceType)).toUpperCase();
  const amount = n(row && row.amount), fee = n(row && (row.fee !== undefined ? row.fee : row.serviceFee));
  if (type === "POS_SALE") return 0;
  return roundMoney(type === "LOAD" ? amount + fee + 1 : fee);
}
function gcashTransactionServiceProfit(row) {
  const type = str(row && (row.service_type !== undefined ? row.service_type : row.serviceType)).toUpperCase();
  const fee = n(row && (row.fee !== undefined ? row.fee : row.serviceFee));
  const providerFee = n(row && (row.provider_fee !== undefined ? row.provider_fee : row.providerFee));
  if (type === "POS_SALE") return 0;
  return roundMoney((type === "LOAD" ? fee + 1 : fee) - providerFee);
}
function gcashTransactionServiceLine(row) {
  const type = str(row && (row.service_type !== undefined ? row.service_type : row.serviceType)).toUpperCase();
  const customerName = str(row && (row.customer_name !== undefined ? row.customer_name : row.customerName));
  const billerName = str(row && (row.biller_name !== undefined ? row.biller_name : row.billerName));
  const transactionId = str(row && (row.transaction_id !== undefined ? row.transaction_id : row.transactionId));
  const amount = n(row && row.amount), fee = n(row && row.fee);
  const detail = type === "LOAD" ? " · " + customerName : type === "BILLS_PAYMENT" ? " · " + billerName : "";
  const serviceNames = { CASH_IN: "Cash In", CASH_OUT: "Cash Out", LOAD: "Load", BILLS_PAYMENT: "Bills Payment" };
  return {
    id: "GCASH-SERVICE",
    name: type === "LOAD" ? "GCash Load Customer Charge · " + customerName : "GCash " + (serviceNames[type] || type) + (["CASH_IN","CASH_OUT"].includes(type) ? " Service Fee · Option " + str(row && (row.fee_option !== undefined ? row.fee_option : row.feeOption) || "") : " Service Charge") + detail,
    brand: "GCash", flavor: "", ownerName: "GCash Services", sku: "",
    qty: 1, saleUnit: "service charge", price: fee, cost: 0, baseQty: 0, gcashService: true,
    gcashTransaction: {
      type: type, transactionNumber: transactionId, customerName: customerName,
      billerName: billerName,
      paymentSource: str(row && (row.payment_source !== undefined ? row.payment_source : row.paymentSource)),
      feeOption: str(row && (row.fee_option !== undefined ? row.fee_option : row.feeOption)),
      customerPaymentAmount: n(row && (row.customer_payment_amount !== undefined ? row.customer_payment_amount : row.customerPaymentAmount)),
      payoutAmount: n(row && (row.payout_amount !== undefined ? row.payout_amount : row.payoutAmount)),
      feePaymentSource: str(row && (row.fee_payment_source !== undefined ? row.fee_payment_source : row.feePaymentSource)),
      bankTransferFee: n(row && (row.bank_transfer_fee !== undefined ? row.bank_transfer_fee : row.bankTransferFee)),
      transferDestination: str(row && (row.transfer_destination !== undefined ? row.transfer_destination : row.transferDestination)),
      amountTransferred: n(row && (row.amount_transferred !== undefined ? row.amount_transferred : row.amountTransferred)),
      walletDeduction: n(row && (row.wallet_deduction !== undefined ? row.wallet_deduction : row.walletDeduction)),
      cashCollected: n(row && (row.cash_collected !== undefined ? row.cash_collected : row.cashCollected)),
      transactionStatus: str(row && (row.transaction_status !== undefined ? row.transaction_status : row.transactionStatus)),
      bankTransferReference: str(row && (row.bank_transfer_reference !== undefined ? row.bank_transfer_reference : row.bankTransferReference)),
      amount: amount, fee: fee, providerFee: n(row && (row.provider_fee !== undefined ? row.provider_fee : row.providerFee))
    }
  };
}
function gcashTransactionLineIndex(lines, transactionId) {
  const id = str(transactionId);
  return (lines || []).findIndex(line => {
    const g = line && line.gcashTransaction || {};
    return !!line && line.gcashService === true &&
      [g.transactionNumber, g.transactionId, g.id].some(value => str(value) === id);
  });
}
function gcashTransactionUpdateSaleRow(sale, lines, totalDelta, profitDelta, oldGcashId, newGcashId, updatePaymentReference) {
  const total = roundMoney(n(sale.total) + n(totalDelta));
  if (total < -0.01) throw new Error("This edit would make the linked Sales Report transaction total negative.");
  const paid = n(sale.payment);
  if (paid + 0.01 < total) throw new Error("The edited service fee would make the linked sale total exceed the recorded payment. Correct the payment first.");
  let paymentTransactionId = str(sale.payment_transaction_id);
  if (updatePaymentReference && paymentTransactionId === str(oldGcashId)) {
    paymentTransactionId = newGcashId ? str(newGcashId) : "";
  }
  const currentProfit = sale.profit === "" || sale.profit === null || sale.profit === undefined
    ? null : roundMoney(n(sale.profit) + n(profitDelta));
  return Object.assign({}, sale, {
    items: (lines || []).reduce((sum, line) => sum + Math.max(0, n(line && line.qty)), 0),
    total: total,
    profit: currentProfit,
    change: roundMoney(Math.max(0, paid - total)),
    item_details: JSON.stringify(lines || []),
    payment_transaction_id: paymentTransactionId
  });
}
async function applyGcashTransactionBalanceCorrection(env, changes, meta, session, now, description) {
  let walletDelta = 0, physicalDelta = 0;
  const normalizedChanges = [];
  for (const change of changes || []) {
    let nextWalletDelta, nextPhysicalDelta;
    if (change.walletDelta !== undefined || change.physicalDelta !== undefined) {
      nextWalletDelta = roundMoney(n(change.walletDelta));
      nextPhysicalDelta = roundMoney(n(change.physicalDelta));
    } else {
      const beforeSale = change.beforeSale, afterSale = change.afterSale;
      const beforeRows = change.beforeRows || [], afterRows = change.afterRows || [];
      nextWalletDelta = roundMoney(
        (afterSale ? gcashWalletDeltaForSale(afterSale, afterRows) : 0) -
        (beforeSale ? gcashWalletDeltaForSale(beforeSale, beforeRows) : 0));
      nextPhysicalDelta = roundMoney(
        (afterSale ? cashManagementReportPhysicalCashDeltaForSale(afterSale, afterRows) : 0) -
        (beforeSale ? cashManagementReportPhysicalCashDeltaForSale(beforeSale, beforeRows) : 0));
    }
    walletDelta = roundMoney(walletDelta + nextWalletDelta);
    physicalDelta = roundMoney(physicalDelta + nextPhysicalDelta);
    normalizedChanges.push({saleId:str(change.saleId||change.id||""),walletDelta:nextWalletDelta,physicalDelta:nextPhysicalDelta});
  }
  const wallet = await ensureGcashWalletBalance(env);
  const today = phDate();
  if (walletDelta < 0 && n(wallet && wallet.balance) + walletDelta < -0.005) {
    throw new Error("This edit would make the recorded GCash Wallet Balance negative. Reconcile the wallet balance before saving.");
  }
  if (Math.abs(physicalDelta) > 0.0001) {
    const physicalNow = await cashManagementReportPhysicalCashAsOf(env, today);
    if (physicalDelta < 0 && physicalNow + physicalDelta < -0.005) {
      throw new Error("This edit would make Physical Cash On Hand negative. Reconcile the cash balance before saving.");
    }
  }
  const statements = [];
  for (const change of normalizedChanges) {
    if (Math.abs(change.walletDelta || 0) > 0.0001) {
      statements.push(insertStmt(env, "gcash_balance_movements", gcashWalletMovementRow(
        makeId("GCB"), today, "GCASH_TRANSACTION_EDIT", change.saleId,
        description + " · linked sale " + change.saleId, change.walletDelta, meta, session, now
      )));
    }
    if (Math.abs(change.physicalDelta || 0) > 0.0001) {
      statements.push(insertStmt(env, "cash_management_report_cash_movements", cashManagementReportCashMovementRow(
        makeId("CMV"), today, "GCASH_TRANSACTION_EDIT_CASH", change.saleId,
        description + " · linked sale " + change.saleId, change.physicalDelta, meta, session, now
      )));
    }
  }
  if (Math.abs(walletDelta) > 0.0001) statements.push(gcashWalletUpdateStatement(env, walletDelta, meta, session, now));
  return { statements, walletDelta, physicalDelta };
}
async function editGcashTransaction(env, data, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can edit GCash transactions.");
  data = data || {};
  await ensureGcashProviderFeeColumn(env);
  await ensureGcashReceiptColumns(env);
  await ensureGcashCashFlowColumns(env);
  const oldId = str(data.transactionId || data.oldTransactionId || "").trim();
  const input = data.transaction || data.updates || data;
  if (!oldId) throw new Error("Select a GCash transaction to edit.");
  const old = await getBy(env, "gcash_transactions", "transaction_id", oldId);
  if (!old) throw new Error("This GCash transaction could not be found. Refresh the log and try again.");
  const newId = str(input.newTransactionId !== undefined ? input.newTransactionId : input.transactionId !== undefined ? input.transactionId : oldId).trim();
  if (!newId || newId.length > 120) throw new Error("Enter a GCash Transaction ID of 1–120 characters.");
  const duplicateId = await dbFirst(env, "SELECT transaction_id FROM gcash_transactions WHERE lower(transaction_id)=lower(?) AND lower(transaction_id)<>lower(?) LIMIT 1", newId, oldId);
  if (duplicateId) throw new Error("That GCash Transaction ID is already used by another record.");
  const oldType = str(old.service_type).toUpperCase();
  const newType = str(input.serviceType !== undefined ? input.serviceType : oldType).trim().toUpperCase();
  const supportedServiceTypes = new Set(["CASH_IN", "CASH_OUT", "LOAD", "BILLS_PAYMENT"]);
  if (oldType === "POS_SALE" && newType !== "POS_SALE") {
    throw new Error("A GCash-paid checkout entry must remain a GCash Checkout Sale. To change its payment details, edit the linked sale instead.");
  }
  if (oldType !== "POS_SALE" && !supportedServiceTypes.has(newType)) {
    throw new Error("Choose Cash In, Cash Out, GCash Load, or Bills Payment for a service transaction.");
  }
  const customerName = str(input.customerName !== undefined ? input.customerName : old.customer_name).trim().slice(0, 120);
  const billerName = str(input.billerName !== undefined ? input.billerName : old.biller_name).trim().slice(0, 160);
  const amount = Number(input.amount !== undefined ? input.amount : old.amount);
  const fee = Number(input.fee !== undefined ? input.fee : old.fee);
  const providerFee = Number(input.providerFee !== undefined ? input.providerFee : old.provider_fee);
  const paymentSource = str(input.paymentSource !== undefined ? input.paymentSource : old.payment_source).trim().toUpperCase();
  const newSaleId = str(input.saleTransactionId !== undefined ? input.saleTransactionId : old.sale_transaction_id).trim();
  let posSaleForLinkChange = null;
  if (oldType === "POS_SALE") {
    if (newSaleId !== str(old.sale_transaction_id)) throw new Error("The Sales Report Transaction link for a GCash-paid checkout entry cannot be changed here.");
    const sale = await getBy(env, "sales", "transaction_id", str(old.sale_transaction_id));
    posSaleForLinkChange = sale;
    if (!sale) throw new Error("The linked Sales Report transaction could not be found.");
    // The checkout sale is authoritative for a POS_SALE log row. Do not let
    // an Admin accidentally overwrite its payment amount or payment source here.
  } else {
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) throw new Error("Amount Processed must be greater than zero.");
    if (!Number.isFinite(fee) || fee < 0 || fee > 100000000) throw new Error("Service Fee (Sales) must be zero or greater.");
    if (!Number.isFinite(providerFee) || providerFee < 0 || providerFee > 1000000) throw new Error("Actual GCash Wallet Fee must be zero or greater.");
    if (newType === "LOAD" && !customerName) throw new Error("Customer Name is required for GCash Load.");
    if (newType === "BILLS_PAYMENT" && !billerName) throw new Error("Customer / Biller requires a biller name for Bills Payment.");
    if (["LOAD", "BILLS_PAYMENT"].includes(newType) && !["GCASH", "CASH"].includes(paymentSource)) throw new Error("Principal Payment Source must be GCash or Cash for Load and Bills Payment.");
    if (!["LOAD", "BILLS_PAYMENT"].includes(newType) && !["", "GCASH", "CASH"].includes(paymentSource)) throw new Error("Choose a valid Principal Payment Source.");
    if (!newSaleId) {
      // Allow unlinking from a sales transaction if the Admin intentionally clears this field.
    } else if (newSaleId !== str(old.sale_transaction_id) && !(await getBy(env, "sales", "transaction_id", newSaleId))) {
      throw new Error("The Sales Report Transaction ID does not exist. Choose an existing sale or leave this field blank.");
    }
  }
  const flowOption = ["CASH_IN", "CASH_OUT"].includes(newType) ? str(old.fee_option || "").toUpperCase() : "";
  const flowBankTransferFee = newType === "CASH_IN" && flowOption === "C" ? n(old.bank_transfer_fee) : 0;
  const flowTransferDestination = newType === "CASH_IN" && flowOption === "C" ? str(old.transfer_destination || "") : "";
  const flowDetails = flowOption ? gcashCashFlowDetails(newType, amount, fee, flowOption, flowBankTransferFee, flowTransferDestination) : null;
  if (flowOption && !flowDetails) throw new Error("The saved Cash In/Cash Out fee option does not match the selected service type. Record the corrected service as a new transaction instead.");
  const completedBankCashIn = oldType === "CASH_IN" && str(old.fee_option).toUpperCase() === "C" && str(old.transaction_status).toUpperCase() === "COMPLETED";
  if (completedBankCashIn && (newType !== oldType || newId !== oldId || roundMoney(amount) !== roundMoney(n(old.amount)) || roundMoney(fee) !== roundMoney(n(old.fee)))) {
    throw new Error("A completed Cash In bank transfer cannot be edited to change its reference, service type, principal, or service fee. Keep the verified transfer record unchanged and use a separate correction record if needed.");
  }
  if (flowDetails && flowOption === "A" && amount <= fee) throw new Error("The requested amount must be greater than the service fee for Option A.");
  const now = phDateTimePrecise();
  const savedRow = Object.assign({}, old, {
    transaction_id: newId,
    service_type: newType,
    customer_name: oldType === "POS_SALE" ? customerName : customerName,
    biller_name: billerName,
    amount: oldType === "POS_SALE" ? roundMoney(n(posSaleForLinkChange && posSaleForLinkChange.total)) : roundMoney(amount),
    fee: oldType === "POS_SALE" ? 0 : roundMoney(fee),
    provider_fee: oldType === "POS_SALE" ? 0 : (["LOAD", "BILLS_PAYMENT"].includes(newType) ? roundMoney(providerFee) : 0),
    payment_source: oldType === "POS_SALE" ? "GCASH" : newType === "CASH_IN" ? "CASH" : newType === "CASH_OUT" ? "GCASH" : paymentSource,
    fee_option: flowDetails ? flowDetails.feeOption : "",
    customer_payment_amount: flowDetails ? flowDetails.customerPaymentAmount : 0,
    payout_amount: flowDetails ? flowDetails.payoutAmount : 0,
    fee_payment_source: flowDetails ? flowDetails.feePaymentSource : "",
    bank_transfer_fee: flowDetails ? roundMoney(n(flowDetails.bankTransferFee)) : 0,
    transfer_destination: flowDetails ? str(flowDetails.transferDestination || "") : "",
    amount_transferred: flowDetails ? roundMoney(n(flowDetails.amountTransferred)) : 0,
    wallet_deduction: flowDetails ? roundMoney(n(flowDetails.walletDeduction)) : 0,
    cash_collected: flowDetails ? roundMoney(n(flowDetails.cashCollected)) : 0,
    transaction_status: completedBankCashIn ? "COMPLETED" : str(old.transaction_status || ""),
    bank_transfer_reference: completedBankCashIn ? newId : "",
    sale_transaction_id: newSaleId
  });
  const changeList = [];
  const changesBySale = new Map();
  const loadSale = async saleId => {
    const id = str(saleId);
    if (!id || changesBySale.has(id)) return changesBySale.get(id) || null;
    const sale = await getBy(env, "sales", "transaction_id", id);
    if (!sale) return null;
    const rows = await dbAll(env, "SELECT * FROM gcash_transactions WHERE sale_transaction_id=? ORDER BY rowid", id);
    const itemLines = parseItemLines(sale);
    const snapshot = { id, beforeSale: sale, beforeRows: rows, afterSale: sale, afterRows: rows.map(row => ({...row})), lines: itemLines };
    changesBySale.set(id, snapshot);
    return snapshot;
  };
  if (oldType !== "POS_SALE") {
    const oldSnapshot = await loadSale(old.sale_transaction_id);
    const newSnapshot = newSaleId && newSaleId !== str(old.sale_transaction_id) ? await loadSale(newSaleId) : oldSnapshot;
    if (old.sale_transaction_id && !oldSnapshot) throw new Error("The current Sales Report transaction is missing. Restore that sale before editing this GCash record.");
    if (newSaleId && !newSnapshot) throw new Error("The target Sales Report transaction could not be found.");
    if (newType === "LOAD" && newSnapshot &&
        newSnapshot.beforeRows.some(row => str(row.transaction_id) !== oldId && str(row.service_type).toUpperCase() !== "POS_SALE")) {
      throw new Error("A GCash Load cannot share a checkout with another GCash service. Link it to a separate Sales Report transaction.");
    }
    const oldContribution = gcashTransactionSaleContribution(old);
    const newContribution = gcashTransactionSaleContribution(savedRow);
    const oldProfit = gcashTransactionServiceProfit(old);
    const newProfit = gcashTransactionServiceProfit(savedRow);
    const sameSale = !!oldSnapshot && !!newSnapshot && oldSnapshot.id === newSnapshot.id;
    if (sameSale) {
      const snap = oldSnapshot;
      let index = gcashTransactionLineIndex(snap.lines, oldId);
      if (index >= 0) snap.lines[index] = gcashTransactionServiceLine(savedRow);
      else snap.lines.push(gcashTransactionServiceLine(savedRow));
      snap.afterSale = gcashTransactionUpdateSaleRow(snap.beforeSale, snap.lines,
        newContribution - oldContribution, newProfit - oldProfit,
        oldId, newId, true);
      snap.afterRows = snap.beforeRows.map(row => str(row.transaction_id) === oldId ? savedRow : {...row});
    } else {
      if (oldSnapshot) {
        oldSnapshot.lines = oldSnapshot.lines.filter(line => !(line && line.gcashService === true &&
          [line.gcashTransaction && line.gcashTransaction.transactionNumber, line.gcashTransaction && line.gcashTransaction.transactionId].some(value => str(value) === oldId)));
        oldSnapshot.afterSale = gcashTransactionUpdateSaleRow(oldSnapshot.beforeSale, oldSnapshot.lines,
          -oldContribution, -oldProfit, oldId, "", true);
        oldSnapshot.afterRows = oldSnapshot.beforeRows.filter(row => str(row.transaction_id) !== oldId);
      }
      if (newSnapshot) {
        newSnapshot.lines.push(gcashTransactionServiceLine(savedRow));
        newSnapshot.afterSale = gcashTransactionUpdateSaleRow(newSnapshot.beforeSale, newSnapshot.lines,
          newContribution, newProfit, "", newId, false);
        newSnapshot.afterRows = [...newSnapshot.beforeRows, savedRow];
      }
    }
    for (const snap of changesBySale.values()) {
      // The special POS_SALE row describes the paid amount for its linked checkout.
      snap.afterRows = snap.afterRows.map(row => str(row.service_type).toUpperCase() === "POS_SALE"
        ? Object.assign({}, row, { amount: n(snap.afterSale.total) }) : row);
    }
  }
  const balanceChanges = [];
  for (const snap of changesBySale.values()) {
    const walletDelta = roundMoney(gcashWalletDeltaForSale(snap.afterSale, snap.afterRows) - gcashWalletDeltaForSale(snap.beforeSale, snap.beforeRows));
    const physicalDelta = roundMoney(cashManagementReportPhysicalCashDeltaForSale(snap.afterSale, snap.afterRows) - cashManagementReportPhysicalCashDeltaForSale(snap.beforeSale, snap.beforeRows));
    balanceChanges.push({saleId:snap.id,walletDelta,physicalDelta});
  }
  const balance = await applyGcashTransactionBalanceCorrection(env, balanceChanges, meta, session, now, "Admin edited GCash transaction " + oldId);
  const statements = [...balance.statements];
  if (oldType === "POS_SALE" && posSaleForLinkChange &&
      str(posSaleForLinkChange.payment_transaction_id) === oldId && newId !== oldId) {
    const linkedSaleAfter = Object.assign({}, posSaleForLinkChange, {payment_transaction_id:newId});
    statements.push(env.DB.prepare("UPDATE sales SET payment_transaction_id=? WHERE transaction_id=?").bind(newId, str(posSaleForLinkChange.transaction_id)));
    changeList.push(changeRecord("sales", posSaleForLinkChange, linkedSaleAfter));
  }
  statements.push(env.DB.prepare("UPDATE gcash_transactions SET transaction_id=?,service_type=?,customer_name=?,biller_name=?,amount=?,fee=?,provider_fee=?,payment_source=?,fee_option=?,customer_payment_amount=?,payout_amount=?,fee_payment_source=?,bank_transfer_fee=?,transfer_destination=?,amount_transferred=?,wallet_deduction=?,cash_collected=?,transaction_status=?,bank_transfer_reference=?,sale_transaction_id=? WHERE transaction_id=?")
    .bind(savedRow.transaction_id,savedRow.service_type,savedRow.customer_name,savedRow.biller_name,savedRow.amount,savedRow.fee,savedRow.provider_fee,savedRow.payment_source,savedRow.fee_option,savedRow.customer_payment_amount,savedRow.payout_amount,savedRow.fee_payment_source,savedRow.bank_transfer_fee,savedRow.transfer_destination,savedRow.amount_transferred,savedRow.wallet_deduction,savedRow.cash_collected,savedRow.transaction_status,savedRow.bank_transfer_reference,savedRow.sale_transaction_id,oldId));
  for (const snap of changesBySale.values()) {
    statements.push(env.DB.prepare("UPDATE sales SET items=?,total=?,profit=?,payment=?,change=?,item_details=?,payment_transaction_id=? WHERE transaction_id=?")
      .bind(snap.afterSale.items,snap.afterSale.total,snap.afterSale.profit === null ? null : snap.afterSale.profit,snap.afterSale.payment,snap.afterSale.change,snap.afterSale.item_details,snap.afterSale.payment_transaction_id,snap.id));
    statements.push(env.DB.prepare("UPDATE gcash_transactions SET amount=? WHERE sale_transaction_id=? AND UPPER(service_type)='POS_SALE'")
      .bind(n(snap.afterSale.total), snap.id));
  }
  await env.DB.batch(statements);
  const saved = await getBy(env, "gcash_transactions", "transaction_id", newId);
  changeList.push(changeRecord("gcash_transactions", gcashTransactionForAudit(old), gcashTransactionForAudit(saved)));
  for (const snap of changesBySale.values()) {
    const afterSale = await getBy(env, "sales", "transaction_id", snap.id);
    changeList.push(changeRecord("sales", snap.beforeSale, afterSale));
  }
  await audit(env, "EDIT_GCASH_TRANSACTION", oldId,
    "Admin edited GCash transaction " + oldId + " to " + newId + "; type " + oldType + " → " + newType + ", amount ₱" + n(old.amount).toFixed(2) + " → ₱" + n(savedRow.amount).toFixed(2) + ".", meta, changeList.filter(Boolean));
  return {ok:true,transaction:gcashTransactionDto(saved),oldTransactionId:oldId,newTransactionId:newId};
}
async function removeGcashTransaction(env, data, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can remove GCash transactions.");
  await ensureGcashCashFlowColumns(env);
  data = data || {};
  const id = str(data.transactionId || "").trim();
  if (!id) throw new Error("Select a GCash transaction to remove.");
  const old = await getBy(env, "gcash_transactions", "transaction_id", id);
  if (!old) throw new Error("This GCash transaction could not be found. Refresh the log and try again.");
  const type = str(old.service_type).toUpperCase();
  if (type === "CASH_IN" && str(old.fee_option).toUpperCase() === "C" && str(old.transaction_status).toUpperCase() === "COMPLETED") {
    throw new Error("A completed Cash In bank transfer is protected from deletion so its verified reference and balance movements remain auditable. Use a formal correction/reversal flow instead.");
  }
  const now = phDateTimePrecise();
  const changeList = [];
  const statements = [];
  if (type === "POS_SALE") {
    // Removing the log's payment reference does not erase the actual sale or its
    // already-recorded cash movements. Keep the sales row and clear only its link.
    const sale = await getBy(env, "sales", "transaction_id", str(old.sale_transaction_id));
    statements.push(env.DB.prepare("DELETE FROM gcash_transactions WHERE transaction_id=?").bind(id));
    if (sale && str(sale.payment_transaction_id) === id) {
      const nextSale = Object.assign({}, sale, { payment_transaction_id: "" });
      statements.push(env.DB.prepare("UPDATE sales SET payment_transaction_id='' WHERE transaction_id=?").bind(str(old.sale_transaction_id)));
      changeList.push(changeRecord("sales", sale, nextSale));
    }
  } else {
    const saleId = str(old.sale_transaction_id);
    const sale = saleId ? await getBy(env, "sales", "transaction_id", saleId) : null;
    if (saleId && !sale) throw new Error("The linked Sales Report transaction is missing. Restore it before removing this GCash record.");
    const allRows = sale ? await dbAll(env, "SELECT * FROM gcash_transactions WHERE sale_transaction_id=? ORDER BY rowid", saleId) : [];
    const remainingRows = allRows.filter(row => str(row.transaction_id) !== id);
    const oldContribution = gcashTransactionSaleContribution(old);
    const oldProfit = gcashTransactionServiceProfit(old);
    let afterSale = null, afterRows = [];
    if (sale) {
      const oldLines = parseItemLines(sale);
      const newLines = oldLines.filter(line => !(line && line.gcashService === true &&
        [line.gcashTransaction && line.gcashTransaction.transactionNumber, line.gcashTransaction && line.gcashTransaction.transactionId].some(value => str(value) === id)));
      afterSale = gcashTransactionUpdateSaleRow(sale, newLines, -oldContribution, -oldProfit, id, "", true);
      afterRows = remainingRows.map(row => str(row.service_type).toUpperCase() === "POS_SALE"
        ? Object.assign({}, row, { amount: n(afterSale.total) }) : {...row});
      const beforeWallet = gcashWalletDeltaForSale(sale, allRows);
      const afterWallet = gcashWalletDeltaForSale(afterSale, afterRows);
      const beforePhysical = cashManagementReportPhysicalCashDeltaForSale(sale, allRows);
      const afterPhysical = cashManagementReportPhysicalCashDeltaForSale(afterSale, afterRows);
      const balance = await applyGcashTransactionBalanceCorrection(env, [{
        saleId, walletDelta: roundMoney(afterWallet-beforeWallet),
        physicalDelta: roundMoney(afterPhysical-beforePhysical)
      }], meta, session, now, "Admin removed GCash transaction " + id);
      statements.push(...balance.statements);
      statements.push(env.DB.prepare("UPDATE sales SET items=?,total=?,profit=?,payment=?,change=?,item_details=?,payment_transaction_id=? WHERE transaction_id=?")
        .bind(afterSale.items,afterSale.total,afterSale.profit===null?null:afterSale.profit,afterSale.payment,afterSale.change,afterSale.item_details,afterSale.payment_transaction_id,saleId));
      statements.push(env.DB.prepare("UPDATE gcash_transactions SET amount=? WHERE sale_transaction_id=? AND UPPER(service_type)='POS_SALE'")
        .bind(n(afterSale.total), saleId));
      changeList.push(changeRecord("sales", sale, afterSale));
    }
    statements.push(env.DB.prepare("DELETE FROM gcash_transactions WHERE transaction_id=?").bind(id));
  }
  await env.DB.batch(statements);
  changeList.push(changeRecord("gcash_transactions", gcashTransactionForAudit(old), null));
  await audit(env, "REMOVE_GCASH_TRANSACTION", id,
    "Admin removed GCash transaction " + id + " (" + type + "), amount ₱" + n(old.amount).toFixed(2) + ", linked sale " + str(old.sale_transaction_id) + ".", meta, changeList.filter(Boolean));
  return {ok:true,transactionId:id,removed:true};
}

async function correctSale(env, data, meta) {
  const oldTx=str(data.oldTransactionId||""),old=await getBy(env,"sales","transaction_id",oldTx);
  if(!old) throw new Error("Sale transaction not found");
  const tx=str(data.transactionId||"").trim(); if(!tx) throw new Error("Transaction ID is required");
  if(tx!==oldTx&&await getBy(env,"sales","transaction_id",tx)) throw new Error("That transaction ID is already in use");
  const after=Object.assign({},old,{transaction_id:tx,payment_method:str(data.paymentMethod||"Cash"),payment_transaction_id:str(data.paymentTransactionId||""),payment:n(data.payment),change:n(data.change)});
  const keys=["transaction_id","payment_method","payment_transaction_id","payment","change"];
  const tracked=await dbFirst(env,"SELECT movement_id FROM gcash_balance_movements WHERE movement_type='POS_SALE' AND reference_id=? LIMIT 1",oldTx);
  const oldGcash=isGcashPaymentMethod(old.payment_method),newGcash=isGcashPaymentMethod(after.payment_method);
  const walletDelta=tracked&&oldGcash!==newGcash?roundMoney((newGcash?1:0)*n(old.total)-(oldGcash?1:0)*n(old.total)):0;
  const now=phDateTime(),stmts=[env.DB.prepare("UPDATE sales SET transaction_id=?,payment_method=?,payment_transaction_id=?,payment=?,change=? WHERE transaction_id=?").bind(tx,after.payment_method,after.payment_transaction_id,after.payment,after.change,oldTx)];
  if(tracked){
    stmts.push(env.DB.prepare("UPDATE gcash_balance_movements SET reference_id=? WHERE reference_id=? AND movement_type IN ('POS_SALE','POS_SALE_CORRECTION')").bind(tx,oldTx));
    stmts.push(env.DB.prepare("UPDATE gcash_transactions SET sale_transaction_id=? WHERE sale_transaction_id=?").bind(tx,oldTx));
    if(Math.abs(walletDelta)>0.0001){
      const wallet=await ensureGcashWalletBalance(env);
      if(walletDelta<0&&n(wallet.balance)+walletDelta < -0.005)throw new Error("This payment correction would make the recorded GCash wallet balance negative. Reconcile the GCash balance before continuing.");
      stmts.push(insertStmt(env,"gcash_balance_movements",gcashWalletMovementRow("CORRECT:"+makeId("GCB"),phDate(),"POS_SALE_CORRECTION",tx,"Correction to GCash payment method for POS sale "+tx,walletDelta,meta,null,now)));
      stmts.push(gcashWalletUpdateStatement(env,walletDelta,meta,null,now));
    }
    
  }
  await env.DB.batch(stmts);
  const saved=await getBy(env,"sales","transaction_id",tx);
  const changeObj={table:"sales",keyColumn:"transaction_id",keyValue:tx,before:old,after:saved,changedColumns:keys};
  await audit(env,"CORRECT_SALE",tx,"Edited payment/transaction details for "+oldTx+".",meta,[changeObj]);
  return {ok:true};
}
async function saveCustomer(env,c,meta) {
  c=c||{};const id=str(c.id||makeId("C")),old=await getBy(env,"customers","customer_id",id),dt=str(c.lastDateTime||phDateTime()),row={customer_id:id,name:str(c.name),contact:str(c.contact),utang_balance:n(c.utang),last_transaction:str(c.last||dt.slice(0,10)),last_datetime:dt};
  if(old)await updateObj(env,"customers","customer_id",id,row);else await insertObj(env,"customers",row);
  const saved=await getBy(env,"customers","customer_id",id),ch=changeRecord("customers",old,saved);
  await audit(env,old?"EDIT_CUSTOMER":"ADD_CUSTOMER",id,"Customer "+str(c.name)+" saved.",meta,ch?[ch]:[]);
  return {ok:true,customer:Object.assign({},c,{id:id})};
}
async function createCashierCustomer(env,c,session,meta) {
  if(!session||session.role!=="Cashier") throw new Error("Only Cashier accounts can use this customer-creation action.");
  c=c&&typeof c==="object"?c:{};
  const name=str(c.name||"").replace(/\s+/g," ").trim(),contact=str(c.contact||"").trim();
  if(!name)throw new Error("Customer name is required."); if(name.length>120)throw new Error("Customer name must be 120 characters or fewer."); if(contact.length>80)throw new Error("Customer contact must be 80 characters or fewer.");
  const raw=c.initialBalance===undefined||c.initialBalance===null||str(c.initialBalance).trim()===""?"0":str(c.initialBalance).trim(),amount=Number(raw);
  if(!Number.isFinite(amount)||amount<0)throw new Error("Amount owed must be a valid amount of zero or greater."); if(amount>999999999)throw new Error("Amount owed is above the allowed limit.");
  const duplicate=await dbFirst(env,"SELECT customer_id FROM customers WHERE lower(trim(name))=lower(trim(?)) AND lower(trim(COALESCE(contact,'')))=lower(trim(?)) LIMIT 1",name,contact);
  if(duplicate)throw new Error("A customer with the same name and contact is already registered. Use Customer lookup to find the existing record.");
  const id=makeId("C"),row={customer_id:id,name:name,contact:contact,utang_balance:Math.round((amount+Number.EPSILON)*100)/100,last_transaction:"",last_datetime:""};
  await insertObj(env,"customers",row);
  await audit(env,"ADD_CUSTOMER",id,"Customer "+name+" created through Cashier customer lookup; opening amount owed "+n(row.utang_balance).toFixed(2)+".",meta);
  return {ok:true,customer:{id:id,name:name,contact:contact}};
}
async function saveSupplier(env,s,meta) {
  s=s||{};const id=str(s.id||makeId("S")),old=await getBy(env,"suppliers","supplier_id",id),dt=str(s.lastDateTime||phDateTime()),row={supplier_id:id,supplier_name:str(s.name),contact:str(s.contact),products:str(s.products),last_purchase:str(s.last||dt.slice(0,10)),last_datetime:dt};
  if(old)await updateObj(env,"suppliers","supplier_id",id,row);else await insertObj(env,"suppliers",row);
  const saved=await getBy(env,"suppliers","supplier_id",id),ch=changeRecord("suppliers",old,saved);
  await audit(env,old?"EDIT_SUPPLIER":"ADD_SUPPLIER",id,"Supplier "+str(s.name)+" saved.",meta,ch?[ch]:[]);
  return {ok:true,supplier:Object.assign({},s,{id:id})};
}
async function saveCategories(env,categories,meta) {
  const unique=[];for(const x of (Array.isArray(categories)?categories:[])){const value=str(x||"").trim();if(value&&!unique.some(y=>y.toLowerCase()===value.toLowerCase()))unique.push(value);}
  const before=await dbAll(env,"SELECT * FROM categories"),stmts=before.map(r=>env.DB.prepare("DELETE FROM categories WHERE category=?").bind(r.category));
  unique.forEach(c=>stmts.push(env.DB.prepare("INSERT INTO categories(category) VALUES(?)").bind(c)));
  if(stmts.length) await env.DB.batch(stmts);
  const after=await dbAll(env,"SELECT * FROM categories");
  const changes=before.map(r=>changeRecord("categories",r,null)).filter(Boolean).concat(after.map(r=>changeRecord("categories",null,r)).filter(Boolean));
  await audit(env,"SAVE_CATEGORIES","Categories","Saved "+unique.length+" category name(s).",meta,changes);
  return {ok:true,categories:unique};
}
async function saveSettings(env, settings, meta) {
  const normalized=Object.assign({},settings||{});
  if(Object.prototype.hasOwnProperty.call(normalized,"gcashCashInBankTransferFee")) {
    const bankFee=Number(normalized.gcashCashInBankTransferFee);
    if(!Number.isFinite(bankFee)||bankFee<0||bankFee>100000) throw new Error("The configured Cash In bank transfer fee must be between ₱0 and ₱100,000.");
    normalized.gcashCashInBankTransferFee=roundMoney(bankFee).toFixed(2);
  }
  if(Object.prototype.hasOwnProperty.call(normalized,"logoImage")) {
    const raw=str(normalized.logoImage||"").trim();
    if(raw&&!/^https:\/\//i.test(raw)&&!/^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(raw)) throw new Error("The store logo must be a valid JPG, PNG, or WebP image, or an HTTPS image URL.");
    if(raw.length>900000) throw new Error("The compressed logo is still too large. Please choose a smaller image.");
    normalized.logoImage=raw;
  }
  const oldRows=await dbAll(env,"SELECT * FROM settings"),oldMap=settingObj(oldRows),changes=[];
  for(const key of Object.keys(normalized)) {
    const old=await getBy(env,"settings","key",key),row={key:key,value:str(normalized[key])};
    if(old) await updateObj(env,"settings","key",key,row); else await insertObj(env,"settings",row);
    const saved=await getBy(env,"settings","key",key),ch=changeRecord("settings",old,saved); if(ch)changes.push(ch);
  }
  await audit(env,"SAVE_SETTINGS","Settings","Updated store/application setting keys: "+Object.keys(normalized).join(", "),meta,changes);
  const branding=await publicBranding(env); return {ok:true,logoImage:branding.logoImage,branding:branding};
}


function cashManagementReportShiftDate(date, days) {
  const d = new Date(String(date) + "T12:00:00.000Z");
  if (!Number.isFinite(d.getTime())) throw new Error("Choose a valid report date.");
  d.setUTCDate(d.getUTCDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}
function cashManagementReportValidateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str(date))) throw new Error("Choose a valid report date.");
  const d = new Date(str(date) + "T00:00:00.000Z");
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== str(date)) throw new Error("Choose a valid report date.");
  return str(date);
}
async function cashManagementReportWalletAsOf(env, date) {
  const [wallet, later] = await Promise.all([
    ensureGcashWalletBalance(env),
    dbFirst(env, "SELECT COALESCE(SUM(amount_delta),0) AS total FROM gcash_balance_movements WHERE movement_date>?", date)
  ]);
  return roundMoney(n(wallet && wallet.balance) - n(later && later.total));
}
function cashManagementReportExpenseDto(row) {
  return {
    expenseId: str(row && row.expense_id),
    date: str(row && row.date),
    category: str(row && row.category || "Other"),
    description: str(row && row.description),
    amount: roundMoney(n(row && row.amount)),
    paymentSource: str(row && row.payment_source || "PHYSICAL") === "GCASH" ? "GCASH" : "PHYSICAL",
    hasReceipt: row && row.has_receipt !== undefined ? !!n(row.has_receipt) : !!str(row && row.receipt_data),
    receiptFileName: str(row && row.receipt_file_name),
    receiptContentType: str(row && row.receipt_content_type || ""),
    receiptSize: n(row && row.receipt_size),
    createdAt: str(row && row.created_at),
    createdBy: str(row && row.created_by),
    updatedAt: str(row && row.updated_at)
  };
}
function cashManagementReportExpenseForAudit(row) {
  if (!row) return row;
  const copy = { ...row };
  copy.receipt_data = str(copy.receipt_data) ? "[receipt attached]" : "";
  return copy;
}
async function listCashManagementReportExpenses(env, date) {
  date = cashManagementReportValidateDate(date || phDate());
  const rows = await dbAll(env, "SELECT expense_id,date,category,description,amount,receipt_file_name,receipt_content_type,receipt_size,created_at,created_by,updated_at,CASE WHEN receipt_data<>'' THEN 1 ELSE 0 END AS has_receipt FROM cash_management_report_expenses WHERE date=? ORDER BY created_at DESC, expense_id DESC", date);
  const expenses = await Promise.all(rows.map(async row => {
    const source = await dbFirst(env, "SELECT COALESCE(SUM(amount_delta),0) AS total_delta FROM gcash_balance_movements WHERE reference_id=? AND movement_type IN ('GCASH_EXPENSE','GCASH_EXPENSE_REVERSAL')", str(row.expense_id));
    return cashManagementReportExpenseDto({ ...row, payment_source: n(source && source.total_delta) < -0.0001 ? "GCASH" : "PHYSICAL" });
  }));
  return {
    ok: true,
    date: date,
    expenses: expenses,
    itemizedTotal: roundMoney(expenses.reduce((sum, item) => sum + n(item.amount), 0)),
    count: expenses.length
  };
}
async function saveCashManagementReportExpense(env, data, meta, session) {
  const role = str(session && session.role);
  if (role !== "Admin" && role !== "Staff") throw new Error("Only Admin or Staff accounts can add cash report expenses.");
  data = data || {};
  const date = cashManagementReportValidateDate(data.date || "");
  const category = str(data.category || "Other").trim();
  const description = str(data.description || "").trim();
  const amount = Number(data.amount);
  const paymentSource = str(data.paymentSource || "PHYSICAL").toUpperCase();
  if (!["PHYSICAL","GCASH"].includes(paymentSource)) throw new Error("Choose Physical Cash on Hand or GCash Wallet Balance as the expense source.");
  const categories = new Set(["Groceries","Supplies","Utilities","Transportation","Maintenance","Inventory / Stock","Other"]);
  if (!categories.has(category)) throw new Error("Choose a valid expense category.");
  if (!description) throw new Error("Enter an expense name or description.");
  if (description.length > 180) throw new Error("Expense description must be 180 characters or fewer.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) throw new Error("Enter an expense amount greater than zero and within the supported range.");

  const requestedId = str(data.expenseId || "").trim();
  const expenseId = requestedId || makeId("CME");
  const old = requestedId ? await getBy(env, "cash_management_report_expenses", "expense_id", requestedId) : null;
  if (requestedId && !old) throw new Error("This expense record was not found. Refresh the report and try again.");
  if (old && str(old.date) !== date) throw new Error("An expense can only be edited from its original business date.");
  const [physicalMovement, walletMovement] = await Promise.all([
    dbFirst(env, "SELECT COUNT(*) AS movement_count,COALESCE(SUM(amount_delta),0) AS total_delta FROM cash_management_report_cash_movements WHERE reference_id=? AND movement_type IN ('CASH_EXPENSE','CASH_EXPENSE_LEGACY_ADJUSTMENT','CASH_EXPENSE_REVERSAL')", expenseId),
    dbFirst(env, "SELECT COUNT(*) AS movement_count,COALESCE(SUM(amount_delta),0) AS total_delta FROM gcash_balance_movements WHERE reference_id=? AND movement_type IN ('GCASH_EXPENSE','GCASH_EXPENSE_REVERSAL')", expenseId)
  ]);
  const physicalDeltaBefore = roundMoney(n(physicalMovement && physicalMovement.total_delta));
  const walletDeltaBefore = roundMoney(n(walletMovement && walletMovement.total_delta));
  const oldSource = walletDeltaBefore < -0.0001 ? "GCASH" : "PHYSICAL";
  const sameSource = !old || oldSource === paymentSource;
  const legacyPhysicalExpense = !!old && oldSource === "PHYSICAL" && n(physicalMovement && physicalMovement.movement_count) === 0;
  let receiptData = old ? str(old.receipt_data) : "";
  let receiptFileName = old ? str(old.receipt_file_name) : "";
  let receiptContentType = old ? str(old.receipt_content_type) : "";
  let receiptSize = old ? n(old.receipt_size) : 0;
  if (data.removeReceipt === true) { receiptData = ""; receiptFileName = ""; receiptContentType = ""; receiptSize = 0; }
  if (data.receiptBase64 !== undefined && data.receiptBase64 !== null && str(data.receiptBase64) !== "") {
    const encoded = str(data.receiptBase64).trim();
    if (encoded.length > 450000) throw new Error("The compressed receipt image is too large. Please upload a smaller photo.");
    if (encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) throw new Error("The receipt image data is invalid. Please choose the image again.");
    if (str(data.receiptContentType || "image/jpeg") !== "image/jpeg") throw new Error("Receipt uploads must be a compressed JPEG image.");
    receiptData = encoded;
    receiptContentType = "image/jpeg";
    receiptFileName = str(data.receiptFileName || "receipt.jpg").replace(/[^A-Za-z0-9._ -]/g, "_").slice(0, 120) || "receipt.jpg";
    receiptSize = Math.max(0, Math.floor(encoded.length * 3 / 4) - (encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0));
  }
  const now = phDateTime();
  const who = str(meta && (meta.userName || meta.user) || session.username || "Admin");
  const whoId = str(session.id);
  const row = {
    expense_id: expenseId, date: date, category: category, description: description,
    amount: roundMoney(amount), receipt_data: receiptData, receipt_file_name: receiptFileName,
    receipt_content_type: receiptContentType, receipt_size: receiptSize,
    created_at: old ? str(old.created_at || now) : now,
    created_by: old ? str(old.created_by || who) : who,
    created_by_id: old ? str(old.created_by_id || whoId) : whoId,
    updated_at: now, updated_by: who, updated_by_id: whoId
  };
  const statements = [];
  if (old) {
    statements.push(env.DB.prepare("UPDATE cash_management_report_expenses SET category=?,description=?,amount=?,receipt_data=?,receipt_file_name=?,receipt_content_type=?,receipt_size=?,updated_at=?,updated_by=?,updated_by_id=? WHERE expense_id=?")
      .bind(row.category,row.description,row.amount,row.receipt_data,row.receipt_file_name,row.receipt_content_type,row.receipt_size,row.updated_at,row.updated_by,row.updated_by_id,expenseId));
  } else statements.push(insertStmt(env, "cash_management_report_expenses", row));

  const movementAt = phDateTimePrecise();
  // Reverse the previous source's tracked expense before applying the edited amount/source.
  if (old && !sameSource) {
    if (oldSource === "PHYSICAL" && Math.abs(physicalDeltaBefore) > 0.0001) {
      statements.push(insertStmt(env, "cash_management_report_cash_movements",
        cashManagementReportCashMovementRow(makeId("CMV"), date, "CASH_EXPENSE_REVERSAL", expenseId,
          "Reverse physical-cash expense after payment source change: " + str(old.description),
          roundMoney(-physicalDeltaBefore), meta, session, movementAt)));
    }
    if (oldSource === "GCASH" && Math.abs(walletDeltaBefore) > 0.0001) {
      statements.push(insertStmt(env, "gcash_balance_movements",
        gcashWalletMovementRow(makeId("GCB"), date, "GCASH_EXPENSE_REVERSAL", expenseId,
          "Reverse GCash wallet expense after payment source change: " + str(old.description),
          roundMoney(-walletDeltaBefore), meta, session, movementAt)));
    }
  }

  if (paymentSource === "GCASH") {
    const wallet = await ensureGcashWalletBalance(env);
    const walletDelta = old && sameSource
      ? roundMoney(-row.amount - walletDeltaBefore)
      : roundMoney(-row.amount);
    if (walletDelta < -0.0001 && n(wallet && wallet.balance) + walletDelta < -0.005)
      throw new Error("This expense would make the GCash Wallet Balance negative. Reconcile the wallet balance before saving.");
    if (Math.abs(walletDelta) > 0.0001) {
      statements.push(insertStmt(env, "gcash_balance_movements",
        gcashWalletMovementRow(makeId("GCB"), date, "GCASH_EXPENSE", expenseId,
          (old ? "Adjust" : "Record") + " GCash wallet expense: " + description,
          walletDelta, meta, session, movementAt)));
      statements.push(gcashWalletUpdateStatement(env, walletDelta, meta, session, movementAt));
    }
  } else {
    let physicalDelta;
    if (old && sameSource && legacyPhysicalExpense) {
      // Existing legacy rows were not applied to the physical cash ledger; only adjust by the edit difference.
      physicalDelta = roundMoney(n(old.amount) - row.amount);
    } else if (old && sameSource) {
      physicalDelta = roundMoney(-row.amount - physicalDeltaBefore);
    } else {
      physicalDelta = roundMoney(-row.amount);
    }
    if (Math.abs(physicalDelta) > 0.0001) {
      const type = legacyPhysicalExpense && sameSource ? "CASH_EXPENSE_LEGACY_ADJUSTMENT" : "CASH_EXPENSE";
      statements.push(insertStmt(env, "cash_management_report_cash_movements",
        cashManagementReportCashMovementRow(makeId("CMV"), date, type, expenseId,
          (old ? "Adjust" : "Record") + " physical-cash expense: " + description,
          physicalDelta, meta, session, movementAt)));
    }
  }
  await env.DB.batch(statements);
  const saved = await getBy(env, "cash_management_report_expenses", "expense_id", expenseId);
  const savedDto = cashManagementReportExpenseDto({ ...saved, payment_source: paymentSource });
  const change = changeRecord("cash_management_report_expenses", cashManagementReportExpenseForAudit(old), cashManagementReportExpenseForAudit(saved));
  await audit(env, old ? "EDIT_CASH_MANAGEMENT_EXPENSE" : "ADD_CASH_MANAGEMENT_EXPENSE", expenseId,
    (old ? "Updated" : "Added") + " expense for " + date + ": " + description + " (" + row.amount.toFixed(2) + "), paid from " + (paymentSource === "GCASH" ? "GCash Wallet" : "Physical Cash") + "." +
    (receiptData ? " Receipt attached." : " No receipt attached."), meta, change ? [change] : []);
  return { ok: true, expense: savedDto };
}
async function deleteCashManagementReportExpense(env, expenseId, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can delete cash report expenses.");
  expenseId = str(expenseId || "").trim();
  if (!expenseId) throw new Error("Select an expense record to delete.");
  const old = await getBy(env, "cash_management_report_expenses", "expense_id", expenseId);
  if (!old) throw new Error("Expense record was not found. Refresh the report and try again.");
  const [physical, wallet] = await Promise.all([
    dbFirst(env, "SELECT COALESCE(SUM(amount_delta),0) AS total_delta FROM cash_management_report_cash_movements WHERE reference_id=? AND movement_type IN ('CASH_EXPENSE','CASH_EXPENSE_LEGACY_ADJUSTMENT','CASH_EXPENSE_REVERSAL')", expenseId),
    dbFirst(env, "SELECT COALESCE(SUM(amount_delta),0) AS total_delta FROM gcash_balance_movements WHERE reference_id=? AND movement_type IN ('GCASH_EXPENSE','GCASH_EXPENSE_REVERSAL')", expenseId)
  ]);
  const physicalReversal = roundMoney(-n(physical && physical.total_delta));
  const walletReversal = roundMoney(-n(wallet && wallet.total_delta));
  const statements = [env.DB.prepare("DELETE FROM cash_management_report_expenses WHERE expense_id=?").bind(expenseId)];
  const at = phDateTimePrecise();
  if (Math.abs(physicalReversal) > 0.0001) statements.push(insertStmt(env, "cash_management_report_cash_movements",
    cashManagementReportCashMovementRow(makeId("CMV"), str(old.date), "CASH_EXPENSE_REVERSAL", expenseId,
      "Reverse deleted physical-cash expense: " + str(old.description), physicalReversal, meta, session, at)));
  if (Math.abs(walletReversal) > 0.0001) {
    const currentWallet = await ensureGcashWalletBalance(env);
    if (walletReversal < -0.0001 && n(currentWallet && currentWallet.balance) + walletReversal < -0.005)
      throw new Error("This deletion would make the GCash Wallet Balance negative. Reconcile the wallet balance before deleting the expense.");
    statements.push(insertStmt(env, "gcash_balance_movements",
      gcashWalletMovementRow(makeId("GCB"), str(old.date), "GCASH_EXPENSE_REVERSAL", expenseId,
        "Reverse deleted GCash wallet expense: " + str(old.description), walletReversal, meta, session, at)));
    statements.push(gcashWalletUpdateStatement(env, walletReversal, meta, session, at));
  }
  await env.DB.batch(statements);
  const change = changeRecord("cash_management_report_expenses", cashManagementReportExpenseForAudit(old), null);
  await audit(env, "DELETE_CASH_MANAGEMENT_EXPENSE", expenseId,
    "Deleted expense for " + str(old.date) + ": " + str(old.description) + " (" + n(old.amount).toFixed(2) + ").", meta, change ? [change] : []);
  return { ok: true, expenseId: expenseId, date: str(old.date) };
}
async function getCashManagementReportExpenseReceipt(env, expenseId, session) {
  if (!["Admin", "Staff", "Owner"].includes(str(session && session.role))) throw new Error("Only Admin, Staff, and Owner accounts can view expense receipt images.");
  expenseId = str(expenseId || "").trim();
  if (!expenseId) throw new Error("Select an expense to view its receipt.");
  const row = await getBy(env, "cash_management_report_expenses", "expense_id", expenseId);
  if (!row || !str(row.receipt_data)) throw new Error("No receipt image is attached to this expense.");
  if (str(row.receipt_content_type) !== "image/jpeg") throw new Error("The receipt image type is not supported.");
  return { ok: true, expenseId: expenseId, receiptBase64: str(row.receipt_data), receiptContentType: "image/jpeg", receiptFileName: str(row.receipt_file_name || "receipt.jpg"), receiptSize: n(row.receipt_size) };
}

async function cashManagementReportFundsAddedForDate(env, date) {
  date = cashManagementReportValidateDate(date);
  const [walletRows, physicalRows] = await Promise.all([
    dbFirst(env, "SELECT COALESCE(SUM(amount_delta),0) AS total FROM gcash_balance_movements WHERE movement_date=? AND movement_type='ADMIN_ADD_FUNDS'", date),
    dbFirst(env, "SELECT COALESCE(SUM(amount_delta),0) AS total FROM cash_management_report_cash_movements WHERE movement_date=? AND movement_type='ADMIN_ADD_FUNDS'", date)
  ]);
  return roundMoney(n(walletRows && walletRows.total) + n(physicalRows && physicalRows.total));
}

async function cashManagementReportGcashProviderFeesForDate(env,date) {
  const row=await dbFirst(env,"SELECT COALESCE(SUM(g.provider_fee),0) AS total FROM gcash_transactions g INNER JOIN sales s ON s.transaction_id=g.sale_transaction_id WHERE g.date=? AND UPPER(g.service_type) IN ('LOAD','BILLS_PAYMENT')",date);
  return roundMoney(n(row&&row.total));
}
async function cashManagementReportGcashProviderFeesByDate(env,fromDate,toDate) {
  return dbAll(env,"SELECT g.date AS report_date,COALESCE(SUM(g.provider_fee),0) AS total FROM gcash_transactions g INNER JOIN sales s ON s.transaction_id=g.sale_transaction_id WHERE g.date BETWEEN ? AND ? AND UPPER(g.service_type) IN ('LOAD','BILLS_PAYMENT') GROUP BY g.date ORDER BY report_date ASC",fromDate,toDate);
}
async function cashManagementReportGcashBankTransferFeesForDate(env,date) {
  await ensureGcashCashFlowColumns(env);
  const row=await dbFirst(env,"SELECT COALESCE(SUM(g.bank_transfer_fee),0) AS total FROM gcash_transactions g INNER JOIN sales s ON s.transaction_id=g.sale_transaction_id WHERE g.date=? AND UPPER(g.service_type)='CASH_IN' AND UPPER(g.fee_option)='C' AND UPPER(g.transaction_status)='COMPLETED'",date);
  return roundMoney(n(row&&row.total));
}
async function cashManagementReportGcashBankTransferFeesByDate(env,fromDate,toDate) {
  await ensureGcashCashFlowColumns(env);
  return dbAll(env,"SELECT g.date AS report_date,COALESCE(SUM(g.bank_transfer_fee),0) AS total FROM gcash_transactions g INNER JOIN sales s ON s.transaction_id=g.sale_transaction_id WHERE g.date BETWEEN ? AND ? AND UPPER(g.service_type)='CASH_IN' AND UPPER(g.fee_option)='C' AND UPPER(g.transaction_status)='COMPLETED' GROUP BY g.date ORDER BY report_date ASC",fromDate,toDate);
}
async function cashManagementReportGcashLoadPrincipalForDate(env,date) {
  const row=await dbFirst(env,"SELECT COALESCE(SUM(g.amount),0) AS total FROM gcash_transactions g INNER JOIN sales s ON s.transaction_id=g.sale_transaction_id WHERE g.date=? AND UPPER(g.service_type)='LOAD'",date);
  return roundMoney(n(row&&row.total));
}
async function cashManagementReportGcashLoadPrincipalByDate(env,fromDate,toDate) {
  return dbAll(env,"SELECT g.date AS report_date,COALESCE(SUM(g.amount),0) AS total FROM gcash_transactions g INNER JOIN sales s ON s.transaction_id=g.sale_transaction_id WHERE g.date BETWEEN ? AND ? AND UPPER(g.service_type)='LOAD' GROUP BY g.date ORDER BY report_date ASC",fromDate,toDate);
}
async function cashManagementReportBalanceThrough(env, targetDate) {
  targetDate = cashManagementReportValidateDate(targetDate);
  // This helper is used to get the previous day's opening total. Keep it tied
  // strictly to the real balances; do not reconstruct it by adding sales/profit
  // or subtracting costs that are already reflected in the ledgers.
  const [baseline, walletBalance, physicalCashOnHand] = await Promise.all([
    dbFirst(env, "SELECT date FROM cash_management_report_daily WHERE date<=? ORDER BY date DESC LIMIT 1", targetDate),
    cashManagementReportWalletAsOf(env, targetDate),
    cashManagementReportPhysicalCashAsOf(env, targetDate)
  ]);
  return {
    hasBaseline: !!baseline,
    totalCashOnHandNow: cashManagementReportTotalFromBalances(walletBalance, physicalCashOnHand)
  };
}

async function getCashManagementReportRecords(env, fromDate, toDate) {
  await ensureGcashCashFlowColumns(env);
  fromDate = cashManagementReportValidateDate(fromDate || phDate());
  toDate = cashManagementReportValidateDate(toDate || fromDate);
  if (fromDate > toDate) throw new Error("From Date must be on or before To Date.");
  const rangeStart = new Date(fromDate + "T00:00:00.000Z").getTime();
  const rangeEnd = new Date(toDate + "T00:00:00.000Z").getTime();
  if (!Number.isFinite(rangeStart) || !Number.isFinite(rangeEnd) || (rangeEnd - rangeStart) / 86400000 > 3660) {
    throw new Error("Choose a date range of 10 years or less.");
  }
  const previousDate = cashManagementReportShiftDate(fromDate, -1);
  const [savedRows, salesRows, expenseRows, movementRows, physicalMovementRows, walletFundingRows, physicalFundingRows, wallet, previousHistory, providerFeeRows, loadPrincipalRows, bankTransferFeeRows] = await Promise.all([
    dbAll(env, "SELECT * FROM cash_management_report_daily WHERE date BETWEEN ? AND ? ORDER BY date ASC", fromDate, toDate),
    dbAll(env, "SELECT substr(COALESCE(NULLIF(datetime,''),date),1,10) AS report_date, COALESCE(SUM(total),0) AS total FROM sales WHERE substr(COALESCE(NULLIF(datetime,''),date),1,10) BETWEEN ? AND ? GROUP BY substr(COALESCE(NULLIF(datetime,''),date),1,10) ORDER BY report_date ASC", fromDate, toDate),
    dbAll(env, "SELECT date AS report_date, COALESCE(SUM(amount),0) AS total FROM cash_management_report_expenses WHERE date BETWEEN ? AND ? GROUP BY date ORDER BY date ASC", fromDate, toDate),
    dbAll(env, "SELECT movement_date, COALESCE(SUM(amount_delta),0) AS total FROM gcash_balance_movements WHERE movement_date>=? GROUP BY movement_date ORDER BY movement_date ASC", fromDate),
    dbAll(env, "SELECT movement_id,movement_date,amount_delta,created_at FROM cash_management_report_cash_movements WHERE movement_date BETWEEN ? AND ? ORDER BY movement_date ASC,created_at ASC,movement_id ASC", fromDate, toDate),
    dbAll(env, "SELECT movement_date AS report_date, COALESCE(SUM(amount_delta),0) AS total FROM gcash_balance_movements WHERE movement_date BETWEEN ? AND ? AND movement_type='ADMIN_ADD_FUNDS' GROUP BY movement_date ORDER BY report_date ASC", fromDate, toDate),
    dbAll(env, "SELECT movement_date AS report_date, COALESCE(SUM(amount_delta),0) AS total FROM cash_management_report_cash_movements WHERE movement_date BETWEEN ? AND ? AND movement_type='ADMIN_ADD_FUNDS' GROUP BY movement_date ORDER BY report_date ASC", fromDate, toDate),
    ensureGcashWalletBalance(env),
    cashManagementReportBalanceThrough(env, previousDate),
    cashManagementReportGcashProviderFeesByDate(env, fromDate, toDate),
    cashManagementReportGcashLoadPrincipalByDate(env, fromDate, toDate),
    cashManagementReportGcashBankTransferFeesByDate(env, fromDate, toDate)
  ]);
  const savedByDate = new Map(savedRows.map(row => [str(row.date), row]));
  const salesByDate = new Map(salesRows.map(row => [str(row.report_date), roundMoney(n(row.total))]));
  const expensesByDate = new Map(expenseRows.map(row => [str(row.report_date), roundMoney(n(row.total))]));
  const providerFeesByDate = new Map(providerFeeRows.map(row => [str(row.report_date), roundMoney(n(row.total))]));
  const bankTransferFeesByDate = new Map(bankTransferFeeRows.map(row => [str(row.report_date), roundMoney(n(row.total))]));
  const fundsAddedByDate = new Map();
  for (const row of [...walletFundingRows, ...physicalFundingRows]) {
    const day = str(row.report_date);
    fundsAddedByDate.set(day, roundMoney(n(fundsAddedByDate.get(day)) + n(row.total)));
  }
  const physicalMovementsByDate = new Map();
  const physicalMovementDeltaByDate = new Map();
  for (const movement of physicalMovementRows) {
    const movementDate = str(movement.movement_date);
    const list = physicalMovementsByDate.get(movementDate) || [];
    list.push(movement);
    physicalMovementsByDate.set(movementDate, list);
    physicalMovementDeltaByDate.set(movementDate,
      roundMoney(n(physicalMovementDeltaByDate.get(movementDate)) + n(movement.amount_delta)));
  }
  const reportDates = savedRows.map(row => str(row.date)).sort().reverse();
  const movementGroups = movementRows.map(row => ({ date: str(row.movement_date), total: roundMoney(n(row.total)) }));
  const walletMovementDeltaByDate = new Map(movementGroups.map(row => [row.date, row.total]));
  let movementIndex = movementGroups.length - 1, futureMovements = 0;
  const walletByDate = new Map();
  for (const date of reportDates) {
    while (movementIndex >= 0 && movementGroups[movementIndex].date > date) {
      futureMovements = roundMoney(futureMovements + movementGroups[movementIndex].total);
      movementIndex--;
    }
    walletByDate.set(date, roundMoney(n(wallet && wallet.balance) - futureMovements));
  }
  let closing = roundMoney(n(previousHistory && previousHistory.totalCashOnHandNow));
  const recordsByDate = new Map();
  for (let date = fromDate; date <= toDate; date = cashManagementReportShiftDate(date, 1)) {
    const row = savedByDate.get(date);
    const override = row && row.fund_from_yesterday_override !== null && row.fund_from_yesterday_override !== undefined
      ? n(row.fund_from_yesterday_override) : null;
    const fundFromYesterday = override === null ? closing : roundMoney(override);
    const totalSalesToday = roundMoney(n(salesByDate.get(date)));
    const otherExpenses = roundMoney(n(row && row.total_expenses));
    const gcashProviderFees = roundMoney(n(providerFeesByDate.get(date)));
    const gcashBankTransferFees = roundMoney(n(bankTransferFeesByDate.get(date)));
    const gcashLoadPrincipal = roundMoney(n(loadPrincipalByDate.get(date)));
    const totalExpenses = roundMoney(otherExpenses + n(expensesByDate.get(date)) + gcashProviderFees);
    const manualCashAdjustment = roundMoney(n(row && row.manual_cash_adjustment));
    const fundsAdded = roundMoney(n(fundsAddedByDate.get(date)));
    const dayPhysicalMovements = physicalMovementsByDate.get(date) || [];
    const physicalCashOnHand = row
      ? roundMoney(n(row.physical_cash_on_hand) + dayPhysicalMovements.filter(m => str(m.created_at) > str(row.saved_at)).reduce((sum, m) => sum + n(m.amount_delta), 0))
      : null;
    const gcashWalletBalance = row ? roundMoney(n(walletByDate.get(date))) : null;
    // On a saved-report date, the cash snapshot is authoritative. On dates
    // without a snapshot, carry the total forward using only actual wallet and
    // physical-cash ledger movements. Profit and expense summaries are never
    // added/subtracted a second time from this combined balance.
    if (row) {
      closing = cashManagementReportTotalFromBalances(gcashWalletBalance, physicalCashOnHand);
      recordsByDate.set(date, {
        date: date,
        savedAt: str(row.saved_at),
        fundFromYesterday: fundFromYesterday,
        totalSalesToday: totalSalesToday,
        otherExpenses: otherExpenses,
        totalExpenses: totalExpenses,
        gcashProviderFees: gcashProviderFees,
        gcashBankTransferFees: gcashBankTransferFees,
        gcashLoadPrincipal: gcashLoadPrincipal,
        manualCashAdjustment: manualCashAdjustment,
        fundsAdded: fundsAdded,
        gcashWalletBalance: gcashWalletBalance,
        physicalCashOnHand: physicalCashOnHand,
        totalCashOnHandNow: cashManagementReportTotalFromBalances(gcashWalletBalance, physicalCashOnHand)
      });
    } else {
      closing = roundMoney(closing + n(walletMovementDeltaByDate.get(date)) + n(physicalMovementDeltaByDate.get(date)));
    }
  }
  const records = reportDates.map(date => recordsByDate.get(date)).filter(Boolean);
  const truncated = records.length > 500;
  return { ok: true, fromDate: fromDate, toDate: toDate, records: records.slice(0, 500), truncated: truncated, totalRecords: records.length };
}

async function cashManagementReportPhysicalCashAsOf(env, targetDate) {
  targetDate = cashManagementReportValidateDate(targetDate);
  const baseline = await dbFirst(env,
    "SELECT date,physical_cash_on_hand,saved_at FROM cash_management_report_daily WHERE date<=? ORDER BY date DESC LIMIT 1",
    targetDate);
  const baselineDate = baseline ? str(baseline.date) : "0000-01-01";
  const baselineSavedAt = baseline ? str(baseline.saved_at) : "";
  const movement = await dbFirst(env,
    "SELECT COALESCE(SUM(amount_delta),0) AS total FROM cash_management_report_cash_movements WHERE movement_date<=? AND (movement_date>? OR (movement_date=? AND created_at>?))",
    targetDate, baselineDate, baselineDate, baselineSavedAt);
  return roundMoney((baseline ? n(baseline.physical_cash_on_hand) : 0) + n(movement && movement.total));
}

async function listCashManagementFundMovements(env, date) {
  date = cashManagementReportValidateDate(date);
  const [walletRows, physicalRows] = await Promise.all([
    dbAll(env, "SELECT movement_id,movement_date,reference_id,description,amount_delta,created_at,created_by FROM gcash_balance_movements WHERE movement_date=? AND movement_type='ADMIN_ADD_FUNDS' ORDER BY created_at DESC,movement_id DESC", date),
    dbAll(env, "SELECT movement_id,movement_date,reference_id,description,amount_delta,created_at,created_by FROM cash_management_report_cash_movements WHERE movement_date=? AND movement_type='ADMIN_ADD_FUNDS' ORDER BY created_at DESC,movement_id DESC", date)
  ]);
  const mapFund = (row, destination) => { const description = str(row.description); const fundName = description.startsWith("Fund source: ") ? description.slice(13).split(" | ")[0] : ""; return {fundId:str(row.reference_id||row.movement_id),date:str(row.movement_date),destination:destination,amount:roundMoney(n(row.amount_delta)),description:description,fundName:fundName,source:fundName,createdAt:str(row.created_at),createdBy:str(row.created_by)}; };
  return [
    ...walletRows.map(row => mapFund(row, "GCASH")),
    ...physicalRows.map(row => mapFund(row, "PHYSICAL"))
  ].sort((a,b)=>str(b.createdAt).localeCompare(str(a.createdAt)));
}

async function getCashManagementReport(env, date, session) {
  await ensureGcashCashFlowColumns(env);
  date = cashManagementReportValidateDate(date || phDate());
  const [row, previous, sales, itemizedExpenseTotal, gcashProviderFees, gcashLoadPrincipal, gcashBankTransferFees] = await Promise.all([
    dbFirst(env, "SELECT * FROM cash_management_report_daily WHERE date=? LIMIT 1", date),
    dbFirst(env, "SELECT * FROM cash_management_report_daily WHERE date<? ORDER BY date DESC LIMIT 1", date),
    dbFirst(env, "SELECT COALESCE(SUM(total),0) AS total FROM sales WHERE substr(COALESCE(NULLIF(datetime,''),date),1,10)=?", date),
    dbFirst(env, "SELECT COALESCE(SUM(amount),0) AS total FROM cash_management_report_expenses WHERE date=?", date),
    cashManagementReportGcashProviderFeesForDate(env, date),
    cashManagementReportGcashLoadPrincipalForDate(env, date),
    cashManagementReportGcashBankTransferFeesForDate(env, date)
  ]);
  const [walletBalance, previousHistory, physicalCashOnHand, fundsAdded, fundMovements] = await Promise.all([
    cashManagementReportWalletAsOf(env, date),
    cashManagementReportBalanceThrough(env, cashManagementReportShiftDate(date, -1)),
    cashManagementReportPhysicalCashAsOf(env, date),
    cashManagementReportFundsAddedForDate(env, date),
    session && session.role === "Admin" ? listCashManagementFundMovements(env, date) : Promise.resolve([])
  ]);
  const override = row && row.fund_from_yesterday_override !== null && row.fund_from_yesterday_override !== undefined
    ? n(row.fund_from_yesterday_override) : null;
  const fundFromYesterday = override === null ? previousHistory.totalCashOnHandNow : override;
  const totalSalesToday = roundMoney(n(sales && sales.total));
  const otherExpenses = roundMoney(n(row && row.total_expenses));
  const providerFeeTotal = roundMoney(n(gcashProviderFees && gcashProviderFees.total));
  const loadPrincipalTotal = roundMoney(n(gcashLoadPrincipal));
  const bankTransferFeeTotal = roundMoney(n(gcashBankTransferFees));
  const totalExpenses = roundMoney(otherExpenses + n(itemizedExpenseTotal && itemizedExpenseTotal.total) + providerFeeTotal);
  const manualCashAdjustment = roundMoney(n(row && row.manual_cash_adjustment));
  return {
    ok: true, date: date, hasSavedRecord: !!row, savedAt: str(row && row.saved_at),
    fundFromYesterday: roundMoney(fundFromYesterday),
    totalSalesToday: totalSalesToday,
    otherExpenses: otherExpenses,
    totalExpenses: totalExpenses,
    gcashProviderFees: providerFeeTotal,
    gcashBankTransferFees: bankTransferFeeTotal,
    gcashLoadPrincipal: loadPrincipalTotal,
    manualCashAdjustment: manualCashAdjustment,
    fundsAdded: fundsAdded,
    fundMovements: fundMovements,
    gcashWalletBalance: walletBalance,
    physicalCashOnHand: physicalCashOnHand,
    totalCashOnHandNow: cashManagementReportTotalFromBalances(walletBalance, physicalCashOnHand),
    canEdit: !!(session && session.role === "Admin")
  };
}

async function saveCashManagementReport(env, data, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can edit the Cash Management Report.");
  data = data || {};
  const date = cashManagementReportValidateDate(data.date || "");
  const fund = Number(data.fundFromYesterday), expenses = Number(data.otherExpenses !== undefined ? data.otherExpenses : data.totalExpenses);
  const adjustment = Number(data.manualCashAdjustment), desiredWallet = Number(data.gcashWalletBalance);
  const physical = Number(data.physicalCashOnHand);
  if (![fund, expenses, adjustment, desiredWallet, physical].every(Number.isFinite)) throw new Error("Enter valid amounts in all editable fields.");
  if (fund < 0 || expenses < 0 || desiredWallet < 0 || physical < 0) throw new Error("Fund from Yesterday, expenses, GCash Wallet Balance, and Physical Cash must be zero or greater.");
  if ([fund, expenses, adjustment, desiredWallet, physical].some(v => Math.abs(v) > 1000000000)) throw new Error("Amounts must be within the supported range.");
  const [old, wallet] = await Promise.all([
    dbFirst(env, "SELECT * FROM cash_management_report_daily WHERE date=? LIMIT 1", date),
    ensureGcashWalletBalance(env)
  ]);
  const previousHistory = await cashManagementReportBalanceThrough(env, cashManagementReportShiftDate(date, -1));
  const automaticFund = roundMoney(previousHistory.totalCashOnHandNow);
  const fundOverride = previousHistory.hasBaseline && Math.abs(roundMoney(fund) - automaticFund) < 0.005 ? null : roundMoney(fund);
  const currentWalletAsOfDate = await cashManagementReportWalletAsOf(env, date);
  const walletDelta = roundMoney(desiredWallet - currentWalletAsOfDate);
  if (walletDelta < 0 && n(wallet && wallet.balance) + walletDelta < -0.005) {
    throw new Error("This historical GCash adjustment would make the current GCash wallet balance negative. Check the date and balance.");
  }
  const priorAdjustment = roundMoney(n(old && old.manual_cash_adjustment));
  const priorOtherExpenses = roundMoney(n(old && old.total_expenses));
  // Manual adjustments increase/decrease physical cash by their change. Changes
  // to the non-itemized expense field reduce/increase physical cash by their
  // change. This makes those entries affect a real balance rather than being
  // added a second time to the combined total.
  const physicalCashDelta = roundMoney((adjustment - priorAdjustment) - (expenses - priorOtherExpenses));
  const adjustedPhysicalCash = roundMoney(physical + physicalCashDelta);
  if (adjustedPhysicalCash < -0.005) {
    throw new Error("The Manual Cash Adjustment and expense changes would make Physical Cash On Hand negative. Review the amounts before saving.");
  }
  const now = phDateTimePrecise();
  const who = str(meta && (meta.userName || meta.user) || session.username || "Admin"), whoId = str(session.id);
  const row = {
    date: date, fund_from_yesterday_override: fundOverride,
    total_expenses: roundMoney(expenses), manual_cash_adjustment: roundMoney(adjustment),
    physical_cash_on_hand: Math.max(0, adjustedPhysicalCash), saved_by: who, saved_by_id: whoId, saved_at: now
  };
  const stmts = [];
  if (Math.abs(walletDelta) > 0.0001) {
    const movement = gcashWalletMovementRow(
      makeId("GCB"), date, "REPORT_MANUAL_ADJUSTMENT", "REPORT:" + date + ":" + makeId("CMR"),
      "Admin adjusted GCash Wallet Balance in Cash Management Report for " + date,
      walletDelta, meta, session, now
    );
    stmts.push(insertStmt(env, "gcash_balance_movements", movement));
    stmts.push(gcashWalletUpdateStatement(env, walletDelta, meta, session, now));
  }
  stmts.push(env.DB.prepare(
    "INSERT INTO cash_management_report_daily(date,fund_from_yesterday_override,total_expenses,manual_cash_adjustment,physical_cash_on_hand,saved_by,saved_by_id,saved_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(date) DO UPDATE SET fund_from_yesterday_override=excluded.fund_from_yesterday_override,total_expenses=excluded.total_expenses,manual_cash_adjustment=excluded.manual_cash_adjustment,physical_cash_on_hand=excluded.physical_cash_on_hand,saved_by=excluded.saved_by,saved_by_id=excluded.saved_by_id,saved_at=excluded.saved_at"
  ).bind(date, fundOverride, row.total_expenses, row.manual_cash_adjustment, row.physical_cash_on_hand, who, whoId, now));
  await env.DB.batch(stmts);
  const saved = await getBy(env, "cash_management_report_daily", "date", date);
  const change = changeRecord("cash_management_report_daily", old, saved);
  await audit(env, "SAVE_CASH_MANAGEMENT_REPORT", date,
    "Saved daily cash report. Expenses " + expenses.toFixed(2) + ", manual cash adjustment " + adjustment.toFixed(2) +
    ", physical cash " + physical.toFixed(2) + ", GCash wallet balance " + desiredWallet.toFixed(2) + ".", meta, change ? [change] : []);
  return await getCashManagementReport(env, date, session);
}

async function addCashManagementFunds(env, data, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can add funds to Cash Management balances.");
  data = data || {};
  const date = cashManagementReportValidateDate(data.date || "");
  const destination = str(data.destination || "").toUpperCase();
  const fundName = str(data.fundName || data.source || "").trim().slice(0, 120);
  const amount = Number(data.amount);
  if (!fundName) throw new Error("Enter the fund name or where the funds came from.");
  if (!["GCASH", "PHYSICAL"].includes(destination)) throw new Error("Choose GCash Wallet Balance or Physical Cash on Hand.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) throw new Error("Enter a fund amount greater than ₱0 and within the supported range.");
  const delta = roundMoney(amount), now = phDateTimePrecise(), reference = makeId("FUND");
  if (destination === "GCASH") {
    const wallet = await ensureGcashWalletBalance(env);
    if (n(wallet && wallet.balance) + delta > 1000000000) throw new Error("The resulting GCash Wallet Balance exceeds the supported range.");
    const movement = gcashWalletMovementRow(makeId("GCB"), date, "ADMIN_ADD_FUNDS", reference,
      "Fund source: " + fundName + " | Admin added ₱" + delta.toFixed(2) + " to GCash Wallet Balance for " + date, delta, meta, session, now);
    await env.DB.batch([
      insertStmt(env, "gcash_balance_movements", movement),
      gcashWalletUpdateStatement(env, delta, meta, session, now)
    ]);
  } else {
    const movement = cashManagementReportCashMovementRow(makeId("PHF"), date, "ADMIN_ADD_FUNDS", reference,
      "Fund source: " + fundName + " | Admin added ₱" + delta.toFixed(2) + " to Physical Cash on Hand for " + date, delta, meta, session, now);
    await env.DB.batch([insertStmt(env, "cash_management_report_cash_movements", movement)]);
  }
  await audit(env, "ADD_CASH_MANAGEMENT_FUNDS", reference,
    "Fund source: " + fundName + ". Admin added ₱" + delta.toFixed(2) + " to " + (destination === "GCASH" ? "GCash Wallet Balance" : "Physical Cash on Hand") + " for business date " + date + ".", meta, []);
  return await getCashManagementReport(env, date, session);
}

async function findCashManagementFundMovement(env, fundId) {
  fundId = str(fundId || "").trim();
  if (!fundId) throw new Error("Select a fund record to edit or remove.");
  const [walletRow, physicalRow] = await Promise.all([
    dbFirst(env, "SELECT * FROM gcash_balance_movements WHERE reference_id=? AND movement_type='ADMIN_ADD_FUNDS' LIMIT 1", fundId),
    dbFirst(env, "SELECT * FROM cash_management_report_cash_movements WHERE reference_id=? AND movement_type='ADMIN_ADD_FUNDS' LIMIT 1", fundId)
  ]);
  if (walletRow && physicalRow) throw new Error("This fund record appears in both cash ledgers. Please contact support before editing it.");
  const row = walletRow || physicalRow;
  if (!row) throw new Error("Fund record was not found. Refresh the selected date and try again.");
  return {fundId:fundId, destination:walletRow ? "GCASH" : "PHYSICAL", row:row};
}

async function editCashManagementFunds(env, data, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can edit Cash Management fund records.");
  data = data || {};
  const old = await findCashManagementFundMovement(env, data.fundId);
  const date = cashManagementReportValidateDate(data.date || old.row.movement_date);
  const destination = str(data.destination || "").toUpperCase();
  const fundName = str(data.fundName || data.source || "").trim().slice(0, 120);
  const amount = Number(data.amount);
  if (!fundName) throw new Error("Enter the fund name or where the funds came from.");
  if (!["GCASH", "PHYSICAL"].includes(destination)) throw new Error("Choose GCash Wallet Balance or Physical Cash on Hand.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) throw new Error("Enter a fund amount greater than ₱0 and within the supported range.");
  const nextAmount = roundMoney(amount), oldAmount = roundMoney(n(old.row.amount_delta));
  const walletDelta = old.destination === "GCASH" ? (destination === "GCASH" ? roundMoney(nextAmount-oldAmount) : -oldAmount) : (destination === "GCASH" ? nextAmount : 0);
  const now = phDateTimePrecise(), statements = [];
  if (Math.abs(walletDelta) > 0.0001) {
    const wallet = await ensureGcashWalletBalance(env);
    const resultingBalance = roundMoney(n(wallet && wallet.balance) + walletDelta);
    if (resultingBalance < -0.005) throw new Error("This edit would make the current GCash wallet balance negative. Reconcile funds already used before reducing or moving this entry.");
    if (resultingBalance > 1000000000) throw new Error("The resulting GCash wallet balance exceeds the supported range.");
  }
  const description = "Fund source: " + fundName + " | Admin fund entry: ₱" + nextAmount.toFixed(2) + " to " + (destination === "GCASH" ? "GCash Wallet Balance" : "Physical Cash on Hand") + " for " + date;
  if (old.destination === destination) {
    const table = destination === "GCASH" ? "gcash_balance_movements" : "cash_management_report_cash_movements";
    statements.push(env.DB.prepare("UPDATE " + table + " SET movement_date=?,description=?,amount_delta=? WHERE movement_id=? AND movement_type='ADMIN_ADD_FUNDS'").bind(date, description, nextAmount, str(old.row.movement_id)));
  } else {
    const oldTable = old.destination === "GCASH" ? "gcash_balance_movements" : "cash_management_report_cash_movements";
    statements.push(env.DB.prepare("DELETE FROM " + oldTable + " WHERE movement_id=? AND movement_type='ADMIN_ADD_FUNDS'").bind(str(old.row.movement_id)));
    const newRow = destination === "GCASH"
      ? gcashWalletMovementRow(makeId("GCB"), date, "ADMIN_ADD_FUNDS", old.fundId, description, nextAmount, meta, session, now)
      : cashManagementReportCashMovementRow(makeId("PHF"), date, "ADMIN_ADD_FUNDS", old.fundId, description, nextAmount, meta, session, now);
    statements.push(insertStmt(env, destination === "GCASH" ? "gcash_balance_movements" : "cash_management_report_cash_movements", newRow));
  }
  if (Math.abs(walletDelta) > 0.0001) statements.push(gcashWalletUpdateStatement(env, walletDelta, meta, session, now));
  await env.DB.batch(statements);
  await audit(env, "EDIT_CASH_MANAGEMENT_FUND", old.fundId,
    "Edited cash fund entry from " + old.destination + " ₱" + oldAmount.toFixed(2) + " on " + str(old.row.movement_date) + " to " + destination + " ₱" + nextAmount.toFixed(2) + " on " + date + ".", meta, []);
  return {ok:true, fundId:old.fundId, date:date, report:await getCashManagementReport(env, date, session)};
}

async function deleteCashManagementFunds(env, data, meta, session) {
  if (str(session && session.role) !== "Admin") throw new Error("Only Admin accounts can remove Cash Management fund records.");
  data = data || {};
  const old = await findCashManagementFundMovement(env, data.fundId);
  const date = str(old.row.movement_date);
  const amount = roundMoney(n(old.row.amount_delta)), now = phDateTimePrecise(), statements = [];
  if (old.destination === "GCASH") {
    const wallet = await ensureGcashWalletBalance(env);
    if (roundMoney(n(wallet && wallet.balance) - amount) < -0.005) throw new Error("This GCash fund entry appears to have already been used. Reconcile the wallet before removing it, so the balance does not become negative.");
    statements.push(env.DB.prepare("DELETE FROM gcash_balance_movements WHERE movement_id=? AND movement_type='ADMIN_ADD_FUNDS'").bind(str(old.row.movement_id)));
    statements.push(gcashWalletUpdateStatement(env, -amount, meta, session, now));
  } else {
    statements.push(env.DB.prepare("DELETE FROM cash_management_report_cash_movements WHERE movement_id=? AND movement_type='ADMIN_ADD_FUNDS'").bind(str(old.row.movement_id)));
  }
  await env.DB.batch(statements);
  await audit(env, "DELETE_CASH_MANAGEMENT_FUND", old.fundId,
    "Removed cash fund entry of ₱" + amount.toFixed(2) + " from " + old.destination + " for " + date + ".", meta, []);
  return {ok:true, fundId:old.fundId, date:date};
}

async function saveReconciliation(env,r,meta) {
  r=r||{};const date=str(r.date||"");if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("A valid reconciliation date is required.");
  const old=await getBy(env,"cash_reconciliation","date",date),row={date:date,expected_cash_sales:n(r.expected),opening_float:n(r.opening),cash_expenses:n(r.expenses),actual_counted:n(r.actual),notes:str(r.notes),saved_at:str(r.savedAt||phDateTime())};
  if(old)await updateObj(env,"cash_reconciliation","date",date,row);else await insertObj(env,"cash_reconciliation",row);
  const saved=await getBy(env,"cash_reconciliation","date",date),ch=changeRecord("cash_reconciliation",old,saved);
  await audit(env,"SAVE_CASH_RECONCILIATION",date,"Saved cash reconciliation; actual counted "+n(r.actual).toFixed(2)+".",meta,ch?[ch]:[]);
  return {ok:true};
}


async function editCashReconciliationRecord(env,r,meta,session) {
  if(str(session.role)!=="Admin")throw new Error("Only an Admin can edit saved Cash Reconciliation records.");
  r=r||{};const date=str(r.date||"");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("A valid reconciliation date is required.");
  const expected=Number(r.expected),actual=Number(r.actual),opening=Number(r.opening),expenses=Number(r.expenses);
  if(![expected,actual,opening,expenses].every(v=>Number.isFinite(v)&&v>=0))throw new Error("All reconciliation amounts must be valid non-negative amounts.");
  const old=await getBy(env,"cash_reconciliation","date",date);
  if(!old)throw new Error("The selected saved reconciliation no longer exists. Refresh the records and try again.");
  const row={date:date,expected_cash_sales:expected,opening_float:opening,cash_expenses:expenses,actual_counted:actual,notes:str(r.notes||""),saved_at:phDateTime()};
  await updateObj(env,"cash_reconciliation","date",date,row);
  const saved=await getBy(env,"cash_reconciliation","date",date),ch=changeRecord("cash_reconciliation",old,saved);
  await audit(env,"EDIT_CASH_RECONCILIATION",date,"Administrator edited a saved cash reconciliation; actual counted "+actual.toFixed(2)+".",meta,ch?[ch]:[]);
  return {ok:true,reconciliation:{date:date,expected:expected,actual:actual,opening:opening,expenses:expenses,notes:row.notes,savedAt:saved.saved_at}};
}
async function deleteCashReconciliationRecord(env,dateValue,meta,session) {
  if(str(session.role)!=="Admin")throw new Error("Only an Admin can remove saved Cash Reconciliation records.");
  const date=str(dateValue||"");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("A valid reconciliation date is required.");
  const old=await getBy(env,"cash_reconciliation","date",date);
  if(!old)throw new Error("The selected saved reconciliation no longer exists. Refresh the records and try again.");
  const ch=changeRecord("cash_reconciliation",old,null);
  await deleteBy(env,"cash_reconciliation","date",date);
  await audit(env,"DELETE_CASH_RECONCILIATION",date,"Administrator removed a saved cash reconciliation. Its before-values are retained in the audit history.",meta,ch?[ch]:[]);
  return {ok:true,date:date};
}

function tableFromSheetName(sheet) {
  const m={"Products":"products","Sales":"sales","Customers":"customers","Suppliers":"suppliers","Categories":"categories","Settings":"settings","Trash":"trash","Trash_Requests":"trash_requests","Cash_Reconciliation":"cash_reconciliation","Stock_Movement":"stock_movement"};
  return m[str(sheet)]||"";
}
function normalizeHistoryChange(raw) {
  if(raw&&TABLES[raw.table]&&raw.keyColumn) return raw;
  if(!raw||!raw.sheet) return null;
  const table=tableFromSheetName(raw.sheet);
  if(!table) return null;
  const map=HEADERS[table]||{};
  if(!raw.keyHeader) return {unsupported:true,sheet:raw.sheet,reason:"This historical stock-movement snapshot has no stable key and cannot be safely reversed after migration."};
  const keyColumn=map[str(raw.keyHeader)];
  if(!keyColumn||!TABLES[table].pk) return {unsupported:true,sheet:raw.sheet,reason:"This legacy change has no stable database key and cannot be safely reversed."};
  const before=raw.before?fromLegacy(table,raw.before):null;
  const after=raw.after?fromLegacy(table,raw.after):null;
  let keyValue=raw.keyValue;
  if(keyValue===undefined||keyValue===null||keyValue==="") keyValue=(after||before||{})[keyColumn];
  const changedColumns=(Array.isArray(raw.changedHeaders)?raw.changedHeaders:[]).map(h=>map[h]).filter(Boolean);
  return {table:table,keyColumn:keyColumn,keyValue:keyValue,before:before,after:after,changedColumns:changedColumns.length?changedColumns:[...new Set(Object.keys(before||{}).concat(Object.keys(after||{})))].filter(k=>(before||{})[k] !== (after||{})[k])};
}
function sameValue(a,b) {
  if(a&&typeof a==="object"&&a.$historyDate) a=a.$historyDate;
  if(b&&typeof b==="object"&&b.$historyDate) b=b.$historyDate;
  if(a===undefined||a===null) a=null;
  if(b===undefined||b===null) b=null;
  return JSON.stringify(a)===JSON.stringify(b);
}
function sameRowForColumns(actual, expected, cols) {
  if(!actual||!expected) return actual===expected;
  const fields=cols&&cols.length?cols:Object.keys(expected);
  return fields.every(k=>sameValue(actual[k],expected[k]));
}
async function getChangeList(env, history) {
  let raw=[];try{raw=JSON.parse(str(history.changes_json||"[]"));}catch(_){throw new Error("The saved rollback details could not be read.");}
  if(!Array.isArray(raw)||!raw.length)throw new Error("This activity has no saved before/after data and cannot be reverted.");
  return raw.map(normalizeHistoryChange);
}
async function preflightRollback(env, historyEntries) {
  const operations=[];
  historyEntries.forEach(h=>{
    const list=Array.isArray(h.changes)?h.changes:[];
    for(let i=list.length-1;i>=0;i--) {
      const c=list[i];
      if(!c) continue;
      if(c.unsupported) throw new Error(c.reason);
      operations.push(c);
    }
  });
  const virtual=new Map();
  const readVirtual=async c=>{
    const key=c.table+"|"+c.keyColumn+"|"+str(c.keyValue);
    if(!virtual.has(key)) virtual.set(key,await getBy(env,c.table,c.keyColumn,c.keyValue));
    return {key:key,row:virtual.get(key)};
  };
  for(const c of operations) {
    const found=await readVirtual(c),cur=found.row,before=c.before||null,after=c.after||null,cols=c.changedColumns||[];
    if(!before&&after) {
      if(!cur||!sameRowForColumns(cur,after,Object.keys(after))) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" has changed since the selected action.");
      virtual.set(found.key,null);
    } else if(before&&!after) {
      if(cur) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" now exists and would be overwritten.");
      virtual.set(found.key,before);
    } else if(before&&after) {
      if(!cur) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" could not be found.");
      if(!sameRowForColumns(cur,after,cols)) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" has a later change to one or more fields.");
      const restored=Object.assign({},cur);
      cols.forEach(k=>{restored[k]=before[k]===undefined?null:before[k];});
      virtual.set(found.key,restored);
    } else {
      throw new Error("This saved change has no reversible before/after state.");
    }
  }
  return operations;
}
async function applyHistoryChange(env, c) {
  if(!c||c.unsupported) throw new Error(c&&c.reason||"This saved change cannot be reversed.");
  const def=TABLES[c.table];if(!def||!def.pk||c.keyColumn!==def.pk) throw new Error("Rollback stopped safely: unsupported key configuration.");
  const current=await getBy(env,c.table,c.keyColumn,c.keyValue),before=c.before||null,after=c.after||null,cols=c.changedColumns||[];
  if(!before&&after) {
    if(!current||!sameRowForColumns(current,after,Object.keys(after))) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" has changed.");
    await deleteBy(env,c.table,c.keyColumn,c.keyValue);return;
  }
  if(before&&!after) {
    if(current) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" already exists.");
    await insertObj(env,c.table,before);return;
  }
  if(before&&after) {
    if(!current) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" is missing.");
    if(!sameRowForColumns(current,after,cols)) throw new Error("Rollback stopped safely: "+c.table+" record "+str(c.keyValue)+" has a later change to one or more fields.");
    const updates={};cols.forEach(k=>{if(def.cols.includes(k))updates[k]=before[k]===undefined?null:before[k];});
    await updateObj(env,c.table,c.keyColumn,c.keyValue,updates);return;
  }
  throw new Error("This saved change cannot be reversed.");
}
async function prepareActivityUndoCashLedger(env, history, changes, logId, meta) {
  const action = str(history && history.action);
  let sourceMovementId = "";
  let reportAdjustment = false;
  let transactionId = "";
  if (action === "SALE_RECORDED") {
    const saleChange = changes.find(c => c && c.table === "sales" && !c.before && c.after);
    transactionId = str(saleChange && saleChange.after && saleChange.after.transaction_id || history.record);
    if (transactionId) sourceMovementId = "SALE:" + transactionId;
  } else if (action === "MOVE_TO_TRASH") {
    const saleChange = changes.find(c => c && c.table === "sales" && c.before && !c.after);
    const trashChange = changes.find(c => c && c.table === "trash" && c.after);
    transactionId = str(saleChange && saleChange.before && saleChange.before.transaction_id || history.record);
    const trashId = str(trashChange && trashChange.after && trashChange.after.trash_id);
    if (transactionId && trashId) sourceMovementId = "TRASH:" + trashId;
  } else if (action === "RESTORE_FROM_TRASH") {
    const saleChange = changes.find(c => c && c.table === "sales" && !c.before && c.after);
    const trashChange = changes.find(c => c && c.table === "trash" && c.before && !c.after);
    transactionId = str(saleChange && saleChange.after && saleChange.after.transaction_id || history.record);
    const trashId = str(trashChange && trashChange.before && trashChange.before.trash_id);
    if (transactionId && trashId) sourceMovementId = "RESTORE:" + trashId;
  }

  let walletSource = null, physicalSource = null, walletMovementDate = phDate();
  if (action === "SAVE_CASH_MANAGEMENT_REPORT") {
    const reportChange = changes.find(c => c && c.table === "cash_management_report_daily" && c.after);
    const reportRow = reportChange && reportChange.after;
    if (reportRow && str(reportRow.date) && str(reportRow.saved_at)) {
      walletSource = await dbFirst(env,
        "SELECT * FROM gcash_balance_movements WHERE movement_type='REPORT_MANUAL_ADJUSTMENT' AND movement_date=? AND created_at=? ORDER BY rowid DESC LIMIT 1",
        str(reportRow.date), str(reportRow.saved_at));
      if (walletSource) {
        reportAdjustment = true;
        walletMovementDate = str(walletSource.movement_date || reportRow.date);
      }
    }
  } else if (sourceMovementId) {
    [walletSource, physicalSource] = await Promise.all([
      dbFirst(env, "SELECT * FROM gcash_balance_movements WHERE movement_id=? LIMIT 1", sourceMovementId),
      dbFirst(env, "SELECT * FROM cash_management_report_cash_movements WHERE movement_id=? LIMIT 1", sourceMovementId)
    ]);
  }

  const plan = {
    logId: str(logId),
    action: action,
    transactionId: transactionId,
    wallet: null,
    physical: null,
    hasEffects: false
  };
  const walletMovementId = "UNDO:" + str(logId);
  if (walletSource) {
    const reverseDelta = roundMoney(-n(walletSource.amount_delta));
    const existing = await getBy(env, "gcash_balance_movements", "movement_id", walletMovementId);
    if (Math.abs(reverseDelta) > 0.0001 && !existing) {
      const wallet = await ensureGcashWalletBalance(env);
      if (reverseDelta < 0 && n(wallet && wallet.balance) + reverseDelta < -0.005) {
        throw new Error("Undo stopped safely because reversing this activity would make the recorded GCash wallet balance negative. Reconcile the wallet balance first, then retry.");
      }
      plan.wallet = {
        movementId: walletMovementId,
        movementDate: reportAdjustment ? walletMovementDate : phDate(),
        movementType: reportAdjustment ? "REPORT_MANUAL_ADJUSTMENT_REVERSAL" : "SALE_REVERSAL",
        referenceId: str(walletSource.reference_id || transactionId || logId),
        description: reportAdjustment
          ? "Reverse GCash Wallet Balance adjustment after undoing Cash Management Report save for " + str(walletSource.movement_date)
          : "Reverse GCash wallet effect after undoing Activity Log action " + action + " (" + str(transactionId || logId) + ")",
        amountDelta: reverseDelta
      };
      plan.hasEffects = true;
    } else if (existing) {
      plan.hasEffects = true;
    }
  }
  const physicalMovementId = "UNDO:" + str(logId);
  if (physicalSource) {
    const reverseDelta = roundMoney(-n(physicalSource.amount_delta));
    const existing = await getBy(env, "cash_management_report_cash_movements", "movement_id", physicalMovementId);
    if (Math.abs(reverseDelta) > 0.0001 && !existing) {
      plan.physical = {
        movementId: physicalMovementId,
        movementDate: phDate(),
        movementType: "SALE_REVERSAL_CASH",
        referenceId: str(physicalSource.reference_id || transactionId || logId),
        description: "Reverse physical-cash effect after undoing Activity Log action " + action + " (" + str(transactionId || logId) + ")",
        amountDelta: reverseDelta
      };
      plan.hasEffects = true;
    } else if (existing) {
      plan.hasEffects = true;
    }
  }
  return plan;
}
async function applyActivityUndoCashLedger(env, plan, meta) {
  if (!plan) return;
  const now = phDateTimePrecise(), stmts = [];
  if (plan.wallet) {
    stmts.push(insertStmt(env, "gcash_balance_movements",
      gcashWalletMovementRow(plan.wallet.movementId, plan.wallet.movementDate, plan.wallet.movementType,
        plan.wallet.referenceId, plan.wallet.description, plan.wallet.amountDelta, meta, null, now)));
    stmts.push(gcashWalletUpdateStatement(env, plan.wallet.amountDelta, meta, null, now));
  }
  if (plan.physical) {
    stmts.push(insertStmt(env, "cash_management_report_cash_movements",
      cashManagementReportCashMovementRow(plan.physical.movementId, plan.physical.movementDate, plan.physical.movementType,
        plan.physical.referenceId, plan.physical.description, plan.physical.amountDelta, meta, null, now)));
  }
  if (stmts.length) await env.DB.batch(stmts);
}
async function revertActivityLog(env, logId, meta) {
  const history = await dbFirst(env, "SELECT * FROM change_history WHERE log_id=? AND status='Available' ORDER BY rowid DESC LIMIT 1", str(logId));
  if (!history) throw new Error("This activity has no saved rollback snapshot. Only changes recorded after this rollback feature was installed can be reverted.");
  const changes = await getChangeList(env, history);
  await preflightRollback(env, [{ changes: changes }]);
  const cashLedgerPlan = await prepareActivityUndoCashLedger(env, history, changes, logId, meta);
  for (let i = changes.length - 1; i >= 0; i--) await applyHistoryChange(env, changes[i]);
  await applyActivityUndoCashLedger(env, cashLedgerPlan, meta);
  await updateObj(env, "change_history", "history_id", history.history_id, {
    status: "Rolled Back", rolled_back_by: str(meta.userName || "Administrator"), rolled_back_at: phDateTime()
  });
  const ledgerNote = cashLedgerPlan.hasEffects ? " The corresponding GCash wallet and/or physical-cash ledger was also reconciled." : "";
  await audit(env, "REVERT_ACTIVITY_LOG", str(history.action) + " · " + str(logId),
    "Administrator reverted the recorded change. The rollback was limited to the exact saved rows/fields for this activity." + ledgerNote, meta);
  return { ok: true, logId: str(logId), action: str(history.action), reverted: changes.length, cashLedgerAdjusted: cashLedgerPlan.hasEffects };
}
async function previewDateRollback(env, date) {
  const day=str(date||"");if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw new Error("Choose a valid date for the rollback.");
  const rows=await dbAll(env,"SELECT * FROM change_history WHERE target_date=? AND status='Available' AND COALESCE(changes_json,'')<>'' ORDER BY datetime DESC,rowid DESC",day);
  const changes=[];
  for(const row of rows) {
    let items=[];try{items=JSON.parse(str(row.changes_json||"[]"));}catch(_){}
    changes.push({logId:str(row.log_id),dateTime:normalizeDateTime(row.datetime),action:str(row.action),user:str(row.user),changeCount:items.length});
  }
  return {ok:true,date:day,count:rows.length,changes:changes,notice:"Only changes captured by this version are eligible. Newer changes to the same fields cause the rollback to stop rather than overwrite newer data."};
}
async function rollbackDateChanges(env, date, meta, previewOnly) {
  const summary=await previewDateRollback(env,date);
  if(previewOnly) return summary;
  if(!summary.count) throw new Error("No reversible changes were recorded for "+str(date)+". Older Activity Log entries created before this feature was installed do not contain before/after snapshots.");
  const rows=await dbAll(env,"SELECT * FROM change_history WHERE target_date=? AND status='Available' AND COALESCE(changes_json,'')<>'' ORDER BY datetime DESC,rowid DESC",str(date));
  const prepared=[];
  for(const row of rows) prepared.push({row:row,changes:await getChangeList(env,row)});
  await preflightRollback(env,prepared);
  let rolledBack=0;
  for(const item of prepared) {
    for(let i=item.changes.length-1;i>=0;i--) await applyHistoryChange(env,item.changes[i]);
    await updateObj(env,"change_history","history_id",item.row.history_id,{status:"Rolled Back",rolled_back_by:str(meta.userName||"Administrator"),rolled_back_at:phDateTime()});
    rolledBack++;
  }
  await audit(env,"ROLLBACK_DATE_CHANGES",str(date),"Administrator rolled back "+rolledBack+" recorded change(s) dated "+str(date)+". Only saved, matching row/field snapshots for that date were restored.",meta);
  return {ok:true,date:str(date),rolledBack:rolledBack};
}
function pdfEscape(s) { return str(s).normalize("NFKD").replace(/[^\x20-\x7E]/g,"?").replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)"); }
function makeSimplePdf(lines) {
  const textLines=lines.slice(0,38),content=["BT","/F1 16 Tf","48 754 Td","("+pdfEscape(textLines[0]||"SALES INVOICE")+") Tj","/F1 9 Tf"];
  for(let i=1;i<textLines.length;i++) content.push("0 -17 Td","("+pdfEscape(textLines[i])+") Tj");
  content.push("ET");
  const stream=content.join("\n"),objects=[
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Length "+stream.length+" >>\nstream\n"+stream+"\nendstream"
  ];
  let pdf="%PDF-1.4\n",offsets=[0];
  objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=(i+1)+" 0 obj\n"+o+"\nendobj\n";});
  const xref=pdf.length;pdf+="xref\n0 "+(objects.length+1)+"\n0000000000 65535 f \n";
  for(let i=1;i<offsets.length;i++) pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  pdf+="trailer\n<< /Size "+(objects.length+1)+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF";
  return base64(new TextEncoder().encode(pdf));
}
async function generateInvoice(env, sale) {
  if(!sale) throw new Error("Sale data is required.");
  const settings=await settingsObject(env),storeName=settings.name||"Sari-Sari Store",tagline=settings.tagline||"Everyday Essentials";
  const lines=Array.isArray(sale.lines)?sale.lines:[],dt=str(sale.dateTime||"").replace("T"," "),date=(dt.match(/^\d{4}-\d{2}-\d{2}/)||[])[0]||normalizeDate(sale.date)||phDate();
  const time=(dt.match(/\d{4}-\d{2}-\d{2} (\d{2}:\d{2}:\d{2})/)||[])[1]||str(sale.time||"").match(/^\d{2}:\d{2}(?::\d{2})?$/)?.[0]||phTime();
  const p=["Invoice No.: "+str(sale.transactionId),"Date: "+date,"Time: "+time+" (PH)","Payment: "+str(sale.paymentMethod||"Cash"),"------------------------------------------------------------","Product | Qty | Unit | Price | Amount"];
  lines.forEach(x=>p.push(str(x.name)+" | "+str(x.qty)+" | "+str(x.saleUnit||"unit")+" | PHP "+n(x.price).toFixed(2)+" | PHP "+(n(x.qty)*n(x.price)).toFixed(2)));
  p.push("------------------------------------------------------------","TOTAL: PHP "+n(sale.total).toFixed(2),"AMOUNT PAID ("+str(sale.paymentMethod||"Cash")+"): PHP "+n(sale.payment).toFixed(2),"CHANGE: PHP "+n(sale.change).toFixed(2),"Thank you for your purchase!");
  return {ok:true,filename:"Invoice-"+str(sale.transactionId||makeId("TX"))+".pdf",base64:makeSimplePdf([storeName,tagline,"SALES INVOICE"].concat(p))};
}
async function generateCashierInvoice(env, sale, session) {
  const tx=str(sale&&sale.transactionId||"").trim();if(!tx) throw new Error("A completed sale transaction is required for a receipt.");
  const expected=userLabel(session),logs=await dbAll(env,"SELECT action,record,user FROM activity_log ORDER BY rowid DESC LIMIT 500");
  if(!logs.some(l=>str(l.action)==="SALE_RECORDED"&&str(l.record)===tx&&str(l.user)===expected)) throw new Error("Cashier accounts can generate receipts only for sales they completed.");
  const row=await getBy(env,"sales","transaction_id",tx);if(!row) throw new Error("Completed sale was not found.");
  return generateInvoice(env,saleDto(row));
}

async function requireAdmin(session, message) {
  if(session.role!=="Admin") throw new Error(message||"Only an administrator can perform this action.");
}
async function listAdminNotifications(env) {
  await reconcileTrashRequests(env);
  const trashRequests=await readTrashRequests(env);
  const passwordRequests=(await dbAll(env,"SELECT * FROM password_requests ORDER BY rowid")).map(r=>({requestId:str(r.request_id),username:str(r.username),userId:str(r.user_id),displayName:str(r.display_name||r.username),requestedAt:normalizeDateTime(r.requested_at),status:str(r.status),handledBy:str(r.handled_by),handledAt:normalizeDateTime(r.handled_at)})).filter(r=>r.requestId);
  const accountRequests=(await dbAll(env,"SELECT * FROM account_change_requests ORDER BY rowid")).map(r=>accountChangeDto(r,true)).filter(r=>r.requestId);
  return {ok:true,trashRequests:trashRequests,passwordRequests:passwordRequests,accountChangeRequests:accountRequests};
}
async function ensureGcashProviderFeeColumn(env) {
  const columns = await dbAll(env, "PRAGMA table_info(gcash_transactions)");
  if (!columns.some(column => str(column.name) === "provider_fee")) {
    await dbRun(env, "ALTER TABLE gcash_transactions ADD COLUMN provider_fee REAL NOT NULL DEFAULT 0");
  }
}
async function ensureGcashReceiptColumns(env) {
  const columns = await dbAll(env, "PRAGMA table_info(gcash_transactions)");
  const existing = new Set(columns.map(c => str(c.name)));
  const definitions = { receipt_data: "TEXT", receipt_file_name: "TEXT", receipt_content_type: "TEXT", receipt_size: "INTEGER", receipt_uploaded_at: "TEXT", receipt_uploaded_by: "TEXT" };
  for (const [name, type] of Object.entries(definitions)) if (!existing.has(name)) await dbRun(env, "ALTER TABLE gcash_transactions ADD COLUMN " + qi(name) + " " + type);
}
async function storeApiAction(request, env, data) {
  const action=str(data.action||"ping");
  const metaPublic=await requestMeta(request,data,null);
  if(action==="ping") { await dbFirst(env,"SELECT 1 AS connected"); return {ok:true,message:"Jeds Minimart Supabase API online",database:"Supabase PostgreSQL",timeZone:TZ}; }
  if(action==="authStatus") return authStatus(env,data.authToken);
  if(action==="login") return login(env,data,metaPublic);
  if(action==="forgotPassword") return forgotPassword(env,data);
  if(action==="bootstrapAdmin") return createFirstAdmin(env,data,metaPublic);

  const session=await getSession(env,data.authToken);
  if(!session) return {ok:false,authRequired:true,error:"Your sign-in session is no longer valid. Please sign in again."};
  const meta=await requestMeta(request,data,session);
  if(["recordSale","getCashManagementReport","getCashManagementReportRecords","saveCashManagementReport","addCashManagementFunds","editCashManagementFunds","deleteCashManagementFunds"].includes(action)) await ensureGcashProviderFeeColumn(env);
  if(session.role==="Cashier"&&!["logout","getData","recordSale","generateInvoice","createCashierCustomer","recordOfflineActivity"].includes(action)) return {ok:false,error:"Cashier accounts can only use checkout, customer lookup, add customers, their own receipts, and sign out."};

  if(action==="logout") {
    await audit(env,session.role==="Admin"?"ADMIN_LOGOUT":"LOGOUT",userLabel(session),session.role==="Admin"?"Administrator signed out.":"Signed out.",meta);
    await deleteBy(env,"user_sessions","token_hash",await sha256Base64Url(str(data.authToken||"")));
    return {ok:true};
  }
  if(action==="listUsers") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can manage user accounts."};
    return {ok:true,users:await publicUsers(env)};
  }
  if(action==="getAdminNotifications") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can view administrative notifications."};
    return listAdminNotifications(env);
  }
  if(action==="fulfillPasswordRequest") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can process password recovery requests."};
    return fulfillPasswordRequest(env,data.requestId,meta);
  }
  if(action==="dismissPasswordRequest") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can manage password recovery requests."};
    return dismissPasswordRequest(env,data.requestId,meta);
  }
  if(action==="reviewTrashRequest") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can approve or decline Trash requests."};
    return reviewTrashRequest(env,data.requestId,data.decision,meta);
  }
  if(action==="deleteActivityLogs") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can delete Activity Log entries."};
    return deleteActivityLogs(env,data.logIds||[],meta);
  }
  if(action==="getActivityLogs") return {ok:true,activityLogs:await activityRowsForRole(env,session.role)};
  if(action==="getUnreadActivityCount") return {ok:true,unreadCount:await unreadCount(env,session.id,session.role)};
  if(action==="getUnreadActivityLogs") return {ok:true,activityLogs:await unreadLogs(env,session.id,session.role)};
  if(action==="markActivityLogsRead") return markActivityRead(env,data.logIds||[],session);
  if(action==="updateUsername") {
    if(session.role!=="Admin"&&!canDirectlyChange(session))return {ok:false,error:"This account must submit username changes for Admin approval."};
    return updateUsername(env,data,session,meta);
  }
  if(action==="requestAccountChange") return requestAccountChange(env,data,session,meta);
  if(action==="reviewAccountChangeRequest") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can approve or decline account change requests."};
    return reviewAccountChange(env,data.requestId,data.decision,meta);
  }
  if(action==="clearCompletedTrashDeletionRequestLogs") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can clear completed Trash deletion request logs."};
    return clearCompletedTrashRequestLogs(env,meta);
  }
  if(action==="revertActivityLog") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can revert Activity Log changes."};
    return revertActivityLog(env,data.logId,meta);
  }
  if(action==="previewDateRollback") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can preview date-based rollback."};
    return rollbackDateChanges(env,data.date,meta,true);
  }
  if(action==="rollbackDateChanges") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can roll back changes by date."};
    return rollbackDateChanges(env,data.date,meta,false);
  }
  if(action==="createUser") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can create user accounts."};
    return {ok:true,user:await createUserRecord(env,data,str(data.role||"Staff"),meta)};
  }
  if(action==="updateUserRole") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can update account roles."};
    return updateUserRole(env,data.userId,data.role,session,meta);
  }
  if(action==="setUserActive") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can manage user accounts."};
    return setUserActive(env,data.userId,!!data.active,session,meta);
  }
  if(action==="resetUserPassword") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can reset user passwords."};
    return resetUserPassword(env,data.userId,data.password,meta);
  }
  if(action==="getUserPassword") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can view saved passwords."};
    const user=await getBy(env,"users","user_id",data.userId);
    if(!user)throw new Error("User account not found.");
    const password=str(user.password_plain_text||"");
    await audit(env,"VIEW_USER_PASSWORD",str(user.username||data.userId),"Administrator viewed the saved password for "+str(user.username||data.userId)+". The password itself was not written to the Activity Log.",meta);
    return {ok:true,username:str(user.username),hasPassword:password!=="",password:password};
  }
  if(action==="deleteUser") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can remove user accounts."};
    return deleteUser(env,data.userId,session,meta);
  }
  if(action==="changeMyPassword") {
    if(session.role!=="Admin"&&!canDirectlyChange(session))return {ok:false,error:"This account must submit password changes for Admin approval."};
    return changeMyPassword(env,session,data.currentPassword,data.newPassword,data.authToken,meta);
  }
  if(action==="lookupBarcode") return lookupBarcodeProducts(env,data.barcode,session);
  if(action==="getData") {
    return session.role==="Cashier"?loadCashierData(env,session):loadAllData(env,session);
  }
  if(action==="setup") {
    if(session.role!=="Admin")return {ok:false,error:"Only an administrator can run setup."};
    return {ok:true,message:"Supabase PostgreSQL database is ready.",database:"Supabase PostgreSQL",timeZone:TZ};
  }
  if(action==="recordOfflineActivity") return recordOfflineActivity(env,data.event,meta,session);
  if(action==="saveSalesDeduction") {
    if(!["Admin","Owner","Staff"].includes(session.role))return {ok:false,error:"Your role cannot configure sales deductions."};
    const description=str(data.deduction&&data.deduction.description||"").trim().slice(0,120),amount=Math.round(n(data.deduction&&data.deduction.amount)*100)/100;
    if(!description)throw new Error("A deduction description is required.");
    if(!Number.isFinite(amount)||amount<=0||amount>1000000)throw new Error("Deduction amount must be greater than zero and no more than 1,000,000.");
    const current=parseSalesDeductions((await settingsObject(env)).salesDeductions);
    const item={id:makeId("DED"),description,amount};current.push(item);
    await saveSettings(env,{salesDeductions:JSON.stringify(current)},meta);
    return {ok:true,salesDeductions:current,deduction:item};
  }
  if(action==="saveProduct") return saveProduct(env,data.product,meta);
  if(action==="updateProductBarcode") return updateProductBarcode(env,data.id,data.sku,meta);
  if(action==="moveToTrash") return moveToTrash(env,Object.assign({},data,{meta:meta}),meta);
  if(action==="restoreTrash") return restoreTrash(env,data.trashId,meta);
  if(action==="editTrashReason") return requestTrashReason(env,data.trashId,data.reason,meta);
  if(action==="permanentlyDeleteTrash") return session.role==="Admin"?permanentlyDeleteTrashAsAdmin(env,data.trashIds||[],meta):requestTrashDeletion(env,data.trashIds||[],meta);
  if(action==="saveCategories") return saveCategories(env,data.categories||[],meta);
  if(action==="recordSale") return recordSale(env,data.sale||{},meta,session);
  if(action==="saveGcashTransactionReceipt") {
    if(!["Admin","Staff","Owner"].includes(str(session.role))) throw new Error("Only Staff, Admin, and Owner accounts can upload GCash transaction receipts.");
    await ensureGcashReceiptColumns(env);
    const id=str(data.transactionId||"").trim(), receipt=str(data.receiptData||"");
    if(!id) throw new Error("A GCash transaction ID is required.");
    if(!receipt) throw new Error("Choose a receipt image first.");
    if(receipt.length>760000) throw new Error("The receipt image is too large. Choose a smaller photo.");
    const match=receipt.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i);
    if(!match) throw new Error("Receipt must be a JPEG, PNG, or WebP image.");
    const row=await getBy(env,"gcash_transactions","transaction_id",id);
    if(!row) throw new Error("GCash transaction not found. Refresh the page and try again.");
    const name=str(data.fileName||"gcash-receipt.jpg").replace(/[\\/\r\n]/g,"_").slice(0,180);
    await updateObj(env,"gcash_transactions","transaction_id",id,{receipt_data:receipt,receipt_file_name:name,receipt_content_type:match[1].toLowerCase(),receipt_size:Math.floor(match[2].length*3/4),receipt_uploaded_at:phDateTime(),receipt_uploaded_by:userLabel(session)});
    await audit(env,"GCASH_RECEIPT_UPLOADED",id,"Receipt image attached to GCash transaction "+id+".",meta);
    return {ok:true,transactionId:id,hasReceipt:true,receiptFileName:name};
  }
  if(action==="getGcashTransactionReceipt") {
    if(!["Admin","Staff","Owner"].includes(str(session.role))) throw new Error("Your role cannot view GCash transaction receipts.");
    await ensureGcashReceiptColumns(env);
    const row=await getBy(env,"gcash_transactions","transaction_id",str(data.transactionId||"").trim());
    if(!row) throw new Error("GCash transaction not found.");
    if(!row.receipt_data) return {ok:false,error:"No receipt image is attached to this transaction."};
    return {ok:true,transactionId:str(row.transaction_id),receiptData:str(row.receipt_data),fileName:str(row.receipt_file_name||"gcash-receipt"),contentType:str(row.receipt_content_type||"image/jpeg")};
  }
  if(action==="editGcashTransaction") return editGcashTransaction(env,data,meta,session);
  if(action==="removeGcashTransaction") return removeGcashTransaction(env,data,meta,session);
  if(action==="correctSale") return correctSale(env,Object.assign({},data,{meta:meta}),meta);
  if(action==="generateInvoice") return session.role==="Cashier"?generateCashierInvoice(env,data.sale,session):generateInvoice(env,data.sale);
  if(action==="createCashierCustomer") {
    if(session.role!=="Cashier")return {ok:false,error:"This customer-creation action is reserved for Cashier accounts."};
    return createCashierCustomer(env,data.customer,session,meta);
  }
  if(action==="saveCustomer") return saveCustomer(env,data.customer,meta);
  if(action==="saveSupplier") return saveSupplier(env,data.supplier,meta);
  if(action==="adjustStock") return adjustStock(env,data.id,data.quantity,data.reason,meta);
  if(action==="saveSettings") {
    const incoming=data.settings||{},privateKeys=["sheetEndpoint","scriptWebAppUrl","webAppUrl","appsScriptUrl"],adminKeys=["name","tagline","operatorName","logoText","logoImage","autoBarcodeScan","storeName","storeTagline","gcashCashInBankTransferFee"];
    if(session.role!=="Admin"&&Object.keys(incoming).some(k=>privateKeys.includes(k)))return {ok:false,error:"Only an Admin can change the Apps Script Web App URL."};
    if(session.role!=="Admin"&&Object.keys(incoming).some(k=>adminKeys.includes(k)))return {ok:false,error:"Only an Admin can change Store Details or Automatic barcode scanning."};
    return saveSettings(env,incoming,meta);
  }
  if(action==="getCashManagementReport") {
    if (!["Admin","Staff","Owner"].includes(str(session && session.role))) throw new Error("Only Admin, Staff, and Owner accounts can view the Cash Management Report.");
    return getCashManagementReport(env,data.date,session);
  }
  if(action==="getCashManagementReportRecords") {
    if (!["Admin","Staff","Owner"].includes(str(session && session.role))) throw new Error("Only Admin, Staff, and Owner accounts can view Cash Management Records.");
    return getCashManagementReportRecords(env,data.fromDate,data.toDate);
  }
  if(action==="getCashManagementReportExpenses") {
    if (!["Admin","Staff","Owner"].includes(str(session && session.role))) throw new Error("Only Admin, Staff, and Owner accounts can view cash management expenses.");
    return listCashManagementReportExpenses(env,data.date);
  }
  if(action==="saveCashManagementReportExpense") return saveCashManagementReportExpense(env,data,meta,session);
  if(action==="deleteCashManagementReportExpense") return deleteCashManagementReportExpense(env,data.expenseId,meta,session);
  if(action==="getCashManagementReportExpenseReceipt") return getCashManagementReportExpenseReceipt(env,data.expenseId,session);
  if(action==="saveCashManagementReport") return saveCashManagementReport(env,data,meta,session);
  if(action==="addCashManagementFunds") return addCashManagementFunds(env,data,meta,session);
  if(action==="editCashManagementFunds") return editCashManagementFunds(env,data,meta,session);
  if(action==="deleteCashManagementFunds") return deleteCashManagementFunds(env,data,meta,session);
   if(action==="saveReconciliation") return saveReconciliation(env,data.reconciliation||{},meta);
  if(action==="editCashReconciliationRecord") return editCashReconciliationRecord(env,data.reconciliation||{},meta,session);
  if(action==="deleteCashReconciliationRecord") return deleteCashReconciliationRecord(env,data.date,meta,session);
  return {ok:false,error:"Unknown action: "+action};
}
export async function handleStoreApi(request, env) {
  const headers={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store, max-age=0","X-Content-Type-Options":"nosniff"};
  const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status:status,headers:headers});
  if(request.method!=="POST") return reply({ok:false,error:"Use POST for store API requests."},405);
  const origin=request.headers.get("Origin");
  if(origin) { try { if(new URL(origin).origin!==new URL(request.url).origin)return reply({ok:false,error:"Cross-origin API requests are not allowed."},403); } catch (_) { return reply({ok:false,error:"Invalid request origin."},403); } }
  if(!env.DB) return reply({ok:false,error:"Supabase PostgreSQL database adapter is not configured."},503);
  let bytes;
  try { bytes=await request.arrayBuffer(); } catch (_) { return reply({ok:false,error:"Could not read the API request body."},400); }
  if(bytes.byteLength>1000000) return reply({ok:false,error:"The request is too large."},413);
  let data;
  try { data=JSON.parse(new TextDecoder().decode(bytes)); } catch (_) { return reply({ok:false,error:"The API request must contain valid JSON."},400); }
  if(!data||typeof data!=="object"||Array.isArray(data)||typeof data.action!=="string") return reply({ok:false,error:"The API request is missing a valid action."},400);
  try { Object.defineProperty(request,"__env",{value:env,configurable:true}); return reply(await storeApiAction(request,env,data)); }
  catch(e) { console.error("Supabase API action failed:",str(e&&e.message||e)); return reply({ok:false,error:str(e&&e.message||e||"Unexpected server error.")},200); }
}
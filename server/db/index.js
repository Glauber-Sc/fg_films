import fs from "fs";
import path from "path";
import { createRequire } from "module";

const isPkg = !!process.pkg;

if (isPkg) {
  try {
    process.chdir(path.dirname(process.execPath));
  } catch {}
}

// Em DEV, resolvemos a partir do arquivo server/index.js (não precisa existir de verdade)
// Em EXE, resolvemos a partir de dist/index.js (também não precisa existir)
const baseForRequire = isPkg
  ? path.join(process.cwd(), "index.js")
  : path.join(process.cwd(), "server", "index.js");

const requireFromBase = createRequire(baseForRequire);

// Evitar que ferramentas estáticas capturem o módulo nativo
const MOD = "better" + "-sqlite3";
const Database = requireFromBase(MOD);

const baseDir = isPkg ? path.dirname(process.execPath) : process.cwd();

const dataDir = path.join(baseDir, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const dbPath = path.join(dataDir, "app.db");
export const db = new Database(dbPath);

export function nowISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function initDb() {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("synchronous = FULL");
  db.pragma("busy_timeout = 5000");
  db.pragma("temp_store = MEMORY");
  db.pragma("cache_size = -20000");

  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT, document TEXT, address TEXT, notes TEXT,
      created_at TEXT NOT NULL, updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cnpj TEXT, phone TEXT, email TEXT, address TEXT, notes TEXT,
      created_at TEXT NOT NULL, updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT, compatible_model TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      low_stock INTEGER NOT NULL DEFAULT 5,
      price REAL, cost_price REAL, code TEXT,
      supplier_id TEXT,
      created_at TEXT NOT NULL, updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      quote_number INTEGER NOT NULL,
      customer_id TEXT, customer_name TEXT,
      notes TEXT, date TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      total REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL, updated_at TEXT, converted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS quote_items (
      id TEXT PRIMARY KEY,
      quote_id TEXT NOT NULL,
      product_id TEXT, name TEXT, brand TEXT,
      price REAL NOT NULL, quantity INTEGER NOT NULL, total REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      customer_id TEXT, customer_name TEXT,
      date TEXT NOT NULL,
      total REAL NOT NULL DEFAULT 0,
      quote_id TEXT, created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      product_id TEXT, product_name TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      sale_id TEXT,
      service_id INTEGER,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      machine TEXT,
      installments TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      value REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      employee TEXT NOT NULL,
      value REAL NOT NULL,
      payment TEXT,
      paid_total REAL, paid_at TEXT,
      created_at TEXT NOT NULL, updated_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
    CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
    CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);
    CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
    CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

    CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
    CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
    CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
    CREATE INDEX IF NOT EXISTS idx_sales_quote_id ON sales(quote_id);
    CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id ON sales_items(sale_id);
    CREATE INDEX IF NOT EXISTS idx_sales_items_product ON sales_items(product_id);
    CREATE INDEX IF NOT EXISTS idx_payments_sale ON payments(sale_id);
  `);
}

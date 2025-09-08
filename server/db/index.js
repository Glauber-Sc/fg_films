// // // // server/db/index.js
// // // import Database from "better-sqlite3";
// // // import { fileURLToPath } from "url";
// // // import { dirname, join } from "path";
// // // import fs from "fs";

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = dirname(__filename);

// // // // garante a pasta data/
// // // const dataDir = join(__dirname, "../data");
// // // if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// // // export const dbPath = join(dataDir, "app.db");
// // // export const db = new Database(dbPath); // abre/sobe o arquivo .db imediatamente

// // // // helper simples de data (ISO local, sem 'Z')
// // // export function nowISO() {
// // //   const d = new Date();
// // //   const pad = (n) => String(n).padStart(2, "0");
// // //   const y = d.getFullYear();
// // //   const m = pad(d.getMonth() + 1);
// // //   const day = pad(d.getDate());
// // //   const hh = pad(d.getHours());
// // //   const mm = pad(d.getMinutes());
// // //   const ss = pad(d.getSeconds());
// // //   return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
// // // }

// // // export function initDb() {
// // //   db.pragma("journal_mode = WAL");
// // //   db.pragma("foreign_keys = ON");

// // //   db.exec(`
// // //     -- === CLIENTES ===
// // //     CREATE TABLE IF NOT EXISTS customers (
// // //       id           TEXT PRIMARY KEY,
// // //       name         TEXT NOT NULL,
// // //       phone        TEXT,
// // //       document     TEXT,
// // //       address      TEXT,
// // //       notes        TEXT,
// // //       created_at   TEXT NOT NULL,
// // //       updated_at   TEXT
// // //     );

// // //     -- === FORNECEDORES ===
// // //     CREATE TABLE IF NOT EXISTS suppliers (
// // //       id           TEXT PRIMARY KEY,
// // //       name         TEXT NOT NULL,
// // //       cnpj         TEXT,
// // //       phone        TEXT,
// // //       email        TEXT,
// // //       address      TEXT,
// // //       notes        TEXT,
// // //       created_at   TEXT NOT NULL,
// // //       updated_at   TEXT
// // //     );

// // //     -- === PRODUTOS ===
// // //     CREATE TABLE IF NOT EXISTS products (
// // //       id              TEXT PRIMARY KEY,
// // //       name            TEXT NOT NULL,
// // //       brand           TEXT,
// // //       compatible_model TEXT,
// // //       stock           INTEGER NOT NULL DEFAULT 0,
// // //       low_stock       INTEGER NOT NULL DEFAULT 5,
// // //       price           REAL,
// // //       cost_price      REAL,
// // //       code            TEXT,
// // //       supplier_id     TEXT,
// // //       created_at      TEXT NOT NULL,
// // //       updated_at      TEXT,
// // //       FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
// // //     );

// // //     -- === ORÇAMENTOS ===
// // //     CREATE TABLE IF NOT EXISTS quotes (
// // //       id            TEXT PRIMARY KEY,
// // //       quote_number  INTEGER NOT NULL,
// // //       customer_id   TEXT,
// // //       customer_name TEXT,
// // //       notes         TEXT,
// // //       date          TEXT,
// // //       status        TEXT NOT NULL DEFAULT 'pending',
// // //       created_at    TEXT NOT NULL,
// // //       updated_at    TEXT,
// // //       converted_at  TEXT
// // //     );

// // //     CREATE TABLE IF NOT EXISTS quote_items (
// // //       id          TEXT PRIMARY KEY,
// // //       quote_id    TEXT NOT NULL,
// // //       product_id  TEXT,
// // //       name        TEXT,
// // //       brand       TEXT,
// // //       price       REAL NOT NULL,
// // //       quantity    INTEGER NOT NULL,
// // //       total       REAL NOT NULL,
// // //       stock       INTEGER,
// // //       FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
// // //     );

// // //     -- === VENDAS ===
// // //     CREATE TABLE IF NOT EXISTS sales (
// // //       id            TEXT PRIMARY KEY,
// // //       customer_id   TEXT,
// // //       customer_name TEXT,
// // //       date          TEXT NOT NULL,
// // //       total         REAL NOT NULL DEFAULT 0,
// // //       quote_id      TEXT,
// // //       created_at    TEXT NOT NULL
// // //     );

// // //     CREATE TABLE IF NOT EXISTS sales_items (
// // //       id            TEXT PRIMARY KEY,
// // //       sale_id       TEXT NOT NULL,
// // //       product_id    TEXT,
// // //       product_name  TEXT,
// // //       quantity      INTEGER NOT NULL,
// // //       unit_price    REAL NOT NULL,
// // //       total         REAL NOT NULL,
// // //       FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
// // //     );

// // //     -- pagamentos de vendas E de serviços (service_id opcional)
// // //     CREATE TABLE IF NOT EXISTS payments (
// // //       id            TEXT PRIMARY KEY,
// // //       sale_id       TEXT,
// // //       service_id    INTEGER,
// // //       method        TEXT NOT NULL,
// // //       amount        REAL NOT NULL,
// // //       machine       TEXT,
// // //       installments  TEXT,
// // //       created_at    TEXT NOT NULL,
// // //       FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
// // //     );

// // //     -- === DESPESAS ===
// // //     CREATE TABLE IF NOT EXISTS expenses (
// // //       id          INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       date        TEXT NOT NULL,
// // //       description TEXT NOT NULL,
// // //       value       REAL NOT NULL,
// // //       created_at  TEXT NOT NULL,
// // //       updated_at  TEXT
// // //     );

// // //     -- === SERVIÇOS ===
// // //     CREATE TABLE IF NOT EXISTS services (
// // //       id          INTEGER PRIMARY KEY AUTOINCREMENT,
// // //       date        TEXT NOT NULL,
// // //       description TEXT NOT NULL,
// // //       employee    TEXT NOT NULL,
// // //       value       REAL NOT NULL,
// // //       payment     TEXT,            -- resumo textual legado (opcional)
// // //       paid_total  REAL,
// // //       paid_at     TEXT,
// // //       created_at  TEXT NOT NULL,
// // //       updated_at  TEXT
// // //     );

// // //     CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
// // //     CREATE INDEX IF NOT EXISTS idx_services_date ON services(date);
// // //     CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
// // //     CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
// // //   `);
// // // }


// // // server/db/index.js
// // import Database from "better-sqlite3";
// // import { fileURLToPath } from "url";
// // import { dirname, join } from "path";
// // import fs from "fs";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // // garante a pasta data/
// // const dataDir = join(__dirname, "../data");
// // if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// // export const dbPath = join(dataDir, "app.db");
// // export const db = new Database(dbPath); // abre/sobe o arquivo .db imediatamente

// // // helper simples de data (ISO local, sem 'Z')
// // export function nowISO() {
// //   const d = new Date();
// //   const pad = (n) => String(n).padStart(2, "0");
// //   const y = d.getFullYear();
// //   const m = pad(d.getMonth() + 1);
// //   const day = pad(d.getDate());
// //   const hh = pad(d.getHours());
// //   const mm = pad(d.getMinutes());
// //   const ss = pad(d.getSeconds());
// //   return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
// // }

// // export function initDb() {
// //   // ---- PRAGMAs de robustez/concorrência ----
// //   db.pragma("journal_mode = WAL");     // já estava: melhor leitura concorrente
// //   db.pragma("foreign_keys = ON");      // já estava: integridade referencial

// //   // adicionados (pode manter assim):
// //   db.pragma("synchronous = FULL");     // máxima durabilidade (pode deixar NORMAL se quiser mais velocidade de escrita)
// //   db.pragma("busy_timeout = 5000");    // espera até 5s se estiver ocupado
// //   db.pragma("temp_store = MEMORY");    // temp em memória
// //   db.pragma("cache_size = -20000");    // ~20MB de cache (valor negativo = KB)

// //   // ---- Esquema ----
// //   db.exec(`
// //     -- === CLIENTES ===
// //     CREATE TABLE IF NOT EXISTS customers (
// //       id           TEXT PRIMARY KEY,
// //       name         TEXT NOT NULL,
// //       phone        TEXT,
// //       document     TEXT,
// //       address      TEXT,
// //       notes        TEXT,
// //       created_at   TEXT NOT NULL,
// //       updated_at   TEXT
// //     );

// //     -- === FORNECEDORES ===
// //     CREATE TABLE IF NOT EXISTS suppliers (
// //       id           TEXT PRIMARY KEY,
// //       name         TEXT NOT NULL,
// //       cnpj         TEXT,
// //       phone        TEXT,
// //       email        TEXT,
// //       address      TEXT,
// //       notes        TEXT,
// //       created_at   TEXT NOT NULL,
// //       updated_at   TEXT
// //     );

// //     -- === PRODUTOS ===
// //     CREATE TABLE IF NOT EXISTS products (
// //       id               TEXT PRIMARY KEY,
// //       name             TEXT NOT NULL,
// //       brand            TEXT,
// //       compatible_model TEXT,
// //       stock            INTEGER NOT NULL DEFAULT 0,
// //       low_stock        INTEGER NOT NULL DEFAULT 5,
// //       price            REAL,
// //       cost_price       REAL,
// //       code             TEXT,
// //       supplier_id      TEXT,
// //       created_at       TEXT NOT NULL,
// //       updated_at       TEXT,
// //       FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
// //     );

// //     -- === ORÇAMENTOS ===
// //     CREATE TABLE IF NOT EXISTS quotes (
// //       id            TEXT PRIMARY KEY,
// //       quote_number  INTEGER NOT NULL,
// //       customer_id   TEXT,
// //       customer_name TEXT,
// //       notes         TEXT,
// //       date          TEXT,
// //       status        TEXT NOT NULL DEFAULT 'pending',
// //       created_at    TEXT NOT NULL,
// //       updated_at    TEXT,
// //       converted_at  TEXT
// //     );

// //     CREATE TABLE IF NOT EXISTS quote_items (
// //       id          TEXT PRIMARY KEY,
// //       quote_id    TEXT NOT NULL,
// //       product_id  TEXT,
// //       name        TEXT,
// //       brand       TEXT,
// //       price       REAL NOT NULL,
// //       quantity    INTEGER NOT NULL,
// //       total       REAL NOT NULL,
// //       stock       INTEGER,
// //       FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
// //     );

// //     -- === VENDAS ===
// //     CREATE TABLE IF NOT EXISTS sales (
// //       id            TEXT PRIMARY KEY,
// //       customer_id   TEXT,
// //       customer_name TEXT,
// //       date          TEXT NOT NULL,
// //       total         REAL NOT NULL DEFAULT 0,
// //       quote_id      TEXT,
// //       created_at    TEXT NOT NULL
// //     );

// //     CREATE TABLE IF NOT EXISTS sales_items (
// //       id            TEXT PRIMARY KEY,
// //       sale_id       TEXT NOT NULL,
// //       product_id    TEXT,
// //       product_name  TEXT,
// //       quantity      INTEGER NOT NULL,
// //       unit_price    REAL NOT NULL,
// //       total         REAL NOT NULL,
// //       FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
// //     );

// //     -- pagamentos de vendas E de serviços (service_id opcional)
// //     CREATE TABLE IF NOT EXISTS payments (
// //       id            TEXT PRIMARY KEY,
// //       sale_id       TEXT,
// //       service_id    INTEGER,
// //       method        TEXT NOT NULL,
// //       amount        REAL NOT NULL,
// //       machine       TEXT,
// //       installments  TEXT,
// //       created_at    TEXT NOT NULL,
// //       FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
// //     );

// //     -- === DESPESAS ===
// //     CREATE TABLE IF NOT EXISTS expenses (
// //       id          INTEGER PRIMARY KEY AUTOINCREMENT,
// //       date        TEXT NOT NULL,
// //       description TEXT NOT NULL,
// //       value       REAL NOT NULL,
// //       created_at  TEXT NOT NULL,
// //       updated_at  TEXT
// //     );

// //     -- === SERVIÇOS ===
// //     CREATE TABLE IF NOT EXISTS services (
// //       id          INTEGER PRIMARY KEY AUTOINCREMENT,
// //       date        TEXT NOT NULL,
// //       description TEXT NOT NULL,
// //       employee    TEXT NOT NULL,
// //       value       REAL NOT NULL,
// //       payment     TEXT,            -- resumo textual legado (opcional)
// //       paid_total  REAL,
// //       paid_at     TEXT,
// //       created_at  TEXT NOT NULL,
// //       updated_at  TEXT
// //     );

// //     -- índices básicos (já havia alguns)
// //     CREATE INDEX IF NOT EXISTS idx_sales_date        ON sales(date);
// //     CREATE INDEX IF NOT EXISTS idx_services_date     ON services(date);
// //     CREATE INDEX IF NOT EXISTS idx_expenses_date     ON expenses(date);
// //     CREATE INDEX IF NOT EXISTS idx_products_stock    ON products(stock);

// //     -- índices extras recomendados (melhoram busca/relatórios em volume)
// //     CREATE INDEX IF NOT EXISTS idx_products_code         ON products(code);
// //     CREATE INDEX IF NOT EXISTS idx_customers_name        ON customers(name);
// //     CREATE INDEX IF NOT EXISTS idx_suppliers_name        ON suppliers(name);
// //     CREATE INDEX IF NOT EXISTS idx_sales_quote_id        ON sales(quote_id);
// //     CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id   ON sales_items(sale_id);
// //     CREATE INDEX IF NOT EXISTS idx_sales_items_product   ON sales_items(product_id);
// //     CREATE INDEX IF NOT EXISTS idx_payments_sale         ON payments(sale_id);
// //   `);
// // }



// // server/db/index.js
// import Database from "better-sqlite3";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // garante a pasta data/
// const dataDir = join(__dirname, "../data");
// if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// export const dbPath = join(dataDir, "app.db");
// export const db = new Database(dbPath); // abre/sobe o arquivo .db imediatamente

// // helper simples de data (ISO local, sem 'Z')
// export function nowISO() {
//   const d = new Date();
//   const pad = (n) => String(n).padStart(2, "0");
//   const y = d.getFullYear();
//   const m = pad(d.getMonth() + 1);
//   const day = pad(d.getDate());
//   const hh = pad(d.getHours());
//   const mm = pad(d.getMinutes());
//   const ss = pad(d.getSeconds());
//   return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
// }

// export function initDb() {
//   // PRAGMAs
//   db.pragma("journal_mode = WAL");
//   db.pragma("foreign_keys = ON");
//   db.pragma("synchronous = FULL");
//   db.pragma("busy_timeout = 5000");
//   db.pragma("temp_store = MEMORY");
//   db.pragma("cache_size = -20000");

//   // ESQUEMA
//   db.exec(`
//     -- === CLIENTES ===
//     CREATE TABLE IF NOT EXISTS customers (
//       id           TEXT PRIMARY KEY,
//       name         TEXT NOT NULL,
//       phone        TEXT,
//       document     TEXT,
//       address      TEXT,
//       notes        TEXT,
//       created_at   TEXT NOT NULL,
//       updated_at   TEXT
//     );

//     -- === FORNECEDORES ===
//     CREATE TABLE IF NOT EXISTS suppliers (
//       id           TEXT PRIMARY KEY,
//       name         TEXT NOT NULL,
//       cnpj         TEXT,
//       phone        TEXT,
//       email        TEXT,
//       address      TEXT,
//       notes        TEXT,
//       created_at   TEXT NOT NULL,
//       updated_at   TEXT
//     );

//     -- === PRODUTOS ===
//     CREATE TABLE IF NOT EXISTS products (
//       id               TEXT PRIMARY KEY,
//       name             TEXT NOT NULL,
//       brand            TEXT,
//       compatible_model TEXT,
//       stock            INTEGER NOT NULL DEFAULT 0,
//       low_stock        INTEGER NOT NULL DEFAULT 5,
//       price            REAL,
//       cost_price       REAL,
//       code             TEXT,
//       supplier_id      TEXT,
//       created_at       TEXT NOT NULL,
//       updated_at       TEXT,
//       FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
//     );

//     -- === ORÇAMENTOS ===
//     CREATE TABLE IF NOT EXISTS quotes (
//       id            TEXT PRIMARY KEY,
//       quote_number  INTEGER NOT NULL,
//       customer_id   TEXT,
//       customer_name TEXT,
//       notes         TEXT,
//       date          TEXT,             -- data “lógica” do orçamento (pode ser hoje)
//       status        TEXT NOT NULL DEFAULT 'pending',
//       total         REAL NOT NULL DEFAULT 0,  -- << NOVO
//       created_at    TEXT NOT NULL,
//       updated_at    TEXT,
//       converted_at  TEXT
//     );

//     CREATE TABLE IF NOT EXISTS quote_items (
//       id          TEXT PRIMARY KEY,
//       quote_id    TEXT NOT NULL,
//       product_id  TEXT,
//       name        TEXT,
//       brand       TEXT,
//       price       REAL NOT NULL,
//       quantity    INTEGER NOT NULL,
//       total       REAL NOT NULL,
//       stock       INTEGER,
//       FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
//     );

//     -- === VENDAS ===
//     CREATE TABLE IF NOT EXISTS sales (
//       id            TEXT PRIMARY KEY,
//       customer_id   TEXT,
//       customer_name TEXT,
//       date          TEXT NOT NULL,
//       total         REAL NOT NULL DEFAULT 0,
//       quote_id      TEXT,
//       created_at    TEXT NOT NULL
//     );

//     CREATE TABLE IF NOT EXISTS sales_items (
//       id            TEXT PRIMARY KEY,
//       sale_id       TEXT NOT NULL,
//       product_id    TEXT,
//       product_name  TEXT,
//       quantity      INTEGER NOT NULL,
//       unit_price    REAL NOT NULL,
//       total         REAL NOT NULL,
//       FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
//     );

//     -- pagamentos de vendas E de serviços (service_id opcional)
//     CREATE TABLE IF NOT EXISTS payments (
//       id            TEXT PRIMARY KEY,
//       sale_id       TEXT,
//       service_id    INTEGER,
//       method        TEXT NOT NULL,
//       amount        REAL NOT NULL,
//       machine       TEXT,
//       installments  TEXT,
//       created_at    TEXT NOT NULL,
//       FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
//     );

//     -- === DESPESAS ===
//     CREATE TABLE IF NOT EXISTS expenses (
//       id          INTEGER PRIMARY KEY AUTOINCREMENT,
//       date        TEXT NOT NULL,
//       description TEXT NOT NULL,
//       value       REAL NOT NULL,
//       created_at  TEXT NOT NULL,
//       updated_at  TEXT
//     );

//     -- === SERVIÇOS (SEM COLUNA 'date') ===
//     CREATE TABLE IF NOT EXISTS services (
//       id          INTEGER PRIMARY KEY AUTOINCREMENT,
//       description TEXT NOT NULL,
//       employee    TEXT NOT NULL,
//       value       REAL NOT NULL,
//       payment     TEXT,            -- resumo textual legado (opcional)
//       paid_total  REAL,
//       paid_at     TEXT,
//       created_at  TEXT NOT NULL,
//       updated_at  TEXT
//     );

//     -- Índices
//     CREATE INDEX IF NOT EXISTS idx_sales_date            ON sales(date);
//     CREATE INDEX IF NOT EXISTS idx_expenses_date         ON expenses(date);
//     CREATE INDEX IF NOT EXISTS idx_products_stock        ON products(stock);
//     CREATE INDEX IF NOT EXISTS idx_services_created_at   ON services(created_at);
//     CREATE INDEX IF NOT EXISTS idx_quotes_created_at     ON quotes(created_at);

//     -- Extras úteis
//     CREATE INDEX IF NOT EXISTS idx_products_code         ON products(code);
//     CREATE INDEX IF NOT EXISTS idx_customers_name        ON customers(name);
//     CREATE INDEX IF NOT EXISTS idx_suppliers_name        ON suppliers(name);
//     CREATE INDEX IF NOT EXISTS idx_sales_quote_id        ON sales(quote_id);
//     CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id   ON sales_items(sale_id);
//     CREATE INDEX IF NOT EXISTS idx_sales_items_product   ON sales_items(product_id);
//     CREATE INDEX IF NOT EXISTS idx_payments_sale         ON payments(sale_id);
//   `);
// }



// server/db/index.js
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// garante a pasta data/
const dataDir = join(__dirname, "../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const dbPath = join(dataDir, "app.db");
export const db = new Database(dbPath); // abre/sobe o arquivo .db imediatamente

// helper simples de data (ISO local, sem 'Z')
export function nowISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
}

export function initDb() {
  // PRAGMAs
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("synchronous = FULL");
  db.pragma("busy_timeout = 5000");
  db.pragma("temp_store = MEMORY");
  db.pragma("cache_size = -20000");

  // ESQUEMA
  db.exec(`
    -- === CLIENTES ===
    CREATE TABLE IF NOT EXISTS customers (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      phone        TEXT,
      document     TEXT,
      address      TEXT,
      notes        TEXT,
      created_at   TEXT NOT NULL,
      updated_at   TEXT
    );

    -- === FORNECEDORES ===
    CREATE TABLE IF NOT EXISTS suppliers (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      cnpj         TEXT,
      phone        TEXT,
      email        TEXT,
      address      TEXT,
      notes        TEXT,
      created_at   TEXT NOT NULL,
      updated_at   TEXT
    );

    -- === PRODUTOS ===
    CREATE TABLE IF NOT EXISTS products (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      brand            TEXT,
      compatible_model TEXT,
      stock            INTEGER NOT NULL DEFAULT 0,
      low_stock        INTEGER NOT NULL DEFAULT 5,
      price            REAL,
      cost_price       REAL,
      code             TEXT,
      supplier_id      TEXT,
      created_at       TEXT NOT NULL,
      updated_at       TEXT,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    -- === ORÇAMENTOS ===
    CREATE TABLE IF NOT EXISTS quotes (
      id            TEXT PRIMARY KEY,
      quote_number  INTEGER NOT NULL,
      customer_id   TEXT,
      customer_name TEXT,
      notes         TEXT,
      date          TEXT,             -- data “lógica” do orçamento (pode ser hoje)
      status        TEXT NOT NULL DEFAULT 'pending',
      total         REAL NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL,
      updated_at    TEXT,
      converted_at  TEXT
    );

    CREATE TABLE IF NOT EXISTS quote_items (
      id          TEXT PRIMARY KEY,
      quote_id    TEXT NOT NULL,
      product_id  TEXT,
      name        TEXT,
      brand       TEXT,
      price       REAL NOT NULL,
      quantity    INTEGER NOT NULL,
      total       REAL NOT NULL,
      stock       INTEGER,
      FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
    );

    -- === VENDAS ===
    CREATE TABLE IF NOT EXISTS sales (
      id            TEXT PRIMARY KEY,
      customer_id   TEXT,
      customer_name TEXT,
      date          TEXT NOT NULL,
      total         REAL NOT NULL DEFAULT 0,
      quote_id      TEXT,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales_items (
      id            TEXT PRIMARY KEY,
      sale_id       TEXT NOT NULL,
      product_id    TEXT,
      product_name  TEXT,
      quantity      INTEGER NOT NULL,
      unit_price    REAL NOT NULL,
      total         REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
    );

    -- pagamentos de vendas E de serviços (service_id opcional)
    CREATE TABLE IF NOT EXISTS payments (
      id            TEXT PRIMARY KEY,
      sale_id       TEXT,
      service_id    INTEGER,
      method        TEXT NOT NULL,
      amount        REAL NOT NULL,
      machine       TEXT,
      installments  TEXT,
      created_at    TEXT NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
    );

    -- === DESPESAS (SEM COLUNA 'date') ===
    CREATE TABLE IF NOT EXISTS expenses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      value       REAL NOT NULL,
      created_at  TEXT NOT NULL,
      updated_at  TEXT
    );

    -- === SERVIÇOS (SEM COLUNA 'date') ===
    CREATE TABLE IF NOT EXISTS services (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      employee    TEXT NOT NULL,
      value       REAL NOT NULL,
      payment     TEXT,            -- resumo textual legado (opcional)
      paid_total  REAL,
      paid_at     TEXT,
      created_at  TEXT NOT NULL,
      updated_at  TEXT
    );

    -- Índices
    CREATE INDEX IF NOT EXISTS idx_sales_date              ON sales(date);
    CREATE INDEX IF NOT EXISTS idx_products_stock          ON products(stock);
    CREATE INDEX IF NOT EXISTS idx_services_created_at     ON services(created_at);
    CREATE INDEX IF NOT EXISTS idx_quotes_created_at       ON quotes(created_at);
    CREATE INDEX IF NOT EXISTS idx_expenses_created_at     ON expenses(created_at);

    -- Extras úteis
    CREATE INDEX IF NOT EXISTS idx_products_code           ON products(code);
    CREATE INDEX IF NOT EXISTS idx_customers_name          ON customers(name);
    CREATE INDEX IF NOT EXISTS idx_suppliers_name          ON suppliers(name);
    CREATE INDEX IF NOT EXISTS idx_sales_quote_id          ON sales(quote_id);
    CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id     ON sales_items(sale_id);
    CREATE INDEX IF NOT EXISTS idx_sales_items_product     ON sales_items(product_id);
    CREATE INDEX IF NOT EXISTS idx_payments_sale           ON payments(sale_id);
  `);
}

// import express from "express";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const productsFile = join(__dirname, "../data/products.json");
// const salesFile    = join(__dirname, "../data/sales.json");
// const expensesFile = join(__dirname, "../data/expenses.json");

// const readJson = (p) => {
//   try {
//     const raw = fs.readFileSync(p, "utf8");
//     return raw?.trim() ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// };

// /**
//  * Parse "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm[:ss]" como **horário local**.
//  * Evita o bug clássico de o JS interpretar "YYYY-MM-DD" como UTC 00:00,
//  * que empurra a data para o dia anterior em fusos como America/Belem.
//  */
// function parseLocalDate(val) {
//   if (!val) return null;
//   if (typeof val === "string") {
//     const m = val.match(
//       /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/
//     );
//     if (m) {
//       const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = m;
//       return new Date(+y, +mo - 1, +d, +hh, +mm, +ss, 0); // local time
//     }
//   }
//   return new Date(val);
// }

// const toStart = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
// const toEnd   = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };
// const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

// function buildDailySeries(sales, fromDate, toDate) {
//   let start = fromDate, end = toDate;
//   if (!start || !end) {
//     end = toStart(new Date());
//     start = new Date(end);
//     start.setDate(end.getDate() - 6);
//   }
//   start = toStart(start);
//   end   = toEnd(end);

//   const days = [];
//   const cur = new Date(start);
//   while (cur <= end) {
//     days.push(new Date(cur));
//     cur.setDate(cur.getDate() + 1);
//   }

//   return days.map((d) => {
//     const next = new Date(d); next.setDate(d.getDate() + 1);
//     const daySales = sales.filter((s) => {
//       const sd = parseLocalDate(s.date);
//       return sd >= d && sd < next;
//     });
//     const total = daySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
//     return { date: d.toLocaleDateString("pt-BR"), total };
//   });
// }

// function buildMonthlySeries(sales, fromDate, toDate) {
//   const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
//   let start = fromDate, end = toDate;
//   if (!start || !end) {
//     end = new Date(); end.setDate(1);
//     start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
//   } else {
//     start = new Date(start.getFullYear(), start.getMonth(), 1);
//     end   = new Date(end.getFullYear(),   end.getMonth(),   1);
//   }

//   const months = [];
//   const cur = new Date(start);
//   while (cur <= end) {
//     months.push(new Date(cur));
//     cur.setMonth(cur.getMonth() + 1);
//   }

//   return months.map((m) => {
//     const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
//     const msales = sales.filter((s) => {
//       const sd = parseLocalDate(s.date);
//       return sd >= m && sd < next;
//     });
//     const total = msales.reduce((sum, s) => sum + Number(s.total || 0), 0);
//     return { month: `${monthNames[m.getMonth()]}/${m.getFullYear()}`, total };
//   });
// }

// function paymentSummary(pmArr = []) {
//   if (!Array.isArray(pmArr) || pmArr.length === 0) return "";
//   return pmArr
//     .map(pm => `${pm.method}${pm.machine ? ` (${pm.machine})` : ""}: R$ ${Number(pm.amount || 0).toFixed(2)}`)
//     .join(" | ");
// }

// function buildLedger(sales, expenses) {
//   const ledger = [];

//   // Vendas => entradas
//   for (const s of sales) {
//     ledger.push({
//       id: `S-${s.id}`,
//       date: s.date,
//       type: "Venda",
//       description: s.productName ?? "",
//       customerName: s.customerName ?? "",
//       payment: paymentSummary(s.paymentMethods),
//       in: Number(s.total || 0),
//       out: 0,
//     });
//   }

//   // Despesas => saídas
//   for (const e of expenses) {
//     ledger.push({
//       id: `E-${e.id}`,
//       date: e.date,
//       type: "Despesa",
//       description: e.description ?? "",
//       customerName: "",
//       payment: "",
//       in: 0,
//       out: Number(e.value || 0),
//     });
//   }

//   // Ordena por data (asc) e, depois, por tipo
//   ledger.sort((a, b) => {
//     const da = parseLocalDate(a.date);
//     const db = parseLocalDate(b.date);
//     return da - db || a.type.localeCompare(b.type);
//   });

//   return ledger;
// }

// function buildProductsAgg(sales, products) {
//   const map = new Map();
//   for (const s of sales) {
//     const id   = String(s.productId ?? "");
//     const qty  = Number(s.quantity || 0);
//     const rev  = Number(s.total || 0);
//     const name = s.productName ?? "";
//     if (!id) continue;

//     const cur = map.get(id) || { id, name, totalSold: 0, totalRevenue: 0, lastSoldAt: null, brand: "N/A" };
//     cur.totalSold    += qty;
//     cur.totalRevenue += rev;

//     const sd = parseLocalDate(s.date);
//     cur.lastSoldAt = !cur.lastSoldAt || sd > parseLocalDate(cur.lastSoldAt) ? s.date : cur.lastSoldAt;

//     if (cur.brand === "N/A") {
//       const p = products.find((pp) => String(pp.id) === id);
//       if (p?.brand) cur.brand = p.brand;
//     }
//     map.set(id, cur);
//   }

//   const arr = Array.from(map.values());
//   const revenueTotal = arr.reduce((a, p) => a + p.totalRevenue, 0) || 1;
//   for (const p of arr) p.percentageOfTotal = (p.totalRevenue / revenueTotal) * 100;
//   return arr.sort((a,b) => b.totalRevenue - a.totalRevenue);
// }

// router.get("/", (req, res) => {
//   try {
//     const { from, to, search = "" } = req.query;

//     const products = readJson(productsFile);
//     const allSales = readJson(salesFile);
//     const allExp   = readJson(expensesFile);

//     const fromDate = from ? toStart(parseLocalDate(from)) : null;
//     const toDate   = to   ? toEnd(parseLocalDate(to))     : null;

//     // Filtra por período com parse local
//     let sales = allSales.filter((s) => inRange(parseLocalDate(s.date), fromDate, toDate));
//     let exp   = allExp.filter((e)   => inRange(parseLocalDate(e.date), fromDate, toDate));

//     // Busca
//     const q = String(search).trim().toLowerCase();
//     if (q) {
//       sales = sales.filter((s) =>
//         `${s.productName ?? ""} ${s.customerName ?? ""}`.toLowerCase().includes(q)
//       );
//       exp = exp.filter((e) => `${e.description ?? ""}`.toLowerCase().includes(q));
//     }

//     // Séries, agregados e ledger
//     const dailySales   = buildDailySeries(sales, fromDate, toDate);
//     const monthlySales = buildMonthlySeries(sales, fromDate, toDate);
//     const productsAgg  = buildProductsAgg(sales, products);
//     const ledger       = buildLedger(sales, exp);

//     const revenue  = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
//     const expenses = exp.reduce((sum, e)   => sum + Number(e.value || 0), 0);

//     res.json({
//       dailySales,
//       monthlySales,
//       products: productsAgg,
//       ledger, // vendas + despesas
//       totals: { revenue, expenses, net: revenue - expenses },
//     });
//   } catch (err) {
//     console.error("Error generating reports:", err);
//     res.status(500).json({ error: "Failed to generate reports data" });
//   }
// });

// export default router;



import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsFile = join(__dirname, "../data/products.json");
const salesFile    = join(__dirname, "../data/sales.json");
const expensesFile = join(__dirname, "../data/expenses.json");

const readJson = (p) => {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return raw?.trim() ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Parse "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm[:ss]" como horário LOCAL,
 * evitando que "YYYY-MM-DD" vire UTC 00:00 e caia no dia anterior.
 */
function parseLocalDate(val) {
  if (!val) return null;
  if (typeof val === "string") {
    const m = val.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/
    );
    if (m) {
      const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = m;
      return new Date(+y, +mo - 1, +d, +hh, +mm, +ss, 0); // local
    }
  }
  return new Date(val);
}

const toStart = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const toEnd   = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };
const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

function buildDailySeries(sales, fromDate, toDate) {
  let start = fromDate, end = toDate;
  if (!start || !end) {
    end = toStart(new Date());
    start = new Date(end);
    start.setDate(end.getDate() - 6);
  }
  start = toStart(start);
  end   = toEnd(end);

  const days = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return days.map((d) => {
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const daySales = sales.filter((s) => {
      const sd = parseLocalDate(s.date);
      return sd >= d && sd < next;
    });
    const total = daySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    return { date: d.toLocaleDateString("pt-BR"), total };
  });
}

function buildMonthlySeries(sales, startMonth, endMonth) {
  const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  // garante que são "primeiro dia do mês"
  const start = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
  const end   = new Date(endMonth.getFullYear(),   endMonth.getMonth(),   1);

  const months = [];
  const cur = new Date(start);
  while (cur <= end) {
    months.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  return months.map((m) => {
    const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    const msales = sales.filter((s) => {
      const sd = parseLocalDate(s.date);
      return sd >= m && sd < next;
    });
    const total = msales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    return { month: `${monthNames[m.getMonth()]}/${m.getFullYear()}`, total };
  });
}

function paymentSummary(pmArr = []) {
  if (!Array.isArray(pmArr) || pmArr.length === 0) return "";
  return pmArr
    .map(pm => `${pm.method}${pm.machine ? ` (${pm.machine})` : ""}: R$ ${Number(pm.amount || 0).toFixed(2)}`)
    .join(" | ");
}

function buildLedger(sales, expenses) {
  const ledger = [];

  // Vendas => entradas
  for (const s of sales) {
    ledger.push({
      id: `S-${s.id}`,
      date: s.date,
      type: "Venda",
      description: s.productName ?? "",
      customerName: s.customerName ?? "",
      payment: paymentSummary(s.paymentMethods),
      in: Number(s.total || 0),
      out: 0,
    });
  }

  // Despesas => saídas
  for (const e of expenses) {
    ledger.push({
      id: `E-${e.id}`,
      date: e.date,
      type: "Despesa",
      description: e.description ?? "",
      customerName: "",
      payment: "",
      in: 0,
      out: Number(e.value || 0),
    });
  }

  // Ordena por data local (asc) e depois por tipo
  ledger.sort((a, b) => {
    const da = parseLocalDate(a.date);
    const db = parseLocalDate(b.date);
    return da - db || a.type.localeCompare(b.type);
  });

  return ledger;
}

function buildProductsAgg(sales, products) {
  const map = new Map();
  for (const s of sales) {
    const id   = String(s.productId ?? "");
    const qty  = Number(s.quantity || 0);
    const rev  = Number(s.total || 0);
    const name = s.productName ?? "";
    if (!id) continue;

    const cur = map.get(id) || { id, name, totalSold: 0, totalRevenue: 0, lastSoldAt: null, brand: "N/A" };
    cur.totalSold    += qty;
    cur.totalRevenue += rev;

    const sd = parseLocalDate(s.date);
    cur.lastSoldAt = !cur.lastSoldAt || sd > parseLocalDate(cur.lastSoldAt) ? s.date : cur.lastSoldAt;

    if (cur.brand === "N/A") {
      const p = products.find((pp) => String(pp.id) === id);
      if (p?.brand) cur.brand = p.brand;
    }
    map.set(id, cur);
  }

  const arr = Array.from(map.values());
  const revenueTotal = arr.reduce((a, p) => a + p.totalRevenue, 0) || 1;
  for (const p of arr) p.percentageOfTotal = (p.totalRevenue / revenueTotal) * 100;
  return arr.sort((a,b) => b.totalRevenue - a.totalRevenue);
}

router.get("/", (req, res) => {
  try {
    const { from, to, search = "" } = req.query;

    const products = readJson(productsFile);
    const allSales = readJson(salesFile);
    const allExp   = readJson(expensesFile);

    // ===== período solicitado (para ledger, KPIs e daily) =====
    const fromDate = from ? toStart(parseLocalDate(from)) : null;
    const toDate   = to   ? toEnd(parseLocalDate(to))     : null;

    // Filtra vendas/despesas do período atual (ledger/KPIs/daily)
    let sales = allSales.filter((s) => inRange(parseLocalDate(s.date), fromDate, toDate));
    let exp   = allExp.filter((e)   => inRange(parseLocalDate(e.date), fromDate, toDate));

    // Busca (aplica nos dois contextos)
    const q = String(search).trim().toLowerCase();
    const salesSearchFilter = (s) =>
      `${s.productName ?? ""} ${s.customerName ?? ""}`.toLowerCase().includes(q);
    const expSearchFilter = (e) =>
      `${e.description ?? ""}`.toLowerCase().includes(q);

    if (q) {
      sales = sales.filter(salesSearchFilter);
      exp   = exp.filter(expSearchFilter);
    }

    // ===== série diária (usa o período filtrado) =====
    const dailySales = buildDailySeries(sales, fromDate, toDate);

    // ===== série mensal (sempre últimos 6 meses) =====
    // âncora: mês do "to" (se houver) ou mês atual
    const endAnchor = toDate ? new Date(toDate) : new Date();
    const endMonth  = new Date(endAnchor.getFullYear(), endAnchor.getMonth(), 1);
    const startMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - 5, 1);
    const endOfEndMonth = toEnd(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0));

    // base mensal: usar ALL SALES, filtradas só para a janela 6M e (se houver) pela busca
    let salesForMonthly = allSales.filter((s) =>
      inRange(parseLocalDate(s.date), startMonth, endOfEndMonth)
    );
    if (q) salesForMonthly = salesForMonthly.filter(salesSearchFilter);

    const monthlySales = buildMonthlySeries(salesForMonthly, startMonth, endMonth);

    // ===== agregados e ledger do período atual =====
    const productsAgg  = buildProductsAgg(sales, products);
    const ledger       = buildLedger(sales, exp);

    const revenue  = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    const expenses = exp.reduce((sum, e)   => sum + Number(e.value || 0), 0);

    res.json({
      dailySales,
      monthlySales,     // <- agora SEMPRE últimos 6 meses
      products: productsAgg,
      ledger,
      totals: { revenue, expenses, net: revenue - expenses },
    });
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).json({ error: "Failed to generate reports data" });
  }
});

export default router;

// import express from "express";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const productsFile  = join(__dirname, "../data/products.json");
// const salesFile     = join(__dirname, "../data/sales.json");
// const expensesFile  = join(__dirname, "../data/expenses.json");
// const servicesFile  = join(__dirname, "../data/services.json");

// const readJson = (p) => {
//   try {
//     const raw = fs.readFileSync(p, "utf8");
//     return raw?.trim() ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// };

// /** Parse local date */
// function parseLocalDate(val) {
//   if (!val) return null;
//   if (typeof val === "string") {
//     const m = val.match(
//       /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/
//     );
//     if (m) {
//       const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = m;
//       return new Date(+y, +mo - 1, +d, +hh, +mm, +ss, 0); // local
//     }
//   }
//   return new Date(val);
// }

// const toStart = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
// const toEnd   = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };
// const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

// /** Série DIÁRIA genérica */
// function buildDailySeriesGeneric(rows, fromDate, toDate, getValue) {
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
//     const dayRows = rows.filter((r) => {
//       const rd = parseLocalDate(r.date);
//       return rd >= d && rd < next;
//     });
//     const total = dayRows.reduce((sum, r) => sum + Number(getValue(r) || 0), 0);
//     return { date: d.toLocaleDateString("pt-BR"), total };
//   });
// }

// /** Série MENSAL genérica */
// function buildMonthlySeriesGeneric(rows, startMonth, endMonth, getValue) {
//   const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
//   const start = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
//   const end   = new Date(endMonth.getFullYear(),   endMonth.getMonth(),   1);

//   const months = [];
//   const cur = new Date(start);
//   while (cur <= end) {
//     months.push(new Date(cur));
//     cur.setMonth(cur.getMonth() + 1);
//   }

//   return months.map((m) => {
//     const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
//     const monthRows = rows.filter((r) => {
//       const rd = parseLocalDate(r.date);
//       return rd >= m && rd < next;
//     });
//     const total = monthRows.reduce((sum, r) => sum + Number(getValue(r) || 0), 0);
//     return { month: `${monthNames[m.getMonth()]}/${m.getFullYear()}`, total };
//   });
// }

// /** Formata pagamentos (array) e tem fallback para texto simples */
// function paymentSummary(pmArr = [], fallbackText = "") {
//   const arr = Array.isArray(pmArr) ? pmArr : [];
//   if (arr.length) {
//     return arr
//       .map((pm) => {
//         const inst = pm.installments ? ` ${String(pm.installments).replace(/x$/i, "")}x` : "";
//         const mach = pm.machine ? ` (${pm.machine})` : "";
//         const val  = `R$ ${Number(pm.amount || 0).toFixed(2)}`;
//         return `${pm.method}${mach}${inst}: ${val}`;
//       })
//       .join(" | ");
//   }
//   if (typeof fallbackText === "string" && fallbackText.trim()) return fallbackText;
//   return "";
// }

// function buildLedger(sales, expenses, services) {
//   const ledger = [];

//   // Vendas => entradas
//   for (const s of sales) {
//     ledger.push({
//       id: `S-${s.id}`,
//       date: s.date,
//       type: "Venda",
//       description: s.productName ?? "",
//       customerName: s.customerName ?? "",
//       payment: paymentSummary(s.paymentMethods ?? s.payments, s.payment),
//       in: Number(s.total || 0),
//       out: 0,
//     });
//   }

//   // Serviços => entradas
//   for (const sv of services) {
//     ledger.push({
//       id: `SV-${sv.id}`,
//       date: sv.date,
//       type: "Serviço",
//       description: sv.description ?? "",
//       customerName: sv.employee ?? "",
//       payment: paymentSummary(sv.paymentMethods ?? sv.payments, sv.payment),
//       in: Number(sv.value || 0),
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

//   // Ordena
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

//     const products  = readJson(productsFile);
//     const allSales  = readJson(salesFile);
//     const allExp    = readJson(expensesFile);
//     const allServ   = readJson(servicesFile);

//     // período
//     const fromDate = from ? toStart(parseLocalDate(from)) : null;
//     const toDate   = to   ? toEnd(parseLocalDate(to))     : null;

//     // filtro período
//     let sales = allSales.filter((s)  => inRange(parseLocalDate(s.date),  fromDate, toDate));
//     let exp   = allExp.filter((e)    => inRange(parseLocalDate(e.date),  fromDate, toDate));
//     let serv  = allServ.filter((sv)  => inRange(parseLocalDate(sv.date), fromDate, toDate));

//     // busca
//     const q = String(search).trim().toLowerCase();
//     const salesSearchFilter = (s) =>
//       `${s.productName ?? ""} ${s.customerName ?? ""}`.toLowerCase().includes(q);
//     const expSearchFilter = (e) =>
//       `${e.description ?? ""}`.toLowerCase().includes(q);
//     const servSearchFilter = (sv) =>
//       `${sv.description ?? ""} ${sv.employee ?? ""}`.toLowerCase().includes(q);

//     if (q) {
//       sales = sales.filter(salesSearchFilter);
//       exp   = exp.filter(expSearchFilter);
//       serv  = serv.filter(servSearchFilter);
//     }

//     // séries diárias
//     const dailySales     = buildDailySeriesGeneric(sales, fromDate, toDate, (r) => r.total);
//     const dailyServices  = buildDailySeriesGeneric(serv,  fromDate, toDate, (r) => r.value);
//     const dailyExpenses  = buildDailySeriesGeneric(exp,   fromDate, toDate, (r) => r.value); // ⬅️ NOVO

//     // últimos 6 meses
//     const endAnchor = toDate ? new Date(toDate) : new Date();
//     const endMonth  = new Date(endAnchor.getFullYear(), endAnchor.getMonth(), 1);
//     const startMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - 5, 1);
//     const endOfEndMonth = toEnd(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0));

//     let salesForMonthly = allSales.filter((s) =>
//       inRange(parseLocalDate(s.date), startMonth, endOfEndMonth)
//     );
//     let servForMonthly  = allServ.filter((sv) =>
//       inRange(parseLocalDate(sv.date), startMonth, endOfEndMonth)
//     );
//     let expForMonthly   = allExp.filter((e) =>
//       inRange(parseLocalDate(e.date), startMonth, endOfEndMonth)
//     ); // ⬅️ NOVO

//     if (q) {
//       salesForMonthly = salesForMonthly.filter(salesSearchFilter);
//       servForMonthly  = servForMonthly.filter(servSearchFilter);
//       expForMonthly   = expForMonthly.filter(expSearchFilter); // ⬅️ NOVO
//     }

//     const monthlySales     = buildMonthlySeriesGeneric(salesForMonthly, startMonth, endMonth, (r) => r.total);
//     const monthlyServices  = buildMonthlySeriesGeneric(servForMonthly,  startMonth, endMonth, (r) => r.value);
//     const monthlyExpenses  = buildMonthlySeriesGeneric(expForMonthly,   startMonth, endMonth, (r) => r.value); // ⬅️ NOVO

//     // ledger + totais do período atual
//     const productsAgg = buildProductsAgg(sales, products);
//     const ledger      = buildLedger(sales, exp, serv);

//     const revenueSales    = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
//     const revenueServices = serv.reduce((sum, s) => sum + Number(s.value || 0), 0);
//     const expenses        = exp.reduce((sum, e)   => sum + Number(e.value || 0), 0);
//     const revenueTotal    = revenueSales + revenueServices;

//     res.json({
//       dailySales,
//       dailyServices,
//       dailyExpenses,      // ⬅️ NOVO
//       monthlySales,
//       monthlyServices,
//       monthlyExpenses,    // ⬅️ NOVO
//       products: productsAgg,
//       ledger,
//       totals: {
//         revenueSales,
//         revenueServices,
//         revenue: revenueTotal,
//         expenses,
//         net: revenueTotal - expenses,
//       },
//     });
//   } catch (err) {
//     console.error("Error generating reports:", err);
//     res.status(500).json({ error: "Failed to generate reports data" });
//   }
// });

// export default router;




// server/routes/reports.js
import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

function parseLocalDate(val) {
  if (!val) return null;
  if (typeof val === "string") {
    const m = val.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (m) {
      const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = m;
      return new Date(+y, +mo - 1, +d, +hh, +mm, +ss, 0);
    }
  }
  return new Date(val);
}
const toStart = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const toEnd   = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };
const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

function buildDailySeriesGeneric(rows, fromDate, toDate, getValue) {
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
    const dayRows = rows.filter((r) => {
      const rd = parseLocalDate(r.date);
      return rd >= d && rd < next;
    });
    const total = dayRows.reduce((sum, r) => sum + Number(getValue(r) || 0), 0);
    return { date: d.toLocaleDateString("pt-BR"), total };
  });
}

function buildMonthlySeriesGeneric(rows, startMonth, endMonth, getValue) {
  const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
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
    const monthRows = rows.filter((r) => {
      const rd = parseLocalDate(r.date);
      return rd >= m && rd < next;
    });
    const total = monthRows.reduce((sum, r) => sum + Number(getValue(r) || 0), 0);
    return { month: `${monthNames[m.getMonth()]}/${m.getFullYear()}`, total };
  });
}

function paymentSummary(pmArr = [], fallbackText = "") {
  const arr = Array.isArray(pmArr) ? pmArr : [];
  if (arr.length) {
    return arr
      .map((pm) => {
        const inst = pm.installments ? ` ${String(pm.installments).replace(/x$/i, "")}x` : "";
        const mach = pm.machine ? ` (${pm.machine})` : "";
        const val  = `R$ ${Number(pm.amount || 0).toFixed(2)}`;
        return `${pm.method}${mach}${inst}: ${val}`;
      })
      .join(" | ");
  }
  if (typeof fallbackText === "string" && fallbackText.trim()) return fallbackText;
  return "";
}

function getPaymentsForSale(saleId) {
  const rows = db.prepare(`SELECT * FROM payments WHERE sale_id=?`).all(saleId);
  return rows.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }));
}

router.get("/", (req, res) => {
  try {
    const { from, to, search = "" } = req.query;
    const fromDate = from ? toStart(parseLocalDate(from)) : null;
    const toDate   = to   ? toEnd(parseLocalDate(to)) : null;
    const q = String(search).trim().toLowerCase();

    // --- dados brutos ---
    const salesRows = db.prepare(`
      SELECT s.id AS sale_id, s.date, s.customer_name,
             si.product_name, si.total
      FROM sales s
      JOIN sales_items si ON si.sale_id = s.id
    `).all();

    const servicesRows = db.prepare(`SELECT * FROM services`).all();
    const expensesRows = db.prepare(`SELECT * FROM expenses`).all();
    const productsRows = db.prepare(`SELECT * FROM products`).all();

    // filtros período/busca
    const sales = salesRows.filter((r) => inRange(parseLocalDate(r.date), fromDate, toDate) &&
      (`${r.product_name ?? ""} ${r.customer_name ?? ""}`.toLowerCase().includes(q)));
    const servs = servicesRows.filter((r) => inRange(parseLocalDate(r.date), fromDate, toDate) &&
      (`${r.description ?? ""} ${r.employee ?? ""}`.toLowerCase().includes(q)));
    const exps  = expensesRows.filter((r) => inRange(parseLocalDate(r.date), fromDate, toDate) &&
      (`${r.description ?? ""}`.toLowerCase().includes(q)));

    // séries diárias
    const dailySales     = buildDailySeriesGeneric(sales, fromDate, toDate, (r) => r.total);
    const dailyServices  = buildDailySeriesGeneric(servs, fromDate, toDate, (r) => r.value);
    const dailyExpenses  = buildDailySeriesGeneric(exps,  fromDate, toDate, (r) => r.value);

    // últimos 6 meses
    const endAnchor = toDate ? new Date(toDate) : new Date();
    const endMonth  = new Date(endAnchor.getFullYear(), endAnchor.getMonth(), 1);
    const startMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - 5, 1);
    const endOfEndMonth = toEnd(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0));

    const salesForMonthly = salesRows.filter((r) => inRange(parseLocalDate(r.date), startMonth, endOfEndMonth) &&
      (`${r.product_name ?? ""} ${r.customer_name ?? ""}`.toLowerCase().includes(q)));
    const servForMonthly  = servicesRows.filter((r) => inRange(parseLocalDate(r.date), startMonth, endOfEndMonth) &&
      (`${r.description ?? ""} ${r.employee ?? ""}`.toLowerCase().includes(q)));
    const expForMonthly   = expensesRows.filter((r) => inRange(parseLocalDate(r.date), startMonth, endOfEndMonth) &&
      (`${r.description ?? ""}`.toLowerCase().includes(q)));

    const monthlySales     = buildMonthlySeriesGeneric(salesForMonthly, startMonth, endMonth, (r) => r.total);
    const monthlyServices  = buildMonthlySeriesGeneric(servForMonthly,  startMonth, endMonth, (r) => r.value);
    const monthlyExpenses  = buildMonthlySeriesGeneric(expForMonthly,   startMonth, endMonth, (r) => r.value);

    // produtos agregados
    const productsAggMap = new Map();
    for (const row of db.prepare(`
      SELECT si.product_id AS id, si.product_name AS name, s.date, si.total, si.quantity
      FROM sales_items si JOIN sales s ON s.id = si.sale_id
    `).all()) {
      const id = String(row.id || "");
      if (!id) continue;
      const cur = productsAggMap.get(id) || { id, name: row.name, totalSold: 0, totalRevenue: 0, lastSoldAt: null, brand: "N/A" };
      cur.totalSold += Number(row.quantity || 0);
      cur.totalRevenue += Number(row.total || 0);
      cur.lastSoldAt = !cur.lastSoldAt || parseLocalDate(row.date) > parseLocalDate(cur.lastSoldAt) ? row.date : cur.lastSoldAt;
      productsAggMap.set(id, cur);
    }
    const brandById = new Map(productsRows.map((p) => [String(p.id), p.brand || "N/A"]));
    const productsAgg = [...productsAggMap.values()]
      .map((p) => ({ ...p, brand: brandById.get(p.id) ?? p.brand }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
    const revenueTotalAgg = productsAgg.reduce((a, b) => a + b.totalRevenue, 0) || 1;
    for (const p of productsAgg) p.percentageOfTotal = (p.totalRevenue / revenueTotalAgg) * 100;

    // ledger
    const ledger = [];

    // VENDAS
    const saleItemRows = db.prepare(`
      SELECT s.id AS sale_id, s.date, s.customer_name, si.product_name, si.total
      FROM sales s JOIN sales_items si ON si.sale_id = s.id
    `).all();
    for (const s of saleItemRows) {
      const pays = getPaymentsForSale(s.sale_id);
      ledger.push({
        id: `S-${s.sale_id}`,
        date: s.date,
        type: "Venda",
        description: s.product_name ?? "",
        customerName: s.customer_name ?? "",
        payment: paymentSummary(pays),
        in: Number(s.total || 0), out: 0
      });
    }

    // SERVIÇOS
    const servicePaysStmt = db.prepare(`SELECT * FROM payments WHERE service_id=?`);
    for (const sv of servicesRows) {
      const pays = servicePaysStmt.all(sv.id);
      ledger.push({
        id: `SV-${sv.id}`,
        date: sv.date,
        type: "Serviço",
        description: sv.description ?? "",
        customerName: sv.employee ?? "",
        payment: paymentSummary(pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" })), sv.payment ?? ""),
        in: Number(sv.value || 0), out: 0
      });
    }

    // DESPESAS
    for (const e of expensesRows) {
      ledger.push({
        id: `E-${e.id}`,
        date: e.date,
        type: "Despesa",
        description: e.description ?? "",
        customerName: "",
        payment: "",
        in: 0, out: Number(e.value || 0)
      });
    }

    ledger.sort((a, b) => {
      const da = parseLocalDate(a.date); const dbb = parseLocalDate(b.date);
      return da - dbb || a.type.localeCompare(b.type);
    });

    const revenueSales = sales.reduce((sum, r) => sum + Number(r.total || 0), 0);
    const revenueServices = servs.reduce((sum, r) => sum + Number(r.value || 0), 0);
    const expenses = exps.reduce((sum, r) => sum + Number(r.value || 0), 0);
    const revenue = revenueSales + revenueServices;

    res.json({
      dailySales, dailyServices, dailyExpenses,
      monthlySales, monthlyServices, monthlyExpenses,
      products: productsAgg,
      ledger,
      totals: {
        revenueSales, revenueServices, revenue, expenses, net: revenue - expenses
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate reports data" });
  }
});

export default router;

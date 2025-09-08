import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsFile  = join(__dirname, "../data/products.json");
const salesFile     = join(__dirname, "../data/sales.json");
const expensesFile  = join(__dirname, "../data/expenses.json");
const servicesFile  = join(__dirname, "../data/services.json");

const readJson = (p) => {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return raw?.trim() ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Parse local date */
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

/** Série DIÁRIA genérica */
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

/** Série MENSAL genérica */
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

/** Formata pagamentos (array) e tem fallback para texto simples */
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

function buildLedger(sales, expenses, services) {
  const ledger = [];

  // Vendas => entradas
  for (const s of sales) {
    ledger.push({
      id: `S-${s.id}`,
      date: s.date,
      type: "Venda",
      description: s.productName ?? "",
      customerName: s.customerName ?? "",
      payment: paymentSummary(s.paymentMethods ?? s.payments, s.payment),
      in: Number(s.total || 0),
      out: 0,
    });
  }

  // Serviços => entradas
  for (const sv of services) {
    ledger.push({
      id: `SV-${sv.id}`,
      date: sv.date,
      type: "Serviço",
      description: sv.description ?? "",
      customerName: sv.employee ?? "",
      payment: paymentSummary(sv.paymentMethods ?? sv.payments, sv.payment),
      in: Number(sv.value || 0),
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

  // Ordena
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

    const products  = readJson(productsFile);
    const allSales  = readJson(salesFile);
    const allExp    = readJson(expensesFile);
    const allServ   = readJson(servicesFile);

    // período
    const fromDate = from ? toStart(parseLocalDate(from)) : null;
    const toDate   = to   ? toEnd(parseLocalDate(to))     : null;

    // filtro período
    let sales = allSales.filter((s)  => inRange(parseLocalDate(s.date),  fromDate, toDate));
    let exp   = allExp.filter((e)    => inRange(parseLocalDate(e.date),  fromDate, toDate));
    let serv  = allServ.filter((sv)  => inRange(parseLocalDate(sv.date), fromDate, toDate));

    // busca
    const q = String(search).trim().toLowerCase();
    const salesSearchFilter = (s) =>
      `${s.productName ?? ""} ${s.customerName ?? ""}`.toLowerCase().includes(q);
    const expSearchFilter = (e) =>
      `${e.description ?? ""}`.toLowerCase().includes(q);
    const servSearchFilter = (sv) =>
      `${sv.description ?? ""} ${sv.employee ?? ""}`.toLowerCase().includes(q);

    if (q) {
      sales = sales.filter(salesSearchFilter);
      exp   = exp.filter(expSearchFilter);
      serv  = serv.filter(servSearchFilter);
    }

    // séries
    const dailySales    = buildDailySeriesGeneric(sales, fromDate, toDate, (r) => r.total);
    const dailyServices = buildDailySeriesGeneric(serv,  fromDate, toDate, (r) => r.value);

    // últimos 6 meses
    const endAnchor = toDate ? new Date(toDate) : new Date();
    const endMonth  = new Date(endAnchor.getFullYear(), endAnchor.getMonth(), 1);
    const startMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - 5, 1);
    const endOfEndMonth = toEnd(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0));

    let salesForMonthly = allSales.filter((s) =>
      inRange(parseLocalDate(s.date), startMonth, endOfEndMonth)
    );
    let servForMonthly  = allServ.filter((sv) =>
      inRange(parseLocalDate(sv.date), startMonth, endOfEndMonth)
    );
    if (q) {
      salesForMonthly = salesForMonthly.filter(salesSearchFilter);
      servForMonthly  = servForMonthly.filter(servSearchFilter);
    }

    const monthlySales    = buildMonthlySeriesGeneric(salesForMonthly, startMonth, endMonth, (r) => r.total);
    const monthlyServices = buildMonthlySeriesGeneric(servForMonthly,  startMonth, endMonth, (r) => r.value);

    // ledger + totais
    const productsAgg = buildProductsAgg(sales, products);
    const ledger      = buildLedger(sales, exp, serv);

    const revenueSales    = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    const revenueServices = serv.reduce((sum, s) => sum + Number(s.value || 0), 0);
    const expenses        = exp.reduce((sum, e)   => sum + Number(e.value || 0), 0);
    const revenueTotal    = revenueSales + revenueServices;

    res.json({
      dailySales,
      dailyServices,
      monthlySales,
      monthlyServices,
      products: productsAgg,
      ledger,
      totals: {
        revenueSales,
        revenueServices,
        revenue: revenueTotal,
        expenses,
        net: revenueTotal - expenses,
      },
    });
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).json({ error: "Failed to generate reports data" });
  }
});

export default router;

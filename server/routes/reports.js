import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

/* Helpers */
const clampIso = (s, fallback) => (typeof s === "string" && s.trim() ? s.trim() : fallback);
const toStart = (d) => `${d}T00:00:00`;
const toEnd = (d) => `${d}T23:59:59`;

/* Monta string de pagamento a partir de payments.* */
function buildPaymentsIndex() {
  const bySale = new Map();
  const byService = new Map();

  const rows = db
    .prepare(
      `SELECT sale_id, service_id, method, machine, amount
         FROM payments`
    )
    .all();

  const push = (map, key, txt) => {
    if (!key) return;
    const cur = map.get(key) || [];
    cur.push(txt);
    map.set(key, cur);
  };

  for (const r of rows) {
    const part = `${r.method}${r.machine ? ` (${r.machine})` : ""}: ${Number(
      r.amount || 0
    ).toFixed(2)}`;
    if (r.sale_id) push(bySale, String(r.sale_id), part);
    if (r.service_id) push(byService, Number(r.service_id), part);
  }

  const joiner = (arr) => (arr && arr.length ? arr.join(" | ") : null);
  const saleText = (id) => joiner(bySale.get(String(id)));
  const serviceText = (id) => joiner(byService.get(Number(id)));

  return { saleText, serviceText };
}

/* KPIs diários (dentro do período) */
function dailyAggSales(from, to) {
  return db
    .prepare(
      `SELECT substr(date,1,10) AS date, SUM(total) AS total
         FROM sales
        WHERE date BETWEEN @from AND @to
        GROUP BY substr(date,1,10)
        ORDER BY date`
    )
    .all({ from, to });
}
function dailyAggServices(from, to) {
  return db
    .prepare(
      `SELECT substr(created_at,1,10) AS date, SUM(value) AS total
         FROM services
        WHERE created_at BETWEEN @from AND @to
        GROUP BY substr(created_at,1,10)
        ORDER BY date`
    )
    .all({ from, to });
}
function dailyAggExpenses(from, to) {
  return db
    .prepare(
      `SELECT substr(created_at,1,10) AS date, SUM(value) AS total
         FROM expenses
        WHERE created_at BETWEEN @from AND @to
        GROUP BY substr(created_at,1,10)
        ORDER BY date`
    )
    .all({ from, to });
}

/* KPIs mensais (últimos 6 meses a partir do fim do período atual) */
function monthlyAggSales(lastMonthIso) {
  return db
    .prepare(
      `SELECT substr(date,1,7) AS month, SUM(total) AS total
         FROM sales
        WHERE substr(date,1,7) >= @minMonth AND substr(date,1,7) <= @maxMonth
        GROUP BY substr(date,1,7)
        ORDER BY month`
    )
    .all(lastMonthIso);
}
function monthlyAggServices(lastMonthIso) {
  return db
    .prepare(
      `SELECT substr(created_at,1,7) AS month, SUM(value) AS total
         FROM services
        WHERE substr(created_at,1,7) >= @minMonth AND substr(created_at,1,7) <= @maxMonth
        GROUP BY substr(created_at,1,7)
        ORDER BY month`
    )
    .all(lastMonthIso);
}
function monthlyAggExpenses(lastMonthIso) {
  return db
    .prepare(
      `SELECT substr(created_at,1,7) AS month, SUM(value) AS total
         FROM expenses
        WHERE substr(created_at,1,7) >= @minMonth AND substr(created_at,1,7) <= @maxMonth
        GROUP BY substr(created_at,1,7)
        ORDER BY month`
    )
    .all(lastMonthIso);
}

/* Totais do período */
function kpiTotals(from, to) {
  const { revenueSales } = db
    .prepare(
      `SELECT COALESCE(SUM(total),0) AS revenueSales
         FROM sales
        WHERE date BETWEEN @from AND @to`
    )
    .get({ from, to });

  const { revenueServices } = db
    .prepare(
      `SELECT COALESCE(SUM(value),0) AS revenueServices
         FROM services
        WHERE created_at BETWEEN @from AND @to`
    )
    .get({ from, to });

  const { expenses } = db
    .prepare(
      `SELECT COALESCE(SUM(value),0) AS expenses
         FROM expenses
        WHERE created_at BETWEEN @from AND @to`
    )
    .get({ from, to });

  const revenue = Number(revenueSales) + Number(revenueServices);
  const net = revenue - Number(expenses);

  return {
    revenueSales: Number(revenueSales) || 0,
    revenueServices: Number(revenueServices) || 0,
    revenue: Number(revenue) || 0,
    expenses: Number(expenses) || 0,
    net: Number(net) || 0,
  };
}

/* Ledger unificado: vendas (date), serviços (created_at), despesas (created_at) */
function buildLedger(from, to, search = "") {
  const like = `%${String(search).trim().toLowerCase()}%`;
  const { saleText, serviceText } = buildPaymentsIndex();

  // VENDAS
  const sales = db
    .prepare(
      `SELECT s.id, s.date, s.customer_name, s.total
         FROM sales s
        WHERE s.date BETWEEN @from AND @to
          AND (@has = 0 OR (
                LOWER(COALESCE(s.customer_name,'')) LIKE @like
              ))
        ORDER BY datetime(s.date) ASC, s.id ASC`
    )
    .all({ from, to, has: search ? 1 : 0, like });

  // SERVIÇOS (usa created_at como data)
  const services = db
    .prepare(
      `SELECT sv.id, sv.description, sv.value, sv.payment, sv.created_at
         FROM services sv
        WHERE sv.created_at BETWEEN @from AND @to
          AND (@has = 0 OR (
                LOWER(COALESCE(sv.description,'')) LIKE @like
              ))
        ORDER BY datetime(sv.created_at) ASC, sv.id ASC`
    )
    .all({ from, to, has: search ? 1 : 0, like });

  // DESPESAS (usa created_at como data)
  const expenses = db
    .prepare(
      `SELECT e.id, e.description, e.value, e.created_at
         FROM expenses e
        WHERE e.created_at BETWEEN @from AND @to
          AND (@has = 0 OR (
                LOWER(COALESCE(e.description,'')) LIKE @like
              ))
        ORDER BY datetime(e.created_at) ASC, e.id ASC`
    )
    .all({ from, to, has: search ? 1 : 0, like });

  const ledger = [];

  for (const s of sales) {
    ledger.push({
      id: `sale:${s.id}`,
      type: "sale",
      date: s.date, // Mantém sales.date
      description: "Venda",
      customerName: s.customer_name || null,
      payment: saleText(s.id) || null,
      in: Number(s.total || 0),
      out: 0,
    });
  }

  for (const sv of services) {
    const pay = serviceText(sv.id) || (sv.payment ? String(sv.payment) : null);
    ledger.push({
      id: `service:${sv.id}`,
      type: "service",
      date: sv.created_at, // <- AQUI: usar created_at como data
      description: sv.description || "Serviço",
      customerName: null,
      payment: pay,
      in: Number(sv.value || 0),
      out: 0,
    });
  }

  for (const e of expenses) {
    ledger.push({
      id: `expense:${e.id}`,
      type: "expense",
      date: e.created_at, // <- AQUI: usar created_at como data
      description: e.description || "Despesa",
      customerName: null,
      payment: null,
      in: 0,
      out: Number(e.value || 0),
    });
  }

  // front já reordena, mas enviamos ordenado por data crescente
  ledger.sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() ||
      String(a.type).localeCompare(String(b.type)) ||
      String(a.id).localeCompare(String(b.id))
  );

  return ledger;
}

/* Month window helper (últimos 6 meses) */
function sixMonthWindow(endDateIso /* YYYY-MM-DDTHH:mm:ss */) {
  const end = new Date(endDateIso || new Date());
  const y = end.getFullYear();
  const m = end.getMonth() + 1;
  const mm = (n) => String(n).padStart(2, "0");
  const maxMonth = `${y}-${mm(m)}`;
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() - 5);
  const minMonth = `${d.getFullYear()}-${mm(d.getMonth() + 1)}`;
  return { minMonth, maxMonth };
}

/* ===================== ROTA ===================== */
router.get("/", (req, res) => {
  try {
    // período
    const qFrom = clampIso(req.query.from, toStart(new Date().toISOString().slice(0, 10)));
    const qTo = clampIso(req.query.to, toEnd(new Date().toISOString().slice(0, 10)));
    const search = String(req.query.search || "");

    const from = qFrom;
    const to = qTo;

    // Totais do período
    const totals = kpiTotals(from, to);

    // Séries diárias (dentro do período)
    const dailySales = dailyAggSales(from, to);
    const dailyServices = dailyAggServices(from, to);
    const dailyExpenses = dailyAggExpenses(from, to);

    // Séries mensais (últimos 6 meses até o fim do período atual)
    const window = sixMonthWindow(to);
    const monthlySales = monthlyAggSales(window);
    const monthlyServices = monthlyAggServices(window);
    const monthlyExpenses = monthlyAggExpenses(window);

    // Ledger unificado
    const ledger = buildLedger(from, to, search);

    res.json({
      dailySales,
      dailyServices,
      dailyExpenses,
      monthlySales,
      monthlyServices,
      monthlyExpenses,
      ledger,
      totals,
    });
  } catch (e) {
    console.error("Erro em /reports:", e);
    res.status(500).json({ error: "Erro ao montar relatórios" });
  }
});

export default router;

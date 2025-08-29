// import express from "express"
// import fs from "fs"
// import { fileURLToPath } from "url"
// import { dirname, join } from "path"

// const router = express.Router()

// // Get the directory name
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const productsFile = join(__dirname, "../data/products.json")
// const salesFile = join(__dirname, "../data/sales.json")

// // Get reports data
// router.get("/", (req, res) => {
//   try {
//     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
//     const sales = JSON.parse(fs.readFileSync(salesFile, "utf8"))

//     // Daily sales for the last 7 days
//     const dailySales = getDailySales(sales, 7)

//     // Monthly sales for the last 6 months
//     const monthlySales = getMonthlySales(sales, 6)

//     // Top selling products
//     const topProducts = getTopProducts(sales, products)

//     const reportsData = {
//       dailySales,
//       monthlySales,
//       topProducts,
//     }

//     res.json(reportsData)
//   } catch (error) {
//     console.error("Error generating reports data:", error)
//     res.status(500).json({ error: "Failed to generate reports data" })
//   }
// })

// // Helper function to get daily sales
// function getDailySales(sales, days) {
//   const result = []
//   const today = new Date()

//   for (let i = days - 1; i >= 0; i--) {
//     const date = new Date(today)
//     date.setDate(date.getDate() - i)
//     date.setHours(0, 0, 0, 0)

//     const nextDate = new Date(date)
//     nextDate.setDate(nextDate.getDate() + 1)

//     const daySales = sales.filter((sale) => {
//       const saleDate = new Date(sale.date)
//       return saleDate >= date && saleDate < nextDate
//     })

//     const total = daySales.reduce((sum, sale) => sum + sale.total, 0)

//     result.push({
//       date: date.toLocaleDateString("pt-BR"),
//       total,
//     })
//   }

//   return result
// }

// // Helper function to get monthly sales
// function getMonthlySales(sales, months) {
//   const result = []
//   const today = new Date()

//   for (let i = months - 1; i >= 0; i--) {
//     const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
//     const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)

//     const monthSales = sales.filter((sale) => {
//       const saleDate = new Date(sale.date)
//       return saleDate >= date && saleDate < nextMonth
//     })

//     const total = monthSales.reduce((sum, sale) => sum + sale.total, 0)

//     const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

//     result.push({
//       month: `${monthNames[date.getMonth()]}/${date.getFullYear()}`,
//       total,
//     })
//   }

//   return result
// }

// // Helper function to get top products
// function getTopProducts(sales, products) {
//   const productSales = {}

//   // Calculate total sales for each product
//   sales.forEach((sale) => {
//     if (!productSales[sale.productId]) {
//       productSales[sale.productId] = {
//         id: sale.productId,
//         name: sale.productName,
//         totalSold: 0,
//         totalRevenue: 0,
//       }
//     }
//     productSales[sale.productId].totalSold += sale.quantity
//     productSales[sale.productId].totalRevenue += sale.total
//   })

//   // Add brand information
//   const topProducts = Object.values(productSales).map((item) => {
//     const product = products.find((p) => p.id === item.id)
//     return {
//       ...item,
//       brand: product ? product.brand : "N/A",
//     }
//   })

//   // Calculate total revenue
//   const totalRevenue = topProducts.reduce((sum, product) => sum + product.totalRevenue, 0)

//   // Add percentage of total
//   topProducts.forEach((product) => {
//     product.percentageOfTotal = (product.totalRevenue / totalRevenue) * 100
//   })

//   // Sort by revenue and return top 10
//   return topProducts.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)
// }

// export default router



// routes/reports.js
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
      const sd = new Date(s.date);
      return sd >= d && sd < next;
    });
    const total = daySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    return { date: d.toLocaleDateString("pt-BR"), total };
  });
}

function buildMonthlySeries(sales, fromDate, toDate) {
  const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  let start = fromDate, end = toDate;
  if (!start || !end) {
    end = new Date(); end.setDate(1);
    start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
  } else {
    start = new Date(start.getFullYear(), start.getMonth(), 1);
    end   = new Date(end.getFullYear(),   end.getMonth(),   1);
  }

  const months = [];
  const cur = new Date(start);
  while (cur <= end) {
    months.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  return months.map((m) => {
    const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    const msales = sales.filter((s) => {
      const sd = new Date(s.date);
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
      customerName: "", // fornecedor (se tiver, adapte seu schema)
      payment: "",
      in: 0,
      out: Number(e.value || 0),
    });
  }

  // Ordena por data (asc) e, depois, por tipo (para manter estável)
  ledger.sort((a, b) => new Date(a.date) - new Date(b.date) || a.type.localeCompare(b.type));
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
    cur.lastSoldAt    = !cur.lastSoldAt || new Date(s.date) > new Date(cur.lastSoldAt) ? s.date : cur.lastSoldAt;

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

    const fromDate = from ? toStart(new Date(from)) : null;
    const toDate   = to   ? toEnd(new Date(to))     : null;

    // Filtra por período
    let sales = allSales.filter((s) => inRange(new Date(s.date), fromDate, toDate));
    let exp   = allExp.filter((e)   => inRange(new Date(e.date), fromDate, toDate));

    // Busca
    const q = String(search).trim().toLowerCase();
    if (q) {
      sales = sales.filter((s) =>
        `${s.productName ?? ""} ${s.customerName ?? ""}`.toLowerCase().includes(q)
      );
      exp = exp.filter((e) => `${e.description ?? ""}`.toLowerCase().includes(q));
    }

    // Séries, agregados e ledger
    const dailySales   = buildDailySeries(sales, fromDate, toDate);
    const monthlySales = buildMonthlySeries(sales, fromDate, toDate);
    const productsAgg  = buildProductsAgg(sales, products);
    const ledger       = buildLedger(sales, exp);

    const revenue  = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    const expenses = exp.reduce((sum, e)   => sum + Number(e.value || 0), 0);

    res.json({
      dailySales,
      monthlySales,
      products: productsAgg,  // mantido para quem quiser usar
      ledger,                 // <- NOVO: fluxo de caixa (vendas + despesas)
      totals: { revenue, expenses, net: revenue - expenses },
    });
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).json({ error: "Failed to generate reports data" });
  }
});

export default router;

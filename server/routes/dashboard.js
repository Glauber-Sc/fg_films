// import express from "express"
// import fs from "fs"
// import { fileURLToPath } from "url"
// import { dirname, join } from "path"

// const router = express.Router()

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const productsFile = join(__dirname, "../data/products.json")
// const salesFile = join(__dirname, "../data/sales.json")

// // Parse "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm[:ss]" como horário LOCAL
// function parseLocalDate(val) {
//   if (!val) return null
//   if (typeof val === "string") {
//     const m = val.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/)
//     if (m) {
//       const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = m
//       return new Date(+y, +mo - 1, +d, +hh, +mm, +ss, 0) // local
//     }
//   }
//   return new Date(val)
// }

// router.get("/", (req, res) => {
//   try {
//     const products = JSON.parse(fs.readFileSync(productsFile, "utf8") || "[]")
//     const sales = JSON.parse(fs.readFileSync(salesFile, "utf8") || "[]")

//     // ==== HOJE (00:00:00 até 23:59:59 - horário local do servidor) ====
//     const now = new Date()
//     const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
//     const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

//     const salesToday = sales.filter((sale) => {
//       const sd = parseLocalDate(sale.date)
//       return sd >= startOfToday && sd <= endOfToday
//     })

//     const totalSales = salesToday.length
//     const revenue = salesToday.reduce((sum, sale) => sum + Number(sale.total || 0), 0)

//     // Produtos com estoque baixo
//     const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5).length

//     // Vendas recentes (últimas 5 no geral — mantido)
//     const recentSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

//     // Detalhes de estoque baixo (top 5)
//     const lowStockItems = products
//       .filter((product) => Number(product.stock || 0) <= 5)
//       .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
//       .slice(0, 5)

//     // Top produtos (no geral — mantido)
//     const productSales = {}
//     sales.forEach((sale) => {
//       if (!productSales[sale.productId]) {
//         productSales[sale.productId] = {
//           id: sale.productId,
//           name: sale.productName,
//           totalSold: 0,
//           totalRevenue: 0,
//         }
//       }
//       productSales[sale.productId].totalSold += Number(sale.quantity || 0)
//       productSales[sale.productId].totalRevenue += Number(sale.total || 0)
//     })

//     const topProducts = Object.values(productSales)
//       .map((item) => {
//         const product = products.find((p) => p.id === item.id)
//         return {
//           ...item,
//           brand: product ? product.brand : "N/A",
//         }
//       })
//       .sort((a, b) => b.totalRevenue - a.totalRevenue)
//       .slice(0, 5)

//     const dashboardData = {
//       totalProducts: products.length,
//       totalSales,     // <- agora do DIA
//       revenue,        // <- agora do DIA
//       lowStockProducts,
//       recentSales,
//       lowStockItems,
//       topProducts,
//     }

//     res.json(dashboardData)
//   } catch (error) {
//     console.error("Error generating dashboard data:", error)
//     res.status(500).json({ error: "Failed to generate dashboard data" })
//   }
// })

// export default router



// server/routes/dashboard.js
import express from "express";
import { db } from "../db/index.js";

const router = express.Router();

function startOfToday() {
  const d = new Date(); d.setHours(0,0,0,0);
  return d;
}
function endOfToday() {
  const d = new Date(); d.setHours(23,59,59,999);
  return d;
}
function toISO(d) {
  const pad = (n) => String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

router.get("/", (req, res) => {
  try {
    const from = toISO(startOfToday());
    const to   = toISO(endOfToday());

    // vendas de HOJE (contando itens)
    const today = db.prepare(`
      SELECT COUNT(*) AS totalSales, COALESCE(SUM(si.total),0) AS revenue
      FROM sales s
      JOIN sales_items si ON si.sale_id = s.id
      WHERE s.date BETWEEN ? AND ?
    `).get(from, to);

    // baixo estoque
    const low = db.prepare(`SELECT COUNT(*) AS c FROM products WHERE stock <= low_stock`).get();

    // recentes (últimos 5 itens vendidos)
    const recent = db.prepare(`
      SELECT s.date, s.customer_name AS customerName, si.product_name AS productName,
             si.product_id AS productId, si.quantity, si.unit_price AS unitPrice, si.total, s.id AS saleId
      FROM sales s
      JOIN sales_items si ON si.sale_id = s.id
      ORDER BY s.date DESC
      LIMIT 5
    `).all();

    // itens com baixo estoque (top 5)
    const lowItems = db.prepare(`
      SELECT id, name, brand, stock, low_stock AS lowStock
      FROM products
      WHERE stock <= low_stock
      ORDER BY stock ASC
      LIMIT 5
    `).all();

    // top produtos
    const top = db.prepare(`
      SELECT si.product_id AS id,
             MAX(si.product_name) AS name,
             COALESCE(SUM(si.quantity),0) AS totalSold,
             COALESCE(SUM(si.total),0)    AS totalRevenue,
             MAX(p.brand) AS brand
      FROM sales_items si
      LEFT JOIN products p ON p.id = si.product_id
      GROUP BY si.product_id
      ORDER BY totalRevenue DESC
      LIMIT 5
    `).all();

    // total de produtos
    const totalProducts = db.prepare(`SELECT COUNT(*) AS c FROM products`).get().c;

    res.json({
      totalProducts,
      totalSales: today.totalSales,
      revenue: today.revenue,
      lowStockProducts: low.c,
      recentSales: recent,
      lowStockItems: lowItems,
      topProducts: top
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate dashboard data" });
  }
});

export default router;

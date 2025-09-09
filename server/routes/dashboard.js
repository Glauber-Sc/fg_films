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

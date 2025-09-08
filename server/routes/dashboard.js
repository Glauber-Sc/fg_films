import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const productsFile = join(__dirname, "../data/products.json")
const salesFile = join(__dirname, "../data/sales.json")

// Parse "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm[:ss]" como horário LOCAL
function parseLocalDate(val) {
  if (!val) return null
  if (typeof val === "string") {
    const m = val.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/)
    if (m) {
      const [, y, mo, d, hh = "0", mm = "0", ss = "0"] = m
      return new Date(+y, +mo - 1, +d, +hh, +mm, +ss, 0) // local
    }
  }
  return new Date(val)
}

router.get("/", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8") || "[]")
    const sales = JSON.parse(fs.readFileSync(salesFile, "utf8") || "[]")

    // ==== HOJE (00:00:00 até 23:59:59 - horário local do servidor) ====
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const salesToday = sales.filter((sale) => {
      const sd = parseLocalDate(sale.date)
      return sd >= startOfToday && sd <= endOfToday
    })

    const totalSales = salesToday.length
    const revenue = salesToday.reduce((sum, sale) => sum + Number(sale.total || 0), 0)

    // Produtos com estoque baixo
    const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5).length

    // Vendas recentes (últimas 5 no geral — mantido)
    const recentSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

    // Detalhes de estoque baixo (top 5)
    const lowStockItems = products
      .filter((product) => Number(product.stock || 0) <= 5)
      .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
      .slice(0, 5)

    // Top produtos (no geral — mantido)
    const productSales = {}
    sales.forEach((sale) => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = {
          id: sale.productId,
          name: sale.productName,
          totalSold: 0,
          totalRevenue: 0,
        }
      }
      productSales[sale.productId].totalSold += Number(sale.quantity || 0)
      productSales[sale.productId].totalRevenue += Number(sale.total || 0)
    })

    const topProducts = Object.values(productSales)
      .map((item) => {
        const product = products.find((p) => p.id === item.id)
        return {
          ...item,
          brand: product ? product.brand : "N/A",
        }
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)

    const dashboardData = {
      totalProducts: products.length,
      totalSales,     // <- agora do DIA
      revenue,        // <- agora do DIA
      lowStockProducts,
      recentSales,
      lowStockItems,
      topProducts,
    }

    res.json(dashboardData)
  } catch (error) {
    console.error("Error generating dashboard data:", error)
    res.status(500).json({ error: "Failed to generate dashboard data" })
  }
})

export default router

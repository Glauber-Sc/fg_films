import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const router = express.Router()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const productsFile = join(__dirname, "../data/products.json")
const salesFile = join(__dirname, "../data/sales.json")

// Get dashboard data
router.get("/", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    const sales = JSON.parse(fs.readFileSync(salesFile, "utf8"))

    // Calculate sales for the current month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const salesThisMonth = sales.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= firstDayOfMonth
    })

    const totalSales = salesThisMonth.length
    const revenue = salesThisMonth.reduce((sum, sale) => sum + sale.total, 0)

    // Products with low stock
    const lowStockProducts = products.filter((product) => product.stock <= 5).length

    // Recent sales (last 5)
    const recentSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

    // Products with low stock (details)
    const lowStockItems = products
      .filter((product) => product.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)

    // Top selling products
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
      productSales[sale.productId].totalSold += sale.quantity
      productSales[sale.productId].totalRevenue += sale.total
    })

    // Add brand information to top products
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
      totalSales,
      revenue,
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

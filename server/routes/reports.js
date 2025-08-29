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

// Get reports data
router.get("/", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    const sales = JSON.parse(fs.readFileSync(salesFile, "utf8"))

    // Daily sales for the last 7 days
    const dailySales = getDailySales(sales, 7)

    // Monthly sales for the last 6 months
    const monthlySales = getMonthlySales(sales, 6)

    // Top selling products
    const topProducts = getTopProducts(sales, products)

    const reportsData = {
      dailySales,
      monthlySales,
      topProducts,
    }

    res.json(reportsData)
  } catch (error) {
    console.error("Error generating reports data:", error)
    res.status(500).json({ error: "Failed to generate reports data" })
  }
})

// Helper function to get daily sales
function getDailySales(sales, days) {
  const result = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const daySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= date && saleDate < nextDate
    })

    const total = daySales.reduce((sum, sale) => sum + sale.total, 0)

    result.push({
      date: date.toLocaleDateString("pt-BR"),
      total,
    })
  }

  return result
}

// Helper function to get monthly sales
function getMonthlySales(sales, months) {
  const result = []
  const today = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)

    const monthSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= date && saleDate < nextMonth
    })

    const total = monthSales.reduce((sum, sale) => sum + sale.total, 0)

    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    result.push({
      month: `${monthNames[date.getMonth()]}/${date.getFullYear()}`,
      total,
    })
  }

  return result
}

// Helper function to get top products
function getTopProducts(sales, products) {
  const productSales = {}

  // Calculate total sales for each product
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

  // Add brand information
  const topProducts = Object.values(productSales).map((item) => {
    const product = products.find((p) => p.id === item.id)
    return {
      ...item,
      brand: product ? product.brand : "N/A",
    }
  })

  // Calculate total revenue
  const totalRevenue = topProducts.reduce((sum, product) => sum + product.totalRevenue, 0)

  // Add percentage of total
  topProducts.forEach((product) => {
    product.percentageOfTotal = (product.totalRevenue / totalRevenue) * 100
  })

  // Sort by revenue and return top 10
  return topProducts.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)
}

export default router

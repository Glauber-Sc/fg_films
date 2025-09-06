import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { generateId } from "../utils/helpers.js"

const router = express.Router()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const quotesFile = join(__dirname, "../data/quotes.json")
const salesFile = join(__dirname, "../data/sales.json")
const productsFile = join(__dirname, "../data/products.json")

// Get all quotes
router.get("/", (req, res) => {
  try {
    const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
    res.json(quotes)
  } catch (error) {
    console.error("Error reading quotes:", error)
    res.status(500).json({ error: "Failed to fetch quotes" })
  }
})

// Get quote by ID
router.get("/:id", (req, res) => {
  try {
    const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
    const quote = quotes.find((q) => q.id === req.params.id)

    if (!quote) {
      return res.status(404).json({ error: "Quote not found" })
    }

    res.json(quote)
  } catch (error) {
    console.error("Error reading quote:", error)
    res.status(500).json({ error: "Failed to fetch quote" })
  }
})

// Create a new quote
router.post("/", (req, res) => {
  try {
    const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))

    // Generate quote number
    const quoteNumber = quotes.length > 0 ? Math.max(...quotes.map((q) => q.quoteNumber)) + 1 : 1

    const newQuote = {
      id: generateId(),
      quoteNumber,
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    quotes.push(newQuote)
    fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2))

    res.status(201).json(newQuote)
  } catch (error) {
    console.error("Error creating quote:", error)
    res.status(500).json({ error: "Failed to create quote" })
  }
})

// Delete a quote
router.delete("/:id", (req, res) => {
  try {
    const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
    const filteredQuotes = quotes.filter((q) => q.id !== req.params.id)

    if (filteredQuotes.length === quotes.length) {
      return res.status(404).json({ error: "Quote not found" })
    }

    fs.writeFileSync(quotesFile, JSON.stringify(filteredQuotes, null, 2))

    res.json({ success: true, message: "Quote deleted successfully" })
  } catch (error) {
    console.error("Error deleting quote:", error)
    res.status(500).json({ error: "Failed to delete quote" })
  }
})

// Convert quote to sale
router.post("/:id/convert", (req, res) => {
  try {
    const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
    const sales = JSON.parse(fs.readFileSync(salesFile, "utf8"))
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))

    const quoteIndex = quotes.findIndex((q) => q.id === req.params.id)
    if (quoteIndex === -1) {
      return res.status(404).json({ error: "Quote not found" })
    }

    const quote = quotes[quoteIndex]
    if (quote.status === "converted") {
      return res.status(400).json({ error: "Quote already converted" })
    }

    // Check stock availability for all items
    for (const item of quote.items) {
      const product = products.find((p) => p.id === item.id)
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}` })
      }
    }

    // Create sales for each item and update stock
    for (const item of quote.items) {
      const newSale = {
        id: generateId(),
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.total,
        customerName: quote.customerName,
        paymentMethod: "Conversão de Orçamento",
        date: new Date().toISOString(),
        quoteId: quote.id,
      }

      sales.push(newSale)

      // Update product stock
      const productIndex = products.findIndex((p) => p.id === item.id)
      products[productIndex].stock -= item.quantity
    }

    // Update quote status
    quotes[quoteIndex].status = "converted"
    quotes[quoteIndex].convertedAt = new Date().toISOString()

    // Save all changes
    fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2))
    fs.writeFileSync(salesFile, JSON.stringify(sales, null, 2))
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2))

    res.json({ success: true, message: "Quote converted to sale successfully" })
  } catch (error) {
    console.error("Error converting quote to sale:", error)
    res.status(500).json({ error: "Failed to convert quote to sale" })
  }
})

export default router

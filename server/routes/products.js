import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { generateId } from "../utils/helpers.js"

const router = express.Router()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const productsFile = join(__dirname, "../data/products.json")

// Get all products
router.get("/", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    res.json(products)
  } catch (error) {
    console.error("Error reading products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// Get product by ID
router.get("/:id", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    const product = products.find((p) => p.id === req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Error reading product:", error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// Create a new product
router.post("/", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    const body = req.body || {}
    const stock = Number(body.stock ?? 0)
    const lowStock = Number(body.lowStock ?? 5) // padrão mantém compatibilidade

    const newProduct = {
      id: generateId(),
      ...body,
      stock: Number.isFinite(stock) ? stock : 0,
      lowStock: Number.isFinite(lowStock) && lowStock >= 0 ? lowStock : 5,
      createdAt: new Date().toISOString(), // 🔥 garante mesmo padrão dos primeiros
    }

    products.push(newProduct)
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2))

    res.status(201).json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ error: "Failed to create product" })
  }
})

// Update a product
router.put("/:id", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    const index = products.findIndex((p) => p.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: "Product not found" })
    }

    const body = req.body || {}
    const stock = Number(body.stock ?? products[index].stock ?? 0)
    const lowStock = Number(body.lowStock ?? products[index].lowStock ?? 5)

    const updatedProduct = {
      ...products[index],
      ...body,
      stock: Number.isFinite(stock) ? stock : (products[index].stock ?? 0),
      lowStock: Number.isFinite(lowStock) && lowStock >= 0 ? lowStock : (products[index].lowStock ?? 5),
      id: req.params.id, // garante que o ID não muda
    }

    products[index] = updatedProduct
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2))

    res.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ error: "Failed to update product" })
  }
})

// Delete a product
router.delete("/:id", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
    const filteredProducts = products.filter((p) => p.id !== req.params.id)

    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: "Product not found" })
    }

    fs.writeFileSync(productsFile, JSON.stringify(filteredProducts, null, 2))

    res.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ error: "Failed to delete product" })
  }
})

export default router

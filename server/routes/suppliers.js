import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { generateId } from "../utils/helpers.js"

const router = express.Router()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const suppliersFile = join(__dirname, "../data/suppliers.json")

// Get all suppliers
router.get("/", (req, res) => {
  try {
    const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
    res.json(suppliers)
  } catch (error) {
    console.error("Error reading suppliers:", error)
    res.status(500).json({ error: "Failed to fetch suppliers" })
  }
})

// Get supplier by ID
router.get("/:id", (req, res) => {
  try {
    const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
    const supplier = suppliers.find((s) => s.id === req.params.id)

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" })
    }

    res.json(supplier)
  } catch (error) {
    console.error("Error reading supplier:", error)
    res.status(500).json({ error: "Failed to fetch supplier" })
  }
})

// Create a new supplier
router.post("/", (req, res) => {
  try {
    const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
    const newSupplier = {
      id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
    }

    suppliers.push(newSupplier)
    fs.writeFileSync(suppliersFile, JSON.stringify(suppliers, null, 2))

    res.status(201).json(newSupplier)
  } catch (error) {
    console.error("Error creating supplier:", error)
    res.status(500).json({ error: "Failed to create supplier" })
  }
})

// Update a supplier
router.put("/:id", (req, res) => {
  try {
    const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
    const index = suppliers.findIndex((s) => s.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: "Supplier not found" })
    }

    const updatedSupplier = {
      ...suppliers[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString(),
    }

    suppliers[index] = updatedSupplier
    fs.writeFileSync(suppliersFile, JSON.stringify(suppliers, null, 2))

    res.json(updatedSupplier)
  } catch (error) {
    console.error("Error updating supplier:", error)
    res.status(500).json({ error: "Failed to update supplier" })
  }
})

// Delete a supplier
router.delete("/:id", (req, res) => {
  try {
    const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
    const filteredSuppliers = suppliers.filter((s) => s.id !== req.params.id)

    if (filteredSuppliers.length === suppliers.length) {
      return res.status(404).json({ error: "Supplier not found" })
    }

    fs.writeFileSync(suppliersFile, JSON.stringify(filteredSuppliers, null, 2))

    res.json({ success: true, message: "Supplier deleted successfully" })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    res.status(500).json({ error: "Failed to delete supplier" })
  }
})

export default router

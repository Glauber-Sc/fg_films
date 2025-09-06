import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { generateId } from "../utils/helpers.js"

const router = express.Router()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const salesFile = join(__dirname, "../data/sales.json")
const productsFile = join(__dirname, "../data/products.json")

// Utils locais (não alteram comportamento externo)
function readJson(path) {
  try {
    const raw = fs.readFileSync(path, "utf8")
    return raw?.trim() ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function writeJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

// Get all sales
router.get("/", (req, res) => {
  try {
    const sales = readJson(salesFile)
    res.json(sales)
  } catch (error) {
    console.error("Error reading sales:", error)
    res.status(500).json({ error: "Failed to fetch sales" })
  }
})

// Create a new sale
router.post("/", (req, res) => {
  try {
    const sales = readJson(salesFile)
    const products = readJson(productsFile)

    // ----------------------------
    // Compatibilidade: 2 formatos
    // ----------------------------
    // Formato ANTIGO (uma venda de um único produto):
    // { productId, productName, quantity, unitPrice, total, paymentMethods?, ... }
    //
    // Formato NOVO (PDV) (uma venda contendo items[]):
    // {
    //   customerId, customerName, date, total, payments:[],
    //   items: [{ productId, name, qty, unitPrice, total }]
    // }
    // ----------------------------

    const body = req.body || {}
    const isNewPDV = Array.isArray(body.items) && body.items.length > 0

    if (!isNewPDV) {
      // ======= Fluxo ANTIGO (sem mudar assinatura de resposta) =======
      const { productId, quantity, paymentMethods } = body

      // Localiza produto
      const productIndex = products.findIndex((p) => String(p.id) === String(productId))
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" })
      }

      const product = products[productIndex]
      const qty = Number(quantity || 0)
      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ error: "Invalid quantity" })
      }

      // Verifica estoque
      if (Number(product.stock ?? 0) < qty) {
        return res.status(400).json({ error: "Not enough stock available" })
      }

      // Normaliza formas de pagamento
      let formattedPaymentMethods = []
      if (paymentMethods && Array.isArray(paymentMethods)) {
        formattedPaymentMethods = paymentMethods.map((pm) => ({
          method: pm.method,
          amount: pm.amount,
          machine: pm.machine || null,
        }))
      } else {
        // Fallback formato antigo
        formattedPaymentMethods = [
          {
            method: body.paymentMethod || "Dinheiro",
            amount: body.total,
            machine: null,
          },
        ]
      }

      // Cria venda (mesmo shape existente)
      const newSale = {
        id: generateId(),
        productId: String(productId),
        productName: body.productName,
        quantity: qty,
        unitPrice: Number(body.unitPrice),
        total: Number(body.total),
        customerId: body.customerId || null,
        customerName: body.customerName || "Cliente não identificado",
        paymentMethods: formattedPaymentMethods,
        date: body.date || new Date().toISOString(),
        quoteId: body.quoteId || null,
      }

      // Abate estoque
      products[productIndex].stock = Number(products[productIndex].stock ?? 0) - qty

      // Persiste
      sales.push(newSale)
      writeJson(salesFile, sales)
      writeJson(productsFile, products)

      return res.status(201).json(newSale)
    }

    // ======= Fluxo NOVO (PDV com items[]) =======

    // Validação prévia: todos os itens têm produto e estoque suficiente
    for (const it of body.items) {
      const pid = String(it.productId || "")
      const qty = Number(it.qty || 0)

      if (!pid) {
        return res.status(400).json({ error: "Invalid item: productId is required" })
      }
      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ error: `Invalid quantity for productId ${pid}` })
      }

      const p = products.find((x) => String(x.id) === pid)
      if (!p) {
        return res.status(404).json({ error: "Product not found", productId: pid })
      }
      if (Number(p.stock ?? 0) < qty) {
        return res.status(400).json({ error: "Not enough stock available", productId: pid, stock: p.stock })
      }
    }

    // Normaliza formas de pagamento (novo PDV usa "payments")
    const payments = Array.isArray(body.payments) ? body.payments : []
    const normalizedPayments = payments.map((pm) => ({
      method: pm.method,
      amount: Number(pm.amount),
      machine: pm.machine || null,
      id: pm.id ?? undefined
    }))

    // Cria vendas individuais por item (mantendo o shape usado pela listagem)
    const created = []
    for (const it of body.items) {
      const pid = String(it.productId)
      const qty = Number(it.qty)
      const productIndex = products.findIndex((x) => String(x.id) === pid)
      const product = products[productIndex]

      // Abate estoque
      products[productIndex].stock = Number(product.stock ?? 0) - qty

      const sale = {
        id: generateId(),
        productId: pid,
        productName: it.name ?? product.name ?? "",
        quantity: qty,
        unitPrice: Number(it.unitPrice),
        total: Number(it.total),
        customerId: body.customerId || null,
        customerName: body.customerName || "Cliente não identificado",
        paymentMethods: normalizedPayments.length > 0 ? normalizedPayments : undefined,
        date: body.date || new Date().toISOString(),
        quoteId: body.quoteId || null,
      }

      created.push(sale)
      sales.push(sale)
    }

    // Persiste tudo
    writeJson(productsFile, products)
    writeJson(salesFile, sales)

    // Retorno: lista de vendas criadas (mantém compatibilidade da listagem)
    return res.status(201).json(created)
  } catch (error) {
    console.error("Error creating sale:", error)
    res.status(500).json({ error: "Failed to create sale" })
  }
})

export default router

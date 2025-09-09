import express from "express";
import { db, nowISO } from "../db/index.js";
import { generateId } from "../utils/helpers.js";

const router = express.Router();

/* ------- helpers ------- */
function toNullIfEmpty(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  return v;
}
function numOrDefault(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

/* ------- GET: all ------- */
router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM products`).all();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ------- GET: by id ------- */
router.get("/:id", (req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: "Product not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* ------- POST: create ------- */
router.post("/", (req, res) => {
  try {
    const id = generateId();
    const now = nowISO();
    const body = req.body || {};

    // aceita camelCase e snake_case
    const compatibleModel =
      body.compatibleModel ?? body.compatible_model ?? null;

    const stock    = numOrDefault(body.stock, 0);
    const lowStock = numOrDefault(body.lowStock, 5);

    // fornecedor opcional de verdade: string vazia -> NULL
    let supplierId = toNullIfEmpty(body.supplierId ?? body.supplier_id ?? null);

    // se veio um supplierId não nulo, valida existência (opcional, mas ajuda a ter erro amigável)
    if (supplierId) {
      const exists = db.prepare(`SELECT 1 FROM suppliers WHERE id = ?`).get(supplierId);
      if (!exists) {
        return res.status(400).json({ error: "Supplier not found" });
      }
    }

    db.prepare(`
      INSERT INTO products
      (id, name, brand, compatible_model, stock, low_stock, price, cost_price, code, supplier_id, created_at)
      VALUES (@id,@name,@brand,@compatible_model,@stock,@low_stock,@price,@cost_price,@code,@supplier_id,@created_at)
    `).run({
      id,
      name: body.name,
      brand: body.brand ?? null,
      compatible_model: compatibleModel,
      stock: stock,
      low_stock: Math.max(0, lowStock),
      price: body.price ?? null,
      cost_price: body.costPrice ?? null,
      code: body.code ?? null,
      supplier_id: supplierId,            // ⬅️ agora NULL quando vazio
      created_at: now,
    });

    const created = db.prepare(`SELECT * FROM products WHERE id=?`).get(id);

    // resposta com alias camelCase para compatibilidade com o front
    res.status(201).json({
      ...created,
      compatibleModel: created.compatible_model,
      lowStock: created.low_stock,
      costPrice: created.cost_price,
      supplierId: created.supplier_id,
    });
  } catch (e) {
    // mensagem mais clara para FK
    if (String(e?.message || "").includes("FOREIGN KEY constraint failed")) {
      return res.status(400).json({ error: "Supplier not found (foreign key)" });
    }
    console.error(e);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/* ------- PUT: update ------- */
router.put("/:id", (req, res) => {
  try {
    const current = db.prepare(`SELECT * FROM products WHERE id=?`).get(req.params.id);
    if (!current) return res.status(404).json({ error: "Product not found" });

    const body = req.body || {};

    // aceita camelCase e snake_case
    const compatibleModel =
      body.compatibleModel ?? body.compatible_model ?? current.compatible_model;

    const stock    = numOrDefault(body.stock,    current.stock ?? 0);
    const lowStock = numOrDefault(body.lowStock, current.low_stock ?? 5);

    // fornecedor opcional de verdade
    let supplierId = toNullIfEmpty(body.supplierId ?? body.supplier_id ?? current.supplier_id ?? null);

    if (supplierId) {
      const exists = db.prepare(`SELECT 1 FROM suppliers WHERE id = ?`).get(supplierId);
      if (!exists) {
        return res.status(400).json({ error: "Supplier not found" });
      }
    }

    db.prepare(`
      UPDATE products
      SET name=@name, brand=@brand, compatible_model=@compatible_model, stock=@stock, low_stock=@low_stock,
          price=@price, cost_price=@cost_price, code=@code, supplier_id=@supplier_id, updated_at=@updated_at
      WHERE id=@id
    `).run({
      id: req.params.id,
      name: body.name ?? current.name,
      brand: body.brand ?? current.brand,
      compatible_model: compatibleModel,
      stock: stock,
      low_stock: Math.max(0, lowStock),
      price: body.price ?? current.price,
      cost_price: body.costPrice ?? current.cost_price,
      code: body.code ?? current.code,
      supplier_id: supplierId,           // ⬅️ agora NULL quando vazio
      updated_at: nowISO(),
    });

    const updated = db.prepare(`SELECT * FROM products WHERE id=?`).get(req.params.id);
    res.json({
      ...updated,
      compatibleModel: updated.compatible_model,
      lowStock: updated.low_stock,
      costPrice: updated.cost_price,
      supplierId: updated.supplier_id,
    });
  } catch (e) {
    if (String(e?.message || "").includes("FOREIGN KEY constraint failed")) {
      return res.status(400).json({ error: "Supplier not found (foreign key)" });
    }
    console.error(e);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* ------- DELETE ------- */
router.delete("/:id", (req, res) => {
  try {
    const info = db.prepare(`DELETE FROM products WHERE id=?`).run(req.params.id);
    if (!info.changes) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;

// /* The above code is defining routes for a RESTful API related to managing products. It uses Express.js
// as the web framework for handling HTTP requests. Here is a summary of what each route does: */
// // import express from "express"
// // import fs from "fs"
// // import { fileURLToPath } from "url"
// // import { dirname, join } from "path"
// // import { generateId } from "../utils/helpers.js"

// // const router = express.Router()

// // // Get the directory name
// // const __filename = fileURLToPath(import.meta.url)
// // const __dirname = dirname(__filename)
// // const productsFile = join(__dirname, "../data/products.json")

// // // Get all products
// // router.get("/", (req, res) => {
// //   try {
// //     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
// //     res.json(products)
// //   } catch (error) {
// //     console.error("Error reading products:", error)
// //     res.status(500).json({ error: "Failed to fetch products" })
// //   }
// // })

// // // Get product by ID
// // router.get("/:id", (req, res) => {
// //   try {
// //     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
// //     const product = products.find((p) => p.id === req.params.id)

// //     if (!product) {
// //       return res.status(404).json({ error: "Product not found" })
// //     }

// //     res.json(product)
// //   } catch (error) {
// //     console.error("Error reading product:", error)
// //     res.status(500).json({ error: "Failed to fetch product" })
// //   }
// // })

// // // Create a new product
// // router.post("/", (req, res) => {
// //   try {
// //     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
// //     const body = req.body || {}
// //     const stock = Number(body.stock ?? 0)
// //     const lowStock = Number(body.lowStock ?? 5) // padrão mantém compatibilidade

// //     const newProduct = {
// //       id: generateId(),
// //       ...body,
// //       stock: Number.isFinite(stock) ? stock : 0,
// //       lowStock: Number.isFinite(lowStock) && lowStock >= 0 ? lowStock : 5,
// //       createdAt: new Date().toISOString(), // 🔥 garante mesmo padrão dos primeiros
// //     }

// //     products.push(newProduct)
// //     fs.writeFileSync(productsFile, JSON.stringify(products, null, 2))

// //     res.status(201).json(newProduct)
// //   } catch (error) {
// //     console.error("Error creating product:", error)
// //     res.status(500).json({ error: "Failed to create product" })
// //   }
// // })

// // // Update a product
// // router.put("/:id", (req, res) => {
// //   try {
// //     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
// //     const index = products.findIndex((p) => p.id === req.params.id)

// //     if (index === -1) {
// //       return res.status(404).json({ error: "Product not found" })
// //     }

// //     const body = req.body || {}
// //     const stock = Number(body.stock ?? products[index].stock ?? 0)
// //     const lowStock = Number(body.lowStock ?? products[index].lowStock ?? 5)

// //     const updatedProduct = {
// //       ...products[index],
// //       ...body,
// //       stock: Number.isFinite(stock) ? stock : (products[index].stock ?? 0),
// //       lowStock: Number.isFinite(lowStock) && lowStock >= 0 ? lowStock : (products[index].lowStock ?? 5),
// //       id: req.params.id, // garante que o ID não muda
// //     }

// //     products[index] = updatedProduct
// //     fs.writeFileSync(productsFile, JSON.stringify(products, null, 2))

// //     res.json(updatedProduct)
// //   } catch (error) {
// //     console.error("Error updating product:", error)
// //     res.status(500).json({ error: "Failed to update product" })
// //   }
// // })

// // // Delete a product
// // router.delete("/:id", (req, res) => {
// //   try {
// //     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))
// //     const filteredProducts = products.filter((p) => p.id !== req.params.id)

// //     if (filteredProducts.length === products.length) {
// //       return res.status(404).json({ error: "Product not found" })
// //     }

// //     fs.writeFileSync(productsFile, JSON.stringify(filteredProducts, null, 2))

// //     res.json({ success: true, message: "Product deleted successfully" })
// //   } catch (error) {
// //     console.error("Error deleting product:", error)
// //     res.status(500).json({ error: "Failed to delete product" })
// //   }
// // })

// // export default router


// // server/routes/products.js
// import express from "express";
// import { db, nowISO } from "../db/index.js";
// import { generateId } from "../utils/helpers.js";

// const router = express.Router();

// // Get all products
// router.get("/", (req, res) => {
//   try {
//     const rows = db.prepare(`SELECT * FROM products`).all();
//     res.json(rows);
//   } catch (e) {
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// // Get by ID
// router.get("/:id", (req, res) => {
//   try {
//     const row = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
//     if (!row) return res.status(404).json({ error: "Product not found" });
//     res.json(row);
//   } catch (e) {
//     res.status(500).json({ error: "Failed to fetch product" });
//   }
// });

// // Create
// router.post("/", (req, res) => {
//   try {
//     const id = generateId();
//     const now = nowISO();
//     const body = req.body || {};
//     const stock = Number(body.stock ?? 0);
//     const lowStock = Number(body.lowStock ?? 5);

//     db.prepare(`
//       INSERT INTO products
//       (id, name, brand, compatible_model, stock, low_stock, price, cost_price, code, supplier_id, created_at)
//       VALUES (@id,@name,@brand,@compatible_model,@stock,@low_stock,@price,@cost_price,@code,@supplier_id,@created_at)
//     `).run({
//       id,
//       name: body.name,
//       brand: body.brand,
//       compatible_model: body.compatible_model,
//       stock: Number.isFinite(stock) ? stock : 0,
//       low_stock: Number.isFinite(lowStock) && lowStock >= 0 ? lowStock : 5,
//       price: body.price ?? null,
//       cost_price: body.costPrice ?? null,
//       code: body.code ?? null,
//       supplier_id: body.supplierId ?? null,
//       created_at: now,
//     });

//     const created = db.prepare(`SELECT * FROM products WHERE id=?`).get(id);
//     res.status(201).json({
//       ...created,
//       compatible_model: created.compatible_model, // compat optional
//       lowStock: created.low_stock,
//       costPrice: created.cost_price,
//       supplierId: created.supplier_id,
//     });
//   } catch (e) {
//     res.status(500).json({ error: "Failed to create product" });
//   }
// });

// // Update
// router.put("/:id", (req, res) => {
//   try {
//     const current = db.prepare(`SELECT * FROM products WHERE id=?`).get(req.params.id);
//     if (!current) return res.status(404).json({ error: "Product not found" });

//     const body = req.body || {};
//     const stock = Number(body.stock ?? current.stock ?? 0);
//     const lowStock = Number(body.lowStock ?? current.low_stock ?? 5);

//     db.prepare(`
//       UPDATE products
//       SET name=@name, brand=@brand, compatible_model=@compatible_model, stock=@stock, low_stock=@low_stock,
//           price=@price, cost_price=@cost_price, code=@code, supplier_id=@supplier_id, updated_at=@updated_at
//       WHERE id=@id
//     `).run({
//       id: req.params.id,
//       name: body.name ?? current.name,
//       brand: body.brand ?? current.brand,
//       compatible_model: body.compatible_model ?? current.compatible_model,
//       stock: Number.isFinite(stock) ? stock : current.stock,
//       low_stock: Number.isFinite(lowStock) && lowStock >= 0 ? lowStock : current.low_stock,
//       price: body.price ?? current.price,
//       cost_price: body.costPrice ?? current.cost_price,
//       code: body.code ?? current.code,
//       supplier_id: body.supplierId ?? current.supplier_id,
//       updated_at: nowISO(),
//     });

//     const updated = db.prepare(`SELECT * FROM products WHERE id=?`).get(req.params.id);
//     res.json({
//       ...updated,
//       compatible_model: updated.compatible_model,
//       lowStock: updated.low_stock,
//       costPrice: updated.cost_price,
//       supplierId: updated.supplier_id,
//     });
//   } catch (e) {
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });

// // Delete
// router.delete("/:id", (req, res) => {
//   try {
//     const info = db.prepare(`DELETE FROM products WHERE id=?`).run(req.params.id);
//     if (!info.changes) return res.status(404).json({ error: "Product not found" });
//     res.json({ success: true, message: "Product deleted successfully" });
//   } catch (e) {
//     res.status(500).json({ error: "Failed to delete product" });
//   }
// });

// export default router;



// server/routes/products.js
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

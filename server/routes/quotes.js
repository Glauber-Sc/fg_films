// // import express from "express"
// // import fs from "fs"
// // import { fileURLToPath } from "url"
// // import { dirname, join } from "path"
// // import { generateId } from "../utils/helpers.js"

// // const router = express.Router()

// // // Get the directory name
// // const __filename = fileURLToPath(import.meta.url)
// // const __dirname = dirname(__filename)
// // const quotesFile = join(__dirname, "../data/quotes.json")
// // const salesFile = join(__dirname, "../data/sales.json")
// // const productsFile = join(__dirname, "../data/products.json")

// // // Get all quotes
// // router.get("/", (req, res) => {
// //   try {
// //     const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
// //     res.json(quotes)
// //   } catch (error) {
// //     console.error("Error reading quotes:", error)
// //     res.status(500).json({ error: "Failed to fetch quotes" })
// //   }
// // })

// // // Get quote by ID
// // router.get("/:id", (req, res) => {
// //   try {
// //     const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
// //     const quote = quotes.find((q) => q.id === req.params.id)

// //     if (!quote) {
// //       return res.status(404).json({ error: "Quote not found" })
// //     }

// //     res.json(quote)
// //   } catch (error) {
// //     console.error("Error reading quote:", error)
// //     res.status(500).json({ error: "Failed to fetch quote" })
// //   }
// // })

// // // Create a new quote
// // router.post("/", (req, res) => {
// //   try {
// //     const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))

// //     // Generate quote number
// //     const quote_number = quotes.length > 0 ? Math.max(...quotes.map((q) => q.quote_number)) + 1 : 1

// //     const newQuote = {
// //       id: generateId(),
// //       quote_number,
// //       ...req.body,
// //       status: "pending",
// //       createdAt: new Date().toISOString(),
// //     }

// //     quotes.push(newQuote)
// //     fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2))

// //     res.status(201).json(newQuote)
// //   } catch (error) {
// //     console.error("Error creating quote:", error)
// //     res.status(500).json({ error: "Failed to create quote" })
// //   }
// // })

// // // Delete a quote
// // router.delete("/:id", (req, res) => {
// //   try {
// //     const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
// //     const filteredQuotes = quotes.filter((q) => q.id !== req.params.id)

// //     if (filteredQuotes.length === quotes.length) {
// //       return res.status(404).json({ error: "Quote not found" })
// //     }

// //     fs.writeFileSync(quotesFile, JSON.stringify(filteredQuotes, null, 2))

// //     res.json({ success: true, message: "Quote deleted successfully" })
// //   } catch (error) {
// //     console.error("Error deleting quote:", error)
// //     res.status(500).json({ error: "Failed to delete quote" })
// //   }
// // })

// // // Convert quote to sale
// // router.post("/:id/convert", (req, res) => {
// //   try {
// //     const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"))
// //     const sales = JSON.parse(fs.readFileSync(salesFile, "utf8"))
// //     const products = JSON.parse(fs.readFileSync(productsFile, "utf8"))

// //     const quoteIndex = quotes.findIndex((q) => q.id === req.params.id)
// //     if (quoteIndex === -1) {
// //       return res.status(404).json({ error: "Quote not found" })
// //     }

// //     const quote = quotes[quoteIndex]
// //     if (quote.status === "converted") {
// //       return res.status(400).json({ error: "Quote already converted" })
// //     }

// //     // Check stock availability for all items
// //     for (const item of quote.items) {
// //       const product = products.find((p) => p.id === item.id)
// //       if (!product) {
// //         return res.status(404).json({ error: `Product ${item.name} not found` })
// //       }
// //       if (product.stock < item.quantity) {
// //         return res.status(400).json({ error: `Not enough stock for ${item.name}` })
// //       }
// //     }

// //     // Create sales for each item and update stock
// //     for (const item of quote.items) {
// //       const newSale = {
// //         id: generateId(),
// //         productId: item.id,
// //         productName: item.name,
// //         quantity: item.quantity,
// //         unitPrice: item.price,
// //         total: item.total,
// //         customerName: quote.customerName,
// //         paymentMethod: "Conversão de Orçamento",
// //         date: new Date().toISOString(),
// //         quoteId: quote.id,
// //       }

// //       sales.push(newSale)

// //       // Update product stock
// //       const productIndex = products.findIndex((p) => p.id === item.id)
// //       products[productIndex].stock -= item.quantity
// //     }

// //     // Update quote status
// //     quotes[quoteIndex].status = "converted"
// //     quotes[quoteIndex].convertedAt = new Date().toISOString()

// //     // Save all changes
// //     fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2))
// //     fs.writeFileSync(salesFile, JSON.stringify(sales, null, 2))
// //     fs.writeFileSync(productsFile, JSON.stringify(products, null, 2))

// //     res.json({ success: true, message: "Quote converted to sale successfully" })
// //   } catch (error) {
// //     console.error("Error converting quote to sale:", error)
// //     res.status(500).json({ error: "Failed to convert quote to sale" })
// //   }
// // })

// // export default router



// // server/routes/quotes.js
// import express from "express";
// import { db, nowISO } from "../db/index.js";
// import { generateId } from "../utils/helpers.js";

// const router = express.Router();

// function fetchQuoteWithItems(id) {
//   const q = db.prepare(`SELECT * FROM quotes WHERE id=?`).get(id);
//   if (!q) return null;
//   const items = db.prepare(`SELECT * FROM quote_items WHERE quote_id=?`).all(id);
//   return {
//     ...q,
//     items: items.map((it) => ({
//       id: it.product_id ?? generateId(), // mantém compat (id do item pode ser do produto)
//       ...it,
//     }))
//   };
// }

// // Get all quotes
// router.get("/", (req, res) => {
//   try {
//     const quotes = db.prepare(`SELECT * FROM quotes ORDER BY created_at DESC`).all();
//     const itemsByQuote = db.prepare(`SELECT * FROM quote_items WHERE quote_id = ?`);
//     const out = quotes.map((q) => ({ ...q, items: itemsByQuote.all(q.id) }));
//     res.json(out);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch quotes" });
//   }
// });

// // Get by ID
// router.get("/:id", (req, res) => {
//   try {
//     const q = fetchQuoteWithItems(req.params.id);
//     if (!q) return res.status(404).json({ error: "Quote not found" });
//     res.json(q);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch quote" });
//   }
// });

// // Create
// router.post("/", (req, res) => {
//   try {
//     const body = req.body || {};
//     const now = nowISO();

//     const tx = db.transaction(() => {
//       const nextNumber = db.prepare(`SELECT COALESCE(MAX(quote_number),0)+1 AS n FROM quotes`).get().n;

//       const id = generateId();
//       db.prepare(`
//         INSERT INTO quotes (id, quote_number, customer_id, customer_name, notes, date, status, created_at)
//         VALUES (@id,@quote_number,@customer_id,@customer_name,@notes,@date,'pending',@created_at)
//       `).run({
//         id,
//         quote_number: nextNumber,
//         customer_id: body.customerId ?? null,
//         customer_name: body.customerName ?? null,
//         notes: body.notes ?? null,
//         date: body.date ?? now,
//         created_at: now
//       });

//       const ins = db.prepare(`
//         INSERT INTO quote_items (id, quote_id, product_id, name, brand, price, quantity, total, stock)
//         VALUES (@id,@quote_id,@product_id,@name,@brand,@price,@quantity,@total,@stock)
//       `);
//       for (const item of (body.items || [])) {
//         ins.run({
//           id: generateId(),
//           quote_id: id,
//           product_id: item.id ?? item.productId ?? null,
//           name: item.name,
//           brand: item.brand ?? null,
//           price: Number(item.price || 0),
//           quantity: Number(item.quantity || item.qty || 0),
//           total: Number(item.total || 0),
//           stock: Number(item.stock ?? 0)
//         });
//       }

//       return id;
//     });

//     const newId = tx();
//     const created = fetchQuoteWithItems(newId);
//     res.status(201).json(created);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to create quote" });
//   }
// });

// // Delete
// router.delete("/:id", (req, res) => {
//   try {
//     const info = db.prepare(`DELETE FROM quotes WHERE id=?`).run(req.params.id);
//     if (!info.changes) return res.status(404).json({ error: "Quote not found" });
//     res.json({ success: true, message: "Quote deleted successfully" });
//   } catch {
//     res.status(500).json({ error: "Failed to delete quote" });
//   }
// });

// // Convert quote to sale
// router.post("/:id/convert", (req, res) => {
//   try {
//     const quote = fetchQuoteWithItems(req.params.id);
//     if (!quote) return res.status(404).json({ error: "Quote not found" });
//     if (quote.status === "converted") return res.status(400).json({ error: "Quote already converted" });

//     // estoque suficiente?
//     for (const item of quote.items) {
//       const p = db.prepare(`SELECT stock FROM products WHERE id=?`).get(String(item.product_id || item.id || ""));
//       if (!p) return res.status(404).json({ error: `Product ${item.name} not found` });
//       if (Number(p.stock || 0) < Number(item.quantity || 0)) {
//         return res.status(400).json({ error: `Not enough stock for ${item.name}` });
//       }
//     }

//     const tx = db.transaction(() => {
//       const saleId = generateId();
//       const date = nowISO();
//       const total = quote.items.reduce((a, it) => a + Number(it.total || 0), 0);

//       db.prepare(`
//         INSERT INTO sales (id, customer_id, customer_name, date, total, quote_id, created_at)
//         VALUES (@id,@customer_id,@customer_name,@date,@total,@quote_id,@created_at)
//       `).run({
//         id: saleId,
//         customer_id: quote.customer_id ?? null,
//         customer_name: quote.customer_name ?? null,
//         date,
//         total,
//         quote_id: quote.id,
//         created_at: date
//       });

//       const insItem = db.prepare(`
//         INSERT INTO sales_items (id, sale_id, product_id, product_name, quantity, unit_price, total)
//         VALUES (@id,@sale_id,@product_id,@product_name,@quantity,@unit_price,@total)
//       `);

//       for (const it of quote.items) {
//         insItem.run({
//           id: generateId(),
//           sale_id: saleId,
//           product_id: String(it.product_id || it.id || ""),
//           product_name: it.name,
//           quantity: Number(it.quantity || 0),
//           unit_price: Number(it.price || 0),
//           total: Number(it.total || 0)
//         });
//         db.prepare(`UPDATE products SET stock = stock - @q WHERE id=@id`)
//           .run({ q: Number(it.quantity || 0), id: String(it.product_id || it.id || "") });
//       }

//       // registra um pagamento "Conversão de Orçamento" com valor total
//       db.prepare(`
//         INSERT INTO payments (id, sale_id, method, amount, created_at)
//         VALUES (@id,@sale_id,'Conversão de Orçamento',@amount,@created_at)
//       `).run({ id: generateId(), sale_id: saleId, amount: total, created_at: date });

//       db.prepare(`UPDATE quotes SET status='converted', converted_at=@d WHERE id=@id`)
//         .run({ d: date, id: quote.id });
//     });

//     tx();
//     res.json({ success: true, message: "Quote converted to sale successfully" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Failed to convert quote to sale" });
//   }
// });

// export default router;



// server/routes/quotes.js
import express from "express";
import { db, nowISO } from "../db/index.js";
import { generateId } from "../utils/helpers.js";

const router = express.Router();

function fetchQuoteWithItems(id) {
  const q = db.prepare(`SELECT * FROM quotes WHERE id=?`).get(id);
  if (!q) return null;
  const items = db.prepare(`SELECT * FROM quote_items WHERE quote_id=?`).all(id);
  const total = items.reduce((a, it) => a + Number(it.total || 0), 0);
  return {
    ...q,
    total, // garante total mesmo que a tabela já tenha salvo
    items: items.map((it) => ({
      id: it.product_id ?? generateId(),
      ...it,
    })),
  };
}

// Get all quotes
router.get("/", (req, res) => {
  try {
    const quotes = db.prepare(`SELECT * FROM quotes ORDER BY created_at DESC`).all();
    const itemsByQuote = db.prepare(`SELECT * FROM quote_items WHERE quote_id = ?`);
    const out = quotes.map((q) => {
      const items = itemsByQuote.all(q.id);
      const total = items.reduce((a, it) => a + Number(it.total || 0), 0);
      return { ...q, total, items };
    });
    res.json(out);
  } catch {
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});

// Get by ID
router.get("/:id", (req, res) => {
  try {
    const q = fetchQuoteWithItems(req.params.id);
    if (!q) return res.status(404).json({ error: "Quote not found" });
    res.json(q);
  } catch {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// Create
router.post("/", (req, res) => {
  try {
    const body = req.body || {};
    const now = nowISO();

    const tx = db.transaction(() => {
      const nextNumber = db.prepare(`SELECT COALESCE(MAX(quote_number),0)+1 AS n FROM quotes`).get().n;

      // calcula total A PARTIR DOS ITENS
      const items = Array.isArray(body.items) ? body.items : [];
      const total = items.reduce((a, it) => a + Number(it.total || (it.price || 0) * (it.quantity || it.qty || 0)), 0);

      const id = generateId();
      db.prepare(
        `INSERT INTO quotes (id, quote_number, customer_id, customer_name, notes, date, status, total, created_at)
         VALUES (@id,@quote_number,@customer_id,@customer_name,@notes,@date,'pending',@total,@created_at)`
      ).run({
        id,
        quote_number: nextNumber,
        customer_id: body.customerId ?? null,
        customer_name: body.customerName ?? null,
        notes: body.notes ?? null,
        date: body.date ?? now, // pode usar hoje
        total,                  // << grava o total
        created_at: now,
      });

      const ins = db.prepare(
        `INSERT INTO quote_items (id, quote_id, product_id, name, brand, price, quantity, total, stock)
         VALUES (@id,@quote_id,@product_id,@name,@brand,@price,@quantity,@total,@stock)`
      );
      for (const item of items) {
        const qty = Number(item.quantity ?? item.qty ?? 0);
        const price = Number(item.price ?? 0);
        ins.run({
          id: generateId(),
          quote_id: id,
          product_id: item.id ?? item.productId ?? null,
          name: item.name,
          brand: item.brand ?? null,
          price,
          quantity: qty,
          total: Number(item.total ?? price * qty),
          stock: Number(item.stock ?? 0),
        });
      }

      return id;
    });

    const newId = tx();
    const created = fetchQuoteWithItems(newId);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create quote" });
  }
});

// Delete
router.delete("/:id", (req, res) => {
  try {
    const info = db.prepare(`DELETE FROM quotes WHERE id=?`).run(req.params.id);
    if (!info.changes) return res.status(404).json({ error: "Quote not found" });
    res.json({ success: true, message: "Quote deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete quote" });
  }
});

// Convert quote to sale
router.post("/:id/convert", (req, res) => {
  try {
    const quote = fetchQuoteWithItems(req.params.id);
    if (!quote) return res.status(404).json({ error: "Quote not found" });
    if ((quote.status || "").toLowerCase() === "converted") {
      return res.status(400).json({ error: "Quote already converted" });
    }

    // estoque suficiente?
    for (const item of quote.items) {
      const p = db.prepare(`SELECT stock FROM products WHERE id=?`).get(String(item.product_id || item.id || ""));
      if (!p) return res.status(404).json({ error: `Product ${item.name} not found` });
      if (Number(p.stock || 0) < Number(item.quantity || 0)) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}` });
      }
    }

    const tx = db.transaction(() => {
      const saleId = generateId();
      const date = nowISO();
      const total = quote.items.reduce((a, it) => a + Number(it.total || 0), 0);

      db.prepare(
        `INSERT INTO sales (id, customer_id, customer_name, date, total, quote_id, created_at)
         VALUES (@id,@customer_id,@customer_name,@date,@total,@quote_id,@created_at)`
      ).run({
        id: saleId,
        customer_id: quote.customer_id ?? null,
        customer_name: quote.customer_name ?? null,
        date,
        total,
        quote_id: quote.id,
        created_at: date,
      });

      const insItem = db.prepare(
        `INSERT INTO sales_items (id, sale_id, product_id, product_name, quantity, unit_price, total)
         VALUES (@id,@sale_id,@product_id,@product_name,@quantity,@unit_price,@total)`
      );

      for (const it of quote.items) {
        insItem.run({
          id: generateId(),
          sale_id: saleId,
          product_id: String(it.product_id || it.id || ""),
          product_name: it.name,
          quantity: Number(it.quantity || 0),
          unit_price: Number(it.price || 0),
          total: Number(it.total || 0),
        });
        db.prepare(`UPDATE products SET stock = stock - @q WHERE id=@id`).run({
          q: Number(it.quantity || 0),
          id: String(it.product_id || it.id || ""),
        });
      }

      // registra pagamento “Conversão de Orçamento”
      db.prepare(
        `INSERT INTO payments (id, sale_id, method, amount, created_at)
         VALUES (@id,@sale_id,'Conversão de Orçamento',@amount,@created_at)`
      ).run({ id: generateId(), sale_id: saleId, amount: total, created_at: date });

      db.prepare(`UPDATE quotes SET status='converted', converted_at=@d, updated_at=@d WHERE id=@id`).run({
        d: date,
        id: quote.id,
      });
    });

    tx();
    res.json({ success: true, message: "Quote converted to sale successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to convert quote to sale" });
  }
});

export default router;

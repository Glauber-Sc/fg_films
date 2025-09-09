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

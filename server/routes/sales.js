// import express from "express"
// import fs from "fs"
// import { fileURLToPath } from "url"
// import { dirname, join } from "path"
// import { generateId } from "../utils/helpers.js"

// const router = express.Router()

// // Get the directory name
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const salesFile = join(__dirname, "../data/sales.json")
// const productsFile = join(__dirname, "../data/products.json")

// // Utils locais (não alteram comportamento externo)
// function readJson(path) {
//   try {
//     const raw = fs.readFileSync(path, "utf8")
//     return raw?.trim() ? JSON.parse(raw) : []
//   } catch {
//     return []
//   }
// }
// function writeJson(path, data) {
//   fs.writeFileSync(path, JSON.stringify(data, null, 2))
// }

// // Get all sales
// router.get("/", (req, res) => {
//   try {
//     const sales = readJson(salesFile)
//     res.json(sales)
//   } catch (error) {
//     console.error("Error reading sales:", error)
//     res.status(500).json({ error: "Failed to fetch sales" })
//   }
// })

// // Create a new sale
// router.post("/", (req, res) => {
//   try {
//     const sales = readJson(salesFile)
//     const products = readJson(productsFile)

//     // ----------------------------
//     // Compatibilidade: 2 formatos
//     // ----------------------------
//     // Formato ANTIGO (uma venda de um único produto):
//     // { productId, productName, quantity, unitPrice, total, paymentMethods?, ... }
//     //
//     // Formato NOVO (PDV) (uma venda contendo items[]):
//     // {
//     //   customerId, customerName, date, total, payments:[],
//     //   items: [{ productId, name, qty, unitPrice, total }]
//     // }
//     // ----------------------------

//     const body = req.body || {}
//     const isNewPDV = Array.isArray(body.items) && body.items.length > 0

//     if (!isNewPDV) {
//       // ======= Fluxo ANTIGO (sem mudar assinatura de resposta) =======
//       const { productId, quantity, paymentMethods } = body

//       // Localiza produto
//       const productIndex = products.findIndex((p) => String(p.id) === String(productId))
//       if (productIndex === -1) {
//         return res.status(404).json({ error: "Product not found" })
//       }

//       const product = products[productIndex]
//       const qty = Number(quantity || 0)
//       if (!Number.isFinite(qty) || qty <= 0) {
//         return res.status(400).json({ error: "Invalid quantity" })
//       }

//       // Verifica estoque
//       if (Number(product.stock ?? 0) < qty) {
//         return res.status(400).json({ error: "Not enough stock available" })
//       }

//       // Normaliza formas de pagamento
//       let formattedPaymentMethods = []
//       if (paymentMethods && Array.isArray(paymentMethods)) {
//         formattedPaymentMethods = paymentMethods.map((pm) => ({
//           method: pm.method,
//           amount: pm.amount,
//           machine: pm.machine || null,
//         }))
//       } else {
//         // Fallback formato antigo
//         formattedPaymentMethods = [
//           {
//             method: body.paymentMethod || "Dinheiro",
//             amount: body.total,
//             machine: null,
//           },
//         ]
//       }

//       // Cria venda (mesmo shape existente)
//       const newSale = {
//         id: generateId(),
//         productId: String(productId),
//         productName: body.productName,
//         quantity: qty,
//         unitPrice: Number(body.unitPrice),
//         total: Number(body.total),
//         customerId: body.customerId || null,
//         customerName: body.customerName || "Cliente não identificado",
//         paymentMethods: formattedPaymentMethods,
//         date: body.date || new Date().toISOString(),
//         quoteId: body.quoteId || null,
//       }

//       // Abate estoque
//       products[productIndex].stock = Number(products[productIndex].stock ?? 0) - qty

//       // Persiste
//       sales.push(newSale)
//       writeJson(salesFile, sales)
//       writeJson(productsFile, products)

//       return res.status(201).json(newSale)
//     }

//     // ======= Fluxo NOVO (PDV com items[]) =======

//     // Validação prévia: todos os itens têm produto e estoque suficiente
//     for (const it of body.items) {
//       const pid = String(it.productId || "")
//       const qty = Number(it.qty || 0)

//       if (!pid) {
//         return res.status(400).json({ error: "Invalid item: productId is required" })
//       }
//       if (!Number.isFinite(qty) || qty <= 0) {
//         return res.status(400).json({ error: `Invalid quantity for productId ${pid}` })
//       }

//       const p = products.find((x) => String(x.id) === pid)
//       if (!p) {
//         return res.status(404).json({ error: "Product not found", productId: pid })
//       }
//       if (Number(p.stock ?? 0) < qty) {
//         return res.status(400).json({ error: "Not enough stock available", productId: pid, stock: p.stock })
//       }
//     }

//     // Normaliza formas de pagamento (novo PDV usa "payments")
//     const payments = Array.isArray(body.payments) ? body.payments : []
//     const normalizedPayments = payments.map((pm) => ({
//       method: pm.method,
//       amount: Number(pm.amount),
//       machine: pm.machine || null,
//       id: pm.id ?? undefined
//     }))

//     // Cria vendas individuais por item (mantendo o shape usado pela listagem)
//     const created = []
//     for (const it of body.items) {
//       const pid = String(it.productId)
//       const qty = Number(it.qty)
//       const productIndex = products.findIndex((x) => String(x.id) === pid)
//       const product = products[productIndex]

//       // Abate estoque
//       products[productIndex].stock = Number(product.stock ?? 0) - qty

//       const sale = {
//         id: generateId(),
//         productId: pid,
//         productName: it.name ?? product.name ?? "",
//         quantity: qty,
//         unitPrice: Number(it.unitPrice),
//         total: Number(it.total),
//         customerId: body.customerId || null,
//         customerName: body.customerName || "Cliente não identificado",
//         paymentMethods: normalizedPayments.length > 0 ? normalizedPayments : undefined,
//         date: body.date || new Date().toISOString(),
//         quoteId: body.quoteId || null,
//       }

//       created.push(sale)
//       sales.push(sale)
//     }

//     // Persiste tudo
//     writeJson(productsFile, products)
//     writeJson(salesFile, sales)

//     // Retorno: lista de vendas criadas (mantém compatibilidade da listagem)
//     return res.status(201).json(created)
//   } catch (error) {
//     console.error("Error creating sale:", error)
//     res.status(500).json({ error: "Failed to create sale" })
//   }
// })

// export default router


// server/routes/sales.js
import express from "express";
import { db, nowISO } from "../db/index.js";
import { generateId } from "../utils/helpers.js";

const router = express.Router();

function getPaymentsForSale(saleId) {
  const rows = db.prepare(`SELECT * FROM payments WHERE sale_id=? ORDER BY created_at ASC`).all(saleId);
  return rows.map((p) => ({
    method: p.method,
    amount: p.amount,
    machine: p.machine ?? null,
    installments: p.installments ?? undefined,
    id: p.id
  }));
}

// GET - lista achatada (um item por resultado)
router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        s.id      AS sale_id,
        s.customer_id, s.customer_name, s.date, s.total AS sale_total, s.quote_id,
        si.id     AS item_id,
        si.product_id, si.product_name, si.quantity, si.unit_price, si.total
      FROM sales s
      JOIN sales_items si ON si.sale_id = s.id
      ORDER BY s.date DESC, si.id DESC
    `).all();

    const out = rows.map((r) => ({
      id: r.item_id, // id do "registro de venda" (compatível com seu front)
      productId: String(r.product_id ?? ""),
      productName: r.product_name,
      quantity: r.quantity,
      unitPrice: r.unit_price,
      total: r.total,
      customerId: r.customer_id ?? null,
      customerName: r.customer_name ?? "Cliente não identificado",
      paymentMethods: getPaymentsForSale(r.sale_id),
      date: r.date,
      quoteId: r.quote_id ?? null
    }));

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

function ensureStock(productId, qty) {
  const p = db.prepare(`SELECT * FROM products WHERE id=?`).get(String(productId));
  if (!p) return { ok: false, message: "Product not found" };
  const stock = Number(p.stock ?? 0);
  if (stock < qty) return { ok: false, message: "Not enough stock available", stock };
  return { ok: true, product: p };
}

// POST - cria venda (formato antigo OU novo PDV items[])
router.post("/", (req, res) => {
  try {
    const body = req.body || {};
    const isNewPDV = Array.isArray(body.items) && body.items.length > 0;

    const tx = db.transaction(() => {
      if (!isNewPDV) {
        // ===== formato antigo (um produto) =====
        const productId = String(body.productId);
        const qty = Number(body.quantity || 0);
        if (!productId || !Number.isFinite(qty) || qty <= 0) {
          return { error: "Invalid productId or quantity" };
        }

        const check = ensureStock(productId, qty);
        if (!check.ok) return { error: check.message };

        const saleId = generateId();
        const date = body.date || nowISO();
        const total = Number(body.total || 0);
        const customerId = body.customerId || null;
        const customerName = body.customerName || "Cliente não identificado";

        db.prepare(`
          INSERT INTO sales (id, customer_id, customer_name, date, total, quote_id, created_at)
          VALUES (@id,@customer_id,@customer_name,@date,@total,@quote_id,@created_at)
        `).run({
          id: saleId,
          customer_id: customerId,
          customer_name: customerName,
          date,
          total,
          quote_id: body.quoteId ?? null,
          created_at: nowISO()
        });

        const itemId = generateId();
        db.prepare(`
          INSERT INTO sales_items (id, sale_id, product_id, product_name, quantity, unit_price, total)
          VALUES (@id,@sale_id,@product_id,@product_name,@quantity,@unit_price,@total)
        `).run({
          id: itemId,
          sale_id: saleId,
          product_id: productId,
          product_name: body.productName ?? check.product.name ?? "",
          quantity: qty,
          unit_price: Number(body.unitPrice || 0),
          total
        });

        // abate estoque
        db.prepare(`UPDATE products SET stock = stock - @qty WHERE id=@id`).run({ qty, id: productId });

        // pagamentos
        const pm = Array.isArray(body.paymentMethods) ? body.paymentMethods : [{
          method: body.paymentMethod || "Dinheiro",
          amount: total,
          machine: null
        }];
        const insPay = db.prepare(`
          INSERT INTO payments (id, sale_id, method, amount, machine, created_at)
          VALUES (@id,@sale_id,@method,@amount,@machine,@created_at)
        `);
        const when = nowISO();
        for (const p of pm) {
          insPay.run({
            id: generateId(),
            sale_id: saleId,
            method: p.method,
            amount: Number(p.amount || 0),
            machine: p.machine ?? null,
            created_at: when
          });
        }

        return {
          created: {
            id: itemId,
            productId,
            productName: body.productName ?? check.product.name ?? "",
            quantity: qty,
            unitPrice: Number(body.unitPrice || 0),
            total,
            customerId,
            customerName,
            paymentMethods: pm.map((x) => ({ method: x.method, amount: Number(x.amount || 0), machine: x.machine ?? null })),
            date,
            quoteId: body.quoteId ?? null
          }
        };
      }

      // ===== formato novo (PDV)
      const items = body.items.map((it) => ({
        productId: String(it.productId || ""),
        name: it.name ?? "",
        qty: Number(it.qty || 0),
        unitPrice: Number(it.unitPrice || 0),
        total: Number(it.total || 0),
      }));

      for (const it of items) {
        if (!it.productId || !Number.isFinite(it.qty) || it.qty <= 0) {
          return { error: "Invalid item" };
        }
        const check = ensureStock(it.productId, it.qty);
        if (!check.ok) return { error: check.message };
      }

      const saleId = generateId();
      const date = body.date || nowISO();
      const customerId = body.customerId || null;
      const customerName = body.customerName || "Cliente não identificado";
      const saleTotal = items.reduce((a, b) => a + b.total, 0);

      db.prepare(`
        INSERT INTO sales (id, customer_id, customer_name, date, total, quote_id, created_at)
        VALUES (@id,@customer_id,@customer_name,@date,@total,@quote_id,@created_at)
      `).run({
        id: saleId,
        customer_id: customerId,
        customer_name: customerName,
        date,
        total: saleTotal,
        quote_id: body.quoteId ?? null,
        created_at: nowISO()
      });

      const insItem = db.prepare(`
        INSERT INTO sales_items (id, sale_id, product_id, product_name, quantity, unit_price, total)
        VALUES (@id,@sale_id,@product_id,@product_name,@quantity,@unit_price,@total)
      `);

      for (const it of items) {
        const prod = db.prepare(`SELECT * FROM products WHERE id=?`).get(it.productId);
        const itemId = generateId();
        insItem.run({
          id: itemId,
          sale_id: saleId,
          product_id: it.productId,
          product_name: it.name || prod?.name || "",
          quantity: it.qty,
          unit_price: it.unitPrice,
          total: it.total
        });
        db.prepare(`UPDATE products SET stock = stock - @q WHERE id=@id`).run({ q: it.qty, id: it.productId });
        it._createdItemId = itemId; // para resposta
        it._productName = it.name || prod?.name || "";
      }

      const payments = Array.isArray(body.payments) ? body.payments : [];
      if (payments.length) {
        const insPay = db.prepare(`
          INSERT INTO payments (id, sale_id, method, amount, machine, installments, created_at)
          VALUES (@id,@sale_id,@method,@amount,@machine,@installments,@created_at)
        `);
        const when = nowISO();
        for (const p of payments) {
          insPay.run({
            id: p.id ?? generateId(),
            sale_id: saleId,
            method: p.method,
            amount: Number(p.amount || 0),
            machine: p.machine ?? null,
            installments: p.installments ?? null,
            created_at: when
          });
        }
      }

      // resposta compatível: lista de itens criados
      const createdList = items.map((it) => ({
        id: it._createdItemId,
        productId: it.productId,
        productName: it._productName,
        quantity: it.qty,
        unitPrice: it.unitPrice,
        total: it.total,
        customerId,
        customerName,
        paymentMethods: payments.map((p) => ({
          method: p.method, amount: Number(p.amount || 0), machine: p.machine ?? null, installments: p.installments ?? undefined, id: p.id
        })),
        date,
        quoteId: body.quoteId ?? null
      }));

      return { createdList };
    });

    const result = tx();
    if (result?.error) return res.status(400).json({ error: result.error });

    if (result.created) return res.status(201).json(result.created);
    return res.status(201).json(result.createdList);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create sale" });
  }
});

export default router;

// import express from "express";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import { generateId } from "../utils/helpers.js";

// const router = express.Router();

// // Get the directory name
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const customersFile = join(__dirname, "../data/customers.json");

// // util: parse createdAt com fallback
// function createdAtMs(obj) {
//   const ts = obj?.createdAt ?? obj?.created_at ?? null;
//   if (ts) {
//     const t = Date.parse(ts);
//     if (Number.isFinite(t)) return t;
//   }
//   // Fallback: se id for ObjectId (24 hex), usa timestamp embutido
//   if (typeof obj?.id === "string" && /^[a-f0-9]{24}$/i.test(obj.id)) {
//     const ms = parseInt(obj.id.slice(0, 8), 16) * 1000;
//     if (Number.isFinite(ms)) return ms;
//   }
//   return -Infinity;
// }

// // Get all customers (ordenados por createdAt DESC)
// router.get("/", (req, res) => {
//   try {
//     const customers = JSON.parse(fs.readFileSync(customersFile, "utf8"));
//     customers.sort((a, b) => createdAtMs(b) - createdAtMs(a));
//     res.json(customers);
//   } catch (error) {
//     console.error("Error reading customers:", error);
//     res.status(500).json({ error: "Failed to fetch customers" });
//   }
// });

// // Get customer by ID
// router.get("/:id", (req, res) => {
//   try {
//     const customers = JSON.parse(fs.readFileSync(customersFile, "utf8"));
//     const customer = customers.find((c) => c.id === req.params.id);

//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     res.json(customer);
//   } catch (error) {
//     console.error("Error reading customer:", error);
//     res.status(500).json({ error: "Failed to fetch customer" });
//   }
// });

// // Create a new customer
// router.post("/", (req, res) => {
//   try {
//     const customers = JSON.parse(fs.readFileSync(customersFile, "utf8"));
//     const newCustomer = {
//       id: generateId(),
//       ...req.body,
//       createdAt: new Date().toISOString(),
//     };

//     customers.push(newCustomer);
//     fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));

//     res.status(201).json(newCustomer);
//   } catch (error) {
//     console.error("Error creating customer:", error);
//     res.status(500).json({ error: "Failed to create customer" });
//   }
// });

// // Update a customer
// router.put("/:id", (req, res) => {
//   try {
//     const customers = JSON.parse(fs.readFileSync(customersFile, "utf8"));
//     const index = customers.findIndex((c) => c.id === req.params.id);

//     if (index === -1) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     const updatedCustomer = {
//       ...customers[index],
//       ...req.body,
//       id: req.params.id,
//       updatedAt: new Date().toISOString(),
//     };

//     customers[index] = updatedCustomer;
//     fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));

//     res.json(updatedCustomer);
//   } catch (error) {
//     console.error("Error updating customer:", error);
//     res.status(500).json({ error: "Failed to update customer" });
//   }
// });

// // Delete a customer
// router.delete("/:id", (req, res) => {
//   try {
//     const customers = JSON.parse(fs.readFileSync(customersFile, "utf8"));
//     const filteredCustomers = customers.filter((c) => c.id !== req.params.id);

//     if (filteredCustomers.length === customers.length) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     fs.writeFileSync(customersFile, JSON.stringify(filteredCustomers, null, 2));

//     res.json({ success: true, message: "Customer deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting customer:", error);
//     res.status(500).json({ error: "Failed to delete customer" });
//   }
// });

// export default router;


// server/routes/customers.js
import express from "express";
import { db, nowISO } from "../db/index.js";
import { generateId } from "../utils/helpers.js";

const router = express.Router();

// util: ordenação por created_at DESC com fallback
function createdAtMs(obj) {
  const ts = obj?.created_at ?? obj?.createdAt ?? null;
  if (ts) {
    const t = Date.parse(ts);
    if (Number.isFinite(t)) return t;
  }
  if (typeof obj?.id === "string" && /^[a-f0-9]{24}$/i.test(obj.id)) {
    const ms = parseInt(obj.id.slice(0, 8), 16) * 1000;
    if (Number.isFinite(ms)) return ms;
  }
  return -Infinity;
}

// Get all customers (ordenados por created_at DESC)
router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM customers`).all();
    rows.sort((a, b) => createdAtMs(b) - createdAtMs(a));
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Get customer by ID
router.get("/:id", (req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: "Customer not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// Create
router.post("/", (req, res) => {
  try {
    const id = generateId();
    const now = nowISO();
    const {
      name, phone, document, address, notes
    } = req.body || {};

    if (!name) return res.status(400).json({ error: "name is required" });

    db.prepare(`
      INSERT INTO customers (id, name, phone, document, address, notes, created_at)
      VALUES (@id, @name, @phone, @document, @address, @notes, @created_at)
    `).run({ id, name, phone, document, address, notes, created_at: now });

    const created = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Update
router.put("/:id", (req, res) => {
  try {
    const existing = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Customer not found" });

    const now = nowISO();
    const payload = {
      name: req.body.name ?? existing.name,
      phone: req.body.phone ?? existing.phone,
      document: req.body.document ?? existing.document,
      address: req.body.address ?? existing.address,
      notes: req.body.notes ?? existing.notes,
      updated_at: now,
      id: req.params.id,
    };

    db.prepare(`
      UPDATE customers
      SET name=@name, phone=@phone, document=@document, address=@address, notes=@notes, updated_at=@updated_at
      WHERE id=@id
    `).run(payload);

    const updated = db.prepare(`SELECT * FROM customers WHERE id=?`).get(req.params.id);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// Delete
router.delete("/:id", (req, res) => {
  try {
    const info = db.prepare(`DELETE FROM customers WHERE id = ?`).run(req.params.id);
    if (!info.changes) return res.status(404).json({ error: "Customer not found" });
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;

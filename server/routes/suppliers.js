// import express from "express"
// import fs from "fs"
// import { fileURLToPath } from "url"
// import { dirname, join } from "path"
// import { generateId } from "../utils/helpers.js"

// const router = express.Router()

// // Get the directory name
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const suppliersFile = join(__dirname, "../data/suppliers.json")

// // Get all suppliers
// router.get("/", (req, res) => {
//   try {
//     const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
//     res.json(suppliers)
//   } catch (error) {
//     console.error("Error reading suppliers:", error)
//     res.status(500).json({ error: "Failed to fetch suppliers" })
//   }
// })

// // Get supplier by ID
// router.get("/:id", (req, res) => {
//   try {
//     const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
//     const supplier = suppliers.find((s) => s.id === req.params.id)

//     if (!supplier) {
//       return res.status(404).json({ error: "Supplier not found" })
//     }

//     res.json(supplier)
//   } catch (error) {
//     console.error("Error reading supplier:", error)
//     res.status(500).json({ error: "Failed to fetch supplier" })
//   }
// })

// // Create a new supplier
// router.post("/", (req, res) => {
//   try {
//     const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
//     const newSupplier = {
//       id: generateId(),
//       ...req.body,
//       createdAt: new Date().toISOString(),
//     }

//     suppliers.push(newSupplier)
//     fs.writeFileSync(suppliersFile, JSON.stringify(suppliers, null, 2))

//     res.status(201).json(newSupplier)
//   } catch (error) {
//     console.error("Error creating supplier:", error)
//     res.status(500).json({ error: "Failed to create supplier" })
//   }
// })

// // Update a supplier
// router.put("/:id", (req, res) => {
//   try {
//     const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
//     const index = suppliers.findIndex((s) => s.id === req.params.id)

//     if (index === -1) {
//       return res.status(404).json({ error: "Supplier not found" })
//     }

//     const updatedSupplier = {
//       ...suppliers[index],
//       ...req.body,
//       id: req.params.id,
//       updatedAt: new Date().toISOString(),
//     }

//     suppliers[index] = updatedSupplier
//     fs.writeFileSync(suppliersFile, JSON.stringify(suppliers, null, 2))

//     res.json(updatedSupplier)
//   } catch (error) {
//     console.error("Error updating supplier:", error)
//     res.status(500).json({ error: "Failed to update supplier" })
//   }
// })

// // Delete a supplier
// router.delete("/:id", (req, res) => {
//   try {
//     const suppliers = JSON.parse(fs.readFileSync(suppliersFile, "utf8"))
//     const filteredSuppliers = suppliers.filter((s) => s.id !== req.params.id)

//     if (filteredSuppliers.length === suppliers.length) {
//       return res.status(404).json({ error: "Supplier not found" })
//     }

//     fs.writeFileSync(suppliersFile, JSON.stringify(filteredSuppliers, null, 2))

//     res.json({ success: true, message: "Supplier deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting supplier:", error)
//     res.status(500).json({ error: "Failed to delete supplier" })
//   }
// })

// export default router


// server/routes/suppliers.js
import express from "express";
import { db, nowISO } from "../db/index.js";
import { generateId } from "../utils/helpers.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM suppliers`).all();
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM suppliers WHERE id=?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: "Supplier not found" });
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
});

router.post("/", (req, res) => {
  try {
    const id = generateId();
    const now = nowISO();
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: "name is required" });

    db.prepare(`
      INSERT INTO suppliers (id,name,cnpj,phone,email,address,notes,created_at)
      VALUES (@id,@name,@cnpj,@phone,@email,@address,@notes,@created_at)
    `).run({
      id,
      name: b.name,
      cnpj: b.cnpj ?? null,
      phone: b.phone ?? null,
      email: b.email ?? null,
      address: b.address ?? null,
      notes: b.notes ?? null,
      created_at: now
    });

    const created = db.prepare(`SELECT * FROM suppliers WHERE id=?`).get(id);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create supplier" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const cur = db.prepare(`SELECT * FROM suppliers WHERE id=?`).get(req.params.id);
    if (!cur) return res.status(404).json({ error: "Supplier not found" });
    const b = req.body || {};

    db.prepare(`
      UPDATE suppliers
      SET name=@name, cnpj=@cnpj, phone=@phone, email=@email, address=@address, notes=@notes, updated_at=@updated_at
      WHERE id=@id
    `).run({
      id: req.params.id,
      name: b.name ?? cur.name,
      cnpj: b.cnpj ?? cur.cnpj,
      phone: b.phone ?? cur.phone,
      email: b.email ?? cur.email,
      address: b.address ?? cur.address,
      notes: b.notes ?? cur.notes,
      updated_at: nowISO(),
    });

    const updated = db.prepare(`SELECT * FROM suppliers WHERE id=?`).get(req.params.id);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update supplier" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const info = db.prepare(`DELETE FROM suppliers WHERE id=?`).run(req.params.id);
    if (!info.changes) return res.status(404).json({ error: "Supplier not found" });
    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete supplier" });
  }
});

export default router;

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

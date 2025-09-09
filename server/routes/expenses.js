import express from "express";
import { db, nowISO } from "../db/index.js";

const router = express.Router();

/** Mapeia snake_case -> camelCase para o front */
function mapExpense(row) {
  if (!row) return null;
  return {
    id: row.id,
    description: row.description,
    value: row.value,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}

/** GET - listar (ordenado do mais novo p/ o mais antigo) */
router.get("/", (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT id, description, value, created_at, updated_at
         FROM expenses
         ORDER BY datetime(created_at) DESC, id DESC`
      )
      .all();
    res.json(rows.map(mapExpense));
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar despesas" });
  }
});

/** GET - por ID */
router.get("/:id", (req, res) => {
  try {
    const row = db
      .prepare(
        `SELECT id, description, value, created_at, updated_at
         FROM expenses
         WHERE id = ?`
      )
      .get(+req.params.id);
    if (!row) return res.status(404).json({ error: "Despesa não encontrada" });
    res.json(mapExpense(row));
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar despesa" });
  }
});

/** POST - criar (sem 'date', só created_at) */
router.post("/", (req, res) => {
  try {
    const { description, value } = req.body || {};

    if (!description || value == null) {
      return res.status(400).json({
        error: "Descrição e valor são obrigatórios",
      });
    }

    const info = db
      .prepare(
        `INSERT INTO expenses (description, value, created_at)
         VALUES (@description, @value, @created_at)`
      )
      .run({
        description: String(description),
        value: parseFloat(value),
        created_at: nowISO(),
      });

    const created = db
      .prepare(
        `SELECT id, description, value, created_at, updated_at
         FROM expenses WHERE id = ?`
      )
      .get(info.lastInsertRowid);

    res.status(201).json(mapExpense(created));
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar despesa" });
  }
});

/** PUT - atualizar (sem 'date') */
router.put("/:id", (req, res) => {
  try {
    const cur = db
      .prepare(
        `SELECT id, description, value, created_at, updated_at
         FROM expenses WHERE id = ?`
      )
      .get(+req.params.id);

    if (!cur) return res.status(404).json({ error: "Despesa não encontrada" });

    const { description, value } = req.body || {};
    if (!description || value == null) {
      return res.status(400).json({
        error: "Descrição e valor são obrigatórios",
      });
    }

    db.prepare(
      `UPDATE expenses
       SET description = @description,
           value       = @value,
           updated_at  = @updated_at
       WHERE id        = @id`
    ).run({
      id: +req.params.id,
      description: String(description),
      value: parseFloat(value),
      updated_at: nowISO(),
    });

    const updated = db
      .prepare(
        `SELECT id, description, value, created_at, updated_at
         FROM expenses WHERE id = ?`
      )
      .get(+req.params.id);

    res.json(mapExpense(updated));
  } catch (e) {
    res.status(500).json({ error: "Erro ao atualizar despesa" });
  }
});

/** DELETE - excluir */
router.delete("/:id", (req, res) => {
  try {
    const info = db.prepare(`DELETE FROM expenses WHERE id = ?`).run(+req.params.id);
    if (!info.changes) return res.status(404).json({ error: "Despesa não encontrada" });
    res.json({ message: "Despesa excluída com sucesso" });
  } catch (e) {
    res.status(500).json({ error: "Erro ao excluir despesa" });
  }
});

export default router;

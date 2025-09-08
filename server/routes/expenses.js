// // import express from "express"
// // import { fileURLToPath } from "url"
// // import { dirname, join } from "path"
// // import fs from "fs"

// // const __filename = fileURLToPath(import.meta.url)
// // const __dirname = dirname(__filename)

// // const router = express.Router()
// // const expensesPath = join(__dirname, '../data/expenses.json')

// // const readExpenses = () => {
// //   try {
// //     const data = fs.readFileSync(expensesPath, 'utf8')
// //     return data?.trim() ? JSON.parse(data) : []
// //   } catch {
// //     return []
// //   }
// // }
// // const writeExpenses = (expenses) => {
// //   fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2))
// // }

// // /** Se vier "YYYY-MM-DD", transforma em "YYYY-MM-DDT12:00:00" (hora local)
// //  *  Se vier ISO em UTC (terminando com 'Z'), converte para horário local (sem 'Z').
// //  */
// // function ensureLocalMidday(dateStr) {
// //   if (!dateStr) return dateStr
// //   if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
// //     return `${dateStr}T12:00:00`
// //   }
// //   if (/[Zz]$/.test(dateStr)) {
// //     const d = new Date(dateStr) // interpreta em UTC
// //     const pad = (n) => String(n).padStart(2, "0")
// //     const y = d.getFullYear()
// //     const m = pad(d.getMonth() + 1)
// //     const day = pad(d.getDate())
// //     const hh = pad(d.getHours())
// //     const mm = pad(d.getMinutes())
// //     const ss = pad(d.getSeconds())
// //     return `${y}-${m}-${day}T${hh}:${mm}:${ss}` // local, sem Z
// //   }
// //   return dateStr
// // }

// // // GET - Listar todas as despesas
// // router.get('/', (req, res) => {
// //   try {
// //     const expenses = readExpenses()
// //     res.json(expenses)
// //   } catch (error) {
// //     res.status(500).json({ error: 'Erro ao buscar despesas' })
// //   }
// // })

// // // GET - Buscar despesa por ID
// // router.get('/:id', (req, res) => {
// //   try {
// //     const expenses = readExpenses()
// //     const expense = expenses.find(e => e.id === parseInt(req.params.id, 10))
// //     if (!expense) return res.status(404).json({ error: 'Despesa não encontrada' })
// //     res.json(expense)
// //   } catch {
// //     res.status(500).json({ error: 'Erro ao buscar despesa' })
// //   }
// // })

// // // POST - Criar nova despesa
// // router.post('/', (req, res) => {
// //   try {
// //     const { date, description, value } = req.body
// //     if (!date || !description || value == null) {
// //       return res.status(400).json({ error: 'Data, descrição e valor são obrigatórios' })
// //     }

// //     const expenses = readExpenses()
// //     const newExpense = {
// //       id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
// //       date: ensureLocalMidday(String(date)),
// //       description: String(description),
// //       value: parseFloat(value),
// //       createdAt: new Date().toISOString()
// //     }

// //     expenses.push(newExpense)
// //     writeExpenses(expenses)
// //     res.status(201).json(newExpense)
// //   } catch {
// //     res.status(500).json({ error: 'Erro ao criar despesa' })
// //   }
// // })

// // // PUT - Atualizar despesa
// // router.put('/:id', (req, res) => {
// //   try {
// //     const { date, description, value } = req.body
// //     if (!date || !description || value == null) {
// //       return res.status(400).json({ error: 'Data, descrição e valor são obrigatórios' })
// //     }

// //     const expenses = readExpenses()
// //     const idx = expenses.findIndex(e => e.id === parseInt(req.params.id, 10))
// //     if (idx === -1) return res.status(404).json({ error: 'Despesa não encontrada' })

// //     expenses[idx] = {
// //       ...expenses[idx],
// //       date: ensureLocalMidday(String(date)),
// //       description: String(description),
// //       value: parseFloat(value),
// //       updatedAt: new Date().toISOString()
// //     }

// //     writeExpenses(expenses)
// //     res.json(expenses[idx])
// //   } catch {
// //     res.status(500).json({ error: 'Erro ao atualizar despesa' })
// //   }
// // })

// // // DELETE - Excluir despesa
// // router.delete('/:id', (req, res) => {
// //   try {
// //     const expenses = readExpenses()
// //     const idx = expenses.findIndex(e => e.id === parseInt(req.params.id, 10))
// //     if (idx === -1) return res.status(404).json({ error: 'Despesa não encontrada' })

// //     expenses.splice(idx, 1)
// //     writeExpenses(expenses)
// //     res.json({ message: 'Despesa excluída com sucesso' })
// //   } catch {
// //     res.status(500).json({ error: 'Erro ao excluir despesa' })
// //   }
// // })

// // export default router



// // server/routes/expenses.js
// import express from "express";
// import { db, nowISO } from "../db/index.js";

// const router = express.Router();

// function ensureLocalMidday(dateStr) {
//   if (!dateStr) return dateStr;
//   if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
//     return `${dateStr}T12:00:00`;
//   }
//   if (/[Zz]$/.test(dateStr)) {
//     const d = new Date(dateStr);
//     const pad = (n) => String(n).padStart(2, "0");
//     const y = d.getFullYear();
//     const m = pad(d.getMonth() + 1);
//     const day = pad(d.getDate());
//     const hh = pad(d.getHours());
//     const mm = pad(d.getMinutes());
//     const ss = pad(d.getSeconds());
//     return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
//   }
//   return dateStr;
// }

// router.get("/", (req, res) => {
//   try {
//     const rows = db.prepare(`SELECT * FROM expenses ORDER BY date ASC, id ASC`).all();
//     res.json(rows);
//   } catch {
//     res.status(500).json({ error: "Erro ao buscar despesas" });
//   }
// });

// router.get("/:id", (req, res) => {
//   try {
//     const row = db.prepare(`SELECT * FROM expenses WHERE id=?`).get(+req.params.id);
//     if (!row) return res.status(404).json({ error: "Despesa não encontrada" });
//     res.json(row);
//   } catch {
//     res.status(500).json({ error: "Erro ao buscar despesa" });
//   }
// });

// router.post("/", (req, res) => {
//   try {
//     const { date, description, value } = req.body || {};
//     if (!date || !description || value == null) {
//       return res.status(400).json({ error: "Data, descrição e valor são obrigatórios" });
//     }
//     const d = ensureLocalMidday(String(date));
//     const info = db.prepare(`
//       INSERT INTO expenses (date, description, value, created_at)
//       VALUES (@date,@description,@value,@created_at)
//     `).run({ date: d, description: String(description), value: parseFloat(value), created_at: nowISO() });

//     const created = db.prepare(`SELECT * FROM expenses WHERE id=?`).get(info.lastInsertRowid);
//     res.status(201).json(created);
//   } catch {
//     res.status(500).json({ error: "Erro ao criar despesa" });
//   }
// });

// router.put("/:id", (req, res) => {
//   try {
//     const cur = db.prepare(`SELECT * FROM expenses WHERE id=?`).get(+req.params.id);
//     if (!cur) return res.status(404).json({ error: "Despesa não encontrada" });

//     const { date, description, value } = req.body || {};
//     if (!date || !description || value == null) {
//       return res.status(400).json({ error: "Data, descrição e valor são obrigatórios" });
//     }

//     db.prepare(`
//       UPDATE expenses
//       SET date=@date, description=@description, value=@value, updated_at=@updated_at
//       WHERE id=@id
//     `).run({
//       id: +req.params.id,
//       date: ensureLocalMidday(String(date)),
//       description: String(description),
//       value: parseFloat(value),
//       updated_at: nowISO()
//     });

//     const updated = db.prepare(`SELECT * FROM expenses WHERE id=?`).get(+req.params.id);
//     res.json(updated);
//   } catch {
//     res.status(500).json({ error: "Erro ao atualizar despesa" });
//   }
// });

// router.delete("/:id", (req, res) => {
//   try {
//     const info = db.prepare(`DELETE FROM expenses WHERE id=?`).run(+req.params.id);
//     if (!info.changes) return res.status(404).json({ error: "Despesa não encontrada" });
//     res.json({ message: "Despesa excluída com sucesso" });
//   } catch {
//     res.status(500).json({ error: "Erro ao excluir despesa" });
//   }
// });

// export default router;



// server/routes/expenses.js
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

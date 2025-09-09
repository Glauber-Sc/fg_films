import express from "express";
import { db, nowISO } from "../db/index.js";

const router = express.Router();

/** Sanitiza lista de pagamentos */
function sanitizePayments(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((p) => ({
      method: String(p.method ?? p.metodo ?? "Dinheiro"),
      amount: Number(p.amount ?? p.valor ?? p.value ?? 0),
      machine: p.machine ? String(p.machine) : null,
      installments: p.installments ? String(p.installments) : null,
    }))
    .filter((p) => Number.isFinite(p.amount) && p.amount > 0);
}
const sumPayments = (arr) => sanitizePayments(arr).reduce((a, b) => a + (b.amount || 0), 0);

// GET - Listar (ordenado por created_at DESC)
router.get("/", (req, res) => {
  try {
    const services = db.prepare(`SELECT * FROM services ORDER BY created_at DESC, id DESC`).all();

    // anexa pagamentos via tabela payments
    const stmt = db.prepare(`SELECT * FROM payments WHERE service_id = ? ORDER BY created_at ASC`);
    const out = services.map((s) => {
      const pays = stmt.all(s.id);
      const paymentMethods = pays.length
        ? pays.map((p) => ({
            method: p.method,
            amount: p.amount,
            machine: p.machine ?? "",
            installments: p.installments ?? "",
          }))
        : undefined;
      return { ...s, paymentMethods };
    });
    res.json(out);
  } catch {
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

// GET - Por ID
router.get("/:id", (req, res) => {
  try {
    const s = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
    if (!s) return res.status(404).json({ error: "Serviço não encontrado" });
    const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(+req.params.id);
    const paymentMethods = pays.length
      ? pays.map((p) => ({
          method: p.method,
          amount: p.amount,
          machine: p.machine ?? "",
          installments: p.installments ?? "",
        }))
      : undefined;
    res.json({ ...s, paymentMethods });
  } catch {
    res.status(500).json({ error: "Erro ao buscar serviço" });
  }
});

// POST - Criar (SEM 'date')
router.post("/", (req, res) => {
  try {
    const { description, employee, value, paymentMethods, payments, payment } = req.body || {};
    if (!description || !employee || value == null) {
      return res.status(400).json({ error: "Descrição, funcionário e valor são obrigatórios" });
    }

    const now = nowISO();
    const tx = db.transaction(() => {
      const info = db
        .prepare(
          `INSERT INTO services (description, employee, value, payment, created_at)
           VALUES (@description,@employee,@value,@payment,@created_at)`
        )
        .run({
          description: String(description),
          employee: String(employee),
          value: parseFloat(value),
          payment: typeof payment === "string" && payment.trim() ? payment.trim() : null,
          created_at: now,
        });

      const id = info.lastInsertRowid;

      const pmList = sanitizePayments(paymentMethods ?? payments);
      if (pmList.length) {
        const ins = db.prepare(
          `INSERT INTO payments (id, service_id, method, amount, machine, installments, created_at)
           VALUES (@id,@service_id,@method,@amount,@machine,@installments,@created_at)`
        );
        for (const p of pmList) {
          ins.run({
            id: Math.random().toString(36).slice(2),
            service_id: id,
            method: p.method,
            amount: p.amount,
            machine: p.machine ?? null,
            installments: p.installments ?? null,
            created_at: now,
          });
        }
        const total = sumPayments(pmList);
        db.prepare(`UPDATE services SET paid_total=@t, paid_at=@when WHERE id=@id`).run({ t: total, when: now, id });
      }

      return db.prepare(`SELECT * FROM services WHERE id=?`).get(id);
    });

    const created = tx();
    const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(created.id);
    const paymentMethodsOut = pays.length
      ? pays.map((p) => ({
          method: p.method,
          amount: p.amount,
          machine: p.machine ?? "",
          installments: p.installments ?? "",
        }))
      : undefined;

    res.status(201).json({ ...created, paymentMethods: paymentMethodsOut });
  } catch {
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
});

// PUT - Atualizar dados (SEM 'date')
router.put("/:id", (req, res) => {
  try {
    const cur = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
    if (!cur) return res.status(404).json({ error: "Serviço não encontrado" });

    const { description, employee, value, paymentMethods, payments, payment } = req.body || {};
    if (!description || !employee || value == null) {
      return res.status(400).json({ error: "Descrição, funcionário e valor são obrigatórios" });
    }

    const now = nowISO();
    const tx = db.transaction(() => {
      db.prepare(
        `UPDATE services
         SET description=@description, employee=@employee, value=@value, payment=@payment, updated_at=@updated_at
         WHERE id=@id`
      ).run({
        id: +req.params.id,
        description: String(description),
        employee: String(employee),
        value: parseFloat(value),
        payment: typeof payment === "string" && payment.trim() ? payment.trim() : null,
        updated_at: now,
      });

      // se veio lista de pagamentos, substitui
      const pmInput = paymentMethods ?? payments;
      if (Array.isArray(pmInput)) {
        db.prepare(`DELETE FROM payments WHERE service_id=?`).run(+req.params.id);
        const pmList = sanitizePayments(pmInput);
        if (pmList.length) {
          const ins = db.prepare(
            `INSERT INTO payments (id, service_id, method, amount, machine, installments, created_at)
             VALUES (@id,@service_id,@method,@amount,@machine,@installments,@created_at)`
          );
          for (const p of pmList) {
            ins.run({
              id: Math.random().toString(36).slice(2),
              service_id: +req.params.id,
              method: p.method,
              amount: p.amount,
              machine: p.machine ?? null,
              installments: p.installments ?? null,
              created_at: now,
            });
          }
          db.prepare(`UPDATE services SET paid_total=@t, paid_at=@when WHERE id=@id`).run({
            t: sumPayments(pmList),
            when: now,
            id: +req.params.id,
          });
        } else {
          db.prepare(`UPDATE services SET paid_total=NULL, paid_at=NULL WHERE id=@id`).run({ id: +req.params.id });
        }
      }
    });
    tx();

    const svc = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
    const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(+req.params.id);
    const paymentMethodsOut = pays.length
      ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
      : undefined;

    res.json({ ...svc, paymentMethods: paymentMethodsOut });
  } catch {
    res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
});

// PATCH - apenas pagamentos
router.patch("/:id/payments", (req, res) => {
  try {
    const exists = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
    if (!exists) return res.status(404).json({ error: "Serviço não encontrado" });

    const { paymentMethods, payments, payment } = req.body || {};
    const now = nowISO();

    const tx = db.transaction(() => {
      const pmList = sanitizePayments(paymentMethods ?? payments);
      db.prepare(`DELETE FROM payments WHERE service_id=?`).run(+req.params.id);

      if (pmList.length) {
        const ins = db.prepare(
          `INSERT INTO payments (id, service_id, method, amount, machine, installments, created_at)
           VALUES (@id,@service_id,@method,@amount,@machine,@installments,@created_at)`
        );
        for (const p of pmList) {
          ins.run({
            id: Math.random().toString(36).slice(2),
            service_id: +req.params.id,
            method: p.method,
            amount: p.amount,
            machine: p.machine ?? null,
            installments: p.installments ?? null,
            created_at: now,
          });
        }
        db.prepare(`UPDATE services SET paid_total=@t, paid_at=@when, payment=NULL, updated_at=@u WHERE id=@id`).run({
          t: sumPayments(pmList),
          when: now,
          u: now,
          id: +req.params.id,
        });
      } else if (typeof payment === "string" && payment.trim()) {
        db.prepare(`UPDATE services SET payment=@p, paid_total=NULL, paid_at=NULL, updated_at=@u WHERE id=@id`).run({
          p: payment.trim(),
          u: now,
          id: +req.params.id,
        });
      } else {
        db.prepare(`UPDATE services SET updated_at=@u WHERE id=@id`).run({ u: now, id: +req.params.id });
      }
    });
    tx();

    const svc = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
    const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(+req.params.id);
    const paymentMethodsOut = pays.length
      ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
      : undefined;
    res.json({ ...svc, paymentMethods: paymentMethodsOut });
  } catch {
    res.status(500).json({ error: "Erro ao atualizar pagamentos do serviço" });
  }
});

// DELETE
router.delete("/:id", (req, res) => {
  try {
    const info = db.prepare(`DELETE FROM services WHERE id=?`).run(+req.params.id);
    if (!info.changes) return res.status(404).json({ error: "Serviço não encontrado" });
    res.json({ message: "Serviço excluído com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro ao excluir serviço" });
  }
});

export default router;

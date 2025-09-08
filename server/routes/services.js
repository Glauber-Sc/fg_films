// // import express from "express";
// // import { fileURLToPath } from "url";
// // import { dirname, join } from "path";
// // import fs from "fs";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = dirname(__filename);

// // const router = express.Router();
// // const servicesPath = join(__dirname, "../data/services.json");

// // const readServices = () => {
// //   try {
// //     const data = fs.readFileSync(servicesPath, "utf8");
// //     return data?.trim() ? JSON.parse(data) : [];
// //   } catch {
// //     return [];
// //   }
// // };
// // const writeServices = (services) => {
// //   fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
// // };

// // /** Normaliza datas:
// //  *  - "YYYY-MM-DD" -> "YYYY-MM-DDT12:00:00" (local, evita fuso)
// //  *  - ISO com 'Z' -> converte para horário local (sem 'Z')
// //  */
// // function ensureLocalMidday(dateStr) {
// //   if (!dateStr) return dateStr;
// //   if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
// //     return `${dateStr}T12:00:00`;
// //   }
// //   if (/[Zz]$/.test(dateStr)) {
// //     const d = new Date(dateStr);
// //     const pad = (n) => String(n).padStart(2, "0");
// //     const y = d.getFullYear();
// //     const m = pad(d.getMonth() + 1);
// //     const day = pad(d.getDate());
// //     const hh = pad(d.getHours());
// //     const mm = pad(d.getMinutes());
// //     const ss = pad(d.getSeconds());
// //     return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
// //   }
// //   return dateStr;
// // }

// // /** Sanitiza lista de pagamentos mantendo compatibilidade de campos */
// // function sanitizePayments(list) {
// //   if (!Array.isArray(list)) return [];
// //   return list
// //     .map((p) => ({
// //       method: String(p.method ?? p.metodo ?? "Dinheiro"),
// //       amount: Number(p.amount ?? p.valor ?? p.value ?? 0),
// //       machine: String(p.machine ?? p.maquina ?? ""),
// //       installments: String(p.installments ?? p.parcelas ?? ""),
// //     }))
// //     .filter((p) => Number.isFinite(p.amount) && p.amount > 0);
// // }
// // const sumPayments = (arr) => sanitizePayments(arr).reduce((a, b) => a + (b.amount || 0), 0);

// // // GET - Listar
// // router.get("/", (req, res) => {
// //   try {
// //     const services = readServices();
// //     res.json(services);
// //   } catch {
// //     res.status(500).json({ error: "Erro ao buscar serviços" });
// //   }
// // });

// // // GET - Por ID
// // router.get("/:id", (req, res) => {
// //   try {
// //     const services = readServices();
// //     const svc = services.find((s) => s.id === parseInt(req.params.id, 10));
// //     if (!svc) return res.status(404).json({ error: "Serviço não encontrado" });
// //     res.json(svc);
// //   } catch {
// //     res.status(500).json({ error: "Erro ao buscar serviço" });
// //   }
// // });

// // // POST - Criar
// // router.post("/", (req, res) => {
// //   try {
// //     const { date, description, employee, value, paymentMethods, payments, payment } = req.body;
// //     if (!date || !description || !employee || value == null) {
// //       return res.status(400).json({ error: "Data, descrição, funcionário e valor são obrigatórios" });
// //     }

// //     const services = readServices();
// //     const newService = {
// //       id: services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1,
// //       date: ensureLocalMidday(String(date)),
// //       description: String(description),
// //       employee: String(employee),
// //       value: parseFloat(value),
// //       createdAt: new Date().toISOString(),
// //     };

// //     // ⬇️ salva pagamentos, se enviados já na criação
// //     const pmList = sanitizePayments(paymentMethods ?? payments);
// //     if (pmList.length) {
// //       newService.paymentMethods = pmList;
// //       newService.paidTotal = Number(sumPayments(pmList).toFixed(2));
// //       newService.paidAt = new Date().toISOString();
// //     } else if (typeof payment === "string" && payment.trim()) {
// //       // permite um resumo textual legado
// //       newService.payment = payment.trim();
// //     }

// //     services.push(newService);
// //     writeServices(services);
// //     res.status(201).json(newService);
// //   } catch (e) {
// //     res.status(500).json({ error: "Erro ao criar serviço" });
// //   }
// // });

// // // PUT - Atualizar dados do serviço (não apaga pagamentos existentes se não vierem no body)
// // router.put("/:id", (req, res) => {
// //   try {
// //     const { date, description, employee, value, paymentMethods, payments, payment } = req.body;
// //     if (!date || !description || !employee || value == null) {
// //       return res.status(400).json({ error: "Data, descrição, funcionário e valor são obrigatórios" });
// //     }

// //     const services = readServices();
// //     const idx = services.findIndex((s) => s.id === parseInt(req.params.id, 10));
// //     if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });

// //     const svc = services[idx];
// //     const pmInput = paymentMethods ?? payments;

// //     services[idx] = {
// //       ...svc,
// //       date: ensureLocalMidday(String(date)),
// //       description: String(description),
// //       employee: String(employee),
// //       value: parseFloat(value),
// //       updatedAt: new Date().toISOString(),
// //       ...(Array.isArray(pmInput)
// //         ? (() => {
// //             const pmList = sanitizePayments(pmInput);
// //             if (pmList.length) {
// //               return {
// //                 paymentMethods: pmList,
// //                 paidTotal: Number(sumPayments(pmList).toFixed(2)),
// //                 paidAt: new Date().toISOString(),
// //                 payment: undefined,
// //               };
// //             }
// //             return {};
// //           })()
// //         : typeof payment === "string" && payment.trim()
// //         ? { payment: payment.trim(), paymentMethods: undefined, paidTotal: undefined }
// //         : {}),
// //     };

// //     writeServices(services);
// //     res.json(services[idx]);
// //   } catch {
// //     res.status(500).json({ error: "Erro ao atualizar serviço" });
// //   }
// // });

// // // PATCH - Anexar/atualizar pagamentos de um serviço
// // router.patch("/:id/payments", (req, res) => {
// //   try {
// //     const { paymentMethods, payments, payment } = req.body;

// //     const services = readServices();
// //     const idx = services.findIndex((s) => s.id === parseInt(req.params.id, 10));
// //     if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });

// //     const pmList = sanitizePayments(paymentMethods ?? payments);

// //     if (pmList.length) {
// //       services[idx].paymentMethods = pmList;
// //       services[idx].paidTotal = Number(sumPayments(pmList).toFixed(2));
// //       services[idx].paidAt = new Date().toISOString();
// //       delete services[idx].payment; // preferimos a lista detalhada
// //     } else if (typeof payment === "string" && payment.trim()) {
// //       services[idx].payment = payment.trim();
// //       delete services[idx].paymentMethods;
// //       delete services[idx].paidTotal;
// //     }

// //     services[idx].updatedAt = new Date().toISOString();
// //     writeServices(services);
// //     res.json(services[idx]);
// //   } catch (e) {
// //     res.status(500).json({ error: "Erro ao atualizar pagamentos do serviço" });
// //   }
// // });

// // // DELETE - Excluir
// // router.delete("/:id", (req, res) => {
// //   try {
// //     const services = readServices();
// //     const idx = services.findIndex((s) => s.id === parseInt(req.params.id, 10));
// //     if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });

// //     services.splice(idx, 1);
// //     writeServices(services);
// //     res.json({ message: "Serviço excluído com sucesso" });
// //   } catch {
// //     res.status(500).json({ error: "Erro ao excluir serviço" });
// //   }
// // });

// // export default router;



// // server/routes/services.js
// import express from "express";
// import { db, nowISO } from "../db/index.js";

// const router = express.Router();

// /** Normaliza datas */
// function ensureLocalMidday(dateStr) {
//   if (!dateStr) return dateStr;
//   if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T12:00:00`;
//   if (/[Zz]$/.test(dateStr)) {
//     const d = new Date(dateStr);
//     const pad = (n) => String(n).padStart(2, "0");
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
//   }
//   return dateStr;
// }

// /** Sanitiza lista de pagamentos */
// function sanitizePayments(list) {
//   if (!Array.isArray(list)) return [];
//   return list
//     .map((p) => ({
//       method: String(p.method ?? p.metodo ?? "Dinheiro"),
//       amount: Number(p.amount ?? p.valor ?? p.value ?? 0),
//       machine: p.machine ? String(p.machine) : null,
//       installments: p.installments ? String(p.installments) : null,
//     }))
//     .filter((p) => Number.isFinite(p.amount) && p.amount > 0);
// }
// const sumPayments = (arr) => sanitizePayments(arr).reduce((a, b) => a + (b.amount || 0), 0);

// // GET - Listar
// router.get("/", (req, res) => {
//   try {
//     const services = db.prepare(`SELECT * FROM services ORDER BY date ASC, id ASC`).all();
//     // anexa pagamentos (se houver) via tabela payments
//     const stmt = db.prepare(`SELECT * FROM payments WHERE service_id = ? ORDER BY created_at ASC`);
//     const out = services.map((s) => {
//       const pays = stmt.all(s.id);
//       const paymentMethods = pays.length
//         ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
//         : undefined;
//       return { ...s, paymentMethods };
//     });
//     res.json(out);
//   } catch {
//     res.status(500).json({ error: "Erro ao buscar serviços" });
//   }
// });

// // GET - Por ID
// router.get("/:id", (req, res) => {
//   try {
//     const s = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
//     if (!s) return res.status(404).json({ error: "Serviço não encontrado" });
//     const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(+req.params.id);
//     const paymentMethods = pays.length
//       ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
//       : undefined;
//     res.json({ ...s, paymentMethods });
//   } catch {
//     res.status(500).json({ error: "Erro ao buscar serviço" });
//   }
// });

// // POST - Criar
// router.post("/", (req, res) => {
//   try {
//     const { date, description, employee, value, paymentMethods, payments, payment } = req.body || {};
//     if (!date || !description || !employee || value == null) {
//       return res.status(400).json({ error: "Data, descrição, funcionário e valor são obrigatórios" });
//     }

//     const d = ensureLocalMidday(String(date));
//     const tx = db.transaction(() => {
//       const info = db.prepare(`
//         INSERT INTO services (date, description, employee, value, payment, created_at)
//         VALUES (@date,@description,@employee,@value,@payment,@created_at)
//       `).run({
//         date: d,
//         description: String(description),
//         employee: String(employee),
//         value: parseFloat(value),
//         payment: typeof payment === "string" && payment.trim() ? payment.trim() : null,
//         created_at: nowISO()
//       });

//       const id = info.lastInsertRowid;

//       const pmList = sanitizePayments(paymentMethods ?? payments);
//       if (pmList.length) {
//         const ins = db.prepare(`
//           INSERT INTO payments (id, service_id, method, amount, machine, installments, created_at)
//           VALUES (@id,@service_id,@method,@amount,@machine,@installments,@created_at)
//         `);
//         const when = nowISO();
//         for (const p of pmList) {
//           ins.run({
//             id: Math.random().toString(36).slice(2),
//             service_id: id,
//             method: p.method,
//             amount: p.amount,
//             machine: p.machine ?? null,
//             installments: p.installments ?? null,
//             created_at: when
//           });
//         }
//         const total = sumPayments(pmList);
//         db.prepare(`UPDATE services SET paid_total=@t, paid_at=@when WHERE id=@id`).run({ t: total, when, id });
//       }

//       return db.prepare(`SELECT * FROM services WHERE id=?`).get(id);
//     });

//     const created = tx();
//     const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(created.id);
//     const paymentMethodsOut = pays.length
//       ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
//       : undefined;

//     res.status(201).json({ ...created, paymentMethods: paymentMethodsOut });
//   } catch {
//     res.status(500).json({ error: "Erro ao criar serviço" });
//   }
// });

// // PUT - Atualizar dados
// router.put("/:id", (req, res) => {
//   try {
//     const cur = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
//     if (!cur) return res.status(404).json({ error: "Serviço não encontrado" });

//     const { date, description, employee, value, paymentMethods, payments, payment } = req.body || {};
//     if (!date || !description || !employee || value == null) {
//       return res.status(400).json({ error: "Data, descrição, funcionário e valor são obrigatórios" });
//     }

//     const tx = db.transaction(() => {
//       db.prepare(`
//         UPDATE services
//         SET date=@date, description=@description, employee=@employee, value=@value, payment=@payment, updated_at=@updated_at
//         WHERE id=@id
//       `).run({
//         id: +req.params.id,
//         date: ensureLocalMidday(String(date)),
//         description: String(description),
//         employee: String(employee),
//         value: parseFloat(value),
//         payment: typeof payment === "string" && payment.trim() ? payment.trim() : null,
//         updated_at: nowISO()
//       });

//       // se veio lista de pagamentos, substitui os existentes por essa lista
//       const pmInput = paymentMethods ?? payments;
//       if (Array.isArray(pmInput)) {
//         db.prepare(`DELETE FROM payments WHERE service_id=?`).run(+req.params.id);
//         const pmList = sanitizePayments(pmInput);
//         if (pmList.length) {
//           const ins = db.prepare(`
//             INSERT INTO payments (id, service_id, method, amount, machine, installments, created_at)
//             VALUES (@id,@service_id,@method,@amount,@machine,@installments,@created_at)
//           `);
//           const when = nowISO();
//           for (const p of pmList) {
//             ins.run({
//               id: Math.random().toString(36).slice(2),
//               service_id: +req.params.id,
//               method: p.method, amount: p.amount,
//               machine: p.machine ?? null, installments: p.installments ?? null,
//               created_at: when
//             });
//           }
//           db.prepare(`UPDATE services SET paid_total=@t, paid_at=@when WHERE id=@id`)
//             .run({ t: sumPayments(pmList), when, id: +req.params.id });
//         } else {
//           // limpa marcações de pagamento
//           db.prepare(`UPDATE services SET paid_total=NULL, paid_at=NULL WHERE id=@id`).run({ id: +req.params.id });
//         }
//       }
//     });
//     tx();

//     const svc = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
//     const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(+req.params.id);
//     const paymentMethodsOut = pays.length
//       ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
//       : undefined;

//     res.json({ ...svc, paymentMethods: paymentMethodsOut });
//   } catch {
//     res.status(500).json({ error: "Erro ao atualizar serviço" });
//   }
// });

// // PATCH - atualizar/definir somente pagamentos
// router.patch("/:id/payments", (req, res) => {
//   try {
//     const exists = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
//     if (!exists) return res.status(404).json({ error: "Serviço não encontrado" });

//     const { paymentMethods, payments, payment } = req.body || {};
//     const tx = db.transaction(() => {
//       const pmList = sanitizePayments(paymentMethods ?? payments);
//       db.prepare(`DELETE FROM payments WHERE service_id=?`).run(+req.params.id);

//       if (pmList.length) {
//         const ins = db.prepare(`
//           INSERT INTO payments (id, service_id, method, amount, machine, installments, created_at)
//           VALUES (@id,@service_id,@method,@amount,@machine,@installments,@created_at)
//         `);
//         const when = nowISO();
//         for (const p of pmList) {
//           ins.run({
//             id: Math.random().toString(36).slice(2),
//             service_id: +req.params.id,
//             method: p.method, amount: p.amount,
//             machine: p.machine ?? null, installments: p.installments ?? null,
//             created_at: when
//           });
//         }
//         db.prepare(`UPDATE services SET paid_total=@t, paid_at=@when, payment=NULL WHERE id=@id`)
//           .run({ t: sumPayments(pmList), when, id: +req.params.id });
//       } else if (typeof payment === "string" && payment.trim()) {
//         db.prepare(`UPDATE services SET payment=@p, paid_total=NULL, paid_at=NULL WHERE id=@id`)
//           .run({ p: payment.trim(), id: +req.params.id });
//       }
//       db.prepare(`UPDATE services SET updated_at=@u WHERE id=@id`).run({ u: nowISO(), id: +req.params.id });
//     });
//     tx();

//     const svc = db.prepare(`SELECT * FROM services WHERE id=?`).get(+req.params.id);
//     const pays = db.prepare(`SELECT * FROM payments WHERE service_id=?`).all(+req.params.id);
//     const paymentMethodsOut = pays.length
//       ? pays.map((p) => ({ method: p.method, amount: p.amount, machine: p.machine ?? "", installments: p.installments ?? "" }))
//       : undefined;
//     res.json({ ...svc, paymentMethods: paymentMethodsOut });
//   } catch {
//     res.status(500).json({ error: "Erro ao atualizar pagamentos do serviço" });
//   }
// });

// // DELETE
// router.delete("/:id", (req, res) => {
//   try {
//     const info = db.prepare(`DELETE FROM services WHERE id=?`).run(+req.params.id);
//     if (!info.changes) return res.status(404).json({ error: "Serviço não encontrado" });
//     res.json({ message: "Serviço excluído com sucesso" });
//   } catch {
//     res.status(500).json({ error: "Erro ao excluir serviço" });
//   }
// });

// export default router;



// server/routes/services.js
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

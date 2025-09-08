import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const servicesPath = join(__dirname, "../data/services.json");

const readServices = () => {
  try {
    const data = fs.readFileSync(servicesPath, "utf8");
    return data?.trim() ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
const writeServices = (services) => {
  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
};

/** Normaliza datas:
 *  - "YYYY-MM-DD" -> "YYYY-MM-DDT12:00:00" (local, evita fuso)
 *  - ISO com 'Z' -> converte para horário local (sem 'Z')
 */
function ensureLocalMidday(dateStr) {
  if (!dateStr) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr}T12:00:00`;
  }
  if (/[Zz]$/.test(dateStr)) {
    const d = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
  }
  return dateStr;
}

/** Sanitiza lista de pagamentos mantendo compatibilidade de campos */
function sanitizePayments(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((p) => ({
      method: String(p.method ?? p.metodo ?? "Dinheiro"),
      amount: Number(p.amount ?? p.valor ?? p.value ?? 0),
      machine: String(p.machine ?? p.maquina ?? ""),
      installments: String(p.installments ?? p.parcelas ?? ""),
    }))
    .filter((p) => Number.isFinite(p.amount) && p.amount > 0);
}
const sumPayments = (arr) => sanitizePayments(arr).reduce((a, b) => a + (b.amount || 0), 0);

// GET - Listar
router.get("/", (req, res) => {
  try {
    const services = readServices();
    res.json(services);
  } catch {
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

// GET - Por ID
router.get("/:id", (req, res) => {
  try {
    const services = readServices();
    const svc = services.find((s) => s.id === parseInt(req.params.id, 10));
    if (!svc) return res.status(404).json({ error: "Serviço não encontrado" });
    res.json(svc);
  } catch {
    res.status(500).json({ error: "Erro ao buscar serviço" });
  }
});

// POST - Criar
router.post("/", (req, res) => {
  try {
    const { date, description, employee, value, paymentMethods, payments, payment } = req.body;
    if (!date || !description || !employee || value == null) {
      return res.status(400).json({ error: "Data, descrição, funcionário e valor são obrigatórios" });
    }

    const services = readServices();
    const newService = {
      id: services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1,
      date: ensureLocalMidday(String(date)),
      description: String(description),
      employee: String(employee),
      value: parseFloat(value),
      createdAt: new Date().toISOString(),
    };

    // ⬇️ salva pagamentos, se enviados já na criação
    const pmList = sanitizePayments(paymentMethods ?? payments);
    if (pmList.length) {
      newService.paymentMethods = pmList;
      newService.paidTotal = Number(sumPayments(pmList).toFixed(2));
      newService.paidAt = new Date().toISOString();
    } else if (typeof payment === "string" && payment.trim()) {
      // permite um resumo textual legado
      newService.payment = payment.trim();
    }

    services.push(newService);
    writeServices(services);
    res.status(201).json(newService);
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
});

// PUT - Atualizar dados do serviço (não apaga pagamentos existentes se não vierem no body)
router.put("/:id", (req, res) => {
  try {
    const { date, description, employee, value, paymentMethods, payments, payment } = req.body;
    if (!date || !description || !employee || value == null) {
      return res.status(400).json({ error: "Data, descrição, funcionário e valor são obrigatórios" });
    }

    const services = readServices();
    const idx = services.findIndex((s) => s.id === parseInt(req.params.id, 10));
    if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });

    const svc = services[idx];
    const pmInput = paymentMethods ?? payments;

    services[idx] = {
      ...svc,
      date: ensureLocalMidday(String(date)),
      description: String(description),
      employee: String(employee),
      value: parseFloat(value),
      updatedAt: new Date().toISOString(),
      ...(Array.isArray(pmInput)
        ? (() => {
            const pmList = sanitizePayments(pmInput);
            if (pmList.length) {
              return {
                paymentMethods: pmList,
                paidTotal: Number(sumPayments(pmList).toFixed(2)),
                paidAt: new Date().toISOString(),
                payment: undefined,
              };
            }
            return {};
          })()
        : typeof payment === "string" && payment.trim()
        ? { payment: payment.trim(), paymentMethods: undefined, paidTotal: undefined }
        : {}),
    };

    writeServices(services);
    res.json(services[idx]);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
});

// PATCH - Anexar/atualizar pagamentos de um serviço
router.patch("/:id/payments", (req, res) => {
  try {
    const { paymentMethods, payments, payment } = req.body;

    const services = readServices();
    const idx = services.findIndex((s) => s.id === parseInt(req.params.id, 10));
    if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });

    const pmList = sanitizePayments(paymentMethods ?? payments);

    if (pmList.length) {
      services[idx].paymentMethods = pmList;
      services[idx].paidTotal = Number(sumPayments(pmList).toFixed(2));
      services[idx].paidAt = new Date().toISOString();
      delete services[idx].payment; // preferimos a lista detalhada
    } else if (typeof payment === "string" && payment.trim()) {
      services[idx].payment = payment.trim();
      delete services[idx].paymentMethods;
      delete services[idx].paidTotal;
    }

    services[idx].updatedAt = new Date().toISOString();
    writeServices(services);
    res.json(services[idx]);
  } catch (e) {
    res.status(500).json({ error: "Erro ao atualizar pagamentos do serviço" });
  }
});

// DELETE - Excluir
router.delete("/:id", (req, res) => {
  try {
    const services = readServices();
    const idx = services.findIndex((s) => s.id === parseInt(req.params.id, 10));
    if (idx === -1) return res.status(404).json({ error: "Serviço não encontrado" });

    services.splice(idx, 1);
    writeServices(services);
    res.json({ message: "Serviço excluído com sucesso" });
  } catch {
    res.status(500).json({ error: "Erro ao excluir serviço" });
  }
});

export default router;

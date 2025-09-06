const toBRL = (n) =>
  (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MESES = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro"
];

export const DEFAULT_COMPANY = {
  name: "FG FILMS",
  tagline: "acessórios automotivos",
  cnpj: "14.864.222/0001-67",
  phone: "(91) 98241-6768",
  address: "Rua 15 de Agosto, nº 552, Cruzeiro/Icoaraci — Belém-PA.",
  cityUF: "Belém-PA",
  logoUrl: "../assets/img/logo.png", // URL/asset da sua logo
};

// REFERENTE A:
function buildReferente(sale) {
  if (sale?.reference) return sale.reference;

  if (Array.isArray(sale?.items) && sale.items.length) {
    return sale.items
      .map((it) => `${it.qty ?? it.quantity ?? 1}x ${it.name ?? it.productName ?? ""}`.trim())
      .filter(Boolean)
      .join(" • ");
  }
  const parts = [];
  if (sale?.productName) parts.push(sale.productName);
  if (sale?.quantity) parts.push(`— ${sale.quantity}x`);
  return parts.join(" ") || "Pagamento de produtos/serviços.";
}

function getPayments(sale) {
  const a = Array.isArray(sale?.paymentMethods) ? sale.paymentMethods : [];
  const b = Array.isArray(sale?.payments) ? sale.payments : [];
  return a.length ? a : b;
}

function capPaymentsToTotal(methods = [], total = 0) {
  let remaining = Number(total) || 0;
  const out = [];
  for (const pm of methods) {
    if (remaining <= 0) break;
    const raw = Math.max(0, Number(pm.amount) || 0);
    const use = Math.min(remaining, raw);
    if (use > 0) {
      const parcelas =
        pm.installments && Number(pm.installments) > 1 ? ` ${pm.installments}x` : "";
      out.push({
        label: `${pm.method}${pm.machine ? ` ${pm.machine}` : ""}${parcelas}`,
        amount: Number(use.toFixed(2)),
      });
      remaining = Number((remaining - use).toFixed(2));
    }
  }
  return out;
}

function buildImportancia(sale) {
  if (sale?.amountInWords) return sale.amountInWords;

  const methods = getPayments(sale);
  if (methods.length) {
    const capped = capPaymentsToTotal(methods, sale.total);
    const mix = capped.map((p) => `${p.label}: ${toBRL(p.amount)}`).join(" | ");
    return `${toBRL(sale.total)}${mix ? ` (${mix})` : ""}`;
  }
  return toBRL(sale?.total);
}

// ==== HTML do recibo (layout preservado) ====
export function buildPaymentReceiptHTML(sale, companyOverride = {}) {
  const company = { ...DEFAULT_COMPANY, ...companyOverride };

  const d = new Date(sale?.date || Date.now());
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = MESES[d.getMonth()];
  const ano = d.getFullYear();

  const referente = buildReferente(sale);
  const importancia = buildImportancia(sale);

  const logoTag = company.logoUrl
    ? `<img class="logo" src="${company.logoUrl}" alt="${company.name}" />`
    : `<div class="logo"></div>`; // fallback

  const receiptHTML = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title></title><meta name="viewport" content="width=device-width, initial-scale=1"><style>
      @page { size: A4 portrait; margin: 10mm; }
      body { margin:0; padding:0; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }

      /* altura automática para nunca estourar o quadro */
      .sheet {
        width:730px; min-height:480px; height:auto;
        margin:0 auto; padding:10px 12px; box-sizing:border-box;
        font-family:Arial, Helvetica, sans-serif; color:#000; border:1px solid #000;
        page-break-inside: avoid; break-inside: avoid; page-break-after: avoid;
      }

      .topbar { display:flex; justify-content:space-between; align-items:center; border:1px solid #000; border-radius:10px; padding:10px 14px; height:auto; min-height:78px; }
      .brand { display:flex; align-items:center; gap:10px; }

      /* LOGO maior e colada no CNPJ */
      .brand .logo { height:130px; width:auto; object-fit:contain; display:block; margin-top:-20px; }
      .brand h1 { margin:0 0 -35px 0; line-height:0; }
      .brand .cnpj { margin-top:0; }

      .brand .tag { margin-top:-2px; font-size:12px; letter-spacing:.5px; }
      .right-box { text-align:right; line-height:1.2; }
      .right-box .phone { font-size:22px; font-weight:700; }
      .right-box .addr { font-size:12px; margin-top:4px; }
      .right-box .cnpj { font-size:11px; margin-top:2px; }

      .recibo-row { display:flex; justify-content:space-between; align-items:center; margin:12px 2px 6px; }
      .recibo-title { font-size:28px; font-weight:800; letter-spacing:1px; }

      /* Caixinha do valor — sem avaria e sem o rótulo superior */
      .rs-box {
        width:150px; height:60px; border-radius:8px; position:relative; overflow:hidden; background:#fff;
      }
      .rs-box::before {
        content:""; position:absolute; inset:0; border-radius:inherit; box-shadow:0 0 0 1px #000 inset; pointer-events:none;
      }

      /* (REMOVIDO) .rs-box span.label { ... } */

      .rs-box .amount { font-size:18px; font-weight:700; text-align:center; margin-top:18px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

      .line { border:1px solid #000; border-radius:10px; padding:10px; margin:8px 2px; }
      .field { font-size:14px; margin:10px 0 6px; }

      /* Linhas padrão (1 linha) */
      .fill { border-bottom:1px solid #000; height:24px; display:flex; align-items:center; padding:0 6px; font-size:14px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }

      /* Permite múltiplas linhas quando necessário (sem cortar) */
      .fill-wrap { border-bottom:1px solid #000; display:block; padding:2px 6px; font-size:14px; line-height:1.25; white-space:normal; word-break:break-word; height:auto; min-height:24px; }

      .muted { color:#000; opacity:.9; }
      .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:26px; }
      .assin { width:48%; text-align:center; }
      .assin .line-sign { border-top:1px solid #000; height:3px; margin-top:26px; }
      .assin .label { font-size:13px; }
      .city { width:48%; font-size:14px; text-align:right; }

      @media print {
        .sheet { page-break-inside: avoid; break-inside: avoid; page-break-after: avoid; }
      }
    </style></head><body>
      <div class="sheet">
        <div class="topbar">
          <div class="brand">
            <div>
              <h1>${logoTag}</h1>
              <div class="cnpj">CNPJ: ${company.cnpj}</div>
            </div>
          </div>
          <div class="right-box">
            <div class="phone">${company.phone}</div>
            <div class="addr">${company.address}</div>
          </div>
        </div>

        <div class="recibo-row">
          <div class="recibo-title">RECIBO</div>
          <!-- (REMOVIDO) <span class="label">R$</span> -->
          <div class="rs-box"><div class="amount">${toBRL(sale.total)}</div></div>
        </div>

        <div class="line">
          <div class="field">RECEBI (EMOS) DE:</div>
          <div class="fill">${sale.customerName || ""}</div>

          <div class="field">A IMPORTÂNCIA DE:</div>
          <div class="fill-wrap">${importancia}</div>

          <div class="field">REFERENTE A:</div>
          <div class="fill-wrap">${referente}</div>
        </div>

        <div class="footer">
          <div class="assin"><div class="line-sign"></div><div class="label">Assinatura</div></div>
          <div class="city">${company.cityUF}, ${dia} de ${mes} de ${ano}</div>
        </div>
      </div>
      <script>
        // Título/URL vazios para não aparecerem como cabeçalhos do navegador
        document.title = "";
        try { history.replaceState(null, "", ""); } catch (e) {}

        window.addEventListener('load', function(){ window.print(); });
      </script>
    </body></html>`;

  return receiptHTML;
}

export function paymentReceipt(sale, companyOverride) {
  const html = buildPaymentReceiptHTML(sale, companyOverride);
  const w = window.open("", "_blank");
  if (!w) return alert("Bloqueador de pop-up ativo. Libere pop-ups para imprimir o recibo.");
  w.document.write(html);
  w.document.close();
}

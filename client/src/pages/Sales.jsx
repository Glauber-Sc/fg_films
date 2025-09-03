import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchSales } from "../services/api";

/** Debounce simples para inputs */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Paginação padronizada (ativo preto) */
function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
  const pages = useMemo(() => {
    if (totalPages <= 1) return [1];
    const out = [];
    const add = (p) => out.push(p);
    const start = Math.max(2, currentPage - windowSize);
    const end = Math.min(totalPages - 1, currentPage + windowSize);
    add(1);
    if (start > 2) add("…");
    for (let p = start; p <= end; p++) add(p);
    if (end < totalPages - 1) add("…");
    if (totalPages > 1) add(totalPages);
    return out;
  }, [currentPage, totalPages, windowSize]);

  return (
    <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
      <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Primeira página">«</button>
      <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Página anterior">Anterior</button>
      {pages.map((p, i) => (
        <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
      ))}
      <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Próxima página">Próxima</button>
      <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Última página">»</button>
    </nav>
  );
}

/** Ícone de busca inline */
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'today', 'month'
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // URL sync
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSales();
      setSales(data);
    } catch (error) {
      console.error("Error loading sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Recibo ---
  const generateSaleReceipt = (sale) => {
    const toBRL = (n) => n?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00";
    const d = new Date(sale.date || Date.now());
    const dia = String(d.getDate()).padStart(2, "0");
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const mes = meses[d.getMonth()];
    const ano = d.getFullYear();
    const referente = sale?.reference || `${sale.productName ?? ""}${sale.quantity ? ` — ${sale.quantity}x` : ""}`;
    const importancia = sale?.amountInWords || `${toBRL(sale.total)} (${sale.paymentMethods?.map(pm => `${pm.method}${pm.machine ? ` ${pm.machine}` : ""}: ${toBRL(pm.amount)}`).join(" | ") || "à vista"})`;

    const receiptHTML = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Recibo</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>
      @page { size: A5 landscape; margin: 8mm; }
      body { margin:0; padding:0; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
      .sheet { width:730px; height:480px; margin:0 auto; padding:10px 12px; box-sizing:border-box; font-family:Arial, Helvetica, sans-serif; color:#000; border:1px solid #000; }
      .topbar { display:flex; justify-content:space-between; align-items:center; border:1px solid #000; border-radius:10px; padding:10px 14px; height:78px; }
      .brand { display:flex; align-items:center; gap:10px; }
      .brand .logo { width:80px; height:20px; border-top:3px solid #000; border-radius:100px/30px; margin-top:8px; }
      .brand h1 { margin:0; font-size:26px; letter-spacing:2px; }
      .brand .tag { margin-top:-2px; font-size:12px; letter-spacing:.5px; }
      .right-box { text-align:right; line-height:1.2; }
      .right-box .phone { font-size:22px; font-weight:700; }
      .right-box .bul { display:inline-block; width:6px; height:6px; background:#000; border-radius:50%; margin-left:6px; vertical-align:middle; }
      .right-box .addr { font-size:12px; margin-top:4px; }
      .right-box .cnpj { font-size:11px; margin-top:2px; }
      .recibo-row { display:flex; justify-content:space-between; align-items:center; margin:12px 2px 6px; }
      .recibo-title { font-size:28px; font-weight:800; letter-spacing:1px; }
      .rs-box { border:1px solid #000; width:90px; height:54px; border-radius:8px; position:relative; }
      .rs-box span.label { position:absolute; top:-10px; left:8px; background:#fff; padding:0 4px; font-size:12px; }
      .rs-box .amount { font-size:18px; font-weight:700; text-align:center; margin-top:18px; }
      .line { border:1px solid #000; border-radius:10px; padding:10px; margin:8px 2px; }
      .field { font-size:14px; margin:10px 0 6px; }
      .fill { border-bottom:1px solid #000; height:24px; display:flex; align-items:center; padding:0 6px; font-size:14px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
      .muted { color:#000; opacity:.9; }
      .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:26px; }
      .assin { width:48%; text-align:center; }
      .assin .line-sign { border-top:1px solid #000; height:36px; }
      .assin .label { font-size:13px; margin-top:4px; }
      .city { width:48%; font-size:14px; text-align:right; }
    </style></head><body>
      <div class="sheet">
        <div class="topbar">
          <div class="brand"><div class="logo"></div><div><h1>FG FILMS</h1><div class="tag">acessórios automotivos</div><div class="cnpj">CNPJ: 14.864.222/0001-67</div></div></div>
          <div class="right-box"><div class="phone">(91) 98241-6768<span class="bul"></span></div><div class="addr">Rua 15 de Agosto, nº 552, Cruzeiro/Icoaraci — Belém/PA.</div></div>
        </div>
        <div class="recibo-row"><div class="recibo-title">RECIBO</div><div class="rs-box"><span class="label">R$</span><div class="amount">${toBRL(sale.total)}</div></div></div>
        <div class="line">
          <div class="field">RECEBI (EMOS) DE:</div>
          <div class="fill">${sale.customerName || ""}</div>
          <div class="field">A IMPORTÂNCIA DE:</div>
          <div class="fill">${importancia}</div>
          <div class="field">REFERENTE A:</div>
          <div class="fill">${referente}</div>
        </div>
        <div class="footer"><div class="assin"><div class="line-sign"></div><div class="label">Assinatura</div></div><div class="city">Belém/PA, ${dia} de ${mes} de ${ano}</div></div>
      </div>
      <script>window.addEventListener('load', function(){ window.print(); });</script>
    </body></html>`;

    const w = window.open("", "_blank");
    w.document.write(receiptHTML);
    w.document.close();
  };

  // --- Filtro por período + busca ---
  const filteredSales = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // período
    let base = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      if (filter === "today") return saleDate >= today;
      if (filter === "month") return saleDate >= firstDayOfMonth;
      return true;
    });

    // busca por produto / cliente / forma de pagamento
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      base = base.filter((s) => {
        const hay = [s.productName, s.customerName, ...(s.paymentMethods?.map((pm) => pm.method) || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return base;
  }, [sales, filter, debouncedQuery]);

  // Reset página quando filtro/busca mudarem
  useEffect(() => { setCurrentPage(1); }, [filter, debouncedQuery, pageSize]);

  // Totais
  const totalSales = useMemo(() => sales.reduce((sum, s) => sum + (s.total || 0), 0), [sales]);
  const filteredTotal = useMemo(() => filteredSales.reduce((sum, s) => sum + (s.total || 0), 0), [filteredSales]);

  // Paginação
  const totalItems = filteredSales.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredSales.slice(startIdx, endIdx);

  // URL sync (?page=..&pageSize=..&filter=..&q=..)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    if (filter && filter !== "all") params.set("filter", filter); else params.delete("filter");
    if (query) params.set("q", query); else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, filter, query, searchParams, setSearchParams]);

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vendas</h1>
        <p className="text-sm text-gray-500">Acompanhe as vendas e emita recibos</p>
      </div>

      {/* Abas (Todas | Hoje | Este mês) */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {[
            { key: "all", label: "Todas" },
            { key: "today", label: "Hoje" },
            { key: "month", label: "Este mês" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${filter === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Toolbar (busca, page size, nova venda) */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, produto ou forma de pagamento"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            aria-label="Buscar vendas"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
            <div className="relative">
              <select
                id="pageSize"
                className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
            </div>
          </div>

          <Link
            to="/sales/new"
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            <PlusIcon className="h-5 w-5" /> Nova Venda
          </Link>
        </div>
      </div>

      {/* Card + tabela padronizados */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lista de Vendas</h3>
            <p className="text-sm text-gray-500">Resumo do período selecionado</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total no período</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredTotal)}</p>
            <p className="text-xs text-gray-500">{totalItems} vendas</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Qtd</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço Unitário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pagamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.customerName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{sale.quantity}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{formatCurrency(sale.unitPrice)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(sale.total)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {sale.paymentMethods && sale.paymentMethods.length > 0 ? (
                          <div className="text-xs leading-5 text-gray-700">
                            {sale.paymentMethods.map((pm, index) => (
                              <div key={index}>
                                {pm.method}
                                {pm.machine ? ` (${pm.machine})` : ""}: {formatCurrency(pm.amount)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">Não especificado</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button onClick={() => generateSaleReceipt(sale)} className="p-1 text-blue-600 hover:text-blue-800" title="Gerar Recibo">
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Nenhuma venda encontrada</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer de paginação */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-gray-700">
          {totalItems > 0 ? (
            <span>
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> vendas
            </span>
          ) : (
            <span>Nenhum registro</span>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
        )}
      </div>
    </div>
  );
};

export default Sales;
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PlusIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchSales } from "../services/api";
import { paymentReceipt } from "../utils/paymentReceipt";
import { groupSales } from "../utils/groupSales";
import logo from "../assets/img/logo.png";

/** Debounce simples para inputs */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Helpers de data (local) */
function dateKey(d = new Date()) {
  // "YYYY-MM-DD" no fuso local
  const yr = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${yr}-${m}-${day}`;
}
function startOfDay(key) {
  // key: "YYYY-MM-DD"
  const d = new Date(`${key}T00:00:00`);
  return d;
}
function endOfDay(key) {
  const d = new Date(`${key}T23:59:59.999`);
  return d;
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
  const [rawSales, setRawSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Novo: modo "day" padrão + controle de data selecionada ---
  // modes: 'day' | 'month' | 'all'
  const [mode, setMode] = useState("day");
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date())); // hoje por padrão

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // URL sync
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;
  const initialMode = searchParams.get("mode") || "day";
  const initialDate = searchParams.get("date") || dateKey(new Date());

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Inicializa mode/data com o que vier da URL (uma vez)
  useEffect(() => {
    setMode(initialMode);
    setSelectedDate(initialDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // apenas no mount

  // Carrega vendas
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchSales();
        setRawSales(data || []);
      } catch (error) {
        console.error("Error loading sales:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- Auto-renovar à meia-noite: muda a selectedDate para "hoje" quando virar o dia ---
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ms = tomorrow.getTime() - now.getTime();
    const id = setTimeout(() => {
      const todayStr = dateKey(new Date());
      setSelectedDate(todayStr);
      // opcional: recarregar as vendas
      (async () => {
        try {
          const data = await fetchSales();
          setRawSales(data || []);
        } catch (e) {
          console.error("Error refreshing at midnight", e);
        }
      })();
    }, ms);
    return () => clearTimeout(id);
  }, []);

  // --- Agrupamento (mais recentes primeiro) ---
  const groupedSales = useMemo(() => groupSales(rawSales), [rawSales]);

  // --- Filtro por período + busca ---
  const filteredSales = useMemo(() => {
    let base = groupedSales;

    // recortes por modo
    if (mode === "day") {
      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);
      base = base.filter((s) => {
        const d = new Date(s.date);
        return d >= start && d <= end;
      });
    } else if (mode === "month") {
      const d = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      base = base.filter((s) => {
        const ds = new Date(s.date);
        return ds >= monthStart && ds <= monthEnd;
      });
    } else {
      // 'all' = sem recorte por data
    }

    // Busca
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      base = base.filter((s) => {
        const itemNames = s.items.map((i) => i.name).join(" ");
        const pmNames = (s.paymentMethods || []).map((pm) => pm.method).join(" ");
        const hay = [itemNames, s.customerName, pmNames].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
    }

    return base;
  }, [groupedSales, mode, selectedDate, debouncedQuery]);

  // Reset página quando qualquer filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [mode, selectedDate, debouncedQuery, pageSize]);

  // Totais
  const filteredTotal = useMemo(() => filteredSales.reduce((sum, s) => sum + (s.total || 0), 0), [filteredSales]);

  // Paginação
  const totalItems = filteredSales.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredSales.slice(startIdx, endIdx);

  // URL sync (?page=..&pageSize=..&mode=..&date=..&q=..)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    params.set("mode", mode);
    if (selectedDate) params.set("date", selectedDate);
    else params.delete("date");
    if (query) params.set("q", query);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, mode, selectedDate, query, searchParams, setSearchParams]);

  // Navegação de dia
  const goPrevDay = () => {
    const d = new Date(`${selectedDate}T00:00:00`);
    d.setDate(d.getDate() - 1);
    setSelectedDate(dateKey(d));
    setMode("day");
  };
  const goNextDay = () => {
    const d = new Date(`${selectedDate}T00:00:00`);
    d.setDate(d.getDate() + 1);
    setSelectedDate(dateKey(d));
    setMode("day");
  };
  const goToday = () => {
    setSelectedDate(dateKey(new Date()));
    setMode("day");
  };

  const niceDateLabel =
    mode === "day"
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString()
      : mode === "month"
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : "Todas as vendas";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vendas</h1>
        <p className="text-sm text-gray-500">
          {mode === "day" ? "Listando as vendas do dia selecionado" : mode === "month" ? "Vendas do mês selecionado" : "Todas as vendas"}
        </p>
      </div>

      {/* Abas (Dia | Mês | Todas) */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap items-center gap-4">
          {[
            { key: "day", label: "Dia" },
            { key: "month", label: "Mês" },
            { key: "all", label: "Todas" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                mode === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Controles de data (mostrados quando "Dia" ou "Mês") */}
          <div className="ml-auto flex items-center gap-2 pb-2">
            {(mode === "day" || mode === "month") && (
              <>
                {mode === "day" && (
                  <>
                    <button
                      onClick={goPrevDay}
                      className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                      title="Dia anterior"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToday}
                      className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                      title="Hoje"
                    >
                      <CalendarDaysIcon className="h-4 w-4" />
                      Hoje
                    </button>
                    <button
                      onClick={goNextDay}
                      className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                      title="Próximo dia"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </>
                )}

                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
                    aria-label={mode === "day" ? "Selecionar dia" : "Selecionar mês (use qualquer dia do mês)"}
                  />
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Toolbar (busca, page size, nova venda) */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, item ou forma de pagamento"
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
            className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <PlusIcon className="h-5 w-5" /> Nova Venda
          </Link>
        </div>
      </div>

      {/* Card + tabela */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Vendas — {niceDateLabel}</h3>
            <p className="text-sm text-gray-500">
              {mode === "day"
                ? "Resumo do dia selecionado"
                : mode === "month"
                ? "Resumo do mês selecionado"
                : "Resumo geral"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
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
                  currentItems.map((sale) => {
                    const totalQty = sale.items.reduce((s, i) => s + (i.qty || 0), 0);
                    const first = sale.items[0];
                    const hasMany = sale.items.length > 1;
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50 align-top">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {new Date(sale.date).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {hasMany ? (
                            <>
                              <div className="font-medium">{first.name}</div>
                              <div className="text-xs text-gray-500">+ {sale.items.length - 1} itens</div>
                            </>
                          ) : (
                            first.name
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">{sale.customerName}</td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{totalQty}</td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {hasMany ? "—" : formatCurrency(first.unitPrice)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(sale.total)}
                        </td>

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
                          <button
                            onClick={() =>
                              paymentReceipt(
                                {
                                  ...sale,
                                  payments: sale.paymentMethods,
                                },
                                { logoUrl: logo }
                              )
                            }
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Gerar Recibo"
                          >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                          </button>

                          <Link
                            to={`/sales/view/${encodeURIComponent(sale.id)}`}
                            className="p-1 text-gray-700 hover:text-gray-900 inline-flex items-center"
                            title="Ver detalhes"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      Nenhuma venda encontrada
                    </td>
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
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onChange={(p) => setCurrentPage(p)}
            className="justify-center"
            windowSize={1}
          />
        )}
      </div>
    </div>
  );
};

export default Sales;

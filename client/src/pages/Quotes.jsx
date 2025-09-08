import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon, EyeIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/format";
import { fetchQuotes, deleteQuote, convertQuoteToSale } from "../services/api";

// --- Debounce ---
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// --- Ícone de busca ---
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// --- Badge de status padronizado ---
const StatusBadge = ({ status }) => {
  if (!status) return <span className="text-gray-400">—</span>;
  const map = {
    converted: { label: "Convertido", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    pending: { label: "Pendente", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  };
  const key = (status || "").toLowerCase();
  const found = map[key] || { label: status, cls: "bg-gray-100 text-gray-700 border-gray-200" };
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${found.cls}`}>
      {found.label}
    </span>
  );
};

// --- Paginação ---
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

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  // Abas por status: all | pending | converted
  const [statusTab, setStatusTab] = useState("all");

  // URL sync
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;
  const initialQ = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "all";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    if (initialQ) setQuery(initialQ);
    if (["all", "pending", "converted"].includes(initialStatus)) setStatusTab(initialStatus);
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      const data = await fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Error loading quotes:", error);
      toast.error("Erro ao carregar orçamentos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        await deleteQuote(id);
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        toast.success("Orçamento excluído com sucesso");
      } catch (error) {
        console.error("Error deleting quote:", error);
        toast.error("Erro ao excluir orçamento");
      }
    }
  };

  const handleConvertToSale = async (quote) => {
    if (window.confirm("Tem certeza que deseja converter este orçamento em venda?")) {
      try {
        await convertQuoteToSale(quote.id);
        toast.success("Orçamento convertido em venda com sucesso!");
        loadQuotes();
      } catch (error) {
        console.error("Error converting quote to sale:", error);
        toast.error("Erro ao converter orçamento em venda");
      }
    }
  };

  // --- Filtragem + BUSCA + ORDENAR (DESC) ANTES DA PAGINAÇÃO ---
  const filteredQuotes = useMemo(() => {
    // por status
    let base = quotes.filter((q) => {
      if (statusTab === "converted") return (q.status || "").toLowerCase() === "converted";
      if (statusTab === "pending") return (q.status || "").toLowerCase() !== "converted";
      return true; // all
    });

    // por texto (número ou cliente)
    const term = debouncedQuery.trim().toLowerCase();
    const searched = term
      ? base.filter((quote) => {
          const numberMatch = String(quote.quoteNumber ?? "").toLowerCase().includes(term);
          const customerMatch = String(quote.customerName ?? "").toLowerCase().includes(term);
          return numberMatch || customerMatch;
        })
      : base;

    // >>> ORDEM DECRESCENTE POR CRIAÇÃO (último criado primeiro)
    // 1) Usa createdAt/created_at/date quando existir (desc).
    // 2) Se não existir, tenta extrair timestamp do ObjectId (24 hex) do Mongo.
    // 3) Fallback: índice original invertido (último carregado primeiro).
    const indexMap = new Map();
    quotes.forEach((q, i) => indexMap.set(q.id, i));

    const getCreatedTime = (obj) => {
      const raw = obj?.createdAt ?? obj?.created_at ?? obj?.date ?? null;
      if (raw) {
        const t = new Date(raw).getTime();
        if (Number.isFinite(t)) return t;
      }
      if (typeof obj?.id === "string" && /^[a-f0-9]{24}$/i.test(obj.id)) {
        const ms = parseInt(obj.id.slice(0, 8), 16) * 1000;
        if (Number.isFinite(ms)) return ms;
      }
      return Number.NEGATIVE_INFINITY;
    };

    return [...searched].sort((a, b) => {
      const diff = getCreatedTime(b) - getCreatedTime(a);
      if (diff !== 0) return diff; // mais novo primeiro
      const ib = indexMap.get(b.id) ?? -1;
      const ia = indexMap.get(a.id) ?? -1;
      return ib - ia; // último carregado primeiro
    });
  }, [quotes, statusTab, debouncedQuery]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, pageSize, statusTab]);

  // Totais
  const totalItems = filteredQuotes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredQuotes.slice(startIdx, endIdx);

  const totalValue = useMemo(() => quotes.reduce((sum, q) => sum + (Number(q.total) || 0), 0), [quotes]);
  const filteredTotalValue = useMemo(() => filteredQuotes.reduce((sum, q) => sum + (Number(q.total) || 0), 0), [filteredQuotes]);

  // URL sync (?page, pageSize, q, status)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    if (query) params.set("q", query); else params.delete("q");
    if (statusTab && statusTab !== "all") params.set("status", statusTab); else params.delete("status");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, query, statusTab, searchParams, setSearchParams]);

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orçamentos</h1>
        <p className="text-sm text-gray-500">Gerencie propostas, acompanhe conversões e gere vendas</p>
      </div>

      {/* Abas por status */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendentes" },
            { key: "converted", label: "Convertidos" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                statusTab === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Toolbar (busca, page size, novo orçamento) */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nº do orçamento ou cliente"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Campo de busca de orçamentos"
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
            to="/quotes/add"
            className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <PlusIcon className="h-5 w-5" /> Novo Orçamento
          </Link>
        </div>
      </div>

      {/* Card + tabela padronizados */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lista de Orçamentos</h3>
            <p className="text-sm text-gray-500">Resumo por status e busca aplicada</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredTotalValue)}</p>
            <p className="text-xs text-gray-500">{totalItems} registros · total geral: {formatCurrency(totalValue)}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{quote.quoteNumber}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{new Date(quote.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{quote.customerName || "Cliente não informado"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(quote.total)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm"><StatusBadge status={(quote.status || "").toLowerCase()} /></td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link to={`/quotes/view/${quote.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Visualizar">
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          {(quote.status || "").toLowerCase() !== "converted" && (
                            <button onClick={() => handleConvertToSale(quote)} className="p-1 text-green-600 hover:text-green-800" title="Converter em Venda">
                              <ShoppingCartIcon className="h-5 w-5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(quote.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhum orçamento encontrado</td>
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
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> orçamentos
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

export default Quotes;

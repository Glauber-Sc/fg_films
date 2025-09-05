import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { fetchExpenses, deleteExpense } from "../services/api";

// Debounce simples (igual ao de Clientes)
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Ícone de busca inline
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Paginação padronizada (ativo preto)
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

const fmtBRL = (n) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(Number(n || 0));

const fmtDate = (iso) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Estado de paginação + sincronização de URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;
  const initialQ = searchParams.get("q") || "";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    if (initialQ) setSearchTerm(initialQ);
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await fetchExpenses(); // Espera [{ id, date, description, value }]
      setExpenses(data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast.error("Erro ao carregar despesas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      try {
        await deleteExpense(id);
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        toast.success("Despesa excluída com sucesso");
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Erro ao excluir despesa");
      }
    }
  };

  const filteredExpenses = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return expenses;
    return expenses.filter((e) => {
      const desc = String(e.description || "").toLowerCase();
      return desc.includes(term);
    });
  }, [expenses, debouncedSearch]);

  // Reset página ao mudar busca/pageSize
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, pageSize]);

  // Paginação
  const totalItems = filteredExpenses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredExpenses.slice(startIdx, endIdx);

  // Sincroniza na URL (?page, pageSize, q)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    if (searchTerm) params.set("q", searchTerm); else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, searchTerm, searchParams, setSearchParams]);

  const totalValor = useMemo(
    () => filteredExpenses.reduce((acc, e) => acc + Number(e.value || 0), 0),
    [filteredExpenses]
  );

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Despesas</h1>
        <p className="text-sm text-gray-500">Gerencie suas despesas do dia a dia</p>
      </div>

      {/* Toolbar (busca, page size, novo) */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Campo de busca de despesas"
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

          {/* >>> ÍCONE “+” À ESQUERDA DE *NOVA DESPESA* <<< */}
          <Link
            to="/expenses/add"
            className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <PlusIcon className="h-5 w-5" />
            Nova Despesa
          </Link>
        </div>
      </div>

      {/* Card + tabela */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lista de Despesas</h3>
            <p className="text-sm text-gray-500">Resultados da busca e paginação</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{fmtBRL(totalValor)}</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{fmtDate(e.date)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{fmtBRL(e.value)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link to={`/expenses/edit/${e.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button onClick={() => handleDelete(e.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">Nenhuma despesa encontrada</td>
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
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> despesas
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

export default Expenses;

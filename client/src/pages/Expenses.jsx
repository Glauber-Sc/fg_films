// import { useState, useEffect, useMemo } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { PlusIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import { fetchExpenses, deleteExpense } from "../services/api";
// import { formatCurrency } from "../utils/format";

// /** Debounce simples */
// function useDebounce(value, delay = 350) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return debounced;
// }

// /** Helpers data local */
// function dateKey(d = new Date()) {
//   const yr = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${yr}-${m}-${day}`;
// }
// function startOfDay(key) {
//   return new Date(`${key}T00:00:00`);
// }
// function endOfDay(key) {
//   return new Date(`${key}T23:59:59.999`);
// }

// /** Ícone de busca inline */
// const SearchIcon = (props) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
//     <circle cx="11" cy="11" r="7"></circle>
//     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//   </svg>
// );

// /** Paginação padronizada (ativo preto) */
// function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
//   const pages = useMemo(() => {
//     if (totalPages <= 1) return [1];
//     const out = [];
//     const add = (p) => out.push(p);
//     const start = Math.max(2, currentPage - windowSize);
//     const end = Math.min(totalPages - 1, currentPage + windowSize);
//     add(1);
//     if (start > 2) add("…");
//     for (let p = start; p <= end; p++) add(p);
//     if (end < totalPages - 1) add("…");
//     if (totalPages > 1) add(totalPages);
//     return out;
//   }, [currentPage, totalPages, windowSize]);

//   return (
//     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
//       <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Primeira página">«</button>
//       <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Página anterior">Anterior</button>
//       {pages.map((p, i) => (
//         <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
//       ))}
//       <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Próxima página">Próxima</button>
//       <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Última página">»</button>
//     </nav>
//   );
// }

// const Expenses = () => {
//   const [rawExpenses, setRawExpenses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // modos: 'day' | 'month' | 'all'
//   const [mode, setMode] = useState("day");
//   const [selectedDate, setSelectedDate] = useState(dateKey(new Date())); // hoje

//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearch = useDebounce(searchTerm, 300);

//   // URL sync
//   const [searchParams, setSearchParams] = useSearchParams();
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialPageSize = Number(searchParams.get("pageSize")) || 10;
//   const initialMode = searchParams.get("mode") || "day";
//   const initialDate = searchParams.get("date") || dateKey(new Date());

//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [pageSize, setPageSize] = useState(initialPageSize);

//   // Inicializa mode/date da URL
//   useEffect(() => {
//     setMode(initialMode);
//     setSelectedDate(initialDate);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Carrega despesas
//   useEffect(() => {
//     (async () => {
//       try {
//         setIsLoading(true);
//         const data = await fetchExpenses(); // espera [{id, date, description, value, category?, notes?}]
//         setRawExpenses(Array.isArray(data) ? data : []);
//       } catch (e) {
//         console.error("Error loading expenses:", e);
//         toast.error("Erro ao carregar despesas");
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   // Auto-mudar para hoje à meia-noite + recarregar (igual Vendas)
//   useEffect(() => {
//     const now = new Date();
//     const tomorrow = new Date(now);
//     tomorrow.setDate(now.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0);
//     const ms = tomorrow.getTime() - now.getTime();
//     const id = setTimeout(() => {
//       const todayStr = dateKey(new Date());
//       setSelectedDate(todayStr);
//       (async () => {
//         try {
//           const data = await fetchExpenses();
//           setRawExpenses(Array.isArray(data) ? data : []);
//         } catch (e) {
//           console.error("Error refreshing expenses at midnight:", e);
//         }
//       })();
//     }, ms);
//     return () => clearTimeout(id);
//   }, []);

//   // Ordenação por data desc e id desc
//   const sorted = useMemo(() => {
//     return [...rawExpenses].sort((a, b) => {
//       const db = new Date(b.date).getTime();
//       const da = new Date(a.date).getTime();
//       if (db !== da) return db - da;
//       return String(b.id).localeCompare(String(a.id));
//     });
//   }, [rawExpenses]);

//   // Recorte por período + busca
//   const filteredExpenses = useMemo(() => {
//     let base = sorted;

//     if (mode === "day") {
//       // filtro por chave de dia local (evita fuso/UTC)
//       base = base.filter((e) => dateKey(new Date(e.date)) === selectedDate);
//     } else if (mode === "month") {
//       const d = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
//       const monthStart = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
//       const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
//       base = base.filter((e) => {
//         const de = new Date(e.date);
//         return de >= monthStart && de <= monthEnd;
//       });
//     }

//     const q = debouncedSearch.trim().toLowerCase();
//     if (q) {
//       base = base.filter((e) => {
//         const hay = [e.description, e.category, e.notes].filter(Boolean).join(" ").toLowerCase();
//         return hay.includes(q);
//       });
//     }

//     return base;
//   }, [sorted, mode, selectedDate, debouncedSearch]);

//   // Totais
//   const filteredTotal = useMemo(
//     () => filteredExpenses.reduce((acc, e) => acc + Number(e.value || 0), 0),
//     [filteredExpenses]
//   );

//   // Reset pag quando filtros mudam
//   useEffect(() => { setCurrentPage(1); }, [mode, selectedDate, debouncedSearch, pageSize]);

//   // Paginação
//   const totalItems = filteredExpenses.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage = Math.min(Math.max(1, currentPage), totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const endIdx = Math.min(startIdx + pageSize, totalItems);
//   const currentItems = filteredExpenses.slice(startIdx, endIdx);

//   // URL sync
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", String(safePage));
//     params.set("pageSize", String(pageSize));
//     params.set("mode", mode);
//     if (selectedDate) params.set("date", selectedDate); else params.delete("date");
//     if (searchTerm) params.set("q", searchTerm); else params.delete("q");
//     setSearchParams(params, { replace: true });
//   }, [safePage, pageSize, mode, selectedDate, searchTerm, searchParams, setSearchParams]);

//   // Navegação de dia
//   const goPrevDay = () => {
//     const d = new Date(`${selectedDate}T00:00:00`);
//     d.setDate(d.getDate() - 1);
//     setSelectedDate(dateKey(d));
//     setMode("day");
//   };
//   const goNextDay = () => {
//     const d = new Date(`${selectedDate}T00:00:00`);
//     d.setDate(d.getDate() + 1);
//     setSelectedDate(dateKey(d));
//     setMode("day");
//   };
//   const goToday = () => {
//     setSelectedDate(dateKey(new Date()));
//     setMode("day");
//   };

//   const niceDateLabel =
//     mode === "day"
//       ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString()
//       : mode === "month"
//       ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" })
//       : "Todas as despesas";

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Despesas</h1>
//         <p className="text-sm text-gray-500">
//           {mode === "day" ? "Listando as despesas do dia selecionado" : mode === "month" ? "Despesas do mês selecionado" : "Todas as despesas"}
//         </p>
//       </div>

//       {/* Abas e controles de data */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex flex-wrap items-center gap-4">
//           {[
//             { key: "day", label: "Dia" },
//             { key: "month", label: "Mês" },
//             { key: "all", label: "Todas" },
//           ].map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setMode(tab.key)}
//               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
//                 mode === tab.key
//                   ? "border-gray-900 text-gray-900"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}

//           <div className="ml-auto flex items-center gap-2 pb-2">
//             {(mode === "day" || mode === "month") && (
//               <>
//                 {mode === "day" && (
//                   <>
//                     <button onClick={goPrevDay} className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50" title="Dia anterior">
//                       <ChevronLeftIcon className="h-4 w-4" />
//                     </button>
//                     <button onClick={goToday} className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50" title="Hoje">
//                       <CalendarDaysIcon className="h-4 w-4" /> Hoje
//                     </button>
//                     <button onClick={goNextDay} className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50" title="Próximo dia">
//                       <ChevronRightIcon className="h-4 w-4" />
//                     </button>
//                   </>
//                 )}
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//                     aria-label={mode === "day" ? "Selecionar dia" : "Selecionar mês (use qualquer dia do mês)"}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </nav>
//       </div>

//       {/* Toolbar */}
//       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-80">
//           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Buscar por descrição, categoria, observação"
//             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//             aria-label="Buscar despesas"
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2">
//             <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
//             <div className="relative">
//               <select
//                 id="pageSize"
//                 className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//                 value={pageSize}
//                 onChange={(e) => setPageSize(Number(e.target.value))}
//               >
//                 {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
//               </select>
//               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
//             </div>
//           </div>

//           <Link
//             to="/expenses/add"
//             className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
//           >
//             <PlusIcon className="h-5 w-5" /> Nova Despesa
//           </Link>
//         </div>
//       </div>

//       {/* Card + tabela */}
//       <div className="overflow-hidden rounded-lg bg-white shadow">
//         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Lista de Despesas — {niceDateLabel}</h3>
//             <p className="text-sm text-gray-500">
//               {mode === "day" ? "Resumo do dia selecionado" : mode === "month" ? "Resumo do mês selecionado" : "Resumo geral"}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total</p>
//             <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredTotal)}</p>
//             <p className="text-xs text-gray-500">{totalItems} despesas</p>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="py-10 text-center text-gray-600">Carregando...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Descrição</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Valor</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {currentItems.length > 0 ? (
//                   currentItems.map((e) => (
//                     <tr key={e.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm text-gray-900">{new Date(e.date).toLocaleString()}</td>
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.description}</td>
//                       <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(e.value)}</td>
//                       <td className="whitespace-nowrap px-6 py-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <Link to={`/expenses/edit/${e.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
//                             <PencilIcon className="h-5 w-5" />
//                           </Link>
//                           <button onClick={() => handleDelete(e.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
//                             <TrashIcon className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Nenhuma despesa encontrada</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Footer de paginação */}
//       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
//         <div className="text-sm text-gray-700">
//           {totalItems > 0 ? (
//             <span>
//               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> despesas
//             </span>
//           ) : (
//             <span>Nenhum registro</span>
//           )}
//         </div>
//         {totalPages > 1 && (
//           <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Expenses;



// src/pages/Expenses.jsx (ou onde fica seu componente)
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { fetchExpenses, deleteExpense } from "../services/api";
import { formatCurrency } from "../utils/format";

/** Debounce simples */
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Helpers de data local */
function dateKey(d = new Date()) {
  const yr = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${yr}-${m}-${day}`;
}

/** Ícone de busca inline */
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

/** Paginação (ativo preto) */
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
        <button
          key={`${p}-${i}`}
          type="button"
          onClick={() => (p !== "…" ? onChange(p) : null)}
          disabled={p === "…"}
          aria-current={p === currentPage ? "page" : undefined}
          className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}
        >
          {p}
        </button>
      ))}
      <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Próxima página">Próxima</button>
      <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Última página">»</button>
    </nav>
  );
}

const Expenses = () => {
  const [rawExpenses, setRawExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // modos: 'day' | 'month' | 'all'
  const [mode, setMode] = useState("day");
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date())); // hoje

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // URL sync
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;
  const initialMode = searchParams.get("mode") || "day";
  const initialDate = searchParams.get("date") || dateKey(new Date());

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setMode(initialMode);
    setSelectedDate(initialDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carrega despesas
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchExpenses(); // agora: [{ id, description, value, createdAt, updatedAt }]
        setRawExpenses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading expenses:", e);
        toast.error("Erro ao carregar despesas");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Atualiza à meia-noite
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ms = tomorrow.getTime() - now.getTime();
    const id = setTimeout(() => {
      const todayStr = dateKey(new Date());
      setSelectedDate(todayStr);
      (async () => {
        try {
          const data = await fetchExpenses();
          setRawExpenses(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("Error refreshing expenses at midnight:", e);
        }
      })();
    }, ms);
    return () => clearTimeout(id);
  }, []);

  // Ordenar por createdAt desc e id desc
  const sorted = useMemo(() => {
    return [...rawExpenses].sort((a, b) => {
      const tb = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
      const ta = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
      if (tb !== ta) return tb - ta;
      return String(b.id).localeCompare(String(a.id));
    });
  }, [rawExpenses]);

  // Filtrar por período + busca
  const filteredExpenses = useMemo(() => {
    let base = sorted;

    if (mode === "day") {
      base = base.filter((e) => dateKey(new Date(e.createdAt)) === selectedDate);
    } else if (mode === "month") {
      const d = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      base = base.filter((e) => {
        const de = new Date(e.createdAt);
        return de >= monthStart && de <= monthEnd;
      });
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      base = base.filter((e) => String(e.description || "").toLowerCase().includes(q));
    }

    return base;
  }, [sorted, mode, selectedDate, debouncedSearch]);

  // Total
  const filteredTotal = useMemo(
    () => filteredExpenses.reduce((acc, e) => acc + Number(e.value || 0), 0),
    [filteredExpenses]
  );

  // Reset pag quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [mode, selectedDate, debouncedSearch, pageSize]);

  // Paginação
  const totalItems = filteredExpenses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredExpenses.slice(startIdx, endIdx);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    params.set("mode", mode);
    if (selectedDate) params.set("date", selectedDate);
    else params.delete("date");
    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, mode, selectedDate, searchTerm, searchParams, setSearchParams]);

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
      : "Todas as despesas";

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir esta despesa?")) return;
    try {
      await deleteExpense(id);
      setRawExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Despesa excluída com sucesso");
    } catch (e) {
      console.error("Erro ao excluir despesa:", e);
      toast.error("Erro ao excluir despesa");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Despesas</h1>
        <p className="text-sm text-gray-500">
          {mode === "day"
            ? "Listando as despesas do dia selecionado"
            : mode === "month"
            ? "Despesas do mês selecionado"
            : "Todas as despesas"}
        </p>
      </div>

      {/* Abas e data */}
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
                      <CalendarDaysIcon className="h-4 w-4" /> Hoje
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

      {/* Toolbar */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            aria-label="Buscar despesas"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-600">
              Itens por página
            </label>
            <div className="relative">
              <select
                id="pageSize"
                className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </span>
            </div>
          </div>

          <Link
            to="/expenses/add"
            className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <PlusIcon className="h-5 w-5" /> Nova Despesa
          </Link>
        </div>
      </div>

      {/* Card + tabela */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Lista de Despesas — {niceDateLabel}
            </h3>
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
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(filteredTotal)}
            </p>
            <p className="text-xs text-gray-500">{totalItems} despesas</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(e.createdAt ?? e.updatedAt ?? Date.now()).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {e.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(e.value)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/expenses/edit/${e.id}`}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Excluir"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Nenhuma despesa encontrada
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
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de{" "}
              <strong>{totalItems}</strong> despesas
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

export default Expenses;

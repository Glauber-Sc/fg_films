// import { useState, useEffect, useMemo } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CalendarDaysIcon,
//   EyeIcon,
// } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import { fetchServices, deleteService, fetchSales } from "../services/api"; // ⬅️ usa vendas p/ cruzar
// import { formatCurrency, formatDate, formatTime } from "../utils/format";

// /* debounce */
// function useDebounce(value, delay = 350) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return debounced;
// }

// /* helpers */
// const dateKey = (d = new Date()) => {
//   const yr = d.getFullYear(),
//     m = String(d.getMonth() + 1).padStart(2, "0"),
//     day = String(d.getDate()).padStart(2, "0");
//   return `${yr}-${m}-${day}`;
// };
// const norm = (s) =>
//   String(s || "")
//     .trim()
//     .toLowerCase();
// const fix2 = (v) => Number(v || 0).toFixed(2);

// /* ===== pagamentos de um OBJETO ===== */
// const nnum = (v) => Number(String(v).replace(",", ".")) || 0;

// function paymentSummaryFromArray(arr) {
//   if (!Array.isArray(arr) || !arr.length) return "—";
//   return arr
//     .map((pm) => {
//       const method = pm.method || pm.metodo || pm.type || "-";
//       const machine =
//         pm.machine || pm.maquina ? ` (${pm.machine || pm.maquina})` : "";
//       const inst = pm.installments || pm.parcelas;
//       const instTxt = inst && Number(inst) > 1 ? ` ${inst}x` : "";
//       const amount = pm.amount ?? pm.valor ?? pm.value;
//       return `${method}${machine}${instTxt}: ${formatCurrency(nnum(amount))}`;
//     })
//     .join(" | ");
// }

// function paymentSummaryLocal(svc) {
//   if (typeof svc?.payment === "string" && svc.payment.trim())
//     return svc.payment.trim();
//   if (Array.isArray(svc?.paymentMethods))
//     return paymentSummaryFromArray(svc.paymentMethods);
//   if (Array.isArray(svc?.payments))
//     return paymentSummaryFromArray(svc.payments);
//   if (Array.isArray(svc?.pagamentos))
//     return paymentSummaryFromArray(svc.pagamentos);
//   return null; // significa: não há no registro do serviço
// }

// /* ===== índice p/ buscar pagamentos nas VENDAS ===== */
// function buildSalesIndex(sales = []) {
//   // chave: desc(produto) + total + dia
//   const idx = new Map();
//   for (const s of sales) {
//     const key = `${norm(s.productName)}|${fix2(s.total)}|${dateKey(
//       new Date(s.date)
//     )}`;
//     const list = idx.get(key) || [];
//     list.push(s);
//     idx.set(key, list);
//   }
//   return idx;
// }
// function paymentSummaryFromSale(sale) {
//   if (!sale) return "—";
//   if (typeof sale.payment === "string" && sale.payment.trim())
//     return sale.payment.trim();
//   return paymentSummaryFromArray(
//     sale.paymentMethods || sale.payments || sale.pagamentos || []
//   );
// }

// export default function Services() {
//   const [rawServices, setRawServices] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // vendas para cruzamento
//   const [salesIndex, setSalesIndex] = useState(new Map());

//   // filtros
//   const [mode, setMode] = useState("day");
//   const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearch = useDebounce(searchTerm, 300);

//   // URL sync
//   const [searchParams, setSearchParams] = useSearchParams();
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialPageSz = Number(searchParams.get("pageSize")) || 10;
//   const initialMode = searchParams.get("mode") || "day";
//   const initialDate = searchParams.get("date") || dateKey(new Date());
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [pageSize, setPageSize] = useState(initialPageSz);

//   useEffect(() => {
//     setMode(initialMode);
//     setSelectedDate(initialDate); /* eslint-disable-next-line */
//   }, []);

//   // carrega serviços + vendas (para cruzar pagamentos)
//   useEffect(() => {
//     (async () => {
//       try {
//         setIsLoading(true);
//         const [servicesData, salesData] = await Promise.all([
//           fetchServices(),
//           fetchSales().catch(() => []), // se não houver rota, segue vazio
//         ]);
//         setRawServices(Array.isArray(servicesData) ? servicesData : []);
//         setSalesIndex(
//           buildSalesIndex(Array.isArray(salesData) ? salesData : [])
//         );
//       } catch (e) {
//         if (e?.response?.status === 404) {
//           setRawServices([]);
//         } else {
//           console.error("Erro ao carregar:", e);
//           toast.error("Erro ao carregar serviços");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   // vira o dia -> recarrega (igual vendas)
//   useEffect(() => {
//     const now = new Date(),
//       tomorrow = new Date(now);
//     tomorrow.setDate(now.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0);
//     const ms = tomorrow.getTime() - now.getTime();
//     const id = setTimeout(async () => {
//       setSelectedDate(dateKey(new Date()));
//       try {
//         const data = await fetchServices();
//         setRawServices(Array.isArray(data) ? data : []);
//       } catch {}
//     }, ms);
//     return () => clearTimeout(id);
//   }, []);

//   const sorted = useMemo(() => {
//     return [...rawServices].sort((a, b) => {
//       const db = new Date(b.date).getTime();
//       const da = new Date(a.date).getTime();
//       if (db !== da) return db - da;
//       return String(b.id).localeCompare(String(a.id));
//     });
//   }, [rawServices]);

//   // pagamento (com fallback para vendas)
//   const getPaymentText = (svc) => {
//     const local = paymentSummaryLocal(svc);
//     if (local) return local;

//     // tenta achar venda equivalente no mesmo dia e valor (e mesma descrição)
//     const k = `${norm(svc.description)}|${fix2(svc.value)}|${dateKey(
//       new Date(svc.date)
//     )}`;
//     const sale = (salesIndex.get(k) || [])[0];
//     return paymentSummaryFromSale(sale) || "—";
//   };

//   const filteredServices = useMemo(() => {
//     let base = sorted;
//     if (mode === "day") {
//       base = base.filter((s) => dateKey(new Date(s.date)) === selectedDate);
//     } else if (mode === "month") {
//       const d = selectedDate
//         ? new Date(`${selectedDate}T00:00:00`)
//         : new Date();
//       const monthStart = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
//       const monthEnd = new Date(
//         d.getFullYear(),
//         d.getMonth() + 1,
//         0,
//         23,
//         59,
//         59,
//         999
//       );
//       base = base.filter((s) => {
//         const ds = new Date(s.date);
//         return ds >= monthStart && ds <= monthEnd;
//       });
//     }

//     const q = debouncedSearch.trim().toLowerCase();
//     if (q) {
//       base = base.filter((s) => {
//         const payText = getPaymentText(s);
//         const hay = [s.description, s.employee, payText]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase();
//         return hay.includes(q);
//       });
//     }
//     return base;
//   }, [sorted, mode, selectedDate, debouncedSearch, salesIndex]);

//   const filteredTotal = useMemo(
//     () => filteredServices.reduce((acc, s) => acc + Number(s.value || 0), 0),
//     [filteredServices]
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [mode, selectedDate, debouncedSearch, pageSize]);

//   const totalItems = filteredServices.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage = Math.min(Math.max(1, currentPage), totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const endIdx = Math.min(startIdx + pageSize, totalItems);
//   const currentItems = filteredServices.slice(startIdx, endIdx);

//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", String(safePage));
//     params.set("pageSize", String(pageSize));
//     params.set("mode", mode);
//     if (selectedDate) params.set("date", selectedDate);
//     else params.delete("date");
//     if (searchTerm) params.set("q", searchTerm);
//     else params.delete("q");
//     setSearchParams(params, { replace: true });
//   }, [
//     safePage,
//     pageSize,
//     mode,
//     selectedDate,
//     searchTerm,
//     searchParams,
//     setSearchParams,
//   ]);

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
//       ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
//           month: "long",
//           year: "numeric",
//         })
//       : "Todos os serviços";

//   const handleDelete = async (id) => {
//     if (!window.confirm("Deseja excluir este serviço?")) return;
//     try {
//       await deleteService(id);
//       setRawServices((prev) => prev.filter((s) => s.id !== id));
//       toast.success("Serviço excluído com sucesso");
//     } catch (e) {
//       if (e?.response?.status === 404) {
//         setRawServices((prev) => prev.filter((s) => s.id !== id));
//         toast.success("Serviço excluído com sucesso");
//       } else {
//         console.error("Erro ao excluir serviço:", e);
//         toast.error("Erro ao excluir serviço");
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
//         <p className="text-sm text-gray-500">
//           {mode === "day"
//             ? "Listando os serviços do dia selecionado"
//             : mode === "month"
//             ? "Serviços do mês selecionado"
//             : "Todos os serviços"}
//         </p>
//       </div>

//       {/* Abas / data */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex flex-wrap items-center gap-4">
//           {[
//             { key: "day", label: "Dia" },
//             { key: "month", label: "Mês" },
//             { key: "all", label: "Todos" },
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
//                     <button
//                       onClick={goPrevDay}
//                       className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
//                       title="Dia anterior"
//                     >
//                       <ChevronLeftIcon className="h-4 w-4" />
//                     </button>
//                     <button
//                       onClick={goToday}
//                       className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
//                       title="Hoje"
//                     >
//                       <CalendarDaysIcon className="h-4 w-4" /> Hoje
//                     </button>
//                     <button
//                       onClick={goNextDay}
//                       className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
//                       title="Próximo dia"
//                     >
//                       <ChevronRightIcon className="h-4 w-4" />
//                     </button>
//                   </>
//                 )}
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//                   aria-label={
//                     mode === "day"
//                       ? "Selecionar dia"
//                       : "Selecionar mês (use qualquer dia do mês)"
//                   }
//                 />
//               </>
//             )}
//           </div>
//         </nav>
//       </div>

//       {/* Toolbar */}
//       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-80">
//           <svg
//             className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <circle cx="11" cy="11" r="7" />
//             <line x1="21" y1="21" x2="16.65" y2="16.65" />
//           </svg>
//           <input
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Buscar por descrição, funcionário ou pagamento"
//             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//             aria-label="Buscar serviços"
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2">
//             <label htmlFor="pageSize" className="text-sm text-gray-600">
//               Itens por página
//             </label>
//             <div className="relative">
//               <select
//                 id="pageSize"
//                 className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//                 value={pageSize}
//                 onChange={(e) => setPageSize(Number(e.target.value))}
//               >
//                 {[10, 20, 50, 100].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
//                 ▾
//               </span>
//             </div>
//           </div>

//           <Link
//             to="/services/add"
//             className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
//           >
//             <PlusIcon className="h-5 w-5" /> Novo Serviço
//           </Link>
//         </div>
//       </div>

//       {/* Tabela */}
//       <div className="overflow-hidden rounded-lg bg-white shadow">
//         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">
//               Serviços — {niceDateLabel}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {mode === "day"
//                 ? "Resumo do dia selecionado"
//                 : mode === "month"
//                 ? "Resumo do mês selecionado"
//                 : "Resumo geral"}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total</p>
//             <p className="text-2xl font-bold text-gray-900">
//               {formatCurrency(filteredTotal)}
//             </p>
//             <p className="text-xs text-gray-500">{totalItems} serviços</p>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="py-10 text-center text-gray-600">Carregando...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Data
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Descrição
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Funcionário
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Valor
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Pagamentos
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Ações
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {currentItems.length > 0 ? (
//                   currentItems.map((s) => (
//                     <tr key={s.id} className="hover:bg-gray-50 align-top">
//                       <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
//                         {formatDate(s.date)}{" "}
//                         <span className="text-gray-500">
//                           {formatTime(
//                             s.createdAt ?? s.updatedAt ?? s.paidAt ?? s.date
//                           )}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                         {s.description}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {s.employee || "—"}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
//                         {formatCurrency(s.value)}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         {getPaymentText(s)}
//                       </td>
//                       <td className="whitespace-nowrap px-6 py-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <Link
//                             to={`/services/view/${s.id}`}
//                             className="p-1 text-gray-700 hover:text-gray-900"
//                             title="Ver detalhes"
//                           >
//                             <EyeIcon className="h-5 w-5" />
//                           </Link>
//                           <Link
//                             to={`/services/edit/${s.id}`}
//                             className="p-1 text-blue-600 hover:text-blue-800"
//                             title="Editar"
//                           >
//                             <PencilIcon className="h-5 w-5" />
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(s.id)}
//                             className="p-1 text-red-600 hover:text-red-800"
//                             title="Excluir"
//                           >
//                             <TrashIcon className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-6 py-10 text-center text-gray-500"
//                     >
//                       Nenhum serviço encontrado
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
//         <div className="text-sm text-gray-700">
//           {totalItems > 0 ? (
//             <span>
//               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong>{" "}
//               de <strong>{totalItems}</strong> serviços
//             </span>
//           ) : (
//             <span>Nenhum registro</span>
//           )}
//         </div>
//         {totalPages > 1 && (
//           <div className="justify-center inline-flex">
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={safePage === 1}
//               className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//             >
//               «
//             </button>
//             <button
//               onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
//               disabled={safePage === 1}
//               className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//             >
//               Anterior
//             </button>
//             <button
//               onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
//               disabled={safePage === totalPages}
//               className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//             >
//               Próxima
//             </button>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={safePage === totalPages}
//               className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//             >
//               »
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { fetchServices, deleteService, fetchSales } from "../services/api"; // ⬅️ usa vendas p/ cruzar
import { formatCurrency, formatDate, formatTime } from "../utils/format";

/* debounce */
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* helpers */
const dateKey = (d = new Date()) => {
  const yr = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${yr}-${m}-${day}`;
};
const norm = (s) =>
  String(s || "")
    .trim()
    .toLowerCase();
const fix2 = (v) => Number(v || 0).toFixed(2);

/* ===== pagamentos de um OBJETO ===== */
const nnum = (v) => Number(String(v).replace(",", ".")) || 0;

function paymentSummaryFromArray(arr) {
  if (!Array.isArray(arr) || !arr.length) return "—";
  return arr
    .map((pm) => {
      const method = pm.method || pm.metodo || pm.type || "-";
      const machine =
        pm.machine || pm.maquina ? ` (${pm.machine || pm.maquina})` : "";
      const inst = pm.installments || pm.parcelas;
      const instTxt = inst && Number(inst) > 1 ? ` ${inst}x` : "";
      const amount = pm.amount ?? pm.valor ?? pm.value;
      return `${method}${machine}${instTxt}: ${formatCurrency(nnum(amount))}`;
    })
    .join(" | ");
}

function paymentSummaryLocal(svc) {
  if (typeof svc?.payment === "string" && svc.payment.trim())
    return svc.payment.trim();
  if (Array.isArray(svc?.paymentMethods))
    return paymentSummaryFromArray(svc.paymentMethods);
  if (Array.isArray(svc?.payments))
    return paymentSummaryFromArray(svc.payments);
  if (Array.isArray(svc?.pagamentos))
    return paymentSummaryFromArray(svc.pagamentos);
  return null; // significa: não há no registro do serviço
}

/* ===== índice p/ buscar pagamentos nas VENDAS ===== */
function buildSalesIndex(sales = []) {
  // chave: desc(produto) + total + dia
  const idx = new Map();
  for (const s of sales) {
    const key = `${norm(s.productName)}|${fix2(s.total)}|${dateKey(
      new Date(s.date)
    )}`;
    const list = idx.get(key) || [];
    list.push(s);
    idx.set(key, list);
  }
  return idx;
}
function paymentSummaryFromSale(sale) {
  if (!sale) return "—";
  if (typeof sale.payment === "string" && sale.payment.trim())
    return sale.payment.trim();
  return paymentSummaryFromArray(
    sale.paymentMethods || sale.payments || sale.pagamentos || []
  );
}

export default function Services() {
  const [rawServices, setRawServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // vendas para cruzamento
  const [salesIndex, setSalesIndex] = useState(new Map());

  // filtros
  const [mode, setMode] = useState("day");
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // URL sync
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSz = Number(searchParams.get("pageSize")) || 10;
  const initialMode = searchParams.get("mode") || "day";
  const initialDate = searchParams.get("date") || dateKey(new Date());
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSz);

  useEffect(() => {
    setMode(initialMode);
    setSelectedDate(initialDate); /* eslint-disable-next-line */
  }, []);

  // carrega serviços + vendas (para cruzar pagamentos)
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [servicesData, salesData] = await Promise.all([
          fetchServices(),
          fetchSales().catch(() => []), // se não houver rota, segue vazio
        ]);
        setRawServices(Array.isArray(servicesData) ? servicesData : []);
        setSalesIndex(
          buildSalesIndex(Array.isArray(salesData) ? salesData : [])
        );
      } catch (e) {
        if (e?.response?.status === 404) {
          setRawServices([]);
        } else {
          console.error("Erro ao carregar:", e);
          toast.error("Erro ao carregar serviços");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // vira o dia -> recarrega (igual vendas)
  useEffect(() => {
    const now = new Date(),
      tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ms = tomorrow.getTime() - now.getTime();
    const id = setTimeout(async () => {
      setSelectedDate(dateKey(new Date()));
      try {
        const data = await fetchServices();
        setRawServices(Array.isArray(data) ? data : []);
      } catch {}
    }, ms);
    return () => clearTimeout(id);
  }, []);

  const sorted = useMemo(() => {
    return [...rawServices].sort((a, b) => {
      const db = new Date(b.created_at).getTime();
      const da = new Date(a.created_at).getTime();
      if (db !== da) return db - da;
      return String(b.id).localeCompare(String(a.id));
    });
  }, [rawServices]);

  // pagamento (com fallback para vendas)
  const getPaymentText = (svc) => {
    const local = paymentSummaryLocal(svc);
    if (local) return local;

    // tenta achar venda equivalente no mesmo dia e valor (e mesma descrição)
    const k = `${norm(svc.description)}|${fix2(svc.value)}|${dateKey(
      new Date(svc.created_at)
    )}`;
    const sale = (salesIndex.get(k) || [])[0];
    return paymentSummaryFromSale(sale) || "—";
  };

  const filteredServices = useMemo(() => {
    let base = sorted;
    if (mode === "day") {
      base = base.filter((s) => dateKey(new Date(s.created_at)) === selectedDate);
    } else if (mode === "month") {
      const d = selectedDate
        ? new Date(`${selectedDate}T00:00:00`)
        : new Date();
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      base = base.filter((s) => {
        const ds = new Date(s.created_at);
        return ds >= monthStart && ds <= monthEnd;
      });
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      base = base.filter((s) => {
        const payText = getPaymentText(s);
        const hay = [s.description, s.employee, payText]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return base;
  }, [sorted, mode, selectedDate, debouncedSearch, salesIndex]);

  const filteredTotal = useMemo(
    () => filteredServices.reduce((acc, s) => acc + Number(s.value || 0), 0),
    [filteredServices]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [mode, selectedDate, debouncedSearch, pageSize]);

  const totalItems = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredServices.slice(startIdx, endIdx);

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
  }, [
    safePage,
    pageSize,
    mode,
    selectedDate,
    searchTerm,
    searchParams,
    setSearchParams,
  ]);

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
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        })
      : "Todos os serviços";

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este serviço?")) return;
    try {
      await deleteService(id);
      setRawServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Serviço excluído com sucesso");
    } catch (e) {
      if (e?.response?.status === 404) {
        setRawServices((prev) => prev.filter((s) => s.id !== id));
        toast.success("Serviço excluído com sucesso");
      } else {
        console.error("Erro ao excluir serviço:", e);
        toast.error("Erro ao excluir serviço");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
        <p className="text-sm text-gray-500">
          {mode === "day"
            ? "Listando os serviços do dia selecionado"
            : mode === "month"
            ? "Serviços do mês selecionado"
            : "Todos os serviços"}
        </p>
      </div>

      {/* Abas / data */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap items-center gap-4">
          {[
            { key: "day", label: "Dia" },
            { key: "month", label: "Mês" },
            { key: "all", label: "Todos" },
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
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
                  aria-label={
                    mode === "day"
                      ? "Selecionar dia"
                      : "Selecionar mês (use qualquer dia do mês)"
                  }
                />
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Toolbar */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição, funcionário ou pagamento"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            aria-label="Buscar serviços"
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
            to="/services/add"
            className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <PlusIcon className="h-5 w-5" /> Novo Serviço
          </Link>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Serviços — {niceDateLabel}
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
            <p className="text-xs text-gray-500">{totalItems} serviços</p>
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
                    Funcionário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pagamentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 align-top">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(s.created_at)}{" "}
                        <span className="text-gray-500">
                          {formatTime(
                            s.created_at ?? s.updated_at ?? s.paid_at
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {s.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {s.employee || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatCurrency(s.value)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getPaymentText(s)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/services/view/${s.id}`}
                            className="p-1 text-gray-700 hover:text-gray-900"
                            title="Ver detalhes"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/services/edit/${s.id}`}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id)}
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
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Nenhum serviço encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-gray-700">
          {totalItems > 0 ? (
            <span>
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong>{" "}
              de <strong>{totalItems}</strong> serviços
            </span>
          ) : (
            <span>Nenhum registro</span>
          )}
        </div>
        {totalPages > 1 && (
          <div className="justify-center inline-flex">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Próxima
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// // import { useEffect, useMemo, useState } from "react";
// // import { Link, useSearchParams } from "react-router-dom";
// // import { PlusIcon } from "@heroicons/react/24/outline";
// // import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
// // import { fetchProducts } from "../services/api";

// // // --- Debounce ---
// // function useDebounce(value, delay = 350) {
// //   const [debounced, setDebounced] = useState(value);
// //   useEffect(() => {
// //     const id = setTimeout(() => setDebounced(value), delay);
// //     return () => clearTimeout(id);
// //   }, [value, delay]);
// //   return debounced;
// // }

// // // --- Ícone de busca ---
// // const SearchIcon = (props) => (
// //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// //     <circle cx="11" cy="11" r="7"></circle>
// //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //   </svg>
// // );

// // // --- Badge de status (estoque) ---
// // const StockBadge = ({ kind, threshold }) => {
// //   const map = {
// //     out: { label: "Esgotado", cls: "bg-red-100 text-red-700 border-red-200" },
// //     low: { label: `Estoque Baixo`, cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
// //     in: { label: "Em Estoque", cls: "bg-green-100 text-green-700 border-green-200" },
// //   };
// //   const v = map[kind] || map.in;
// //   return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${v.cls}`}>{v.label}</span>;
// // };

// // // --- Paginação ---
// // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// //   const pages = useMemo(() => {
// //     if (totalPages <= 1) return [1];
// //     const out = [];
// //     const add = (p) => out.push(p);
// //     const start = Math.max(2, currentPage - windowSize);
// //     const end = Math.min(totalPages - 1, currentPage + windowSize);
// //     add(1);
// //     if (start > 2) add("…");
// //     for (let p = start; p <= end; p++) add(p);
// //     if (end < totalPages - 1) add("…");
// //     if (totalPages > 1) add(totalPages);
// //     return out;
// //   }, [currentPage, totalPages, windowSize]);

// //   return (
// //     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
// //       <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Primeira página">«</button>
// //       <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Página anterior">Anterior</button>
// //       {pages.map((p, i) => (
// //         <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
// //       ))}
// //       <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Próxima página">Próxima</button>
// //       <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Última página">»</button>
// //     </nav>
// //   );
// // }

// // const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

// // const Inventory = () => {
// //   const [products, setProducts] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // Abas por status do estoque: all | low | out
// //   const [stockTab, setStockTab] = useState("all");

// //   // Busca
// //   const [query, setQuery] = useState("");
// //   const debouncedQuery = useDebounce(query, 350);

// //   // URL sync (igual ao Quotes: page, pageSize, q, status)
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const initialPage = Number(searchParams.get("page")) || 1;
// //   const initialPageSize = Number(searchParams.get("pageSize")) || 10;
// //   const initialQ = searchParams.get("q") || "";
// //   const initialStatus = searchParams.get("status") || "all";

// //   const [currentPage, setCurrentPage] = useState(initialPage);
// //   const [pageSize, setPageSize] = useState(initialPageSize);

// //   useEffect(() => {
// //     if (initialQ) setQuery(initialQ);
// //     if (["all", "low", "out"].includes(initialStatus)) setStockTab(initialStatus);
// //     load();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const load = async () => {
// //     try {
// //       setIsLoading(true);
// //       const data = await fetchProducts();
// //       setProducts(data || []);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // --- Filtragem e busca (igual ao padrão do Quotes) ---
// //   const filtered = useMemo(() => {
// //     let base = products;
// //     if (stockTab === "out") base = base.filter((p) => p.stock === 0);
// //     else if (stockTab === "low") base = base.filter((p) => p.stock > 0 && p.stock <= getThreshold(p));

// //     const term = debouncedQuery.trim().toLowerCase();
// //     if (!term) return base;
// //     return base.filter((p) =>
// //       String(p.name || "").toLowerCase().includes(term) ||
// //       String(p.brand || "").toLowerCase().includes(term) ||
// //       String(p.compatibleModel || "").toLowerCase().includes(term)
// //     );
// //   }, [products, stockTab, debouncedQuery]);

// //   // Totais (geral e filtrado)
// //   const totalItems = filtered.length;
// //   const totalAll = products.length;
// //   const totalLow = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= getThreshold(p)).length, [products]);
// //   const totalOut = useMemo(() => products.filter((p) => p.stock === 0).length, [products]);

// //   // Paginação (igual ao Quotes)
// //   useEffect(() => { setCurrentPage(1); }, [debouncedQuery, pageSize, stockTab]);
// //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// //   const safePage = Math.min(Math.max(1, currentPage), totalPages);
// //   const startIdx = (safePage - 1) * pageSize;
// //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// //   const currentItems = filtered.slice(startIdx, endIdx);

// //   // URL sync (?page, pageSize, q, status)
// //   useEffect(() => {
// //     const params = new URLSearchParams(searchParams);
// //     params.set("page", String(safePage));
// //     params.set("pageSize", String(pageSize));
// //     if (query) params.set("q", query); else params.delete("q");
// //     if (stockTab && stockTab !== "all") params.set("status", stockTab); else params.delete("status");
// //     setSearchParams(params, { replace: true });
// //   }, [safePage, pageSize, query, stockTab, searchParams, setSearchParams]);

// //   return (
// //     <div className="p-6">
// //       {/* Header padronizado */}
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-900">Controle de Estoque</h1>
// //         <p className="text-sm text-gray-500">Acompanhe níveis, itens baixos e esgotados</p>
// //       </div>

// //       {/* Abas por status (igual Quotes) */}
// //       <div className="border-b border-gray-200">
// //         <nav className="-mb-px flex space-x-6">
// //           {[
// //             { key: "all", label: `Todos (${totalAll})` },
// //             { key: "low", label: `Baixos (${totalLow})` },
// //             { key: "out", label: `Esgotados (${totalOut})` },
// //           ].map((tab) => (
// //             <button
// //               key={tab.key}
// //               onClick={() => setStockTab(tab.key)}
// //               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
// //                 stockTab === tab.key
// //                   ? "border-gray-900 text-gray-900"
// //                   : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
// //               }`}
// //             >
// //               {tab.label}
// //             </button>
// //           ))}
// //         </nav>
// //       </div>

// //       {/* Toolbar (busca, page size, novo produto) */}
// //       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div className="relative w-full sm:w-80">
// //           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// //           <input
// //             type="text"
// //             placeholder="Buscar por produto, marca ou modelo"
// //             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             aria-label="Buscar itens do estoque"
// //           />
// //         </div>

// //         <div className="flex items-center gap-3">
// //           <div className="flex items-center gap-2">
// //             <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
// //             <div className="relative">
// //               <select
// //                 id="pageSize"
// //                 className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// //                 value={pageSize}
// //                 onChange={(e) => setPageSize(Number(e.target.value))}
// //               >
// //                 {[10, 20, 50, 100].map((n) => (
// //                   <option key={n} value={n}>{n}</option>
// //                 ))}
// //               </select>
// //               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
// //             </div>
// //           </div>

// //           <Link
// //             to="/products/add"
// //             className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
// //           >
// //             <PlusIcon className="h-5 w-5" /> Novo Produto
// //           </Link>
// //         </div>
// //       </div>

// //       {/* Card + tabela (igual Quotes) */}
// //       <div className="overflow-hidden rounded-lg bg-white shadow">
// //         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// //           <div>
// //             <h3 className="text-lg font-semibold text-gray-800">Itens de Estoque</h3>
// //             <p className="text-sm text-gray-500">Resumo por status e busca aplicada</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-sm text-gray-600">Total em Estoque</p>
// //             <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
// //             <p className="text-xs text-gray-500">{totalAll} itens no total</p>
// //           </div>
// //         </div>

// //         {isLoading ? (
// //           <div className="py-10 text-center text-gray-600">Carregando...</div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 bg-white">
// //                 {currentItems.length > 0 ? (
// //                   currentItems.map((p) => {
// //                     const threshold = getThreshold(p);
// //                     const kind = p.stock === 0 ? "out" : p.stock <= threshold ? "low" : "in";
// //                     return (
// //                       <tr key={p.id} className="hover:bg-gray-50">
// //                         <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">{p.brand}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">{p.compatibleModel}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">
// //                           {kind !== "in" ? (
// //                             <div className="flex items-center">
// //                               <ExclamationCircleIcon className={`mr-1 h-5 w-5 ${kind === "out" ? "text-red-500" : "text-yellow-500"}`} />
// //                               <span className="font-medium">{p.stock}</span>
// //                             </div>
// //                           ) : (
// //                             p.stock
// //                           )}
// //                         </td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">{threshold}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900"><StockBadge kind={kind} threshold={threshold} /></td>
// //                       </tr>
// //                     );
// //                   })
// //                 ) : (
// //                   <tr>
// //                     <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* Footer de paginação (igual Quotes) */}
// //       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
// //         <div className="text-sm text-gray-700">
// //           {totalItems > 0 ? (
// //             <span>
// //               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> itens
// //             </span>
// //           ) : (
// //             <span>Nenhum registro</span>
// //           )}
// //         </div>
// //         {totalPages > 1 && (
// //           <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Inventory;



// import { useEffect, useMemo, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
// import { fetchProducts } from "../services/api";

// // --- Debounce ---
// function useDebounce(value, delay = 350) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return debounced;
// }

// // --- Ícone de busca ---
// const SearchIcon = (props) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
//     <circle cx="11" cy="11" r="7"></circle>
//     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//   </svg>
// );

// // --- Badge de status (estoque) ---
// const StockBadge = ({ kind, threshold }) => {
//   const map = {
//     out: { label: "Esgotado", cls: "bg-red-100 text-red-700 border-red-200" },
//     low: { label: `Estoque Baixo`, cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
//     in: { label: "Em Estoque", cls: "bg-green-100 text-green-700 border-green-200" },
//   };
//   const v = map[kind] || map.in;
//   return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${v.cls}`}>{v.label}</span>;
// };

// // --- Paginação ---
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

// const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

// const Inventory = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Abas por status do estoque: all | low | out
//   const [stockTab, setStockTab] = useState("all");

//   // Busca
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 350);

//   // URL sync (igual ao Quotes: page, pageSize, q, status)
//   const [searchParams, setSearchParams] = useSearchParams();
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialPageSize = Number(searchParams.get("pageSize")) || 10;
//   const initialQ = searchParams.get("q") || "";
//   const initialStatus = searchParams.get("status") || "all";

//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [pageSize, setPageSize] = useState(initialPageSize);

//   useEffect(() => {
//     if (initialQ) setQuery(initialQ);
//     if (["all", "low", "out"].includes(initialStatus)) setStockTab(initialStatus);
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const load = async () => {
//     try {
//       setIsLoading(true);
//       const data = await fetchProducts();
//       setProducts(data || []);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Filtragem + ORDENAR (DESC) antes da paginação ---
//   const filtered = useMemo(() => {
//     let base = products;

//     if (stockTab === "out") base = base.filter((p) => p.stock === 0);
//     else if (stockTab === "low") base = base.filter((p) => p.stock > 0 && p.stock <= getThreshold(p));

//     const term = debouncedQuery.trim().toLowerCase();
//     const searched = term
//       ? base.filter((p) =>
//           String(p.name || "").toLowerCase().includes(term) ||
//           String(p.brand || "").toLowerCase().includes(term) ||
//           String(p.compatibleModel || "").toLowerCase().includes(term)
//         )
//       : base;

//     // >>> ORDEM DECRESCENTE: updatedAt/createdAt ↓, depois id ↓, depois name Z→A
//     const getTime = (obj) => {
//       const ts =
//         obj?.updatedAt ??
//         obj?.createdAt ??
//         obj?.updated_at ??
//         obj?.created_at ??
//         null;
//       if (!ts) return NaN;
//       const t = new Date(ts).getTime();
//       return Number.isFinite(t) ? t : NaN;
//     };

//     return [...searched].sort((a, b) => {
//       const tb = getTime(b);
//       const ta = getTime(a);
//       if (!Number.isNaN(tb) || !Number.isNaN(ta)) {
//         if (tb !== ta) {
//           if (Number.isNaN(ta)) return -1; // b tem data, a não → b primeiro
//           if (Number.isNaN(tb)) return 1;  // a tem data, b não → a primeiro
//           return tb - ta;                  // ambos têm → desc (mais recente primeiro)
//         }
//       }
//       const idDiff = Number(b.id || 0) - Number(a.id || 0);
//       if (idDiff !== 0) return idDiff;

//       return String(b.name || "").localeCompare(String(a.name || ""), "pt-BR", { sensitivity: "base" });
//     });
//   }, [products, stockTab, debouncedQuery]);

//   // Totais (geral e filtrado)
//   const totalItems = filtered.length;
//   const totalAll = products.length;
//   const totalLow = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= getThreshold(p)).length, [products]);
//   const totalOut = useMemo(() => products.filter((p) => p.stock === 0).length, [products]);

//   // Paginação (igual ao Quotes)
//   useEffect(() => { setCurrentPage(1); }, [debouncedQuery, pageSize, stockTab]);
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage = Math.min(Math.max(1, currentPage), totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const endIdx = Math.min(startIdx + pageSize, totalItems);
//   const currentItems = filtered.slice(startIdx, endIdx);

//   // URL sync (?page, pageSize, q, status)
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", String(safePage));
//     params.set("pageSize", String(pageSize));
//     if (query) params.set("q", query); else params.delete("q");
//     if (stockTab && stockTab !== "all") params.set("status", stockTab); else params.delete("status");
//     setSearchParams(params, { replace: true });
//   }, [safePage, pageSize, query, stockTab, searchParams, setSearchParams]);

//   return (
//     <div className="p-6">
//       {/* Header padronizado */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Controle de Estoque</h1>
//         <p className="text-sm text-gray-500">Acompanhe níveis, itens baixos e esgotados</p>
//       </div>

//       {/* Abas por status (igual Quotes) */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-6">
//           {[
//             { key: "all", label: `Todos (${totalAll})` },
//             { key: "low", label: `Baixos (${totalLow})` },
//             { key: "out", label: `Esgotados (${totalOut})` },
//           ].map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setStockTab(tab.key)}
//               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
//                 stockTab === tab.key
//                   ? "border-gray-900 text-gray-900"
//                   : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Toolbar (busca, page size, novo produto) */}
//       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-80">
//           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Buscar por produto, marca ou modelo"
//             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             aria-label="Buscar itens do estoque"
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
//                 {[10, 20, 50, 100].map((n) => (
//                   <option key={n} value={n}>{n}</option>
//                 ))}
//               </select>
//               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
//             </div>
//           </div>

//           <Link
//             to="/products/add"
//             className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
//           >
//             <PlusIcon className="h-5 w-5" /> Novo Produto
//           </Link>
//         </div>
//       </div>

//       {/* Card + tabela (igual Quotes) */}
//       <div className="overflow-hidden rounded-lg bg-white shadow">
//         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Itens de Estoque</h3>
//             <p className="text-sm text-gray-500">Resumo por status e busca aplicada</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total em Estoque</p>
//             <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
//             <p className="text-xs text-gray-500">{totalAll} itens no total</p>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="py-10 text-center text-gray-600">Carregando...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {currentItems.length > 0 ? (
//                   currentItems.map((p) => {
//                     const threshold = getThreshold(p);
//                     const kind = p.stock === 0 ? "out" : p.stock <= threshold ? "low" : "in";
//                     return (
//                       <tr key={p.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{p.brand}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{p.compatibleModel}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {kind !== "in" ? (
//                             <div className="flex items-center">
//                               <ExclamationCircleIcon className={`mr-1 h-5 w-5 ${kind === "out" ? "text-red-500" : "text-yellow-500"}`} />
//                               <span className="font-medium">{p.stock}</span>
//                             </div>
//                           ) : (
//                             p.stock
//                           )}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{threshold}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900"><StockBadge kind={kind} threshold={threshold} /></td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Footer de paginação (igual Quotes) */}
//       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
//         <div className="text-sm text-gray-700">
//           {totalItems > 0 ? (
//             <span>
//               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> itens
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

// export default Inventory;



import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { fetchProducts } from "../services/api";

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

// --- Badge de status (estoque) ---
const StockBadge = ({ kind, threshold }) => {
  const map = {
    out: { label: "Esgotado", cls: "bg-red-100 text-red-700 border-red-200" },
    low: { label: `Estoque Baixo`, cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    in: { label: "Em Estoque", cls: "bg-green-100 text-green-700 border-green-200" },
  };
  const v = map[kind] || map.in;
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${v.cls}`}>{v.label}</span>;
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

const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Abas por status do estoque: all | low | out
  const [stockTab, setStockTab] = useState("all");

  // Busca
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  // URL sync (igual ao Quotes: page, pageSize, q, status)
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;
  const initialQ = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "all";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    if (initialQ) setQuery(initialQ);
    if (["all", "low", "out"].includes(initialStatus)) setStockTab(initialStatus);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Filtragem + ORDENAR (DESC) antes da paginação ---
  const filtered = useMemo(() => {
    let base = products;

    if (stockTab === "out") base = base.filter((p) => p.stock === 0);
    else if (stockTab === "low") base = base.filter((p) => p.stock > 0 && p.stock <= getThreshold(p));

    const term = debouncedQuery.trim().toLowerCase();
    const searched = term
      ? base.filter((p) =>
          String(p.name || "").toLowerCase().includes(term) ||
          String(p.brand || "").toLowerCase().includes(term) ||
          String(p.compatibleModel || "").toLowerCase().includes(term)
        )
      : base;

    // >>> ORDEM DECRESCENTE POR CRIAÇÃO (último criado primeiro)
    // Regras:
    // 1) Usa createdAt/created_at quando existir (desc).
    // 2) Se não existir, tenta extrair timestamp do ObjectId (24 hex) do Mongo.
    // 3) Fallback final: índice original invertido (último carregado primeiro).
    const indexMap = new Map();
    products.forEach((p, i) => indexMap.set(p.id, i));

    const getCreatedTime = (obj) => {
      const raw = obj?.createdAt ?? obj?.created_at ?? null;
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
      const tb = getCreatedTime(b);
      const ta = getCreatedTime(a);
      if (tb !== ta) return tb - ta; // mais novo primeiro
      const ib = indexMap.get(b.id) ?? -1;
      const ia = indexMap.get(a.id) ?? -1;
      return ib - ia; // último carregado primeiro
    });
  }, [products, stockTab, debouncedQuery]);

  // Totais (geral e filtrado)
  const totalItems = filtered.length;
  const totalAll = products.length;
  const totalLow = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= getThreshold(p)).length, [products]);
  const totalOut = useMemo(() => products.filter((p) => p.stock === 0).length, [products]);

  // Paginação (igual ao Quotes)
  useEffect(() => { setCurrentPage(1); }, [debouncedQuery, pageSize, stockTab]);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filtered.slice(startIdx, endIdx);

  // URL sync (?page, pageSize, q, status)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    if (query) params.set("q", query); else params.delete("q");
    if (stockTab && stockTab !== "all") params.set("status", stockTab); else params.delete("status");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, query, stockTab, searchParams, setSearchParams]);

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Controle de Estoque</h1>
        <p className="text-sm text-gray-500">Acompanhe níveis, itens baixos e esgotados</p>
      </div>

      {/* Abas por status (igual Quotes) */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {[
            { key: "all", label: `Todos (${totalAll})` },
            { key: "low", label: `Baixos (${totalLow})` },
            { key: "out", label: `Esgotados (${totalOut})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStockTab(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                stockTab === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Toolbar (busca, page size, novo produto) */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por produto, marca ou modelo"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar itens do estoque"
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
            to="/products/add"
            className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <PlusIcon className="h-5 w-5" /> Novo Produto
          </Link>
        </div>
      </div>

      {/* Card + tabela (igual Quotes) */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Itens de Estoque</h3>
            <p className="text-sm text-gray-500">Resumo por status e busca aplicada</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total em Estoque</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-xs text-gray-500">{totalAll} itens no total</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((p) => {
                    const threshold = getThreshold(p);
                    const kind = p.stock === 0 ? "out" : p.stock <= threshold ? "low" : "in";
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{p.brand}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{p.compatibleModel}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {kind !== "in" ? (
                            <div className="flex items-center">
                              <ExclamationCircleIcon className={`mr-1 h-5 w-5 ${kind === "out" ? "text-red-500" : "text-yellow-500"}`} />
                              <span className="font-medium">{p.stock}</span>
                            </div>
                          ) : (
                            p.stock
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{threshold}</td>
                        <td className="px-6 py-4 text-sm text-gray-900"><StockBadge kind={kind} threshold={threshold} /></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer de paginação (igual Quotes) */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-gray-700">
          {totalItems > 0 ? (
            <span>
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> itens
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

export default Inventory;

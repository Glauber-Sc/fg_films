// // // // import { useState, useEffect, useMemo } from "react";
// // // // import { Link, useSearchParams } from "react-router-dom";
// // // // import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// // // // import { toast } from "react-toastify";
// // // // import { formatCurrency } from "../utils/format";
// // // // import { fetchProducts, deleteProduct } from "../services/api";

// // // // /** Hook de debounce simples para entradas (busca etc.) */
// // // // function useDebounce(value, delay = 400) {
// // // //   const [debounced, setDebounced] = useState(value);
// // // //   useEffect(() => {
// // // //     const id = setTimeout(() => setDebounced(value), delay);
// // // //     return () => clearTimeout(id);
// // // //   }, [value, delay]);
// // // //   return debounced;
// // // // }

// // // // /** Ícone de busca (inline, sem dependências extras) */
// // // // const SearchIcon = (props) => (
// // // //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// // // //     <circle cx="11" cy="11" r="7"></circle>
// // // //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// // // //   </svg>
// // // // );

// // // // /** Paginação no estilo padronizado (ativo preto, acessível) */
// // // // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// // // //   const pages = useMemo(() => {
// // // //     if (totalPages <= 1) return [1];
// // // //     const pagesArr = [];
// // // //     const add = (p) => pagesArr.push(p);
// // // //     const start = Math.max(2, currentPage - windowSize);
// // // //     const end = Math.min(totalPages - 1, currentPage + windowSize);
// // // //     add(1);
// // // //     if (start > 2) add("…");
// // // //     for (let p = start; p <= end; p++) add(p);
// // // //     if (end < totalPages - 1) add("…");
// // // //     if (totalPages > 1) add(totalPages);
// // // //     return pagesArr;
// // // //   }, [currentPage, totalPages, windowSize]);

// // // //   return (
// // // //     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
// // // //       <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Primeira página">«</button>
// // // //       <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Página anterior">Anterior</button>
// // // //       {pages.map((p, i) => (
// // // //         <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
// // // //       ))}
// // // //       <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Próxima página">Próxima</button>
// // // //       <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Última página">»</button>
// // // //     </nav>
// // // //   );
// // // // }

// // // // const Products = () => {
// // // //   const [products, setProducts] = useState([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const debouncedSearch = useDebounce(searchTerm, 350);

// // // //   const [searchParams, setSearchParams] = useSearchParams();

// // // //   // Tabs para filtrar (Todos | Baixo estoque)
// // // //   const [activeTab, setActiveTab] = useState("todos");

// // // //   // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
// // // //   const initialPage = Number(searchParams.get("page")) || 1;
// // // //   const initialPageSize = Number(searchParams.get("pageSize")) || 10;

// // // //   const [currentPage, setCurrentPage] = useState(initialPage);
// // // //   const [pageSize, setPageSize] = useState(initialPageSize);

// // // //   useEffect(() => {
// // // //     loadProducts();
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, []);

// // // //   const loadProducts = async () => {
// // // //     try {
// // // //       setIsLoading(true);
// // // //       const data = await fetchProducts();
// // // //       setProducts(data);
// // // //     } catch (error) {
// // // //       console.error("Error loading products:", error);
// // // //       toast.error("Erro ao carregar produtos");
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   const handleDelete = async (id) => {
// // // //     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
// // // //       try {
// // // //         await deleteProduct(id);
// // // //         setProducts((prev) => prev.filter((product) => product.id !== id));
// // // //         toast.success("Produto excluído com sucesso");
// // // //       } catch (error) {
// // // //         console.error("Error deleting product:", error);
// // // //         toast.error("Erro ao excluir produto");
// // // //       }
// // // //     }
// // // //   };

// // // //   const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

// // // //   // Filtro de busca (case-insensitive) + aba "baixo estoque"
// // // //   const filteredProducts = useMemo(() => {
// // // //     const term = debouncedSearch.trim().toLowerCase();
// // // //     let base = products;

// // // //     if (activeTab === "low") {
// // // //       base = base.filter((p) => Number(p.stock) <= getThreshold(p));
// // // //     }

// // // //     if (!term) return base;
// // // //     return base.filter((product) => {
// // // //       const fields = [product.name, product.brand, product.compatibleModel, product.code];
// // // //       return fields.filter(Boolean).some((f) => String(f).toLowerCase().includes(term));
// // // //     });
// // // //   }, [products, debouncedSearch, activeTab]);

// // // //   // Reset de página quando a busca/aba/pageSize mudam
// // // //   useEffect(() => {
// // // //     setCurrentPage(1);
// // // //   }, [debouncedSearch, pageSize, activeTab]);

// // // //   // Sincroniza URL (permite compartilhar/voltar)
// // // //   useEffect(() => {
// // // //     const params = new URLSearchParams(searchParams);
// // // //     params.set("page", String(currentPage));
// // // //     params.set("pageSize", String(pageSize));
// // // //     if (searchTerm) params.set("q", searchTerm);
// // // //     else params.delete("q");
// // // //     setSearchParams(params, { replace: true });
// // // //   }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams]);

// // // //   // Dados paginados
// // // //   const totalItems = filteredProducts.length;
// // // //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// // // //   const safePage = Math.min(Math.max(1, currentPage), totalPages);
// // // //   const startIdx = (safePage - 1) * pageSize;
// // // //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// // // //   const currentItems = filteredProducts.slice(startIdx, endIdx);

// // // //   return (
// // // //     <div className="p-6">
// // // //       {/* Header padronizado */}
// // // //       <div className="mb-6">
// // // //         <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
// // // //         <p className="text-sm text-gray-500">Gerencie o catálogo e monitore o nível de estoque</p>
// // // //       </div>

// // // //       {/* Abas */}
// // // //       <div className="border-b border-gray-200">
// // // //         <nav className="-mb-px flex space-x-6">
// // // //           {[
// // // //             { key: "todos", label: "Todos" },
// // // //             { key: "low", label: "Baixo estoque" },
// // // //           ].map((tab) => (
// // // //             <button
// // // //               key={tab.key}
// // // //               onClick={() => setActiveTab(tab.key)}
// // // //               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
// // // //                 activeTab === tab.key
// // // //                   ? "border-gray-900 text-gray-900"
// // // //                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
// // // //               }`}
// // // //             >
// // // //               {tab.label}
// // // //             </button>
// // // //           ))}
// // // //         </nav>
// // // //       </div>

// // // //       {/* Toolbar */}
// // // //       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // // //         <div className="relative w-full sm:w-80">
// // // //           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Buscar produtos..."
// // // //             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// // // //             value={searchTerm}
// // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // //             aria-label="Campo de busca de produtos"
// // // //           />
// // // //         </div>

// // // //         <div className="flex items-center gap-3">
// // // //           <div className="flex items-center gap-2">
// // // //             <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
// // // //             <div className="relative">
// // // //               <select
// // // //                 id="pageSize"
// // // //                 className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// // // //                 value={pageSize}
// // // //                 onChange={(e) => setPageSize(Number(e.target.value))}
// // // //               >
// // // //                 {[10, 20, 50, 100].map((n) => (
// // // //                   <option key={n} value={n}>{n}</option>
// // // //                 ))}
// // // //               </select>
// // // //               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
// // // //             </div>
// // // //           </div>

// // // //           <Link
// // // //             to="/products/add"
// // // //             className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
// // // //           >
// // // //             <PlusIcon className="h-5 w-5" /> Novo Produto
// // // //           </Link>
// // // //         </div>
// // // //       </div>

// // // //       {/* Card + tabela padronizados */}
// // // //       <div className="overflow-hidden rounded-lg bg-white shadow">
// // // //         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// // // //           <div>
// // // //             <h3 className="text-lg font-semibold text-gray-800">Catálogo</h3>
// // // //             <p className="text-sm text-gray-500">Resumo dos produtos {activeTab === "low" ? "com baixo estoque" : "cadastrados"}</p>
// // // //           </div>
// // // //           <div className="text-right">
// // // //             <p className="text-sm text-gray-600">Total de itens</p>
// // // //             <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
// // // //           </div>
// // // //         </div>

// // // //         {isLoading ? (
// // // //           <div className="py-10 text-center text-gray-600">Carregando...</div>
// // // //         ) : (
// // // //           <div className="overflow-x-auto">
// // // //             <table className="min-w-full divide-y divide-gray-200">
// // // //               <thead className="bg-gray-50">
// // // //                 <tr>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
// // // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="divide-y divide-gray-200 bg-white">
// // // //                 {currentItems.length > 0 ? (
// // // //                   currentItems.map((product) => (
// // // //                     <tr key={product.id} className="hover:bg-gray-50">
// // // //                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
// // // //                       <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
// // // //                       <td className="px-6 py-4 text-sm text-gray-900">{product.compatibleModel}</td>
// // // //                       <td className="px-6 py-4 text-sm text-gray-900">
// // // //                         <span className={`${Number(product.stock) <= getThreshold(product) ? "text-red-600 font-semibold" : ""}`}>
// // // //                           {product.stock}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td className="px-6 py-4 text-sm text-gray-900">{getThreshold(product)}</td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
// // // //                       <td className="px-6 py-4 text-sm text-gray-900">{product.code || "-"}</td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm">
// // // //                         <div className="flex items-center gap-2">
// // // //                           <Link to={`/products/edit/${product.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
// // // //                             <PencilIcon className="h-5 w-5" />
// // // //                           </Link>
// // // //                           <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
// // // //                             <TrashIcon className="h-5 w-5" />
// // // //                           </button>
// // // //                         </div>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))
// // // //                 ) : (
// // // //                   <tr>
// // // //                     <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
// // // //                   </tr>
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Footer de paginação */}
// // // //       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
// // // //         <div className="text-sm text-gray-700">
// // // //           {totalItems > 0 ? (
// // // //             <span>
// // // //               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> produtos
// // // //             </span>
// // // //           ) : (
// // // //             <span>Nenhum registro</span>
// // // //           )}
// // // //         </div>

// // // //         {totalPages > 1 && (
// // // //           <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Products;


// // // import { useState, useEffect, useMemo } from "react";
// // // import { Link, useSearchParams } from "react-router-dom";
// // // import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// // // import { toast } from "react-toastify";
// // // import { formatCurrency } from "../utils/format";
// // // import { fetchProducts, deleteProduct } from "../services/api";

// // // /** Hook de debounce simples para entradas (busca etc.) */
// // // function useDebounce(value, delay = 400) {
// // //   const [debounced, setDebounced] = useState(value);
// // //   useEffect(() => {
// // //     const id = setTimeout(() => setDebounced(value), delay);
// // //     return () => clearTimeout(id);
// // //   }, [value, delay]);
// // //   return debounced;
// // // }

// // // /** Ícone de busca (inline, sem dependências extras) */
// // // const SearchIcon = (props) => (
// // //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// // //     <circle cx="11" cy="11" r="7"></circle>
// // //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// // //   </svg>
// // // );

// // // /** Paginação no estilo padronizado (ativo preto, acessível) */
// // // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// // //   const pages = useMemo(() => {
// // //     if (totalPages <= 1) return [1];
// // //     const pagesArr = [];
// // //     const add = (p) => pagesArr.push(p);
// // //     const start = Math.max(2, currentPage - windowSize);
// // //     const end = Math.min(totalPages - 1, currentPage + windowSize);
// // //     add(1);
// // //     if (start > 2) add("…");
// // //     for (let p = start; p <= end; p++) add(p);
// // //     if (end < totalPages - 1) add("…");
// // //     if (totalPages > 1) add(totalPages);
// // //     return pagesArr;
// // //   }, [currentPage, totalPages, windowSize]);

// // //   return (
// // //     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
// // //       <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Primeira página">«</button>
// // //       <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Página anterior">Anterior</button>
// // //       {pages.map((p, i) => (
// // //         <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
// // //       ))}
// // //       <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Próxima página">Próxima</button>
// // //       <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50" aria-label="Última página">»</button>
// // //     </nav>
// // //   );
// // // }

// // // const Products = () => {
// // //   const [products, setProducts] = useState([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const debouncedSearch = useDebounce(searchTerm, 350);

// // //   const [searchParams, setSearchParams] = useSearchParams();

// // //   // Tabs para filtrar (Todos | Baixo estoque)
// // //   const [activeTab, setActiveTab] = useState("todos");

// // //   // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
// // //   const initialPage = Number(searchParams.get("page")) || 1;
// // //   const initialPageSize = Number(searchParams.get("pageSize")) || 10;

// // //   const [currentPage, setCurrentPage] = useState(initialPage);
// // //   const [pageSize, setPageSize] = useState(initialPageSize);

// // //   useEffect(() => {
// // //     loadProducts();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   const loadProducts = async () => {
// // //     try {
// // //       setIsLoading(true);
// // //       const data = await fetchProducts();
// // //       setProducts(data);
// // //     } catch (error) {
// // //       console.error("Error loading products:", error);
// // //       toast.error("Erro ao carregar produtos");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
// // //       try {
// // //         await deleteProduct(id);
// // //         setProducts((prev) => prev.filter((product) => product.id !== id));
// // //         toast.success("Produto excluído com sucesso");
// // //       } catch (error) {
// // //         console.error("Error deleting product:", error);
// // //         toast.error("Erro ao excluir produto");
// // //       }
// // //     }
// // //   };

// // //   const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

// // //   // ---------- ORDENAR SEMPRE POR MAIS NOVO PRIMEIRO (ANTES DA PAGINAÇÃO) ----------
// // //   // Regras:
// // //   // 1) Usa createdAt/created_at se existir (desc).
// // //   // 2) Se não existir, usa timestamp de ObjectId (24 hex) se o id parecer um ObjectId do Mongo.
// // //   // 3) Fallback final: ordem original do array (índice) invertida, garantindo "último carregado primeiro".
// // //   const filteredProducts = useMemo(() => {
// // //     const term = debouncedSearch.trim().toLowerCase();

// // //     // base inicial (aplica aba "baixo estoque" se selecionada)
// // //     let base = products;
// // //     if (activeTab === "low") {
// // //       base = base.filter((p) => Number(p.stock) <= getThreshold(p));
// // //     }

// // //     // aplica busca
// // //     const searched = !term
// // //       ? base
// // //       : base.filter((product) => {
// // //           const fields = [product.name, product.brand, product.compatibleModel, product.code];
// // //           return fields.filter(Boolean).some((f) => String(f).toLowerCase().includes(term));
// // //         });

// // //     // mapa do índice original para fallback estável
// // //     const indexMap = new Map();
// // //     products.forEach((p, i) => indexMap.set(p.id, i));

// // //     const getCreatedTime = (obj) => {
// // //       const raw = obj?.createdAt ?? obj?.created_at ?? null;
// // //       if (raw) {
// // //         const t = new Date(raw).getTime();
// // //         if (Number.isFinite(t)) return t;
// // //       }
// // //       // tenta extrair do ObjectId (MongoDB): primeiros 8 chars = timestamp em segundos
// // //       if (typeof obj?.id === "string" && /^[a-f0-9]{24}$/i.test(obj.id)) {
// // //         const ms = parseInt(obj.id.slice(0, 8), 16) * 1000;
// // //         if (Number.isFinite(ms)) return ms;
// // //       }
// // //       return Number.NEGATIVE_INFINITY; // "sem data"
// // //     };

// // //     // ORDENAR: mais novo primeiro; fallback pelo índice original (último do array primeiro)
// // //     return [...searched].sort((a, b) => {
// // //       const tb = getCreatedTime(b);
// // //       const ta = getCreatedTime(a);
// // //       if (tb !== ta) return tb - ta;
// // //       const ib = indexMap.get(b.id) ?? -1;
// // //       const ia = indexMap.get(a.id) ?? -1;
// // //       return ib - ia; // último carregado primeiro
// // //     });
// // //   }, [products, debouncedSearch, activeTab]);
// // //   // -------------------------------------------------------------------------------

// // //   // Reset de página quando a busca/aba/pageSize mudam
// // //   useEffect(() => {
// // //     setCurrentPage(1);
// // //   }, [debouncedSearch, pageSize, activeTab]);

// // //   // Sincroniza URL (permite compartilhar/voltar)
// // //   useEffect(() => {
// // //     const params = new URLSearchParams(searchParams);
// // //     params.set("page", String(currentPage));
// // //     params.set("pageSize", String(pageSize));
// // //     if (searchTerm) params.set("q", searchTerm);
// // //     else params.delete("q");
// // //     setSearchParams(params, { replace: true });
// // //   }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams]);

// // //   // Dados paginados (o slice é feito DEPOIS da ordenação)
// // //   const totalItems = filteredProducts.length;
// // //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// // //   const safePage = Math.min(Math.max(1, currentPage), totalPages);
// // //   const startIdx = (safePage - 1) * pageSize;
// // //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// // //   const currentItems = filteredProducts.slice(startIdx, endIdx);

// // //   return (
// // //     <div className="p-6">
// // //       {/* Header padronizado */}
// // //       <div className="mb-6">
// // //         <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
// // //         <p className="text-sm text-gray-500">Gerencie o catálogo e monitore o nível de estoque</p>
// // //       </div>

// // //       {/* Abas */}
// // //       <div className="border-b border-gray-200">
// // //         <nav className="-mb-px flex space-x-6">
// // //           {[
// // //             { key: "todos", label: "Todos" },
// // //             { key: "low", label: "Baixo estoque" },
// // //           ].map((tab) => (
// // //             <button
// // //               key={tab.key}
// // //               onClick={() => setActiveTab(tab.key)}
// // //               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
// // //                 activeTab === tab.key
// // //                   ? "border-gray-900 text-gray-900"
// // //                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
// // //               }`}
// // //             >
// // //               {tab.label}
// // //             </button>
// // //           ))}
// // //         </nav>
// // //       </div>

// // //       {/* Toolbar */}
// // //       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // //         <div className="relative w-full sm:w-80">
// // //           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// // //           <input
// // //             type="text"
// // //             placeholder="Buscar produtos..."
// // //             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             aria-label="Campo de busca de produtos"
// // //           />
// // //         </div>

// // //         <div className="flex items-center gap-3">
// // //           <div className="flex items-center gap-2">
// // //             <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
// // //             <div className="relative">
// // //               <select
// // //                 id="pageSize"
// // //                 className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// // //                 value={pageSize}
// // //                 onChange={(e) => setPageSize(Number(e.target.value))}
// // //               >
// // //                 {[10, 20, 50, 100].map((n) => (
// // //                   <option key={n} value={n}>{n}</option>
// // //                 ))}
// // //               </select>
// // //               <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
// // //             </div>
// // //           </div>

// // //           <Link
// // //             to="/products/add"
// // //             className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
// // //           >
// // //             <PlusIcon className="h-5 w-5" /> Novo Produto
// // //           </Link>
// // //         </div>
// // //       </div>

// // //       {/* Card + tabela padronizados */}
// // //       <div className="overflow-hidden rounded-lg bg-white shadow">
// // //         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// // //           <div>
// // //             <h3 className="text-lg font-semibold text-gray-800">Catálogo</h3>
// // //             <p className="text-sm text-gray-500">Resumo dos produtos {activeTab === "low" ? "com baixo estoque" : "cadastrados"}</p>
// // //           </div>
// // //           <div className="text-right">
// // //             <p className="text-sm text-gray-600">Total de itens</p>
// // //             <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
// // //           </div>
// // //         </div>

// // //         {isLoading ? (
// // //           <div className="py-10 text-center text-gray-600">Carregando...</div>
// // //         ) : (
// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50">
// // //                 <tr>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-gray-200 bg-white">
// // //                 {currentItems.length > 0 ? (
// // //                   currentItems.map((product) => (
// // //                     <tr key={product.id} className="hover:bg-gray-50">
// // //                       <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
// // //                       <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
// // //                       <td className="px-6 py-4 text-sm text-gray-900">{product.compatibleModel}</td>
// // //                       <td className="px-6 py-4 text-sm text-gray-900">
// // //                         <span className={`${Number(product.stock) <= getThreshold(product) ? "text-red-600 font-semibold" : ""}`}>
// // //                           {product.stock}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-6 py-4 text-sm text-gray-900">{getThreshold(product)}</td>
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
// // //                       <td className="px-6 py-4 text-sm text-gray-900">{product.code || "-"}</td>
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm">
// // //                         <div className="flex items-center gap-2">
// // //                           <Link to={`/products/edit/${product.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
// // //                             <PencilIcon className="h-5 w-5" />
// // //                           </Link>
// // //                           <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
// // //                             <TrashIcon className="h-5 w-5" />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 ) : (
// // //                   <tr>
// // //                     <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
// // //                   </tr>
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Footer de paginação */}
// // //       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
// // //         <div className="text-sm text-gray-700">
// // //           {totalItems > 0 ? (
// // //             <span>
// // //               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> produtos
// // //             </span>
// // //           ) : (
// // //             <span>Nenhum registro</span>
// // //           )}
// // //         </div>

// // //         {totalPages > 1 && (
// // //           <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Products;



// // import { useState, useEffect, useMemo, useRef } from "react";
// // import { Link, useSearchParams } from "react-router-dom";
// // import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// // import { toast } from "react-toastify";
// // import { formatCurrency } from "../utils/format";
// // import { fetchProducts, deleteProduct } from "../services/api";

// // /** Hook de debounce simples para entradas (busca etc.) */
// // function useDebounce(value, delay = 400) {
// //   const [debounced, setDebounced] = useState(value);
// //   useEffect(() => {
// //     const id = setTimeout(() => setDebounced(value), delay);
// //     return () => clearTimeout(id);
// //   }, [value, delay]);
// //   return debounced;
// // }

// // /** Ícone de busca (inline, sem dependências extras) */
// // const SearchIcon = (props) => (
// //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// //     <circle cx="11" cy="11" r="7"></circle>
// //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //   </svg>
// // );

// // /** Paginação no estilo padronizado (ativo preto, acessível) */
// // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// //   const pages = useMemo(() => {
// //     if (totalPages <= 1) return [1];
// //     const pagesArr = [];
// //     const add = (p) => pagesArr.push(p);
// //     const start = Math.max(2, currentPage - windowSize);
// //     const end = Math.min(totalPages - 1, currentPage + windowSize);
// //     add(1);
// //     if (start > 2) add("…");
// //     for (let p = start; p <= end; p++) add(p);
// //     if (end < totalPages - 1) add("…");
// //     if (totalPages > 1) add(totalPages);
// //     return pagesArr;
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

// // const Products = () => {
// //   const [products, setProducts] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const debouncedSearch = useDebounce(searchTerm, 350);

// //   const [searchParams, setSearchParams] = useSearchParams();

// //   // Tabs para filtrar (Todos | Baixo estoque)
// //   const [activeTab, setActiveTab] = useState("todos");

// //   // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
// //   const initialPage = Number(searchParams.get("page")) || 1;
// //   const initialPageSize = Number(searchParams.get("pageSize")) || 10;

// //   const [currentPage, setCurrentPage] = useState(initialPage);
// //   const [pageSize, setPageSize] = useState(initialPageSize);

// //   // Seleção (checkboxes)
// //   const [selectedIds, setSelectedIds] = useState(() => new Set());
// //   const headerCheckboxRef = useRef(null);

// //   useEffect(() => {
// //     loadProducts();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const loadProducts = async () => {
// //     try {
// //       setIsLoading(true);
// //       const data = await fetchProducts();
// //       setProducts(data);
// //     } catch (error) {
// //       console.error("Error loading products:", error);
// //       toast.error("Erro ao carregar produtos");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
// //       try {
// //         await deleteProduct(id);
// //         setProducts((prev) => prev.filter((product) => product.id !== id));
// //         setSelectedIds((prev) => {
// //           const next = new Set(prev);
// //           next.delete(id);
// //           return next;
// //         });
// //         toast.success("Produto excluído com sucesso");
// //       } catch (error) {
// //         console.error("Error deleting product:", error);
// //         toast.error("Erro ao excluir produto");
// //       }
// //     }
// //   };

// //   const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

// //   // ---------- ORDENAR SEMPRE POR MAIS NOVO PRIMEIRO (ANTES DA PAGINAÇÃO) ----------
// //   const filteredProducts = useMemo(() => {
// //     const term = debouncedSearch.trim().toLowerCase();

// //     let base = products;
// //     if (activeTab === "low") {
// //       base = base.filter((p) => Number(p.stock) <= getThreshold(p));
// //     }

// //     const searched = !term
// //       ? base
// //       : base.filter((product) => {
// //           const fields = [product.name, product.brand, product.compatibleModel, product.code];
// //           return fields.filter(Boolean).some((f) => String(f).toLowerCase().includes(term));
// //         });

// //     const indexMap = new Map();
// //     products.forEach((p, i) => indexMap.set(p.id, i));

// //     const getCreatedTime = (obj) => {
// //       const raw = obj?.createdAt ?? obj?.created_at ?? null;
// //       if (raw) {
// //         const t = new Date(raw).getTime();
// //         if (Number.isFinite(t)) return t;
// //       }
// //       if (typeof obj?.id === "string" && /^[a-f0-9]{24}$/i.test(obj.id)) {
// //         const ms = parseInt(obj.id.slice(0, 8), 16) * 1000;
// //         if (Number.isFinite(ms)) return ms;
// //       }
// //       return Number.NEGATIVE_INFINITY;
// //     };

// //     return [...searched].sort((a, b) => {
// //       const tb = getCreatedTime(b);
// //       const ta = getCreatedTime(a);
// //       if (tb !== ta) return tb - ta;
// //       const ib = indexMap.get(b.id) ?? -1;
// //       const ia = indexMap.get(a.id) ?? -1;
// //       return ib - ia;
// //     });
// //   }, [products, debouncedSearch, activeTab]);
// //   // -------------------------------------------------------------------------------

// //   // Reset de página quando a busca/aba/pageSize mudam
// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [debouncedSearch, pageSize, activeTab]);

// //   // Sincroniza URL (permite compartilhar/voltar)
// //   useEffect(() => {
// //     const params = new URLSearchParams(searchParams);
// //     params.set("page", String(currentPage));
// //     params.set("pageSize", String(pageSize));
// //     if (searchTerm) params.set("q", searchTerm);
// //     else params.delete("q");
// //     setSearchParams(params, { replace: true });
// //   }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams]);

// //   // Dados paginados (o slice é feito DEPOIS da ordenação)
// //   const totalItems = filteredProducts.length;
// //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// //   const safePage = Math.min(Math.max(1, currentPage), totalPages);
// //   const startIdx = (safePage - 1) * pageSize;
// //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// //   const currentItems = filteredProducts.slice(startIdx, endIdx);

// //   // Seleção (página atual)
// //   const allSelectedOnPage = currentItems.length > 0 && currentItems.every((p) => selectedIds.has(p.id));
// //   const someSelectedOnPage = currentItems.some((p) => selectedIds.has(p.id));

// //   useEffect(() => {
// //     if (headerCheckboxRef.current) {
// //       headerCheckboxRef.current.indeterminate = !allSelectedOnPage && someSelectedOnPage;
// //     }
// //   }, [allSelectedOnPage, someSelectedOnPage, currentItems]);

// //   const toggleOne = (id) => {
// //     setSelectedIds((prev) => {
// //       const next = new Set(prev);
// //       next.has(id) ? next.delete(id) : next.add(id);
// //       return next;
// //     });
// //   };

// //   const toggleAllOnPage = () => {
// //     setSelectedIds((prev) => {
// //       const next = new Set(prev);
// //       if (allSelectedOnPage) {
// //         currentItems.forEach((p) => next.delete(p.id));
// //       } else {
// //         currentItems.forEach((p) => next.add(p.id));
// //       }
// //       return next;
// //     });
// //   };

// //   return (
// //     <div className="p-6">
// //       {/* Header padronizado */}
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
// //         <p className="text-sm text-gray-500">Gerencie o catálogo e monitore o nível de estoque</p>
// //       </div>

// //       {/* Abas */}
// //       <div className="border-b border-gray-200">
// //         <nav className="-mb-px flex space-x-6">
// //           {[
// //             { key: "todos", label: "Todos" },
// //             { key: "low", label: "Baixo estoque" },
// //           ].map((tab) => (
// //             <button
// //               key={tab.key}
// //               onClick={() => setActiveTab(tab.key)}
// //               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
// //                 activeTab === tab.key
// //                   ? "border-gray-900 text-gray-900"
// //                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
// //               }`}
// //             >
// //               {tab.label}
// //             </button>
// //           ))}
// //         </nav>
// //       </div>

// //       {/* Toolbar */}
// //       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div className="relative w-full sm:w-80">
// //           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// //           <input
// //             type="text"
// //             placeholder="Buscar produtos..."
// //             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             aria-label="Campo de busca de produtos"
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

// //       {/* Card + tabela padronizados */}
// //       <div className="overflow-hidden rounded-lg bg-white shadow">
// //         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// //           <div>
// //             <h3 className="text-lg font-semibold text-gray-800">Catálogo</h3>
// //             <p className="text-sm text-gray-500">Resumo dos produtos {activeTab === "low" ? "com baixo estoque" : "cadastrados"}</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-sm text-gray-600">Total de itens</p>
// //             <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
// //           </div>
// //         </div>

// //         {isLoading ? (
// //           <div className="py-10 text-center text-gray-600">Carregando...</div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   {/* Checkboxes */}
// //                   <th className="px-4 py-3 text-left">
// //                     <input
// //                       ref={headerCheckboxRef}
// //                       type="checkbox"
// //                       className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
// //                       checked={allSelectedOnPage}
// //                       onChange={toggleAllOnPage}
// //                       aria-label="Selecionar todos desta página"
// //                     />
// //                   </th>
// //                   {/* Código PRIMEIRO */}
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 bg-white">
// //                 {currentItems.length > 0 ? (
// //                   currentItems.map((product) => {
// //                     const checked = selectedIds.has(product.id);
// //                     return (
// //                       <tr key={product.id} className="hover:bg-gray-50">
// //                         {/* checkbox por linha */}
// //                         <td className="px-4 py-4">
// //                           <input
// //                             type="checkbox"
// //                             className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
// //                             checked={checked}
// //                             onChange={() => toggleOne(product.id)}
// //                             aria-label={`Selecionar ${product.name || "produto"}`}
// //                           />
// //                         </td>
// //                         {/* Código PRIMEIRO */}
// //                         <td className="px-6 py-4 text-sm text-gray-900">{product.code || "-"}</td>
// //                         <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">{product.compatibleModel}</td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">
// //                           <span className={`${Number(product.stock) <= getThreshold(product) ? "text-red-600 font-semibold" : ""}`}>
// //                             {product.stock}
// //                           </span>
// //                         </td>
// //                         <td className="px-6 py-4 text-sm text-gray-900">{getThreshold(product)}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm">
// //                           <div className="flex items-center gap-2">
// //                             <Link to={`/products/edit/${product.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
// //                               <PencilIcon className="h-5 w-5" />
// //                             </Link>
// //                             <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
// //                               <TrashIcon className="h-5 w-5" />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })
// //                 ) : (
// //                   <tr>
// //                     {/* +1 no colSpan por causa da coluna de checkbox */}
// //                     <td colSpan={9} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* Footer de paginação */}
// //       <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
// //         <div className="text-sm text-gray-700">
// //           {totalItems > 0 ? (
// //             <span>
// //               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> produtos
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

// // export default Products;



// import { useState, useEffect, useMemo, useRef } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { PlusIcon, PencilIcon, TrashIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import { formatCurrency } from "../utils/format";
// import { fetchProducts, deleteProduct } from "../services/api";

// /** Hook de debounce simples para entradas (busca etc.) */
// function useDebounce(value, delay = 400) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return debounced;
// }

// /** Ícone de busca (inline, sem dependências extras) */
// const SearchIcon = (props) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
//     <circle cx="11" cy="11" r="7"></circle>
//     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//   </svg>
// );

// /** Paginação no estilo padronizado (ativo preto, acessível) */
// function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
//   const pages = useMemo(() => {
//     if (totalPages <= 1) return [1];
//     const pagesArr = [];
//     const add = (p) => pagesArr.push(p);
//     const start = Math.max(2, currentPage - windowSize);
//     const end = Math.min(totalPages - 1, currentPage + windowSize);
//     add(1);
//     if (start > 2) add("…");
//     for (let p = start; p <= end; p++) add(p);
//     if (end < totalPages - 1) add("…");
//     if (totalPages > 1) add(totalPages);
//     return pagesArr;
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

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedSearch = useDebounce(searchTerm, 350);

//   const [searchParams, setSearchParams] = useSearchParams();

//   // Tabs para filtrar (Todos | Baixo estoque)
//   const [activeTab, setActiveTab] = useState("todos");

//   // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialPageSize = Number(searchParams.get("pageSize")) || 10;

//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [pageSize, setPageSize] = useState(initialPageSize);

//   // Seleção (checkboxes)
//   const [selectedIds, setSelectedIds] = useState(() => new Set());
//   const headerCheckboxRef = useRef(null);

//   // Import
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     loadProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const loadProducts = async () => {
//     try {
//       setIsLoading(true);
//       const data = await fetchProducts();
//       setProducts(data);
//     } catch (error) {
//       console.error("Error loading products:", error);
//       toast.error("Erro ao carregar produtos");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
//       try {
//         await deleteProduct(id);
//         setProducts((prev) => prev.filter((product) => product.id !== id));
//         setSelectedIds((prev) => {
//           const next = new Set(prev);
//           next.delete(id);
//           return next;
//         });
//         toast.success("Produto excluído com sucesso");
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         toast.error("Erro ao excluir produto");
//       }
//     }
//   };

//   // deletar em lote (selecionados)
//   const handleBulkDelete = async () => {
//     const ids = Array.from(selectedIds);
//     if (!ids.length) return;
//     if (!window.confirm(`Excluir ${ids.length} produto(s) selecionado(s)?`)) return;
//     try {
//       setIsLoading(true);
//       const results = await Promise.allSettled(ids.map((id) => deleteProduct(id)));
//       const ok = results.filter((r) => r.status === "fulfilled").length;
//       const fail = results.length - ok;
//       setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
//       setSelectedIds(new Set());
//       toast.success(`Excluídos: ${ok}${fail ? ` · Falharam: ${fail}` : ""}`);
//     } catch (e) {
//       console.error(e);
//       toast.error("Erro ao excluir em lote");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // exportar (selecionados ou página atual)
//   const handleExport = () => {
//     const data = selectedIds.size ? currentItems.filter((p) => selectedIds.has(p.id)) : currentItems;
//     if (!data.length) return toast.info("Nada para exportar nesta página.");
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     const today = new Date().toISOString().slice(0, 10);
//     a.href = url;
//     a.download = `produtos-${today}.json`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//     toast.success(`Exportado ${data.length} registro(s).`);
//   };

//   // importar (prévia local, sem persistir)
//   const handleImportClick = () => fileInputRef.current?.click();
//   const handleImportFile = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       const text = await file.text();
//       const json = JSON.parse(text);
//       if (!Array.isArray(json)) throw new Error("JSON inválido (esperado array).");
//       toast.info(`Arquivo lido: ${json.length} registro(s). Importação real não aplicada.`);
//       e.target.value = "";
//     } catch (err) {
//       console.error(err);
//       toast.error("Falha ao importar. Envie um .json com um array de produtos.");
//     }
//   };

//   const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

//   // ---------- ORDENAR SEMPRE POR MAIS NOVO PRIMEIRO (ANTES DA PAGINAÇÃO) ----------
//   const filteredProducts = useMemo(() => {
//     const term = debouncedSearch.trim().toLowerCase();

//     let base = products;
//     if (activeTab === "low") {
//       base = base.filter((p) => Number(p.stock) <= getThreshold(p));
//     }

//     const searched = !term
//       ? base
//       : base.filter((product) => {
//           const fields = [product.name, product.brand, product.compatibleModel, product.code];
//           return fields.filter(Boolean).some((f) => String(f).toLowerCase().includes(term));
//         });

//     const indexMap = new Map();
//     products.forEach((p, i) => indexMap.set(p.id, i));

//     const getCreatedTime = (obj) => {
//       const raw = obj?.createdAt ?? obj?.created_at ?? null;
//       if (raw) {
//         const t = new Date(raw).getTime();
//         if (Number.isFinite(t)) return t;
//       }
//       if (typeof obj?.id === "string" && /^[a-f0-9]{24}$/i.test(obj.id)) {
//         const ms = parseInt(obj.id.slice(0, 8), 16) * 1000;
//         if (Number.isFinite(ms)) return ms;
//       }
//       return Number.NEGATIVE_INFINITY;
//     };

//     return [...searched].sort((a, b) => {
//       const tb = getCreatedTime(b);
//       const ta = getCreatedTime(a);
//       if (tb !== ta) return tb - ta;
//       const ib = indexMap.get(b.id) ?? -1;
//       const ia = indexMap.get(a.id) ?? -1;
//       return ib - ia;
//     });
//   }, [products, debouncedSearch, activeTab]);
//   // -------------------------------------------------------------------------------

//   // Reset de página quando a busca/aba/pageSize mudam
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedSearch, pageSize, activeTab]);

//   // Sincroniza URL (permite compartilhar/voltar)
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", String(currentPage));
//     params.set("pageSize", String(pageSize));
//     if (searchTerm) params.set("q", searchTerm);
//     else params.delete("q");
//     setSearchParams(params, { replace: true });
//   }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams]);

//   // Dados paginados (o slice é feito DEPOIS da ordenação)
//   const totalItems = filteredProducts.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage = Math.min(Math.max(1, currentPage), totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const endIdx = Math.min(startIdx + pageSize, totalItems);
//   const currentItems = filteredProducts.slice(startIdx, endIdx);

//   // Seleção (página atual)
//   const allSelectedOnPage = currentItems.length > 0 && currentItems.every((p) => selectedIds.has(p.id));
//   const someSelectedOnPage = currentItems.some((p) => selectedIds.has(p.id));

//   useEffect(() => {
//     if (headerCheckboxRef.current) {
//       headerCheckboxRef.current.indeterminate = !allSelectedOnPage && someSelectedOnPage;
//     }
//   }, [allSelectedOnPage, someSelectedOnPage, currentItems]);

//   const toggleOne = (id) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   const toggleAllOnPage = () => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (allSelectedOnPage) {
//         currentItems.forEach((p) => next.delete(p.id));
//       } else {
//         currentItems.forEach((p) => next.add(p.id));
//       }
//       return next;
//     });
//   };

//   return (
//     <div className="p-6">
//       {/* Header padronizado */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
//         <p className="text-sm text-gray-500">Gerencie o catálogo e monitore o nível de estoque</p>
//       </div>

//       {/* Abas + Botões (na outra extremidade) */}
//       <div className="border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <nav className="-mb-px flex space-x-6">
//             {[
//               { key: "todos", label: "Todos" },
//               { key: "low", label: "Baixo estoque" },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
//                   activeTab === tab.key
//                     ? "border-gray-900 text-gray-900"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </nav>

//           {/* grupo de ações à direita */}
//           <div className="flex items-center gap-3 py-2">
//             <button
//               type="button"
//               onClick={handleBulkDelete}
//               disabled={selectedIds.size === 0}
//               className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
//                 selectedIds.size === 0 ? "bg-red-400/60 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
//               }`}
//               title={selectedIds.size ? `Excluir ${selectedIds.size} selecionado(s)` : "Selecione itens para excluir"}
//             >
//               <TrashIcon className="h-5 w-5" />
//               Delete
//             </button>

//             <button
//               type="button"
//               onClick={handleImportClick}
//               className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
//               title="Importar de arquivo JSON (prévia)"
//             >
//               <ArrowUpTrayIcon className="h-5 w-5" />
//               Importar
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="application/json,.json"
//               className="hidden"
//               onChange={handleImportFile}
//             />

//             <button
//               type="button"
//               onClick={handleExport}
//               className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
//               title="Exportar itens da página (ou os selecionados)"
//             >
//               <ArrowDownTrayIcon className="h-5 w-5" />
//               Exportar
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-80">
//           <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Buscar produtos..."
//             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             aria-label="Campo de busca de produtos"
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

//       {/* Card + tabela padronizados */}
//       <div className="overflow-hidden rounded-lg bg-white shadow">
//         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Catálogo</h3>
//             <p className="text-sm text-gray-500">Resumo dos produtos {activeTab === "low" ? "com baixo estoque" : "cadastrados"}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total de itens</p>
//             <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="py-10 text-center text-gray-600">Carregando...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {/* Checkboxes */}
//                   <th className="px-4 py-3 text-left">
//                     <input
//                       ref={headerCheckboxRef}
//                       type="checkbox"
//                       className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
//                       checked={allSelectedOnPage}
//                       onChange={toggleAllOnPage}
//                       aria-label="Selecionar todos desta página"
//                     />
//                   </th>
//                   {/* Código PRIMEIRO */}
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {currentItems.length > 0 ? (
//                   currentItems.map((product) => {
//                     const checked = selectedIds.has(product.id);
//                     return (
//                       <tr key={product.id} className="hover:bg-gray-50">
//                         {/* checkbox por linha */}
//                         <td className="px-4 py-4">
//                           <input
//                             type="checkbox"
//                             className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
//                             checked={checked}
//                             onChange={() => toggleOne(product.id)}
//                             aria-label={`Selecionar ${product.name || "produto"}`}
//                           />
//                         </td>
//                         {/* Código PRIMEIRO */}
//                         <td className="px-6 py-4 text-sm text-gray-900">{product.code || "-"}</td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{product.compatibleModel}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           <span className={`${Number(product.stock) <= getThreshold(product) ? "text-red-600 font-semibold" : ""}`}>
//                             {product.stock}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{getThreshold(product)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           <div className="flex items-center gap-2">
//                             <Link to={`/products/edit/${product.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
//                               <PencilIcon className="h-5 w-5" />
//                             </Link>
//                             <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
//                               <TrashIcon className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     {/* +1 no colSpan por causa da coluna de checkbox */}
//                     <td colSpan={9} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
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
//               Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> produtos
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

// export default Products;



import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatCurrency } from "../utils/format";
import { fetchProducts, deleteProduct } from "../services/api";

/** Hook de debounce simples para entradas (busca etc.) */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Ícone de busca (inline, sem dependências extras) */
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

/** Paginação no estilo padronizado (ativo preto, acessível) */
function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
  const pages = useMemo(() => {
    if (totalPages <= 1) return [1];
    const pagesArr = [];
    const add = (p) => pagesArr.push(p);
    const start = Math.max(2, currentPage - windowSize);
    const end = Math.min(totalPages - 1, currentPage + windowSize);
    add(1);
    if (start > 2) add("…");
    for (let p = start; p <= end; p++) add(p);
    if (end < totalPages - 1) add("…");
    if (totalPages > 1) add(totalPages);
    return pagesArr;
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [searchParams, setSearchParams] = useSearchParams();

  // Tabs para filtrar (Todos | Baixo estoque)
  const [activeTab, setActiveTab] = useState("todos");

  // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("pageSize")) || 10;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Seleção (checkboxes)
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const headerCheckboxRef = useRef(null);

  // Import
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((product) => product.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Produto excluído com sucesso");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Erro ao excluir produto");
      }
    }
  };

  // ======= CSV/Excel helpers =======
  const cols = ["code", "name", "brand", "compatibleModel", "stock", "lowStock", "price"];
  const headerMap = {
    code: "Código",
    name: "Nome",
    brand: "Marca",
    compatibleModel: "Modelo Compatível",
    stock: "Estoque",
    lowStock: "Alerta",
    price: "Preço",
  };

  const escapeCSV = (v) => {
    const s = v == null ? "" : String(v);
    const needs = /[",\n;\t]/.test(s);
    return needs ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const toCSV = (rows) => {
    const header = cols.map((k) => escapeCSV(headerMap[k] || k)).join(",");
    const body = rows
      .map((r) =>
        cols
          .map((k) => {
            let val = r[k];
            if (k === "price") val = Number(val ?? 0).toFixed(2);
            return escapeCSV(val ?? "");
          })
          .join(",")
      )
      .join("\n");
    return `${header}\n${body}`;
  };

  // CSV parser simples (suporta aspas e quebras)
  const parseCSV = (text) => {
    const lines = [];
    let cur = "", row = [], inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (inQ) {
        if (c === '"' && n === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") { row.push(cur); cur = ""; }
        else if (c === "\n") { row.push(cur); lines.push(row); row = []; cur = ""; }
        else if (c === "\r") { /* ignore */ }
        else cur += c;
      }
    }
    if (cur.length || row.length) { row.push(cur); lines.push(row); }
    if (!lines.length) return [];
    const header = lines[0].map((h) => h.trim().toLowerCase());
    const idx = (key) => {
      const aliases = [headerMap[key], key]
        .filter(Boolean)
        .map((x) => String(x).trim().toLowerCase());
      for (const a of aliases) {
        const p = header.indexOf(a);
        if (p >= 0) return p;
      }
      return -1;
    };
    return lines.slice(1).filter((r) => r.some((c) => c && String(c).trim() !== "")).map((r) => ({
      code: r[idx("code")] ?? "",
      name: r[idx("name")] ?? "",
      brand: r[idx("brand")] ?? "",
      compatibleModel: r[idx("compatibleModel")] ?? r[idx("modelo compatível")] ?? "",
      stock: Number(r[idx("stock")] ?? 0) || 0,
      lowStock: Number(r[idx("lowStock")] ?? r[idx("alerta")] ?? 0) || 0,
      price: Number(String(r[idx("price")] ?? 0).replace(",", ".")) || 0,
    }));
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  // =================================

  // deletar em lote (selecionados)
  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    if (!window.confirm(`Excluir ${ids.length} produto(s) selecionado(s)?`)) return;
    try {
      setIsLoading(true);
      const results = await Promise.allSettled(ids.map((id) => deleteProduct(id)));
      const ok = results.filter((r) => r.status === "fulfilled").length;
      const fail = results.length - ok;
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      toast.success(`Excluídos: ${ok}${fail ? ` · Falharam: ${fail}` : ""}`);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir em lote");
    } finally {
      setIsLoading(false);
    }
  };

  // EXPORT: tenta Excel (.xlsx); se não houver lib, cai para CSV
  const handleExport = async () => {
    const data = (selectedIds.size ? currentItems.filter((p) => selectedIds.has(p.id)) : currentItems).map((p) => ({
      code: p.code ?? "",
      name: p.name ?? "",
      brand: p.brand ?? "",
      compatibleModel: p.compatibleModel ?? "",
      stock: Number(p.stock ?? 0),
      lowStock: Number(p.lowStock ?? 0),
      price: Number(p.price ?? 0),
    }));
    if (!data.length) return toast.info("Nada para exportar nesta página.");

    try {
      const XLSX = (await import("xlsx")).default || (await import("xlsx"));
      const ws = XLSX.utils.json_to_sheet(data, { header: cols });
      // substitui cabeçalhos pela versão amigável
      XLSX.utils.sheet_add_aoa(ws, [cols.map((c) => headerMap[c])], { origin: "A1" });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Produtos");
      const fname = `produtos-${new Date().toISOString().slice(0,10)}.xlsx`;
      XLSX.writeFile(wb, fname);
      toast.success(`Exportado ${data.length} registro(s) em Excel.`);
    } catch (err) {
      // fallback para CSV
      const csv = toCSV(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const fname = `produtos-${new Date().toISOString().slice(0,10)}.csv`;
      downloadBlob(blob, fname);
      toast.success(`Exportado ${data.length} registro(s) em CSV.`);
    }
  };

  // IMPORT: aceita .csv, .xlsx, .xls (prévia local — não persiste)
  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let imported = [];
      if (/\.(xlsx|xls)$/i.test(file.name)) {
        // Excel
        const arrayBuffer = await file.arrayBuffer();
        const XLSX = (await import("xlsx")).default || (await import("xlsx"));
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wsname], { defval: "" });
        imported = rows.map((r) => ({
          code: r["Código"] ?? r.code ?? "",
          name: r["Nome"] ?? r.name ?? "",
          brand: r["Marca"] ?? r.brand ?? "",
          compatibleModel: r["Modelo Compatível"] ?? r.compatibleModel ?? "",
          stock: Number(r["Estoque"] ?? r.stock ?? 0) || 0,
          lowStock: Number(r["Alerta"] ?? r.lowStock ?? 0) || 0,
          price: Number(String(r["Preço"] ?? r.price ?? 0).toString().replace(",", ".")) || 0,
        }));
      } else {
        // CSV
        const text = await file.text();
        imported = parseCSV(text);
      }

      toast.success(`Lidos ${imported.length} registro(s) do arquivo.`);
      // Apenas pré-visualização local — NÃO envia para API.
      // Se quiser ver na lista imediatamente:
      // setProducts((prev) => [...imported.map((p,i)=>({id:`imp-${Date.now()}-${i}`, ...p})), ...prev]);

      e.target.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Falha ao importar. Envie um CSV ou Excel válido.");
    }
  };

  const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

  // ---------- ORDENAR SEMPRE POR MAIS NOVO PRIMEIRO (ANTES DA PAGINAÇÃO) ----------
  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    let base = products;
    if (activeTab === "low") {
      base = base.filter((p) => Number(p.stock) <= getThreshold(p));
    }

    const searched = !term
      ? base
      : base.filter((product) => {
          const fields = [product.name, product.brand, product.compatibleModel, product.code];
          return fields.filter(Boolean).some((f) => String(f).toLowerCase().includes(term));
        });

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
      if (tb !== ta) return tb - ta;
      const ib = indexMap.get(b.id) ?? -1;
      const ia = indexMap.get(a.id) ?? -1;
      return ib - ia;
    });
  }, [products, debouncedSearch, activeTab]);
  // -------------------------------------------------------------------------------

  // Reset de página quando a busca/aba/pageSize mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, pageSize, activeTab]);

  // Sincroniza URL (permite compartilhar/voltar)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(currentPage));
    params.set("pageSize", String(pageSize));
    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams]);

  // Dados paginados (o slice é feito DEPOIS da ordenação)
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredProducts.slice(startIdx, endIdx);

  // Seleção (página atual)
  const allSelectedOnPage = currentItems.length > 0 && currentItems.every((p) => selectedIds.has(p.id));
  const someSelectedOnPage = currentItems.some((p) => selectedIds.has(p.id));

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = !allSelectedOnPage && someSelectedOnPage;
    }
  }, [allSelectedOnPage, someSelectedOnPage, currentItems]);

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        currentItems.forEach((p) => next.delete(p.id));
      } else {
        currentItems.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
        <p className="text-sm text-gray-500">Gerencie o catálogo e monitore o nível de estoque</p>
      </div>

      {/* Abas + Botões (na outra extremidade) */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <nav className="-mb-px flex space-x-6">
            {[
              { key: "todos", label: "Todos" },
              { key: "low", label: "Baixo estoque" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* grupo de ações à direita */}
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={selectedIds.size === 0}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                selectedIds.size === 0 ? "bg-red-400/60 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
              title={selectedIds.size ? `Excluir ${selectedIds.size} selecionado(s)` : "Selecione itens para excluir"}
            >
              <TrashIcon className="h-5 w-5" />
              Delete
            </button>

            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              title="Importar CSV/Excel (prévia local)"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              Importar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx,.xls"
              className="hidden"
              onChange={handleImportFile}
            />

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              title="Exportar Excel (fallback CSV)"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Campo de busca de produtos"
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

      {/* Card + tabela padronizados */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Catálogo</h3>
            <p className="text-sm text-gray-500">Resumo dos produtos {activeTab === "low" ? "com baixo estoque" : "cadastrados"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total de itens</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-600">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Checkboxes */}
                  <th className="px-4 py-3 text-left">
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      checked={allSelectedOnPage}
                      onChange={toggleAllOnPage}
                      aria-label="Selecionar todos desta página"
                    />
                  </th>
                  {/* Código PRIMEIRO */}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => {
                    const checked = selectedIds.has(product.id);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        {/* checkbox por linha */}
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                            checked={checked}
                            onChange={() => toggleOne(product.id)}
                            aria-label={`Selecionar ${product.name || "produto"}`}
                          />
                        </td>
                        {/* Código PRIMEIRO */}
                        <td className="px-6 py-4 text-sm text-gray-900">{product.code || "-"}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.compatibleModel}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={`${Number(product.stock) <= getThreshold(product) ? "text-red-600 font-semibold" : ""}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{getThreshold(product)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <Link to={`/products/edit/${product.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    {/* +1 no colSpan por causa da coluna de checkbox */}
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
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
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> produtos
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

export default Products;

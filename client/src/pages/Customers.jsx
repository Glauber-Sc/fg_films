// // "use client"

// // import { useState, useEffect } from "react"
// // import { Link } from "react-router-dom"
// // import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
// // import { toast } from "react-toastify"
// // import PageHeader from "../components/PageHeader"
// // import Card from "../components/Card"
// // import { fetchCustomers, deleteCustomer } from "../services/api"

// // const Customers = () => {
// //   const [customers, setCustomers] = useState([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [searchTerm, setSearchTerm] = useState("")

// //   useEffect(() => {
// //     loadCustomers()
// //   }, [])

// //   const loadCustomers = async () => {
// //     try {
// //       setIsLoading(true)
// //       const data = await fetchCustomers()
// //       setCustomers(data)
// //     } catch (error) {
// //       console.error("Error loading customers:", error)
// //       toast.error("Erro ao carregar clientes")
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
// //       try {
// //         await deleteCustomer(id)
// //         setCustomers(customers.filter((customer) => customer.id !== id))
// //         toast.success("Cliente excluído com sucesso")
// //       } catch (error) {
// //         console.error("Error deleting customer:", error)
// //         toast.error("Erro ao excluir cliente")
// //       }
// //     }
// //   }

// //   const filteredCustomers = customers.filter(
// //     (customer) =>
// //       customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       (customer.phone && customer.phone.includes(searchTerm)) ||
// //       (customer.document && customer.document.toLowerCase().includes(searchTerm.toLowerCase())),
// //   )

// //   const ActionButton = () => (
// //     <Link to="/customers/add" className="btn-primary flex items-center">
// //       <PlusIcon className="w-5 h-5 mr-1" />
// //       Novo Cliente
// //     </Link>
// //   )

// //   return (
// //     <div>
// //       <PageHeader title="Clientes" actionButton={<ActionButton />} />

// //       <>
// //         <div className="mb-6">
// //           <input
// //             type="text"
// //             placeholder="Buscar clientes por nome, telefone ou documento..."
// //             className="input-field"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>

// //         {isLoading ? (
// //           <div className="text-center py-4">Carregando...</div>
// //         ) : (
// //           <div className="table-container">
// //             <table className="table">
// //               <thead>
// //                 <tr>
// //                   <th className="table-header">Nome</th>
// //                   <th className="table-header">Telefone</th>
// //                   <th className="table-header">CPF/CNPJ</th>
// //                   <th className="table-header">Endereço</th>
// //                   <th className="table-header">Ações</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredCustomers.length > 0 ? (
// //                   filteredCustomers.map((customer) => (
// //                     <tr key={customer.id}>
// //                       <td className="table-cell font-medium">{customer.name}</td>
// //                       <td className="table-cell">{customer.phone || "-"}</td>
// //                       <td className="table-cell">{customer.document || "-"}</td>
// //                       <td className="table-cell">{customer.address || "-"}</td>
// //                       <td className="table-cell">
// //                         <div className="flex space-x-2">
// //                           <Link
// //                             to={`/customers/edit/${customer.id}`}
// //                             className="p-1 text-blue-600 hover:text-blue-800"
// //                             title="Editar"
// //                           >
// //                             <PencilIcon className="w-5 h-5" />
// //                           </Link>
// //                           <button
// //                             onClick={() => handleDelete(customer.id)}
// //                             className="p-1 text-red-600 hover:text-red-800"
// //                             title="Excluir"
// //                           >
// //                             <TrashIcon className="w-5 h-5" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan="5" className="table-cell text-center">
// //                       Nenhum cliente encontrado
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </>
// //     </div>
// //   )
// // }

// // export default Customers





// import { useState, useEffect, useMemo } from "react"
// import { Link, useSearchParams } from "react-router-dom"
// import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
// import { toast } from "react-toastify"
// import PageHeader from "../components/PageHeader"
// import Card from "../components/Card"
// import { fetchCustomers, deleteCustomer } from "../services/api"

// // Componente de paginação com reticências
// function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
//   const pages = useMemo(() => {
//     if (totalPages <= 1) return [1]
//     const out = []
//     const add = (p) => out.push(p)
//     const start = Math.max(2, currentPage - windowSize)
//     const end = Math.min(totalPages - 1, currentPage + windowSize)
//     add(1)
//     if (start > 2) add("…")
//     for (let p = start; p <= end; p++) add(p)
//     if (end < totalPages - 1) add("…")
//     if (totalPages > 1) add(totalPages)
//     return out
//   }, [currentPage, totalPages, windowSize])

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
//   )
// }

// const Customers = () => {
//   const [customers, setCustomers] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")

//   // Estado de paginação + sincronização de URL
//   const [searchParams, setSearchParams] = useSearchParams()
//   const initialPage = Number(searchParams.get("page")) || 1
//   const initialPageSize = Number(searchParams.get("pageSize")) || 10
//   const [currentPage, setCurrentPage] = useState(initialPage)
//   const [pageSize, setPageSize] = useState(initialPageSize)

//   useEffect(() => {
//     loadCustomers()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const loadCustomers = async () => {
//     try {
//       setIsLoading(true)
//       const data = await fetchCustomers()
//       setCustomers(data)
//     } catch (error) {
//       console.error("Error loading customers:", error)
//       toast.error("Erro ao carregar clientes")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
//       try {
//         await deleteCustomer(id)
//         setCustomers((prev) => prev.filter((customer) => customer.id !== id))
//         toast.success("Cliente excluído com sucesso")
//       } catch (error) {
//         console.error("Error deleting customer:", error)
//         toast.error("Erro ao excluir cliente")
//       }
//     }
//   }

//   const filteredCustomers = useMemo(() => {
//     const term = searchTerm.toLowerCase()
//     if (!term) return customers
//     return customers.filter((customer) =>
//       (customer.name || "").toLowerCase().includes(term) ||
//       (customer.phone || "").includes(searchTerm) ||
//       (customer.document || "").toLowerCase().includes(term)
//     )
//   }, [customers, searchTerm])

//   // Reset página ao mudar busca ou pageSize
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, pageSize])

//   // Cálculo de paginação
//   const totalItems = filteredCustomers.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   const safePage = Math.min(Math.max(1, currentPage), totalPages)
//   const startIdx = (safePage - 1) * pageSize
//   const endIdx = Math.min(startIdx + pageSize, totalItems)
//   const currentItems = filteredCustomers.slice(startIdx, endIdx)

//   // Sincroniza na URL (?page, pageSize, q)
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams)
//     params.set("page", String(safePage))
//     params.set("pageSize", String(pageSize))
//     if (searchTerm) params.set("q", searchTerm)
//     else params.delete("q")
//     setSearchParams(params, { replace: true })
//   }, [safePage, pageSize, searchTerm, searchParams, setSearchParams])

//   const ActionButton = () => (
//     <Link to="/customers/add" className="btn-primary flex items-center">
//       <PlusIcon className="w-5 h-5 mr-1" />
//       Novo Cliente
//     </Link>
//   )

//   return (
//     <div>
//       <PageHeader title="Clientes" actionButton={<ActionButton />} />

//       <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <input
//           type="text"
//           placeholder="Buscar clientes por nome, telefone ou documento..."
//           className="input-field w-full md:max-w-md"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           aria-label="Campo de busca de clientes"
//         />
//         <div className="flex items-center gap-2">
//           <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
//           <select id="pageSize" className="border rounded px-2 py-1" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
//             {[10, 20, 50, 100].map((n) => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-4">Carregando...</div>
//       ) : (
//         <>
//           <div className="table-container">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th className="table-header">Nome</th>
//                   <th className="table-header">Telefone</th>
//                   <th className="table-header">CPF/CNPJ</th>
//                   <th className="table-header">Endereço</th>
//                   <th className="table-header">Ações</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length > 0 ? (
//                   currentItems.map((customer) => (
//                     <tr key={customer.id}>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{customer.name}</td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{customer.phone || "-"}</td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{customer.document || "-"}</td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{customer.address || "-"}</td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Link to={`/customers/edit/${customer.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
//                             <PencilIcon className="w-5 h-5" />
//                           </Link>
//                           <button onClick={() => handleDelete(customer.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
//                             <TrashIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="table-cell text-center">Nenhum cliente encontrado</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer de paginação */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
//             <div className="text-sm text-gray-700">
//               {totalItems > 0 ? (
//                 <span>
//                   Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> clientes
//                 </span>
//               ) : (
//                 <span>Nenhum registro</span>
//               )}
//             </div>
//             {totalPages > 1 && (
//               <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default Customers




import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { fetchCustomers, deleteCustomer } from "../services/api";

// Debounce simples
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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
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
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCustomers();
      setCustomers(data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteCustomer(id);
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        toast.success("Cliente excluído com sucesso");
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Erro ao excluir cliente");
      }
    }
  };

  // Normaliza busca por telefone (apenas dígitos)
  const onlyDigits = (s = "") => String(s).replace(/\D+/g, "");

  const filteredCustomers = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    const digits = onlyDigits(debouncedSearch);
    if (!term) return customers;
    return customers.filter((c) => {
      const nameMatch = String(c.name || "").toLowerCase().includes(term);
      const docMatch = String(c.document || "").toLowerCase().includes(term);
      const phoneMatch = digits ? onlyDigits(c.phone).includes(digits) : false;
      return nameMatch || docMatch || phoneMatch;
    });
  }, [customers, debouncedSearch]);

  // Reset página ao mudar busca/pageSize
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, pageSize]);

  // Paginação
  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredCustomers.slice(startIdx, endIdx);

  // Sincroniza na URL (?page, pageSize, q)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(safePage));
    params.set("pageSize", String(pageSize));
    if (searchTerm) params.set("q", searchTerm); else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [safePage, pageSize, searchTerm, searchParams, setSearchParams]);

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <p className="text-sm text-gray-500">Gerencie seus clientes e dados de contato</p>
      </div>

      {/* Toolbar (busca, page size, novo) */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou documento"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Campo de busca de clientes"
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
            to="/customers/add"
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            <PlusIcon className="h-5 w-5" /> Novo Cliente
          </Link>
        </div>
      </div>

      {/* Card + tabela */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lista de Clientes</h3>
            <p className="text-sm text-gray-500">Resultados da busca e paginação</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">CPF/CNPJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Endereço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{c.phone || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{c.document || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{c.address || "-"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link to={`/customers/edit/${c.id}`} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button onClick={() => handleDelete(c.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Nenhum cliente encontrado</td>
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
              Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> clientes
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

export default Customers;

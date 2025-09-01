// // // "use client"

// // // import { useState, useEffect } from "react"
// // // import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
// // // import PageHeader from "../components/PageHeader"
// // // import Card from "../components/Card"
// // // import { fetchProducts } from "../services/api"

// // // const Inventory = () => {
// // //   const [products, setProducts] = useState([])
// // //   const [isLoading, setIsLoading] = useState(true)
// // //   const [filter, setFilter] = useState("all") // 'all', 'low', 'out'
// // //   const [searchTerm, setSearchTerm] = useState("")

// // //   useEffect(() => {
// // //     loadProducts()
// // //   }, [])

// // //   const loadProducts = async () => {
// // //     try {
// // //       setIsLoading(true)
// // //       const data = await fetchProducts()
// // //       setProducts(data)
// // //     } catch (error) {
// // //       console.error("Error loading products:", error)
// // //     } finally {
// // //       setIsLoading(false)
// // //     }
// // //   }

// // //   const getFilteredProducts = () => {
// // //     let filtered = [...products]

// // //     // Apply stock filter
// // //     if (filter === "low") {
// // //       filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 5)
// // //     } else if (filter === "out") {
// // //       filtered = filtered.filter((product) => product.stock === 0)
// // //     }

// // //     // Apply search filter
// // //     if (searchTerm) {
// // //       filtered = filtered.filter(
// // //         (product) =>
// // //           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //           product.compatibleModel.toLowerCase().includes(searchTerm.toLowerCase()),
// // //       )
// // //     }

// // //     return filtered
// // //   }

// // //   const filteredProducts = getFilteredProducts()

// // //   const getStockStatus = (stock) => {
// // //     if (stock === 0) {
// // //       return { label: "Esgotado", color: "bg-red-100 text-red-800" }
// // //     } else if (stock <= 5) {
// // //       return { label: "Estoque Baixo", color: "bg-yellow-100 text-yellow-800" }
// // //     } else {
// // //       return { label: "Em Estoque", color: "bg-green-100 text-green-800" }
// // //     }
// // //   }

// // //   return (
// // //     <div>
// // //       <PageHeader title="Controle de Estoque" />

// // //       <Card>
// // //         <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
// // //           <div className="flex space-x-2">
// // //             <button
// // //               onClick={() => setFilter("all")}
// // //               className={`px-4 py-2 rounded-md ${
// // //                 filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
// // //               }`}
// // //             >
// // //               Todos
// // //             </button>
// // //             <button
// // //               onClick={() => setFilter("low")}
// // //               className={`px-4 py-2 rounded-md ${
// // //                 filter === "low" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
// // //               }`}
// // //             >
// // //               Estoque Baixo
// // //             </button>
// // //             <button
// // //               onClick={() => setFilter("out")}
// // //               className={`px-4 py-2 rounded-md ${
// // //                 filter === "out" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
// // //               }`}
// // //             >
// // //               Esgotados
// // //             </button>
// // //           </div>

// // //           <div className="w-full sm:w-64">
// // //             <input
// // //               type="text"
// // //               placeholder="Buscar produtos..."
// // //               className="input-field"
// // //               value={searchTerm}
// // //               onChange={(e) => setSearchTerm(e.target.value)}
// // //             />
// // //           </div>
// // //         </div>

// // //         {isLoading ? (
// // //           <div className="text-center py-4">Carregando...</div>
// // //         ) : (
// // //           <>
// // //             <div className="table-container">
// // //               <table className="table">
// // //                 <thead>
// // //                   <tr>
// // //                     <th className="table-header">Produto</th>
// // //                     <th className="table-header">Marca</th>
// // //                     <th className="table-header">Modelo Compatível</th>
// // //                     <th className="table-header">Estoque</th>
// // //                     <th className="table-header">Status</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {filteredProducts.length > 0 ? (
// // //                     filteredProducts.map((product) => {
// // //                       const status = getStockStatus(product.stock)
// // //                       return (
// // //                         <tr key={product.id}>
// // //                           <td className="table-cell">{product.name}</td>
// // //                           <td className="table-cell">{product.brand}</td>
// // //                           <td className="table-cell">{product.compatibleModel}</td>
// // //                           <td className="table-cell">
// // //                             {product.stock <= 5 ? (
// // //                               <div className="flex items-center">
// // //                                 <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-1" />
// // //                                 <span className="font-medium">{product.stock}</span>
// // //                               </div>
// // //                             ) : (
// // //                               product.stock
// // //                             )}
// // //                           </td>
// // //                           <td className="table-cell">
// // //                             <span className={`badge ${status.color}`}>{status.label}</span>
// // //                           </td>
// // //                         </tr>
// // //                       )
// // //                     })
// // //                   ) : (
// // //                     <tr>
// // //                       <td colSpan="5" className="table-cell text-center">
// // //                         Nenhum produto encontrado
// // //                       </td>
// // //                     </tr>
// // //                   )}
// // //                 </tbody>
// // //               </table>
// // //             </div>

// // //             <div className="mt-6 bg-blue-50 p-4 rounded-lg">
// // //               <h3 className="font-medium text-blue-800 mb-2">Resumo do Estoque</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                 <div className="bg-white p-3 rounded-md shadow-sm">
// // //                   <p className="text-sm text-gray-500">Total de Produtos</p>
// // //                   <p className="text-xl font-medium">{products.length}</p>
// // //                 </div>
// // //                 <div className="bg-white p-3 rounded-md shadow-sm">
// // //                   <p className="text-sm text-gray-500">Produtos com Estoque Baixo</p>
// // //                   <p className="text-xl font-medium text-yellow-600">
// // //                     {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
// // //                   </p>
// // //                 </div>
// // //                 <div className="bg-white p-3 rounded-md shadow-sm">
// // //                   <p className="text-sm text-gray-500">Produtos Esgotados</p>
// // //                   <p className="text-xl font-medium text-red-600">{products.filter((p) => p.stock === 0).length}</p>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </>
// // //         )}
// // //       </Card>
// // //     </div>
// // //   )
// // // }

// // // export default Inventory






// // import { useState, useEffect, useMemo } from "react"
// // import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
// // import { useSearchParams } from "react-router-dom"
// // import PageHeader from "../components/PageHeader"
// // import Card from "../components/Card"
// // import { fetchProducts } from "../services/api"

// // // Componente de paginação com reticências
// // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// //   const pages = useMemo(() => {
// //     if (totalPages <= 1) return [1]
// //     const out = []
// //     const add = (p) => out.push(p)
// //     const start = Math.max(2, currentPage - windowSize)
// //     const end = Math.min(totalPages - 1, currentPage + windowSize)
// //     add(1)
// //     if (start > 2) add("…")
// //     for (let p = start; p <= end; p++) add(p)
// //     if (end < totalPages - 1) add("…")
// //     if (totalPages > 1) add(totalPages)
// //     return out
// //   }, [currentPage, totalPages, windowSize])

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
// //   )
// // }

// // const Inventory = () => {
// //   const [products, setProducts] = useState([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [filter, setFilter] = useState("all") // 'all', 'low', 'out'
// //   const [searchTerm, setSearchTerm] = useState("")

// //   // Estado de paginação + sincronização de URL
// //   const [searchParams, setSearchParams] = useSearchParams()
// //   const initialPage = Number(searchParams.get("page")) || 1
// //   const initialPageSize = Number(searchParams.get("pageSize")) || 10
// //   const [currentPage, setCurrentPage] = useState(initialPage)
// //   const [pageSize, setPageSize] = useState(initialPageSize)

// //   useEffect(() => {
// //     loadProducts()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [])

// //   const loadProducts = async () => {
// //     try {
// //       setIsLoading(true)
// //       const data = await fetchProducts()
// //       setProducts(data)
// //     } catch (error) {
// //       console.error("Error loading products:", error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   // --- Filtros (estoque + busca) ---
// //   const filteredProducts = useMemo(() => {
// //     let filtered = [...products]

// //     if (filter === "low") filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 5)
// //     else if (filter === "out") filtered = filtered.filter((p) => p.stock === 0)

// //     if (searchTerm) {
// //       const term = searchTerm.toLowerCase()
// //       filtered = filtered.filter(
// //         (p) =>
// //           (p.name || "").toLowerCase().includes(term) ||
// //           (p.brand || "").toLowerCase().includes(term) ||
// //           (p.compatibleModel || "").toLowerCase().includes(term)
// //       )
// //     }

// //     return filtered
// //   }, [products, filter, searchTerm])

// //   // Reset página ao mudar filtros/tamanho
// //   useEffect(() => {
// //     setCurrentPage(1)
// //   }, [filter, searchTerm, pageSize])

// //   // --- Paginação ---
// //   const totalItems = filteredProducts.length
// //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
// //   const safePage = Math.min(Math.max(1, currentPage), totalPages)
// //   const startIdx = (safePage - 1) * pageSize
// //   const endIdx = Math.min(startIdx + pageSize, totalItems)
// //   const currentItems = filteredProducts.slice(startIdx, endIdx)

// //   // Sincroniza URL (?page, pageSize, filter, q)
// //   useEffect(() => {
// //     const params = new URLSearchParams(searchParams)
// //     params.set("page", String(safePage))
// //     params.set("pageSize", String(pageSize))
// //     if (filter && filter !== "all") params.set("filter", filter)
// //     else params.delete("filter")
// //     if (searchTerm) params.set("q", searchTerm)
// //     else params.delete("q")
// //     setSearchParams(params, { replace: true })
// //   }, [safePage, pageSize, filter, searchTerm, searchParams, setSearchParams])

// //   const getStockStatus = (stock) => {
// //     if (stock === 0) return { label: "Esgotado", color: "bg-red-100 text-red-800" }
// //     if (stock <= 5) return { label: "Estoque Baixo", color: "bg-yellow-100 text-yellow-800" }
// //     return { label: "Em Estoque", color: "bg-green-100 text-green-800" }
// //   }

// //   return (
// //     <div>
// //       <PageHeader title="Controle de Estoque" />

// //       <>
// //         <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
// //           <div className="flex space-x-2">
// //             <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Todos</button>
// //             <button onClick={() => setFilter("low")} className={`px-4 py-2 rounded-md ${filter === "low" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Estoque Baixo</button>
// //             <button onClick={() => setFilter("out")} className={`px-4 py-2 rounded-md ${filter === "out" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Esgotados</button>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <input type="text" placeholder="Buscar produtos..." className="input-field w-full sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
// //             <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
// //             <select id="pageSize" className="border rounded px-2 py-1" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
// //               {[10, 20, 50, 100].map((n) => (
// //                 <option key={n} value={n}>{n}</option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>

// //         {isLoading ? (
// //           <div className="text-center py-4">Carregando...</div>
// //         ) : (
// //           <>
// //             <div className="table-container">
// //               <table className="table">
// //                 <thead>
// //                   <tr>
// //                     <th className="table-header">Produto</th>
// //                     <th className="table-header">Marca</th>
// //                     <th className="table-header">Modelo Compatível</th>
// //                     <th className="table-header">Estoque</th>
// //                     <th className="table-header">Status</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {currentItems.length > 0 ? (
// //                     currentItems.map((product) => {
// //                       const status = getStockStatus(product.stock)
// //                       return (
// //                         <tr key={product.id}>
// //                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.name}</td>
// //                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.brand}</td>
// //                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.compatibleModel}</td>
// //                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                             {product.stock <= 5 ? (
// //                               <div className="flex items-center">
// //                                 <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-1" />
// //                                 <span className="font-medium">{product.stock}</span>
// //                               </div>
// //                             ) : (
// //                               product.stock
// //                             )}
// //                           </td>
// //                           <td className="table-cell">
// //                             <span className={`badge ${status.color}`}>{status.label}</span>
// //                           </td>
// //                         </tr>
// //                       )
// //                     })
// //                   ) : (
// //                     <tr>
// //                       <td colSpan="5" className="table-cell text-center">Nenhum produto encontrado</td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* Footer de paginação */}
// //             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
// //               <div className="text-sm text-gray-700">
// //                 {totalItems > 0 ? (
// //                   <span>
// //                     Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> itens
// //                   </span>
// //                 ) : (
// //                   <span>Nenhum registro</span>
// //                 )}
// //               </div>
// //               {totalPages > 1 && (
// //                 <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
// //               )}
// //             </div>
// //           </>
// //         )}
// //       </>
// //     </div>
// //   )
// // }

// // export default Inventory




// import { useState, useEffect, useMemo } from "react"
// import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
// import { useSearchParams } from "react-router-dom"
// import PageHeader from "../components/PageHeader"
// import Card from "../components/Card"
// import { fetchProducts } from "../services/api"

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

// const Inventory = () => {
//   const [products, setProducts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [filter, setFilter] = useState("all") // 'all', 'low', 'out'
//   const [searchTerm, setSearchTerm] = useState("")

//   // Estado de paginação + sincronização de URL
//   const [searchParams, setSearchParams] = useSearchParams()
//   const initialPage = Number(searchParams.get("page")) || 1
//   const initialPageSize = Number(searchParams.get("pageSize")) || 10
//   const [currentPage, setCurrentPage] = useState(initialPage)
//   const [pageSize, setPageSize] = useState(initialPageSize)

//   useEffect(() => {
//     loadProducts()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const loadProducts = async () => {
//     try {
//       setIsLoading(true)
//       const data = await fetchProducts()
//       setProducts(data)
//     } catch (error) {
//       console.error("Error loading products:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getThreshold = (p) => Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5

//   // --- Filtros (estoque + busca) ---
//   const filteredProducts = useMemo(() => {
//     let filtered = [...products]

//     if (filter === "low") filtered = filtered.filter((p) => {
//       const t = getThreshold(p)
//       return p.stock > 0 && p.stock <= t
//     })
//     else if (filter === "out") filtered = filtered.filter((p) => p.stock === 0)

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(
//         (p) =>
//           (p.name || "").toLowerCase().includes(term) ||
//           (p.brand || "").toLowerCase().includes(term) ||
//           (p.compatibleModel || "").toLowerCase().includes(term)
//       )
//     }

//     return filtered
//   }, [products, filter, searchTerm])

//   // Reset página ao mudar filtros/tamanho
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [filter, searchTerm, pageSize])

//   // --- Paginação ---
//   const totalItems = filteredProducts.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   const safePage = Math.min(Math.max(1, currentPage), totalPages)
//   const startIdx = (safePage - 1) * pageSize
//   const endIdx = Math.min(startIdx + pageSize, totalItems)
//   const currentItems = filteredProducts.slice(startIdx, endIdx)

//   // Sincroniza URL (?page, pageSize, filter, q)
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams)
//     params.set("page", String(safePage))
//     params.set("pageSize", String(pageSize))
//     if (filter && filter !== "all") params.set("filter", filter)
//     else params.delete("filter")
//     if (searchTerm) params.set("q", searchTerm)
//     else params.delete("q")
//     setSearchParams(params, { replace: true })
//   }, [safePage, pageSize, filter, searchTerm, searchParams, setSearchParams])

//   const getStockStatus = (stock, threshold) => {
//     if (stock === 0) return { label: "Esgotado", color: "bg-red-100 text-red-800" }
//     if (stock <= threshold) return { label: `Estoque Baixo (≤${threshold})`, color: "bg-yellow-100 text-yellow-800" }
//     return { label: "Em Estoque", color: "bg-green-100 text-green-800" }
//   }

//   return (
//     <div>
//       <PageHeader title="Controle de Estoque" />

//       <>
//         <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//           <div className="flex space-x-2">
//             <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Todos</button>
//             <button onClick={() => setFilter("low")} className={`px-4 py-2 rounded-md ${filter === "low" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Estoque Baixo</button>
//             <button onClick={() => setFilter("out")} className={`px-4 py-2 rounded-md ${filter === "out" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>Esgotados</button>
//           </div>

//           <div className="flex items-center gap-2">
//             <input type="text" placeholder="Buscar produtos..." className="input-field w-full sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             <label htmlFor="pageSize" className="text-sm text-gray-600">Itens por página</label>
//             <select id="pageSize" className="border rounded px-2 py-1" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
//               {[10, 20, 50, 100].map((n) => (
//                 <option key={n} value={n}>{n}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="text-center py-4">Carregando...</div>
//         ) : (
//           <>
//             <div className="table-container">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th className="table-header">Produto</th>
//                     <th className="table-header">Marca</th>
//                     <th className="table-header">Modelo Compatível</th>
//                     <th className="table-header">Estoque</th>
//                     <th className="table-header">Alerta</th>
//                     <th className="table-header">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.length > 0 ? (
//                     currentItems.map((product) => {
//                       const threshold = getThreshold(product)
//                       const status = getStockStatus(product.stock, threshold)
//                       return (
//                         <tr key={product.id}>
//                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.name}</td>
//                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.brand}</td>
//                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.compatibleModel}</td>
//                           <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                             {product.stock <= threshold ? (
//                               <div className="flex items-center">
//                                 <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-1" />
//                                 <span className="font-medium">{product.stock}</span>
//                               </div>
//                             ) : (
//                               product.stock
//                             )}
//                           </td>
//                           <td className="table-cell">{threshold}</td>
//                           <td className="table-cell">
//                             <span className={`badge ${status.color}`}>{status.label}</span>
//                           </td>
//                         </tr>
//                       )
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="table-cell text-center">Nenhum produto encontrado</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer de paginação */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
//               <div className="text-sm text-gray-700">
//                 {totalItems > 0 ? (
//                   <span>
//                     Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong> itens
//                   </span>
//                 ) : (
//                   <span>Nenhum registro</span>
//                 )}
//               </div>
//               {totalPages > 1 && (
//                 <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />
//               )}
//             </div>
//           </>
//         )}
//       </>
//     </div>
//   )
// }

// export default Inventory



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

  // --- Filtragem e busca (igual ao padrão do Quotes) ---
  const filtered = useMemo(() => {
    let base = products;
    if (stockTab === "out") base = base.filter((p) => p.stock === 0);
    else if (stockTab === "low") base = base.filter((p) => p.stock > 0 && p.stock <= getThreshold(p));

    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return base;
    return base.filter((p) =>
      String(p.name || "").toLowerCase().includes(term) ||
      String(p.brand || "").toLowerCase().includes(term) ||
      String(p.compatibleModel || "").toLowerCase().includes(term)
    );
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
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/30"
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
            <p className="text-sm text-gray-600">Total filtrado</p>
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

// // // "use client"

// // // import { useState, useEffect } from "react"
// // // import { Link } from "react-router-dom"
// // // import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
// // // import { toast } from "react-toastify"
// // // import PageHeader from "../components/PageHeader"
// // // import Card from "../components/Card"
// // // import { formatCurrency } from "../utils/format"
// // // import { fetchProducts, deleteProduct } from "../services/api"

// // // const Products = () => {
// // //   const [products, setProducts] = useState([])
// // //   const [isLoading, setIsLoading] = useState(true)
// // //   const [searchTerm, setSearchTerm] = useState("")
// // //   const [currentPage, setCurrentPage] = useState(1)
// // //   const productsPerPage = 10

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
// // //       toast.error("Erro ao carregar produtos")
// // //     } finally {
// // //       setIsLoading(false)
// // //     }
// // //   }

// // //   const handleDelete = async (id) => {
// // //     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
// // //       try {
// // //         await deleteProduct(id)
// // //         setProducts(products.filter((product) => product.id !== id))
// // //         toast.success("Produto excluído com sucesso")
// // //       } catch (error) {
// // //         console.error("Error deleting product:", error)
// // //         toast.error("Erro ao excluir produto")
// // //       }
// // //     }
// // //   }

// // //   const filteredProducts = products.filter(
// // //     (product) =>
// // //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       product.compatibleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase())),
// // //   )

// // //   // Pagination
// // //   const indexOfLastProduct = currentPage * productsPerPage
// // //   const indexOfFirstProduct = indexOfLastProduct - productsPerPage
// // //   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
// // //   const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

// // //   const ActionButton = () => (
// // //     <Link to="/products/add" className="btn-primary flex items-center">
// // //       <PlusIcon className="w-5 h-5 mr-1" />
// // //       Novo Produto
// // //     </Link>
// // //   )

// // //   return (
// // //     <div>
// // //       <PageHeader title="Produtos" actionButton={<ActionButton />} />

// // //       <>
// // //         <div className="mb-6">
// // //           <input
// // //             type="text"
// // //             placeholder="Buscar produtos..."
// // //             className="input-field"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //           />
// // //         </div>

// // //         {isLoading ? (
// // //           <div className="text-center py-4">Carregando...</div>
// // //         ) : (
// // //           <>
// // //             <div className="table-container">
// // //               <table className="table">
// // //                 <thead>
// // //                   <tr>
// // //                     <th className="table-header">Nome</th>
// // //                     <th className="table-header">Marca</th>
// // //                     <th className="table-header">Modelo Compatível</th>
// // //                     <th className="table-header">Estoque</th>
// // //                     <th className="table-header">Preço</th>
// // //                     <th className="table-header">Código</th>
// // //                     <th className="table-header">Ações</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {currentProducts.length > 0 ? (
// // //                     currentProducts.map((product) => (
// // //                       <tr key={product.id}>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.name}</td>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.brand}</td>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.compatibleModel}</td>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// // //                           <span className={`${product.stock <= 5 ? "text-red-600 font-medium" : ""}`}>
// // //                             {product.stock}
// // //                           </span>
// // //                         </td>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(product.price)}</td>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.code || "-"}</td>
// // //                         <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// // //                           <div className="flex space-x-2">
// // //                             <Link
// // //                               to={`/products/edit/${product.id}`}
// // //                               className="p-1 text-blue-600 hover:text-blue-800"
// // //                               title="Editar"
// // //                             >
// // //                               <PencilIcon className="w-5 h-5" />
// // //                             </Link>
// // //                             <button
// // //                               onClick={() => handleDelete(product.id)}
// // //                               className="p-1 text-red-600 hover:text-red-800"
// // //                               title="Excluir"
// // //                             >
// // //                               <TrashIcon className="w-5 h-5" />
// // //                             </button>
// // //                           </div>
// // //                         </td>
// // //                       </tr>
// // //                     ))
// // //                   ) : (
// // //                     <tr>
// // //                       <td colSpan="7" className="table-cell text-center">
// // //                         Nenhum produto encontrado
// // //                       </td>
// // //                     </tr>
// // //                   )}
// // //                 </tbody>
// // //               </table>
// // //             </div>

// // //             {/* Pagination */}
// // //             {totalPages > 1 && (
// // //               <div className="flex justify-center mt-6">
// // //                 <nav className="flex items-center space-x-2">
// // //                   <button
// // //                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
// // //                     disabled={currentPage === 1}
// // //                     className="px-3 py-1 rounded border disabled:opacity-50"
// // //                   >
// // //                     Anterior
// // //                   </button>

// // //                   <span className="px-3 py-1">
// // //                     Página {currentPage} de {totalPages}
// // //                   </span>

// // //                   <button
// // //                     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
// // //                     disabled={currentPage === totalPages}
// // //                     className="px-3 py-1 rounded border disabled:opacity-50"
// // //                   >
// // //                     Próxima
// // //                   </button>
// // //                 </nav>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </>
// // //     </div>
// // //   )
// // // }

// // // export default Products





// // import { useState, useEffect, useMemo } from "react"
// // import { Link, useSearchParams } from "react-router-dom"
// // import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
// // import { toast } from "react-toastify"
// // import PageHeader from "../components/PageHeader"
// // import Card from "../components/Card"
// // import { formatCurrency } from "../utils/format"
// // import { fetchProducts, deleteProduct } from "../services/api"

// // /**
// //  * Hook de debounce simples para entradas (busca etc.)
// //  */
// // function useDebounce(value, delay = 400) {
// //   const [debounced, setDebounced] = useState(value)
// //   useEffect(() => {
// //     const id = setTimeout(() => setDebounced(value), delay)
// //     return () => clearTimeout(id)
// //   }, [value, delay])
// //   return debounced
// // }

// // /**
// //  * Componente de paginação profissional, acessível e responsivo, com reticências
// //  */
// // function Pagination({
// //   currentPage,
// //   totalPages,
// //   onChange,
// //   className = "",
// //   windowSize = 1,
// // }) {
// //   // Gera páginas com reticências (ex.: 1 … 4 5 6 … 20)
// //   const pages = useMemo(() => {
// //     if (totalPages <= 1) return [1]
// //     const pagesArr = []
// //     const add = (p) => pagesArr.push(p)

// //     const start = Math.max(2, currentPage - windowSize)
// //     const end = Math.min(totalPages - 1, currentPage + windowSize)

// //     add(1)
// //     if (start > 2) add("…")
// //     for (let p = start; p <= end; p++) add(p)
// //     if (end < totalPages - 1) add("…")
// //     if (totalPages > 1) add(totalPages)

// //     return pagesArr
// //   }, [currentPage, totalPages, windowSize])

// //   return (
// //     <nav
// //       className={`inline-flex items-center gap-1 select-none ${className}`}
// //       role="navigation"
// //       aria-label="Paginação"
// //     >
// //       <button
// //         type="button"
// //         onClick={() => onChange(1)}
// //         disabled={currentPage === 1}
// //         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
// //         aria-label="Primeira página"
// //       >
// //         «
// //       </button>
// //       <button
// //         type="button"
// //         onClick={() => onChange(Math.max(1, currentPage - 1))}
// //         disabled={currentPage === 1}
// //         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
// //         aria-label="Página anterior"
// //       >
// //         Anterior
// //       </button>

// //       {pages.map((p, i) => (
// //         <button
// //           key={`${p}-${i}`}
// //           type="button"
// //           onClick={() => (p !== "…" ? onChange(p) : null)}
// //           disabled={p === "…"}
// //           aria-current={p === currentPage ? "page" : undefined}
// //           className={`px-3 py-1 rounded border text-sm min-w-[40px] ${
// //             p === currentPage
// //               ? "bg-black text-white border-black"
// //               : "hover:bg-gray-100"
// //           } ${p === "…" ? "cursor-default" : ""}`}
// //         >
// //           {p}
// //         </button>
// //       ))}

// //       <button
// //         type="button"
// //         onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
// //         disabled={currentPage === totalPages}
// //         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
// //         aria-label="Próxima página"
// //       >
// //         Próxima
// //       </button>
// //       <button
// //         type="button"
// //         onClick={() => onChange(totalPages)}
// //         disabled={currentPage === totalPages}
// //         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
// //         aria-label="Última página"
// //       >
// //         »
// //       </button>
// //     </nav>
// //   )
// // }

// // const Products = () => {
// //   const [products, setProducts] = useState([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const debouncedSearch = useDebounce(searchTerm, 350)

// //   const [searchParams, setSearchParams] = useSearchParams()

// //   // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
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
// //       toast.error("Erro ao carregar produtos")
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
// //       try {
// //         await deleteProduct(id)
// //         setProducts((prev) => prev.filter((product) => product.id !== id))
// //         toast.success("Produto excluído com sucesso")
// //       } catch (error) {
// //         console.error("Error deleting product:", error)
// //         toast.error("Erro ao excluir produto")
// //       }
// //     }
// //   }

// //   // Filtro de busca (case-insensitive)
// //   const filteredProducts = useMemo(() => {
// //     const term = debouncedSearch.trim().toLowerCase()
// //     if (!term) return products
// //     return products.filter((product) => {
// //       const fields = [
// //         product.name,
// //         product.brand,
// //         product.compatibleModel,
// //         product.code,
// //       ]
// //       return fields
// //         .filter(Boolean)
// //         .some((f) => String(f).toLowerCase().includes(term))
// //     })
// //   }, [products, debouncedSearch])

// //   // Reset de página quando a busca ou pageSize mudam
// //   useEffect(() => {
// //     setCurrentPage(1)
// //   }, [debouncedSearch, pageSize])

// //   // Sincroniza URL (permite compartilhar/voltar)
// //   useEffect(() => {
// //     const params = new URLSearchParams(searchParams)
// //     params.set("page", String(currentPage))
// //     params.set("pageSize", String(pageSize))
// //     if (searchTerm) params.set("q", searchTerm)
// //     else params.delete("q")
// //     setSearchParams(params, { replace: true })
// //   }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams])

// //   // Dados paginados
// //   const totalItems = filteredProducts.length
// //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
// //   const safePage = Math.min(Math.max(1, currentPage), totalPages)
// //   const startIdx = (safePage - 1) * pageSize
// //   const endIdx = Math.min(startIdx + pageSize, totalItems)
// //   const currentItems = filteredProducts.slice(startIdx, endIdx)

// //   const ActionButton = () => (
// //     <Link to="/products/add" className="btn-primary flex items-center">
// //       <PlusIcon className="w-5 h-5 mr-1" />
// //       Novo Produto
// //     </Link>
// //   )

// //   return (
// //     <div>
// //       <PageHeader title="Produtos" actionButton={<ActionButton />} />

// //       <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
// //         <div className="flex-1">
// //           <input
// //             type="text"
// //             placeholder="Buscar produtos..."
// //             className="input-field w-full"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             aria-label="Campo de busca de produtos"
// //           />
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <label htmlFor="pageSize" className="text-sm text-gray-600">
// //             Itens por página
// //           </label>
// //           <select
// //             id="pageSize"
// //             className="border rounded px-2 py-1"
// //             value={pageSize}
// //             onChange={(e) => setPageSize(Number(e.target.value))}
// //           >
// //             {[10, 20, 50, 100].map((n) => (
// //               <option key={n} value={n}>
// //                 {n}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       {isLoading ? (
// //         <div className="text-center py-4">Carregando...</div>
// //       ) : (
// //         <>
// //           <div className="table-container">
// //             <table className="table">
// //               <thead>
// //                 <tr>
// //                   <th className="table-header">Nome</th>
// //                   <th className="table-header">Marca</th>
// //                   <th className="table-header">Modelo Compatível</th>
// //                   <th className="table-header">Estoque</th>
// //                   <th className="table-header">Preço</th>
// //                   <th className="table-header">Código</th>
// //                   <th className="table-header">Ações</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentItems.length > 0 ? (
// //                   currentItems.map((product) => (
// //                     <tr key={product.id}>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         {product.name}
// //                       </td>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         {product.brand}
// //                       </td>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         {product.compatibleModel}
// //                       </td>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         <span className={`${product.stock <= 5 ? "text-red-600 font-medium" : ""}`}>
// //                           {product.stock}
// //                         </span>
// //                       </td>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         {formatCurrency(product.price)}
// //                       </td>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         {product.code || "-"}
// //                       </td>
// //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
// //                         <div className="flex space-x-2">
// //                           <Link
// //                             to={`/products/edit/${product.id}`}
// //                             className="p-1 text-blue-600 hover:text-blue-800"
// //                             title="Editar"
// //                           >
// //                             <PencilIcon className="w-5 h-5" />
// //                           </Link>
// //                           <button
// //                             onClick={() => handleDelete(product.id)}
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
// //                     <td colSpan="7" className="table-cell text-center">
// //                       Nenhum produto encontrado
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Footer de paginação com contagem e controles avançados */}
// //           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
// //             <div className="text-sm text-gray-700">
// //               {totalItems > 0 ? (
// //                 <span>
// //                   Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de {" "}
// //                   <strong>{totalItems}</strong> produtos
// //                 </span>
// //               ) : (
// //                 <span>Nenhum registro</span>
// //               )}
// //             </div>

// //             {totalPages > 1 && (
// //               <Pagination
// //                 currentPage={safePage}
// //                 totalPages={totalPages}
// //                 onChange={(p) => setCurrentPage(p)}
// //                 className="justify-center"
// //                 windowSize={1}
// //               />
// //             )}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   )
// // }

// // export default Products



// import { useState, useEffect, useMemo } from "react"
// import { Link, useSearchParams } from "react-router-dom"
// import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
// import { toast } from "react-toastify"
// import PageHeader from "../components/PageHeader"
// import Card from "../components/Card"
// import { formatCurrency } from "../utils/format"
// import { fetchProducts, deleteProduct } from "../services/api"

// /**
//  * Hook de debounce simples para entradas (busca etc.)
//  */
// function useDebounce(value, delay = 400) {
//   const [debounced, setDebounced] = useState(value)
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay)
//     return () => clearTimeout(id)
//   }, [value, delay])
//   return debounced
// }

// /**
//  * Componente de paginação profissional, acessível e responsivo, com reticências
//  */
// function Pagination({
//   currentPage,
//   totalPages,
//   onChange,
//   className = "",
//   windowSize = 1,
// }) {
//   // Gera páginas com reticências (ex.: 1 … 4 5 6 … 20)
//   const pages = useMemo(() => {
//     if (totalPages <= 1) return [1]
//     const pagesArr = []
//     const add = (p) => pagesArr.push(p)

//     const start = Math.max(2, currentPage - windowSize)
//     const end = Math.min(totalPages - 1, currentPage + windowSize)

//     add(1)
//     if (start > 2) add("…")
//     for (let p = start; p <= end; p++) add(p)
//     if (end < totalPages - 1) add("…")
//     if (totalPages > 1) add(totalPages)

//     return pagesArr
//   }, [currentPage, totalPages, windowSize])

//   return (
//     <nav
//       className={`inline-flex items-center gap-1 select-none ${className}`}
//       role="navigation"
//       aria-label="Paginação"
//     >
//       <button
//         type="button"
//         onClick={() => onChange(1)}
//         disabled={currentPage === 1}
//         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//         aria-label="Primeira página"
//       >
//         «
//       </button>
//       <button
//         type="button"
//         onClick={() => onChange(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//         aria-label="Página anterior"
//       >
//         Anterior
//       </button>

//       {pages.map((p, i) => (
//         <button
//           key={`${p}-${i}`}
//           type="button"
//           onClick={() => (p !== "…" ? onChange(p) : null)}
//           disabled={p === "…"}
//           aria-current={p === currentPage ? "page" : undefined}
//           className={`px-3 py-1 rounded border text-sm min-w-[40px] ${
//             p === currentPage
//               ? "bg-black text-white border-black"
//               : "hover:bg-gray-100"
//           } ${p === "…" ? "cursor-default" : ""}`}
//         >
//           {p}
//         </button>
//       ))}

//       <button
//         type="button"
//         onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//         aria-label="Próxima página"
//       >
//         Próxima
//       </button>
//       <button
//         type="button"
//         onClick={() => onChange(totalPages)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 rounded border text-sm disabled:opacity-50"
//         aria-label="Última página"
//       >
//         »
//       </button>
//     </nav>
//   )
// }

// const Products = () => {
//   const [products, setProducts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const debouncedSearch = useDebounce(searchTerm, 350)

//   const [searchParams, setSearchParams] = useSearchParams()

//   // Lê estado inicial da URL (?page=2&pageSize=50&q=fone)
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
//       toast.error("Erro ao carregar produtos")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
//       try {
//         await deleteProduct(id)
//         setProducts((prev) => prev.filter((product) => product.id !== id))
//         toast.success("Produto excluído com sucesso")
//       } catch (error) {
//         console.error("Error deleting product:", error)
//         toast.error("Erro ao excluir produto")
//       }
//     }
//   }

//   const getThreshold = (p) => Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5

//   // Filtro de busca (case-insensitive)
//   const filteredProducts = useMemo(() => {
//     const term = debouncedSearch.trim().toLowerCase()
//     if (!term) return products
//     return products.filter((product) => {
//       const fields = [
//         product.name,
//         product.brand,
//         product.compatibleModel,
//         product.code,
//       ]
//       return fields
//         .filter(Boolean)
//         .some((f) => String(f).toLowerCase().includes(term))
//     })
//   }, [products, debouncedSearch])

//   // Reset de página quando a busca ou pageSize mudam
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [debouncedSearch, pageSize])

//   // Sincroniza URL (permite compartilhar/voltar)
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams)
//     params.set("page", String(currentPage))
//     params.set("pageSize", String(pageSize))
//     if (searchTerm) params.set("q", searchTerm)
//     else params.delete("q")
//     setSearchParams(params, { replace: true })
//   }, [currentPage, pageSize, searchTerm, searchParams, setSearchParams])

//   // Dados paginados
//   const totalItems = filteredProducts.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   const safePage = Math.min(Math.max(1, currentPage), totalPages)
//   const startIdx = (safePage - 1) * pageSize
//   const endIdx = Math.min(startIdx + pageSize, totalItems)
//   const currentItems = filteredProducts.slice(startIdx, endIdx)

//   const ActionButton = () => (
//     <Link to="/products/add" className="btn-primary flex items-center">
//       <PlusIcon className="w-5 h-5 mr-1" />
//       Novo Produto
//     </Link>
//   )

//   return (
//     <div>
//       <PageHeader title="Produtos" actionButton={<ActionButton />} />

//       <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Buscar produtos..."
//             className="input-field w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             aria-label="Campo de busca de produtos"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <label htmlFor="pageSize" className="text-sm text-gray-600">
//             Itens por página
//           </label>
//           <select
//             id="pageSize"
//             className="border rounded px-2 py-1"
//             value={pageSize}
//             onChange={(e) => setPageSize(Number(e.target.value))}
//           >
//             {[10, 20, 50, 100].map((n) => (
//               <option key={n} value={n}>
//                 {n}
//               </option>
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
//                   <th className="table-header">Marca</th>
//                   <th className="table-header">Modelo Compatível</th>
//                   <th className="table-header">Estoque</th>
//                   <th className="table-header">Alerta </th>
//                   <th className="table-header">Preço</th>
//                   <th className="table-header">Código</th>
//                   <th className="table-header">Ações</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length > 0 ? (
//                   currentItems.map((product) => (
//                     <tr key={product.id}>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         {product.name}
//                       </td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         {product.brand}
//                       </td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         {product.compatibleModel}
//                       </td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         <span className={`${product.stock <= getThreshold(product) ? "text-red-600 font-medium" : ""}`}>
//                           {product.stock}
//                         </span>
//                       </td>
//                       <td className="table-cell">{getThreshold(product)}</td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         {formatCurrency(product.price)}
//                       </td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         {product.code || "-"}
//                       </td>
//                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Link
//                             to={`/products/edit/${product.id}`}
//                             className="p-1 text-blue-600 hover:text-blue-800"
//                             title="Editar"
//                           >
//                             <PencilIcon className="w-5 h-5" />
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(product.id)}
//                             className="p-1 text-red-600 hover:text-red-800"
//                             title="Excluir"
//                           >
//                             <TrashIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="table-cell text-center">
//                       Nenhum produto encontrado
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer de paginação com contagem e controles avançados */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
//             <div className="text-sm text-gray-700">
//               {totalItems > 0 ? (
//                 <span>
//                   Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de{" "}
//                   <strong>{totalItems}</strong> produtos
//                 </span>
//               ) : (
//                 <span>Nenhum registro</span>
//               )}
//             </div>

//             {totalPages > 1 && (
//               <Pagination
//                 currentPage={safePage}
//                 totalPages={totalPages}
//                 onChange={(p) => setCurrentPage(p)}
//                 className="justify-center"
//                 windowSize={1}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default Products



import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
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
        toast.success("Produto excluído com sucesso");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Erro ao excluir produto");
      }
    }
  };

  const getThreshold = (p) => (Number.isFinite(p?.lowStock) ? Number(p.lowStock) : 5);

  // Filtro de busca (case-insensitive) + aba "baixo estoque"
  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    let base = products;

    if (activeTab === "low") {
      base = base.filter((p) => Number(p.stock) <= getThreshold(p));
    }

    if (!term) return base;
    return base.filter((product) => {
      const fields = [product.name, product.brand, product.compatibleModel, product.code];
      return fields.filter(Boolean).some((f) => String(f).toLowerCase().includes(term));
    });
  }, [products, debouncedSearch, activeTab]);

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

  // Dados paginados
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const currentItems = filteredProducts.slice(startIdx, endIdx);

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
        <p className="text-sm text-gray-500">Gerencie o catálogo e monitore o nível de estoque</p>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-200">
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo Compatível</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Alerta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
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
                      <td className="px-6 py-4 text-sm text-gray-900">{product.code || "-"}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Nenhum produto encontrado</td>
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
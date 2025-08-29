// // // // // // // "use client"

// // // // // // // import { useState, useEffect } from "react"
// // // // // // // import { Bar } from "react-chartjs-2"
// // // // // // // import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
// // // // // // // import PageHeader from "../components/PageHeader"
// // // // // // // import Card from "../components/Card"
// // // // // // // import { formatCurrency } from "../utils/format"
// // // // // // // import { fetchReports } from "../services/api"

// // // // // // // // Register Chart.js components
// // // // // // // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// // // // // // // const Reports = () => {
// // // // // // //   const [reportData, setReportData] = useState({
// // // // // // //     dailySales: [],
// // // // // // //     monthlySales: [],
// // // // // // //     topProducts: [],
// // // // // // //   })
// // // // // // //   const [isLoading, setIsLoading] = useState(true)

// // // // // // //   useEffect(() => {
// // // // // // //     const loadReportData = async () => {
// // // // // // //       try {
// // // // // // //         setIsLoading(true)
// // // // // // //         const data = await fetchReports()
// // // // // // //         setReportData(data)
// // // // // // //       } catch (error) {
// // // // // // //         console.error("Error loading report data:", error)
// // // // // // //       } finally {
// // // // // // //         setIsLoading(false)
// // // // // // //       }
// // // // // // //     }

// // // // // // //     loadReportData()
// // // // // // //   }, [])

// // // // // // //   const dailySalesChartData = {
// // // // // // //     labels: reportData.dailySales.map((item) => item.date),
// // // // // // //     datasets: [
// // // // // // //       {
// // // // // // //         label: "Vendas Diárias (R$)",
// // // // // // //         data: reportData.dailySales.map((item) => item.total),
// // // // // // //         backgroundColor: "rgba(59, 130, 246, 0.5)",
// // // // // // //         borderColor: "rgb(59, 130, 246)",
// // // // // // //         borderWidth: 1,
// // // // // // //       },
// // // // // // //     ],
// // // // // // //   }

// // // // // // //   const monthlySalesChartData = {
// // // // // // //     labels: reportData.monthlySales.map((item) => item.month),
// // // // // // //     datasets: [
// // // // // // //       {
// // // // // // //         label: "Vendas Mensais (R$)",
// // // // // // //         data: reportData.monthlySales.map((item) => item.total),
// // // // // // //         backgroundColor: "rgba(16, 185, 129, 0.5)",
// // // // // // //         borderColor: "rgb(16, 185, 129)",
// // // // // // //         borderWidth: 1,
// // // // // // //       },
// // // // // // //     ],
// // // // // // //   }

// // // // // // //   const chartOptions = {
// // // // // // //     responsive: true,
// // // // // // //     plugins: {
// // // // // // //       legend: {
// // // // // // //         position: "top",
// // // // // // //       },
// // // // // // //       title: {
// // // // // // //         display: false,
// // // // // // //       },
// // // // // // //     },
// // // // // // //     scales: {
// // // // // // //       y: {
// // // // // // //         beginAtZero: true,
// // // // // // //       },
// // // // // // //     },
// // // // // // //   }

// // // // // // //   if (isLoading) {
// // // // // // //     return <div className="flex justify-center items-center h-full">Carregando...</div>
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <PageHeader title="Relatórios" />

// // // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// // // // // // //         <Card title="Vendas Diárias (Últimos 7 dias)">
// // // // // // //           <div className="h-80">
// // // // // // //             <Bar data={dailySalesChartData} options={chartOptions} />
// // // // // // //           </div>
// // // // // // //         </Card>

// // // // // // //         <Card title="Vendas Mensais (Últimos 6 meses)">
// // // // // // //           <div className="h-80">
// // // // // // //             <Bar data={monthlySalesChartData} options={chartOptions} />
// // // // // // //           </div>
// // // // // // //         </Card>
// // // // // // //       </div>

// // // // // // //       <Card title="Produtos Mais Vendidos">
// // // // // // //         <div className="overflow-x-auto">
// // // // // // //           <table className="table">
// // // // // // //             <thead>
// // // // // // //               <tr>
// // // // // // //                 <th className="table-header">Produto</th>
// // // // // // //                 <th className="table-header">Marca</th>
// // // // // // //                 <th className="table-header">Qtd. Vendida</th>
// // // // // // //                 <th className="table-header">Faturamento</th>
// // // // // // //                 <th className="table-header">% do Total</th>
// // // // // // //               </tr>
// // // // // // //             </thead>
// // // // // // //             <tbody>
// // // // // // //               {reportData.topProducts.length > 0 ? (
// // // // // // //                 reportData.topProducts.map((product) => (
// // // // // // //                   <tr key={product.id}>
// // // // // // //                     <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.name}</td>
// // // // // // //                     <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.brand}</td>
// // // // // // //                     <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.totalSold}</td>
// // // // // // //                     <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(product.totalRevenue)}</td>
// // // // // // //                     <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.percentageOfTotal.toFixed(2)}%</td>
// // // // // // //                   </tr>
// // // // // // //                 ))
// // // // // // //               ) : (
// // // // // // //                 <tr>
// // // // // // //                   <td colSpan="5" className="table-cell text-center">
// // // // // // //                     Nenhuma venda registrada
// // // // // // //                   </td>
// // // // // // //                 </tr>
// // // // // // //               )}
// // // // // // //             </tbody>
// // // // // // //           </table>
// // // // // // //         </div>
// // // // // // //       </Card>
// // // // // // //     </div>
// // // // // // //   )
// // // // // // // }

// // // // // // // export default Reports



// // // // // // import { useState, useEffect, useMemo } from "react"
// // // // // // import { Bar } from "react-chartjs-2"
// // // // // // import {
// // // // // //   Chart,
// // // // // //   CategoryScale,
// // // // // //   LinearScale,
// // // // // //   BarElement,
// // // // // //   Title,
// // // // // //   Tooltip,
// // // // // //   Legend,
// // // // // // } from "chart.js"
// // // // // // import PageHeader from "../components/PageHeader"
// // // // // // import Card from "../components/Card"
// // // // // // import { formatCurrency } from "../utils/format"
// // // // // // import { fetchReports } from "../services/api"

// // // // // // // =====================
// // // // // // // Chart.js Registration
// // // // // // // =====================
// // // // // // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// // // // // // // =====================
// // // // // // // Utils
// // // // // // // =====================
// // // // // // const pad = (n) => String(n).padStart(2, "0")
// // // // // // const today = () => {
// // // // // //   const d = new Date()
// // // // // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
// // // // // // }
// // // // // // const thisMonth = () => {
// // // // // //   const d = new Date()
// // // // // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` // YYYY-MM
// // // // // // }
// // // // // // const startOfMonth = (ym) => {
// // // // // //   // ym: "YYYY-MM"
// // // // // //   const [y, m] = ym.split("-").map(Number)
// // // // // //   return `${y}-${pad(m)}-01`
// // // // // // }
// // // // // // const endOfMonth = (ym) => {
// // // // // //   const [y, m] = ym.split("-").map(Number)
// // // // // //   const last = new Date(y, m, 0).getDate()
// // // // // //   return `${y}-${pad(m)}-${pad(last)}`
// // // // // // }

// // // // // // const toISODateTime = (date, endOfDay = false) =>
// // // // // //   endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`

// // // // // // // Normalize products array regardless of API property name
// // // // // // const normalizeProducts = (data) => {
// // // // // //   if (!Array.isArray(data)) return []
// // // // // //   return data.map((p, idx) => ({
// // // // // //     id: p.id ?? idx,
// // // // // //     name: p.name ?? p.productName ?? "—",
// // // // // //     brand: p.brand ?? p.marca ?? "—",
// // // // // //     totalSold: Number(p.totalSold ?? p.quantity ?? 0),
// // // // // //     totalRevenue: Number(p.totalRevenue ?? p.revenue ?? 0),
// // // // // //     // Keep percentage as-is if API sends it, we may recompute later
// // // // // //     percentageOfTotal: p.percentageOfTotal != null ? Number(p.percentageOfTotal) : null,
// // // // // //     lastSoldAt: p.lastSoldAt ?? p.lastSaleAt ?? null,
// // // // // //   }))
// // // // // // }

// // // // // // // Compute quick KPIs
// // // // // // const computeKPIs = (reportData, currentDayStr, currentMonthStr) => {
// // // // // //   const daily = reportData?.dailySales ?? []
// // // // // //   const monthly = reportData?.monthlySales ?? []

// // // // // //   const kpiDayTotal = daily.find((d) => d.date === currentDayStr)?.total ?? 0
// // // // // //   const kpiMonthTotal = (() => {
// // // // // //     // Accept formats like "YYYY-MM" or any textual month; try strict first
// // // // // //     const m1 = monthly.find((m) => m.month === currentMonthStr)?.total
// // // // // //     if (typeof m1 === "number") return m1
// // // // // //     // Try to match by prefix YYYY-MM when month labels are human (e.g., "Ago/2025")
// // // // // //     const [y, m] = currentMonthStr.split("-")
// // // // // //     const byPrefix = monthly.find((mm) => String(mm.month).includes(`${y}-${m}`))?.total
// // // // // //     return byPrefix ?? 0
// // // // // //   })()

// // // // // //   // Orders count if backend provided, else null
// // // // // //   const dayOrders = reportData?.todayOrdersCount ?? null
// // // // // //   const monthOrders = reportData?.monthOrdersCount ?? null

// // // // // //   return {
// // // // // //     kpiDayTotal,
// // // // // //     kpiMonthTotal,
// // // // // //     dayOrders,
// // // // // //     monthOrders,
// // // // // //   }
// // // // // // }

// // // // // // const QuickButton = ({ children, onClick, active }) => (
// // // // // //   <button
// // // // // //     onClick={onClick}
// // // // // //     className={`px-3 py-2 rounded-xl border text-sm transition ${
// // // // // //       active
// // // // // //         ? "bg-blue-600 text-white border-blue-600 shadow"
// // // // // //         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
// // // // // //     }`}
// // // // // //     type="button"
// // // // // //   >
// // // // // //     {children}
// // // // // //   </button>
// // // // // // )

// // // // // // const Input = ({ className = "", ...props }) => (
// // // // // //   <input
// // // // // //     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${className}`}
// // // // // //     {...props}
// // // // // //   />
// // // // // // )

// // // // // // const Select = ({ className = "", ...props }) => (
// // // // // //   <select
// // // // // //     className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${className}`}
// // // // // //     {...props}
// // // // // //   />
// // // // // // )

// // // // // // const Reports = () => {
// // // // // //   // =====================
// // // // // //   // Filters State
// // // // // //   // =====================
// // // // // //   const [filters, setFilters] = useState({
// // // // // //     mode: "day", // 'day' | 'month' | 'range'
// // // // // //     date: today(),
// // // // // //     month: thisMonth(), // YYYY-MM
// // // // // //     startDate: today(),
// // // // // //     endDate: today(),
// // // // // //     search: "",
// // // // // //     sortBy: "totalRevenue", // name | brand | totalSold | totalRevenue | percentage
// // // // // //     sortDir: "desc", // asc | desc
// // // // // //   })

// // // // // //   // =====================
// // // // // //   // Data State
// // // // // //   // =====================
// // // // // //   const [reportData, setReportData] = useState({
// // // // // //     dailySales: [],
// // // // // //     monthlySales: [],
// // // // // //     // the backend may return either `topProducts` or `products`
// // // // // //     topProducts: [],
// // // // // //     products: [],
// // // // // //   })
// // // // // //   const [isLoading, setIsLoading] = useState(true)
// // // // // //   const [isExporting, setIsExporting] = useState(false)

// // // // // //   // =====================
// // // // // //   // Fetching
// // // // // //   // =====================
// // // // // //   const buildParams = () => {
// // // // // //     if (filters.mode === "day") {
// // // // // //       const from = toISODateTime(filters.date)
// // // // // //       const to = toISODateTime(filters.date, true)
// // // // // //       return { from, to, search: filters.search, groupBy: "product" }
// // // // // //     }
// // // // // //     if (filters.mode === "month") {
// // // // // //       const from = toISODateTime(startOfMonth(filters.month))
// // // // // //       const to = toISODateTime(endOfMonth(filters.month), true)
// // // // // //       return { from, to, search: filters.search, groupBy: "product" }
// // // // // //     }
// // // // // //     // range
// // // // // //     const from = toISODateTime(filters.startDate)
// // // // // //     const to = toISODateTime(filters.endDate, true)
// // // // // //     return { from, to, search: filters.search, groupBy: "product" }
// // // // // //   }

// // // // // //   const loadReportData = async () => {
// // // // // //     try {
// // // // // //       setIsLoading(true)
// // // // // //       const params = buildParams()
// // // // // //       // The backend should honor [from,to,search,groupBy]
// // // // // //       const data = await fetchReports(params)
// // // // // //       setReportData(data)
// // // // // //     } catch (error) {
// // // // // //       console.error("Error loading report data:", error)
// // // // // //     } finally {
// // // // // //       setIsLoading(false)
// // // // // //     }
// // // // // //   }

// // // // // //   useEffect(() => {
// // // // // //     loadReportData()
// // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // //   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, filters.search])

// // // // // //   // =====================
// // // // // //   // Derived Data
// // // // // //   // =====================
// // // // // //   const { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders } = useMemo(
// // // // // //     () => computeKPIs(reportData, filters.date, filters.month),
// // // // // //     [reportData, filters.date, filters.month]
// // // // // //   )

// // // // // //   const allProductsRaw = useMemo(() => {
// // // // // //     // Prefer `products` when available; fallback to `topProducts`
// // // // // //     const base = reportData.products?.length ? reportData.products : reportData.topProducts
// // // // // //     return normalizeProducts(base)
// // // // // //   }, [reportData])

// // // // // //   const revenueTotal = useMemo(
// // // // // //     () => allProductsRaw.reduce((acc, p) => acc + Number(p.totalRevenue || 0), 0),
// // // // // //     [allProductsRaw]
// // // // // //   )

// // // // // //   const products = useMemo(() => {
// // // // // //     const term = filters.search.trim().toLowerCase()
// // // // // //     let arr = allProductsRaw
// // // // // //       .map((p) => ({
// // // // // //         ...p,
// // // // // //         percentageOfTotal:
// // // // // //           revenueTotal > 0
// // // // // //             ? Number(((Number(p.totalRevenue || 0) / revenueTotal) * 100).toFixed(2))
// // // // // //             : 0,
// // // // // //       }))
// // // // // //       .filter((p) =>
// // // // // //         term
// // // // // //           ? `${p.name} ${p.brand}`.toLowerCase().includes(term)
// // // // // //           : true
// // // // // //       )

// // // // // //     const dir = filters.sortDir === "asc" ? 1 : -1
// // // // // //     const sb = filters.sortBy
// // // // // //     arr.sort((a, b) => {
// // // // // //       if (sb === "name" || sb === "brand") {
// // // // // //         return a[sb].localeCompare(b[sb]) * dir
// // // // // //       }
// // // // // //       return ((a[sb] ?? 0) - (b[sb] ?? 0)) * dir
// // // // // //     })

// // // // // //     return arr
// // // // // //   }, [allProductsRaw, filters.search, filters.sortBy, filters.sortDir, revenueTotal])

// // // // // //   // =====================
// // // // // //   // Charts
// // // // // //   // =====================
// // // // // //   const dailySalesChartData = {
// // // // // //     labels: (reportData.dailySales ?? []).map((item) => item.date),
// // // // // //     datasets: [
// // // // // //       {
// // // // // //         label: "Vendas Diárias (R$)",
// // // // // //         data: (reportData.dailySales ?? []).map((item) => item.total),
// // // // // //         backgroundColor: "rgba(59, 130, 246, 0.5)",
// // // // // //         borderColor: "rgb(59, 130, 246)",
// // // // // //         borderWidth: 1,
// // // // // //       },
// // // // // //     ],
// // // // // //   }

// // // // // //   const monthlySalesChartData = {
// // // // // //     labels: (reportData.monthlySales ?? []).map((item) => item.month),
// // // // // //     datasets: [
// // // // // //       {
// // // // // //         label: "Vendas Mensais (R$)",
// // // // // //         data: (reportData.monthlySales ?? []).map((item) => item.total),
// // // // // //         backgroundColor: "rgba(16, 185, 129, 0.5)",
// // // // // //         borderColor: "rgb(16, 185, 129)",
// // // // // //         borderWidth: 1,
// // // // // //       },
// // // // // //     ],
// // // // // //   }

// // // // // //   const chartOptions = {
// // // // // //     responsive: true,
// // // // // //     plugins: {
// // // // // //       legend: { position: "top" },
// // // // // //       title: { display: false },
// // // // // //       tooltip: { mode: "index", intersect: false },
// // // // // //     },
// // // // // //     scales: {
// // // // // //       y: { beginAtZero: true },
// // // // // //       x: { ticks: { autoSkip: true, maxRotation: 0 } },
// // // // // //     },
// // // // // //   }

// // // // // //   // =====================
// // // // // //   // Handlers
// // // // // //   // =====================
// // // // // //   const setMode = (mode) => setFilters((f) => ({ ...f, mode }))

// // // // // //   const exportCSV = async () => {
// // // // // //     try {
// // // // // //       setIsExporting(true)
// // // // // //       const headers = [
// // // // // //         "Produto",
// // // // // //         "Marca",
// // // // // //         "QtdVendida",
// // // // // //         "Faturamento",
// // // // // //         "%DoTotal",
// // // // // //         "UltimaVenda",
// // // // // //       ]
// // // // // //       const csvRows = [headers.join(",")]
// // // // // //       products.forEach((p) => {
// // // // // //         csvRows.push(
// // // // // //           [
// // // // // //             `"${(p.name ?? "").replaceAll('"', '""')}"`,
// // // // // //             `"${(p.brand ?? "").replaceAll('"', '""')}"`,
// // // // // //             p.totalSold,
// // // // // //             p.totalRevenue,
// // // // // //             p.percentageOfTotal,
// // // // // //             p.lastSoldAt ? `"${p.lastSoldAt}"` : "",
// // // // // //           ].join(",")
// // // // // //         )
// // // // // //       })
// // // // // //       const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
// // // // // //       const url = URL.createObjectURL(blob)
// // // // // //       const a = document.createElement("a")
// // // // // //       a.href = url
// // // // // //       const when = (() => {
// // // // // //         if (filters.mode === "day") return filters.date
// // // // // //         if (filters.mode === "month") return filters.month
// // // // // //         return `${filters.startDate}_a_${filters.endDate}`
// // // // // //       })()
// // // // // //       a.download = `produtos_${filters.mode}_${when}.csv`
// // // // // //       document.body.appendChild(a)
// // // // // //       a.click()
// // // // // //       a.remove()
// // // // // //       URL.revokeObjectURL(url)
// // // // // //     } catch (e) {
// // // // // //       console.error("Erro ao exportar CSV:", e)
// // // // // //     } finally {
// // // // // //       setIsExporting(false)
// // // // // //     }
// // // // // //   }

// // // // // //   const headerSort = (col) => () => {
// // // // // //     setFilters((f) => ({
// // // // // //       ...f,
// // // // // //       sortBy: col,
// // // // // //       sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc",
// // // // // //     }))
// // // // // //   }

// // // // // //   // =====================
// // // // // //   // Render
// // // // // //   // =====================
// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <div className="flex flex-col gap-2 justify-center items-center h-full text-gray-600">
// // // // // //         <span className="animate-pulse">Carregando relatórios…</span>
// // // // // //       </div>
// // // // // //     )
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="space-y-6">
// // // // // //       <PageHeader title="Relatórios" />

// // // // // //       {/* =====================
// // // // // //           FILTROS / BARRA DE CONTROLE
// // // // // //          ===================== */}
// // // // // //       <Card title="Filtros & Pesquisa">
// // // // // //         <div className="flex flex-col gap-4">
// // // // // //           {/* Linha 1: Granularidade + Pesquisa */}
// // // // // //           <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
// // // // // //             <div className="lg:col-span-2">
// // // // // //               <label className="text-xs font-medium text-gray-600">Granularidade</label>
// // // // // //               <Select
// // // // // //                 value={filters.mode}
// // // // // //                 onChange={(e) => setMode(e.target.value)}
// // // // // //               >
// // // // // //                 <option value="day">Por dia</option>
// // // // // //                 <option value="month">Por mês</option>
// // // // // //                 <option value="range">Por período</option>
// // // // // //               </Select>
// // // // // //             </div>

// // // // // //             <div className="lg:col-span-4">
// // // // // //               <label className="text-xs font-medium text-gray-600">Barra de pesquisa (produto / marca)</label>
// // // // // //               <Input
// // // // // //                 placeholder="Ex.: Paracetamol, Nestlé…"
// // // // // //                 value={filters.search}
// // // // // //                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
// // // // // //               />
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Linha 2: Seletores de data condicionais */}
// // // // // //           {filters.mode === "day" && (
// // // // // //             <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
// // // // // //               <div className="lg:col-span-2">
// // // // // //                 <label className="text-xs font-medium text-gray-600">Escolha o dia</label>
// // // // // //                 <Input
// // // // // //                   type="date"
// // // // // //                   value={filters.date}
// // // // // //                   onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div className="lg:col-span-4 flex items-end gap-2">
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => setFilters((f) => ({ ...f, date: today() }))}
// // // // // //                   active={filters.date === today()}
// // // // // //                 >
// // // // // //                   Hoje
// // // // // //                 </QuickButton>
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => {
// // // // // //                     setMode("month")
// // // // // //                     setFilters((f) => ({ ...f, month: thisMonth() }))
// // // // // //                   }}
// // // // // //                   active={false}
// // // // // //                 >
// // // // // //                   Este mês
// // // // // //                 </QuickButton>
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => setFilters((f) => ({ ...f, search: "" }))}
// // // // // //                   active={false}
// // // // // //                 >
// // // // // //                   Limpar pesquisa
// // // // // //                 </QuickButton>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {filters.mode === "month" && (
// // // // // //             <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
// // // // // //               <div className="lg:col-span-2">
// // // // // //                 <label className="text-xs font-medium text-gray-600">Escolha o mês</label>
// // // // // //                 <Input
// // // // // //                   type="month"
// // // // // //                   value={filters.month}
// // // // // //                   onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div className="lg:col-span-4 flex items-end gap-2">
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => setFilters((f) => ({ ...f, month: thisMonth() }))}
// // // // // //                   active={filters.month === thisMonth()}
// // // // // //                 >
// // // // // //                   Mês atual
// // // // // //                 </QuickButton>
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => setMode("day")}
// // // // // //                   active={false}
// // // // // //                 >
// // // // // //                   Trocar para dia
// // // // // //                 </QuickButton>
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => setFilters((f) => ({ ...f, search: "" }))}
// // // // // //                   active={false}
// // // // // //                 >
// // // // // //                   Limpar pesquisa
// // // // // //                 </QuickButton>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {filters.mode === "range" && (
// // // // // //             <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
// // // // // //               <div className="lg:col-span-2">
// // // // // //                 <label className="text-xs font-medium text-gray-600">Início</label>
// // // // // //                 <Input
// // // // // //                   type="date"
// // // // // //                   value={filters.startDate}
// // // // // //                   onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div className="lg:col-span-2">
// // // // // //                 <label className="text-xs font-medium text-gray-600">Fim</label>
// // // // // //                 <Input
// // // // // //                   type="date"
// // // // // //                   value={filters.endDate}
// // // // // //                   min={filters.startDate}
// // // // // //                   onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div className="lg:col-span-2 flex items-end gap-2">
// // // // // //                 <QuickButton onClick={() => setMode("day")} active={false}>
// // // // // //                   Hoje
// // // // // //                 </QuickButton>
// // // // // //                 <QuickButton onClick={() => setMode("month")} active={false}>
// // // // // //                   Este mês
// // // // // //                 </QuickButton>
// // // // // //                 <QuickButton
// // // // // //                   onClick={() => setFilters((f) => ({ ...f, search: "" }))}
// // // // // //                   active={false}
// // // // // //                 >
// // // // // //                   Limpar pesquisa
// // // // // //                 </QuickButton>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {/* Linha 3: Ações */}
// // // // // //           <div className="flex flex-wrap items-center gap-2 justify-between">
// // // // // //             <div className="text-xs text-gray-500">
// // // // // //               Período atual:&nbsp;
// // // // // //               <strong>
// // // // // //                 {filters.mode === "day" && filters.date}
// // // // // //                 {filters.mode === "month" && filters.month}
// // // // // //                 {filters.mode === "range" && `${filters.startDate} a ${filters.endDate}`}
// // // // // //               </strong>
// // // // // //             </div>

// // // // // //             <div className="flex gap-2">
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={exportCSV}
// // // // // //                 disabled={isExporting || products.length === 0}
// // // // // //                 className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm text-gray-700 border-gray-300 disabled:opacity-60"
// // // // // //               >
// // // // // //                 Exportar CSV
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => {
// // // // // //                   setFilters({
// // // // // //                     mode: "day",
// // // // // //                     date: today(),
// // // // // //                     month: thisMonth(),
// // // // // //                     startDate: today(),
// // // // // //                     endDate: today(),
// // // // // //                     search: "",
// // // // // //                     sortBy: "totalRevenue",
// // // // // //                     sortDir: "desc",
// // // // // //                   })
// // // // // //                 }}
// // // // // //                 className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm text-gray-700 border-gray-300"
// // // // // //               >
// // // // // //                 Resetar filtros
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </Card>

// // // // // //       {/* =====================
// // // // // //           KPIs (HOJE / MÊS)
// // // // // //          ===================== */}
// // // // // //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// // // // // //         <Card title="Vendas do Dia (R$)">
// // // // // //           <div className="text-2xl font-semibold">{formatCurrency(kpiDayTotal)}</div>
// // // // // //           {dayOrders != null && (
// // // // // //             <div className="text-xs text-gray-500 mt-1">Pedidos: {dayOrders}</div>
// // // // // //           )}
// // // // // //         </Card>

// // // // // //         <Card title="Vendas do Mês (R$)">
// // // // // //           <div className="text-2xl font-semibold">{formatCurrency(kpiMonthTotal)}</div>
// // // // // //           {monthOrders != null && (
// // // // // //             <div className="text-xs text-gray-500 mt-1">Pedidos: {monthOrders}</div>
// // // // // //           )}
// // // // // //         </Card>

// // // // // //         <Card title="Ticket Médio (Dia)">
// // // // // //           <div className="text-2xl font-semibold">
// // // // // //             {dayOrders && dayOrders > 0 ? formatCurrency(kpiDayTotal / dayOrders) : "—"}
// // // // // //           </div>
// // // // // //         </Card>

// // // // // //         <Card title="Ticket Médio (Mês)">
// // // // // //           <div className="text-2xl font-semibold">
// // // // // //             {monthOrders && monthOrders > 0 ? formatCurrency(kpiMonthTotal / monthOrders) : "—"}
// // // // // //           </div>
// // // // // //         </Card>
// // // // // //       </div>

// // // // // //       {/* =====================
// // // // // //           GRÁFICOS
// // // // // //          ===================== */}
// // // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// // // // // //         <Card title="Vendas Diárias (Últimos 7 dias)">
// // // // // //           <div className="h-80">
// // // // // //             <Bar data={dailySalesChartData} options={chartOptions} />
// // // // // //           </div>
// // // // // //         </Card>

// // // // // //         <Card title="Vendas Mensais (Últimos 6 meses)">
// // // // // //           <div className="h-80">
// // // // // //             <Bar data={monthlySalesChartData} options={chartOptions} />
// // // // // //           </div>
// // // // // //         </Card>
// // // // // //       </div>

// // // // // //       {/* =====================
// // // // // //           TABELA DE PRODUTOS VENDIDOS (PERÍODO)
// // // // // //          ===================== */}
// // // // // //       <Card title="Produtos Vendidos (de acordo com o filtro)">
// // // // // //         <div className="overflow-x-auto">
// // // // // //           <table className="table w-full">
// // // // // //             <thead>
// // // // // //               <tr>
// // // // // //                 <th className="table-header cursor-pointer" onClick={headerSort("name")}>Produto</th>
// // // // // //                 <th className="table-header cursor-pointer" onClick={headerSort("brand")}>Marca</th>
// // // // // //                 <th className="table-header text-right cursor-pointer" onClick={headerSort("totalSold")}>Qtd. Vendida</th>
// // // // // //                 <th className="table-header text-right cursor-pointer" onClick={headerSort("totalRevenue")}>Faturamento</th>
// // // // // //                 <th className="table-header text-right cursor-pointer" onClick={headerSort("percentage")}>% do Total</th>
// // // // // //                 <th className="table-header">Última Venda</th>
// // // // // //               </tr>
// // // // // //             </thead>
// // // // // //             <tbody>
// // // // // //               {products.length > 0 ? (
// // // // // //                 products.map((product) => (
// // // // // //                   <tr key={product.id} className="hover:bg-gray-50">
// // // // // //                     <td className="table-cell text-gray-800 text-sm font-medium">{product.name}</td>
// // // // // //                     <td className="table-cell text-gray-600 text-sm">{product.brand}</td>
// // // // // //                     <td className="table-cell text-right text-gray-800 text-sm">{product.totalSold}</td>
// // // // // //                     <td className="table-cell text-right text-gray-800 text-sm">{formatCurrency(product.totalRevenue)}</td>
// // // // // //                     <td className="table-cell text-right text-gray-800 text-sm">{Number(product.percentageOfTotal ?? 0).toFixed(2)}%</td>
// // // // // //                     <td className="table-cell text-gray-600 text-sm">{product.lastSoldAt ? new Date(product.lastSoldAt).toLocaleString() : "—"}</td>
// // // // // //                   </tr>
// // // // // //                 ))
// // // // // //               ) : (
// // // // // //                 <tr>
// // // // // //                   <td colSpan="6" className="table-cell text-center py-8 text-gray-500">
// // // // // //                     Nenhuma venda registrada para o período selecionado
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               )}
// // // // // //             </tbody>
// // // // // //           </table>
// // // // // //         </div>

// // // // // //         {/* Rodapé da tabela com totais */}
// // // // // //         <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
// // // // // //           <div className="text-gray-600">
// // // // // //             Itens listados: <strong>{products.length}</strong>
// // // // // //           </div>
// // // // // //           <div className="text-gray-800">
// // // // // //             Faturamento no período: <strong>{formatCurrency(revenueTotal)}</strong>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </Card>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default Reports



// // // // // import { useState, useEffect, useMemo } from "react"
// // // // // import { Bar } from "react-chartjs-2"
// // // // // import {
// // // // //   Chart,
// // // // //   CategoryScale,
// // // // //   LinearScale,
// // // // //   BarElement,
// // // // //   Title,
// // // // //   Tooltip,
// // // // //   Legend,
// // // // // } from "chart.js"
// // // // // import PageHeader from "../components/PageHeader"
// // // // // import Card from "../components/Card"
// // // // // import { formatCurrency } from "../utils/format"
// // // // // import { fetchReports } from "../services/api"

// // // // // // =====================
// // // // // // Chart.js Registration
// // // // // // =====================
// // // // // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// // // // // // =====================
// // // // // // Utils
// // // // // // =====================
// // // // // const pad = (n) => String(n).padStart(2, "0")
// // // // // const today = () => {
// // // // //   const d = new Date()
// // // // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
// // // // // }
// // // // // const thisMonth = () => {
// // // // //   const d = new Date()
// // // // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` // YYYY-MM
// // // // // }
// // // // // const startOfMonth = (ym) => {
// // // // //   const [y, m] = ym.split("-").map(Number)
// // // // //   return `${y}-${pad(m)}-01`
// // // // // }
// // // // // const endOfMonth = (ym) => {
// // // // //   const [y, m] = ym.split("-").map(Number)
// // // // //   const last = new Date(y, m, 0).getDate()
// // // // //   return `${y}-${pad(m)}-${pad(last)}`
// // // // // }
// // // // // const toISODateTime = (date, endOfDay = false) =>
// // // // //   endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`

// // // // // // =====================
// // // // // // Small UI primitives (proporções consistentes)
// // // // // // =====================
// // // // // const QuickButton = ({ children, onClick, active }) => (
// // // // //   <button
// // // // //     type="button"
// // // // //     onClick={onClick}
// // // // //     className={`h-11 px-3 rounded-xl border shadow-sm text-sm transition ${
// // // // //       active
// // // // //         ? "bg-blue-600 text-white border-blue-600 shadow"
// // // // //         : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
// // // // //     }`}
// // // // //   >
// // // // //     {children}
// // // // //   </button>
// // // // // )

// // // // // const Input = ({ className = "", ...props }) => (
// // // // //   <input
// // // // //     className={`w-full h-11 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm placeholder:text-gray-400 border-gray-200 ${className}`}
// // // // //     {...props}
// // // // //   />
// // // // // )

// // // // // const Select = ({ className = "", ...props }) => (
// // // // //   <select
// // // // //     className={`w-full h-11 px-3 border rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm border-gray-200 ${className}`}
// // // // //     {...props}
// // // // //   />
// // // // // )

// // // // // // =====================
// // // // // // KPIs helper
// // // // // // =====================
// // // // // const computeKPIs = (reportData, currentDayStr, currentMonthStr) => {
// // // // //   const daily = reportData?.dailySales ?? []
// // // // //   const monthly = reportData?.monthlySales ?? []

// // // // //   const kpiDayTotal = daily.find((d) => d.date === currentDayStr)?.total ?? 0
// // // // //   const kpiMonthTotal = (() => {
// // // // //     const m1 = monthly.find((m) => m.month === currentMonthStr)?.total
// // // // //     if (typeof m1 === "number") return m1
// // // // //     const [y, m] = currentMonthStr.split("-")
// // // // //     const byPrefix = monthly.find((mm) => String(mm.month).includes(`${y}-${m}`))?.total
// // // // //     return byPrefix ?? 0
// // // // //   })()

// // // // //   const dayOrders = reportData?.todayOrdersCount ?? null
// // // // //   const monthOrders = reportData?.monthOrdersCount ?? null

// // // // //   return { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders }
// // // // // }

// // // // // const Reports = () => {
// // // // //   // =====================
// // // // //   // Filters State
// // // // //   // =====================
// // // // //   const [filters, setFilters] = useState({
// // // // //     mode: "day", // 'day' | 'month' | 'range'
// // // // //     date: today(),
// // // // //     month: thisMonth(), // YYYY-MM
// // // // //     startDate: today(),
// // // // //     endDate: today(),
// // // // //     search: "",
// // // // //     sortBy: "totalRevenue",
// // // // //     sortDir: "desc",
// // // // //   })

// // // // //   // =====================
// // // // //   // Data State
// // // // //   // =====================
// // // // //   const [reportData, setReportData] = useState({
// // // // //     dailySales: [],
// // // // //     monthlySales: [],
// // // // //     topProducts: [],
// // // // //     products: [],
// // // // //   })
// // // // //   const [isLoading, setIsLoading] = useState(true)
// // // // //   const [isExporting, setIsExporting] = useState(false)

// // // // //   // =====================
// // // // //   // Fetching
// // // // //   // =====================
// // // // //   const buildParams = () => {
// // // // //     if (filters.mode === "day") {
// // // // //       const from = toISODateTime(filters.date)
// // // // //       const to = toISODateTime(filters.date, true)
// // // // //       return { from, to, search: filters.search, groupBy: "product" }
// // // // //     }
// // // // //     if (filters.mode === "month") {
// // // // //       const from = toISODateTime(startOfMonth(filters.month))
// // // // //       const to = toISODateTime(endOfMonth(filters.month), true)
// // // // //       return { from, to, search: filters.search, groupBy: "product" }
// // // // //     }
// // // // //     const from = toISODateTime(filters.startDate)
// // // // //     const to = toISODateTime(filters.endDate, true)
// // // // //     return { from, to, search: filters.search, groupBy: "product" }
// // // // //   }

// // // // //   const loadReportData = async () => {
// // // // //     try {
// // // // //       setIsLoading(true)
// // // // //       const params = buildParams()
// // // // //       const data = await fetchReports(params)
// // // // //       setReportData(data)
// // // // //     } catch (error) {
// // // // //       console.error("Error loading report data:", error)
// // // // //     } finally {
// // // // //       setIsLoading(false)
// // // // //     }
// // // // //   }

// // // // //   useEffect(() => {
// // // // //     loadReportData()
// // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // //   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, filters.search])

// // // // //   // =====================
// // // // //   // Derived Data
// // // // //   // =====================
// // // // //   const { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders } = useMemo(
// // // // //     () => computeKPIs(reportData, filters.date, filters.month),
// // // // //     [reportData, filters.date, filters.month]
// // // // //   )

// // // // //   // products normalization
// // // // //   const normalizeProducts = (data) => {
// // // // //     if (!Array.isArray(data)) return []
// // // // //     return data.map((p, idx) => ({
// // // // //       id: p.id ?? idx,
// // // // //       name: p.name ?? p.productName ?? "—",
// // // // //       brand: p.brand ?? p.marca ?? "—",
// // // // //       totalSold: Number(p.totalSold ?? p.quantity ?? 0),
// // // // //       totalRevenue: Number(p.totalRevenue ?? p.revenue ?? 0),
// // // // //       percentageOfTotal: p.percentageOfTotal != null ? Number(p.percentageOfTotal) : null,
// // // // //       lastSoldAt: p.lastSoldAt ?? p.lastSaleAt ?? null,
// // // // //     }))
// // // // //   }

// // // // //   const allProductsRaw = useMemo(() => {
// // // // //     const base = reportData.products?.length ? reportData.products : reportData.topProducts
// // // // //     return normalizeProducts(base)
// // // // //   }, [reportData])

// // // // //   const revenueTotal = useMemo(
// // // // //     () => allProductsRaw.reduce((acc, p) => acc + Number(p.totalRevenue || 0), 0),
// // // // //     [allProductsRaw]
// // // // //   )

// // // // //   const products = useMemo(() => {
// // // // //     const term = filters.search.trim().toLowerCase()
// // // // //     let arr = allProductsRaw
// // // // //       .map((p) => ({
// // // // //         ...p,
// // // // //         percentageOfTotal:
// // // // //           revenueTotal > 0
// // // // //             ? Number(((Number(p.totalRevenue || 0) / revenueTotal) * 100).toFixed(2))
// // // // //             : 0,
// // // // //       }))
// // // // //       .filter((p) => (term ? `${p.name} ${p.brand}`.toLowerCase().includes(term) : true))

// // // // //     const dir = filters.sortDir === "asc" ? 1 : -1
// // // // //     const sb = filters.sortBy
// // // // //     arr.sort((a, b) => {
// // // // //       if (sb === "name" || sb === "brand") {
// // // // //         return a[sb].localeCompare(b[sb]) * dir
// // // // //       }
// // // // //       return ((a[sb] ?? 0) - (b[sb] ?? 0)) * dir
// // // // //     })

// // // // //     return arr
// // // // //   }, [allProductsRaw, filters.search, filters.sortBy, filters.sortDir, revenueTotal])

// // // // //   // =====================
// // // // //   // Charts
// // // // //   // =====================
// // // // //   const dailySalesChartData = {
// // // // //     labels: (reportData.dailySales ?? []).map((item) => item.date),
// // // // //     datasets: [
// // // // //       {
// // // // //         label: "Vendas Diárias (R$)",
// // // // //         data: (reportData.dailySales ?? []).map((item) => item.total),
// // // // //         backgroundColor: "rgba(59, 130, 246, 0.5)",
// // // // //         borderColor: "rgb(59, 130, 246)",
// // // // //         borderWidth: 1,
// // // // //       },
// // // // //     ],
// // // // //   }

// // // // //   const monthlySalesChartData = {
// // // // //     labels: (reportData.monthlySales ?? []).map((item) => item.month),
// // // // //     datasets: [
// // // // //       {
// // // // //         label: "Vendas Mensais (R$)",
// // // // //         data: (reportData.monthlySales ?? []).map((item) => item.total),
// // // // //         backgroundColor: "rgba(16, 185, 129, 0.5)",
// // // // //         borderColor: "rgb(16, 185, 129)",
// // // // //         borderWidth: 1,
// // // // //       },
// // // // //     ],
// // // // //   }

// // // // //   const chartOptions = {
// // // // //     responsive: true,
// // // // //     plugins: {
// // // // //       legend: { position: "top" },
// // // // //       title: { display: false },
// // // // //       tooltip: { mode: "index", intersect: false },
// // // // //     },
// // // // //     scales: {
// // // // //       y: { beginAtZero: true },
// // // // //       x: { ticks: { autoSkip: true, maxRotation: 0 } },
// // // // //     },
// // // // //   }

// // // // //   // =====================
// // // // //   // Handlers
// // // // //   // =====================
// // // // //   const setMode = (mode) => setFilters((f) => ({ ...f, mode }))

// // // // //   const exportCSV = async () => {
// // // // //     try {
// // // // //       setIsExporting(true)
// // // // //       const headers = ["Produto", "Marca", "QtdVendida", "Faturamento", "%DoTotal", "UltimaVenda"]
// // // // //       const csvRows = [headers.join(",")]
// // // // //       products.forEach((p) => {
// // // // //         csvRows.push([
// // // // //           `"${(p.name ?? "").replaceAll('"', '""')}"`,
// // // // //           `"${(p.brand ?? "").replaceAll('"', '""')}"`,
// // // // //           p.totalSold,
// // // // //           p.totalRevenue,
// // // // //           p.percentageOfTotal,
// // // // //           p.lastSoldAt ? `"${p.lastSoldAt}"` : "",
// // // // //         ].join(","))
// // // // //       })
// // // // //       const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
// // // // //       const url = URL.createObjectURL(blob)
// // // // //       const a = document.createElement("a")
// // // // //       a.href = url
// // // // //       const when = (() => {
// // // // //         if (filters.mode === "day") return filters.date
// // // // //         if (filters.mode === "month") return filters.month
// // // // //         return `${filters.startDate}_a_${filters.endDate}`
// // // // //       })()
// // // // //       a.download = `produtos_${filters.mode}_${when}.csv`
// // // // //       document.body.appendChild(a)
// // // // //       a.click()
// // // // //       a.remove()
// // // // //       URL.revokeObjectURL(url)
// // // // //     } catch (e) {
// // // // //       console.error("Erro ao exportar CSV:", e)
// // // // //     } finally {
// // // // //       setIsExporting(false)
// // // // //     }
// // // // //   }

// // // // //   const headerSort = (col) => () => {
// // // // //     setFilters((f) => ({
// // // // //       ...f,
// // // // //       sortBy: col,
// // // // //       sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc",
// // // // //     }))
// // // // //   }

// // // // //   // =====================
// // // // //   // Render
// // // // //   // =====================
// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <div className="flex flex-col gap-2 justify-center items-center h-full text-gray-600">
// // // // //         <span className="animate-pulse">Carregando relatórios…</span>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       <PageHeader title="Relatórios" />

// // // // //       {/* =====================
// // // // //           FILTROS / BARRA DE CONTROLE (UX/UI aprimorado)
// // // // //          ===================== */}
// // // // //       <Card title="Filtros & Pesquisa">
// // // // //         <div className="flex flex-col gap-4">
// // // // //           {/* Linha 1: Granularidade + Pesquisa (proporções fixas em 12 colunas) */}
// // // // //           <div className="grid grid-cols-12 gap-3">
// // // // //             <div className="md:col-span-4 lg:col-span-3">
// // // // //               <label className="text-xs font-medium text-gray-600">Granularidade</label>
// // // // //               <Select aria-label="Selecionar granularidade" value={filters.mode} onChange={(e) => setMode(e.target.value)}>
// // // // //                 <option value="day">Por dia</option>
// // // // //                 <option value="month">Por mês</option>
// // // // //                 <option value="range">Por período</option>
// // // // //               </Select>
// // // // //             </div>

// // // // //             <div className="md:col-span-8 lg:col-span-9 min-w-0">
// // // // //               <label className="text-xs font-medium text-gray-600">Barra de pesquisa (produto / marca)</label>
// // // // //               <div className="relative">
// // // // //                 <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
// // // // //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
// // // // //                 </span>
// // // // //                 <Input
// // // // //                   aria-label="Pesquisar por produto ou marca"
// // // // //                   className="pl-10"
// // // // //                   placeholder="Ex.: Multimidia, positron"
// // // // //                   value={filters.search}
// // // // //                   onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Linha 2: Seletores condicionais, sempre com alturas iguais e colunas coerentes */}
// // // // //           {filters.mode === "day" && (
// // // // //             <div className="grid grid-cols-12 gap-3">
// // // // //               <div className="md:col-span-4 lg:col-span-3">
// // // // //                 <label className="text-xs font-medium text-gray-600">Escolha o dia</label>
// // // // //                 <Input
// // // // //                   type="date"
// // // // //                   aria-label="Selecionar dia"
// // // // //                   value={filters.date}
// // // // //                   onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
// // // // //                 />
// // // // //               </div>
// // // // //               <div className="md:col-span-8 lg:col-span-9 flex items-end gap-2 flex-wrap">
// // // // //                 <QuickButton onClick={() => setFilters((f) => ({ ...f, date: today() }))} active={filters.date === today()}>
// // // // //                   Hoje
// // // // //                 </QuickButton>
// // // // //                 <QuickButton onClick={() => { setMode("month"); setFilters((f) => ({ ...f, month: thisMonth() })) }}>
// // // // //                   Este mês
// // // // //                 </QuickButton>
// // // // //                 <QuickButton onClick={() => setFilters((f) => ({ ...f, search: "" }))}>
// // // // //                   Limpar pesquisa
// // // // //                 </QuickButton>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}

// // // // //           {filters.mode === "month" && (
// // // // //             <div className="grid grid-cols-12 gap-3">
// // // // //               <div className="md:col-span-4 lg:col-span-3">
// // // // //                 <label className="text-xs font-medium text-gray-600">Escolha o mês</label>
// // // // //                 <Input
// // // // //                   type="month"
// // // // //                   aria-label="Selecionar mês"
// // // // //                   value={filters.month}
// // // // //                   onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
// // // // //                 />
// // // // //               </div>
// // // // //               <div className="md:col-span-8 lg:col-span-9 flex items-end gap-2 flex-wrap">
// // // // //                 <QuickButton onClick={() => setFilters((f) => ({ ...f, month: thisMonth() }))} active={filters.month === thisMonth()}>
// // // // //                   Mês atual
// // // // //                 </QuickButton>
// // // // //                 <QuickButton onClick={() => setMode("day")}>Trocar para dia</QuickButton>
// // // // //                 <QuickButton onClick={() => setFilters((f) => ({ ...f, search: "" }))}>Limpar pesquisa</QuickButton>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}

// // // // //           {filters.mode === "range" && (
// // // // //             <div className="grid grid-cols-12 gap-3">
// // // // //               <div className="md:col-span-4 lg:col-span-3">
// // // // //                 <label className="text-xs font-medium text-gray-600">Início</label>
// // // // //                 <Input type="date" aria-label="Data inicial" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
// // // // //               </div>
// // // // //               <div className="md:col-span-4 lg:col-span-3">
// // // // //                 <label className="text-xs font-medium text-gray-600">Fim</label>
// // // // //                 <Input type="date" aria-label="Data final" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
// // // // //               </div>
// // // // //               <div className="md:col-span-4 lg:col-span-6 flex items-end gap-2 flex-wrap">
// // // // //                 <QuickButton onClick={() => setMode("day")}>Hoje</QuickButton>
// // // // //                 <QuickButton onClick={() => setMode("month")}>Este mês</QuickButton>
// // // // //                 <QuickButton onClick={() => setFilters((f) => ({ ...f, search: "" }))}>Limpar pesquisa</QuickButton>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Linha 3: Ações alinhadas e com mesma altura */}
// // // // //           <div className="flex flex-wrap items-center gap-2 justify-between">
// // // // //             <div className="text-sm text-gray-500">
// // // // //               Período atual:&nbsp;
// // // // //               <strong>
// // // // //                 {filters.mode === "day" && filters.date}
// // // // //                 {filters.mode === "month" && filters.month}
// // // // //                 {filters.mode === "range" && `${filters.startDate} a ${filters.endDate}`}
// // // // //               </strong>
// // // // //             </div>

// // // // //             <div className="flex gap-2">
// // // // //               <button
// // // // //                 type="button"
// // // // //                 onClick={exportCSV}
// // // // //                 disabled={isExporting || products.length === 0}
// // // // //                 className="h-11 px-4 rounded-xl border bg-white hover:bg-gray-50 text-sm text-gray-700 border-gray-200 shadow-sm disabled:opacity-60"
// // // // //               >
// // // // //                 Exportar CSV
// // // // //               </button>
// // // // //               <button
// // // // //                 type="button"
// // // // //                 onClick={() => {
// // // // //                   setFilters({
// // // // //                     mode: "day",
// // // // //                     date: today(),
// // // // //                     month: thisMonth(),
// // // // //                     startDate: today(),
// // // // //                     endDate: today(),
// // // // //                     search: "",
// // // // //                     sortBy: "totalRevenue",
// // // // //                     sortDir: "desc",
// // // // //                   })
// // // // //                 }}
// // // // //                 className="h-11 px-4 rounded-xl border bg-white hover:bg-gray-50 text-sm text-gray-700 border-gray-200 shadow-sm"
// // // // //               >
// // // // //                 Resetar filtros
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </Card>

// // // // //       {/* =====================
// // // // //           KPIs (HOJE / MÊS)
// // // // //          ===================== */}
// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// // // // //         <Card title="Vendas do Dia (R$)">
// // // // //           <div className="text-2xl font-semibold">{formatCurrency(kpiDayTotal)}</div>
// // // // //           {dayOrders != null && (
// // // // //             <div className="text-xs text-gray-500 mt-1">Pedidos: {dayOrders}</div>
// // // // //           )}
// // // // //         </Card>

// // // // //         <Card title="Vendas do Mês (R$)">
// // // // //           <div className="text-2xl font-semibold">{formatCurrency(kpiMonthTotal)}</div>
// // // // //           {monthOrders != null && (
// // // // //             <div className="text-xs text-gray-500 mt-1">Pedidos: {monthOrders}</div>
// // // // //           )}
// // // // //         </Card>

// // // // //         <Card title="Ticket Médio (Dia)">
// // // // //           <div className="text-2xl font-semibold">
// // // // //             {dayOrders && dayOrders > 0 ? formatCurrency(kpiDayTotal / dayOrders) : "—"}
// // // // //           </div>
// // // // //         </Card>

// // // // //         <Card title="Ticket Médio (Mês)">
// // // // //           <div className="text-2xl font-semibold">
// // // // //             {monthOrders && monthOrders > 0 ? formatCurrency(kpiMonthTotal / monthOrders) : "—"}
// // // // //           </div>
// // // // //         </Card>
// // // // //       </div>

// // // // //       {/* =====================
// // // // //           GRÁFICOS
// // // // //          ===================== */}
// // // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// // // // //         <Card title="Vendas Diárias (Últimos 7 dias)">
// // // // //           <div className="h-80">
// // // // //             <Bar data={dailySalesChartData} options={chartOptions} />
// // // // //           </div>
// // // // //         </Card>

// // // // //         <Card title="Vendas Mensais (Últimos 6 meses)">
// // // // //           <div className="h-80">
// // // // //             <Bar data={monthlySalesChartData} options={chartOptions} />
// // // // //           </div>
// // // // //         </Card>
// // // // //       </div>

// // // // //       {/* =====================
// // // // //           TABELA DE PRODUTOS VENDIDOS (PERÍODO)
// // // // //          ===================== */}
// // // // //       <Card title="Produtos Vendidos (de acordo com o filtro)">
// // // // //         <div className="overflow-x-auto">
// // // // //           <table className="table w-full">
// // // // //             <thead>
// // // // //               <tr>
// // // // //                 <th className="table-header cursor-pointer" onClick={headerSort("name")}>Produto</th>
// // // // //                 <th className="table-header cursor-pointer" onClick={headerSort("brand")}>Marca</th>
// // // // //                 <th className="table-header text-right cursor-pointer" onClick={headerSort("totalSold")}>Qtd. Vendida</th>
// // // // //                 <th className="table-header text-right cursor-pointer" onClick={headerSort("totalRevenue")}>Faturamento</th>
// // // // //                 <th className="table-header text-right cursor-pointer" onClick={headerSort("percentage")}>% do Total</th>
// // // // //                 <th className="table-header">Última Venda</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {products.length > 0 ? (
// // // // //                 products.map((product) => (
// // // // //                   <tr key={product.id} className="hover:bg-gray-50">
// // // // //                     <td className="table-cell text-gray-800 text-sm font-medium">{product.name}</td>
// // // // //                     <td className="table-cell text-gray-600 text-sm">{product.brand}</td>
// // // // //                     <td className="table-cell text-right text-gray-800 text-sm">{product.totalSold}</td>
// // // // //                     <td className="table-cell text-right text-gray-800 text-sm">{formatCurrency(product.totalRevenue)}</td>
// // // // //                     <td className="table-cell text-right text-gray-800 text-sm">{Number(product.percentageOfTotal ?? 0).toFixed(2)}%</td>
// // // // //                     <td className="table-cell text-gray-600 text-sm">{product.lastSoldAt ? new Date(product.lastSoldAt).toLocaleString() : "—"}</td>
// // // // //                   </tr>
// // // // //                 ))
// // // // //               ) : (
// // // // //                 <tr>
// // // // //                   <td colSpan="6" className="table-cell text-center py-8 text-gray-500">
// // // // //                     Nenhuma venda registrada para o período selecionado
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               )}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>

// // // // //         {/* Rodapé da tabela com totais */}
// // // // //         <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
// // // // //           <div className="text-gray-600">
// // // // //             Itens listados: <strong>{products.length}</strong>
// // // // //           </div>
// // // // //           <div className="text-gray-800">
// // // // //             Faturamento no período: <strong>{formatCurrency(revenueTotal)}</strong>
// // // // //           </div>
// // // // //         </div>
// // // // //       </Card>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default Reports



// // // // import { useState, useEffect, useMemo } from "react"
// // // // import { Bar } from "react-chartjs-2"
// // // // import {
// // // //   Chart,
// // // //   CategoryScale,
// // // //   LinearScale,
// // // //   BarElement,
// // // //   Title,
// // // //   Tooltip,
// // // //   Legend,
// // // // } from "chart.js"
// // // // import PageHeader from "../components/PageHeader"
// // // // import Card from "../components/Card"
// // // // import { formatCurrency } from "../utils/format"
// // // // import { fetchReports } from "../services/api"

// // // // // =====================
// // // // // Chart.js Registration
// // // // // =====================
// // // // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// // // // // =====================
// // // // // Utils
// // // // // =====================
// // // // const pad = (n) => String(n).padStart(2, "0")
// // // // const today = () => {
// // // //   const d = new Date()
// // // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
// // // // }
// // // // const thisMonth = () => {
// // // //   const d = new Date()
// // // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` // YYYY-MM
// // // // }
// // // // const startOfMonth = (ym) => {
// // // //   const [y, m] = ym.split("-").map(Number)
// // // //   return `${y}-${pad(m)}-01`
// // // // }
// // // // const endOfMonth = (ym) => {
// // // //   const [y, m] = ym.split("-").map(Number)
// // // //   const last = new Date(y, m, 0).getDate()
// // // //   return `${y}-${pad(m)}-${pad(last)}`
// // // // }
// // // // const toISODateTime = (date, endOfDay = false) =>
// // // //   endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`

// // // // // =====================
// // // // // Debounce
// // // // // =====================
// // // // function useDebounce(value, delay = 350) {
// // // //   const [debounced, setDebounced] = useState(value)
// // // //   useEffect(() => {
// // // //     const id = setTimeout(() => setDebounced(value), delay)
// // // //     return () => clearTimeout(id)
// // // //   }, [value, delay])
// // // //   return debounced
// // // // }

// // // // // =====================
// // // // // Small UI primitives (proporções consistentes)
// // // // // =====================
// // // // const QuickButton = ({ children, onClick, active }) => (
// // // //   <button
// // // //     type="button"
// // // //     onClick={onClick}
// // // //     className={`h-11 px-3 rounded-xl border shadow-sm text-sm transition ${active
// // // //       ? "bg-gray-900 text-white border-gray-900 shadow"
// // // //       : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
// // // //       }`}
// // // //   >
// // // //     {children}
// // // //   </button>
// // // // )

// // // // const Input = ({ className = "", ...props }) => (
// // // //   <input
// // // //     className={`w-full h-11 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200 ${className}`}
// // // //     {...props}
// // // //   />
// // // // )

// // // // const Select = ({ className = "", ...props }) => (
// // // //   <select
// // // //     className={`w-full h-11 px-3 border rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm border-gray-200 ${className}`}
// // // //     {...props}
// // // //   />
// // // // )

// // // // // Ícone de busca
// // // // const SearchIcon = (props) => (
// // // //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// // // //     <circle cx="11" cy="11" r="7"></circle>
// // // //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// // // //   </svg>
// // // // )

// // // // // =====================
// // // // // KPIs helper
// // // // // =====================
// // // // const computeKPIs = (reportData, currentDayStr, currentMonthStr) => {
// // // //   const daily = reportData?.dailySales ?? []
// // // //   const monthly = reportData?.monthlySales ?? []

// // // //   const kpiDayTotal = daily.find((d) => d.date === currentDayStr)?.total ?? 0
// // // //   const kpiMonthTotal = (() => {
// // // //     const m1 = monthly.find((m) => m.month === currentMonthStr)?.total
// // // //     if (typeof m1 === "number") return m1
// // // //     const [y, m] = currentMonthStr.split("-")
// // // //     const byPrefix = monthly.find((mm) => String(mm.month).includes(`${y}-${m}`))?.total
// // // //     return byPrefix ?? 0
// // // //   })()

// // // //   const dayOrders = reportData?.todayOrdersCount ?? null
// // // //   const monthOrders = reportData?.monthOrdersCount ?? null

// // // //   return { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders }
// // // // }

// // // // const Reports = () => {
// // // //   // =====================
// // // //   // Filters State
// // // //   // =====================
// // // //   const [filters, setFilters] = useState({
// // // //     mode: "day", // 'day' | 'month' | 'range'
// // // //     date: today(),
// // // //     month: thisMonth(), // YYYY-MM
// // // //     startDate: today(),
// // // //     endDate: today(),
// // // //     search: "",
// // // //     sortBy: "totalRevenue",
// // // //     sortDir: "desc",
// // // //   })
// // // //   const debouncedSearch = useDebounce(filters.search, 350)

// // // //   // =====================
// // // //   // Data State
// // // //   // =====================
// // // //   const [reportData, setReportData] = useState({
// // // //     dailySales: [],
// // // //     monthlySales: [],
// // // //     topProducts: [],
// // // //     products: [],
// // // //   })
// // // //   const [isLoading, setIsLoading] = useState(true)
// // // //   const [isExporting, setIsExporting] = useState(false)

// // // //   // =====================
// // // //   // Fetching
// // // //   // =====================
// // // //   const buildParams = () => {
// // // //     const common = { search: debouncedSearch, groupBy: "product" }
// // // //     if (filters.mode === "day") {
// // // //       const from = toISODateTime(filters.date)
// // // //       const to = toISODateTime(filters.date, true)
// // // //       return { ...common, from, to }
// // // //     }
// // // //     if (filters.mode === "month") {
// // // //       const from = toISODateTime(startOfMonth(filters.month))
// // // //       const to = toISODateTime(endOfMonth(filters.month), true)
// // // //       return { ...common, from, to }
// // // //     }
// // // //     const from = toISODateTime(filters.startDate)
// // // //     const to = toISODateTime(filters.endDate, true)
// // // //     return { ...common, from, to }
// // // //   }

// // // //   const loadReportData = async () => {
// // // //     try {
// // // //       setIsLoading(true)
// // // //       const params = buildParams()
// // // //       const data = await fetchReports(params)
// // // //       setReportData(data)
// // // //     } catch (error) {
// // // //       console.error("Error loading report data:", error)
// // // //     } finally {
// // // //       setIsLoading(false)
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     loadReportData()
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, debouncedSearch])

// // // //   // =====================
// // // //   // Derived Data
// // // //   // =====================
// // // //   const { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders } = useMemo(
// // // //     () => computeKPIs(reportData, filters.date, filters.month),
// // // //     [reportData, filters.date, filters.month]
// // // //   )

// // // //   // products normalization
// // // //   const normalizeProducts = (data) => {
// // // //     if (!Array.isArray(data)) return []
// // // //     return data.map((p, idx) => ({
// // // //       id: p.id ?? idx,
// // // //       name: p.name ?? p.productName ?? "—",
// // // //       brand: p.brand ?? p.marca ?? "—",
// // // //       totalSold: Number(p.totalSold ?? p.quantity ?? 0),
// // // //       totalRevenue: Number(p.totalRevenue ?? p.revenue ?? 0),
// // // //       percentageOfTotal: p.percentageOfTotal != null ? Number(p.percentageOfTotal) : null,
// // // //       lastSoldAt: p.lastSoldAt ?? p.lastSaleAt ?? null,
// // // //     }))
// // // //   }

// // // //   const allProductsRaw = useMemo(() => {
// // // //     const base = reportData.products?.length ? reportData.products : reportData.topProducts
// // // //     return normalizeProducts(base)
// // // //   }, [reportData])

// // // //   const revenueTotal = useMemo(
// // // //     () => allProductsRaw.reduce((acc, p) => acc + Number(p.totalRevenue || 0), 0),
// // // //     [allProductsRaw]
// // // //   )

// // // //   const products = useMemo(() => {
// // // //     const term = debouncedSearch.trim().toLowerCase()
// // // //     let arr = allProductsRaw
// // // //       .map((p) => ({
// // // //         ...p,
// // // //         percentageOfTotal:
// // // //           revenueTotal > 0
// // // //             ? Number(((Number(p.totalRevenue || 0) / revenueTotal) * 100).toFixed(2))
// // // //             : 0,
// // // //       }))
// // // //       .filter((p) => (term ? `${p.name} ${p.brand}`.toLowerCase().includes(term) : true))

// // // //     const dir = filters.sortDir === "asc" ? 1 : -1
// // // //     const sb = filters.sortBy
// // // //     arr.sort((a, b) => {
// // // //       if (sb === "name" || sb === "brand") {
// // // //         return a[sb].localeCompare(b[sb]) * dir
// // // //       }
// // // //       return ((a[sb] ?? 0) - (b[sb] ?? 0)) * dir
// // // //     })

// // // //     return arr
// // // //   }, [allProductsRaw, debouncedSearch, filters.sortBy, filters.sortDir, revenueTotal])

// // // //   // =====================
// // // //   // Charts
// // // //   // =====================
// // // //   const dailySalesChartData = {
// // // //     labels: (reportData.dailySales ?? []).map((item) => item.date),
// // // //     datasets: [
// // // //       {
// // // //         label: "Vendas Diárias (R$)",
// // // //         data: (reportData.dailySales ?? []).map((item) => item.total),
// // // //         backgroundColor: "rgba(59, 130, 246, 0.5)",
// // // //         borderColor: "rgb(59, 130, 246)",
// // // //         borderWidth: 1,
// // // //       },
// // // //     ],
// // // //   }

// // // //   const monthlySalesChartData = {
// // // //     labels: (reportData.monthlySales ?? []).map((item) => item.month),
// // // //     datasets: [
// // // //       {
// // // //         label: "Vendas Mensais (R$)",
// // // //         data: (reportData.monthlySales ?? []).map((item) => item.total),
// // // //         backgroundColor: "rgba(16, 185, 129, 0.5)",
// // // //         borderColor: "rgb(16, 185, 129)",
// // // //         borderWidth: 1,
// // // //       },
// // // //     ],
// // // //   }

// // // //   const chartOptions = {
// // // //     responsive: true,
// // // //     plugins: {
// // // //       legend: { position: "top" },
// // // //       title: { display: false },
// // // //       tooltip: { mode: "index", intersect: false },
// // // //     },
// // // //     scales: {
// // // //       y: { beginAtZero: true },
// // // //       x: { ticks: { autoSkip: true, maxRotation: 0 } },
// // // //     },
// // // //   }

// // // //   // =====================
// // // //   // Handlers
// // // //   // =====================
// // // //   const setMode = (mode) => setFilters((f) => ({ ...f, mode }))

// // // //   const exportCSV = async () => {
// // // //     try {
// // // //       setIsExporting(true)
// // // //       const headers = ["Produto", "Marca", "QtdVendida", "Faturamento", "%DoTotal", "UltimaVenda"]
// // // //       const csvRows = [headers.join(",")]
// // // //       products.forEach((p) => {
// // // //         csvRows.push([
// // // //           `"${(p.name ?? "").replaceAll('"', '""')}"`,
// // // //           `"${(p.brand ?? "").replaceAll('"', '""')}"`,
// // // //           p.totalSold,
// // // //           p.totalRevenue,
// // // //           p.percentageOfTotal,
// // // //           p.lastSoldAt ? `"${p.lastSoldAt}"` : "",
// // // //         ].join(","))
// // // //       })
// // // //       const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
// // // //       const url = URL.createObjectURL(blob)
// // // //       const a = document.createElement("a")
// // // //       a.href = url
// // // //       const when = (() => {
// // // //         if (filters.mode === "day") return filters.date
// // // //         if (filters.mode === "month") return filters.month
// // // //         return `${filters.startDate}_a_${filters.endDate}`
// // // //       })()
// // // //       a.download = `produtos_${filters.mode}_${when}.csv`
// // // //       document.body.appendChild(a)
// // // //       a.click()
// // // //       a.remove()
// // // //       URL.revokeObjectURL(url)
// // // //     } catch (e) {
// // // //       console.error("Erro ao exportar CSV:", e)
// // // //     } finally {
// // // //       setIsExporting(false)
// // // //     }
// // // //   }

// // // //   const headerSort = (col) => () => {
// // // //     setFilters((f) => ({
// // // //       ...f,
// // // //       sortBy: col,
// // // //       sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc",
// // // //     }))
// // // //   }

// // // //   const SortLabel = ({ label, col }) => (
// // // //     <span className="inline-flex items-center gap-1 select-none">
// // // //       {label}
// // // //       {filters.sortBy === col && (
// // // //         <span className="text-gray-400">{filters.sortDir === "desc" ? "▼" : "▲"}</span>
// // // //       )}
// // // //     </span>
// // // //   )

// // // //   // =====================
// // // //   // Render
// // // //   // =====================
// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="flex flex-col gap-2 justify-center items-center h-64 text-gray-600">
// // // //         <span className="animate-pulse">Carregando relatórios…</span>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   const periodLabel =
// // // //     filters.mode === "day"
// // // //       ? filters.date
// // // //       : filters.mode === "month"
// // // //         ? filters.month
// // // //         : `${filters.startDate} a ${filters.endDate}`

// // // //   return (
// // // //     <div className="space-y-6 p-6">
// // // //       {/* Header padronizado */}
// // // //       <div className="mb-2">
// // // //         <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
// // // //         <p className="text-sm text-gray-500">Painel central de desempenho e vendas</p>
// // // //       </div>

// // // //       {/* Abas de granularidade + Toolbar */}
// // // //       <div className="">
// // // //         <div className="border-b border-gray-200">
// // // //           <nav className="-mb-px flex gap-6" aria-label="Tabs">
// // // //             {[{ k: "day", l: "Dia" }, { k: "month", l: "Mês" }, { k: "range", l: "Período" }].map(t => (
// // // //               <button
// // // //                 key={t.k}
// // // //                 onClick={() => setMode(t.k)}
// // // //                 className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${filters.mode === t.k
// // // //                   ? "border-gray-900 text-gray-900"
// // // //                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
// // // //                   }`}
// // // //               >{t.l}</button>
// // // //             ))}
// // // //           </nav>
// // // //         </div>

// // // //         <div className="py-4 ">
// // // //           {/* Linha 1: controles específicos */}
// // // //           {filters.mode === "day" && (
// // // //             <div className="flex flex-wrap items-end gap-3">
// // // //               <div className="w-44">
// // // //                 <label className="text-xs font-medium text-gray-600">Escolha o dia</label>
// // // //                 <Input type="date" value={filters.date} onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))} />
// // // //               </div>
// // // //               <QuickButton onClick={() => setFilters((f) => ({ ...f, date: today() }))} active={filters.date === today()}>Hoje</QuickButton>
// // // //               <QuickButton onClick={() => { setMode("month"); setFilters((f) => ({ ...f, month: thisMonth() })) }}>Este mês</QuickButton>
// // // //             </div>
// // // //           )}

// // // //           {filters.mode === "month" && (
// // // //             <div className="flex flex-wrap items-end gap-3">
// // // //               <div className="w-44">
// // // //                 <label className="text-xs font-medium text-gray-600">Escolha o mês</label>
// // // //                 <Input type="month" value={filters.month} onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))} />
// // // //               </div>
// // // //               <QuickButton onClick={() => setFilters((f) => ({ ...f, month: thisMonth() }))} active={filters.month === thisMonth()}>Mês atual</QuickButton>
// // // //               <QuickButton onClick={() => setMode("day")}>Trocar para dia</QuickButton>
// // // //             </div>
// // // //           )}

// // // //           {filters.mode === "range" && (
// // // //             <div className="flex flex-wrap items-end gap-3">
// // // //               <div className="w-44">
// // // //                 <label className="text-xs font-medium text-gray-600">Início</label>
// // // //                 <Input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
// // // //               </div>
// // // //               <div className="w-44">
// // // //                 <label className="text-xs font-medium text-gray-600">Fim</label>
// // // //                 <Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
// // // //               </div>
// // // //               <QuickButton onClick={() => setMode("day")}>Hoje</QuickButton>
// // // //               <QuickButton onClick={() => setMode("month")}>Este mês</QuickButton>
// // // //             </div>
// // // //           )}

// // // //           {/* Linha 2: busca + ações */}
// // // //           <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

// // // //             <div className="relative w-full sm:w-80">
// // // //               <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Buscar por produto, marca ou modelo"
// // // //                 className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// // // //                 value={filters.search}
// // // //                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
// // // //               />
// // // //             </div>

// // // //             <div className="flex items-center gap-2">
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={exportCSV}
// // // //                 disabled={isExporting || products.length === 0}
// // // //                 className="h-11 px-4 rounded-xl border bg-white hover:bg-gray-50 text-sm text-gray-700 border-gray-200 shadow-sm disabled:opacity-60"
// // // //               >
// // // //                 Exportar CSV
// // // //               </button>
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => {
// // // //                   setFilters({
// // // //                     mode: "day",
// // // //                     date: today(),
// // // //                     month: thisMonth(),
// // // //                     startDate: today(),
// // // //                     endDate: today(),
// // // //                     search: "",
// // // //                     sortBy: "totalRevenue",
// // // //                     sortDir: "desc",
// // // //                   })
// // // //                 }}
// // // //                 className="h-11 px-4 rounded-xl border bg-white hover:bg-gray-50 text-sm text-gray-700 border-gray-200 shadow-sm"
// // // //               >
// // // //                 Resetar filtros
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Linha 3: período atual */}
// // // //           <div className="mt-3 text-sm text-gray-500">Período atual: <strong>{periodLabel}</strong></div>
// // // //         </div>
// // // //       </div>

// // // //       {/* KPIs */}
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// // // //         <Card title="Vendas do Dia (R$)">
// // // //           <div className="text-2xl font-semibold">{formatCurrency(kpiDayTotal)}</div>
// // // //           {dayOrders != null && (
// // // //             <div className="text-xs text-gray-500 mt-1">Pedidos: {dayOrders}</div>
// // // //           )}
// // // //         </Card>

// // // //         <Card title="Vendas do Mês (R$)">
// // // //           <div className="text-2xl font-semibold">{formatCurrency(kpiMonthTotal)}</div>
// // // //           {monthOrders != null && (
// // // //             <div className="text-xs text-gray-500 mt-1">Pedidos: {monthOrders}</div>
// // // //           )}
// // // //         </Card>

// // // //         <Card title="Ticket Médio (Dia)">
// // // //           <div className="text-2xl font-semibold">
// // // //             {dayOrders && dayOrders > 0 ? formatCurrency(kpiDayTotal / dayOrders) : "—"}
// // // //           </div>
// // // //         </Card>

// // // //         <Card title="Ticket Médio (Mês)">
// // // //           <div className="text-2xl font-semibold">
// // // //             {monthOrders && monthOrders > 0 ? formatCurrency(kpiMonthTotal / monthOrders) : "—"}
// // // //           </div>
// // // //         </Card>
// // // //       </div>

// // // //       {/* Gráficos */}
// // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// // // //         <Card title="Vendas Diárias (Últimos 7 dias)">
// // // //           <div className="h-80">
// // // //             <Bar data={dailySalesChartData} options={chartOptions} />
// // // //           </div>
// // // //         </Card>

// // // //         <Card title="Vendas Mensais (Últimos 6 meses)">
// // // //           <div className="h-80">
// // // //             <Bar data={monthlySalesChartData} options={chartOptions} />
// // // //           </div>
// // // //         </Card>
// // // //       </div>

// // // //       {/* Tabela */}
// // // //       <div className="overflow-hidden rounded-lg bg-white shadow">
// // // //         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// // // //           <div>
// // // //             <h3 className="text-lg font-semibold text-gray-800">Produtos Vendidos</h3>
// // // //             <p className="text-sm text-gray-500">Conforme filtros aplicados</p>
// // // //           </div>
// // // //           <div className="text-right">
// // // //             <p className="text-sm text-gray-600">Faturamento no período</p>
// // // //             <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueTotal)}</p>
// // // //             <p className="text-xs text-gray-500">Itens listados: {products.length}</p>
// // // //           </div>
// // // //         </div>

// // // //         <div className="overflow-x-auto">
// // // //           <table className="min-w-full divide-y divide-gray-200">
// // // //             <thead className="bg-gray-50">
// // // //               <tr>
// // // //                 <th onClick={headerSort("name")} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Produto" col="name" /></th>
// // // //                 <th onClick={headerSort("brand")} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Marca" col="brand" /></th>
// // // //                 <th onClick={headerSort("totalSold")} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Qtd. Vendida" col="totalSold" /></th>
// // // //                 <th onClick={headerSort("totalRevenue")} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Faturamento" col="totalRevenue" /></th>
// // // //                 <th onClick={headerSort("percentageOfTotal")} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="% do Total" col="percentageOfTotal" /></th>
// // // //                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Última Venda</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody className="divide-y divide-gray-200 bg-white">
// // // //               {products.length > 0 ? (
// // // //                 products.map((product) => (
// // // //                   <tr key={product.id} className="hover:bg-gray-50">
// // // //                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
// // // //                     <td className="px-6 py-4 text-sm text-gray-700">{product.brand}</td>
// // // //                     <td className="px-6 py-4 text-sm text-gray-900 text-right">{product.totalSold}</td>
// // // //                     <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(product.totalRevenue)}</td>
// // // //                     <td className="px-6 py-4 text-sm text-gray-900 text-right">{Number(product.percentageOfTotal ?? 0).toFixed(2)}%</td>
// // // //                     <td className="px-6 py-4 text-sm text-gray-700">{product.lastSoldAt ? new Date(product.lastSoldAt).toLocaleString() : "—"}</td>
// // // //                   </tr>
// // // //                 ))
// // // //               ) : (
// // // //                 <tr>
// // // //                   <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Nenhuma venda registrada para o período selecionado</td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default Reports



// // // import { useState, useEffect, useMemo, useRef } from "react";
// // // import { Bar } from "react-chartjs-2";
// // // import {
// // //   Chart,
// // //   CategoryScale,
// // //   LinearScale,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend,
// // // } from "chart.js";
// // // import PageHeader from "../components/PageHeader";
// // // import Card from "../components/Card";
// // // import { formatCurrency } from "../utils/format";
// // // import { fetchReports } from "../services/api";

// // // // ===================== Chart.js
// // // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // // // ===================== Utils
// // // const pad = (n) => String(n).padStart(2, "0");
// // // const today = () => {
// // //   const d = new Date();
// // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// // // };
// // // const thisMonth = () => {
// // //   const d = new Date();
// // //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
// // // };
// // // const startOfMonth = (ym) => {
// // //   const [y, m] = ym.split("-").map(Number);
// // //   return `${y}-${pad(m)}-01`;
// // // };
// // // const endOfMonth = (ym) => {
// // //   const [y, m] = ym.split("-").map(Number);
// // //   const last = new Date(y, m, 0).getDate();
// // //   return `${y}-${pad(m)}-${pad(last)}`;
// // // };
// // // const toISODateTime = (date, endOfDay = false) =>
// // //   endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`;

// // // function useDebounce(value, delay = 350) {
// // //   const [debounced, setDebounced] = useState(value);
// // //   useEffect(() => {
// // //     const id = setTimeout(() => setDebounced(value), delay);
// // //     return () => clearTimeout(id);
// // //   }, [value, delay]);
// // //   return debounced;
// // // }

// // // // ===================== Base UI
// // // const Input = ({ className = "", ...props }) => (
// // //   <input
// // //     className={`w-full h-10 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200 ${className}`}
// // //     {...props}
// // //   />
// // // );
// // // const Select = ({ className = "", ...props }) => (
// // //   <select
// // //     className={`w-full h-10 px-3 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm border-gray-200 ${className}`}
// // //     {...props}
// // //   />
// // // );

// // // // Icons (inline, leves)
// // // const SearchIcon = (props) => (
// // //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// // //     <circle cx="11" cy="11" r="7"></circle>
// // //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// // //   </svg>
// // // );
// // // const ChevronDown = (props) => (
// // //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}><path d="M6 9l6 6 6-6"/></svg>
// // // );

// // // // ===================== Paginação (com reticências)
// // // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// // //   const pages = useMemo(() => {
// // //     if (totalPages <= 1) return [1];
// // //     const out = [];
// // //     const add = (p) => out.push(p);
// // //     const start = Math.max(2, currentPage - windowSize);
// // //     const end = Math.min(totalPages - 1, currentPage + windowSize);
// // //     add(1);
// // //     if (start > 2) add("…");
// // //     for (let p = start; p <= end; p++) add(p);
// // //     if (end < totalPages - 1) add("…");
// // //     if (totalPages > 1) add(totalPages);
// // //     return out;
// // //   }, [currentPage, totalPages, windowSize]);

// // //   return (
// // //     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
// // //       <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">«</button>
// // //       <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Anterior</button>
// // //       {pages.map((p, i) => (
// // //         <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
// // //       ))}
// // //       <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Próxima</button>
// // //       <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">»</button>
// // //     </nav>
// // //   );
// // // }

// // // // ===================== KPIs helper
// // // const computeKPIs = (reportData, currentDayStr, currentMonthStr) => {
// // //   const daily = reportData?.dailySales ?? [];
// // //   const monthly = reportData?.monthlySales ?? [];

// // //   const kpiDayTotal = daily.find((d) => d.date === currentDayStr)?.total ?? 0;
// // //   const kpiMonthTotal = (() => {
// // //     const m1 = monthly.find((m) => m.month === currentMonthStr)?.total;
// // //     if (typeof m1 === "number") return m1;
// // //     const [y, m] = currentMonthStr.split("-");
// // //     const byPrefix = monthly.find((mm) => String(mm.month).includes(`${y}-${m}`))?.total;
// // //     return byPrefix ?? 0;
// // //   })();

// // //   const dayOrders = reportData?.todayOrdersCount ?? null;
// // //   const monthOrders = reportData?.monthOrdersCount ?? null;

// // //   return { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders };
// // // };

// // // // ===================== Componente
// // // const Reports = () => {
// // //   // Filtros centrais
// // //   const [filters, setFilters] = useState({
// // //     mode: "day", // 'day' | 'month' | 'range'
// // //     date: today(),
// // //     month: thisMonth(),
// // //     startDate: today(),
// // //     endDate: today(),
// // //     search: "",
// // //     sortBy: "totalRevenue",
// // //     sortDir: "desc",
// // //     onlyWithSales: false,
// // //     topN: 0, // 0=todos
// // //     brands: [], // multi-seleção
// // //   });
// // //   const debouncedSearch = useDebounce(filters.search, 300);

// // //   // Dados
// // //   const [reportData, setReportData] = useState({
// // //     dailySales: [],
// // //     monthlySales: [],
// // //     topProducts: [],
// // //     products: [],
// // //   });
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [isExporting, setIsExporting] = useState(false);

// // //   // Busca/Fetch
// // //   const buildParams = () => {
// // //     const common = { search: debouncedSearch, groupBy: "product" };
// // //     if (filters.mode === "day") {
// // //       const from = toISODateTime(filters.date);
// // //       const to = toISODateTime(filters.date, true);
// // //       return { ...common, from, to };
// // //     }
// // //     if (filters.mode === "month") {
// // //       const from = toISODateTime(startOfMonth(filters.month));
// // //       const to = toISODateTime(endOfMonth(filters.month), true);
// // //       return { ...common, from, to };
// // //     }
// // //     const from = toISODateTime(filters.startDate);
// // //     const to = toISODateTime(filters.endDate, true);
// // //     return { ...common, from, to };
// // //   };

// // //   const loadReportData = async () => {
// // //     try {
// // //       setIsLoading(true);
// // //       const params = buildParams();
// // //       const data = await fetchReports(params);
// // //       setReportData(data);
// // //     } catch (error) {
// // //       console.error("Error loading report data:", error);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadReportData();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, debouncedSearch]);

// // //   // Derivados
// // //   const { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders } = useMemo(
// // //     () => computeKPIs(reportData, filters.date, filters.month),
// // //     [reportData, filters.date, filters.month]
// // //   );

// // //   const normalizeProducts = (data) => {
// // //     if (!Array.isArray(data)) return [];
// // //     return data.map((p, idx) => ({
// // //       id: p.id ?? idx,
// // //       name: p.name ?? p.productName ?? "—",
// // //       brand: p.brand ?? p.marca ?? "—",
// // //       totalSold: Number(p.totalSold ?? p.quantity ?? 0),
// // //       totalRevenue: Number(p.totalRevenue ?? p.revenue ?? 0),
// // //       percentageOfTotal: p.percentageOfTotal != null ? Number(p.percentageOfTotal) : null,
// // //       lastSoldAt: p.lastSoldAt ?? p.lastSaleAt ?? null,
// // //     }));
// // //   };

// // //   const allProductsRaw = useMemo(() => {
// // //     const base = reportData.products?.length ? reportData.products : reportData.topProducts;
// // //     return normalizeProducts(base);
// // //   }, [reportData]);

// // //   const allBrands = useMemo(() => {
// // //     const set = new Set(allProductsRaw.map((p) => (p.brand || "").trim()).filter(Boolean));
// // //     return Array.from(set).sort((a, b) => a.localeCompare(b));
// // //   }, [allProductsRaw]);

// // //   const revenueTotal = useMemo(
// // //     () => allProductsRaw.reduce((acc, p) => acc + Number(p.totalRevenue || 0), 0),
// // //     [allProductsRaw]
// // //   );

// // //   const productsBase = useMemo(() => {
// // //     const term = debouncedSearch.trim().toLowerCase();
// // //     let arr = allProductsRaw
// // //       .map((p) => ({
// // //         ...p,
// // //         percentageOfTotal:
// // //           revenueTotal > 0 ? Number(((Number(p.totalRevenue || 0) / revenueTotal) * 100).toFixed(2)) : 0,
// // //       }))
// // //       .filter((p) => (term ? `${p.name} ${p.brand}`.toLowerCase().includes(term) : true));

// // //     if (filters.onlyWithSales) arr = arr.filter((p) => Number(p.totalSold) > 0);
// // //     if (filters.brands.length) arr = arr.filter((p) => filters.brands.includes(p.brand));

// // //     // sort
// // //     const dir = filters.sortDir === "asc" ? 1 : -1;
// // //     const sb = filters.sortBy;
// // //     arr.sort((a, b) => {
// // //       if (sb === "name" || sb === "brand") return a[sb].localeCompare(b[sb]) * dir;
// // //       return ((a[sb] ?? 0) - (b[sb] ?? 0)) * dir;
// // //     });

// // //     if (filters.topN > 0) arr = arr.slice(0, filters.topN);
// // //     return arr;
// // //   }, [allProductsRaw, debouncedSearch, filters.sortBy, filters.sortDir, filters.onlyWithSales, filters.topN, filters.brands, revenueTotal]);

// // //   // Paginação
// // //   const [pageSize, setPageSize] = useState(10);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   useEffect(() => setCurrentPage(1), [productsBase, pageSize]);
// // //   const totalItems = productsBase.length;
// // //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// // //   const safePage = Math.min(Math.max(1, currentPage), totalPages);
// // //   const startIdx = (safePage - 1) * pageSize;
// // //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// // //   const products = productsBase.slice(startIdx, endIdx);

// // //   // Charts
// // //   const dailySalesChartData = {
// // //     labels: (reportData.dailySales ?? []).map((item) => item.date),
// // //     datasets: [
// // //       {
// // //         label: "Vendas Diárias (R$)",
// // //         data: (reportData.dailySales ?? []).map((item) => item.total),
// // //         backgroundColor: "rgba(59, 130, 246, 0.5)",
// // //         borderColor: "rgb(59, 130, 246)",
// // //         borderWidth: 1,
// // //       },
// // //     ],
// // //   };
// // //   const monthlySalesChartData = {
// // //     labels: (reportData.monthlySales ?? []).map((item) => item.month),
// // //     datasets: [
// // //       {
// // //         label: "Vendas Mensais (R$)",
// // //         data: (reportData.monthlySales ?? []).map((item) => item.total),
// // //         backgroundColor: "rgba(16, 185, 129, 0.5)",
// // //         borderColor: "rgb(16, 185, 129)",
// // //         borderWidth: 1,
// // //       },
// // //     ],
// // //   };
// // //   const chartOptions = {
// // //     responsive: true,
// // //     plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } },
// // //     scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } },
// // //   };

// // //   // Sort helpers
// // //   const headerSort = (col) => () =>
// // //     setFilters((f) => ({ ...f, sortBy: col, sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc" }));
// // //   const SortLabel = ({ label, col }) => (
// // //     <span className="inline-flex items-center gap-1 select-none">
// // //       {label}
// // //       {filters.sortBy === col && <span className="text-gray-400">{filters.sortDir === "desc" ? "▼" : "▲"}</span>}
// // //     </span>
// // //   );

// // //   // ===== Toolbar estilo imagem (sticky) =====
// // //   const [openDate, setOpenDate] = useState(false);
// // //   const [openFilter, setOpenFilter] = useState(false);
// // //   const dateBtnRef = useRef(null);
// // //   const filterBtnRef = useRef(null);
// // //   useEffect(() => {
// // //     const handler = (e) => {
// // //       if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false);
// // //       if (!filterBtnRef.current?.parentElement?.contains(e.target)) setOpenFilter(false);
// // //     };
// // //     document.addEventListener("click", handler);
// // //     return () => document.removeEventListener("click", handler);
// // //   }, []);

// // //   // Presets rápidos
// // //   const applyQuickRange = (days) => {
// // //     const end = new Date();
// // //     const start = new Date();
// // //     start.setDate(end.getDate() - (days - 1));
// // //     const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// // //     setFilters((f) => ({ ...f, mode: "range", startDate: fmt(start), endDate: fmt(end) }));
// // //     setOpenDate(false);
// // //   };
// // //   const setToToday = () => {
// // //     setFilters((f) => ({ ...f, mode: "day", date: today() }));
// // //     setOpenDate(false);
// // //   };
// // //   const setToThisMonth = () => {
// // //     setFilters((f) => ({ ...f, mode: "month", month: thisMonth() }));
// // //     setOpenDate(false);
// // //   };

// // //   // Atalho para busca
// // //   const searchRef = useRef(null);
// // //   useEffect(() => {
// // //     const onKey = (e) => {
// // //       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
// // //         e.preventDefault();
// // //         searchRef.current?.focus();
// // //       }
// // //     };
// // //     window.addEventListener("keydown", onKey);
// // //     return () => window.removeEventListener("keydown", onKey);
// // //   }, []);

// // //   // Loading
// // //   if (isLoading) {
// // //     return (
// // //       <div className="p-6">
// // //         <PageHeader title="Relatórios" />
// // //         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// // //           {[...Array(4)].map((_, i) => (
// // //             <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
// // //           ))}
// // //         </div>
// // //         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //           <div className="h-80 rounded-lg bg-gray-100 animate-pulse" />
// // //           <div className="h-80 rounded-lg bg-gray-100 animate-pulse" />
// // //         </div>
// // //         <div className="mt-6 h-96 rounded-lg bg-gray-100 animate-pulse" />
// // //       </div>
// // //     );
// // //   }

// // //   const periodLabel =
// // //     filters.mode === "day"
// // //       ? filters.date
// // //       : filters.mode === "month"
// // //       ? filters.month
// // //       : `${filters.startDate} a ${filters.endDate}`;

// // //   return (
// // //     <div className="space-y-6">
// // //       <PageHeader title="Relatórios" />

// // //       {/* ===== Sticky topbar (tabs + controls como a imagem) ===== */}
// // //       <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
// // //         <div className="mx-auto max-w-full px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // //           {/* Tabs */}
// // //           <div className="flex items-center gap-6">
// // //             {[
// // //               { k: "day", l: "Dia" },
// // //               { k: "month", l: "Mês" },
// // //               { k: "range", l: "Período" },
// // //             ].map((t) => (
// // //               <button
// // //                 key={t.k}
// // //                 onClick={() => setFilters((f) => ({ ...f, mode: t.k }))}
// // //                 className={`relative pb-2 text-sm font-medium ${
// // //                   filters.mode === t.k ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
// // //                 }`}
// // //               >
// // //                 {t.l}
// // //                 {filters.mode === t.k && (
// // //                   <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
// // //                 )}
// // //               </button>
// // //             ))}
// // //           </div>

// // //           {/* Right controls */}
// // //           <div className="flex items-center gap-2">
// // //             {/* Date range */}
// // //             <div className="relative">
// // //               <button
// // //                 ref={dateBtnRef}
// // //                 type="button"
// // //                 onClick={() => setOpenDate((v) => !v)}
// // //                 className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
// // //               >
// // //                 <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
// // //                 {filters.mode === "day" && "Hoje"}
// // //                 {filters.mode === "month" && "Mês atual"}
// // //                 {filters.mode === "range" && "Período"}
// // //                 <ChevronDown className="h-4 w-4 text-gray-400" />
// // //               </button>
// // //               {openDate && (
// // //                 <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
// // //                   <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
// // //                   <div className="grid grid-cols-2 gap-2">
// // //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToToday}>Hoje</button>
// // //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToThisMonth}>Mês atual</button>
// // //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => applyQuickRange(7)}>Últimos 7 dias</button>
// // //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => applyQuickRange(30)}>Últimos 30 dias</button>
// // //                   </div>
// // //                   <div className="my-3 h-px bg-gray-100" />
// // //                   {/* Custom conforme modo */}
// // //                   {filters.mode === "day" && (
// // //                     <div className="space-y-1">
// // //                       <div className="text-xs font-semibold text-gray-500 px-1">Dia</div>
// // //                       <Input type="date" value={filters.date} onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))} />
// // //                     </div>
// // //                   )}
// // //                   {filters.mode === "month" && (
// // //                     <div className="space-y-1">
// // //                       <div className="text-xs font-semibold text-gray-500 px-1">Mês</div>
// // //                       <Input type="month" value={filters.month} onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))} />
// // //                     </div>
// // //                   )}
// // //                   {filters.mode === "range" && (
// // //                     <div className="grid grid-cols-2 gap-2">
// // //                       <div>
// // //                         <div className="text-xs font-semibold text-gray-500 px-1">Início</div>
// // //                         <Input type="date" value={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
// // //                       </div>
// // //                       <div>
// // //                         <div className="text-xs font-semibold text-gray-500 px-1">Fim</div>
// // //                         <Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Filter by */}
// // //             <div className="relative">
// // //               <button
// // //                 ref={filterBtnRef}
// // //                 type="button"
// // //                 onClick={() => setOpenFilter((v) => !v)}
// // //                 className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
// // //               >
// // //                 Filtrar por <ChevronDown className="h-4 w-4 text-gray-400" />
// // //               </button>
// // //               {openFilter && (
// // //                 <div className="absolute right-0 z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
// // //                   <div className="space-y-3">
// // //                     <label className="flex items-center gap-2">
// // //                       <input
// // //                         type="checkbox"
// // //                         className="h-4 w-4 rounded border-gray-300"
// // //                         checked={filters.onlyWithSales}
// // //                         onChange={(e) => setFilters((f) => ({ ...f, onlyWithSales: e.target.checked }))}
// // //                       />
// // //                       <span className="text-sm text-gray-700">Somente itens com venda</span>
// // //                     </label>

// // //                     <div>
// // //                       <div className="text-xs font-semibold text-gray-500 mb-1">Top N</div>
// // //                       <div className="flex flex-wrap gap-1">
// // //                         {[0, 5, 10, 20].map((n) => (
// // //                           <button
// // //                             key={n}
// // //                             className={`rounded px-2 py-1 text-xs ${filters.topN === n ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
// // //                             onClick={() => setFilters((f) => ({ ...f, topN: n }))}
// // //                           >
// // //                             {n === 0 ? "Todos" : `Top ${n}`}
// // //                           </button>
// // //                         ))}
// // //                       </div>
// // //                     </div>

// // //                     <div>
// // //                       <div className="text-xs font-semibold text-gray-500 mb-1">Marcas</div>
// // //                       <div className="max-h-40 overflow-auto rounded border border-gray-100 p-2">
// // //                         {allBrands.length === 0 ? (
// // //                           <div className="text-xs text-gray-400 px-1 py-0.5">Sem marcas</div>
// // //                         ) : (
// // //                           allBrands.map((b) => (
// // //                             <label key={b} className="flex items-center gap-2 px-1 py-1 text-sm text-gray-700">
// // //                               <input
// // //                                 type="checkbox"
// // //                                 className="h-4 w-4 rounded border-gray-300"
// // //                                 checked={filters.brands.includes(b)}
// // //                                 onChange={(e) =>
// // //                                   setFilters((f) => {
// // //                                     const set = new Set(f.brands);
// // //                                     if (e.target.checked) set.add(b);
// // //                                     else set.delete(b);
// // //                                     return { ...f, brands: Array.from(set) };
// // //                                   })
// // //                                 }
// // //                               />
// // //                               {b}
// // //                             </label>
// // //                           ))
// // //                         )}
// // //                       </div>
// // //                     </div>

// // //                     <div className="flex items-center justify-between">
// // //                       <div className="text-xs text-gray-500">Ordenação</div>
// // //                       <div className="flex gap-1">
// // //                         <button className={`rounded px-2 py-1 text-xs ${filters.sortDir === "desc" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setFilters((f) => ({ ...f, sortDir: "desc" }))}>Desc</button>
// // //                         <button className={`rounded px-2 py-1 text-xs ${filters.sortDir === "asc" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setFilters((f) => ({ ...f, sortDir: "asc" }))}>Asc</button>
// // //                       </div>
// // //                     </div>

// // //                     <div className="flex justify-between">
// // //                       <button
// // //                         className="text-sm text-gray-600 underline hover:text-gray-800"
// // //                         onClick={() => setFilters((f) => ({ ...f, brands: [], onlyWithSales: false, topN: 0 }))}
// // //                       >
// // //                         Limpar
// // //                       </button>
// // //                       <button className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow hover:bg-black" onClick={() => setOpenFilter(false)}>Aplicar</button>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* Search */}
// // //             <div className="relative w-72">
// // //               <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// // //               <input
// // //                 ref={searchRef}
// // //                 type="text"
// // //                 placeholder="Search or type a command (Ctrl + G)"
// // //                 className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// // //                 value={filters.search}
// // //                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
// // //               />
// // //             </div>

// // //             {/* Export */}
// // //             <button
// // //               type="button"
// // //               onClick={async () => {
// // //                 setIsExporting(true);
// // //                 try {
// // //                   const headers = ["Produto","Marca","QtdVendida","Faturamento","%DoTotal","UltimaVenda"];
// // //                   const csvRows = [headers.join(",")];
// // //                   productsBase.forEach((p) => {
// // //                     csvRows.push([
// // //                       `"${(p.name ?? "").replaceAll('"', '""')}"`,
// // //                       `"${(p.brand ?? "").replaceAll('"', '""')}"`,
// // //                       p.totalSold,
// // //                       p.totalRevenue,
// // //                       p.percentageOfTotal,
// // //                       p.lastSoldAt ? `"${p.lastSoldAt}"` : "",
// // //                     ].join(","));
// // //                   });
// // //                   const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
// // //                   const url = URL.createObjectURL(blob);
// // //                   const a = document.createElement("a");
// // //                   a.href = url;
// // //                   const when = filters.mode === "day" ? filters.date : filters.mode === "month" ? filters.month : `${filters.startDate}_a_${filters.endDate}`;
// // //                   a.download = `produtos_${filters.mode}_${when}.csv`;
// // //                   document.body.appendChild(a);
// // //                   a.click();
// // //                   a.remove();
// // //                   URL.revokeObjectURL(url);
// // //                 } finally {
// // //                   setIsExporting(false);
// // //                 }
// // //               }}
// // //               disabled={isExporting || totalItems === 0}
// // //               className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-60"
// // //             >
// // //               Exportar CSV
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Subinfo período */}
// // //       <div className="px-6 -mt-2 text-sm text-gray-500">Período atual: <strong>{periodLabel}</strong></div>

// // //       {/* KPIs */}
// // //       <div className="px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// // //         <Card title="Vendas do Dia (R$)">
// // //           <div className="text-2xl font-semibold">{formatCurrency(kpiDayTotal)}</div>
// // //           {dayOrders != null && <div className="text-xs text-gray-500 mt-1">Pedidos: {dayOrders}</div>}
// // //         </Card>
// // //         <Card title="Vendas do Mês (R$)">
// // //           <div className="text-2xl font-semibold">{formatCurrency(kpiMonthTotal)}</div>
// // //           {monthOrders != null && <div className="text-xs text-gray-500 mt-1">Pedidos: {monthOrders}</div>}
// // //         </Card>
// // //         <Card title="Ticket Médio (Dia)">
// // //           <div className="text-2xl font-semibold">{dayOrders && dayOrders > 0 ? formatCurrency(kpiDayTotal / dayOrders) : "—"}</div>
// // //         </Card>
// // //         <Card title="Ticket Médio (Mês)">
// // //           <div className="text-2xl font-semibold">{monthOrders && monthOrders > 0 ? formatCurrency(kpiMonthTotal / monthOrders) : "—"}</div>
// // //         </Card>
// // //       </div>

// // //       {/* Gráficos */}
// // //       <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //         <Card title="Vendas Diárias (Últimos 7 dias)">
// // //           <div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div>
// // //         </Card>
// // //         <Card title="Vendas Mensais (Últimos 6 meses)">
// // //           <div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div>
// // //         </Card>
// // //       </div>

// // //       {/* Tabela + Paginação */}
// // //       <div className="px-6">
// // //         <div className="overflow-hidden rounded-lg bg-white shadow">
// // //           <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// // //             <div>
// // //               <h3 className="text-lg font-semibold text-gray-800">Produtos Vendidos</h3>
// // //               <p className="text-sm text-gray-500">Conforme filtros aplicados</p>
// // //             </div>
// // //             <div className="text-right">
// // //               <p className="text-sm text-gray-600">Faturamento no período</p>
// // //               <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueTotal)}</p>
// // //               <p className="text-xs text-gray-500">Exibindo {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} de {totalItems}</p>
// // //             </div>
// // //           </div>

// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50 sticky top-[56px] z-10">
// // //                 <tr>
// // //                   <th onClick={headerSort("name")} aria-sort={filters.sortBy === "name" ? (filters.sortDir === "desc" ? "descending" : "ascending") : "none"} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Produto" col="name" /></th>
// // //                   <th onClick={headerSort("brand")} aria-sort={filters.sortBy === "brand" ? (filters.sortDir === "desc" ? "descending" : "ascending") : "none"} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Marca" col="brand" /></th>
// // //                   <th onClick={headerSort("totalSold")} aria-sort={filters.sortBy === "totalSold" ? (filters.sortDir === "desc" ? "descending" : "ascending") : "none"} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Qtd. Vendida" col="totalSold" /></th>
// // //                   <th onClick={headerSort("totalRevenue")} aria-sort={filters.sortBy === "totalRevenue" ? (filters.sortDir === "desc" ? "descending" : "ascending") : "none"} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Faturamento" col="totalRevenue" /></th>
// // //                   <th onClick={headerSort("percentageOfTotal")} aria-sort={filters.sortBy === "percentageOfTotal" ? (filters.sortDir === "desc" ? "descending" : "ascending") : "none"} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="% do Total" col="percentageOfTotal" /></th>
// // //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Última Venda</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-gray-200 bg-white">
// // //                 {products.length > 0 ? (
// // //                   products.map((product) => (
// // //                     <tr key={product.id} className="hover:bg-gray-50">
// // //                       <td className="px-6 py-3 text-sm font-medium text-gray-900">{product.name}</td>
// // //                       <td className="px-6 py-3 text-sm text-gray-700">{product.brand}</td>
// // //                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{product.totalSold}</td>
// // //                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{formatCurrency(product.totalRevenue)}</td>
// // //                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{Number(product.percentageOfTotal ?? 0).toFixed(2)}%</td>
// // //                       <td className="px-6 py-3 text-sm text-gray-700">{product.lastSoldAt ? new Date(product.lastSoldAt).toLocaleString() : "—"}</td>
// // //                     </tr>
// // //                   ))
// // //                 ) : (
// // //                   <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Nenhuma venda registrada para o período selecionado</td></tr>
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Footer da tabela */}
// // //           <div className="flex flex-col gap-3 border-t bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
// // //             <div className="flex items-center gap-3">
// // //               <span className="text-sm text-gray-600">Itens por página</span>
// // //               <select
// // //                 className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm"
// // //                 value={pageSize}
// // //                 onChange={(e) => setPageSize(Number(e.target.value))}
// // //               >
// // //                 {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
// // //               </select>
// // //             </div>

// // //             <Pagination
// // //               currentPage={safePage}
// // //               totalPages={totalPages}
// // //               onChange={(p) => setCurrentPage(p)}
// // //               className="justify-center"
// // //               windowSize={1}
// // //             />

// // //             <div className="text-sm text-gray-600">
// // //               {totalItems > 0 ? <>Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong></> : "Nenhum registro"}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Reports;



// // import { useState, useEffect, useMemo, useRef } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //   Chart,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // // import PageHeader from "../components/PageHeader" // <- removido para usar header padronizado
// // import Card from "../components/Card";
// // import { formatCurrency } from "../utils/format";
// // import { fetchReports } from "../services/api";

// // // ===================== Chart.js
// // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // // ===================== Utils
// // const pad = (n) => String(n).padStart(2, "0");
// // const today = () => {
// //   const d = new Date();
// //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// // };
// // const thisMonth = () => {
// //   const d = new Date();
// //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
// // };
// // const startOfMonth = (ym) => {
// //   const [y, m] = ym.split("-").map(Number);
// //   return `${y}-${pad(m)}-01`;
// // };
// // const endOfMonth = (ym) => {
// //   const [y, m] = ym.split("-").map(Number);
// //   const last = new Date(y, m, 0).getDate();
// //   return `${y}-${pad(m)}-${pad(last)}`;
// // };
// // const toISODateTime = (date, endOfDay = false) =>
// //   endOfDay ? `${date}T23:59:59` : `${date}T00:00:00`;

// // function useDebounce(value, delay = 350) {
// //   const [debounced, setDebounced] = useState(value);
// //   useEffect(() => {
// //     const id = setTimeout(() => setDebounced(value), delay);
// //     return () => clearTimeout(id);
// //   }, [value, delay]);
// //   return debounced;
// // }

// // // ===================== Base UI
// // const Input = ({ className = "", ...props }) => (
// //   <input
// //     className={`w-full h-10 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200 ${className}`}
// //     {...props}
// //   />
// // );
// // const Select = ({ className = "", ...props }) => (
// //   <select
// //     className={`w-full h-10 px-3 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm border-gray-200 ${className}`}
// //     {...props}
// //   />
// // );

// // // Icons
// // const SearchIcon = (props) => (
// //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
// //     <circle cx="11" cy="11" r="7"></circle>
// //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //   </svg>
// // );
// // const ChevronDown = (props) => (
// //   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}><path d="M6 9l6 6 6-6"/></svg>
// // );

// // // ===================== Paginação
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
// //       <button type="button" onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">«</button>
// //       <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Anterior</button>
// //       {pages.map((p, i) => (
// //         <button key={`${p}-${i}`} type="button" onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
// //       ))}
// //       <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Próxima</button>
// //       <button type="button" onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">»</button>
// //     </nav>
// //   );
// // }

// // // ===================== KPIs helper
// // const computeKPIs = (reportData, currentDayStr, currentMonthStr) => {
// //   const daily = reportData?.dailySales ?? [];
// //   const monthly = reportData?.monthlySales ?? [];

// //   const kpiDayTotal = daily.find((d) => d.date === currentDayStr)?.total ?? 0;
// //   const kpiMonthTotal = (() => {
// //     const m1 = monthly.find((m) => m.month === currentMonthStr)?.total;
// //     if (typeof m1 === "number") return m1;
// //     const [y, m] = currentMonthStr.split("-");
// //     const byPrefix = monthly.find((mm) => String(mm.month).includes(`${y}-${m}`))?.total;
// //     return byPrefix ?? 0;
// //   })();

// //   const dayOrders = reportData?.todayOrdersCount ?? null;
// //   const monthOrders = reportData?.monthOrdersCount ?? null;

// //   return { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders };
// // };

// // // ===================== Componente
// // const Reports = () => {
// //   // Filtros
// //   const [filters, setFilters] = useState({
// //     mode: "day",
// //     date: today(),
// //     month: thisMonth(),
// //     startDate: today(),
// //     endDate: today(),
// //     search: "",
// //     sortBy: "totalRevenue",
// //     sortDir: "desc",
// //     onlyWithSales: false,
// //     topN: 0,
// //     brands: [],
// //   });
// //   const debouncedSearch = useDebounce(filters.search, 300);

// //   // Dados
// //   const [reportData, setReportData] = useState({
// //     dailySales: [],
// //     monthlySales: [],
// //     topProducts: [],
// //     products: [],
// //   });
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isExporting, setIsExporting] = useState(false);

// //   // Fetch
// //   const buildParams = () => {
// //     const common = { search: debouncedSearch, groupBy: "product" };
// //     if (filters.mode === "day") {
// //       return { ...common, from: toISODateTime(filters.date), to: toISODateTime(filters.date, true) };
// //     }
// //     if (filters.mode === "month") {
// //       return { ...common, from: toISODateTime(startOfMonth(filters.month)), to: toISODateTime(endOfMonth(filters.month), true) };
// //     }
// //     return { ...common, from: toISODateTime(filters.startDate), to: toISODateTime(filters.endDate, true) };
// //   };

// //   const loadReportData = async () => {
// //     try {
// //       setIsLoading(true);
// //       const data = await fetchReports(buildParams());
// //       setReportData(data);
// //     } catch (e) {
// //       console.error("Error loading report data:", e);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadReportData();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, debouncedSearch]);

// //   // Derivados
// //   const { kpiDayTotal, kpiMonthTotal, dayOrders, monthOrders } = useMemo(
// //     () => computeKPIs(reportData, filters.date, filters.month),
// //     [reportData, filters.date, filters.month]
// //   );

// //   const normalizeProducts = (data) =>
// //     Array.isArray(data)
// //       ? data.map((p, idx) => ({
// //           id: p.id ?? idx,
// //           name: p.name ?? p.productName ?? "—",
// //           brand: p.brand ?? p.marca ?? "—",
// //           totalSold: Number(p.totalSold ?? p.quantity ?? 0),
// //           totalRevenue: Number(p.totalRevenue ?? p.revenue ?? 0),
// //           percentageOfTotal: p.percentageOfTotal != null ? Number(p.percentageOfTotal) : null,
// //           lastSoldAt: p.lastSoldAt ?? p.lastSaleAt ?? null,
// //         }))
// //       : [];

// //   const allProductsRaw = useMemo(() => {
// //     const base = reportData.products?.length ? reportData.products : reportData.topProducts;
// //     return normalizeProducts(base);
// //   }, [reportData]);

// //   const allBrands = useMemo(() => {
// //     const set = new Set(allProductsRaw.map((p) => (p.brand || "").trim()).filter(Boolean));
// //     return Array.from(set).sort((a, b) => a.localeCompare(b));
// //   }, [allProductsRaw]);

// //   const revenueTotal = useMemo(
// //     () => allProductsRaw.reduce((acc, p) => acc + Number(p.totalRevenue || 0), 0),
// //     [allProductsRaw]
// //   );

// //   const productsBase = useMemo(() => {
// //     const term = debouncedSearch.trim().toLowerCase();
// //     let arr = allProductsRaw
// //       .map((p) => ({
// //         ...p,
// //         percentageOfTotal: revenueTotal > 0 ? Number(((Number(p.totalRevenue || 0) / revenueTotal) * 100).toFixed(2)) : 0,
// //       }))
// //       .filter((p) => (term ? `${p.name} ${p.brand}`.toLowerCase().includes(term) : true));

// //     if (filters.onlyWithSales) arr = arr.filter((p) => Number(p.totalSold) > 0);
// //     if (filters.brands.length) arr = arr.filter((p) => filters.brands.includes(p.brand));

// //     const dir = filters.sortDir === "asc" ? 1 : -1;
// //     const sb = filters.sortBy;
// //     arr.sort((a, b) => (sb === "name" || sb === "brand" ? a[sb].localeCompare(b[sb]) * dir : ((a[sb] ?? 0) - (b[sb] ?? 0)) * dir));

// //     if (filters.topN > 0) arr = arr.slice(0, filters.topN);
// //     return arr;
// //   }, [allProductsRaw, debouncedSearch, filters.sortBy, filters.sortDir, filters.onlyWithSales, filters.topN, filters.brands, revenueTotal]);

// //   // Paginação
// //   const [pageSize, setPageSize] = useState(10);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   useEffect(() => setCurrentPage(1), [productsBase, pageSize]);
// //   const totalItems = productsBase.length;
// //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// //   const safePage = Math.min(Math.max(1, currentPage), totalPages);
// //   const startIdx = (safePage - 1) * pageSize;
// //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// //   const products = productsBase.slice(startIdx, endIdx);

// //   // Charts
// //   const dailySalesChartData = {
// //     labels: (reportData.dailySales ?? []).map((item) => item.date),
// //     datasets: [{ label: "Vendas Diárias (R$)", data: (reportData.dailySales ?? []).map((i) => i.total), backgroundColor: "rgba(59,130,246,.5)", borderColor: "rgb(59,130,246)", borderWidth: 1 }],
// //   };
// //   const monthlySalesChartData = {
// //     labels: (reportData.monthlySales ?? []).map((item) => item.month),
// //     datasets: [{ label: "Vendas Mensais (R$)", data: (reportData.monthlySales ?? []).map((i) => i.total), backgroundColor: "rgba(16,185,129,.5)", borderColor: "rgb(16,185,129)", borderWidth: 1 }],
// //   };
// //   const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } } };

// //   // Sort label
// //   const headerSort = (col) => () => setFilters((f) => ({ ...f, sortBy: col, sortDir: f.sortBy === col && f.sortDir === "desc" ? "asc" : "desc" }));
// //   const SortLabel = ({ label, col }) => (
// //     <span className="inline-flex items-center gap-1 select-none">{label}{filters.sortBy === col && <span className="text-gray-400">{filters.sortDir === "desc" ? "▼" : "▲"}</span>}</span>
// //   );

// //   // Toolbar (sticky) controls
// //   const [openDate, setOpenDate] = useState(false);
// //   const [openFilter, setOpenFilter] = useState(false);
// //   const dateBtnRef = useRef(null);
// //   const filterBtnRef = useRef(null);
// //   useEffect(() => {
// //     const handler = (e) => {
// //       if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false);
// //       if (!filterBtnRef.current?.parentElement?.contains(e.target)) setOpenFilter(false);
// //     };
// //     document.addEventListener("click", handler);
// //     return () => document.removeEventListener("click", handler);
// //   }, []);

// //   const applyQuickRange = (days) => {
// //     const end = new Date();
// //     const start = new Date();
// //     start.setDate(end.getDate() - (days - 1));
// //     const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// //     setFilters((f) => ({ ...f, mode: "range", startDate: fmt(start), endDate: fmt(end) }));
// //     setOpenDate(false);
// //   };
// //   const setToToday = () => { setFilters((f) => ({ ...f, mode: "day", date: today() })); setOpenDate(false); };
// //   const setToThisMonth = () => { setFilters((f) => ({ ...f, mode: "month", month: thisMonth() })); setOpenDate(false); };

// //   const searchRef = useRef(null);
// //   useEffect(() => {
// //     const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") { e.preventDefault(); searchRef.current?.focus(); } };
// //     window.addEventListener("keydown", onKey);
// //     return () => window.removeEventListener("keydown", onKey);
// //   }, []);

// //   // Loading skeleton com layout padronizado
// //   if (isLoading) {
// //     return (
// //       <div className="p-6">
// //         <div className="mb-6">
// //           <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
// //           <p className="text-sm text-gray-500">Painel central de desempenho e vendas</p>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// //           {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />)}
// //         </div>
// //         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           <div className="h-80 rounded-lg bg-gray-100 animate-pulse" />
// //           <div className="h-80 rounded-lg bg-gray-100 animate-pulse" />
// //         </div>
// //         <div className="mt-6 h-96 rounded-lg bg-gray-100 animate-pulse" />
// //       </div>
// //     );
// //   }

// //   const periodLabel =
// //     filters.mode === "day" ? filters.date :
// //     filters.mode === "month" ? filters.month :
// //     `${filters.startDate} a ${filters.endDate}`;

// //   // ===================== RENDER (layout padronizado)
// //   return (
// //     <div className="p-6">
// //       {/* Header padronizado */}
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
// //         <p className="text-sm text-gray-500">Painel central de desempenho e vendas</p>
// //       </div>

// //       {/* Topbar sticky (Last X days / Filter by / Search / Export) */}
// //       <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
// //         <div className="max-w-full px-0 sm:px-0 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //           {/* Tabs */}
// //           <div className="flex items-center gap-6">
// //             {[{k:"day",l:"Dia"},{k:"month",l:"Mês"},{k:"range",l:"Período"}].map(t=>(
// //               <button key={t.k} onClick={()=>setFilters((f)=>({...f,mode:t.k}))} className={`relative pb-2 text-sm font-medium ${filters.mode===t.k?"text-gray-900":"text-gray-500 hover:text-gray-700"}`}>
// //                 {t.l}
// //                 {filters.mode===t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
// //               </button>
// //             ))}
// //           </div>

// //           {/* Right controls */}
// //           <div className="flex items-center gap-2">
// //             {/* Date menu */}
// //             <div className="relative">
// //               <button ref={dateBtnRef} type="button" onClick={()=>setOpenDate(v=>!v)} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
// //                 <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
// //                 {filters.mode==="day" && "Hoje"}
// //                 {filters.mode==="month" && "Mês atual"}
// //                 {filters.mode==="range" && "Período"}
// //                 <ChevronDown className="h-4 w-4 text-gray-400" />
// //               </button>
// //               {openDate && (
// //                 <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
// //                   <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
// //                   <div className="grid grid-cols-2 gap-2">
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToToday}>Hoje</button>
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToThisMonth}>Mês atual</button>
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={()=>applyQuickRange(7)}>Últimos 7 dias</button>
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={()=>applyQuickRange(30)}>Últimos 30 dias</button>
// //                   </div>
// //                   <div className="my-3 h-px bg-gray-100" />
// //                   {filters.mode==="day" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Dia</div><Input type="date" value={filters.date} onChange={(e)=>setFilters(f=>({...f,date:e.target.value}))} /></div>)}
// //                   {filters.mode==="month" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Mês</div><Input type="month" value={filters.month} onChange={(e)=>setFilters(f=>({...f,month:e.target.value}))} /></div>)}
// //                   {filters.mode==="range" && (
// //                     <div className="grid grid-cols-2 gap-2">
// //                       <div><div className="text-xs font-semibold text-gray-500 px-1">Início</div><Input type="date" value={filters.startDate} onChange={(e)=>setFilters(f=>({...f,startDate:e.target.value}))} /></div>
// //                       <div><div className="text-xs font-semibold text-gray-500 px-1">Fim</div><Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e)=>setFilters(f=>({...f,endDate:e.target.value}))} /></div>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Filter by */}
// //             <FilterPopover
// //               filterBtnRef={filterBtnRef}
// //               open={openFilter}
// //               setOpen={setOpenFilter}
// //               allBrands={allBrands}
// //               filters={filters}
// //               setFilters={setFilters}
// //             />

// //             {/* Search */}
// //             <div className="relative w-72">
// //               <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// //               <input
// //                 ref={searchRef}
// //                 type="text"
// //                 placeholder="Search or type a command (Ctrl + G)"
// //                 className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
// //                 value={filters.search}
// //                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
// //               />
// //             </div>

// //             {/* Export */}
// //             <button
// //               type="button"
// //               onClick={async () => {
// //                 setIsExporting(true);
// //                 try {
// //                   const headers = ["Produto","Marca","QtdVendida","Faturamento","%DoTotal","UltimaVenda"];
// //                   const csvRows = [headers.join(",")];
// //                   productsBase.forEach((p) => {
// //                     csvRows.push([
// //                       `"${(p.name ?? "").replaceAll('"', '""')}"`,
// //                       `"${(p.brand ?? "").replaceAll('"', '""')}"`,
// //                       p.totalSold,
// //                       p.totalRevenue,
// //                       p.percentageOfTotal,
// //                       p.lastSoldAt ? `"${p.lastSoldAt}"` : "",
// //                     ].join(","));
// //                   });
// //                   const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
// //                   const url = URL.createObjectURL(blob);
// //                   const a = document.createElement("a");
// //                   a.href = url;
// //                   const when = filters.mode==="day" ? filters.date : filters.mode==="month" ? filters.month : `${filters.startDate}_a_${filters.endDate}`;
// //                   a.download = `produtos_${filters.mode}_${when}.csv`;
// //                   document.body.appendChild(a);
// //                   a.click();
// //                   a.remove();
// //                   URL.revokeObjectURL(url);
// //                 } finally { setIsExporting(false); }
// //               }}
// //               disabled={isExporting || totalItems === 0}
// //               className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-60"
// //             >
// //               Exportar CSV
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Subinfo período */}
// //       <div className="mt-2 text-sm text-gray-500">Período atual: <strong>{periodLabel}</strong></div>

// //       {/* KPIs */}
// //       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
// //         <Card title="Vendas do Dia (R$)">
// //           <div className="text-2xl font-semibold">{formatCurrency(kpiDayTotal)}</div>
// //           {dayOrders != null && <div className="text-xs text-gray-500 mt-1">Pedidos: {dayOrders}</div>}
// //         </Card>
// //         <Card title="Vendas do Mês (R$)">
// //           <div className="text-2xl font-semibold">{formatCurrency(kpiMonthTotal)}</div>
// //           {monthOrders != null && <div className="text-xs text-gray-500 mt-1">Pedidos: {monthOrders}</div>}
// //         </Card>
// //         <Card title="Ticket Médio (Dia)">
// //           <div className="text-2xl font-semibold">{dayOrders && dayOrders > 0 ? formatCurrency(kpiDayTotal / dayOrders) : "—"}</div>
// //         </Card>
// //         <Card title="Ticket Médio (Mês)">
// //           <div className="text-2xl font-semibold">{monthOrders && monthOrders > 0 ? formatCurrency(kpiMonthTotal / monthOrders) : "—"}</div>
// //         </Card>
// //       </div>

// //       {/* Gráficos */}
// //       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         <Card title="Vendas Diárias (Últimos 7 dias)">
// //           <div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div>
// //         </Card>
// //         <Card title="Vendas Mensais (Últimos 6 meses)">
// //           <div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div>
// //         </Card>
// //       </div>

// //       {/* Tabela + Paginação */}
// //       <div className="mt-6">
// //         <div className="overflow-hidden rounded-lg bg-white shadow">
// //           <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// //             <div>
// //               <h3 className="text-lg font-semibold text-gray-800">Produtos Vendidos</h3>
// //               <p className="text-sm text-gray-500">Conforme filtros aplicados</p>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-sm text-gray-600">Faturamento no período</p>
// //               <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueTotal)}</p>
// //               <p className="text-xs text-gray-500">Exibindo {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} de {totalItems}</p>
// //             </div>
// //           </div>

// //           <div className="overflow-x-auto">
// //             {/* Ajuste o 'top-[48px]' se sua topbar sticky tiver outra altura */}
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50 sticky top-[48px] z-10">
// //                 <tr>
// //                   <th onClick={headerSort("name")} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Produto" col="name" /></th>
// //                   <th onClick={headerSort("brand")} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Marca" col="brand" /></th>
// //                   <th onClick={headerSort("totalSold")} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Qtd. Vendida" col="totalSold" /></th>
// //                   <th onClick={headerSort("totalRevenue")} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="Faturamento" col="totalRevenue" /></th>
// //                   <th onClick={headerSort("percentageOfTotal")} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"><SortLabel label="% do Total" col="percentageOfTotal" /></th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Última Venda</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 bg-white">
// //                 {products.length > 0 ? (
// //                   products.map((product) => (
// //                     <tr key={product.id} className="hover:bg-gray-50">
// //                       <td className="px-6 py-3 text-sm font-medium text-gray-900">{product.name}</td>
// //                       <td className="px-6 py-3 text-sm text-gray-700">{product.brand}</td>
// //                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{product.totalSold}</td>
// //                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{formatCurrency(product.totalRevenue)}</td>
// //                       <td className="px-6 py-3 text-sm text-gray-900 text-right">{Number(product.percentageOfTotal ?? 0).toFixed(2)}%</td>
// //                       <td className="px-6 py-3 text-sm text-gray-700">{product.lastSoldAt ? new Date(product.lastSoldAt).toLocaleString() : "—"}</td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Nenhuma venda registrada para o período selecionado</td></tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Footer da tabela */}
// //           <div className="flex flex-col gap-3 border-top bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
// //             <div className="flex items-center gap-3">
// //               <span className="text-sm text-gray-600">Itens por página</span>
// //               <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
// //                 {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
// //               </select>
// //             </div>

// //             <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setCurrentPage(p)} className="justify-center" windowSize={1} />

// //             <div className="text-sm text-gray-600">
// //               {totalItems > 0 ? <>Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong></> : "Nenhum registro"}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Popover de filtros (separado só para manter o return limpo)
// // const FilterPopover = ({ filterBtnRef, open, setOpen, allBrands, filters, setFilters }) => (
// //   <div className="relative">
// //     <button
// //       ref={filterBtnRef}
// //       type="button"
// //       onClick={() => setOpen((v) => !v)}
// //       className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
// //     >
// //       Filtrar por <ChevronDown className="h-4 w-4 text-gray-400" />
// //     </button>
// //     {open && (
// //       <div className="absolute right-0 z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
// //         <div className="space-y-3">
// //           <label className="flex items-center gap-2">
// //             <input
// //               type="checkbox"
// //               className="h-4 w-4 rounded border-gray-300"
// //               checked={filters.onlyWithSales}
// //               onChange={(e) => setFilters((f) => ({ ...f, onlyWithSales: e.target.checked }))}
// //             />
// //             <span className="text-sm text-gray-700">Somente itens com venda</span>
// //           </label>

// //           <div>
// //             <div className="text-xs font-semibold text-gray-500 mb-1">Top N</div>
// //             <div className="flex flex-wrap gap-1">
// //               {[0, 5, 10, 20].map((n) => (
// //                 <button
// //                   key={n}
// //                   className={`rounded px-2 py-1 text-xs ${filters.topN === n ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
// //                   onClick={() => setFilters((f) => ({ ...f, topN: n }))}
// //                 >
// //                   {n === 0 ? "Todos" : `Top ${n}`}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           <div>
// //             <div className="text-xs font-semibold text-gray-500 mb-1">Marcas</div>
// //             <div className="max-h-40 overflow-auto rounded border border-gray-100 p-2">
// //               {allBrands.length === 0 ? (
// //                 <div className="text-xs text-gray-400 px-1 py-0.5">Sem marcas</div>
// //               ) : (
// //                 allBrands.map((b) => (
// //                   <label key={b} className="flex items-center gap-2 px-1 py-1 text-sm text-gray-700">
// //                     <input
// //                       type="checkbox"
// //                       className="h-4 w-4 rounded border-gray-300"
// //                       checked={filters.brands.includes(b)}
// //                       onChange={(e) =>
// //                         setFilters((f) => {
// //                           const set = new Set(f.brands);
// //                           if (e.target.checked) set.add(b); else set.delete(b);
// //                           return { ...f, brands: Array.from(set) };
// //                         })
// //                       }
// //                     />
// //                     {b}
// //                   </label>
// //                 ))
// //               )}
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="text-xs text-gray-500">Ordenação</div>
// //             <div className="flex gap-1">
// //               <button className={`rounded px-2 py-1 text-xs ${filters.sortDir === "desc" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setFilters((f) => ({ ...f, sortDir: "desc" }))}>Desc</button>
// //               <button className={`rounded px-2 py-1 text-xs ${filters.sortDir === "asc" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setFilters((f) => ({ ...f, sortDir: "asc" }))}>Asc</button>
// //             </div>
// //           </div>

// //           <div className="flex justify-between">
// //             <button className="text-sm text-gray-600 underline hover:text-gray-800" onClick={() => setFilters((f) => ({ ...f, brands: [], onlyWithSales: false, topN: 0 }))}>
// //               Limpar
// //             </button>
// //             <button className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow hover:bg-black" onClick={() => setOpen(false)}>
// //               Aplicar
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     )}
// //   </div>
// // );

// // export default Reports;




// // src/pages/Reports.jsx
// import { useState, useEffect, useMemo, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// import Card from "../components/Card";
// import { formatCurrency } from "../utils/format";
// import { fetchReports } from "../services/api";

// Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const pad = (n) => String(n).padStart(2, "0");
// const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
// const lastNDays = (n) => {
//   const end = new Date();
//   const start = new Date(); start.setDate(end.getDate() - (n - 1));
//   const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
//   return { start: fmt(start), end: fmt(end) };
// };
// const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
// const startOfMonth = (ym) => { const [y, m] = ym.split("-").map(Number); return `${y}-${pad(m)}-01`; };
// const endOfMonth = (ym) => { const [y, m] = ym.split("-").map(Number); const last = new Date(y, m, 0).getDate(); return `${y}-${pad(m)}-${pad(last)}`; };
// const toISO = (date, eod = false) => eod ? `${date}T23:59:59` : `${date}T00:00:00`;

// function useDebounce(v, d = 350) { const [x, setX] = useState(v); useEffect(() => { const id = setTimeout(() => setX(v), d); return () => clearTimeout(id) }, [v, d]); return x; }

// const Input = (props) => <input className="w-full h-10 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200" {...props} />;
// const SearchIcon = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
// const ChevronDown = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><path d="M6 9l6 6 6-6" /></svg>);

// function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
//   const pages = useMemo(() => {
//     if (totalPages <= 1) return [1];
//     const o = []; const start = Math.max(2, currentPage - windowSize); const end = Math.min(totalPages - 1, currentPage + windowSize);
//     o.push(1); if (start > 2) o.push("…"); for (let p = start; p <= end; p++) o.push(p); if (end < totalPages - 1) o.push("…"); if (totalPages > 1) o.push(totalPages);
//     return o;
//   }, [currentPage, totalPages, windowSize]);

//   return (
//     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
//       <button onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">«</button>
//       <button onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Anterior</button>
//       {pages.map((p, i) => (
//         <button key={`${p}-${i}`} onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
//       ))}
//       <button onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Próxima</button>
//       <button onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">»</button>
//     </nav>
//   );
// }

// export default function Reports() {
//   // DEFAULT para mostrar seus 2 lançamentos: últimos 7 dias
//   const rng = lastNDays(7);
//   const [filters, setFilters] = useState({
//     mode: "range",
//     date: today(),
//     month: thisMonth(),
//     startDate: rng.start,
//     endDate: rng.end,
//     search: "",
//   });
//   const debouncedSearch = useDebounce(filters.search, 300);

//   const [data, setData] = useState({ dailySales: [], monthlySales: [], ledger: [], totals: { revenue: 0, expenses: 0, net: 0 } });
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);

//   const buildParams = () => {
//     const common = { search: debouncedSearch };
//     if (filters.mode === "day") return { ...common, from: toISO(filters.date), to: toISO(filters.date, true) };
//     if (filters.mode === "month") return { ...common, from: toISO(startOfMonth(filters.month)), to: toISO(endOfMonth(filters.month), true) };
//     return { ...common, from: toISO(filters.startDate), to: toISO(filters.endDate, true) };
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetchReports(buildParams());
//         setData(res || {});
//       } finally { setLoading(false); }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, debouncedSearch]);

//   // NORMALIZA ledger + saldo acumulado
//   const ledger = useMemo(() => {
//     const arr = Array.isArray(data.ledger) ? data.ledger : [];
//     // já vem ordenado do backend; garante
//     const sorted = [...arr].sort((a, b) => new Date(a.date) - new Date(b.date) || a.type.localeCompare(b.type));
//     let running = 0;
//     return sorted.map(item => {
//       running += Number(item.in || 0) - Number(item.out || 0);
//       return { ...item, balance: running };
//     });
//   }, [data.ledger]);

//   // Busca adicional no front (opcional)
//   const ledgerFiltered = useMemo(() => {
//     const q = debouncedSearch.trim().toLowerCase();
//     if (!q) return ledger;
//     return ledger.filter(l =>
//       `${l.type} ${l.description} ${l.customerName} ${l.payment}`.toLowerCase().includes(q)
//     );
//   }, [ledger, debouncedSearch]);

//   // Paginação
//   const [pageSize, setPageSize] = useState(10);
//   const [page, setPage] = useState(1);
//   useEffect(() => setPage(1), [ledgerFiltered, pageSize]);
//   const totalItems = ledgerFiltered.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage = Math.min(Math.max(1, page), totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const endIdx = Math.min(startIdx + pageSize, totalItems);
//   const rows = ledgerFiltered.slice(startIdx, endIdx);

//   // Charts (mantidos)
//   const dailySalesChartData = {
//     labels: (data.dailySales ?? []).map(i => i.date),
//     datasets: [{ label: "Vendas Diárias (R$)", data: (data.dailySales ?? []).map(i => i.total), backgroundColor: "rgba(59,130,246,.5)", borderColor: "rgb(59,130,246)", borderWidth: 1 }],
//   };
//   const monthlySalesChartData = {
//     labels: (data.monthlySales ?? []).map(i => i.month),
//     datasets: [{ label: "Vendas Mensais (R$)", data: (data.monthlySales ?? []).map(i => i.total), backgroundColor: "rgba(16,185,129,.5)", borderColor: "rgb(16,185,129)", borderWidth: 1 }],
//   };
//   const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } } };

//   // Topbar controls
//   const [openDate, setOpenDate] = useState(false);
//   const dateBtnRef = useRef(null);
//   useEffect(() => {
//     const h = (e) => { if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false); };
//     document.addEventListener("click", h); return () => document.removeEventListener("click", h);
//   }, []);
//   const setQuick = (days) => { const r = lastNDays(days); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); };
//   const setToday = () => { setFilters(f => ({ ...f, mode: "day", date: today() })); setOpenDate(false); };
//   const setThisMonth = () => { setFilters(f => ({ ...f, mode: "month", month: thisMonth() })); setOpenDate(false); };

//   const searchRef = useRef(null);
//   useEffect(() => {
//     const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") { e.preventDefault(); searchRef.current?.focus(); } };
//     window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="mb-6"><h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1><p className="text-sm text-gray-500">Carregando…</p></div>
//         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />)}</div>
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /></div>
//       </div>
//     );
//   }

//   const periodLabel =
//     filters.mode === "day" ? filters.date :
//       filters.mode === "month" ? filters.month :
//         `${filters.startDate} a ${filters.endDate}`;

//   const totals = data.totals || { revenue: 0, expenses: 0, net: 0 };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
//         <p className="text-sm text-gray-500">Fluxo de caixa do período (vendas + despesas)</p>
//       </div>

//       {/* Topbar */}
//       <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
//         <div className="px-0 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-6">
//             {[{ k: "day", l: "Dia" }, { k: "month", l: "Mês" }, { k: "range", l: "Período" }].map(t => (
//               <button key={t.k} onClick={() => setFilters(f => ({ ...f, mode: t.k }))} className={`relative pb-2 text-sm font-medium ${filters.mode === t.k ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
//                 {t.l}{filters.mode === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <button ref={dateBtnRef} type="button" onClick={() => setOpenDate(v => !v)} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
//                 <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
//                 {filters.mode === "day" ? "Hoje" : filters.mode === "month" ? "Mês atual" : "Período"}
//                 <ChevronDown className="h-4 w-4 text-gray-400" />
//               </button>
//               {openDate && (
//                 <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
//                   <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToday}>Hoje</button>
//                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setThisMonth}>Mês atual</button>
//                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => setQuick(7)}>Últimos 7 dias</button>
//                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => setQuick(30)}>Últimos 30 dias</button>
//                   </div>
//                   <div className="my-3 h-px bg-gray-100" />
//                   {filters.mode === "day" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Dia</div><Input type="date" value={filters.date} onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))} /></div>)}
//                   {filters.mode === "month" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Mês</div><Input type="month" value={filters.month} onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))} /></div>)}
//                   {filters.mode === "range" && (
//                     <div className="grid grid-cols-2 gap-2">
//                       <div><div className="text-xs font-semibold text-gray-500 px-1">Início</div><Input type="date" value={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))} /></div>
//                       <div><div className="text-xs font-semibold text-gray-500 px-1">Fim</div><Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))} /></div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Busca */}
//             <div className="relative w-72">
//               <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//               <input
//                 ref={searchRef}
//                 type="text"
//                 placeholder="Search or type a command (Ctrl + G)"
//                 className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//                 value={filters.search}
//                 onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
//               />
//             </div>

//             {/* Export CSV do ledger */}
//             <button
//               type="button"
//               onClick={() => {
//                 setExporting(true);
//                 try {
//                   const headers = ["Data", "Tipo", "Descrição", "Cliente", "Pagamento", "Entrada", "Saída", "Saldo"];
//                   const csvRows = [headers.join(",")];
//                   ledgerFiltered.forEach((r) => {
//                     csvRows.push([
//                       `"${new Date(r.date).toLocaleString("pt-BR")}"`,
//                       `"${r.type}"`,
//                       `"${(r.description || "").replaceAll('"', '""')}"`,
//                       `"${(r.customerName || "").replaceAll('"', '""')}"`,
//                       `"${(r.payment || "").replaceAll('"', '""')}"`,
//                       r.in ?? 0,
//                       r.out ?? 0,
//                       r.balance ?? 0,
//                     ].join(","));
//                   });
//                   const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
//                   const url = URL.createObjectURL(blob);
//                   const a = document.createElement("a");
//                   const label = filters.mode === "day" ? filters.date : filters.mode === "month" ? filters.month : `${filters.startDate}_a_${filters.endDate}`;
//                   a.href = url; a.download = `fluxo_caixa_${label}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
//                 } finally { setExporting(false); }
//               }}
//               disabled={exporting || totalItems === 0}
//               className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-60"
//             >
//               Exportar CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Período */}
//       <div className="mt-2 text-sm text-gray-500">Período atual: <strong>{periodLabel}</strong></div>

//       {/* KPIs */}
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card title="Receita no Período"><div className="text-2xl font-semibold">{formatCurrency(totals.revenue)}</div></Card>
//         <Card title="Despesas no Período"><div className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expenses)}</div></Card>
//         <Card title="Saldo (Receita - Despesas)"><div className={`text-2xl font-semibold ${totals.net < 0 ? "text-red-600" : "text-green-700"}`}>{formatCurrency(totals.net)}</div></Card>
//       </div>

//       {/* Gráficos (opcionais) */}
//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Vendas Diárias"><div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div></Card>
//         <Card title="Vendas Mensais"><div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div></Card>
//       </div>

//       {/* ======= TABELA ÚNICA: FLUXO DE CAIXA ======= */}
//       <div className="mt-6">
//         <div className="overflow-hidden rounded-lg bg-white shadow">
//           <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa</h3>
//               <p className="text-sm text-gray-500">Entradas (vendas) e saídas (despesas) no período</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-600">Lançamentos</p>
//               <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
//               <p className="text-xs text-gray-500">Exibindo {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} de {totalItems}</p>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               {/* BUGFIX: sem sticky aqui */}
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
//                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Tipo</th>
//                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Descrição</th>
//                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Cliente</th>
//                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Pagamento</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Entrada</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Saída</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Saldo</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {rows.length > 0 ? rows.map((r) => (
//                   <tr key={r.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{new Date(r.date).toLocaleString("pt-BR")}</td>
//                     <td className="px-6 py-3 text-sm font-medium">{r.type}</td>
//                     <td className="px-6 py-3 text-sm">{r.description}</td>
//                     <td className="px-6 py-3 text-sm">{r.customerName || "—"}</td>
//                     <td className="px-6 py-3 text-sm text-gray-600">{r.payment || "—"}</td>
//                     <td className="px-6 py-3 text-sm text-right text-green-700">{r.in ? formatCurrency(r.in) : "—"}</td>
//                     <td className="px-6 py-3 text-sm text-right text-red-600">{r.out ? formatCurrency(r.out) : "—"}</td>
//                     <td className={`px-6 py-3 text-sm text-right ${r.balance < 0 ? "text-red-600" : "text-gray-900"}`}>{formatCurrency(r.balance)}</td>
//                   </tr>
//                 )) : (
//                   <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Nenhum lançamento no período</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex flex-col gap-3 border-t bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-gray-600">Itens por página</span>
//               <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
//                 {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
//               </select>
//             </div>
//             <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setPage(p)} className="justify-center" windowSize={1} />
//             <div className="text-sm text-gray-600">{totalItems > 0 ? <>Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong></> : "Nenhum registro"}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Card from "../components/Card";
import { formatCurrency } from "../utils/format";
import { fetchReports } from "../services/api";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const pad = (n) => String(n).padStart(2, "0");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const lastNDays = (n) => {
  const end = new Date();
  const start = new Date(); start.setDate(end.getDate() - (n - 1));
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { start: fmt(start), end: fmt(end) };
};
const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}`; };
const startOfMonth = (ym) => { const [y,m] = ym.split("-").map(Number); return `${y}-${pad(m)}-01`; };
const endOfMonth   = (ym) => { const [y,m] = ym.split("-").map(Number); const last = new Date(y,m,0).getDate(); return `${y}-${pad(m)}-${pad(last)}`; };
const toISO = (date, eod=false) => eod ? `${date}T23:59:59` : `${date}T00:00:00`;

function useDebounce(v, d=350){ const [x,setX]=useState(v); useEffect(()=>{const id=setTimeout(()=>setX(v),d); return ()=>clearTimeout(id)},[v,d]); return x; }

const Input = (props) => <input className="w-full h-10 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200" {...props} />;
const SearchIcon = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const ChevronDown = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><path d="M6 9l6 6 6-6"/></svg>);

function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
  const pages = useMemo(() => {
    if (totalPages <= 1) return [1];
    const o = []; const start = Math.max(2, currentPage - windowSize); const end = Math.min(totalPages - 1, currentPage + windowSize);
    o.push(1); if (start > 2) o.push("…"); for (let p = start; p <= end; p++) o.push(p); if (end < totalPages - 1) o.push("…"); if (totalPages > 1) o.push(totalPages);
    return o;
  }, [currentPage, totalPages, windowSize]);

  return (
    <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
      <button onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">«</button>
      <button onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Anterior</button>
      {pages.map((p,i)=>(
        <button key={`${p}-${i}`} onClick={()=> (p!=="…"? onChange(p):null)} disabled={p==="…"} aria-current={p===currentPage?"page":undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p===currentPage?"bg-black text-white border-black":"hover:bg-gray-100"} ${p==="…"?"cursor-default":""}`}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Próxima</button>
      <button onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">»</button>
    </nav>
  );
}

export default function Reports() {
  // DEFAULT: últimos 7 dias (vai mostrar suas vendas recentes)
  const rng = lastNDays(7);
  const [filters, setFilters] = useState({
    mode: "range",
    date: today(),
    month: thisMonth(),
    startDate: rng.start,
    endDate: rng.end,
    search: "",
  });
  const debouncedSearch = useDebounce(filters.search, 300);

  const [data, setData] = useState({ dailySales: [], monthlySales: [], ledger: [], totals: { revenue: 0, expenses: 0, net: 0 } });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // NOVO: filtro visual por tipo (todos | entradas | saídas)
  const [typeView, setTypeView] = useState("all"); // 'all' | 'in' | 'out'

  const buildParams = () => {
    const common = { search: debouncedSearch };
    if (filters.mode === "day")   return { ...common, from: toISO(filters.date), to: toISO(filters.date,true) };
    if (filters.mode === "month") return { ...common, from: toISO(startOfMonth(filters.month)), to: toISO(endOfMonth(filters.month), true) };
    return { ...common, from: toISO(filters.startDate), to: toISO(filters.endDate, true) };
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchReports(buildParams());
        setData(res || {});
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, debouncedSearch]);

  // ===== Pipeline do ledger =====
  // 1) base ordenada (sem saldo)
  const ledgerBase = useMemo(() => {
    const arr = Array.isArray(data.ledger) ? data.ledger : [];
    return [...arr].sort((a,b)=> new Date(a.date) - new Date(b.date) || a.type.localeCompare(b.type));
  }, [data.ledger]);

  // 2) busca
  const ledgerSearched = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return ledgerBase;
    return ledgerBase.filter(l =>
      `${l.type} ${l.description} ${l.customerName} ${l.payment}`.toLowerCase().includes(q)
    );
  }, [ledgerBase, debouncedSearch]);

  // 3) filtro por tipo (entradas/saídas)
  const ledgerTyped = useMemo(() => {
    if (typeView === "in")  return ledgerSearched.filter(l => Number(l.in || 0)  > 0);
    if (typeView === "out") return ledgerSearched.filter(l => Number(l.out || 0) > 0);
    return ledgerSearched;
  }, [ledgerSearched, typeView]);

  // 4) saldo rodando calculado na visão atual
  const ledgerView = useMemo(() => {
    let running = 0;
    return ledgerTyped.map(item => {
      running += Number(item.in || 0) - Number(item.out || 0);
      return { ...item, balance: running };
    });
  }, [ledgerTyped]);

  // Totais da visão atual (mostrados no cabeçalho da tabela)
  const viewTotals = useMemo(() => {
    const tin  = ledgerTyped.reduce((s,i)=> s + Number(i.in  || 0), 0);
    const tout = ledgerTyped.reduce((s,i)=> s + Number(i.out || 0), 0);
    return { in: tin, out: tout, net: tin - tout };
  }, [ledgerTyped]);

  // Paginação
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  useEffect(()=> setPage(1), [ledgerView, pageSize, typeView]);
  const totalItems = ledgerView.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx   = Math.min(startIdx + pageSize, totalItems);
  const rows     = ledgerView.slice(startIdx, endIdx);

  // Charts (mantidos)
  const dailySalesChartData = {
    labels: (data.dailySales ?? []).map(i => i.date),
    datasets: [{ label: "Vendas Diárias (R$)", data: (data.dailySales ?? []).map(i => i.total), backgroundColor: "rgba(59,130,246,.5)", borderColor: "rgb(59,130,246)", borderWidth: 1 }],
  };
  const monthlySalesChartData = {
    labels: (data.monthlySales ?? []).map(i => i.month),
    datasets: [{ label: "Vendas Mensais (R$)", data: (data.monthlySales ?? []).map(i => i.total), backgroundColor: "rgba(16,185,129,.5)", borderColor: "rgb(16,185,129)", borderWidth: 1 }],
  };
  const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } } };

  // Topbar (datas + busca + export)
  const [openDate, setOpenDate] = useState(false);
  const dateBtnRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false); };
    document.addEventListener("click", h); return () => document.removeEventListener("click", h);
  }, []);
  const setQuick = (days) => { const r = lastNDays(days); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); };
  const setToday = () => { setFilters(f => ({ ...f, mode: "day", date: today() })); setOpenDate(false); };
  const setThisMonth = () => { setFilters(f => ({ ...f, mode: "month", month: thisMonth() })); setOpenDate(false); };

  const searchRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6"><h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1><p className="text-sm text-gray-500">Carregando…</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">{[...Array(5)].map((_,i)=><div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />)}</div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /></div>
      </div>
    );
  }

  const periodLabel =
    filters.mode === "day"   ? filters.date :
    filters.mode === "month" ? filters.month :
    `${filters.startDate} a ${filters.endDate}`;

  const totals = data.totals || { revenue: 0, expenses: 0, net: 0 };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Fluxo de caixa do período (vendas + despesas)</p>
      </div>

      {/* Topbar */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="px-0 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            {[{k:"day",l:"Dia"},{k:"month",l:"Mês"},{k:"range",l:"Período"}].map(t=>(
              <button key={t.k} onClick={()=>setFilters(f=>({...f,mode:t.k}))} className={`relative pb-2 text-sm font-medium ${filters.mode===t.k?"text-gray-900":"text-gray-500 hover:text-gray-700"}`}>
                {t.l}{filters.mode===t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button ref={dateBtnRef} type="button" onClick={()=>setOpenDate(v=>!v)} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
                <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
                {filters.mode==="day"?"Hoje":filters.mode==="month"?"Mês atual":"Período"}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {openDate && (
                <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToday}>Hoje</button>
                    <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setThisMonth}>Mês atual</button>
                    <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={()=>setQuick(7)}>Últimos 7 dias</button>
                    <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={()=>setQuick(30)}>Últimos 30 dias</button>
                  </div>
                  <div className="my-3 h-px bg-gray-100" />
                  {filters.mode==="day" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Dia</div><Input type="date" value={filters.date} onChange={(e)=>setFilters(f=>({...f,date:e.target.value}))} /></div>)}
                  {filters.mode==="month" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Mês</div><Input type="month" value={filters.month} onChange={(e)=>setFilters(f=>({...f,month:e.target.value}))} /></div>)}
                  {filters.mode==="range" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div><div className="text-xs font-semibold text-gray-500 px-1">Início</div><Input type="date" value={filters.startDate} onChange={(e)=>setFilters(f=>({...f,startDate:e.target.value}))} /></div>
                      <div><div className="text-xs font-semibold text-gray-500 px-1">Fim</div><Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e)=>setFilters(f=>({...f,endDate:e.target.value}))} /></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Busca */}
            <div className="relative w-72">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>

            {/* Export CSV (respeita o filtro de tipo + busca) */}
            <button
              type="button"
              onClick={() => {
                setExporting(true);
                try {
                  const headers = ["Data","Tipo","Descrição","Cliente","Pagamento","Entrada","Saída","Saldo"];
                  const csvRows = [headers.join(",")];
                  ledgerView.forEach((r) => {
                    csvRows.push([
                      `"${new Date(r.date).toLocaleString("pt-BR")}"`,
                      `"${r.type}"`,
                      `"${(r.description||"").replaceAll('"','""')}"`,
                      `"${(r.customerName||"").replaceAll('"','""')}"`,
                      `"${(r.payment||"").replaceAll('"','""')}"`,
                      r.in ?? 0,
                      r.out ?? 0,
                      r.balance ?? 0,
                    ].join(","));
                  });
                  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  const label = filters.mode==="day"?filters.date:filters.mode==="month"?filters.month:`${filters.startDate}_a_${filters.endDate}`;
                  a.href = url; a.download = `fluxo_caixa_${typeView}_${label}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                } finally { setExporting(false); }
              }}
              disabled={exporting || totalItems === 0}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-60"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Período */}
      <div className="mt-2 text-sm text-gray-500">Período atual: <strong>{periodLabel}</strong></div>

      {/* KPIs gerais do período (sem filtro de tipo) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Receita no Período"><div className="text-2xl font-semibold">{formatCurrency(totals.revenue)}</div></Card>
        <Card title="Despesas no Período"><div className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expenses)}</div></Card>
        <Card title="Saldo (Receita - Despesas)"><div className={`text-2xl font-semibold ${totals.net < 0 ? "text-red-600" : "text-green-700"}`}>{formatCurrency(totals.net)}</div></Card>
      </div>

      {/* Gráficos (opcionais) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vendas Diárias"><div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div></Card>
        <Card title="Vendas Mensais"><div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div></Card>
      </div>

      {/* ======= TABELA: FLUXO DE CAIXA (com filtro de tipo) ======= */}
      <div className="mt-6">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa</h3>
              {/* Pílulas de filtro de tipo */}
              <div className="inline-flex rounded-md border border-gray-200 overflow-hidden w-max">
                {[
                  {k:"all", label:"Todos"},
                  {k:"in",  label:"Entradas"},
                  {k:"out", label:"Saídas"},
                ].map(t => (
                  <button
                    key={t.k}
                    onClick={()=>setTypeView(t.k)}
                    className={`px-3 py-1.5 text-sm ${typeView===t.k ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Totais da visão atual</p>
              <div className="text-sm text-gray-700">
                <span className="mr-3">Entrada: <strong>{formatCurrency(viewTotals.in)}</strong></span>
                <span className="mr-3">Saída: <strong className="text-red-600">{formatCurrency(viewTotals.out)}</strong></span>
                <span>Saldo: <strong className={viewTotals.net < 0 ? "text-red-600" : "text-gray-900"}>{formatCurrency(viewTotals.net)}</strong></span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Exibindo {totalItems===0?0:startIdx+1}–{endIdx} de {totalItems}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
                  <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Tipo</th>
                  <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Descrição</th>
                  <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Cliente</th>
                  <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Pagamento</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Entrada</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Saída</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.length > 0 ? rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{new Date(r.date).toLocaleString("pt-BR")}</td>
                    <td className="px-6 py-3 text-sm font-medium">{r.type}</td>
                    <td className="px-6 py-3 text-sm">{r.description}</td>
                    <td className="px-6 py-3 text-sm">{r.customerName || "—"}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{r.payment || "—"}</td>
                    <td className="px-6 py-3 text-sm text-right text-green-700">{r.in ? formatCurrency(r.in) : "—"}</td>
                    <td className="px-6 py-3 text-sm text-right text-red-600">{r.out ? formatCurrency(r.out) : "—"}</td>
                    <td className={`px-6 py-3 text-sm text-right ${r.balance < 0 ? "text-red-600":"text-gray-900"}`}>{formatCurrency(r.balance)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Nenhum lançamento no período</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Itens por página</span>
              <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm" value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p)=>setPage(p)} className="justify-center" windowSize={1}/>
            <div className="text-sm text-gray-600">{totalItems>0 ? <>Exibindo <strong>{startIdx+1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong></> : "Nenhum registro"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

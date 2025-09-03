// // // import React, { useState, useEffect } from 'react';
// // // import { formatCurrency } from '../utils/format';
// // // import ExpenseForm from '../components/ExpenseForm';
// // // import PageHeader from '../components/PageHeader';

// // // const Expenses = () => {
// // //   const [expenses, setExpenses] = useState([]);
// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editingExpense, setEditingExpense] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     fetchExpenses();
// // //   }, []);

// // //   const fetchExpenses = async () => {
// // //     try {
// // //       const response = await fetch('/api/expenses');
// // //       const data = await response.json();
// // //       setExpenses(data);
// // //     } catch (error) {
// // //       console.error('Erro ao buscar despesas:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleCreateExpense = async (expenseData) => {
// // //     try {
// // //       const response = await fetch('/api/expenses', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(expenseData),
// // //       });

// // //       if (response.ok) {
// // //         await fetchExpenses();
// // //         setShowForm(false);
// // //       }
// // //     } catch (error) {
// // //       console.error('Erro ao criar despesa:', error);
// // //     }
// // //   };

// // //   const handleUpdateExpense = async (expenseData) => {
// // //     try {
// // //       const response = await fetch(`/api/expenses/${editingExpense.id}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(expenseData),
// // //       });

// // //       if (response.ok) {
// // //         await fetchExpenses();
// // //         setEditingExpense(null);
// // //       }
// // //     } catch (error) {
// // //       console.error('Erro ao atualizar despesa:', error);
// // //     }
// // //   };

// // //   const handleDeleteExpense = async (id) => {
// // //     if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
// // //       try {
// // //         const response = await fetch(`/api/expenses/${id}`, {
// // //           method: 'DELETE',
// // //         });

// // //         if (response.ok) {
// // //           await fetchExpenses();
// // //         }
// // //       } catch (error) {
// // //         console.error('Erro ao excluir despesa:', error);
// // //       }
// // //     }
// // //   };

// // //   const handleEdit = (expense) => {
// // //     setEditingExpense(expense);
// // //     setShowForm(true);
// // //   };

// // //   const handleCancel = () => {
// // //     setShowForm(false);
// // //     setEditingExpense(null);
// // //   };

// // //   const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center h-64">
// // //         <div className="text-lg text-gray-600">Carregando...</div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6">
// // //       <PageHeader 
// // //         title="Despesas" 
// // //         subtitle="Gerencie as despesas da empresa"
// // //         buttonText="Nova Despesa"
// // //         onButtonClick={() => setShowForm(true)}
// // //       />

// // //       {showForm && (
// // //         <div className="mb-6">
// // //           <ExpenseForm
// // //             expense={editingExpense}
// // //             onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
// // //             onCancel={handleCancel}
// // //           />
// // //         </div>
// // //       )}

// // //       <div className="bg-white rounded-lg shadow-md overflow-hidden">
// // //         <div className="px-6 py-4 bg-gray-50 border-b">
// // //           <div className="flex justify-between items-center">
// // //             <h3 className="text-lg font-semibold text-gray-800">
// // //               Lista de Despesas
// // //             </h3>
// // //             <div className="text-right">
// // //               <p className="text-sm text-gray-600">Total de Despesas</p>
// // //               <p className="text-2xl font-bold text-red-600">
// // //                 {formatCurrency(totalExpenses)}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="overflow-x-auto">
// // //           <table className="min-w-full divide-y divide-gray-200">
// // //             <thead className="bg-gray-50">
// // //               <tr>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Data
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Descrição
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Valor
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Ações
// // //                 </th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="bg-white divide-y divide-gray-200">
// // //               {expenses.length === 0 ? (
// // //                 <tr>
// // //                   <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
// // //                     Nenhuma despesa encontrada
// // //                   </td>
// // //                 </tr>
// // //               ) : (
// // //                 expenses.map((expense) => (
// // //                   <tr key={expense.id} className="hover:bg-gray-50">
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // //                       {new Date(expense.date).toLocaleDateString('pt-BR')}
// // //                     </td>
// // //                     <td className="px-6 py-4 text-sm text-gray-900">
// // //                       {expense.description}
// // //                     </td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
// // //                       {formatCurrency(expense.value)}
// // //                     </td>
// // //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// // //                       <div className="flex space-x-2">
// // //                         <button
// // //                           onClick={() => handleEdit(expense)}
// // //                           className="text-blue-600 hover:text-blue-900"
// // //                         >
// // //                           Editar
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDeleteExpense(expense.id)}
// // //                           className="text-red-600 hover:text-red-900"
// // //                         >
// // //                           Excluir
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Expenses;


// // // src/pages/InventoryRequests.jsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import PageHeader from "../components/PageHeader";

// // const STATUS = {
// //   Approved: { badge: "bg-blue-50 text-blue-700", label: "Approved" },
// //   Pending: { badge: "bg-yellow-100 text-yellow-800", label: "Pending" },
// // };

// // function formatDue(iso) {
// //   const d = new Date(iso);
// //   const dd = String(d.getDate()).padStart(2, "0");
// //   const mm = String(d.getMonth() + 1).padStart(2, "0");
// //   const yyyy = d.getFullYear();

// //   let h = d.getHours();
// //   const m = String(d.getMinutes()).padStart(2, "0");
// //   const ampm = h >= 12 ? "PM" : "AM";
// //   h = h % 12 || 12;

// //   return { date: `${dd}.${mm}.${yyyy}`, time: `${h}:${m} ${ampm}` };
// // }

// // export default function InventoryRequests() {
// //   const [requests, setRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [tab, setTab] = useState("total"); // total | approved | pending
// //   const [q, setQ] = useState("");
// //   const [selectAll, setSelectAll] = useState(false);
// //   const [selected, setSelected] = useState(new Set());

// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   const fetchRequests = async () => {
// //     setLoading(true);
// //     try {
// //       // ajuste o endpoint conforme seu backend
// //       const res = await fetch("/api/inventory-requests");
// //       if (!res.ok) throw new Error("Falha ao buscar requests");
// //       const data = await res.json();
// //       setRequests(data);
// //     } catch (e) {
// //       console.error(e);
// //       // dados de exemplo para a UI (remova quando integrar à API)
// //       setRequests([
// //         {
// //           id: 1,
// //           orderId: "0957746KJLY",
// //           description: "Item List : Widgets…",
// //           qty: 10,
// //           status: "Approved",
// //           bom: "BOM–Rizz–0523–001",
// //           dueDate: "2020-12-24T11:16:00.000Z",
// //         },
// //         {
// //           id: 2,
// //           orderId: "0957746KJLY",
// //           description: "Item List : Widgets…",
// //           qty: 7,
// //           status: "Pending",
// //           bom: "BOM–Rizz–0523–001",
// //           dueDate: "2020-12-24T11:16:00.000Z",
// //         },
// //         {
// //           id: 3,
// //           orderId: "0957746KJLY",
// //           description: "Item List : Widgets…",
// //           qty: 8,
// //           status: "Pending",
// //           bom: "BOM–Rizz–0523–001",
// //           dueDate: "2020-12-24T11:16:00.000Z",
// //         },
// //         {
// //           id: 4,
// //           orderId: "0957746KJLY",
// //           description: "Item List : Widgets…",
// //           qty: 6,
// //           status: "Pending",
// //           bom: "BOM–Rizz–0523–001",
// //           dueDate: "2020-12-24T11:16:00.000Z",
// //         },
// //         {
// //           id: 5,
// //           orderId: "0957746KJLY",
// //           description: "Item List : Widgets…",
// //           qty: 6,
// //           status: "Pending",
// //           bom: "BOM–Rizz–0523–001",
// //           dueDate: "2020-12-24T11:16:00.000Z",
// //         },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const rowsByTab = useMemo(() => {
// //     if (tab === "approved") return requests.filter(r => r.status === "Approved");
// //     if (tab === "pending") return requests.filter(r => r.status === "Pending");
// //     return requests;
// //   }, [requests, tab]);

// //   const filtered = useMemo(() => {
// //     const s = q.trim().toLowerCase();
// //     if (!s) return rowsByTab;
// //     return rowsByTab.filter(r =>
// //       [r.orderId, r.description, r.status, r.bom, r.qty]
// //         .join(" ")
// //         .toLowerCase()
// //         .includes(s)
// //     );
// //   }, [rowsByTab, q]);

// //   const toggleOne = (id) => {
// //     const next = new Set(selected);
// //     if (next.has(id)) next.delete(id);
// //     else next.add(id);
// //     setSelected(next);
// //     setSelectAll(next.size > 0 && next.size === filtered.length);
// //   };

// //   const toggleAll = (checked) => {
// //     setSelectAll(checked);
// //     setSelected(checked ? new Set(filtered.map(r => r.id)) : new Set());
// //   };

// //   return (
// //     <div className="p-6">
// //       <PageHeader
// //         title="Inventory Requests"
// //         subtitle="You have requests awaiting your approval"
// //       />

// //       {/* Tabs */}
// //       <div className="mt-6 border-b">
// //         <nav className="-mb-px flex space-x-8 text-sm font-semibold">
// //           <button
// //             className={`py-3 border-b-2 ${
// //               tab === "total"
// //                 ? "border-blue-700 text-gray-900"
// //                 : "border-transparent text-gray-600 hover:text-gray-900"
// //             }`}
// //             onClick={() => setTab("total")}
// //           >
// //             Total Requests
// //           </button>
// //           <button
// //             className={`py-3 border-b-2 ${
// //               tab === "approved"
// //                 ? "border-blue-700 text-gray-900"
// //                 : "border-transparent text-gray-600 hover:text-gray-900"
// //             }`}
// //             onClick={() => setTab("approved")}
// //           >
// //             Approved Requests
// //           </button>
// //           <button
// //             className={`py-3 border-b-2 ${
// //               tab === "pending"
// //                 ? "border-blue-700 text-gray-900"
// //                 : "border-transparent text-gray-600 hover:text-gray-900"
// //             }`}
// //             onClick={() => setTab("pending")}
// //           >
// //             Pending Requests
// //           </button>
// //         </nav>
// //       </div>

// //       {/* Toolbar */}
// //       <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
// //         <div className="flex items-center gap-3">
// //           <button className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
// //             <span className="i">📅</span> Last 30 days
// //           </button>
// //           <div className="h-7 w-px bg-gray-200" />
// //           <button className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
// //             Filter by ▾
// //           </button>
// //         </div>

// //         <div className="flex items-center gap-3">
// //           <div className="flex w-full md:w-96 items-center gap-2 rounded-md border bg-white px-3 py-2">
// //             <span className="text-gray-500">🔍</span>
// //             <input
// //               value={q}
// //               onChange={(e) => setQ(e.target.value)}
// //               className="w-full border-none p-0 text-sm outline-none placeholder:text-gray-400"
// //               placeholder="Search or type a command (Ctrl + G)"
// //             />
// //           </div>
// //           <button
// //             onClick={() => alert("Create Request")}
// //             className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
// //           >
// //             Create Request ▸
// //           </button>
// //         </div>
// //       </div>

// //       {/* Table */}
// //       <div className="mt-4 overflow-hidden rounded-lg border bg-white shadow">
// //         {loading ? (
// //           <div className="flex h-60 items-center justify-center text-gray-600">
// //             Carregando…
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full border-separate border-spacing-0">
// //               <thead>
// //                 <tr className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
// //                   <th className="w-10 px-4 py-3">
// //                     <input
// //                       type="checkbox"
// //                       checked={selectAll}
// //                       onChange={(e) => toggleAll(e.target.checked)}
// //                     />
// //                   </th>
// //                   <th className="w-14 px-4 py-3">No.</th>
// //                   <th className="px-4 py-3">
// //                     Order ID <span className="text-red-500">*</span>
// //                   </th>
// //                   <th className="px-4 py-3">Description</th>
// //                   <th className="w-24 px-4 py-3">
// //                     Qty <span className="text-red-500">*</span>
// //                   </th>
// //                   <th className="w-44 px-4 py-3">Approval Status</th>
// //                   <th className="px-4 py-3">Bill of Materials</th>
// //                   <th className="w-44 px-4 py-3">Due Date</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 text-sm">
// //                 {filtered.length === 0 ? (
// //                   <tr>
// //                     <td
// //                       className="px-4 py-6 text-center text-gray-500"
// //                       colSpan={8}
// //                     >
// //                       Nenhuma solicitação encontrada
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   filtered.map((r, i) => {
// //                     const { date, time } = formatDue(r.dueDate);
// //                     const st = STATUS[r.status] ?? STATUS.Pending;
// //                     const checked = selected.has(r.id);
// //                     return (
// //                       <tr key={r.id} className="hover:bg-gray-50">
// //                         <td className="px-4 py-3">
// //                           <input
// //                             type="checkbox"
// //                             checked={checked}
// //                             onChange={() => toggleOne(r.id)}
// //                           />
// //                         </td>
// //                         <td className="px-4 py-3 text-gray-500">{i + 1}</td>
// //                         <td className="px-4 py-3 font-mono">{r.orderId}</td>
// //                         <td className="px-4 py-3 max-w-[280px] truncate" title={r.description}>
// //                           {r.description}
// //                         </td>
// //                         <td className="px-4 py-3 font-semibold">{r.qty}</td>
// //                         <td className="px-4 py-3">
// //                           <span
// //                             className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${st.badge}`}
// //                           >
// //                             {st.label}
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3 font-mono">{r.bom}</td>
// //                         <td className="px-4 py-3">
// //                           <div className="font-semibold">{date}</div>
// //                           <div className="text-xs text-gray-500">{time}</div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //         {!loading && (
// //           <div className="flex items-center justify-end gap-3 bg-white px-4 py-3 text-sm text-gray-600">
// //             {selected.size > 0 ? (
// //               <span>{selected.size} selecionado(s)</span>
// //             ) : (
// //               <span>
// //                 Mostrando {filtered.length} de {rowsByTab.length} requests
// //               </span>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect, useMemo } from "react";
// import ExpenseForm from "../components/ExpenseForm";
// import PageHeader from "../components/PageHeader";
// import { formatCurrency, formatDate, parseLocalDate } from "../utils/format";


// import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

// // Util: simple badge like the screenshot
// const StatusBadge = ({ status }) => {
//   if (!status) return <span className="text-gray-400">—</span>;
//   const map = {
//     approved: {
//       label: "Aprovada",
//       cls: "bg-blue-100 text-blue-700 border-blue-200",
//     },
//     pending: {
//       label: "Pendente",
//       cls: "bg-yellow-100 text-yellow-700 border-yellow-200",
//     },
//     rejected: {
//       label: "Rejeitada",
//       cls: "bg-red-100 text-red-700 border-red-200",
//     },
//   };
//   const found = map[status] || { label: status, cls: "bg-gray-100 text-gray-700 border-gray-200" };
//   return (
//     <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${found.cls}`}>
//       {found.label}
//     </span>
//   );
// };

// const ChevronRight = (props) => (
//   <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={props.className}>
//     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 018.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//   </svg>
// );

// const SearchIcon = (props) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
//     <circle cx="11" cy="11" r="7"></circle>
//     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//   </svg>
// );

// const Expenses = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // UI state for the screenshot-like layout
//   const [activeTab, setActiveTab] = useState("todas"); // todas | pagas | pendentes
//   const [query, setQuery] = useState("");
//   const [dateRange, setDateRange] = useState("30"); // days: 7 | 30 | 365

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const response = await fetch("/api/expenses");
//       const data = await response.json();
//       setExpenses(data);
//     } catch (error) {
//       console.error("Erro ao buscar despesas:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateExpense = async (expenseData) => {
//     try {
//       const response = await fetch("/api/expenses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(expenseData),
//       });
//       if (response.ok) {
//         await fetchExpenses();
//         setShowForm(false);
//       }
//     } catch (error) {
//       console.error("Erro ao criar despesa:", error);
//     }
//   };

//   const handleUpdateExpense = async (expenseData) => {
//     try {
//       const response = await fetch(`/api/expenses/${editingExpense.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(expenseData),
//       });
//       if (response.ok) {
//         await fetchExpenses();
//         setEditingExpense(null);
//       }
//     } catch (error) {
//       console.error("Erro ao atualizar despesa:", error);
//     }
//   };

//   const handleDeleteExpense = async (id) => {
//     if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
//       try {
//         const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
//         if (response.ok) await fetchExpenses();
//       } catch (error) {
//         console.error("Erro ao excluir despesa:", error);
//       }
//     }
//   };

//   const handleEdit = (expense) => {
//     setEditingExpense(expense);
//     setShowForm(true);
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingExpense(null);
//   };

//   // Derivations like the screenshot filters
//   const filtered = useMemo(() => {
//     const now = new Date();
//     const limit = new Date(now);
//     limit.setDate(now.getDate() - Number(dateRange));

//     return expenses
//       .filter((e) => {
//         const d = parseLocalDate(e.date);
//         if (d && d < limit) return false;
//         return true;
//       })
//       .filter((e) => {
//         if (!query) return true;
//         const hay = `${e.description ?? ""} ${String(e.value ?? "").replace(/\D/g, "")}`.toLowerCase();
//         return hay.includes(query.toLowerCase());
//       })
//       .filter((e) => {
//         if (activeTab === "pagas") return (e.status ?? "").toLowerCase() === "approved" || (e.status ?? "").toLowerCase() === "aprovada";
//         if (activeTab === "pendentes") return (e.status ?? "").toLowerCase() === "pending" || (e.status ?? "").toLowerCase() === "pendente";
//         return true; // todas
//       });
//   }, [expenses, query, dateRange, activeTab]);

//   const totalExpenses = useMemo(() => filtered.reduce((sum, e) => sum + (Number(e.value) || 0), 0), [filtered]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-gray-600">Carregando...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header like the screenshot */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Despesas</h1>
//         <p className="text-sm text-gray-500">Você tem lançamentos aguardando sua aprovação</p>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-6">
//           {[
//             { key: "todas", label: "Todas as Despesas" },
//             { key: "pagas", label: "Pagas" },
//             { key: "pendentes", label: "Pendentes" },
//           ].map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
//                 activeTab === tab.key
//                   ? "border-gray-900 text-gray-900"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Toolbar */}
//       <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3">
//           {/* Date range */}
//           <div className="relative">
//             <select
//               className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//             >
//               <option value="7">Últimos 7 dias</option>
//               <option value="30">Últimos 30 dias</option>
//               <option value="365">Últimos 12 meses</option>
//             </select>
//             <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
//           </div>

//           {/* Placeholder Filter by (can be wired later) */}
//           <div className="relative">
//             <select className="appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5">
//               <option>Filtrar por</option>
//               <option>Categoria</option>
//               <option>Centro de Custo</option>
//             </select>
//             <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Search */}
//           <div className="relative w-full sm:w-80">
//             <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Pesquisar ou use Ctrl + G"
//               className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//             />
//           </div>

//           {/* Create button */}
//           <button
//             onClick={() => setShowForm(true)}
//             className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/30"
//           >
//             Nova Despesa <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* Form */}
//       {showForm && (
//         <div className="mb-6">
//           <ExpenseForm
//             expense={editingExpense}
//             onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
//             onCancel={handleCancel}
//           />
//         </div>
//       )}

//       {/* Card + table like the screenshot */}
//       <div className="overflow-hidden rounded-lg bg-white shadow">
//         <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Lista de Despesas</h3>
//             <p className="text-sm text-gray-500">Resumo de lançamentos no período selecionado</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Total</p>
//             <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No.</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Descrição</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Valor</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
//                     Nenhuma despesa encontrada  
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((expense, idx) => (
//                   <tr key={expense.id} className="hover:bg-gray-50">
//                     <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{expense.id ?? "—"}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                       {formatDate(expense.date)}
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-red-600">
//                       {formatCurrency(Number(expense.value) || 0)}
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm">
//                       <StatusBadge status={(expense.status || "").toLowerCase()} />
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm">
//                       <div className="flex items-center gap-3">
//                         <button
//                           onClick={() => handleEdit(expense)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                         <PencilIcon className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteExpense(expense.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                          <TrashIcon className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Expenses;



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

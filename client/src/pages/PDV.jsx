// // // // src/pages/PDVPro.jsx
// // // import { useReducer, useEffect, useMemo, useRef, useState } from "react";
// // // import { toast } from "react-toastify";
// // // import {
// // //   PlusIcon,
// // //   MinusIcon,
// // //   TrashIcon,
// // //   CreditCardIcon,
// // //   UserPlusIcon,
// // //   ShoppingCartIcon,
// // //   PrinterIcon,
// // //   ArrowPathIcon,
// // //   PauseIcon,
// // //   PlayIcon,
// // //   XMarkIcon,
// // //   EyeSlashIcon,
// // //   EyeIcon,
// // // } from "@heroicons/react/24/outline";
// // // import PageHeader from "../components/PageHeader";
// // // import { formatCurrency } from "../utils/format";
// // // import {
// // //   fetchProducts,
// // //   createSale,
// // //   fetchCustomers,
// // //   createCustomer,
// // // } from "../services/api";

// // // /**
// // //  * PDV PRO — compatível com seu backend:
// // //  * - createSale({ items[], payments[], total, ...extras })
// // //  * Extras enviados (server pode ignorar): subtotal, discount, surcharge, change, notes
// // //  */

// // // const MACHINE_OPTIONS = [
// // //   { id: "machine_a", name: "Máquina A" },
// // //   { id: "machine_b", name: "Máquina B" },
// // //   { id: "machine_c", name: "Máquina C" },
// // // ];

// // // const PAYMENT_METHODS = [
// // //   "Dinheiro",
// // //   "PIX",
// // //   "Cartão de Crédito",
// // //   "Cartão de Débito",
// // //   "Transferência",
// // // ];

// // // const PARKED_KEY = "pdv_parked_sales_v1";

// // // const initialState = {
// // //   products: [],
// // //   customers: [],
// // //   filteredProducts: [],
// // //   isLoading: true,
// // //   searchTerm: "",
// // //   cart: [], // {id,name,brand,price,quantity,stock,total}
// // //   selectedCustomerId: "",
// // //   quickCustomerName: "",
// // //   showQuickCustomer: false,

// // //   // pagamentos: {id, method, amount, machine?, installments?}
// // //   payments: [],

// // //   // totais
// // //   discountValue: 0,
// // //   discountPct: 0, // se > 0, ignora discountValue
// // //   surchargeValue: 0,

// // //   printReceipt: true,
// // //   notes: "",

// // //   // estacionadas
// // //   parked: [], // [{id, createdAt, snapshot}]
// // // };

// // // function readParked() {
// // //   try { const raw = localStorage.getItem(PARKED_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
// // // }
// // // function writeParked(arr) { localStorage.setItem(PARKED_KEY, JSON.stringify(arr)); }

// // // function reducer(state, action) {
// // //   switch (action.type) {
// // //     case "SET_DATA": {
// // //       const { products, customers } = action.payload;
// // //       const available = products.filter((p) => Number(p.stock) > 0);
// // //       return { ...state, products, customers, filteredProducts: available, isLoading: false, parked: readParked() };
// // //     }
// // //     case "SET_LOADING": return { ...state, isLoading: action.payload };
// // //     case "SET_SEARCH": {
// // //       const searchTerm = action.payload.trim().toLowerCase();
// // //       const filtered = searchTerm
// // //         ? state.products.filter((p) => `${p.name} ${p.brand} ${p.code ?? ""}`.toLowerCase().includes(searchTerm))
// // //         : state.products.filter((p) => Number(p.stock) > 0);
// // //       return { ...state, searchTerm: action.payload, filteredProducts: filtered };
// // //     }

// // //     // CART
// // //     case "ADD_TO_CART": {
// // //       const p = action.payload;
// // //       const existing = state.cart.find((i) => i.id === p.id);
// // //       if (existing) {
// // //         if (existing.quantity >= p.stock) { toast.warning(`Estoque máximo atingido para ${p.name}`); return state; }
// // //         const cart = state.cart.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
// // //         return { ...state, cart };
// // //       }
// // //       return { ...state, cart: [...state.cart, { id: p.id, name: p.name, brand: p.brand, price: Number(p.price)||0, quantity: 1, stock: Number(p.stock)||0, total: Number(p.price)||0 }] };
// // //     }
// // //     case "REMOVE_FROM_CART": return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
// // //     case "UPDATE_QTY": {
// // //       const { id, qty } = action.payload;
// // //       if (qty <= 0) return state;
// // //       const it = state.cart.find((i) => i.id === id); if (!it) return state;
// // //       if (qty > it.stock) { toast.warning(`Estoque máximo atingido para ${it.name}`); return state; }
// // //       const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i));
// // //       return { ...state, cart };
// // //     }
// // //     case "CLEAR_CART": return { ...state, cart: [] };

// // //     // CLIENTE
// // //     case "SET_CUSTOMER": return { ...state, selectedCustomerId: action.payload };
// // //     case "SET_QUICK_CUSTOMER": return { ...state, quickCustomerName: action.payload };
// // //     case "TOGGLE_QUICK_CUSTOMER": return { ...state, showQuickCustomer: !state.showQuickCustomer };

// // //     // PAGAMENTOS
// // //     case "ADD_PAYMENT": {
// // //       const remaining = action.payload;
// // //       if (remaining <= 0) { toast.info("Nada a adicionar — total já coberto."); return state; }
// // //       const pm = { id: Date.now(), method: "Dinheiro", amount: Number(remaining.toFixed(2)), machine: "", installments: 1 };
// // //       return { ...state, payments: [...state.payments, pm] };
// // //     }
// // //     case "UPDATE_PAYMENT": {
// // //       const { id, field, value } = action.payload;
// // //       const payments = state.payments.map((pm) =>
// // //         pm.id === id
// // //           ? { ...pm,
// // //               [field]: (field === "amount" || field === "installments") ? (Number(value) || 0) : value,
// // //               ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito" ? { machine: "", installments: 1 } : {}),
// // //             }
// // //           : pm
// // //       );
// // //       return { ...state, payments };
// // //     }
// // //     case "REMOVE_PAYMENT": return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) };
// // //     case "CLEAR_PAYMENTS": return { ...state, payments: [] };

// // //     // TOTAIS
// // //     case "SET_DISCOUNT_VALUE": return { ...state, discountValue: Number(action.payload) || 0, discountPct: 0 };
// // //     case "SET_DISCOUNT_PCT": return { ...state, discountPct: Number(action.payload) || 0 };
// // //     case "SET_SURCHARGE": return { ...state, surchargeValue: Number(action.payload) || 0 };

// // //     // OUTROS
// // //     case "SET_PRINT": return { ...state, printReceipt: !!action.payload };
// // //     case "SET_NOTES": return { ...state, notes: action.payload };

// // //     // ESTACIONAR
// // //     case "LOAD_PARKED": return { ...state, parked: readParked() };
// // //     case "PARK_CURRENT": {
// // //       const snapshot = {
// // //         cart: state.cart,
// // //         payments: state.payments,
// // //         selectedCustomerId: state.selectedCustomerId,
// // //         discountValue: state.discountValue,
// // //         discountPct: state.discountPct,
// // //         surchargeValue: state.surchargeValue,
// // //         notes: state.notes,
// // //       };
// // //       const entry = { id: Date.now(), createdAt: new Date().toISOString(), snapshot };
// // //       const next = [entry, ...state.parked];
// // //       writeParked(next);
// // //       toast.success("Venda estacionada!");
// // //       return { ...state, parked: next };
// // //     }
// // //     case "RESUME_PARKED": {
// // //       const id = action.payload;
// // //       const entry = state.parked.find((p) => p.id === id);
// // //       if (!entry) return state;
// // //       return { ...state, ...entry.snapshot };
// // //     }
// // //     case "DELETE_PARKED": {
// // //       const id = action.payload;
// // //       const next = state.parked.filter((p) => p.id !== id);
// // //       writeParked(next);
// // //       return { ...state, parked: next };
// // //     }

// // //     case "RESET_ALL":
// // //       return { ...initialState, products: state.products, customers: state.customers, filteredProducts: state.filteredProducts, parked: state.parked };
// // //     default:
// // //       return state;
// // //   }
// // // }

// // // export default function PDVPro() {
// // //   const [state, dispatch] = useReducer(reducer, initialState);
// // //   const [showProducts, setShowProducts] = useState(true); // <- NOVO: mostrar/ocultar coluna de produtos
// // //   const searchRef = useRef(null);

// // //   // Load data
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         dispatch({ type: "SET_LOADING", payload: true });
// // //         const [prods, custs] = await Promise.all([fetchProducts(), fetchCustomers()]);
// // //         dispatch({ type: "SET_DATA", payload: { products: prods, customers: custs } });
// // //       } catch (e) {
// // //         console.error(e);
// // //         toast.error("Erro ao carregar dados");
// // //       } finally {
// // //         dispatch({ type: "SET_LOADING", payload: false });
// // //       }
// // //     })();
// // //   }, []);

// // //   // Atalhos
// // //   useEffect(() => {
// // //     const onKey = (e) => {
// // //       if (e.key === "F4") { e.preventDefault(); searchRef.current?.focus();
// // //       } else if (e.key === "F2") { e.preventDefault(); dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) });
// // //       } else if (e.key === "F3") { e.preventDefault(); handleFinalize();
// // //       } else if (e.key === "F8") { e.preventDefault(); setShowProducts((v) => !v); }
// // //     };
// // //     window.addEventListener("keydown", onKey);
// // //     return () => window.removeEventListener("keydown", onKey);
// // //   });

// // //   // Totais
// // //   const subtotal = useMemo(() => state.cart.reduce((s, i) => s + i.total, 0), [state.cart]);
// // //   const discountFromPct = useMemo(() => {
// // //     const pct = Math.max(0, Math.min(100, state.discountPct || 0));
// // //     return Number(((subtotal * pct) / 100).toFixed(2));
// // //   }, [subtotal, state.discountPct]);
// // //   const discount = state.discountPct > 0 ? discountFromPct : Math.min(state.discountValue || 0, subtotal);
// // //   const surcharge = Math.max(0, state.surchargeValue || 0);
// // //   const totalDue = useMemo(() => Math.max(0, Number((subtotal - discount + surcharge).toFixed(2))), [subtotal, discount, surcharge]);
// // //   const totalPayments = useMemo(() => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0), [state.payments]);
// // //   const remaining = Number((totalDue - totalPayments).toFixed(2));
// // //   const change = remaining < 0 ? Math.abs(remaining) : 0;

// // //   const addDefaultPaymentIfEmpty = () => {
// // //     if (state.cart.length === 0) return toast.error("Adicione produtos ao carrinho.");
// // //     if (state.payments.length === 0) dispatch({ type: "ADD_PAYMENT", payload: totalDue });
// // //   };

// // //   const handleQuickCustomerAdd = async () => {
// // //     const name = state.quickCustomerName?.trim();
// // //     if (!name) return toast.error("Digite o nome do cliente.");
// // //     try {
// // //       const created = await createCustomer({ name });
// // //       toast.success("Cliente adicionado");
// // //       dispatch({ type: "SET_DATA", payload: { products: state.products, customers: [...state.customers, created] } });
// // //       dispatch({ type: "SET_CUSTOMER", payload: created.id });
// // //       dispatch({ type: "SET_QUICK_CUSTOMER", payload: "" });
// // //       if (state.showQuickCustomer) dispatch({ type: "TOGGLE_QUICK_CUSTOMER" });
// // //     } catch (e) {
// // //       console.error(e);
// // //       toast.error("Erro ao adicionar cliente");
// // //     }
// // //   };

// // //   const validateBeforeFinalize = () => {
// // //     if (state.cart.length === 0) return toast.error("Carrinho vazio."), false;
// // //     if (state.payments.length === 0) return toast.error("Adicione um método de pagamento."), false;
// // //     if (totalPayments + 0.001 < totalDue) return toast.error("Pagamentos devem cobrir o total."), false;
// // //     const cardPays = state.payments.filter((p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito");
// // //     if (cardPays.some((p) => !p.machine)) return toast.error("Selecione a máquina para todos cartões."), false;
// // //     return true;
// // //   };

// // //   const openReceipt = (payload) => {
// // //     try {
// // //       const toBRL = (n) => (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// // //       const d = new Date(payload.date);
// // //       const itemsRows = payload.items.map((it) => `<tr><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${toBRL(it.unitPrice)}</td><td style="text-align:right">${toBRL(it.total)}</td></tr>`).join("");
// // //       const payRows = (payload.payments || []).map((pm) => `<div>${pm.method}${pm.machine ? " (" + pm.machine + ")" : ""}${pm.installments > 1 ? ` ${pm.installments}x` : ""}: <strong>${toBRL(pm.amount)}</strong></div>`).join("");
// // //       const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Recibo</title>
// // //       <style>body{font-family:Arial,sans-serif;margin:16px}h1{font-size:18px;margin:0}small{color:#555}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border-bottom:1px solid #eee;padding:6px 4px;font-size:12px}.right{text-align:right}.tot{margin-top:8px;border-top:1px dashed #333;padding-top:8px}</style>
// // //       <body><h1>Recibo de Venda</h1><small>${d.toLocaleString("pt-BR")}</small>
// // //       <div style="margin-top:6px">Cliente: <strong>${payload.customerName || "—"}</strong></div>
// // //       <table><thead><tr><th>Produto</th><th class="right">Qtd</th><th class="right">Unit.</th><th class="right">Total</th></tr></thead><tbody>${itemsRows}</tbody></table>
// // //       <div class="tot"><div>Subtotal: <strong>${toBRL(payload.subtotal)}</strong></div>
// // //       <div>Desconto: <strong>${toBRL(payload.discount)}</strong> &nbsp; Acréscimo: <strong>${toBRL(payload.surcharge)}</strong></div>
// // //       <div>Total: <strong>${toBRL(payload.total)}</strong></div>${payload.change > 0 ? `<div>Troco: <strong>${toBRL(payload.change)}</strong></div>` : ""}</div>
// // //       <div style="margin-top:8px">${payRows}</div>${payload.notes ? `<div style="margin-top:8px"><em>${payload.notes}</em></div>` : ""}
// // //       <script>window.onload=()=>{window.print()}</script></body></html>`;
// // //       const w = window.open("", "_blank"); w.document.write(html); w.document.close();
// // //     } catch {}
// // //   };

// // //   const handleFinalize = async () => {
// // //     if (!validateBeforeFinalize()) return;
// // //     const customerName = state.selectedCustomerId
// // //       ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
// // //       : "Cliente não identificado";

// // //     const payload = {
// // //       customerId: state.selectedCustomerId || null,
// // //       customerName,
// // //       items: state.cart.map((i) => ({ productId: i.id, name: i.name, qty: i.quantity, unitPrice: i.price, total: i.total })),
// // //       payments: state.payments,
// // //       subtotal, discount, surcharge,
// // //       total: totalDue,
// // //       change,
// // //       notes: state.notes?.trim() || undefined,
// // //       date: new Date().toISOString(),
// // //     };

// // //     try {
// // //       await createSale(payload);
// // //       toast.success("Venda finalizada!");
// // //       if (state.printReceipt) openReceipt(payload);
// // //       dispatch({ type: "RESET_ALL" });
// // //       const prods = await fetchProducts();
// // //       dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } });
// // //     } catch (e) {
// // //       console.error(e);
// // //       toast.error("Erro ao finalizar venda");
// // //     }
// // //   };

// // //   const firstFiltered = state.filteredProducts[0];

// // //   return (
// // //     <div className="relative">
// // //       <PageHeader title="PDV Pro" subtitle="Checkout em destaque. Produtos como apoio, sem roubar a cena." />

// // //       {/* Top bar */}
// // //       <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
// // //         <div className="flex-1 flex gap-2">
// // //           <input
// // //             ref={searchRef}
// // //             type="text"
// // //             placeholder="F4 para focar — busque por nome, marca ou código… (Enter adiciona o 1º resultado)"
// // //             className="input-field flex-1"
// // //             value={state.searchTerm}
// // //             onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
// // //             onKeyDown={(e) => { if (e.key === "Enter" && firstFiltered) dispatch({ type: "ADD_TO_CART", payload: firstFiltered }); }}
// // //           />
// // //           <button onClick={addDefaultPaymentIfEmpty} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" title="F2 — adiciona método com o restante">
// // //             <CreditCardIcon className="w-5 h-5" />
// // //           </button>
// // //           <button onClick={() => { dispatch({ type: "PARK_CURRENT" }); dispatch({ type: "RESET_ALL" }); }} className="px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700" title="Estacionar venda atual">
// // //             <PauseIcon className="w-5 h-5" />
// // //           </button>
// // //           <button onClick={() => dispatch({ type: "LOAD_PARKED" })} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" title="Recarregar estacionadas">
// // //             <ArrowPathIcon className="w-5 h-5" />
// // //           </button>
// // //         </div>

// // //         <div className="flex items-center gap-2">
// // //           <button
// // //             onClick={() => setShowProducts((v) => !v)}
// // //             className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
// // //             title="F8 — mostrar/ocultar lista de produtos"
// // //           >
// // //             {showProducts ? <><EyeSlashIcon className="w-5 h-5 inline mr-1" /> Ocultar produtos</> : <><EyeIcon className="w-5 h-5 inline mr-1" /> Mostrar produtos</>}
// // //           </button>
// // //           <div className="hidden lg:flex items-center text-sm bg-gray-100 rounded-md px-3 py-2">
// // //             <ShoppingCartIcon className="w-5 h-5 mr-2" /> {state.cart.length} itens
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* GRID: Checkout (maior) | Produtos (compacto) */}
// // //       <div className={`grid grid-cols-12 gap-4 xl:gap-6`}>
// // //         {/* CHECKOUT — 9/12 no desktop, 100% no mobile */}
// // //         <section className="col-span-12 xl:col-span-9 2xl:col-span-9 rounded-xl border bg-white flex flex-col">
// // //           <header className="flex items-center justify-between p-4 border-b">
// // //             <h2 className="font-semibold text-lg">Checkout</h2>
// // //             <div className="flex items-center gap-2">
// // //               <button onClick={() => dispatch({ type: "CLEAR_CART" })} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200" title="Limpar carrinho">Limpar</button>
// // //               <button onClick={() => dispatch({ type: "RESET_ALL" })} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200" title="Nova venda">Nova venda</button>
// // //             </div>
// // //           </header>

// // //           {/* altura generosa + scroll interno */}
// // //           <div className="p-4 space-y-5 overflow-y-auto h-[calc(100vh-260px)]">
// // //             {/* CARRINHO */}
// // //             <div className="space-y-4">
// // //               {state.cart.length === 0 ? (
// // //                 <div className="text-center py-8 text-gray-500">Carrinho vazio</div>
// // //               ) : (
// // //                 state.cart.map((it) => (
// // //                   <div key={it.id} className="border rounded-lg p-3">
// // //                     <div className="font-medium">{it.name}</div>
// // //                     <div className="text-xs text-gray-500">{it.brand} • {formatCurrency(it.price)} • estoque {it.stock}</div>
// // //                     <div className="mt-2 flex items-center justify-between">
// // //                       <div className="flex items-center border rounded-md">
// // //                         <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><MinusIcon className="w-4 h-4" /></button>
// // //                         <input type="number" min="1" className="w-14 text-center outline-none" value={it.quantity} onChange={(e) => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: Number(e.target.value) || 1 } })} />
// // //                         <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><PlusIcon className="w-4 h-4" /></button>
// // //                       </div>
// // //                       <div className="flex items-center gap-2">
// // //                         <span className="font-semibold">{formatCurrency(it.total)}</span>
// // //                         <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })} className="text-red-500 hover:text-red-700" title="Remover"><TrashIcon className="w-5 h-5" /></button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </div>

// // //             {/* CLIENTE */}
// // //             <div className="border rounded-lg p-4">
// // //               <div className="flex items-center justify-between">
// // //                 <label className="block text-sm font-medium text-gray-700">Cliente (opcional)</label>
// // //                 <label className="flex items-center gap-2 text-xs text-gray-600">
// // //                   <input type="checkbox" checked={state.printReceipt} onChange={(e) => dispatch({ type: "SET_PRINT", payload: e.target.checked })} />
// // //                   Imprimir recibo
// // //                 </label>
// // //               </div>
// // //               <div className="mt-2 flex gap-2 items-center">
// // //                 <select className="input-field flex-1" value={state.selectedCustomerId} onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: e.target.value })}>
// // //                   <option value="">Selecione um cliente</option>
// // //                   {state.customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
// // //                 </select>
// // //                 <button onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" title="Cadastro rápido">
// // //                   <UserPlusIcon className="w-5 h-5" />
// // //                 </button>
// // //               </div>
// // //               {state.showQuickCustomer && (
// // //                 <div className="mt-2 flex gap-2">
// // //                   <input type="text" placeholder="Nome rápido do cliente" className="input-field flex-1" value={state.quickCustomerName} onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()} />
// // //                   <button onClick={handleQuickCustomerAdd} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Salvar</button>
// // //                 </div>
// // //               )}
// // //               <textarea placeholder="Observações na venda (opcional)" className="mt-2 input-field w-full" rows={2} value={state.notes} onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })} />
// // //             </div>

// // //             {/* DESCONTOS / ACRÉSCIMO */}
// // //             <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (R$)</label>
// // //                 <div className="relative">
// // //                   <input type="number" min="0" step="0.01" className="input-field w-full pr-8" value={state.discountPct > 0 ? 0 : state.discountValue} onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })} />
// // //                   {state.discountPct > 0 && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">(usando %)</span>}
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
// // //                 <input type="number" min="0" max="100" step="0.1" className="input-field w-full" value={state.discountPct} onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })} />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Acréscimo (R$)</label>
// // //                 <input type="number" min="0" step="0.01" className="input-field w-full" value={state.surchargeValue} onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })} />
// // //               </div>
// // //             </div>

// // //             {/* RESUMO */}
// // //             <div className="rounded-lg bg-gray-50 px-4 py-4 grid grid-cols-2 gap-3 text-sm">
// // //               <div>Subtotal</div><div className="text-right font-medium">{formatCurrency(subtotal)}</div>
// // //               <div>Desconto</div><div className="text-right">- {formatCurrency(discount)}</div>
// // //               <div>Acréscimo</div><div className="text-right">+ {formatCurrency(surcharge)}</div>
// // //               <div className="col-span-2 border-t pt-2 flex justify-between"><strong>Total a pagar</strong><strong>{formatCurrency(totalDue)}</strong></div>
// // //               <div>Total Pago</div><div className="text-right font-medium">{formatCurrency(totalPayments)}</div>
// // //               <div>Restante</div><div className={`text-right font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>{formatCurrency(Math.max(0, remaining))}</div>
// // //               {change > 0 && (<><div>Troco</div><div className="text-right font-bold">{formatCurrency(change)}</div></>)}
// // //             </div>

// // //             {/* PAGAMENTOS */}
// // //             <div className="space-y-4">
// // //               {state.payments.map((p) => (
// // //                 <div key={p.id} className="border rounded-lg p-4">
// // //                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// // //                       <select value={p.method} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: e.target.value } })} className="input-field">
// // //                         {PAYMENT_METHODS.map((m) => (<option key={m} value={m}>{m}</option>))}
// // //                       </select>
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// // //                       <input type="number" step="0.01" min="0" value={p.amount} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })} className="input-field" />
// // //                     </div>
// // //                     {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
// // //                       <>
// // //                         <div>
// // //                           <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// // //                           <select value={p.machine} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: e.target.value } })} className="input-field">
// // //                             <option value="">Selecione a máquina</option>
// // //                             {MACHINE_OPTIONS.map((m) => (<option key={m.id} value={m.name}>{m.name}</option>))}
// // //                           </select>
// // //                         </div>
// // //                         {p.method === "Cartão de Crédito" && (
// // //                           <div>
// // //                             <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
// // //                             <input type="number" min="1" step="1" value={p.installments || 1} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })} className="input-field" />
// // //                           </div>
// // //                         )}
// // //                       </>
// // //                     )}
// // //                   </div>
// // //                   <div className="mt-3 flex justify-between">
// // //                     <button onClick={() => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: Math.max(0, totalDue - totalPayments + p.amount) } })} className="text-xs text-gray-600 hover:underline" title="Preencher com restante">Usar restante</button>
// // //                     <button onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} className="text-red-600 hover:text-red-800 text-sm">Remover</button>
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               <div className="flex items-center justify-between">
// // //                 <small className="text-gray-600">Dica: F2 adiciona o restante automaticamente.</small>
// // //                 <div className="flex items-center gap-2">
// // //                   <button onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" title="Limpar pagamentos">
// // //                     <XMarkIcon className="w-5 h-5" />
// // //                   </button>
// // //                   <button onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Adicionar Método</button>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* FINALIZAR */}
// // //             <div className="sticky bottom-0 bg-white pt-2">
// // //               <button onClick={handleFinalize} disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue} className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2" title="F3">
// // //                 <PrinterIcon className="w-5 h-5" />
// // //                 Finalizar Venda — {formatCurrency(totalDue)}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* PRODUTOS — 3/12 no desktop; pode ocultar */}
// // //         {showProducts && (
// // //           <section className="col-span-12 xl:col-span-3 2xl:col-span-3 rounded-xl border bg-white">
// // //             <header className="flex items-center justify-between p-4 border-b">
// // //               <span className="font-semibold text-lg">Produtos</span>
// // //               <span className="text-xs text-gray-500">{state.filteredProducts.length} resultados</span>
// // //             </header>
// // //             <div className="p-3">
// // //               {state.isLoading ? (
// // //                 <div className="text-center py-8">Carregando...</div>
// // //               ) : state.filteredProducts.length ? (
// // //                 <div className="overflow-y-auto h-[calc(100vh-300px)] pr-1 space-y-2">
// // //                   {state.filteredProducts.map((p) => (
// // //                     <button
// // //                       key={p.id}
// // //                       onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
// // //                       disabled={p.stock <= 0}
// // //                       className="w-full text-left rounded-lg border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
// // //                       title="Adicionar ao carrinho"
// // //                     >
// // //                       <div className="flex items-center justify-between">
// // //                         <div className="min-w-0">
// // //                           <div className="truncate font-medium text-sm">{p.name}</div>
// // //                           <div className="text-[11px] text-gray-500 flex items-center gap-2">
// // //                             <span className="rounded bg-gray-100 px-1.5 py-px">{p.brand}</span>
// // //                             <span>Est.: {p.stock}</span>
// // //                             {p.code && <span>• {p.code}</span>}
// // //                           </div>
// // //                         </div>
// // //                         <div className="shrink-0 font-semibold text-sm">{formatCurrency(p.price)}</div>
// // //                       </div>
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               ) : (
// // //                 <div className="text-center py-8 text-gray-500">Nenhum produto encontrado.</div>
// // //               )}
// // //             </div>
// // //           </section>
// // //         )}
// // //       </div>

// // //       {/* VENDAS ESTACIONADAS */}
// // //       {state.parked.length > 0 && (
// // //         <div className="mt-6 rounded-xl border bg-white">
// // //           <header className="flex items-center justify-between p-4 border-b">
// // //             <h3 className="font-semibold">Vendas Estacionadas</h3>
// // //             <span className="text-xs text-gray-500">{state.parked.length}</span>
// // //           </header>
// // //           <div className="p-4 space-y-2">
// // //             {state.parked.map((p) => (
// // //               <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
// // //                 <div className="text-sm">
// // //                   <div className="font-medium">#{p.id}</div>
// // //                   <div className="text-gray-600">{new Date(p.createdAt).toLocaleString("pt-BR")} • {p.snapshot.cart.length} itens</div>
// // //                 </div>
// // //                 <div className="flex items-center gap-2">
// // //                   <button onClick={() => { dispatch({ type: "RESUME_PARKED", payload: p.id }); toast.info("Venda retomada no checkout."); }} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1">
// // //                     <PlayIcon className="w-4 h-4" /> Retomar
// // //                   </button>
// // //                   <button onClick={() => dispatch({ type: "DELETE_PARKED", payload: p.id })} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">Excluir</button>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }




// // import React, { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Search, Star, Image as ImageIcon, ShoppingCart, Home } from "lucide-react";

// // // IMAGENS (em src/assets/img)
// // import maquininhaIcon from "../assets/img/maquininha2.png";
// // import pixIcon from "../assets/img/pix.svg";
// // import real from "../assets/img/real.png";

// // import logo from "../assets/img/logo.png";


// // /* ============================ Paleta & helpers ============================ */
// // const C = {
// //   red: "#ea1d2c",
// //   redDark: "#d81b28",
// //   border: "#d9d9d9",
// //   text: "#2b2b2b",
// //   muted: "#7a7a7a",
// //   bgApp: "#f3f3f3",
// //   card: "#ffffff",
// //   rightPanel: "#f1f1f1",
// // };

// // const Input = ({ style, ...props }) => (
// //   <input
// //     {...props}
// //     style={{
// //       width: "100%",
// //       border: `1px solid ${C.border}`,
// //       borderRadius: 8,
// //       padding: "10px 12px",
// //       outline: "none",
// //       fontSize: 14,
// //       color: C.text,
// //       background: "#fff",
// //       ...style,
// //     }}
// //   />
// // );

// // const Select = ({ options = [], value, onChange, style, placeholder }) => {
// //   // caret SVG igual ao do screenshot (leve, cinza)
// //   const caret =
// //     "data:image/svg+xml;utf8," +
// //     encodeURIComponent(
// //       `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>`
// //     );

// //   return (
// //     <select
// //       value={value?.code ?? ""}
// //       onChange={(e) =>
// //         onChange &&
// //         onChange({
// //           value:
// //             options.find((o) => o.code === e.target.value) ??
// //             (e.target.value === "" ? null : undefined),
// //         })
// //       }
// //       style={{
// //         width: "100%",
// //         border: `1px solid ${C.border}`,
// //         borderRadius: 8,
// //         padding: "10px 36px 10px 12px",
// //         outline: "none",
// //         fontSize: 14,
// //         color: C.text,
// //         backgroundColor: "#fff",
// //         appearance: "none",
// //         backgroundImage: `url("${caret}")`,
// //         backgroundRepeat: "no-repeat",
// //         backgroundPosition: "right 12px center",
// //         ...style,
// //       }}
// //     >
// //       <option value="">{placeholder || "Selecione"}</option>
// //       {options.map((o) => (
// //         <option key={o.code} value={o.code}>
// //           {o.name}
// //         </option>
// //       ))}
// //     </select>
// //   );
// // };

// // const Checkbox = ({ checked, onChange, id }) => (
// //   <input
// //     id={id}
// //     type="checkbox"
// //     checked={!!checked}
// //     onChange={(e) => onChange && onChange({ checked: e.target.checked })}
// //     style={{
// //       width: 18,
// //       height: 18,
// //       accentColor: C.red,
// //       cursor: "pointer",
// //     }}
// //   />
// // );

// // const Button = ({ label, icon, children, outlined, danger, onClick, style, title }) => {
// //   const base = {
// //     display: "inline-flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //     borderRadius: 8,
// //     padding: "10px 14px",
// //     fontSize: 14,
// //     fontWeight: 700,
// //     cursor: "pointer",
// //     border: outlined ? `1.5px solid ${danger ? C.red : C.red}` : "none",
// //     background: outlined ? "#fff" : danger ? C.red : C.red,
// //     color: outlined ? C.red : "#fff",
// //     transition: "filter .15s ease",
// //     boxShadow: outlined ? "none" : "0 2px 4px rgba(0,0,0,0.08)",
// //     ...style,
// //   };
// //   return (
// //     <button
// //       onClick={onClick}
// //       title={title}
// //       style={base}
// //       onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
// //       onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
// //       onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
// //     >
// //       {icon}
// //       {label ?? children}
// //     </button>
// //   );
// // };

// // const Modal = ({ open, onClose, title, footer, children }) => {
// //   if (!open) return null;
// //   return (
// //     <div
// //       role="dialog"
// //       aria-modal="true"
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         background: "rgba(0,0,0,.35)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         zIndex: 50,
// //       }}
// //       onClick={onClose}
// //     >
// //       <div
// //         style={{
// //           width: 460,
// //           maxWidth: "92vw",
// //           background: "#fff",
// //           borderRadius: 10,
// //           boxShadow: "0 10px 28px rgba(0,0,0,.25)",
// //           overflow: "hidden",
// //         }}
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>
// //           {title}
// //         </div>
// //         <div style={{ padding: 16 }}>{children}</div>
// //         <div
// //           style={{
// //             padding: 12,
// //             borderTop: `1px solid ${C.border}`,
// //             display: "flex",
// //             gap: 8,
// //             justifyContent: "flex-end",
// //           }}
// //         >
// //           {footer}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const formatCPF = (value) => {
// //   const digits = (value || "").replace(/\D/g, "").slice(0, 11);
// //   const p1 = digits.slice(0, 3);
// //   const p2 = digits.slice(3, 6);
// //   const p3 = digits.slice(6, 9);
// //   const p4 = digits.slice(9, 11);
// //   return [p1, p2, p3].filter(Boolean).join(".") + (p4 ? `-${p4}` : "");
// // };

// // const downloadCarnet = async () => {
// //   const response = await fetch("http://localhost:3000/gerar-carne", { method: "GET" });
// //   const blob = await response.blob();
// //   const url = window.URL.createObjectURL(blob);
// //   const link = document.createElement("a");
// //   link.href = url;
// //   link.download = "carne-pagamento-12x.pdf";
// //   document.body.appendChild(link);
// //   link.click();
// //   link.remove();
// //   window.URL.revokeObjectURL(url);
// // };

// // /* ============================== Subcomponentes ============================= */
// // const NavigationSteps = ({ currentStep, setCurrentStep }) => {
// //   const steps = React.useMemo(
// //     () => [
// //       { label: "Produto (Alt+Z)", key: "produto" },
// //       { label: "Cliente (Alt+C)", key: "cliente" },
// //       { label: "Pagamento (Alt+B)", key: "pagamento" },
// //     ],
// //     []
// //   );

// //   const ARROW_W = 18; // largura do ">"

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         background: "#fff",
// //         borderRadius: 8,
// //         marginBottom: 10,
// //         overflow: "hidden",
// //         padding: 4,
// //         border: `1px solid ${C.border}`,
// //       }}
// //     >
// //       {steps.map((step, index) => {
// //         const active = currentStep === step.key;

// //         return (
// //           <div
// //             key={step.key}
// //             onClick={() => setCurrentStep(step.key)}
// //             style={{
// //               flex: 1,
// //               position: "relative",
// //               padding: "10px 16px",
// //               textAlign: "center",
// //               fontWeight: 800,
// //               fontSize: 14,
// //               color: active ? "#fff" : "#666",
// //               background: active ? C.red : "#e1e1e1",
// //               cursor: "pointer",
// //               userSelect: "none",
// //               transition: "background .2s ease",
// //               borderTopLeftRadius: index === 0 ? 6 : 0,
// //               borderBottomLeftRadius: index === 0 ? 6 : 0,
// //               borderTopRightRadius: index === steps.length - 1 ? 6 : 0,
// //               borderBottomRightRadius: index === steps.length - 1 ? 6 : 0,
// //               zIndex: active ? 3 : 1,
// //             }}
// //           >
// //             {step.label}

// //             {active && index < steps.length - 1 && (
// //               <div
// //                 style={{
// //                   position: "absolute",
// //                   top: 0,
// //                   bottom: 0,
// //                   left: "calc(100% - 1px)", // <— SOBREPOE 1px para matar a listra
// //                   width: ARROW_W,
// //                   background: C.red,
// //                   clipPath: "polygon(0 0, 100% 50%, 0 100%)",
// //                   zIndex: 4,
// //                   pointerEvents: "none",
// //                 }}
// //               />
// //             )}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };




// // const GenerateCarnet = ({ totalAmount }) => {
// //   const [open, setOpen] = useState(false);

// //   const footer = (
// //     <>
// //       <Button
// //         outlined
// //         label="Cancelar"
// //         onClick={() => setOpen(false)}
// //         style={{ borderColor: C.border, color: "#555" }}
// //       />
// //       <Button
// //         label="Confirmar e Baixar"
// //         onClick={async () => {
// //           await downloadCarnet();
// //           setOpen(false);
// //         }}
// //       />
// //     </>
// //   );

// //   return (
// //     <>

// //       <Modal open={open} onClose={() => setOpen(false)} title="Confirme os Dados do Carnê" footer={footer}>
// //         <h5 style={{ marginTop: 0, marginBottom: 8, fontWeight: 800 }}>Resumo do Carnê</h5>
// //         <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
// //           <li>
// //             Total:{" "}
// //             {typeof totalAmount === "number"
// //               ? totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
// //               : "—"}
// //           </li>
// //         </ul>
// //       </Modal>
// //     </>
// //   );
// // };

// // const ProdutoStep = ({ priceList, setPriceList, priceListOptions, barcodeReader, setBarcodeReader }) => (
// //   <div>
// //     <Select
// //       value={priceList}
// //       onChange={(e) => setPriceList(e.value)}
// //       options={priceListOptions}
// //       placeholder="Nenhuma lista"
// //       style={{ marginBottom: 10 }}
// //     />

// //     <label htmlFor="barcodeReader" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#555", fontSize: 14 }}>
// //       <Checkbox
// //         id="barcodeReader"
// //         checked={barcodeReader}
// //         onChange={(e) => setBarcodeReader(e.checked)}
// //       />
// //       Leitor de código de barras
// //     </label>

// //     <Input placeholder="Pesquise por código, descrição ou GTIN" style={{ marginBottom: 10 }} />

// //     <Button
// //       outlined
// //       label="Ver favoritos (Alt+G)"
// //       icon={<Star size={18} />}
// //       style={{
// //         width: "100%",
// //         color: C.red,
// //         borderColor: C.red,
// //         background: "#fff",
// //         marginBottom: 12,
// //         justifyContent: "flex-start",
// //         paddingLeft: 14,
// //       }}
// //     />

// //     <div
// //       style={{
// //         border: `1px solid ${C.border}`,
// //         borderRadius: 8,
// //         height: 150,
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         background: "#f8f8f8",
// //       }}
// //     >
// //       <ImageIcon size={38} color="#bdbdbd" />
// //     </div>
// //   </div>
// // );

// // const ClienteStep = () => {
// //   const [cpf, setCpf] = useState("");
// //   const [nome, setNome] = useState("");

// //   return (
// //     <div>
// //       <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
// //         <div>
// //           <label htmlFor="cpf" style={{ display: "block", marginBottom: 6, color: "#444", fontSize: 14 }}>
// //             CPF
// //           </label>
// //           <Input
// //             id="cpf"
// //             inputMode="numeric"
// //             placeholder="999.999.999-99"
// //             value={cpf}
// //             onChange={(e) => setCpf(formatCPF(e.target.value))}
// //           />
// //         </div>
// //         <div>
// //           <label htmlFor="nome" style={{ display: "block", marginBottom: 6, color: "#444", fontSize: 14 }}>
// //             Nome
// //           </label>
// //           <Input id="nome" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const PagamentoStep = ({ valorTotal }) => {
// //   return (
// //     <div>
// //       <h5 style={{ margin: "0 0 8px", fontWeight: 800 }}>Totais</h5>

// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Sub total</label>
// //           <Input type="text" placeholder="Default" />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto</label>
// //           <Input type="text" placeholder="Default" />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto</label>
// //           <Input type="text" placeholder="Default" />
// //         </div>
// //       </div>

// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Recebido em dinheiro</label>
// //           <Input type="text" placeholder="Default" />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Troco em dinheiro</label>
// //           <Input type="text" placeholder="Default" />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total em venda</label>
// //           <Input type="text" placeholder="Default" />
// //         </div>
// //       </div>

// //       <h5 style={{ margin: "12px 0 8px", fontWeight: 800 }}>Forma de Pagamento</h5>

// //       <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
// //         <GenerateCarnet totalAmount={valorTotal} />


// //         <Button
// //           outlined
// //           label="Dinheiro"
// //           icon={<img src={real} alt="Real Icon" style={{ width: 32, height: 32 }} />}
// //           style={{
// //             flex: 1,
// //             minWidth: 160,
// //             maxWidth: 200,
// //             background: "#fff",
// //             borderColor: C.red,
// //             color: C.red,
// //           }}
// //         />


// //         <Button
// //           outlined
// //           label="Pix - Gerar QR Code"
// //           icon={<img src={pixIcon} alt="Pix Icon" style={{ width: 32, height: 32 }} />}
// //           style={{
// //             flex: 1,
// //             minWidth: 160,
// //             maxWidth: 200,
// //             background: "#fff",
// //             borderColor: C.red,
// //             color: C.red,
// //           }}
// //         />

// //         <Button
// //           outlined
// //           label="Maquininha - Dédito/Credito"
// //           icon={<img src={maquininhaIcon} alt="POS" style={{ width: 44 }} />}
// //           style={{
// //             flex: 1,
// //             minWidth: 160,
// //             maxWidth: 200,
// //             background: "#fff",
// //             borderColor: C.red,
// //             color: C.red,
// //           }}
// //         />
// //       </div>

// //       <Button
// //         label="Ative o Pix com a Bling Conta"
// //         style={{
// //           backgroundColor: C.red,
// //           color: "white",
// //           width: "100%",
// //           marginTop: 4,
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // /* ==================================== PDV ==================================== */
// // const PDV = () => {
// //   const [priceList, setPriceList] = useState(null);
// //   const [barcodeReader, setBarcodeReader] = useState(false);
// //   const [currentStep, setCurrentStep] = useState("produto");
// //   const priceListOptions = [{ name: "Nenhuma lista", code: "none" }];
// //   const navigate = useNavigate();

// //   // mock
// //   const [produtos] = useState([]);

// //   const redirectToDashboard = () => navigate("/");

// //   useEffect(() => {
// //     const handleKeyDown = (event) => {
// //       if (event.key === "Escape") redirectToDashboard();
// //     };
// //     window.addEventListener("keydown", handleKeyDown);
// //     return () => {
// //       window.removeEventListener("keydown", handleKeyDown);
// //       if (document.fullscreenElement && document.exitFullscreen) {
// //         document.exitFullscreen().catch(() => { });
// //       }
// //     };
// //   }, []);

// //   const renderStepContent = () => {
// //     switch (currentStep) {
// //       case "produto":
// //         return (
// //           <ProdutoStep
// //             priceList={priceList}
// //             setPriceList={setPriceList}
// //             priceListOptions={priceListOptions}
// //             barcodeReader={barcodeReader}
// //             setBarcodeReader={setBarcodeReader}
// //           />
// //         );
// //       case "cliente":
// //         return <ClienteStep />;
// //       case "pagamento":
// //         return <PagamentoStep />;
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         height: "100vh",
// //         overflow: "hidden",
// //         background: C.bgApp,
// //       }}
// //     >
// //       {/* Header */}
// //       <div
// //         style={{
// //           background: C.red,
// //           color: "white",
// //           padding: "8px 12px",
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           boxShadow: "0 2px 4px rgba(0,0,0,.12)",
// //         }}
// //       >
// //         <img
// //           src={logo}
// //           alt="Venda-PRO"
// //           style={{ height: 60, width: 150, display: "block" }}
// //         />


// //         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //           <div style={{ position: "relative", width: 320, maxWidth: "48vw" }}>
// //             <Search
// //               size={16}
// //               style={{
// //                 position: "absolute",
// //                 right: 36,
// //                 top: "50%",
// //                 transform: "translateY(-50%)",
// //                 color: "#666",
// //               }}
// //             />
// //             <Input
// //               placeholder="Buscar venda - (Alt+P)"
// //               style={{
// //                 paddingRight: 44,
// //                 background: "#fff",
// //                 borderColor: "#efefef",
// //                 fontWeight: 600,
// //               }}
// //             />
// //           </div>

// //           {/* Botão home (branco com borda vermelha) */}
// //           <Button
// //             outlined
// //             title="Voltar ao Dashboard"
// //             icon={
// //               <Home size={170} color="#EA1D2C" />
// //             }
// //             onClick={redirectToDashboard}
// //             style={{
// //               background: "#fff",
// //               color: C.red,
// //               borderColor: "#ffd8dc",
// //               padding: 10,
// //               width: 38,
// //               height: 38,
// //               display: "inline-flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //             }}
// //           />
// //         </div>
// //       </div>

// //       {/* Conteúdo */}
// //       <div style={{ display: "flex", flexGrow: 1, gap: 16, padding: 8, marginBottom: 86 }}>
// //         {/* Coluna esquerda */}
// //         <div
// //           style={{
// //             flexBasis: "43%",
// //             minWidth: 420,
// //             display: "flex",
// //             flexDirection: "column",
// //             background: C.card,
// //             borderRadius: 10,
// //             padding: 10,
// //             border: `1px solid ${C.border}`,
// //           }}
// //         >
// //           <NavigationSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />
// //           {renderStepContent()}
// //         </div>

// //         {/* Coluna direita */}
// //         <div
// //           style={{
// //             flexBasis: "57%",
// //             minWidth: 520,
// //             background: C.rightPanel,
// //             borderRadius: 10,
// //             border: `1px solid ${C.border}`,
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             position: "relative",
// //           }}
// //         >
// //           {produtos.length === 0 ? (
// //             <>
// //               <div
// //                 style={{
// //                   position: "absolute",
// //                   top: 18,
// //                   color: C.red,
// //                   fontWeight: 800,
// //                 }}
// //               >
// //                 Nenhum produto registrado
// //               </div>
// //               <ShoppingCart size={170} color="#c9c9c9" />
// //             </>
// //           ) : (
// //             <div> {/* sua lista de produtos aqui */}</div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Rodapé fixo */}
// //       <div
// //         style={{
// //           background: "#fff",
// //           padding: 12,
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           borderTop: `1px solid ${C.border}`,
// //           boxShadow: "0 -2px 6px rgba(0,0,0,.06)",
// //           position: "fixed",
// //           bottom: 0,
// //           left: 0,
// //           right: 0,
// //           zIndex: 10,
// //         }}
// //       >
// //         <Button
// //           outlined
// //           danger
// //           label="Excluir venda (Alt+Q)"
// //           style={{
// //             background: "#fff",
// //             color: C.red,
// //             borderColor: "#ffccd2",
// //             paddingLeft: 16,
// //             paddingRight: 16,
// //           }}
// //         />

// //         <Button
// //           label="Finalizar venda (Alt+S)"
// //           style={{
// //             background: C.red,
// //             margin: "0 auto",
// //             borderRadius: 8,
// //             paddingLeft: 18,
// //             paddingRight: 18,
// //           }}
// //         />

// //         <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: "#333" }}>
// //           <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
// //           <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".5px" }}>R$ 0,00</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default React.memo(PDV);


// import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   // básicos para a UI
//   MagnifyingGlassIcon,
//   PhotoIcon,
//   ShoppingCartIcon,
//   HomeIcon,
//   PlusIcon,
//   MinusIcon,
//   TrashIcon,
//   CreditCardIcon,
//   UserPlusIcon,
//   PrinterIcon,
//   ArrowPathIcon,
//   PauseIcon,
//   PlayIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { formatCurrency } from "../utils/format";
// import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api";

// // IMAGENS (em src/assets/img)
// import maquininhaIcon from "../assets/img/maquininha2.png";
// import pixIcon from "../assets/img/pix.svg";
// import real from "../assets/img/real.png";
// import logo from "../assets/img/logo.png";

// /* ============================ Paleta & helpers ============================ */
// const C = {
//   red: "#ea1d2c",
//   redDark: "#d81b28",
//   border: "#d9d9d9",
//   text: "#2b2b2b",
//   muted: "#7a7a7a",
//   bgApp: "#f3f3f3",
//   card: "#ffffff",
//   rightPanel: "#f1f1f1",
// };

// const Input = ({ style, ...props }) => (
//   <input
//     {...props}
//     style={{
//       width: "100%",
//       border: `1px solid ${C.border}`,
//       borderRadius: 8,
//       padding: "10px 12px",
//       outline: "none",
//       fontSize: 14,
//       color: C.text,
//       background: "#fff",
//       ...style,
//     }}
//   />
// );

// const TextArea = ({ style, ...props }) => (
//   <textarea
//     {...props}
//     style={{
//       width: "100%",
//       border: `1px solid ${C.border}`,
//       borderRadius: 8,
//       padding: "10px 12px",
//       outline: "none",
//       fontSize: 14,
//       color: C.text,
//       background: "#fff",
//       resize: "vertical",
//       ...style,
//     }}
//   />
// );

// const Select = ({ options = [], value, onChange, style, placeholder }) => {
//   const caret =
//     "data:image/svg+xml;utf8," +
//     encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>`
//     );

//   return (
//     <select
//       value={value ?? ""}
//       onChange={(e) => onChange && onChange(e.target.value || "")}
//       style={{
//         width: "100%",
//         border: `1px solid ${C.border}`,
//         borderRadius: 8,
//         padding: "10px 36px 10px 12px",
//         outline: "none",
//         fontSize: 14,
//         color: C.text,
//         backgroundColor: "#fff",
//         appearance: "none",
//         backgroundImage: `url("${caret}")`,
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "right 12px center",
//         ...style,
//       }}
//     >
//       <option value="">{placeholder || "Selecione"}</option>
//       {options.map((o) => (
//         <option key={o.value ?? o.code ?? o.id} value={o.value ?? o.code ?? o.id}>
//           {o.label ?? o.name}
//         </option>
//       ))}
//     </select>
//   );
// };

// const Checkbox = ({ checked, onChange, id }) => (
//   <input
//     id={id}
//     type="checkbox"
//     checked={!!checked}
//     onChange={(e) => onChange && onChange(e.target.checked)}
//     style={{ width: 18, height: 18, accentColor: C.red, cursor: "pointer" }}
//   />
// );

// const Button = ({ label, icon, children, outlined, danger, onClick, style, title, disabled }) => {
//   const base = {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     borderRadius: 8,
//     padding: "10px 14px",
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: disabled ? "not-allowed" : "pointer",
//     opacity: disabled ? 0.6 : 1,
//     border: outlined ? `1.5px solid ${danger ? C.red : C.red}` : "none",
//     background: outlined ? "#fff" : danger ? C.red : C.red,
//     color: outlined ? C.red : "#fff",
//     transition: "filter .15s ease",
//     boxShadow: outlined ? "none" : "0 2px 4px rgba(0,0,0,0.08)",
//     ...style,
//   };
//   return (
//     <button
//       onClick={disabled ? undefined : onClick}
//       title={title}
//       style={base}
//       onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
//       onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
//       onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
//       disabled={disabled}
//     >
//       {icon}
//       {label ?? children}
//     </button>
//   );
// };

// const Modal = ({ open, onClose, title, footer, children }) => {
//   if (!open) return null;
//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,.35)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 50,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           width: 520,
//           maxWidth: "92vw",
//           background: "#fff",
//           borderRadius: 10,
//           boxShadow: "0 10px 28px rgba(0,0,0,.25)",
//           overflow: "hidden",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>
//           {title}
//         </div>
//         <div style={{ padding: 16 }}>{children}</div>
//         <div
//           style={{
//             padding: 12,
//             borderTop: `1px solid ${C.border}`,
//             display: "flex",
//             gap: 8,
//             justifyContent: "flex-end",
//           }}
//         >
//           {footer}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ============================== Domínios ============================= */
// const MACHINE_OPTIONS = [
//   { id: "machine_a", name: "Máquina A" },
//   { id: "machine_b", name: "Máquina B" },
//   { id: "machine_c", name: "Máquina C" },
// ];

// const PAYMENT_METHODS = ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito", "Transferência"];

// const PARKED_KEY = "pdv_parked_sales_v1";

// const initialState = {
//   products: [],
//   customers: [],
//   filteredProducts: [],
//   isLoading: true,
//   searchTerm: "",
//   cart: [], // {id,name,brand,price,quantity,stock,total}
//   selectedCustomerId: "",
//   quickCustomerName: "",
//   showQuickCustomer: false,
//   payments: [], // {id, method, amount, machine?, installments?}
//   discountValue: 0,
//   discountPct: 0,
//   surchargeValue: 0,
//   printReceipt: true,
//   notes: "",
//   parked: [], // [{id, createdAt, snapshot}]
// };

// function readParked() {
//   try {
//     const raw = localStorage.getItem(PARKED_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }
// function writeParked(arr) {
//   localStorage.setItem(PARKED_KEY, JSON.stringify(arr));
// }

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_DATA": {
//       const { products, customers } = action.payload;
//       const available = products.filter((p) => Number(p.stock) > 0);
//       return { ...state, products, customers, filteredProducts: available, isLoading: false, parked: readParked() };
//     }
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload };
//     case "SET_SEARCH": {
//       const searchTerm = action.payload.trim().toLowerCase();
//       const filtered = searchTerm
//         ? state.products.filter((p) => `${p.name} ${p.brand} ${p.code ?? ""}`.toLowerCase().includes(searchTerm))
//         : state.products.filter((p) => Number(p.stock) > 0);
//       return { ...state, searchTerm: action.payload, filteredProducts: filtered };
//     }

//     // CART
//     case "ADD_TO_CART": {
//       const p = action.payload;
//       const existing = state.cart.find((i) => i.id === p.id);
//       if (existing) {
//         if (existing.quantity >= p.stock) {
//           toast.warning(`Estoque máximo atingido para ${p.name}`);
//           return state;
//         }
//         const cart = state.cart.map((i) =>
//           i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i
//         );
//         return { ...state, cart };
//       }
//       return {
//         ...state,
//         cart: [
//           ...state.cart,
//           { id: p.id, name: p.name, brand: p.brand, price: Number(p.price) || 0, quantity: 1, stock: Number(p.stock) || 0, total: Number(p.price) || 0 },
//         ],
//       };
//     }
//     case "REMOVE_FROM_CART":
//       return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
//     case "UPDATE_QTY": {
//       const { id, qty } = action.payload;
//       if (qty <= 0) return state;
//       const it = state.cart.find((i) => i.id === id);
//       if (!it) return state;
//       if (qty > it.stock) {
//         toast.warning(`Estoque máximo atingido para ${it.name}`);
//         return state;
//       }
//       const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i));
//       return { ...state, cart };
//     }
//     case "CLEAR_CART":
//       return { ...state, cart: [] };

//     // CLIENTE
//     case "SET_CUSTOMER":
//       return { ...state, selectedCustomerId: action.payload };
//     case "SET_QUICK_CUSTOMER":
//       return { ...state, quickCustomerName: action.payload };
//     case "TOGGLE_QUICK_CUSTOMER":
//       return { ...state, showQuickCustomer: !state.showQuickCustomer };

//     // PAGAMENTOS
//     case "ADD_PAYMENT": {
//       const remaining = action.payload;
//       if (remaining <= 0) {
//         toast.info("Nada a adicionar — total já coberto.");
//         return state;
//       }
//       const pm = { id: Date.now(), method: "Dinheiro", amount: Number(remaining.toFixed(2)), machine: "", installments: 1 };
//       return { ...state, payments: [...state.payments, pm] };
//     }
//     case "UPDATE_PAYMENT": {
//       const { id, field, value } = action.payload;
//       const payments = state.payments.map((pm) =>
//         pm.id === id
//           ? {
//             ...pm,
//             [field]: field === "amount" || field === "installments" ? Number(value) || 0 : value,
//             ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
//               ? { machine: "", installments: 1 }
//               : {}),
//           }
//           : pm
//       );
//       return { ...state, payments };
//     }
//     case "REMOVE_PAYMENT":
//       return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) };
//     case "CLEAR_PAYMENTS":
//       return { ...state, payments: [] };

//     // TOTAIS
//     case "SET_DISCOUNT_VALUE":
//       return { ...state, discountValue: Number(action.payload) || 0, discountPct: 0 };
//     case "SET_DISCOUNT_PCT":
//       return { ...state, discountPct: Number(action.payload) || 0 };
//     case "SET_SURCHARGE":
//       return { ...state, surchargeValue: Number(action.payload) || 0 };

//     // OUTROS
//     case "SET_PRINT":
//       return { ...state, printReceipt: !!action.payload };
//     case "SET_NOTES":
//       return { ...state, notes: action.payload };

//     // ESTACIONAR
//     case "LOAD_PARKED":
//       return { ...state, parked: readParked() };
//     case "PARK_CURRENT": {
//       const snapshot = {
//         cart: state.cart,
//         payments: state.payments,
//         selectedCustomerId: state.selectedCustomerId,
//         discountValue: state.discountValue,
//         discountPct: state.discountPct,
//         surchargeValue: state.surchargeValue,
//         notes: state.notes,
//       };
//       const entry = { id: Date.now(), createdAt: new Date().toISOString(), snapshot };
//       const next = [entry, ...state.parked];
//       writeParked(next);
//       toast.success("Venda estacionada!");
//       return { ...state, parked: next };
//     }
//     case "RESUME_PARKED": {
//       const id = action.payload;
//       const entry = state.parked.find((p) => p.id === id);
//       if (!entry) return state;
//       return { ...state, ...entry.snapshot };
//     }
//     case "DELETE_PARKED": {
//       const id = action.payload;
//       const next = state.parked.filter((p) => p.id !== id);
//       writeParked(next);
//       return { ...state, parked: next };
//     }

//     case "RESET_ALL":
//       return {
//         ...initialState,
//         products: state.products,
//         customers: state.customers,
//         filteredProducts: state.filteredProducts,
//         parked: state.parked,
//         isLoading: false,
//       };
//     default:
//       return state;
//   }
// }

// const downloadCarnet = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/gerar-carne", { method: "GET" });
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "carne-pagamento-12x.pdf";
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (e) {
//     toast.error("Falha ao gerar carnê");
//   }
// };

// /* ============================== Subcomponentes UI ============================= */
// const NavigationSteps = ({ currentStep, setCurrentStep }) => {
//   const steps = React.useMemo(
//     () => [
//       { label: "Produto (Alt+Z)", key: "produto" },
//       { label: "Cliente (Alt+C)", key: "cliente" },
//       { label: "Pagamento (Alt+B)", key: "pagamento" },
//     ],
//     []
//   );
//   const ARROW_W = 18;
//   return (
//     <div
//       style={{
//         display: "flex",
//         background: "#fff",
//         borderRadius: 8,
//         marginBottom: 10,
//         overflow: "hidden",
//         padding: 4,
//         border: `1px solid ${C.border}`,
//       }}
//     >
//       {steps.map((step, index) => {
//         const active = currentStep === step.key;
//         return (
//           <div
//             key={step.key}
//             onClick={() => setCurrentStep(step.key)}
//             style={{
//               flex: 1,
//               position: "relative",
//               padding: "10px 16px",
//               textAlign: "center",
//               fontWeight: 800,
//               fontSize: 14,
//               color: active ? "#fff" : "#666",
//               background: active ? C.red : "#e1e1e1",
//               cursor: "pointer",
//               userSelect: "none",
//               transition: "background .2s ease",
//               borderTopLeftRadius: index === 0 ? 6 : 0,
//               borderBottomLeftRadius: index === 0 ? 6 : 0,
//               borderTopRightRadius: index === steps.length - 1 ? 6 : 0,
//               borderBottomRightRadius: index === steps.length - 1 ? 6 : 0,
//               zIndex: active ? 3 : 1,
//             }}
//           >
//             {step.label}
//             {active && index < steps.length - 1 && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   bottom: 0,
//                   left: "calc(100% - 1px)",
//                   width: ARROW_W,
//                   background: C.red,
//                   clipPath: "polygon(0 0, 100% 50%, 0 100%)",
//                   zIndex: 4,
//                   pointerEvents: "none",
//                 }}
//               />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ============================== Tela principal ============================= */
// export default function PDVPro() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const [currentStep, setCurrentStep] = useState("produto");
//   const [barcodeReader, setBarcodeReader] = useState(false);
//   const searchRef = useRef(null);
//   const navigate = useNavigate();

//   // Load data
//   useEffect(() => {
//     (async () => {
//       try {
//         dispatch({ type: "SET_LOADING", payload: true });
//         const [prods, custs] = await Promise.all([fetchProducts(), fetchCustomers()]);
//         dispatch({ type: "SET_DATA", payload: { products: prods, customers: custs } });
//       } catch (e) {
//         console.error(e);
//         toast.error("Erro ao carregar dados");
//       } finally {
//         dispatch({ type: "SET_LOADING", payload: false });
//       }
//     })();
//   }, []);

//   // Totais
//   const subtotal = useMemo(() => state.cart.reduce((s, i) => s + i.total, 0), [state.cart]);
//   const discountFromPct = useMemo(() => {
//     const pct = Math.max(0, Math.min(100, state.discountPct || 0));
//     return Number(((subtotal * pct) / 100).toFixed(2));
//   }, [subtotal, state.discountPct]);
//   const discount = state.discountPct > 0 ? discountFromPct : Math.min(state.discountValue || 0, subtotal);
//   const surcharge = Math.max(0, state.surchargeValue || 0);
//   const totalDue = useMemo(() => Math.max(0, Number((subtotal - discount + surcharge).toFixed(2))), [subtotal, discount, surcharge]);
//   const totalPayments = useMemo(() => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0), [state.payments]);
//   const remaining = Number((totalDue - totalPayments).toFixed(2));
//   const change = remaining < 0 ? Math.abs(remaining) : 0;

//   // Atalhos
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.altKey && (e.key === "z" || e.key === "Z")) setCurrentStep("produto");
//       if (e.altKey && (e.key === "c" || e.key === "C")) setCurrentStep("cliente");
//       if (e.altKey && (e.key === "b" || e.key === "B")) setCurrentStep("pagamento");

//       if (e.key === "F4") {
//         e.preventDefault();
//         searchRef.current?.focus();
//       } else if (e.key === "F2") {
//         e.preventDefault();
//         dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) });
//       } else if (e.key === "F3") {
//         e.preventDefault();
//         handleFinalize();
//       } else if (e.altKey && (e.key === "q" || e.key === "Q")) {
//         e.preventDefault();
//         dispatch({ type: "RESET_ALL" });
//       } else if (e.key === "Escape") {
//         e.preventDefault();
//         navigate("/");
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   });

//   const addDefaultPaymentIfEmpty = () => {
//     if (state.cart.length === 0) return toast.error("Adicione produtos ao carrinho.");
//     if (state.payments.length === 0) dispatch({ type: "ADD_PAYMENT", payload: totalDue });
//   };

//   const handleQuickCustomerAdd = async () => {
//     const name = state.quickCustomerName?.trim();
//     if (!name) return toast.error("Digite o nome do cliente.");
//     try {
//       const created = await createCustomer({ name });
//       toast.success("Cliente adicionado");
//       dispatch({ type: "SET_DATA", payload: { products: state.products, customers: [...state.customers, created] } });
//       dispatch({ type: "SET_CUSTOMER", payload: created.id });
//       dispatch({ type: "SET_QUICK_CUSTOMER", payload: "" });
//       if (state.showQuickCustomer) dispatch({ type: "TOGGLE_QUICK_CUSTOMER" });
//     } catch (e) {
//       console.error(e);
//       toast.error("Erro ao adicionar cliente");
//     }
//   };

//   const validateBeforeFinalize = () => {
//     if (state.cart.length === 0) return toast.error("Carrinho vazio."), false;
//     if (state.payments.length === 0) return toast.error("Adicione um método de pagamento."), false;
//     if (totalPayments + 0.001 < totalDue) return toast.error("Pagamentos devem cobrir o total."), false;
//     const cardPays = state.payments.filter((p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito");
//     if (cardPays.some((p) => !p.machine)) return toast.error("Selecione a máquina para todos cartões."), false;
//     return true;
//   };

//   const openReceipt = (payload) => {
//     try {
//       const toBRL = (n) => (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
//       const d = new Date(payload.date);
//       const itemsRows = payload.items
//         .map(
//           (it) =>
//             `<tr><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${toBRL(it.unitPrice)}</td><td style="text-align:right">${toBRL(it.total)}</td></tr>`
//         )
//         .join("");
//       const payRows = (payload.payments || [])
//         .map(
//           (pm) =>
//             `<div>${pm.method}${pm.machine ? " (" + pm.machine + ")" : ""}${pm.installments > 1 ? ` ${pm.installments}x` : ""}: <strong>${toBRL(
//               pm.amount
//             )}</strong></div>`
//         )
//         .join("");
//       const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Recibo</title>
//       <style>body{font-family:Arial,sans-serif;margin:16px}h1{font-size:18px;margin:0}small{color:#555}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border-bottom:1px solid #eee;padding:6px 4px;font-size:12px}.right{text-align:right}.tot{margin-top:8px;border-top:1px dashed #333;padding-top:8px}</style>
//       <body><h1>Recibo de Venda</h1><small>${d.toLocaleString("pt-BR")}</small>
//       <div style="margin-top:6px">Cliente: <strong>${payload.customerName || "—"}</strong></div>
//       <table><thead><tr><th>Produto</th><th class="right">Qtd</th><th class="right">Unit.</th><th class="right">Total</th></tr></thead><tbody>${itemsRows}</tbody></table>
//       <div class="tot"><div>Subtotal: <strong>${toBRL(payload.subtotal)}</strong></div>
//       <div>Desconto: <strong>${toBRL(payload.discount)}</strong> &nbsp; Acréscimo: <strong>${toBRL(payload.surcharge)}</strong></div>
//       <div>Total: <strong>${toBRL(payload.total)}</strong></div>${payload.change > 0 ? `<div>Troco: <strong>${toBRL(payload.change)}</strong></div>` : ""}</div>
//       <div style="margin-top:8px">${payRows}</div>${payload.notes ? `<div style="margin-top:8px"><em>${payload.notes}</em></div>` : ""}
//       <script>window.onload=()=>{window.print()}</script></body></html>`;
//       const w = window.open("", "_blank");
//       w.document.write(html);
//       w.document.close();
//     } catch { }
//   };

//   const handleFinalize = async () => {
//     if (!validateBeforeFinalize()) return;
//     const customerName = state.selectedCustomerId
//       ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
//       : "Cliente não identificado";

//     const payload = {
//       customerId: state.selectedCustomerId || null,
//       customerName,
//       items: state.cart.map((i) => ({ productId: i.id, name: i.name, qty: i.quantity, unitPrice: i.price, total: i.total })),
//       payments: state.payments,
//       subtotal,
//       discount,
//       surcharge,
//       total: totalDue,
//       change,
//       notes: state.notes?.trim() || undefined,
//       date: new Date().toISOString(),
//     };

//     try {
//       await createSale(payload);
//       toast.success("Venda finalizada!");
//       if (state.printReceipt) openReceipt(payload);
//       dispatch({ type: "RESET_ALL" });
//       const prods = await fetchProducts();
//       dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } });
//     } catch (e) {
//       console.error(e);
//       toast.error("Erro ao finalizar venda");
//     }
//   };

//   const firstFiltered = state.filteredProducts[0];

//   /* ============================== Steps ============================= */
//   const ProdutoStep = () => (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
//         <Input
//           ref={searchRef}
//           placeholder="F4 para focar — pesquise por nome, marca ou código (Enter adiciona 1º)"
//           value={state.searchTerm}
//           onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && firstFiltered) dispatch({ type: "ADD_TO_CART", payload: firstFiltered });
//           }}
//           style={{ flex: 1 }}
//         />
//         <Button
//           title="F2 — adiciona método com o restante"
//           onClick={addDefaultPaymentIfEmpty}
//           icon={<CreditCardIcon style={{ width: 18, height: 18 }} />}
//           outlined
//           style={{ padding: "10px 12px" }}
//         />
//         <Button
//           title="Estacionar venda atual"
//           onClick={() => {
//             dispatch({ type: "PARK_CURRENT" });
//             dispatch({ type: "RESET_ALL" });
//           }}
//           outlined
//           style={{ background: "#fff", color: "#333", borderColor: C.border }}
//           icon={<PauseIcon style={{ width: 18, height: 18 }} />}
//         />
//         <Button
//           title="Recarregar estacionadas"
//           onClick={() => dispatch({ type: "LOAD_PARKED" })}
//           outlined
//           style={{ background: "#fff", color: "#333", borderColor: C.border }}
//           icon={<ArrowPathIcon style={{ width: 18, height: 18 }} />}
//         />
//       </div>

//       <label htmlFor="barcodeReader" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#555", fontSize: 14 }}>
//         <Checkbox id="barcodeReader" checked={barcodeReader} onChange={setBarcodeReader} />
//         Leitor de código de barras
//       </label>

//       <div
//         style={{
//           border: `1px solid ${C.border}`,
//           borderRadius: 8,
//           height: 260,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           background: "#fff",
//         }}
//       >
//         <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
//           <span>Produtos ({state.filteredProducts.length})</span>
//           <span style={{ color: C.muted, fontWeight: 600 }}>Enter adiciona o primeiro</span>
//         </div>
//         <div style={{ flex: 1, overflowY: "auto" }}>
//           {state.isLoading ? (
//             <div style={{ padding: 16, color: C.muted }}>Carregando…</div>
//           ) : state.filteredProducts.length ? (
//             state.filteredProducts.map((p) => (
//               <div
//                 key={p.id}
//                 onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   padding: "10px 12px",
//                   borderBottom: `1px solid ${C.border}`,
//                   cursor: "pointer",
//                   background: "#fff",
//                 }}
//               >
//                 <div style={{ minWidth: 0 }}>
//                   <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
//                   <div style={{ fontSize: 12, color: C.muted }}>
//                     <span style={{ background: "#f3f3f3", padding: "2px 6px", borderRadius: 6, marginRight: 6 }}>{p.brand}</span>
//                     Est.: {p.stock} {p.code ? ` • ${p.code}` : ""}
//                   </div>
//                 </div>
//                 <div style={{ fontWeight: 800 }}>{formatCurrency(p.price)}</div>
//               </div>
//             ))
//           ) : (
//             <div style={{ padding: 16, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
//               <PhotoIcon style={{ width: 18, height: 18 }} /> Nenhum produto encontrado.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const ClienteStep = () => (
//     <div>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
//         <div>
//           <label style={{ display: "block", marginBottom: 6, color: "#444", fontSize: 14 }}>Cliente (opcional)</label>
//           <Select
//             value={state.selectedCustomerId}
//             onChange={(v) => dispatch({ type: "SET_CUSTOMER", payload: v })}
//             options={state.customers.map((c) => ({ value: c.id, label: c.name }))}
//             placeholder="Selecione um cliente"
//           />
//         </div>
//         <Button
//           title="Cadastro rápido"
//           onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })}
//           icon={<UserPlusIcon style={{ width: 18, height: 18 }} />}
//           style={{ background: "#16a34a" }}
//         >
//           Novo
//         </Button>
//       </div>

//       {state.showQuickCustomer && (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
//           <Input
//             placeholder="Nome rápido do cliente"
//             value={state.quickCustomerName}
//             onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
//             onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
//           />
//           <Button onClick={handleQuickCustomerAdd} style={{ background: "#16a34a" }}>
//             Salvar
//           </Button>
//         </div>
//       )}

//       <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 14 }}>
//         <Checkbox checked={state.printReceipt} onChange={(v) => dispatch({ type: "SET_PRINT", payload: v })} />
//         Imprimir recibo
//       </label>

//       <TextArea
//         rows={3}
//         placeholder="Observações na venda (opcional)"
//         value={state.notes}
//         onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })}
//         style={{ marginTop: 10 }}
//       />
//     </div>
//   );

//   const [openCarnet, setOpenCarnet] = useState(false);
//   const PagamentoStep = () => (
//     <div>
//       <h5 style={{ margin: "0 0 8px", fontWeight: 800 }}>Totais</h5>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Subtotal</label>
//           <Input type="text" value={formatCurrency(subtotal)} readOnly />
//         </div>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (R$)</label>
//           <Input type="number" step="0.01" min="0" value={state.discountPct > 0 ? 0 : state.discountValue} onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })} />
//         </div>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (%)</label>
//           <Input type="number" step="0.1" min="0" max="100" value={state.discountPct} onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })} />
//         </div>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Acréscimo (R$)</label>
//           <Input type="number" step="0.01" min="0" value={state.surchargeValue} onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })} />
//         </div>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total a pagar</label>
//           <Input type="text" value={formatCurrency(totalDue)} readOnly />
//         </div>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total pago</label>
//           <Input type="text" value={formatCurrency(totalPayments)} readOnly />
//         </div>
//       </div>

//       <h5 style={{ margin: "12px 0 8px", fontWeight: 800 }}>Forma de Pagamento</h5>

//       {/* Ações rápidas */}
//       <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
//         <Button
//           outlined
//           label="Dinheiro (F2)"
//           icon={<img src={real} alt="Real Icon" style={{ width: 28, height: 28 }} />}
//           onClick={() => {
//             const val = Math.max(0, totalDue - totalPayments);
//             if (!val) return toast.info("Sem restante.");
//             const pm = { id: Date.now(), method: "Dinheiro", amount: Number(val.toFixed(2)), machine: "", installments: 1 };
//             dispatch({ type: "UPDATE_PAYMENT", payload: {} });
//             dispatch({ type: "CLEAR_PAYMENTS" });
//             dispatch({ type: "ADD_PAYMENT", payload: val });
//           }}
//           style={{ flex: 1, minWidth: 160, maxWidth: 200, background: "#fff", borderColor: C.red, color: C.red }}
//         />

//         <Button
//           outlined
//           label="PIX — Gerar QR Code"
//           icon={<img src={pixIcon} alt="Pix Icon" style={{ width: 28, height: 28 }} />}
//           onClick={() => {
//             const val = Math.max(0, totalDue - totalPayments);
//             if (!val) return toast.info("Sem restante.");
//             const pm = { id: Date.now(), method: "PIX", amount: Number(val.toFixed(2)), machine: "", installments: 1 };
//             // Apenas acrescenta
//             dispatch({ type: "UPDATE_PAYMENT", payload: {} });
//             // push manual
//             const next = [...state.payments, pm];
//             const fake = { type: "__SET_PAYMENTS__", payload: next };
//             // reducer não tem essa action; então usamos um truque: CLEAR + re-add
//             // (para manter o reducer original)
//             dispatch({ type: "CLEAR_PAYMENTS" });
//             next.forEach((p) => dispatch({ type: "ADD_PAYMENT", payload: p.amount }));
//             toast.success("PIX adicionado (simulado). Integração real do QR fica no backend.");
//           }}
//           style={{ flex: 1, minWidth: 160, maxWidth: 230, background: "#fff", borderColor: C.red, color: C.red }}
//         />

//         <Button
//           outlined
//           label="Maquininha — Débito/Crédito"
//           icon={<img src={maquininhaIcon} alt="POS" style={{ width: 40 }} />}
//           onClick={() => {
//             const val = Math.max(0, totalDue - totalPayments);
//             if (!val) return toast.info("Sem restante.");
//             const base = { id: Date.now(), amount: Number(val.toFixed(2)), machine: "", installments: 1 };
//             const pCredit = { ...base, method: "Cartão de Crédito" };
//             const pDebit = { ...base, method: "Cartão de Débito" };
//             // Apenas adiciona um método (crédito por padrão); usuário pode trocar abaixo
//             const next = [...state.payments, pCredit];
//             dispatch({ type: "CLEAR_PAYMENTS" });
//             next.forEach((p) => dispatch({ type: "ADD_PAYMENT", payload: p.amount }));
//             toast.info("Selecione a máquina e, se crédito, informe as parcelas.");
//           }}
//           style={{ flex: 1, minWidth: 180, maxWidth: 240, background: "#fff", borderColor: C.red, color: C.red }}
//         />

//         <Button
//           label="Ative o Pix com a Bling Conta"
//           onClick={() => toast.info("Ação de ativação do PIX é externa (Bling Conta)")}
//           style={{ backgroundColor: C.red, color: "white", flex: 1, minWidth: 220 }}
//         />

//         <Button outlined label="Gerar Carnê" onClick={() => setOpenCarnet(true)} />
//       </div>

//       {/* Lista de pagamentos */}
//       <div style={{ display: "grid", gap: 10 }}>
//         {state.payments.map((p) => (
//           <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
//               <div>
//                 <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Método</label>
//                 <Select
//                   value={p.method}
//                   onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: v } })}
//                   options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Valor</label>
//                 <Input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={p.amount}
//                   onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
//                 />
//               </div>
//               {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
//                 <>
//                   <div>
//                     <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Máquina</label>
//                     <Select
//                       value={p.machine}
//                       onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: v } })}
//                       options={MACHINE_OPTIONS.map((m) => ({ value: m.name, label: m.name }))}
//                       placeholder="Selecione a máquina"
//                     />
//                   </div>
//                   {p.method === "Cartão de Crédito" && (
//                     <div>
//                       <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Parcelas</label>
//                       <Input
//                         type="number"
//                         min="1"
//                         step="1"
//                         value={p.installments || 1}
//                         onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })}
//                       />
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//             <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
//               <button
//                 onClick={() =>
//                   dispatch({
//                     type: "UPDATE_PAYMENT",
//                     payload: { id: p.id, field: "amount", value: Math.max(0, totalDue - totalPayments + p.amount) },
//                   })
//                 }
//                 style={{ fontSize: 12, color: "#555" }}
//               >
//                 Usar restante
//               </button>
//               <button onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} style={{ color: C.red, fontWeight: 700 }}>
//                 Remover
//               </button>
//             </div>
//           </div>
//         ))}

//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <small style={{ color: "#666" }}>Dica: F2 adiciona o restante automaticamente.</small>
//           <div style={{ display: "flex", gap: 8 }}>
//             <Button outlined title="Limpar pagamentos" onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })} icon={<XMarkIcon style={{ width: 18, height: 18 }} />} />
//             <Button title="Adicionar método (restante)" onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })}>
//               Adicionar Método
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Modal Carnê */}
//       <Modal
//         open={openCarnet}
//         onClose={() => setOpenCarnet(false)}
//         title="Confirme os Dados do Carnê"
//         footer={
//           <>
//             <Button outlined label="Cancelar" onClick={() => setOpenCarnet(false)} style={{ borderColor: C.border, color: "#555" }} />
//             <Button
//               label="Confirmar e Baixar"
//               onClick={async () => {
//                 await downloadCarnet();
//                 setOpenCarnet(false);
//               }}
//             />
//           </>
//         }
//       >
//         <h5 style={{ marginTop: 0, marginBottom: 8, fontWeight: 800 }}>Resumo do Carnê</h5>
//         <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
//           <li>Total: {formatCurrency(totalDue)}</li>
//         </ul>
//       </Modal>
//     </div>
//   );

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case "produto":
//         return <ProdutoStep />;
//       case "cliente":
//         return <ClienteStep />;
//       case "pagamento":
//         return <PagamentoStep />;
//       default:
//         return null;
//     }
//   };

//   /* ============================== UI principal ============================= */
//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: C.bgApp }}>
//       {/* Header */}
//       <div
//         style={{
//           background: C.red,
//           color: "white",
//           padding: "8px 12px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           boxShadow: "0 2px 4px rgba(0,0,0,.12)",
//         }}
//       >
//         <img src={logo} alt="Venda-PRO" style={{ height: 50, width: 150, display: "block" }} />

//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <div style={{ position: "relative", width: 320, maxWidth: "48vw" }}>
//             <MagnifyingGlassIcon
//               style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#666" }}
//             />
//             <Input
//               placeholder="Buscar venda — (Alt+P)"
//               style={{ paddingRight: 44, background: "#fff", borderColor: "#efefef", fontWeight: 600 }}
//               onFocus={() => setCurrentStep("produto")}
//             />
//           </div>

//           <Button
//             outlined
//             title="Voltar ao Dashboard"
//             icon={<HomeIcon style={{ width: 18, height: 18, color: C.red }} />}
//             onClick={() => navigate("/")}
//             style={{
//               background: "#fff",
//               color: C.red,
//               borderColor: "#ffd8dc",
//               padding: 10,
//               width: 38,
//               height: 38,
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           />
//         </div>
//       </div>

//       {/* Conteúdo */}
//       <div style={{ display: "flex", flexGrow: 1, gap: 16, padding: 8, marginBottom: 86 }}>
//         {/* Coluna esquerda */}
//         <div
//           style={{
//             flexBasis: "43%",
//             minWidth: 420,
//             display: "flex",
//             flexDirection: "column",
//             background: C.card,
//             borderRadius: 10,
//             padding: 10,
//             border: `1px solid ${C.border}`,
//           }}
//         >
//           <NavigationSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />
//           {renderStepContent()}
//         </div>

//         {/* Coluna direita — Carrinho */}
//         <div
//           style={{
//             flexBasis: "57%",
//             minWidth: 520,
//             background: C.rightPanel,
//             borderRadius: 10,
//             border: `1px solid ${C.border}`,
//             display: "flex",
//             flexDirection: "column",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>Caixa</div>

//           <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
//             {state.cart.length === 0 ? (
//               <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#888" }}>
//                 <div style={{ color: C.red, fontWeight: 800, marginBottom: 8 }}>Nenhum produto no carrinho</div>
//                 <ShoppingCartIcon style={{ width: 120, height: 120, color: "#c9c9c9" }} />
//               </div>
//             ) : (
//               <div style={{ display: "grid", gap: 10 }}>
//                 {state.cart.map((it) => (
//                   <div key={it.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, background: "#fff" }}>
//                     <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 12,
//                           flexWrap: "nowrap",
//                           width: "100%",
//                         }}
//                       >
//                         {/* Nome + sub (um embaixo do outro) */}
//                         <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
//                           <div
//                             style={{
//                               fontWeight: 700,
//                               lineHeight: 1.1,
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {it.name}
//                           </div>

//                           {/* Sub: sem preço — preço vai no fim da linha */}
//                           <div
//                             style={{
//                               fontSize: 12,
//                               color: C.muted,
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {it.brand} • estoque {it.stock}
//                           </div>
//                         </div>

//                         {/* Botões ao lado do bloco de texto */}
//                         <div
//                           style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             border: `1px solid ${C.border}`,
//                             borderRadius: 8,
//                             flex: "0 0 auto",
//                           }}
//                         >
//                           <button
//                             type="button"
//                             onClick={() =>
//                               dispatch({
//                                 type: "UPDATE_QTY",
//                                 payload: { id: it.id, qty: Math.max(1, it.quantity - 1) },
//                               })
//                             }
//                             style={{
//                               padding: "6px 10px",
//                               background: "#fafafa",
//                               borderRight: `1px solid ${C.border}`,
//                               cursor: "pointer",
//                             }}
//                             aria-label="Diminuir quantidade"
//                           >
//                             <MinusIcon style={{ width: 14, height: 14 }} />
//                           </button>

//                           <Input
//                             type="number"
//                             min="1"
//                             value={it.quantity}
//                             onChange={(e) =>
//                               dispatch({
//                                 type: "UPDATE_QTY",
//                                 payload: { id: it.id, qty: Number(e.target.value) || 1 },
//                               })
//                             }
//                             style={{ width: 56, textAlign: "center", border: "none" }}
//                             aria-label="Quantidade"
//                           />

//                           <button
//                             type="button"
//                             onClick={() =>
//                               dispatch({
//                                 type: "UPDATE_QTY",
//                                 payload: { id: it.id, qty: it.quantity + 1 },
//                               })
//                             }
//                             style={{
//                               padding: "6px 10px",
//                               background: "#fafafa",
//                               borderLeft: `1px solid ${C.border}`,
//                               cursor: "pointer",
//                             }}
//                             aria-label="Aumentar quantidade"
//                           >
//                             <PlusIcon style={{ width: 14, height: 14 }} />
//                           </button>
//                         </div>

//                         {/* Preço distante no final da linha */}
//                         {/* <div
//     style={{
//       marginLeft: "auto",
//       fontWeight: 700,
//       whiteSpace: "nowrap",
//       textAlign: "right",
//     }}
//   >
//     {formatCurrency(it.price)}
//   </div> */}
//                       </div>



//                       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                         <span style={{ fontWeight: 800 }}>{formatCurrency(it.total)}</span>
//                         <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })} title="Remover" style={{ color: C.red }}>
//                           <TrashIcon style={{ width: 18, height: 18 }} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Resumo à direita */}
//           <div style={{ padding: 12, background: "#fff", borderTop: `1px solid ${C.border}` }}>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 6, fontSize: 14 }}>
//               <div>Subtotal</div><div style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</div>
//               <div>Desconto</div><div>- {formatCurrency(discount)}</div>
//               <div>Acréscimo</div><div>+ {formatCurrency(surcharge)}</div>
//               <div style={{ gridColumn: "1 / span 2", borderTop: `1px dashed ${C.border}`, marginTop: 6 }} />
//               <div style={{ fontWeight: 800 }}>Total a pagar</div>
//               <div style={{ fontWeight: 900 }}>{formatCurrency(totalDue)}</div>
//               <div>Total pago</div><div style={{ fontWeight: 600 }}>{formatCurrency(totalPayments)}</div>
//               {change > 0 && (<><div>Troco</div><div style={{ fontWeight: 800 }}>{formatCurrency(change)}</div></>)}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Rodapé fixo */}
//       <div
//         style={{
//           background: "#fff",
//           padding: 12,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           borderTop: `1px solid ${C.border}`,
//           boxShadow: "0 -2px 6px rgba(0,0,0,.06)",
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           zIndex: 10,
//         }}
//       >
//         <Button
//           outlined
//           danger
//           label="Excluir venda (Alt+Q)"
//           onClick={() => dispatch({ type: "RESET_ALL" })}
//           style={{ background: "#fff", color: C.red, borderColor: "#ffccd2", paddingLeft: 16, paddingRight: 16 }}
//         />

//         <Button
//           label="Finalizar venda (F3)"
//           onClick={handleFinalize}
//           disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue}
//           style={{ background: C.red, margin: "0 auto", borderRadius: 8, paddingLeft: 18, paddingRight: 18 }}
//           icon={<PrinterIcon style={{ width: 18, height: 18 }} />}
//         />

//         <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: "#333" }}>
//           <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
//           <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".5px" }}>{formatCurrency(totalDue)}</div>
//         </div>
//       </div>

//       {/* VENDAS ESTACIONADAS */}
//       {state.parked.length > 0 && (
//         <div style={{ position: "fixed", right: 8, bottom: 98, width: 360, maxHeight: 320, overflow: "auto", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10 }}>
//           <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
//             <span>Vendas Estacionadas</span>
//             <span style={{ color: C.muted, fontSize: 12 }}>{state.parked.length}</span>
//           </div>
//           <div style={{ padding: 10, display: "grid", gap: 8 }}>
//             {state.parked.map((p) => (
//               <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
//                 <div style={{ fontSize: 12 }}>
//                   <div style={{ fontWeight: 700 }}>#{p.id}</div>
//                   <div style={{ color: C.muted }}>{new Date(p.createdAt).toLocaleString("pt-BR")}{" • "}{p.snapshot.cart.length} itens</div>
//                 </div>
//                 <div style={{ display: "flex", gap: 6 }}>
//                   <Button
//                     onClick={() => {
//                       dispatch({ type: "RESUME_PARKED", payload: p.id });
//                       toast.info("Venda retomada no checkout.");
//                     }}
//                     style={{ background: "#2563eb" }}
//                     icon={<PlayIcon style={{ width: 16, height: 16 }} />}
//                   >
//                     Retomar
//                   </Button>
//                   <Button outlined onClick={() => dispatch({ type: "DELETE_PARKED", payload: p.id })}>Excluir</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  ShoppingCartIcon,
  HomeIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  UserPlusIcon,
  PrinterIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api";

// IMAGENS (em src/assets/img)
import maquininhaIcon from "../assets/img/maquininha2.png";
import pixIcon from "../assets/img/pix.svg";
import real from "../assets/img/real.png";
import logo from "../assets/img/logo.png";

/* ============================ Paleta & helpers ============================ */
const C = {
  red: "#ea1d2c",
  redDark: "#d81b28",
  border: "#d9d9d9",
  text: "#2b2b2b",
  muted: "#7a7a7a",
  bgApp: "#f3f3f3",
  card: "#ffffff",
  rightPanel: "#f1f1f1",
};

// Altura visual do rodapé fixo (para espaçamentos)
const FOOTER_H = 86;

const Input = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      width: "100%",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      color: C.text,
      background: "#fff",
      ...style,
    }}
  />
);

const TextArea = ({ style, ...props }) => (
  <textarea
    {...props}
    style={{
      width: "100%",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      color: C.text,
      background: "#fff",
      resize: "vertical",
      ...style,
    }}
  />
);

const Select = ({ options = [], value, onChange, style, placeholder }) => {
  const caret =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>`
    );

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange && onChange(e.target.value || "")}
      style={{
        width: "100%",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 36px 10px 12px",
        outline: "none",
        fontSize: 14,
        color: C.text,
        backgroundColor: "#fff",
        appearance: "none",
        backgroundImage: `url("${caret}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        ...style,
      }}
    >
      <option value="">{placeholder || "Selecione"}</option>
      {options.map((o) => (
        <option key={o.value ?? o.code ?? o.id} value={o.value ?? o.code ?? o.id}>
          {o.label ?? o.name}
        </option>
      ))}
    </select>
  );
};

const Checkbox = ({ checked, onChange, id }) => (
  <input
    id={id}
    type="checkbox"
    checked={!!checked}
    onChange={(e) => onChange && onChange(e.target.checked)}
    style={{ width: 18, height: 18, accentColor: C.red, cursor: "pointer" }}
  />
);

const Button = ({ label, icon, children, outlined, danger, onClick, style, title, disabled }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: outlined ? `1.5px solid ${danger ? C.red : C.red}` : "none",
    background: outlined ? "#fff" : danger ? C.red : C.red,
    color: outlined ? C.red : "#fff",
    transition: "filter .15s ease",
    boxShadow: outlined ? "none" : "0 2px 4px rgba(0,0,0,0.08)",
    ...style,
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      style={base}
      onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
      onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
      disabled={disabled}
    >
      {icon}
      {label ?? children}
    </button>
  );
};

const Modal = ({ open, onClose, title, footer, children }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 520,
          maxWidth: "92vw",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 10px 28px rgba(0,0,0,.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>
          {title}
        </div>
        <div style={{ padding: 16 }}>{children}</div>
        <div
          style={{
            padding: 12,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
};

/* ============================== Domínios ============================= */
const MACHINE_OPTIONS = [
  { id: "machine_a", name: "Máquina A" },
  { id: "machine_b", name: "Máquina B" },
  { id: "machine_c", name: "Máquina C" },
];

const PAYMENT_METHODS = ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito", "Transferência"];

const PARKED_KEY = "pdv_parked_sales_v1";

const initialState = {
  products: [],
  customers: [],
  filteredProducts: [],
  isLoading: true,
  searchTerm: "",
  cart: [], // {id,name,brand,price,quantity,stock,total}
  selectedCustomerId: "",
  quickCustomerName: "",
  showQuickCustomer: false,
  payments: [], // {id, method, amount, machine?, installments?}
  discountValue: 0,
  discountPct: 0,
  surchargeValue: 0,
  printReceipt: true,
  notes: "",
  parked: [], // [{id, createdAt, snapshot}]
};

function readParked() {
  try {
    const raw = localStorage.getItem(PARKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeParked(arr) {
  localStorage.setItem(PARKED_KEY, JSON.stringify(arr));
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA": {
      const { products, customers } = action.payload;
      const available = products.filter((p) => Number(p.stock) > 0);
      return { ...state, products, customers, filteredProducts: available, isLoading: false, parked: readParked() };
    }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SEARCH": {
      const searchTerm = action.payload.trim().toLowerCase();
      const filtered = searchTerm
        ? state.products.filter((p) => `${p.name} ${p.brand} ${p.code ?? ""}`.toLowerCase().includes(searchTerm))
        : state.products.filter((p) => Number(p.stock) > 0);
      return { ...state, searchTerm: action.payload, filteredProducts: filtered };
    }

    // CART
    case "ADD_TO_CART": {
      const p = action.payload;
      const existing = state.cart.find((i) => i.id === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) {
          toast.warning(`Estoque máximo atingido para ${p.name}`);
          return state;
        }
        const cart = state.cart.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i
        );
        return { ...state, cart };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { id: p.id, name: p.name, brand: p.brand, price: Number(p.price) || 0, quantity: 1, stock: Number(p.stock) || 0, total: Number(p.price) || 0 },
        ],
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) return state;
      const it = state.cart.find((i) => i.id === id);
      if (!it) return state;
      if (qty > it.stock) {
        toast.warning(`Estoque máximo atingido para ${it.name}`);
        return state;
      }
      const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i));
      return { ...state, cart };
    }
    case "CLEAR_CART":
      return { ...state, cart: [] };

    // CLIENTE
    case "SET_CUSTOMER":
      return { ...state, selectedCustomerId: action.payload };
    case "SET_QUICK_CUSTOMER":
      return { ...state, quickCustomerName: action.payload };
    case "TOGGLE_QUICK_CUSTOMER":
      return { ...state, showQuickCustomer: !state.showQuickCustomer };

    // PAGAMENTOS
    case "ADD_PAYMENT": {
      const remaining = action.payload;
      if (remaining <= 0) {
        toast.info("Nada a adicionar — total já coberto.");
        return state;
      }
      const pm = { id: Date.now(), method: "Dinheiro", amount: Number(remaining.toFixed(2)), machine: "", installments: 1 };
      return { ...state, payments: [...state.payments, pm] };
    }
    case "UPDATE_PAYMENT": {
      const { id, field, value } = action.payload;
      const payments = state.payments.map((pm) =>
        pm.id === id
          ? {
            ...pm,
            [field]: field === "amount" || field === "installments" ? Number(value) || 0 : value,
            ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
              ? { machine: "", installments: 1 }
              : {}),
          }
          : pm
      );
      return { ...state, payments };
    }
    case "REMOVE_PAYMENT":
      return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) };
    case "CLEAR_PAYMENTS":
      return { ...state, payments: [] };

    // TOTAIS
    case "SET_DISCOUNT_VALUE":
      return { ...state, discountValue: Number(action.payload) || 0, discountPct: 0 };
    case "SET_DISCOUNT_PCT":
      return { ...state, discountPct: Number(action.payload) || 0 };
    case "SET_SURCHARGE":
      return { ...state, surchargeValue: Number(action.payload) || 0 };

    // OUTROS
    case "SET_PRINT":
      return { ...state, printReceipt: !!action.payload };
    case "SET_NOTES":
      return { ...state, notes: action.payload };

    // ESTACIONAR
    case "LOAD_PARKED":
      return { ...state, parked: readParked() };
    case "PARK_CURRENT": {
      const snapshot = {
        cart: state.cart,
        payments: state.payments,
        selectedCustomerId: state.selectedCustomerId,
        discountValue: state.discountValue,
        discountPct: state.discountPct,
        surchargeValue: state.surchargeValue,
        notes: state.notes,
      };
      const entry = { id: Date.now(), createdAt: new Date().toISOString(), snapshot };
      const next = [entry, ...state.parked];
      writeParked(next);
      toast.success("Venda estacionada!");
      return { ...state, parked: next };
    }
    case "RESUME_PARKED": {
      const id = action.payload;
      const entry = state.parked.find((p) => p.id === id);
      if (!entry) return state;
      return { ...state, ...entry.snapshot };
    }
    case "DELETE_PARKED": {
      const id = action.payload;
      const next = state.parked.filter((p) => p.id !== id);
      writeParked(next);
      return { ...state, parked: next };
    }

    case "RESET_ALL":
      return {
        ...initialState,
        products: state.products,
        customers: state.customers,
        filteredProducts: state.filteredProducts,
        parked: state.parked,
        isLoading: false,
      };
    default:
      return state;
  }
}

const downloadCarnet = async () => {
  try {
    const response = await fetch("http://localhost:3000/gerar-carne", { method: "GET" });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "carne-pagamento-12x.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    toast.error("Falha ao gerar carnê");
  }
};

/* ============================== Subcomponentes UI ============================= */
const NavigationSteps = ({ currentStep, setCurrentStep }) => {
  const steps = React.useMemo(
    () => [
      { label: "Produto (Alt+Z)", key: "produto" },
      { label: "Cliente (Alt+C)", key: "cliente" },
      { label: "Pagamento (Alt+B)", key: "pagamento" },
    ],
    []
  );
  const ARROW_W = 18;
  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "hidden",
        padding: 4,
        border: `1px solid ${C.border}`,
      }}
    >
      {steps.map((step, index) => {
        const active = currentStep === step.key;
        return (
          <div
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            style={{
              flex: 1,
              position: "relative",
              padding: "10px 16px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 14,
              color: active ? "#fff" : "#666",
              background: active ? C.red : "#e1e1e1",
              cursor: "pointer",
              userSelect: "none",
              transition: "background .2s ease",
              borderTopLeftRadius: index === 0 ? 6 : 0,
              borderBottomLeftRadius: index === 0 ? 6 : 0,
              borderTopRightRadius: index === steps.length - 1 ? 6 : 0,
              borderBottomRightRadius: index === steps.length - 1 ? 6 : 0,
              zIndex: active ? 3 : 1,
            }}
          >
            {step.label}
            {active && index < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "calc(100% - 1px)",
                  width: ARROW_W,
                  background: C.red,
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ============================== Tela principal ============================= */
export default function PDVPro() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState("produto");
  const [barcodeReader, setBarcodeReader] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load data
  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const [prods, custs] = await Promise.all([fetchProducts(), fetchCustomers()]);
        dispatch({ type: "SET_DATA", payload: { products: prods, customers: custs } });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar dados");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    })();
  }, []);

  // Totais
  const subtotal = useMemo(() => state.cart.reduce((s, i) => s + i.total, 0), [state.cart]);
  const discountFromPct = useMemo(() => {
    const pct = Math.max(0, Math.min(100, state.discountPct || 0));
    return Number(((subtotal * pct) / 100).toFixed(2));
  }, [subtotal, state.discountPct]);
  const discount = state.discountPct > 0 ? discountFromPct : Math.min(state.discountValue || 0, subtotal);
  const surcharge = Math.max(0, state.surchargeValue || 0);
  const totalDue = useMemo(() => Math.max(0, Number((subtotal - discount + surcharge).toFixed(2))), [subtotal, discount, surcharge]);
  const totalPayments = useMemo(() => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0), [state.payments]);
  const remaining = Number((totalDue - totalPayments).toFixed(2));
  const change = remaining < 0 ? Math.abs(remaining) : 0;

  // Atalhos
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === "z" || e.key === "Z")) setCurrentStep("produto");
      if (e.altKey && (e.key === "c" || e.key === "C")) setCurrentStep("cliente");
      if (e.altKey && (e.key === "b" || e.key === "B")) setCurrentStep("pagamento");

      if (e.key === "F4") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "F2") {
        e.preventDefault();
        dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) });
      } else if (e.key === "F3") {
        e.preventDefault();
        handleFinalize();
      } else if (e.altKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault();
        dispatch({ type: "RESET_ALL" });
      } else if (e.key === "Escape") {
        e.preventDefault();
        navigate("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const addDefaultPaymentIfEmpty = () => {
    if (state.cart.length === 0) return toast.error("Adicione produtos ao carrinho.");
    if (state.payments.length === 0) dispatch({ type: "ADD_PAYMENT", payload: totalDue });
  };

  const handleQuickCustomerAdd = async () => {
    const name = state.quickCustomerName?.trim();
    if (!name) return toast.error("Digite o nome do cliente.");
    try {
      const created = await createCustomer({ name });
      toast.success("Cliente adicionado");
      dispatch({ type: "SET_DATA", payload: { products: state.products, customers: [...state.customers, created] } });
      dispatch({ type: "SET_CUSTOMER", payload: created.id });
      dispatch({ type: "SET_QUICK_CUSTOMER", payload: "" });
      if (state.showQuickCustomer) dispatch({ type: "TOGGLE_QUICK_CUSTOMER" });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao adicionar cliente");
    }
  };

  const validateBeforeFinalize = () => {
    if (state.cart.length === 0) return toast.error("Carrinho vazio."), false;
    if (state.payments.length === 0) return toast.error("Adicione um método de pagamento."), false;
    if (totalPayments + 0.001 < totalDue) return toast.error("Pagamentos devem cobrir o total."), false;
    const cardPays = state.payments.filter((p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito");
    if (cardPays.some((p) => !p.machine)) return toast.error("Selecione a máquina para todos cartões."), false;
    return true;
  };

  const openReceipt = (payload) => {
    try {
      const toBRL = (n) => (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const d = new Date(payload.date);
      const itemsRows = payload.items
        .map(
          (it) =>
            `<tr><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${toBRL(it.unitPrice)}</td><td style="text-align:right">${toBRL(it.total)}</td></tr>`
        )
        .join("");
      const payRows = (payload.payments || [])
        .map(
          (pm) =>
            `<div>${pm.method}${pm.machine ? " (" + pm.machine + ")" : ""}${pm.installments > 1 ? ` ${pm.installments}x` : ""}: <strong>${toBRL(
              pm.amount
            )}</strong></div>`
        )
        .join("");
      const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Recibo</title>
      <style>body{font-family:Arial,sans-serif;margin:16px}h1{font-size:18px;margin:0}small{color:#555}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border-bottom:1px solid #eee;padding:6px 4px;font-size:12px}.right{text-align:right}.tot{margin-top:8px;border-top:1px dashed #333;padding-top:8px}</style>
      <body><h1>Recibo de Venda</h1><small>${d.toLocaleString("pt-BR")}</small>
      <div style="margin-top:6px">Cliente: <strong>${payload.customerName || "—"}</strong></div>
      <table><thead><tr><th>Produto</th><th class="right">Qtd</th><th class="right">Unit.</th><th class="right">Total</th></tr></thead><tbody>${itemsRows}</tbody></table>
      <div class="tot"><div>Subtotal: <strong>${toBRL(payload.subtotal)}</strong></div>
      <div>Desconto: <strong>${toBRL(payload.discount)}</strong> &nbsp; Acréscimo: <strong>${toBRL(payload.surcharge)}</strong></div>
      <div>Total: <strong>${toBRL(payload.total)}</strong></div>${payload.change > 0 ? `<div>Troco: <strong>${toBRL(payload.change)}</strong></div>` : ""}</div>
      <div style="margin-top:8px">${payRows}</div>${payload.notes ? `<div style="margin-top:8px"><em>${payload.notes}</em></div>` : ""}
      <script>window.onload=()=>{window.print()}</script></body></html>`;
      const w = window.open("", "_blank");
      w.document.write(html);
      w.document.close();
    } catch { }
  };

  const handleFinalize = async () => {
    if (!validateBeforeFinalize()) return;
    const customerName = state.selectedCustomerId
      ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
      : "Cliente não identificado";

    const payload = {
      customerId: state.selectedCustomerId || null,
      customerName,
      items: state.cart.map((i) => ({ productId: i.id, name: i.name, qty: i.quantity, unitPrice: i.price, total: i.total })),
      payments: state.payments,
      subtotal,
      discount,
      surcharge,
      total: totalDue,
      change,
      notes: state.notes?.trim() || undefined,
      date: new Date().toISOString(),
    };

    try {
      await createSale(payload);
      toast.success("Venda finalizada!");
      if (state.printReceipt) openReceipt(payload);
      dispatch({ type: "RESET_ALL" });
      const prods = await fetchProducts();
      dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao finalizar venda");
    }
  };

  const firstFiltered = state.filteredProducts[0];

  /* ============================== Steps ============================= */
  const ProdutoStep = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Input
          ref={searchRef}
          placeholder="F4 para focar — pesquise por nome, marca ou código (Enter adiciona 1º)"
          value={state.searchTerm}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && firstFiltered) dispatch({ type: "ADD_TO_CART", payload: firstFiltered });
          }}
          style={{ flex: 1 }}
        />
        <Button
          title="F2 — adiciona método com o restante"
          onClick={addDefaultPaymentIfEmpty}
          icon={<CreditCardIcon style={{ width: 18, height: 18 }} />}
          outlined
          style={{ padding: "10px 12px" }}
        />
        <Button
          title="Estacionar venda atual"
          onClick={() => {
            dispatch({ type: "PARK_CURRENT" });
            dispatch({ type: "RESET_ALL" });
          }}
          outlined
          style={{ background: "#fff", color: "#333", borderColor: C.border }}
          icon={<PauseIcon style={{ width: 18, height: 18 }} />}
        />
        <Button
          title="Recarregar estacionadas"
          onClick={() => dispatch({ type: "LOAD_PARKED" })}
          outlined
          style={{ background: "#fff", color: "#333", borderColor: C.border }}
          icon={<ArrowPathIcon style={{ width: 18, height: 18 }} />}
        />
      </div>

      <label htmlFor="barcodeReader" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#555", fontSize: 14 }}>
        <Checkbox id="barcodeReader" checked={barcodeReader} onChange={setBarcodeReader} />
        Leitor de código de barras
      </label>

      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          height: 390,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
          <span>Produtos ({state.filteredProducts.length})</span>
          <span style={{ color: C.muted, fontWeight: 600 }}>Enter adiciona o primeiro</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {state.isLoading ? (
            <div style={{ padding: 16, color: C.muted }}>Carregando…</div>
          ) : state.filteredProducts.length ? (
            state.filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    <span style={{ background: "#f3f3f3", padding: "2px 6px", borderRadius: 6, marginRight: 6 }}>{p.brand}</span>
                    Est.: {p.stock} {p.code ? ` • ${p.code}` : ""}
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>{formatCurrency(p.price)}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: 16, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
              <PhotoIcon style={{ width: 18, height: 18 }} /> Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ClienteStep = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#444", fontSize: 14 }}>Cliente (opcional)</label>
          <Select
            value={state.selectedCustomerId}
            onChange={(v) => dispatch({ type: "SET_CUSTOMER", payload: v })}
            options={state.customers.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Selecione um cliente"
          />
        </div>
        <Button
          title="Cadastro rápido"
          onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })}
          icon={<UserPlusIcon style={{ width: 18, height: 18 }} />}
          style={{ background: "#16a34a" }}
        >
          Novo
        </Button>
      </div>

      {state.showQuickCustomer && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
          <Input
            placeholder="Nome rápido do cliente"
            value={state.quickCustomerName}
            onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
          />
          <Button onClick={handleQuickCustomerAdd} style={{ background: "#16a34a" }}>
            Salvar
          </Button>
        </div>
      )}

      <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 14 }}>
        <Checkbox checked={state.printReceipt} onChange={(v) => dispatch({ type: "SET_PRINT", payload: v })} />
        Imprimir recibo
      </label>

      <TextArea
        rows={3}
        placeholder="Observações na venda (opcional)"
        value={state.notes}
        onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })}
        style={{ marginTop: 10 }}
      />
    </div>
  );

  const [openCarnet, setOpenCarnet] = useState(false);
  const PagamentoStep = () => (
    <div>
      <h5 style={{ margin: "0 0 8px", fontWeight: 800 }}>Totais</h5>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Subtotal</label>
          <Input type="text" value={formatCurrency(subtotal)} readOnly />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (R$)</label>
          <Input type="number" step="0.01" min="0" value={state.discountPct > 0 ? 0 : state.discountValue} onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })} />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (%)</label>
          <Input type="number" step="0.1" min="0" max="100" value={state.discountPct} onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Acréscimo (R$)</label>
          <Input type="number" step="0.01" min="0" value={state.surchargeValue} onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })} />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total a pagar</label>
          <Input type="text" value={formatCurrency(totalDue)} readOnly />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total pago</label>
          <Input type="text" value={formatCurrency(totalPayments)} readOnly />
        </div>
      </div>

      <h5 style={{ margin: "12px 0 8px", fontWeight: 800 }}>Forma de Pagamento</h5>

      {/* Ações rápidas */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
        <Button
          outlined
          label="Dinheiro (F2)"
          icon={<img src={real} alt="Real Icon" style={{ width: 28, height: 28 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
            const pm = { id: Date.now(), method: "Dinheiro", amount: Number(val.toFixed(2)), machine: "", installments: 1 };
            dispatch({ type: "UPDATE_PAYMENT", payload: {} });
            dispatch({ type: "CLEAR_PAYMENTS" });
            dispatch({ type: "ADD_PAYMENT", payload: val });
          }}
          style={{ flex: 1, minWidth: 160, maxWidth: 200, background: "#fff", borderColor: C.red, color: C.red }}
        />

        <Button
          outlined
          label="PIX — Gerar QR Code"
          icon={<img src={pixIcon} alt="Pix Icon" style={{ width: 28, height: 28 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
            const pm = { id: Date.now(), method: "PIX", amount: Number(val.toFixed(2)), machine: "", installments: 1 };
            dispatch({ type: "UPDATE_PAYMENT", payload: {} });
            const next = [...state.payments, pm];
            dispatch({ type: "CLEAR_PAYMENTS" });
            next.forEach((p) => dispatch({ type: "ADD_PAYMENT", payload: p.amount }));
            toast.success("PIX adicionado (simulado). Integração real do QR fica no backend.");
          }}
          style={{ flex: 1, minWidth: 160, maxWidth: 230, background: "#fff", borderColor: C.red, color: C.red }}
        />

        <Button
          outlined
          label="Maquininha — Débito/Crédito"
          icon={<img src={maquininhaIcon} alt="POS" style={{ width: 40 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
            const base = { id: Date.now(), amount: Number(val.toFixed(2)), machine: "", installments: 1 };
            const pCredit = { ...base, method: "Cartão de Crédito" };
            const next = [...state.payments, pCredit];
            dispatch({ type: "CLEAR_PAYMENTS" });
            next.forEach((p) => dispatch({ type: "ADD_PAYMENT", payload: p.amount }));
            toast.info("Selecione a máquina e, se crédito, informe as parcelas.");
          }}
          style={{ flex: 1, minWidth: 180, maxWidth: 240, background: "#fff", borderColor: C.red, color: C.red }}
        />
      </div>

      {/* Lista de pagamentos */}
      <div style={{ display: "grid", gap: 10 }}>
        {state.payments.map((p) => (
          <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Método</label>
                <Select
                  value={p.method}
                  onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: v } })}
                  options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Valor</label>
                <Input
                  step="0.01"
                  min="0"
                  value={p.amount}
                  onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
                />
              </div>
              {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
                <>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Máquina</label>
                    <Select
                      value={p.machine}
                      onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: v } })}
                      options={MACHINE_OPTIONS.map((m) => ({ value: m.name, label: m.name }))}
                      placeholder="Selecione a máquina"
                    />
                  </div>
                  {p.method === "Cartão de Crédito" && (
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Parcelas</label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={p.installments || 1}
                        onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() =>
                  dispatch({
                    type: "UPDATE_PAYMENT",
                    payload: { id: p.id, field: "amount", value: Math.max(0, totalDue - totalPayments + p.amount) },
                  })
                }
                style={{ fontSize: 12, color: "#555" }}
              >
                Usar restante
              </button>
              <button onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} style={{ color: C.red, fontWeight: 700 }}>
                Remover
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <small style={{ color: "#666" }}>Dica: F2 adiciona o restante automaticamente.</small>
          <div style={{ display: "flex", gap: 8 }}>
            <Button outlined title="Limpar pagamentos" onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })} icon={<XMarkIcon style={{ width: 18, height: 18 }} />} />
            <Button title="Adicionar método (restante)" onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })}>
              Adicionar Método
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Carnê */}
      <Modal
        open={openCarnet}
        onClose={() => setOpenCarnet(false)}
        title="Confirme os Dados do Carnê"
        footer={
          <>
            <Button outlined label="Cancelar" onClick={() => setOpenCarnet(false)} style={{ borderColor: C.border, color: "#555" }} />
            <Button
              label="Confirmar e Baixar"
              onClick={async () => {
                await downloadCarnet();
                setOpenCarnet(false);
              }}
            />
          </>
        }
      >
        <h5 style={{ marginTop: 0, marginBottom: 8, fontWeight: 800 }}>Resumo do Carnê</h5>
        <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
          <li>Total: {formatCurrency(totalDue)}</li>
        </ul>
      </Modal>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "produto":
        return <ProdutoStep />;
      case "cliente":
        return <ClienteStep />;
      case "pagamento":
        return <PagamentoStep />;
      default:
        return null;
    }
  };

  /* ============================== UI principal ============================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "auto", background: C.bgApp }}>
      {/* Header */}
      <div
        style={{
          background: C.red,
          color: "white",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,.12)",
        }}
      >
        <img src={logo} alt="Venda-PRO" style={{ height: 50, width: 150, display: "block" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 320, maxWidth: "48vw" }}>
            <MagnifyingGlassIcon
              style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#666" }}
            />
            <Input
              placeholder="Buscar venda — (Alt+P)"
              style={{ paddingRight: 44, background: "#fff", borderColor: "#efefef", fontWeight: 600 }}
              onFocus={() => setCurrentStep("produto")}
            />
          </div>

          <Button
            outlined
            title="Voltar ao Dashboard"
            icon={<HomeIcon style={{ width: 18, height: 18, color: C.red }} />}
            onClick={() => navigate("/")}
            style={{
              background: "#fff",
              color: C.red,
              borderColor: "#ffd8dc",
              padding: 10,
              width: 38,
              height: 38,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ display: "flex", flexGrow: 1, minHeight: 0, gap: 16, padding: 8, marginBottom: FOOTER_H }}>
        {/* Coluna esquerda */}
        <div
          style={{
            flexBasis: "43%",
            minWidth: 420,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            background: C.card,
            borderRadius: 10,
            padding: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <NavigationSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />
          {renderStepContent()}
        </div>

        {/* Coluna direita — Carrinho */}
        <div
          style={{
            flexBasis: "57%",
            minWidth: 520,
            minHeight: 0,
            background: C.rightPanel,
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>CAIXA</div>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 7, paddingBottom: FOOTER_H }}>
            {state.cart.length === 0 ? (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#888" }}>
                <div style={{ color: C.red, fontWeight: 800, marginBottom: 8 }}>Nenhum produto no carrinho</div>
                <ShoppingCartIcon style={{ width: 120, height: 120, color: "#c9c9c9" }} />
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {state.cart.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "8px 10px",
                      background: "#fff",
                    }}
                  >
                    {/* Linha 1: Nome (esq)  •  Stepper (dir) */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontWeight: 800,
                          fontSize: 15,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={it.name}
                      >
                        {it.name}
                      </div>

                      {/* Stepper em cápsula, fininho */}
                      {/* Stepper quadrado, com leve boleamento */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "stretch",
                          height: 30,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,            // <- leve boleamento (não redondo)
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        <button
                          onClick={() =>
                            dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })
                          }
                          style={{
                            width: 34,
                            height: 30,
                            display: "grid",
                            placeItems: "center",
                            background: "#fafafa",
                            borderRight: `1px solid ${C.border}`,
                            lineHeight: 1,
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          aria-label="Diminuir"
                          onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
                          onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
                          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                        >
                          –
                        </button>

                        <Input
                          min="1"
                          value={it.quantity}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_QTY",
                              payload: { id: it.id, qty: Number(e.target.value) || 1 },
                            })
                          }
                          style={{
                            width: 40,
                            height: 30,
                            textAlign: "center",
                            border: "none",
                            borderRadius: 0,           // <- tira arredondamento interno do Input
                            background: "transparent",
                            padding: 0,
                            fontWeight: 700,
                            outline: "none",
                            appearance: "textfield",
                            MozAppearance: "textfield",
                          }}
                        />

                        <button
                          onClick={() =>
                            dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })
                          }
                          style={{
                            width: 34,
                            height: 30,
                            display: "grid",
                            placeItems: "center",
                            background: "#fafafa",
                            borderLeft: `1px solid ${C.border}`,
                            lineHeight: 1,
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          aria-label="Aumentar"
                          onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
                          onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
                          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                        >
                          +
                        </button>
                      </div>

                    </div>

                    {/* Linha 2: meta (esq)  •  total + lixeira (dir) */}
                    <div
                      style={{
                        marginTop: 6,
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: C.muted }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: 999,
                            background: "#f5f5f5",
                            border: `1px solid ${C.border}`,
                            marginRight: 6,
                            fontWeight: 600,
                          }}
                        >
                          {it.brand}
                        </span>
                        {formatCurrency(it.price)} • estoque {it.stock}
                      </div>

                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 900, letterSpacing: ".2px" }}>
                          {formatCurrency(it.total)}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })}
                          title="Remover"
                          style={{
                            color: C.red,
                            opacity: 0.9,
                          }}
                        >
                          <TrashIcon style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Resumo à direita */}
          <div style={{ padding: 12, background: "#fff", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 6, fontSize: 14 }}>
              <div>Subtotal</div><div style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</div>
              <div>Desconto</div><div>- {formatCurrency(discount)}</div>
              <div>Acréscimo</div><div>+ {formatCurrency(surcharge)}</div>
              <div style={{ gridColumn: "1 / span 2", borderTop: `1px dashed ${C.border}`, marginTop: 6 }} />
              <div style={{ fontWeight: 800 }}>Total a pagar</div>
              <div style={{ fontWeight: 900 }}>{formatCurrency(totalDue)}</div>
              <div>Total pago</div><div style={{ fontWeight: 600 }}>{formatCurrency(totalPayments)}</div>
              {change > 0 && (<><div>Troco</div><div style={{ fontWeight: 800 }}>{formatCurrency(change)}</div></>)}
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé fixo */}
      <div
        style={{
          background: "#fff",
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${C.border}`,
          boxShadow: "0 -2px 6px rgba(0,0,0,.06)",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Button
          outlined
          danger
          label="Excluir venda (Alt+Q)"
          onClick={() => dispatch({ type: "RESET_ALL" })}
          style={{ background: "#fff", color: C.red, borderColor: "#ffccd2", paddingLeft: 16, paddingRight: 16 }}
        />

        <Button
          label="Finalizar venda (F3)"
          onClick={handleFinalize}
          disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue}
          style={{ background: C.red, margin: "0 auto", borderRadius: 8, paddingLeft: 18, paddingRight: 18 }}
          icon={<PrinterIcon style={{ width: 18, height: 18 }} />}
        />

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: "#333" }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".5px" }}>{formatCurrency(totalDue)}</div>
        </div>
      </div>

      {/* VENDAS ESTACIONADAS */}
      {state.parked.length > 0 && (
        <div style={{ position: "fixed", right: 8, bottom: 98, width: 360, maxHeight: 320, overflow: "auto", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10 }}>
          <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
            <span>Vendas Estacionadas</span>
            <span style={{ color: C.muted, fontSize: 12 }}>{state.parked.length}</span>
          </div>
          <div style={{ padding: 10, display: "grid", gap: 8 }}>
            {state.parked.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>#{p.id}</div>
                  <div style={{ color: C.muted }}>{new Date(p.createdAt).toLocaleString("pt-BR")}{" • "}{p.snapshot.cart.length} itens</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button
                    onClick={() => {
                      dispatch({ type: "RESUME_PARKED", payload: p.id });
                      toast.info("Venda retomada no checkout.");
                    }}
                    style={{ background: "#2563eb" }}
                    icon={<PlayIcon style={{ width: 16, height: 16 }} />}
                  >
                    Retomar
                  </Button>
                  <Button outlined onClick={() => dispatch({ type: "DELETE_PARKED", payload: p.id })}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

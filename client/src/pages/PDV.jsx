// import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   MagnifyingGlassIcon,
//   ShoppingCartIcon,
//   HomeIcon,
//   TrashIcon,
//   PrinterIcon,
//   PlayIcon,
// } from "@heroicons/react/24/outline";

// import { C, FOOTER_H } from "../constants/uiPDV";
// import { reducer, initialState } from "../store/pdv";
// import NavigationSteps from "../components/pdv/NavigationSteps";

// // UI primitives
// import Button from "../components/pdv/ui/Button";
// import Input from "../components/pdv/ui/Input";

// // Steps
// import ProdutoStep from "../components/pdv/steps/ProdutoStep";
// import ClienteStep from "../components/pdv/steps/ClienteStep";
// import PagamentoStep from "../components/pdv/steps/PagamentoStep";

// // utils / services (mantém iguais aos seus)
// import { formatCurrency } from "../utils/format";
// import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api";

// // assets
// import logo from "../assets/img/logo.png";

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

//   // refs para atalhos
//   const totalsRef = useRef({ totalDue: 0, totalPayments: 0 });
//   useEffect(() => {
//     totalsRef.current = { totalDue, totalPayments };
//   }, [totalDue, totalPayments]);

//   const finalizeRef = useRef(null);
//   const handleFinalizeRefSetter = (fn) => (finalizeRef.current = fn);

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

//   // manter referência atualizada da função para uso no listener (F3)
//   useEffect(() => {
//     handleFinalizeRefSetter(handleFinalize);
//   }, [handleFinalize]);

//   // atalhos globais (com guarda quando estiver digitando)
//   useEffect(() => {
//     const onKey = (e) => {
//       const t = e.target;
//       const tag = t?.tagName;
//       const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;
//       if (isTyping) return;

//       if (e.altKey && (e.key === "z" || e.key === "Z")) {
//         e.preventDefault(); setCurrentStep("produto"); return;
//       }
//       if (e.altKey && (e.key === "c" || e.key === "C")) {
//         e.preventDefault(); setCurrentStep("cliente"); return;
//       }
//       if (e.altKey && (e.key === "b" || e.key === "B")) {
//         e.preventDefault(); setCurrentStep("pagamento"); return;
//       }

//       if (e.key === "F4") {
//         e.preventDefault(); searchRef.current?.focus();
//       } else if (e.key === "F2") {
//         e.preventDefault();
//         const { totalDue: td, totalPayments: tp } = totalsRef.current;
//         dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, td - tp) });
//       } else if (e.key === "F3") {
//         e.preventDefault(); finalizeRef.current?.();
//       } else if (e.altKey && (e.key === "q" || e.key === "Q")) {
//         e.preventDefault(); dispatch({ type: "RESET_ALL" });
//       } else if (e.key === "Escape") {
//         e.preventDefault(); navigate("/");
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [navigate]);

//   const firstFiltered = state.filteredProducts[0];

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case "produto":
//         return (
//           <ProdutoStep
//             state={state}
//             dispatch={dispatch}
//             firstFiltered={firstFiltered}
//             totalDue={totalDue}
//             totalPayments={totalPayments}
//             searchRef={searchRef}
//             barcodeReader={barcodeReader}
//             setBarcodeReader={setBarcodeReader}
//           />
//         );
//       case "cliente":
//         return <ClienteStep state={state} dispatch={dispatch} handleQuickCustomerAdd={handleQuickCustomerAdd} />;
//       case "pagamento":
//         return (
//           <PagamentoStep
//             state={state}
//             dispatch={dispatch}
//             subtotal={subtotal}
//             discount={discount}
//             surcharge={surcharge}
//             totalDue={totalDue}
//             totalPayments={totalPayments}
//             change={change}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "auto", background: C.bgApp }}>
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
//       <div style={{ display: "flex", flexGrow: 1, minHeight: 0, gap: 16, padding: 8, marginBottom: FOOTER_H }}>
//         {/* Coluna esquerda */}
//         <div
//           style={{
//             flexBasis: "43%",
//             minWidth: 420,
//             minHeight: 0,
//             display: "flex",
//             flexDirection: "column",
//             background: C.card,
//             borderRadius: 10,
//             padding: 10,
//             border: `1px solid ${C.border}`,
//           }}
//         >
//           <NavigationSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />

//           {/* Wrapper rolável do conteúdo do step */}
//           <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
//             <div style={{ height: "100%", minHeight: 0, overflowY: "auto", paddingRight: 4 }}>
//               {renderStepContent()}
//             </div>
//           </div>
//         </div>

//         {/* Coluna direita — Carrinho */}
//         <div
//           style={{
//             flexBasis: "57%",
//             minWidth: 520,
//             minHeight: 0,
//             background: C.rightPanel,
//             borderRadius: 10,
//             border: `1px solid ${C.border}`,
//             display: "flex",
//             flexDirection: "column",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>CAIXA</div>

//           <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 7, paddingBottom: FOOTER_H }}>
//             {state.cart.length === 0 ? (
//               <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#888" }}>
//                 <div style={{ color: C.red, fontWeight: 800, marginBottom: 8 }}>Nenhum produto no carrinho</div>
//                 <ShoppingCartIcon style={{ width: 120, height: 120, color: "#c9c9c9" }} />
//               </div>
//             ) : (
//               <div style={{ display: "grid", gap: 10 }}>
//                 {state.cart.map((it) => (
//                   <div
//                     key={it.id}
//                     style={{
//                       border: `1px solid ${C.border}`,
//                       borderRadius: 10,
//                       padding: "8px 10px",
//                       background: "#fff",
//                     }}
//                   >
//                     {/* Linha 1 */}
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
//                       <div
//                         style={{
//                           flex: 1,
//                           minWidth: 0,
//                           fontWeight: 800,
//                           fontSize: 15,
//                           whiteSpace: "nowrap",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                         }}
//                         title={it.name}
//                       >
//                         {it.name}
//                       </div>

//                       {/* Stepper */}
//                       <div
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "stretch",
//                           height: 30,
//                           border: `1px solid ${C.border}`,
//                           borderRadius: 8,
//                           overflow: "hidden",
//                           background: "#fff",
//                         }}
//                       >
//                         <button
//                           type="button"
//                           onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })}
//                           style={{
//                             width: 34,
//                             height: 30,
//                             display: "grid",
//                             placeItems: "center",
//                             background: "#fafafa",
//                             borderRight: `1px solid ${C.border}`,
//                             lineHeight: 1,
//                             fontSize: 18,
//                             fontWeight: 700,
//                             cursor: it.quantity <= 1 ? "not-allowed" : "pointer",
//                             opacity: it.quantity <= 1 ? 0.5 : 1,
//                           }}
//                           aria-label="Diminuir"
//                           disabled={it.quantity <= 1}
//                         >
//                           –
//                         </button>

//                         <Input
//                           type="number"
//                           min="1"
//                           value={it.quantity}
//                           onWheel={(e) => e.currentTarget.blur()}
//                           onChange={(e) =>
//                             dispatch({
//                               type: "UPDATE_QTY",
//                               payload: { id: it.id, qty: Number(e.target.value) || 1 },
//                             })
//                           }
//                           style={{
//                             width: 40,
//                             height: 30,
//                             textAlign: "center",
//                             border: "none",
//                             borderRadius: 0,
//                             background: "transparent",
//                             padding: 0,
//                             fontWeight: 700,
//                             outline: "none",
//                             appearance: "textfield",
//                             MozAppearance: "textfield",
//                           }}
//                         />

//                         <button
//                           type="button"
//                           onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })}
//                           style={{
//                             width: 34,
//                             height: 30,
//                             display: "grid",
//                             placeItems: "center",
//                             background: "#fafafa",
//                             borderLeft: `1px solid ${C.border}`,
//                             lineHeight: 1,
//                             fontSize: 18,
//                             fontWeight: 700,
//                             cursor: "pointer",
//                           }}
//                           aria-label="Aumentar"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>

//                     {/* Linha 2 */}
//                     <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
//                       <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: C.muted }}>
//                         <span
//                           style={{
//                             display: "inline-block",
//                             padding: "2px 6px",
//                             borderRadius: 999,
//                             background: "#f5f5f5",
//                             border: `1px solid ${C.border}`,
//                             marginRight: 6,
//                             fontWeight: 600,
//                           }}
//                         >
//                           {it.brand}
//                         </span>
//                         {formatCurrency(it.price)} • estoque {it.stock}
//                       </div>

//                       <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
//                         <span style={{ fontWeight: 900, letterSpacing: ".2px" }}>{formatCurrency(it.total)}</span>
//                         <button
//                           type="button"
//                           onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })}
//                           title="Remover"
//                           style={{ color: C.red, opacity: 0.9 }}
//                         >
//                           <TrashIcon style={{ width: 16, height: 16 }} />
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
//         {/* <Button
//           outlined
//           danger
//           label="Excluir venda (Alt+Q)"
//           onClick={() => dispatch({ type: "RESET_ALL" })}
//           style={{ background: "#fff", color: C.red, borderColor: "#ffccd2", paddingLeft: 16, paddingRight: 16 }}
//         /> */}

//         <Button
//           label="Finalizar venda (F3)"
//           onClick={handleFinalize}
//           disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue}
//           // style={{ background: C.red, margin: "0 auto", borderRadius: 8, paddingLeft: 18, paddingRight: 18 }}
//           style={{ background: C.red, borderRadius: 8, paddingLeft: 18, paddingRight: 18 }}
//           icon={<PrinterIcon style={{ width: 18, height: 18 }} />}
//         />

//         <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: "#333" }}>
//           <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
//           <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".5px" }}>{formatCurrency(totalDue)}</div>
//         </div>
//       </div>

//       {/* Vendas estacionadas */}
//       {state.parked.length > 0 && (
//         <div style={{ position: "fixed", right: 8, bottom: 98, width: 360, maxHeight: 320, overflow: "auto", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10 }}>
//           <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
//             <span>Vendas Estacionadas</span>
//             <span style={{ color: "#7a7a7a", fontSize: 12 }}>{state.parked.length}</span>
//           </div>
//           <div style={{ padding: 10, display: "grid", gap: 8 }}>
//             {state.parked.map((p) => (
//               <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
//                 <div style={{ fontSize: 12 }}>
//                   <div style={{ fontWeight: 700 }}>#{p.id}</div>
//                   <div style={{ color: "#7a7a7a" }}>{new Date(p.createdAt).toLocaleString("pt-BR")}{" • "}{p.snapshot.cart.length} itens</div>
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



// src/pages/PDVPro.jsx
import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HomeIcon,
  TrashIcon,
  PrinterIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

import { C, FOOTER_H } from "../constants/uiPDV";
import { reducer, initialState } from "../store/pdv";
import NavigationSteps from "../components/pdv/NavigationSteps";

// UI primitives
import Button from "../components/pdv/ui/Button";
import Input from "../components/pdv/ui/Input";

// Steps
import ProdutoStep from "../components/pdv/steps/ProdutoStep";
import ClienteStep from "../components/pdv/steps/ClienteStep";
import PagamentoStep from "../components/pdv/steps/PagamentoStep";

// utils / services
import { formatCurrency } from "../utils/format";
import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api";

// >>> NOVO: helper do recibo A5
import { paymentReceipt } from "../utils/paymentReceipt";

// assets
import logo from "../assets/img/logo.png";

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
  const totalDue = useMemo(
    () => Math.max(0, Number((subtotal - discount + surcharge).toFixed(2))),
    [subtotal, discount, surcharge]
  );
  const totalPayments = useMemo(
    () => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    [state.payments]
  );
  const remaining = Number((totalDue - totalPayments).toFixed(2));
  const change = remaining < 0 ? Math.abs(remaining) : 0;

  // refs para atalhos
  const totalsRef = useRef({ totalDue: 0, totalPayments: 0 });
  useEffect(() => {
    totalsRef.current = { totalDue, totalPayments };
  }, [totalDue, totalPayments]);

  const finalizeRef = useRef(null);
  const handleFinalizeRefSetter = (fn) => (finalizeRef.current = fn);

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

  const handleFinalize = async () => {
    if (!validateBeforeFinalize()) return;

    const customerName = state.selectedCustomerId
      ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
      : "Cliente não identificado";

    const payload = {
      customerId: state.selectedCustomerId || null,
      customerName,
      items: state.cart.map((i) => ({
        productId: i.id,
        name: i.name,
        qty: i.quantity,
        unitPrice: i.price,
        total: i.total
      })),
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

      // >>> AQUI: imprime recibo A5
      if (state.printReceipt) {
        paymentReceipt(payload, { logoUrl: logo }); // passa a URL gerada pelo bundler
      }

      dispatch({ type: "RESET_ALL" });
      const prods = await fetchProducts();
      dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao finalizar venda");
    }
  };

  // manter referência atualizada da função para uso no listener (F3)
  useEffect(() => {
    handleFinalizeRefSetter(handleFinalize);
  }, [handleFinalize]);

  // atalhos globais (com guarda quando estiver digitando)
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const tag = t?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;
      if (isTyping) return;

      if (e.altKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault(); setCurrentStep("produto"); return;
      }
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault(); setCurrentStep("cliente"); return;
      }
      if (e.altKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault(); setCurrentStep("pagamento"); return;
      }

      if (e.key === "F4") {
        e.preventDefault(); searchRef.current?.focus();
      } else if (e.key === "F2") {
        e.preventDefault();
        const { totalDue: td, totalPayments: tp } = totalsRef.current;
        dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, td - tp) });
      } else if (e.key === "F3") {
        e.preventDefault(); finalizeRef.current?.();
      } else if (e.altKey && (e.key === "q" || e.key === "Q")) {
        e.preventDefault(); dispatch({ type: "RESET_ALL" });
      } else if (e.key === "Escape") {
        e.preventDefault(); navigate("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const firstFiltered = state.filteredProducts[0];

  const renderStepContent = () => {
    switch (currentStep) {
      case "produto":
        return (
          <ProdutoStep
            state={state}
            dispatch={dispatch}
            firstFiltered={firstFiltered}
            totalDue={totalDue}
            totalPayments={totalPayments}
            searchRef={searchRef}
            barcodeReader={barcodeReader}
            setBarcodeReader={setBarcodeReader}
          />
        );
      case "cliente":
        return <ClienteStep state={state} dispatch={dispatch} handleQuickCustomerAdd={handleQuickCustomerAdd} />;
      case "pagamento":
        return (
          <PagamentoStep
            state={state}
            dispatch={dispatch}
            subtotal={subtotal}
            discount={discount}
            surcharge={surcharge}
            totalDue={totalDue}
            totalPayments={totalPayments}
            change={change}
          />
        );
      default:
        return null;
    }
  };

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

          {/* Wrapper rolável do conteúdo do step */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ height: "100%", minHeight: 0, overflowY: "auto", paddingRight: 4 }}>
              {renderStepContent()}
            </div>
          </div>
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
                    {/* Linha 1 */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
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

                      {/* Stepper */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "stretch",
                          height: 30,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "#fff",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })}
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
                            cursor: it.quantity <= 1 ? "not-allowed" : "pointer",
                            opacity: it.quantity <= 1 ? 0.5 : 1,
                          }}
                          aria-label="Diminuir"
                          disabled={it.quantity <= 1}
                        >
                          –
                        </button>

                        <Input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onWheel={(e) => e.currentTarget.blur()}
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
                            borderRadius: 0,
                            background: "transparent",
                            padding: 0,
                            fontWeight: 700,
                            outline: "none",
                            appearance: "textfield",
                            MozAppearance: "textfield",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })}
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
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Linha 2 */}
                    <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
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
                        <span style={{ fontWeight: 900, letterSpacing: ".2px" }}>{formatCurrency(it.total)}</span>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })}
                          title="Remover"
                          style={{ color: C.red, opacity: 0.9 }}
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
          label="Finalizar venda (F3)"
          onClick={handleFinalize}
          disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue}
          style={{ background: C.red, borderRadius: 8, paddingLeft: 18, paddingRight: 18 }}
          icon={<PrinterIcon style={{ width: 18, height: 18 }} />}
        />

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: "#333" }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: ".5px" }}>{formatCurrency(totalDue)}</div>
        </div>
      </div>

      {/* Vendas estacionadas */}
      {state.parked.length > 0 && (
        <div style={{ position: "fixed", right: 8, bottom: 98, width: 360, maxHeight: 320, overflow: "auto", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10 }}>
          <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
            <span>Vendas Estacionadas</span>
            <span style={{ color: "#7a7a7a", fontSize: 12 }}>{state.parked.length}</span>
          </div>
          <div style={{ padding: 10, display: "grid", gap: 8 }}>
            {state.parked.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>#{p.id}</div>
                  <div style={{ color: "#7a7a7a" }}>{new Date(p.createdAt).toLocaleString("pt-BR")}{" • "}{p.snapshot.cart.length} itens</div>
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

// // import React, { useState } from "react";
// // import { C } from "../../../constants/uiPDV";
// // import { MACHINE_OPTIONS, PAYMENT_METHODS } from "../../../constants/domainsPDV";
// // import Button from "../ui/Button";
// // import Input from "../ui/Input";
// // import Select from "../ui/Select";
// // import Modal from "../ui/Modal";
// // import { XMarkIcon } from "@heroicons/react/24/outline";
// // import { toast } from "react-toastify";
// // import { formatCurrency } from "../../../utils/format";

// // // IMAGENS (ajuste os caminhos conforme seu projeto)
// // import maquininhaIcon from "../../../assets/img/maquininha2.png";
// // import pixIcon from "../../../assets/img/pix.svg";
// // import real from "../../../assets/img/real.png";

// // async function downloadCarnet() {
// //   try {
// //     const response = await fetch("http://localhost:3000/gerar-carne", { method: "GET" });
// //     const blob = await response.blob();
// //     const url = window.URL.createObjectURL(blob);
// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.download = "carne-pagamento-12x.pdf";
// //     document.body.appendChild(link);
// //     link.click();
// //     link.remove();
// //     window.URL.revokeObjectURL(url);
// //   } catch (e) {
// //     toast.error("Falha ao gerar carnê");
// //   }
// // }

// // function PagamentoStep({
// //   state,
// //   dispatch,
// //   subtotal,
// //   discount,
// //   surcharge,
// //   totalDue,
// //   totalPayments,
// //   change,
// // }) {
// //   const [openCarnet, setOpenCarnet] = useState(false);

// //   return (
// //     <div>
// //       <h5 style={{ margin: "0 0 8px", fontWeight: 800 }}>Totais</h5>

// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Subtotal</label>
// //           <Input type="text" value={formatCurrency(subtotal)} readOnly />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (R$)</label>
// //           <Input

// //             step="0.01"
// //             min="0"
// //             value={state.discountPct > 0 ? 0 : state.discountValue}
// //             onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })}
// //           />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (%)</label>
// //           <Input
// //             step="0.1"
// //             min="0"
// //             max="100"
// //             value={state.discountPct}
// //             onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })}
// //           />
// //         </div>
// //       </div>

// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Acréscimo (R$)</label>
// //           <Input
// //             step="0.01" min="0"
// //             value={state.surchargeValue}
// //             onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })}
// //           />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total a pagar</label>
// //           <Input type="text" value={formatCurrency(totalDue)} readOnly />
// //         </div>
// //         <div>
// //           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Total pago</label>
// //           <Input type="text" value={formatCurrency(totalPayments)} readOnly />
// //         </div>
// //       </div>

// //       <h5 style={{ margin: "12px 0 8px", fontWeight: 800 }}>Forma de Pagamento</h5>

// //       {/* Ações rápidas */}
// //       <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
// //         <Button
// //           outlined
// //           label="Dinheiro (F2)"
// //           icon={<img src={real} alt="Real Icon" style={{ width: 28, height: 28 }} />}
// //           onClick={() => {
// //             const val = Math.max(0, totalDue - totalPayments);
// //             if (!val) return toast.info("Sem restante.");
// //             dispatch({ type: "ADD_PAYMENT", payload: val });
// //           }}
// //           style={{ flex: 1, minWidth: 160, maxWidth: 200, background: "#fff", borderColor: C.red, color: C.red }}
// //         />

// //         <Button
// //           outlined
// //           label="PIX — Gerar QR Code"
// //           icon={<img src={pixIcon} alt="Pix Icon" style={{ width: 28, height: 28 }} />}
// //           onClick={() => {
// //             const val = Math.max(0, totalDue - totalPayments);
// //             if (!val) return toast.info("Sem restante.");
// //             dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "PIX" } });
// //             toast.success("PIX adicionado (simulado). Integração real do QR fica no backend.");
// //           }}
// //           style={{ flex: 1, minWidth: 160, maxWidth: 230, background: "#fff", borderColor: C.red, color: C.red }}
// //         />

// //         <Button
// //           outlined
// //           label="Maquininha — Débito/Crédito"
// //           icon={<img src={maquininhaIcon} alt="POS" style={{ width: 40 }} />}
// //           onClick={() => {
// //             const val = Math.max(0, totalDue - totalPayments);
// //             if (!val) return toast.info("Sem restante.");
// //             dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "Cartão de Crédito" } });
// //             toast.info("Selecione a máquina e, se crédito, informe as parcelas.");
// //           }}
// //           style={{ flex: 1, minWidth: 180, maxWidth: 240, background: "#fff", borderColor: C.red, color: C.red }}
// //         />
// //       </div>

// //       {/* Lista de pagamentos */}
// //       <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
// //         <div style={{ display: "grid", gap: 10, maxHeight: "40vh", overflowY: "auto", paddingRight: 4 }}>
// //           {state.payments.map((p) => (
// //             <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
// //               <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
// //                 <div>
// //                   <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Método</label>
// //                   <Select
// //                     value={p.method}
// //                     onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: v } })}
// //                     options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
// //                   />
// //                 </div>
// //                 <div>
// //                   <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Valor</label>
// //                   <Input
// //                     step="0.01"
// //                     min="0"
// //                     value={p.amount}
// //                     onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
// //                   />
// //                 </div>

// //                 {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
// //                   <>
// //                     <div>
// //                       <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Máquina</label>
// //                       <Select
// //                         value={p.machine}
// //                         onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: v } })}
// //                         options={MACHINE_OPTIONS.map((m) => ({ value: m.name, label: m.name }))}
// //                         placeholder="Selecione a máquina"
// //                       />
// //                     </div>
// //                     {p.method === "Cartão de Crédito" && (
// //                       <div>
// //                         <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Parcelas</label>
// //                         <Input

// //                           value={p.installments}
// //                           onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })}
// //                         />
// //                       </div>
// //                     )}
// //                   </>
// //                 )}
// //               </div>

// //               <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     dispatch({
// //                       type: "UPDATE_PAYMENT",
// //                       payload: {
// //                         id: p.id,
// //                         field: "amount",
// //                         value: Math.max(0, totalDue - totalPayments + p.amount),
// //                       },
// //                     })
// //                   }
// //                   style={{ fontSize: 12, color: "#555" }}
// //                 >
// //                   Usar restante
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })}
// //                   style={{ color: C.red, fontWeight: 700 }}
// //                 >
// //                   Remover
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Rodapé da lista */}
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
// //           <small style={{ color: "#666" }}>Dica: F2 adiciona o restante automaticamente.</small>
// //           <div style={{ display: "flex", gap: 8 }}>
// //             <Button
// //               outlined
// //               title="Limpar pagamentos"
// //               onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })}
// //               icon={<XMarkIcon style={{ width: 14, height: 14 }} />}
// //               style={{ height: 28, padding: "2px 8px", fontSize: 12, borderRadius: 4 }}
// //             />
// //           </div>

// //         </div>
// //       </div>

// //       {/* Modal Carnê */}
// //       <Modal
// //         open={openCarnet}
// //         onClose={() => setOpenCarnet(false)}
// //         title="Confirme os Dados do Carnê"
// //         footer={
// //           <>
// //             <Button outlined label="Cancelar" onClick={() => setOpenCarnet(false)} style={{ borderColor: C.border, color: "#555" }} />
// //             <Button
// //               label="Confirmar e Baixar"
// //               onClick={async () => {
// //                 await downloadCarnet();
// //                 setOpenCarnet(false);
// //               }}
// //             />
// //           </>
// //         }
// //       >
// //         <h5 style={{ marginTop: 0, marginBottom: 8, fontWeight: 800 }}>Resumo do Carnê</h5>
// //         <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
// //           <li>Total: {formatCurrency(totalDue)}</li>
// //         </ul>
// //       </Modal>
// //     </div>
// //   );
// // }

// // export default React.memo(PagamentoStep);



// import React, { useState } from "react";
// import { C } from "../../../constants/uiPDV";
// import { MACHINE_OPTIONS, PAYMENT_METHODS } from "../../../constants/domainsPDV";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import Select from "../ui/Select";
// import Modal from "../ui/Modal";
// import Checkbox from "../ui/Checkbox";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { toast } from "react-toastify";
// import { formatCurrency } from "../../../utils/format";

// // IMAGENS (ajuste os caminhos conforme seu projeto)
// import maquininhaIcon from "../../../assets/img/maquininha2.png";
// import pixIcon from "../../../assets/img/pix.svg";
// import real from "../../../assets/img/real.png";

// async function downloadCarnet() {
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
// }

// function PagamentoStep({
//   state,
//   dispatch,
//   subtotal,
//   discount,
//   surcharge,
//   totalDue,
//   totalPayments,
//   change,
// }) {
//   const [openCarnet, setOpenCarnet] = useState(false);

//   return (
//     <div>
//       {/* Título + Imprimir recibo (à direita) */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 8px" }}>
//         <h5 style={{ margin: 0, fontWeight: 800 }}>Totais</h5>
//         <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 14 }}>
//           <Checkbox checked={state.printReceipt} onChange={(v) => dispatch({ type: "SET_PRINT", payload: v })} />
//           Imprimir recibo
//         </label>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Subtotal</label>
//           <Input type="text" value={formatCurrency(subtotal)} readOnly />
//         </div>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (R$)</label>
//           <Input
//             step="0.01"
//             min="0"
//             value={state.discountPct > 0 ? 0 : state.discountValue}
//             onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })}
//           />
//         </div>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (%)</label>
//           <Input
//             step="0.1"
//             min="0"
//             max="100"
//             value={state.discountPct}
//             onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })}
//           />
//         </div>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
//         <div>
//           <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Acréscimo (R$)</label>
//           <Input
//             step="0.01" min="0"
//             value={state.surchargeValue}
//             onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })}
//           />
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
//             dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "PIX" } });
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
//             dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "Cartão de Crédito" } });
//             toast.info("Selecione a máquina e, se crédito, informe as parcelas.");
//           }}
//           style={{ flex: 1, minWidth: 180, maxWidth: 240, background: "#fff", borderColor: C.red, color: C.red }}
//         />
//       </div>

//       {/* Lista de pagamentos */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
//         <div style={{ display: "grid", gap: 10, maxHeight: "40vh", overflowY: "auto", paddingRight: 4 }}>
//           {state.payments.map((p) => (
//             <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
//                 <div>
//                   <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Método</label>
//                   <Select
//                     value={p.method}
//                     onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: v } })}
//                     options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
//                   />
//                 </div>
//                 <div>
//                   <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Valor</label>
//                   <Input
//                     step="0.01"
//                     min="0"
//                     value={p.amount}
//                     onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
//                   />
//                 </div>

//                 {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
//                   <>
//                     <div>
//                       <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Máquina</label>
//                       <Select
//                         value={p.machine}
//                         onChange={(v) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: v } })}
//                         options={MACHINE_OPTIONS.map((m) => ({ value: m.name, label: m.name }))}
//                         placeholder="Selecione a máquina"
//                       />
//                     </div>
//                     {p.method === "Cartão de Crédito" && (
//                       <div>
//                         <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#555" }}>Parcelas</label>
//                         <Input
//                           value={p.installments}
//                           onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })}
//                         />
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>

//               <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     dispatch({
//                       type: "UPDATE_PAYMENT",
//                       payload: {
//                         id: p.id,
//                         field: "amount",
//                         value: Math.max(0, totalDue - totalPayments + p.amount),
//                       },
//                     })
//                   }
//                   style={{ fontSize: 12, color: "#555" }}
//                 >
//                   Usar restante
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })}
//                   style={{ color: C.red, fontWeight: 700 }}
//                 >
//                   Remover
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Rodapé da lista */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <small style={{ color: "#666" }}>Dica: F2 adiciona o restante automaticamente.</small>
//           <div style={{ display: "flex", gap: 8 }}>
//             <Button
//               outlined
//               title="Limpar pagamentos"
//               onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })}
//               icon={<XMarkIcon style={{ width: 14, height: 14 }} />}
//               style={{ height: 28, padding: "2px 8px", fontSize: 12, borderRadius: 4 }}
//             />
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
// }

// export default React.memo(PagamentoStep);


import React, { useState } from "react";
import { C } from "../../../constants/uiPDV";
import { MACHINE_OPTIONS, PAYMENT_METHODS } from "../../../constants/domainsPDV";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import Checkbox from "../ui/Checkbox";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../utils/format";

// IMAGENS (ajuste os caminhos conforme seu projeto)
import maquininhaIcon from "../../../assets/img/maquininha2.png";
import pixIcon from "../../../assets/img/pix.svg";
import real from "../../../assets/img/real.png";

async function downloadCarnet() {
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
}

function PagamentoStep({
  state,
  dispatch,
  subtotal,
  discount,
  surcharge,
  totalDue,
  totalPayments,
  change,
}) {
  const [openCarnet, setOpenCarnet] = useState(false);

  return (
    <div>
      {/* Título Totais */}
      <h5 style={{ margin: "0 0 6px", fontWeight: 800 }}>Totais</h5>

      {/* Grades de totais */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Subtotal</label>
          <Input type="text" value={formatCurrency(subtotal)} readOnly />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (R$)</label>
          <Input
            step="0.01"
            min="0"
            value={state.discountPct > 0 ? 0 : state.discountValue}
            onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })}
          />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Desconto (%)</label>
          <Input
            step="0.1"
            min="0"
            max="100"
            value={state.discountPct}
            onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <div>
          <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Acréscimo (R$)</label>
          <Input
            step="0.01" min="0"
            value={state.surchargeValue}
            onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })}
          />
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

      {/* Cabeçalho Forma de Pagamento + Imprimir recibo ao lado */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "12px 0 8px" }}>
        <h5 style={{ margin: 0, fontWeight: 800 }}>Forma de Pagamento</h5>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 14 }}>
          <Checkbox checked={state.printReceipt} onChange={(v) => dispatch({ type: "SET_PRINT", payload: v })} />
          Imprimir recibo
        </label>
      </div>

      {/* Ações rápidas */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
        <Button
          outlined
          label="Dinheiro (F2)"
          icon={<img src={real} alt="Real Icon" style={{ width: 28, height: 28 }} />}
          onClick={() => {
            const val = Math.max(0, totalDue - totalPayments);
            if (!val) return toast.info("Sem restante.");
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
            dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "PIX" } });
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
            dispatch({ type: "ADD_PAYMENT", payload: { amount: val, method: "Cartão de Crédito" } });
            toast.info("Selecione a máquina e, se crédito, informe as parcelas.");
          }}
          style={{ flex: 1, minWidth: 180, maxWidth: 240, background: "#fff", borderColor: C.red, color: C.red }}
        />
      </div>

      {/* Lista de pagamentos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        <div style={{ display: "grid", gap: 10, maxHeight: "40vh", overflowY: "auto", paddingRight: 4 }}>
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
                          value={p.installments}
                          onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_PAYMENT",
                      payload: {
                        id: p.id,
                        field: "amount",
                        value: Math.max(0, totalDue - totalPayments + p.amount),
                      },
                    })
                  }
                  style={{ fontSize: 12, color: "#555" }}
                >
                  Usar restante
                </button>

                <button
                  type="button"
                  onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })}
                  style={{ color: C.red, fontWeight: 700 }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé da lista */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <small style={{ color: "#666" }}>Dica: F2 adiciona o restante automaticamente.</small>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              outlined
              title="Limpar pagamentos"
              onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })}
              icon={<XMarkIcon style={{ width: 14, height: 14 }} />}
              style={{ height: 28, padding: "2px 8px", fontSize: 12, borderRadius: 4 }}
            />
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
}

export default React.memo(PagamentoStep);

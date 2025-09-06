// import React from "react";
// import { PhotoIcon, CreditCardIcon, ArrowPathIcon, PauseIcon } from "@heroicons/react/24/outline";
// import { C } from "../../../constants/uiPDV";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import Checkbox from "../ui/Checkbox";
// import { formatCurrency } from "../../../utils/format";

// function ProdutoStep({
//   state,
//   dispatch,
//   firstFiltered,
//   totalDue,
//   totalPayments,
//   searchRef,
//   barcodeReader,
//   setBarcodeReader,
// }) {
//   return (
//     // ocupa toda a área do step; quem rola é só a lista
//     <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
//         <Input
//           ref={searchRef}
//           placeholder="F4 para focar — pesquise por nome, marca ou código (Enter adiciona 1º)"
//           value={state.searchTerm}
//           onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && firstFiltered) {
//               dispatch({ type: "ADD_TO_CART", payload: firstFiltered });
//             }
//           }}
//           style={{ flex: 1 }}
//         />
//         <Button
//           title="F2 — adiciona método com o restante"
//           onClick={() =>
//             dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })
//           }
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

//       <label
//         htmlFor="barcodeReader"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//           marginBottom: 10,
//           color: "#555",
//           fontSize: 14,
//         }}
//       >
//         <Checkbox id="barcodeReader" checked={barcodeReader} onChange={setBarcodeReader} />
//         Leitor de código de barras
//       </label>

//       {/* container flex que cresce; sem height fixa */}
//       <div
//         style={{
//           border: `1px solid ${C.border}`,
//           borderRadius: 8,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           background: "#fff",
//           minHeight: 0,
//           flex: 1, // <- preenche o espaço restante do step
//         }}
//       >
//         <div
//           style={{
//             padding: 10,
//             borderBottom: `1px solid ${C.border}`,
//             fontWeight: 800,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span>Produtos ({state.filteredProducts.length})</span>
//           <span style={{ color: C.muted, fontWeight: 600 }}>Enter adiciona o primeiro</span>
//         </div>

//         {/* só a lista rola */}
//         <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
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
//                   <div
//                     style={{
//                       fontWeight: 700,
//                       fontSize: 14,
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {p.name}
//                   </div>
//                   <div style={{ fontSize: 12, color: C.muted }}>
//                     <span
//                       style={{
//                         background: "#f3f3f3",
//                         padding: "2px 6px",
//                         borderRadius: 6,
//                         marginRight: 6,
//                       }}
//                     >
//                       {p.brand}
//                     </span>
//                     Est.: {p.stock} {p.code ? ` • ${p.code}` : ""}
//                   </div>
//                 </div>
//                 <div style={{ fontWeight: 800 }}>{formatCurrency(p.price)}</div>
//               </div>
//             ))
//           ) : (
//             <div
//               style={{
//                 padding: 16,
//                 color: C.muted,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <PhotoIcon style={{ width: 18, height: 18 }} /> Nenhum produto encontrado.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default React.memo(ProdutoStep);


import React, { useMemo } from "react";
import { PhotoIcon, CreditCardIcon, ArrowPathIcon, PauseIcon } from "@heroicons/react/24/outline";
import { C } from "../../../constants/uiPDV";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { formatCurrency } from "../../../utils/format";

function ProdutoStep({
  state,
  dispatch,
  firstFiltered,
  totalDue,
  totalPayments,
  searchRef,
  barcodeReader,
  setBarcodeReader,
}) {
  // >>> ORDEM ALFABÉTICA (A→Z) NA LISTA VISUAL
  const sortedProducts = useMemo(() => {
    return [...(state.filteredProducts || [])].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "pt-BR", { sensitivity: "base" })
    );
  }, [state.filteredProducts]);

  return (
    // ocupa toda a área do step; quem rola é só a lista
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Input
          ref={searchRef}
          placeholder="F4 para focar — pesquise por nome, marca ou código (Enter adiciona 1º)"
          value={state.searchTerm}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && firstFiltered) {
              dispatch({ type: "ADD_TO_CART", payload: firstFiltered });
            }
          }}
          style={{ flex: 1 }}
        />
        <Button
          title="F2 — adiciona método com o restante"
          onClick={() =>
            dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })
          }
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

      <label
        htmlFor="barcodeReader"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
          color: "#555",
          fontSize: 14,
        }}
      >
        <Checkbox id="barcodeReader" checked={barcodeReader} onChange={setBarcodeReader} />
        Leitor de código de barras
      </label>

      {/* container flex que cresce; sem height fixa */}
      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#fff",
          minHeight: 0,
          flex: 1, // <- preenche o espaço restante do step
        }}
      >
        <div
          style={{
            padding: 10,
            borderBottom: `1px solid ${C.border}`,
            fontWeight: 800,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Produtos ({state.filteredProducts.length})</span>
          <span style={{ color: C.muted, fontWeight: 600 }}>Enter adiciona o primeiro</span>
        </div>

        {/* só a lista rola */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {state.isLoading ? (
            <div style={{ padding: 16, color: C.muted }}>Carregando…</div>
          ) : sortedProducts.length ? (
            sortedProducts.map((p) => (
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
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    <span
                      style={{
                        background: "#f3f3f3",
                        padding: "2px 6px",
                        borderRadius: 6,
                        marginRight: 6,
                      }}
                    >
                      {p.brand}
                    </span>
                    Est.: {p.stock} {p.code ? ` • ${p.code}` : ""}
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>{formatCurrency(p.price)}</div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: 16,
                color: C.muted,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <PhotoIcon style={{ width: 18, height: 18 }} /> Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProdutoStep);

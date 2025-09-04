// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   ArrowDownTrayIcon,
//   DocumentArrowDownIcon,
//   EyeSlashIcon,
//   PrinterIcon,
// } from "@heroicons/react/24/outline";
// import { fetchSales } from "../services/api";
// import { groupSales } from "../utils/groupSales";
// import { formatCurrency } from "../utils/format";
// import { paymentReceipt } from "../utils/paymentReceipt";
// import logo from "../assets/img/logo.png";

// /** util rápido para exportar CSV no client */
// function exportCSV(rows, filename = "vendas.csv") {
//   const header = Object.keys(rows[0] || {}).join(";");
//   const body = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\n");
//   const csv = [header, body].filter(Boolean).join("\n");
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// }

// export default function ViewSales() {
//   const [raw, setRaw] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [expanded, setExpanded] = useState({}); // { [groupId]: boolean }
//   const [period, setPeriod] = useState("month"); // all|today|month

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const data = await fetchSales();
//         setRaw(Array.isArray(data) ? data : []);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const grouped = useMemo(() => groupSales(raw), [raw]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

//     return grouped.filter((s) => {
//       const d = new Date(s.date);
//       if (period === "today" && d < today) return false;
//       if (period === "month" && d < monthStart) return false;

//       if (!q) return true;

//       const hay = [
//         s.customerName,
//         s.items.map((i) => i.name).join(" "),
//         (s.paymentMethods || []).map((pm) => pm.method).join(" "),
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       return hay.includes(q);
//     });
//   }, [grouped, period, query]);

//   // KPIs
//   const kpis = useMemo(() => {
//     const vendas = filtered.length;
//     const itens = filtered.reduce((acc, s) => acc + s.items.reduce((a, i) => a + (i.qty || 0), 0), 0);
//     const faturamento = filtered.reduce((acc, s) => acc + (s.total || 0), 0);
//     const ticket = vendas ? faturamento / vendas : 0;
//     return { vendas, itens, faturamento, ticket };
//   }, [filtered]);

//   const exportListCSV = () => {
//     const rows = filtered.map((s) => ({
//       data: new Date(s.date).toLocaleString("pt-BR"),
//       cliente: s.customerName,
//       itens: s.items.map((i) => `${i.qty}x ${i.name}`).join(" | "),
//       total: formatCurrency(s.total),
//       pagamentos: (s.paymentMethods || [])
//         .map((pm) => `${pm.method}${pm.machine ? ` ${pm.machine}` : ""}: ${formatCurrency(pm.amount)}`)
//         .join(" | "),
//     }));
//     exportCSV(rows, "vendas_agrupadas.csv");
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-5 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Visão de Vendas</h1>
//           <p className="text-sm text-gray-500">Tudo que foi vendido, agrupado por venda.</p>
//         </div>
//         <div className="flex gap-2">
//           <Link
//             to="/sales"
//             className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//             title="Voltar para Vendas"
//           >
//             <EyeSlashIcon className="h-5 w-5" />
//             Voltar
//           </Link>
//           <button
//             onClick={exportListCSV}
//             className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//             title="Exportar CSV"
//           >
//             <ArrowDownTrayIcon className="h-5 w-5" />
//             Exportar
//           </button>
//           <button
//             onClick={() => window.print()}
//             className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black"
//             title="Imprimir visão"
//           >
//             <PrinterIcon className="h-5 w-5" />
//             Imprimir
//           </button>
//         </div>
//       </div>

//       {/* Filtros */}
//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-2">
//           <label className="text-sm text-gray-600">Período:</label>
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
//           >
//             <option value="all">Todos</option>
//             <option value="today">Hoje</option>
//             <option value="month">Este mês</option>
//           </select>
//         </div>

//         <div className="relative w-full sm:w-96">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Buscar por cliente, item, pagamento…"
//             className="w-full rounded-md border border-gray-200 bg-white py-2 pl-3 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
//           />
//         </div>
//       </div>

//       {/* KPIs */}
//       <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
//         <div className="rounded-lg border bg-white p-4">
//           <div className="text-xs text-gray-500">Vendas</div>
//           <div className="mt-1 text-2xl font-semibold">{kpis.vendas}</div>
//         </div>
//         <div className="rounded-lg border bg-white p-4">
//           <div className="text-xs text-gray-500">Itens</div>
//           <div className="mt-1 text-2xl font-semibold">{kpis.itens}</div>
//         </div>
//         <div className="rounded-lg border bg-white p-4">
//           <div className="text-xs text-gray-500">Faturamento</div>
//           <div className="mt-1 text-2xl font-semibold">{formatCurrency(kpis.faturamento)}</div>
//         </div>
//         <div className="rounded-lg border bg-white p-4">
//           <div className="text-xs text-gray-500">Ticket médio</div>
//           <div className="mt-1 text-2xl font-semibold">{formatCurrency(kpis.ticket)}</div>
//         </div>
//       </div>

//       {/* Tabela */}
//       <div className="overflow-hidden rounded-lg bg-white shadow">
//         <div className="border-b bg-gray-50 px-6 py-4">
//           <h3 className="text-lg font-semibold text-gray-800">Vendas Agrupadas</h3>
//         </div>

//         {loading ? (
//           <div className="py-10 text-center text-gray-600">Carregando…</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Data
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Cliente
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Itens
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Pagamento
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Total
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     Ações
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {filtered.length ? (
//                   filtered.map((sale) => {
//                     const isOpen = !!expanded[sale.id];
//                     return (
//                       <tr key={sale.id} className="align-top">
//                         <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                           {new Date(sale.date).toLocaleString("pt-BR")}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{sale.customerName}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           <div className="font-medium">{sale.items[0]?.name}</div>
//                           {sale.items.length > 1 && (
//                             <div className="text-xs text-gray-500">+ {sale.items.length - 1} itens</div>
//                           )}
//                           {isOpen && (
//                             <div className="mt-2 rounded border bg-gray-50 p-2">
//                               {sale.items.map((it, idx) => (
//                                 <div
//                                   key={idx}
//                                   className="grid grid-cols-12 items-center gap-2 border-b py-1 last:border-b-0"
//                                 >
//                                   <div className="col-span-7 text-xs text-gray-700">
//                                     {it.qty}x {it.name}
//                                   </div>
//                                   <div className="col-span-2 text-right text-xs text-gray-600">
//                                     {formatCurrency(it.unitPrice)}
//                                   </div>
//                                   <div className="col-span-3 text-right text-xs font-semibold">
//                                     {formatCurrency(it.total)}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {sale.paymentMethods?.length ? (
//                             <div className="text-xs leading-5 text-gray-700">
//                               {sale.paymentMethods.map((pm, i) => (
//                                 <div key={i}>
//                                   {pm.method}
//                                   {pm.machine ? ` (${pm.machine})` : ""}: {formatCurrency(pm.amount)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <span className="text-gray-500">Não especificado</span>
//                           )}
//                         </td>
//                         <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold">
//                           {formatCurrency(sale.total)}
//                         </td>
//                         <td className="whitespace-nowrap px-6 py-4 text-sm">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() =>
//                                 setExpanded((e) => ({ ...e, [sale.id]: !e[sale.id] }))
//                               }
//                               className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
//                             >
//                               {isOpen ? "Fechar" : "Ver itens"}
//                             </button>

//                             <button
//                               onClick={() =>
//                                 paymentReceipt(
//                                   { ...sale, payments: sale.paymentMethods },
//                                   { logoUrl: logo }
//                                 )
//                               }
//                               className="p-1 text-blue-600 hover:text-blue-800"
//                               title="Gerar Recibo"
//                             >
//                               <DocumentArrowDownIcon className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
//                       Nenhuma venda encontrada
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// src/pages/ViewSale.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import { fetchSales } from "../services/api";
import { groupSales } from "../utils/groupSales";
import { DocumentArrowDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { paymentReceipt } from "../utils/paymentReceipt";
import logo from "../assets/img/logo.png";

export default function ViewSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rawSales, setRawSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // carrega as vendas e reagrupa (para conseguir achar a venda pelo id do grupo)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSales();
        setRawSales(data || []);
      } catch (e) {
        console.error("Erro ao carregar vendas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => groupSales(rawSales), [rawSales]);

  // id vem codificado na URL
  const decodedId = useMemo(() => {
    try {
      return decodeURIComponent(id || "");
    } catch {
      return id || "";
    }
  }, [id]);

  const sale = useMemo(() => grouped.find((g) => g.id === decodedId), [grouped, decodedId]);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!sale) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </button>
        </div>
        <div className="rounded-md border bg-white p-6 shadow">
          <h1 className="text-lg font-semibold">Venda não encontrada</h1>
          <p className="text-sm text-gray-600 mt-1">Verifique o link ou tente novamente pela lista de vendas.</p>
        </div>
      </div>
    );
  }

  const totalQty = sale.items.reduce((s, i) => s + (i.qty || 0), 0);

  return (
    <div className="p-6">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-start gap-3">
          {/* <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </button> */}
          <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Detalhes da Venda</h1>
        <p className="text-sm text-gray-500">Acompanhe as vendas e emita recibos</p>
      </div>

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              paymentReceipt({ ...sale, payments: sale.paymentMethods }, { logoUrl: logo })
            }
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            title="Gerar Recibo"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Gerar Recibo
          </button>
        </div>
      </div>

      {/* resumo */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Cliente</p>
          <p className="text-sm font-medium text-gray-900">{sale.customerName}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Data</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(sale.date).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total da venda</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(sale.total)}</p>
        </div>
      </div>

      {/* itens */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Itens vendidos</h2>
          <p className="text-sm text-gray-500">Quantidade total: {totalQty}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Qtd</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Unitário</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sale.items.map((it, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{it.name}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-900">{it.qty}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-900">{formatCurrency(it.unitPrice)}</td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(it.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-700" colSpan={3}>Total</td>
                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(sale.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* pagamento */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Formas de pagamento</h3>
          {sale.paymentMethods && sale.paymentMethods.length > 0 ? (
            <ul className="text-sm text-gray-800 space-y-1">
              {sale.paymentMethods.map((pm, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    {pm.method}{pm.machine ? ` (${pm.machine})` : ""}
                  </span>
                  <span className="font-medium">{formatCurrency(pm.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Não especificado</p>
          )}
        </div>

        {/* <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Ações</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/sales"
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Voltar para lista
            </Link>
            <button
              onClick={() =>
                paymentReceipt({ ...sale, payments: sale.paymentMethods }, { logoUrl: logo })
              }
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Gerar recibo
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

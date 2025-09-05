// // import { useState, useEffect, useMemo, useRef } from "react";
// // import { Bar } from "react-chartjs-2";
// // import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// // import Card from "../components/Card";
// // import { formatCurrency, formatDate } from "../utils/format";;
// // import { fetchReports } from "../services/api";
// // import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, EyeIcon } from "@heroicons/react/24/outline";

// // import { Link } from "react-router-dom";


// // Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // const pad = (n) => String(n).padStart(2, "0");
// // const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
// // const lastNDays = (n) => {
// //   const end = new Date();
// //   const start = new Date(); start.setDate(end.getDate() - (n - 1));
// //   const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// //   return { start: fmt(start), end: fmt(end) };
// // };
// // const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
// // const startOfMonth = (ym) => { const [y, m] = ym.split("-").map(Number); return `${y}-${pad(m)}-01`; };
// // const endOfMonth = (ym) => { const [y, m] = ym.split("-").map(Number); const last = new Date(y, m, 0).getDate(); return `${y}-${pad(m)}-${pad(last)}`; };
// // const toISO = (date, eod = false) => eod ? `${date}T23:59:59` : `${date}T00:00:00`;

// // function useDebounce(v, d = 350) { const [x, setX] = useState(v); useEffect(() => { const id = setTimeout(() => setX(v), d); return () => clearTimeout(id) }, [v, d]); return x; }

// // const Input = (props) => <input className="w-full h-10 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200" {...props} />;
// // const SearchIcon = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
// // const ChevronDown = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><path d="M6 9l6 6 6-6" /></svg>);

// // // ⬇️ novo helper: muda uma data YYYY-MM-DD em ±delta dias
// // const shiftDate = (dateStr, deltaDays) => {
// //   const [y, m, d] = dateStr.split("-").map(Number);
// //   const dt = new Date(y, m - 1, d);
// //   dt.setDate(dt.getDate() + deltaDays);
// //   return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
// // };



// // function compactLedgerSales(arr = []) {
// //   const groups = new Map();

// //   const minuteIso = (dateVal) => {
// //     const d = new Date(dateVal);
// //     if (isNaN(d)) return String(dateVal || "");
// //     d.setSeconds(0, 0);
// //     return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
// //   };

// //   const pmSig = (list = []) =>
// //     list
// //       .map((pm) => `${pm.method}|${pm.machine || ""}|${Number(pm.amount || 0).toFixed(2)}`)
// //       .join("||");

// //   // tenta gerar exatamente a mesma key do groupSales quando possível
// //   const exactGroupKey = (l) => {
// //     const paymentsArr =
// //       Array.isArray(l.paymentMethods) ? l.paymentMethods :
// //         Array.isArray(l.payments) ? l.payments : null;
// //     if (!paymentsArr) return undefined;
// //     const dateIso = new Date(l.date).toISOString();
// //     return `${l.customerId || ""}#${dateIso}#${pmSig(paymentsArr)}`;
// //   };

// //   // assinatura a partir do texto “payment”
// //   const paymentTextSig = (l) =>
// //     String(l.payment || "")
// //       .toLowerCase()
// //       .replace(/\s+/g, " ")
// //       .replace(/r\$\s?/g, "")
// //       .trim();

// //   const makeAggKey = (l) =>
// //     l.saleGroupId ||
// //     l.groupId ||
// //     l.quoteId ||
// //     l.saleId ||
// //     `${l.customerId || ""}#${minuteIso(l.date)}#${paymentTextSig(l)}#${l.customerName || ""}`;

// //   const nonSales = [];

// //   arr.forEach((l, idx) => {
// //     const t = (l.type || "").toLowerCase();
// //     if (t !== "sale" && t !== "venda") {
// //       nonSales.push({ ...l, _order: idx });
// //       return;
// //     }

// //     const key = makeAggKey(l);
// //     const ex = groups.get(key);
// //     const base = {
// //       ...l,
// //       in: Number(l.in || 0),
// //       out: Number(l.out || 0),
// //       _count: 1,
// //       _payments: new Set(l.payment ? [String(l.payment)] : []),
// //       _order: idx,
// //       // id que a ViewSale entende (prioridades)
// //       viewId:
// //         l.saleGroupId ||
// //         l.groupId ||
// //         l.quoteId ||
// //         l.saleId ||
// //         exactGroupKey(l) || // igual ao groupSales se tivermos payments[]
// //         key,                // fallback
// //     };

// //     if (!ex) {
// //       groups.set(key, base);
// //     } else {
// //       ex.in += Number(l.in || 0);
// //       ex.out += Number(l.out || 0);
// //       ex._count += 1;
// //       if (l.payment) ex._payments.add(String(l.payment));
// //     }
// //   });

// //   const salesAggregated = Array.from(groups.values()).map((g) => {
// //     const payments = g._payments.size ? Array.from(g._payments).join(" | ") : g.payment || "—";
// //     const countExtra = g._count > 1 ? ` (+${g._count - 1} itens)` : "";
// //     const { _count, _payments, _order, ...rest } = g;
// //     return {
// //       ...rest,
// //       payment: payments,
// //       description: g.description ? `${g.description}${countExtra}` : `Venda${countExtra}`,
// //       _order,
// //     };
// //   });

// //   return [...nonSales, ...salesAggregated]
// //     .sort((a, b) => a._order - b._order)
// //     .map(({ _order, ...row }) => row);
// // }


// // function Pagination({ currentPage, totalPages, onChange, className = "", windowSize = 1 }) {
// //   const pages = useMemo(() => {
// //     if (totalPages <= 1) return [1];
// //     const o = []; const start = Math.max(2, currentPage - windowSize); const end = Math.min(totalPages - 1, currentPage + windowSize);
// //     o.push(1); if (start > 2) o.push("…"); for (let p = start; p <= end; p++) o.push(p); if (end < totalPages - 1) o.push("…"); if (totalPages > 1) o.push(totalPages);
// //     return o;
// //   }, [currentPage, totalPages, windowSize]);

// //   return (
// //     <nav className={`inline-flex items-center gap-1 select-none ${className}`} role="navigation" aria-label="Paginação">
// //       <button onClick={() => onChange(1)} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">«</button>
// //       <button onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Anterior</button>
// //       {pages.map((p, i) => (
// //         <button key={`${p}-${i}`} onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
// //       ))}
// //       <button onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Próxima</button>
// //       <button onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">»</button>
// //     </nav>
// //   );
// // }

// // export default function Reports() {
// //   // AGORA O PADRÃO É DIÁRIO (nada de 7 dias automáticos)
// //   const [filters, setFilters] = useState({
// //     mode: "day",            // <- inicia em "Dia"
// //     date: today(),          // <- hoje
// //     month: thisMonth(),
// //     startDate: today(),     // valores neutros para quando você optar por "Período"
// //     endDate: today(),
// //     search: "",
// //   });
// //   const debouncedSearch = useDebounce(filters.search, 300);

// //   const [data, setData] = useState({ dailySales: [], monthlySales: [], ledger: [], totals: { revenue: 0, expenses: 0, net: 0 } });
// //   const [loading, setLoading] = useState(true);
// //   const [exporting, setExporting] = useState(false);

// //   // Filtro visual por tipo
// //   const [typeView, setTypeView] = useState("all"); // 'all' | 'in' | 'out'

// //   const buildParams = () => {
// //     const common = { search: debouncedSearch };
// //     if (filters.mode === "day") return { ...common, from: toISO(filters.date), to: toISO(filters.date, true) };
// //     if (filters.mode === "month") return { ...common, from: toISO(startOfMonth(filters.month)), to: toISO(endOfMonth(filters.month), true) };
// //     return { ...common, from: toISO(filters.startDate), to: toISO(filters.endDate, true) };
// //   };

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         setLoading(true);
// //         const res = await fetchReports(buildParams());
// //         setData(res || {});
// //       } finally { setLoading(false); }
// //     })();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [filters.mode, filters.date, filters.month, filters.startDate, filters.endDate, debouncedSearch]);

// //   // ===== Pipeline do ledger =====
// //   const ledgerBase = useMemo(() => {
// //     const arr = Array.isArray(data.ledger) ? data.ledger : [];
// //     return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date) || a.type.localeCompare(b.type));
// //   }, [data.ledger]);

// //   // ⬇️ novo: compacta vendas repetidas em uma linha por venda
// //   const ledgerCompacted = useMemo(() => compactLedgerSales(ledgerBase), [ledgerBase]);

// //   const ledgerSearched = useMemo(() => {
// //     const q = debouncedSearch.trim().toLowerCase();
// //     if (!q) return ledgerCompacted;
// //     return ledgerCompacted.filter(l =>
// //       `${l.type} ${l.description} ${l.customerName} ${l.payment}`.toLowerCase().includes(q)
// //     );
// //   }, [ledgerCompacted, debouncedSearch]);

// //   const ledgerTyped = useMemo(() => {
// //     if (typeView === "in") return ledgerSearched.filter(l => Number(l.in || 0) > 0);
// //     if (typeView === "out") return ledgerSearched.filter(l => Number(l.out || 0) > 0);
// //     return ledgerSearched;
// //   }, [ledgerSearched, typeView]);

// //   const ledgerView = useMemo(() => {
// //     let running = 0;
// //     return ledgerTyped.map(item => {
// //       running += Number(item.in || 0) - Number(item.out || 0);
// //       return { ...item, balance: running };
// //     });
// //   }, [ledgerTyped]);

// //   const viewTotals = useMemo(() => {
// //     const tin = ledgerTyped.reduce((s, i) => s + Number(i.in || 0), 0);
// //     const tout = ledgerTyped.reduce((s, i) => s + Number(i.out || 0), 0);
// //     return { in: tin, out: tout, net: tin - tout };
// //   }, [ledgerTyped]);

// //   // Paginação
// //   const [pageSize, setPageSize] = useState(10);
// //   const [page, setPage] = useState(1);
// //   useEffect(() => setPage(1), [ledgerView, pageSize, typeView]);
// //   const totalItems = ledgerView.length;
// //   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
// //   const safePage = Math.min(Math.max(1, page), totalPages);
// //   const startIdx = (safePage - 1) * pageSize;
// //   const endIdx = Math.min(startIdx + pageSize, totalItems);
// //   const rows = ledgerView.slice(startIdx, endIdx);

// //   // Gráficos
// //   const dailySalesChartData = {
// //     labels: (data.dailySales ?? []).map(i => i.date),
// //     datasets: [{ label: "Vendas Diárias (R$)", data: (data.dailySales ?? []).map(i => i.total), backgroundColor: "rgba(59,130,246,.5)", borderColor: "rgb(59,130,246)", borderWidth: 1 }],
// //   };
// //   const monthlySalesChartData = {
// //     labels: (data.monthlySales ?? []).map(i => i.month),
// //     datasets: [{ label: "Vendas Mensais (R$)", data: (data.monthlySales ?? []).map(i => i.total), backgroundColor: "rgba(16,185,129,.5)", borderColor: "rgb(16,185,129)", borderWidth: 1 }],
// //   };
// //   const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } } };

// //   // Topbar (datas + busca + export)
// //   const [openDate, setOpenDate] = useState(false);
// //   const dateBtnRef = useRef(null);
// //   useEffect(() => {
// //     const h = (e) => { if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false); };
// //     document.addEventListener("click", h); return () => document.removeEventListener("click", h);
// //   }, []);
// //   const setQuick = (days) => { const r = lastNDays(days); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); };
// //   const setToday = () => { setFilters(f => ({ ...f, mode: "day", date: today() })); setOpenDate(false); };
// //   const setThisMonth = () => { setFilters(f => ({ ...f, mode: "month", month: thisMonth() })); setOpenDate(false); };

// //   // ⬇️ novo: botões de navegação diária
// //   const goPrevDay = () => setFilters(f => ({ ...f, mode: "day", date: shiftDate(f.date, -1) }));
// //   const goNextDay = () => setFilters(f => ({ ...f, mode: "day", date: shiftDate(f.date, +1) }));
// //   const goToday = () => setFilters(f => ({ ...f, mode: "day", date: today() }));

// //   const searchRef = useRef(null);
// //   useEffect(() => {
// //     const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") { e.preventDefault(); searchRef.current?.focus(); } };
// //     window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="p-6">
// //         <div className="mb-6"><h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1><p className="text-sm text-gray-500">Carregando…</p></div>
// //         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />)}</div>
// //         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /></div>
// //       </div>
// //     );
// //   }

// //   const periodLabel =
// //     filters.mode === "day" ? filters.date :
// //       filters.mode === "month" ? filters.month :
// //         `${filters.startDate} a ${filters.endDate}`;

// //   const totals = data.totals || { revenue: 0, expenses: 0, net: 0 };

// //   return (
// //     <div className="p-6">
// //       {/* Header */}
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
// //         <p className="text-sm text-gray-500">Painel central de desempenho e vendas (vendas e despesas)</p>
// //       </div>

// //       {/* Topbar */}
// //       <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
// //         <div className="px-0 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //           <div className="flex items-center gap-6">
// //             {[{ k: "day", l: "Dia" }, { k: "month", l: "Mês" }, { k: "range", l: "Período" }].map(t => (
// //               <button key={t.k} onClick={() => setFilters(f => ({ ...f, mode: t.k }))} className={`relative pb-2 text-sm font-medium ${filters.mode === t.k ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
// //                 {t.l}{filters.mode === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
// //               </button>
// //             ))}
// //           </div>
// //           <div className="flex items-center gap-2">
// //             {/* ⬇️ novo: controles visíveis quando modo = Dia */}
// //             {filters.mode === "day" && (
// //               <>
// //                 <button
// //                   onClick={goPrevDay}
// //                   className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
// //                   title="Dia anterior"
// //                 >
// //                   <ChevronLeftIcon className="h-4 w-4" />
// //                 </button>
// //                 <button
// //                   onClick={goToday}
// //                   className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
// //                   title="Hoje"
// //                 >
// //                   <CalendarDaysIcon className="h-4 w-4" />
// //                   Hoje
// //                 </button>
// //                 <button
// //                   onClick={goNextDay}
// //                   className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
// //                   title="Próximo dia"
// //                 >
// //                   <ChevronRightIcon className="h-4 w-4" />
// //                 </button>
// //               </>
// //             )}

// //             <div className="relative">
// //               <button ref={dateBtnRef} type="button" onClick={() => setOpenDate(v => !v)} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
// //                 <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
// //                 {filters.mode === "day" ? "Hoje" : filters.mode === "month" ? "Mês atual" : "Período"}
// //                 <ChevronDown className="h-4 w-4 text-gray-400" />
// //               </button>
// //               {openDate && (
// //                 <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
// //                   <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
// //                   <div className="grid grid-cols-2 gap-2">
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToday}>Hoje</button>
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setThisMonth}>Mês atual</button>
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(7); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 7 dias</button>
// //                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(30); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 30 dias</button>
// //                   </div>
// //                   <div className="my-3 h-px bg-gray-100" />
// //                   {filters.mode === "day" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Dia</div><Input type="date" value={filters.date} onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))} /></div>)}
// //                   {filters.mode === "month" && (<div className="space-y-1"><div className="text-xs font-semibold text-gray-500 px-1">Mês</div><Input type="month" value={filters.month} onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))} /></div>)}
// //                   {filters.mode === "range" && (
// //                     <div className="grid grid-cols-2 gap-2">
// //                       <div><div className="text-xs font-semibold text-gray-500 px-1">Início</div><Input type="date" value={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))} /></div>
// //                       <div><div className="text-xs font-semibold text-gray-500 px-1">Fim</div><Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))} /></div>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Busca */}
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

// //             {/* Export CSV (respeita o filtro de tipo + busca) */}
// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setExporting(true);
// //                 try {
// //                   const headers = ["Data", "Tipo", "Descrição", "Cliente", "Pagamento", "Entrada", "Saída", "Saldo"];
// //                   const csvRows = [headers.join(",")];
// //                   ledgerView.forEach((r) => {
// //                     csvRows.push([
// //                       `"${r.date ? formatDate(r.date) : ""}"`,
// //                       `"${r.type}"`,
// //                       `"${(r.description || "").replaceAll('"', '""')}"`,
// //                       `"${(r.customerName || "").replaceAll('"', '""')}"`,
// //                       `"${(r.payment || "").replaceAll('"', '""')}"`,
// //                       r.in ?? 0,
// //                       r.out ?? 0,
// //                       r.balance ?? 0,
// //                     ].join(","));
// //                   });
// //                   const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
// //                   const url = URL.createObjectURL(blob);
// //                   const a = document.createElement("a");
// //                   const label = filters.mode === "day" ? filters.date : filters.mode === "month" ? filters.month : `${filters.startDate}_a_${filters.endDate}`;
// //                   a.href = url; a.download = `fluxo_caixa_${typeView}_${label}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
// //                 } finally { setExporting(false); }
// //               }}
// //               disabled={exporting || totalItems === 0}
// //               className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-60"
// //             >
// //               Exportar CSV
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Período */}
// //       <div className="mt-2 text-sm text-gray-500">Período atual: <strong>{periodLabel}</strong></div>

// //       {/* KPIs gerais do período */}
// //       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// //         <Card title="Receita no Período"><div className="text-2xl font-semibold">{formatCurrency(totals.revenue)}</div></Card>
// //         <Card title="Despesas no Período"><div className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expenses)}</div></Card>
// //         <Card title="Saldo (Receita - Despesas)"><div className={`text-2xl font-semibold ${totals.net < 0 ? "text-red-600" : "text-green-700"}`}>{formatCurrency(totals.net)}</div></Card>
// //       </div>

// //       {/* Gráficos (opcionais) */}
// //       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         <Card title="Vendas Diárias"><div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div></Card>
// //         <Card title="Vendas Mensais"><div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div></Card>
// //       </div>

// //       {/* Tabela: Fluxo de Caixa */}
// //       <div className="mt-6">
// //         <div className="overflow-hidden rounded-lg bg-white shadow">
// //           <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
// //             <div className="flex flex-col gap-2">
// //               <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa</h3>
// //               <div className="inline-flex rounded-md border border-gray-200 overflow-hidden w-max">
// //                 {[
// //                   { k: "all", label: "Todos" },
// //                   { k: "in", label: "Entradas" },
// //                   { k: "out", label: "Saídas" },
// //                 ].map(t => (
// //                   <button
// //                     key={t.k}
// //                     onClick={() => setTypeView(t.k)}
// //                     className={`px-3 py-1.5 text-sm ${typeView === t.k ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
// //                   >
// //                     {t.label}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-xs text-gray-500 mb-1">Totais do dia atual</p>
// //               <div className="text-sm text-gray-700">
// //                 <span className="mr-3">Entrada: <strong>{formatCurrency(viewTotals.in)}</strong></span>
// //                 <span className="mr-3">Saída: <strong className="text-red-600">{formatCurrency(viewTotals.out)}</strong></span>
// //                 <span>Saldo: <strong className={viewTotals.net < 0 ? "text-red-600" : "text-gray-900"}>{formatCurrency(viewTotals.net)}</strong></span>
// //               </div>
// //               <p className="text-xs text-gray-500 mt-1">Exibindo {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} de {totalItems}</p>
// //             </div>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
// //                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Tipo</th>
// //                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Descrição</th>
// //                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Cliente</th>
// //                   <th className="px-6 py-3 text-left  text-xs font-medium uppercase tracking-wider text-gray-500">Pagamento</th>
// //                   <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Entrada</th>
// //                   <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Saída</th>
// //                   <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Saldo</th>
// //                   <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200 bg-white">
// //                 {rows.length > 0 ? rows.map((r) => {
// //                   const isSale = (
// //                     ((r.type || "").toLowerCase() === "sale" || (r.type || "").toLowerCase() === "venda") &&
// //                     !!r.viewId
// //                   );

// //                   return (
// //                     <tr key={r.id || `${r.type}-${r.date}-${r.description}`}>
// //                       <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{r.date ? formatDate(r.date) : "—"}</td>
// //                       <td className="px-6 py-3 text-sm font-medium">{r.type}</td>
// //                       <td className="px-6 py-3 text-sm">{r.description}</td>
// //                       <td className="px-6 py-3 text-sm">{r.customerName || "—"}</td>
// //                       <td className="px-6 py-3 text-sm text-gray-600">{r.payment || "—"}</td>
// //                       <td className="px-6 py-3 text-sm text-right text-green-700">{r.in ? formatCurrency(r.in) : "—"}</td>
// //                       <td className="px-6 py-3 text-sm text-right text-red-600">{r.out ? formatCurrency(r.out) : "—"}</td>
// //                       <td className={`px-6 py-3 text-sm text-right ${r.balance < 0 ? "text-red-600" : "text-gray-900"}`}>
// //                         {formatCurrency(r.balance)}
// //                       </td>

// //                       {/* 🔽 NOVA COLUNA: Ações */}
// //                       <td className="px-6 py-3 text-sm text-center">
// //                         {isSale ? (
// //                           <Link
// //                             to={`/sales/view/${encodeURIComponent(r.viewId)}`}
// //                             className="inline-flex p-1 text-gray-700 hover:text-gray-900"
// //                             title="Ver detalhes da venda"
// //                           >
// //                             <EyeIcon className="h-5 w-5" />
// //                           </Link>
// //                         ) : (
// //                           <span className="text-gray-400">—</span>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   );
// //                 }) : (
// //                   // ⚠️ atualize o colspan de 8 -> 9
// //                   <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500">Nenhum lançamento no período</td></tr>
// //                 )}

// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="flex flex-col gap-3 border-t bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
// //             <div className="flex items-center gap-3">
// //               <span className="text-sm text-gray-600">Itens por página</span>
// //               <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
// //                 {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
// //               </select>
// //             </div>
// //             <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setPage(p)} className="justify-center" windowSize={1} />
// //             <div className="text-sm text-gray-600">{totalItems > 0 ? <>Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong></> : "Nenhum registro"}</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// import { useState, useEffect, useMemo, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// import Card from "../components/Card";
// import { formatCurrency, formatDate } from "../utils/format";
// import { fetchReports, fetchSales } from "../services/api";
// import { groupSales } from "../utils/groupSales";
// import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, EyeIcon } from "@heroicons/react/24/outline";
// import { Link } from "react-router-dom";

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

// // ===== helpers extras para resolução de ID =====
// const minuteIso = (dateVal) => {
//   const d = new Date(dateVal);
//   if (isNaN(d)) return String(dateVal || "");
//   d.setSeconds(0, 0);
//   return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
// };
// const normalizePayText = (t = "") =>
//   String(t).toLowerCase().replace(/\s+/g, " ").replace(/r\$\s?/g, "").trim();
// const paymentTextFromPMs = (pms = []) =>
//   pms.map(pm => `${pm.method}${pm.machine ? ` (${pm.machine})` : ""}: ${Number(pm.amount || 0).toFixed(2)}`).join(" | ");

// // ⬇️ mover dia YYYY-MM-DD em ±delta
// const shiftDate = (dateStr, deltaDays) => {
//   const [y, m, d] = dateStr.split("-").map(Number);
//   const dt = new Date(y, m - 1, d);
//   dt.setDate(dt.getDate() + deltaDays);
//   return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
// };

// // ===== compactação das vendas repetidas (uma linha por venda) =====
// function compactLedgerSales(arr = []) {
//   const groups = new Map();

//   const pmSig = (list = []) =>
//     list
//       .map((pm) => `${pm.method}|${pm.machine || ""}|${Number(pm.amount || 0).toFixed(2)}`)
//       .join("||");

//   const exactGroupKey = (l) => {
//     const paymentsArr =
//       Array.isArray(l.paymentMethods) ? l.paymentMethods :
//       Array.isArray(l.payments) ? l.payments : null;
//     if (!paymentsArr) return undefined;
//     const dateIso = new Date(l.date).toISOString();
//     return `${l.customerId || ""}#${dateIso}#${pmSig(paymentsArr)}`;
//   };

//   const paymentTextSig = (l) => normalizePayText(l.payment || "");

//   const makeAggKey = (l) =>
//     l.saleGroupId || l.groupId || l.quoteId || l.saleId ||
//     `${l.customerId || ""}#${minuteIso(l.date)}#${paymentTextSig(l)}#${l.customerName || ""}`;

//   const nonSales = [];

//   arr.forEach((l, idx) => {
//     const t = (l.type || "").toLowerCase();
//     if (t !== "sale" && t !== "venda") {
//       nonSales.push({ ...l, _order: idx });
//       return;
//     }

//     const key = makeAggKey(l);
//     const ex = groups.get(key);
//     const base = {
//       ...l,
//       in: Number(l.in || 0),
//       out: Number(l.out || 0),
//       _count: 1,
//       _payments: new Set(l.payment ? [String(l.payment)] : []),
//       _order: idx,
//       viewId: l.saleGroupId || l.groupId || l.quoteId || l.saleId || exactGroupKey(l) || key,
//     };

//     if (!ex) {
//       groups.set(key, base);
//     } else {
//       ex.in += Number(l.in || 0);
//       ex.out += Number(l.out || 0);
//       ex._count += 1;
//       if (l.payment) ex._payments.add(String(l.payment));
//     }
//   });

//   const salesAggregated = Array.from(groups.values()).map((g) => {
//     const payments = g._payments.size ? Array.from(g._payments).join(" | ") : g.payment || "—";
//     const countExtra = g._count > 1 ? ` (+${g._count - 1} itens)` : "";
//     const { _count, _payments, _order, ...rest } = g;
//     return {
//       ...rest,
//       payment: payments,
//       description: g.description ? `${g.description}${countExtra}` : `Venda${countExtra}`,
//       _order,
//     };
//   });

//   return [...nonSales, ...salesAggregated]
//     .sort((a, b) => a._order - b._order)
//     .map(({ _order, ...row }) => row);
// }

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
//   // ===== filtros (padrão: Dia/Hoje) =====
//   const [filters, setFilters] = useState({
//     mode: "day",
//     date: today(),
//     month: thisMonth(),
//     startDate: today(),
//     endDate: today(),
//     search: "",
//   });
//   const debouncedSearch = useDebounce(filters.search, 300);

//   const [data, setData] = useState({ dailySales: [], monthlySales: [], ledger: [], totals: { revenue: 0, expenses: 0, net: 0 } });
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);

//   // visão: todos | entradas | saídas
//   const [typeView, setTypeView] = useState("all");

//   // ===== índice de vendas para resolver o ID correto do ViewSale =====
//   const [saleIndex, setSaleIndex] = useState(null);
//   useEffect(() => {
//     (async () => {
//       try {
//         const raw = await fetchSales();
//         const grouped = groupSales(raw);
//         const idx = new Map();
//         for (const g of grouped) {
//           idx.set(String(g.id), g.id); // id oficial
//           const custKey = String(g.customerId || "").toLowerCase();
//           const nameKey = String(g.customerName || "").toLowerCase();
//           const mIso = minuteIso(g.date);
//           const payText = normalizePayText(paymentTextFromPMs(g.paymentMethods || []));
//           const totalKey = Number(g.total || 0).toFixed(2);
//           idx.set(`${custKey}|${mIso}|${payText}`, g.id);
//           idx.set(`${nameKey}|${mIso}|${payText}`, g.id);
//           idx.set(`${custKey}|${mIso}|${totalKey}`, g.id);
//           idx.set(`${nameKey}|${mIso}|${totalKey}`, g.id);
//         }
//         setSaleIndex(idx);
//       } catch (e) {
//         console.error("Falha ao montar índice de vendas:", e);
//         setSaleIndex(new Map());
//       }
//     })();
//   }, []);

//   const resolveViewId = (row) => {
//     if (!saleIndex) return null;
//     if (row.viewId && saleIndex.has(String(row.viewId))) return saleIndex.get(String(row.viewId));
//     const custKey = String(row.customerId || "").toLowerCase();
//     const nameKey = String(row.customerName || "").toLowerCase();
//     const mIso = minuteIso(row.date);
//     const payKey = normalizePayText(row.payment || "");
//     const totalKey = Number(row.in || 0).toFixed(2);
//     const tries = [
//       `${custKey}|${mIso}|${payKey}`,
//       `${nameKey}|${mIso}|${payKey}`,
//       `${custKey}|${mIso}|${totalKey}`,
//       `${nameKey}|${mIso}|${totalKey}`,
//       String(row.viewId || ""),
//     ];
//     for (const k of tries) if (k && saleIndex.has(k)) return saleIndex.get(k);
//     return null;
//   };

//   // ===== carregar dados do relatório =====
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

//   // ===== pipeline do ledger =====
//   const ledgerBase = useMemo(() => {
//     const arr = Array.isArray(data.ledger) ? data.ledger : [];
//     return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date) || a.type.localeCompare(b.type));
//   }, [data.ledger]);

//   const ledgerCompacted = useMemo(() => compactLedgerSales(ledgerBase), [ledgerBase]);

//   const ledgerSearched = useMemo(() => {
//     const q = debouncedSearch.trim().toLowerCase();
//     if (!q) return ledgerCompacted;
//     return ledgerCompacted.filter(l =>
//       `${l.type} ${l.description} ${l.customerName} ${l.payment}`.toLowerCase().includes(q)
//     );
//   }, [ledgerCompacted, debouncedSearch]);

//   const ledgerTyped = useMemo(() => {
//     if (typeView === "in") return ledgerSearched.filter(l => Number(l.in || 0) > 0);
//     if (typeView === "out") return ledgerSearched.filter(l => Number(l.out || 0) > 0);
//     return ledgerSearched;
//   }, [ledgerSearched, typeView]);

//   const ledgerView = useMemo(() => {
//     let running = 0;
//     return ledgerTyped.map(item => {
//       running += Number(item.in || 0) - Number(item.out || 0);
//       return { ...item, balance: running };
//     });
//   }, [ledgerTyped]);

//   const viewTotals = useMemo(() => {
//     const tin = ledgerTyped.reduce((s, i) => s + Number(i.in || 0), 0);
//     const tout = ledgerTyped.reduce((s, i) => s + Number(i.out || 0), 0);
//     return { in: tin, out: tout, net: tin - tout };
//   }, [ledgerTyped]);

//   // ===== paginação =====
//   const [pageSize, setPageSize] = useState(10);
//   const [page, setPage] = useState(1);
//   useEffect(() => setPage(1), [ledgerView, pageSize, typeView]);
//   const totalItems = ledgerView.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage = Math.min(Math.max(1, page), totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const endIdx = Math.min(startIdx + pageSize, totalItems);
//   const rows = ledgerView.slice(startIdx, endIdx);

//   // ===== gráficos =====
//   const dailySalesChartData = {
//     labels: (data.dailySales ?? []).map(i => i.date),
//     datasets: [{ label: "Vendas Diárias (R$)", data: (data.dailySales ?? []).map(i => i.total), backgroundColor: "rgba(59,130,246,.5)", borderColor: "rgb(59,130,246)", borderWidth: 1 }],
//   };
//   const monthlySalesChartData = {
//     labels: (data.monthlySales ?? []).map(i => i.month),
//     datasets: [{ label: "Vendas Mensais (R$)", data: (data.monthlySales ?? []).map(i => i.total), backgroundColor: "rgba(16,185,129,.5)", borderColor: "rgb(16,185,129)", borderWidth: 1 }],
//   };
//   const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } } };

//   // ===== topbar: datas + busca + export =====
//   const [openDate, setOpenDate] = useState(false);
//   const dateBtnRef = useRef(null);
//   useEffect(() => {
//     const h = (e) => { if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false); };
//     document.addEventListener("click", h); return () => document.removeEventListener("click", h);
//   }, []);
//   const setQuick = (days) => { const r = lastNDays(days); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); };
//   const setToday = () => { setFilters(f => ({ ...f, mode: "day", date: today() })); setOpenDate(false); };
//   const setThisMonth = () => { setFilters(f => ({ ...f, mode: "month", month: thisMonth() })); setOpenDate(false); };

//   const goPrevDay = () => setFilters(f => ({ ...f, mode: "day", date: shiftDate(f.date, -1) }));
//   const goNextDay = () => setFilters(f => ({ ...f, mode: "day", date: shiftDate(f.date, +1) }));
//   const goToday = () => setFilters(f => ({ ...f, mode: "day", date: today() }));

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
//     filters.mode === "month" ? filters.month :
//     `${filters.startDate} a ${filters.endDate}`;

//   const totals = data.totals || { revenue: 0, expenses: 0, net: 0 };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
//         <p className="text-sm text-gray-500">Painel central de desempenho e vendas (vendas e despesas)</p>
//       </div>

//       {/* Topbar */}
//       <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
//         <div className="px-0 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-6">
//             {[{ k: "day", l: "Dia" }, { k: "month", l: "Mês" }, { k: "range", l: "Período" }].map(t => (
//               <button key={t.k} onClick={() => setFilters(f => ({ ...f, mode: t.k }))} className={`relative pb-2 text-sm font-medium ${filters.mode === t.k ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
//                 {t.l}{filters.mode === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center gap-2">
//             {filters.mode === "day" && (
//               <>
//                 <button onClick={goPrevDay} className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50" title="Dia anterior">
//                   <ChevronLeftIcon className="h-4 w-4" />
//                 </button>
//                 <button onClick={goToday} className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50" title="Hoje">
//                   <CalendarDaysIcon className="h-4 w-4" />
//                   Hoje
//                 </button>
//                 <button onClick={goNextDay} className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50" title="Próximo dia">
//                   <ChevronRightIcon className="h-4 w-4" />
//                 </button>
//               </>
//             )}

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
//                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(7); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 7 dias</button>
//                     <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(30); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 30 dias</button>
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

//             {/* Export CSV */}
//             <button
//               type="button"
//               onClick={() => {
//                 setExporting(true);
//                 try {
//                   const headers = ["Data", "Tipo", "Descrição", "Cliente", "Pagamento", "Entrada", "Saída", "Saldo"];
//                   const csvRows = [headers.join(",")];
//                   ledgerView.forEach((r) => {
//                     csvRows.push([
//                       `"${r.date ? formatDate(r.date) : ""}"`,
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
//                   a.href = url; a.download = `fluxo_caixa_${typeView}_${label}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
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

//       {/* KPIs gerais */}
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card title="Receita no Período"><div className="text-2xl font-semibold">{formatCurrency(totals.revenue)}</div></Card>
//         <Card title="Despesas no Período"><div className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expenses)}</div></Card>
//         <Card title="Saldo (Receita - Despesas)"><div className={`text-2xl font-semibold ${totals.net < 0 ? "text-red-600" : "text-green-700"}`}>{formatCurrency(totals.net)}</div></Card>
//       </div>

//       {/* Gráficos */}
//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Vendas Diárias"><div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div></Card>
//         <Card title="Vendas Mensais"><div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div></Card>
//       </div>

//       {/* Tabela: Fluxo de Caixa */}
//       <div className="mt-6">
//         <div className="overflow-hidden rounded-lg bg-white shadow">
//           <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
//             <div className="flex flex-col gap-2">
//               <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa</h3>
//               <div className="inline-flex rounded-md border border-gray-200 overflow-hidden w-max">
//                 {[
//                   { k: "all", label: "Todos" },
//                   { k: "in", label: "Entradas" },
//                   { k: "out", label: "Saídas" },
//                 ].map(t => (
//                   <button
//                     key={t.k}
//                     onClick={() => setTypeView(t.k)}
//                     className={`px-3 py-1.5 text-sm ${typeView === t.k ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
//                   >
//                     {t.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-500 mb-1">Totais da visão atual</p>
//               <div className="text-sm text-gray-700">
//                 <span className="mr-3">Entrada: <strong>{formatCurrency(viewTotals.in)}</strong></span>
//                 <span className="mr-3">Saída: <strong className="text-red-600">{formatCurrency(viewTotals.out)}</strong></span>
//                 <span>Saldo: <strong className={viewTotals.net < 0 ? "text-red-600" : "text-gray-900"}>{formatCurrency(viewTotals.net)}</strong></span>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">Exibindo {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} de {totalItems}</p>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
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
//                   <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {rows.length > 0 ? rows.map((r) => {
//                   const isSaleType = ((r.type || "").toLowerCase() === "sale" || (r.type || "").toLowerCase() === "venda");
//                   const resolvedId = isSaleType ? resolveViewId(r) : null;

//                   return (
//                     <tr key={r.id || `${r.type}-${r.date}-${r.description}`}>
//                       <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{r.date ? formatDate(r.date) : "—"}</td>
//                       <td className="px-6 py-3 text-sm font-medium">{r.type}</td>
//                       <td className="px-6 py-3 text-sm">{r.description}</td>
//                       <td className="px-6 py-3 text-sm">{r.customerName || "—"}</td>
//                       <td className="px-6 py-3 text-sm text-gray-600">{r.payment || "—"}</td>
//                       <td className="px-6 py-3 text-sm text-right text-green-700">{r.in ? formatCurrency(r.in) : "—"}</td>
//                       <td className="px-6 py-3 text-sm text-right text-red-600">{r.out ? formatCurrency(r.out) : "—"}</td>
//                       <td className={`px-6 py-3 text-sm text-right ${r.balance < 0 ? "text-red-600" : "text-gray-900"}`}>
//                         {formatCurrency(r.balance)}
//                       </td>
//                       <td className="px-6 py-3 text-sm text-center">
//                         {resolvedId ? (
//                           <Link
//                             to={`/sales/view/${encodeURIComponent(resolvedId)}`}
//                             className="inline-flex p-1 text-gray-700 hover:text-gray-900"
//                             title="Ver detalhes da venda"
//                           >
//                             <EyeIcon className="h-5 w-5" />
//                           </Link>
//                         ) : <span className="text-gray-400">—</span>}
//                       </td>
//                     </tr>
//                   );
//                 }) : (
//                   <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500">Nenhum lançamento no período</td></tr>
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



// src/pages/Reports.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Card from "../components/Card";
import { formatCurrency, formatDate } from "../utils/format";
import { fetchReports, fetchSales } from "../services/api";
import { groupSales } from "../utils/groupSales";
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const pad = (n) => String(n).padStart(2, "0");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const lastNDays = (n) => {
  const end = new Date();
  const start = new Date(); start.setDate(end.getDate() - (n - 1));
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { start: fmt(start), end: fmt(end) };
};
const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
const startOfMonth = (ym) => { const [y, m] = ym.split("-").map(Number); return `${y}-${pad(m)}-01`; };
const endOfMonth = (ym) => { const [y, m] = ym.split("-").map(Number); const last = new Date(y, m, 0).getDate(); return `${y}-${pad(m)}-${pad(last)}`; };
const toISO = (date, eod = false) => eod ? `${date}T23:59:59` : `${date}T00:00:00`;

function useDebounce(v, d = 350) { const [x, setX] = useState(v); useEffect(() => { const id = setTimeout(() => setX(v), d); return () => clearTimeout(id) }, [v, d]); return x; }

const Input = (props) => <input className="w-full h-10 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm placeholder:text-gray-400 border-gray-200" {...props} />;
const SearchIcon = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const ChevronDown = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}><path d="M6 9l6 6 6-6" /></svg>);

// ===== helpers extras para resolução de ID =====
const minuteIso = (dateVal) => {
  const d = new Date(dateVal);
  if (isNaN(d)) return String(dateVal || "");
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
};
const normalizePayText = (t = "") =>
  String(t).toLowerCase().replace(/\s+/g, " ").replace(/r\$\s?/g, "").trim();
const paymentTextFromPMs = (pms = []) =>
  pms.map(pm => `${pm.method}${pm.machine ? ` (${pm.machine})` : ""}: ${Number(pm.amount || 0).toFixed(2)}`).join(" | ");

// ⬇️ mover dia YYYY-MM-DD em ±delta
const shiftDate = (dateStr, deltaDays) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
};

// ===== compactação das vendas repetidas (uma linha por venda) =====
function compactLedgerSales(arr = []) {
  const groups = new Map();

  const pmSig = (list = []) =>
    list
      .map((pm) => `${pm.method}|${pm.machine || ""}|${Number(pm.amount || 0).toFixed(2)}`)
      .join("||");

  const exactGroupKey = (l) => {
    const paymentsArr =
      Array.isArray(l.paymentMethods) ? l.paymentMethods :
      Array.isArray(l.payments) ? l.payments : null;
    if (!paymentsArr) return undefined;
    const dateIso = new Date(l.date).toISOString();
    return `${l.customerId || ""}#${dateIso}#${pmSig(paymentsArr)}`;
  };

  const paymentTextSig = (l) => normalizePayText(l.payment || "");

  const makeAggKey = (l) =>
    l.saleGroupId || l.groupId || l.quoteId || l.saleId ||
    `${l.customerId || ""}#${minuteIso(l.date)}#${paymentTextSig(l)}#${l.customerName || ""}`;

  const nonSales = [];

  arr.forEach((l, idx) => {
    const t = (l.type || "").toLowerCase();
    if (t !== "sale" && t !== "venda") {
      nonSales.push({ ...l, _order: idx });
      return;
    }

    const key = makeAggKey(l);
    const ex = groups.get(key);
    const base = {
      ...l,
      in: Number(l.in || 0),
      out: Number(l.out || 0),
      _count: 1,
      _payments: new Set(l.payment ? [String(l.payment)] : []),
      _order: idx,
      viewId: l.saleGroupId || l.groupId || l.quoteId || l.saleId || exactGroupKey(l) || key,
    };

    if (!ex) {
      groups.set(key, base);
    } else {
      ex.in += Number(l.in || 0);
      ex.out += Number(l.out || 0);
      ex._count += 1;
      if (l.payment) ex._payments.add(String(l.payment));
    }
  });

  const salesAggregated = Array.from(groups.values()).map((g) => {
    const payments = g._payments.size ? Array.from(g._payments).join(" | ") : g.payment || "—";
    const countExtra = g._count > 1 ? ` (+${g._count - 1} itens)` : "";
    const { _count, _payments, _order, ...rest } = g;
    return {
      ...rest,
      payment: payments,
      description: g.description ? `${g.description}${countExtra}` : `Venda${countExtra}`,
      _order,
    };
  });

  return [...nonSales, ...salesAggregated]
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...row }) => row);
}

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
      {pages.map((p, i) => (
        <button key={`${p}-${i}`} onClick={() => (p !== "…" ? onChange(p) : null)} disabled={p === "…"} aria-current={p === currentPage ? "page" : undefined} className={`px-3 py-1 rounded border text-sm min-w-[40px] ${p === currentPage ? "bg-black text-white border-black" : "hover:bg-gray-100"} ${p === "…" ? "cursor-default" : ""}`}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">Próxima</button>
      <button onClick={() => onChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border text-sm disabled:opacity-50">»</button>
    </nav>
  );
}

export default function Reports() {
  // ===== filtros (padrão: Dia/Hoje) =====
  const [filters, setFilters] = useState({
    mode: "day",
    date: today(),
    month: thisMonth(),
    startDate: today(),
    endDate: today(),
    search: "",
  });
  const debouncedSearch = useDebounce(filters.search, 300);

  const [data, setData] = useState({ dailySales: [], monthlySales: [], ledger: [], totals: { revenue: 0, expenses: 0, net: 0 } });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // visão: todos | entradas | saídas
  const [typeView, setTypeView] = useState("all");

  // ===== índice de vendas para resolver o ID correto do ViewSale =====
  const [saleIndex, setSaleIndex] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const raw = await fetchSales();
        const grouped = groupSales(raw);
        const idx = new Map();
        for (const g of grouped) {
          idx.set(String(g.id), g.id); // id oficial
          const custKey = String(g.customerId || "").toLowerCase();
          const nameKey = String(g.customerName || "").toLowerCase();
          const mIso = minuteIso(g.date);
          const payText = normalizePayText(paymentTextFromPMs(g.paymentMethods || []));
          const totalKey = Number(g.total || 0).toFixed(2);
          idx.set(`${custKey}|${mIso}|${payText}`, g.id);
          idx.set(`${nameKey}|${mIso}|${payText}`, g.id);
          idx.set(`${custKey}|${mIso}|${totalKey}`, g.id);
          idx.set(`${nameKey}|${mIso}|${totalKey}`, g.id);
        }
        setSaleIndex(idx);
      } catch (e) {
        console.error("Falha ao montar índice de vendas:", e);
        setSaleIndex(new Map());
      }
    })();
  }, []);

  const resolveViewId = (row) => {
    if (!saleIndex) return null;
    if (row.viewId && saleIndex.has(String(row.viewId))) return saleIndex.get(String(row.viewId));
    const custKey = String(row.customerId || "").toLowerCase();
    const nameKey = String(row.customerName || "").toLowerCase();
    const mIso = minuteIso(row.date);
    const payKey = normalizePayText(row.payment || "");
    const totalKey = Number(row.in || 0).toFixed(2);
    const tries = [
      `${custKey}|${mIso}|${payKey}`,
      `${nameKey}|${mIso}|${payKey}`,
      `${custKey}|${mIso}|${totalKey}`,
      `${nameKey}|${mIso}|${totalKey}`,
      String(row.viewId || ""),
    ];
    for (const k of tries) if (k && saleIndex.has(k)) return saleIndex.get(k);
    return null;
  };

  // ===== carregar dados do relatório =====
  const buildParams = () => {
    const common = { search: debouncedSearch };
    if (filters.mode === "day") return { ...common, from: toISO(filters.date), to: toISO(filters.date, true) };
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

  // ===== pipeline do ledger =====
  const ledgerBase = useMemo(() => {
    const arr = Array.isArray(data.ledger) ? data.ledger : [];
    return [...arr].sort((a, b) => new Date(a.date) - new Date(b.date) || a.type.localeCompare(b.type));
  }, [data.ledger]);

  const ledgerCompacted = useMemo(() => compactLedgerSales(ledgerBase), [ledgerBase]);

  const ledgerSearched = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return ledgerCompacted;
    return ledgerCompacted.filter(l =>
      `${l.type} ${l.description} ${l.customerName} ${l.payment}`.toLowerCase().includes(q)
    );
  }, [ledgerCompacted, debouncedSearch]);

  const ledgerTyped = useMemo(() => {
    if (typeView === "in") return ledgerSearched.filter(l => Number(l.in || 0) > 0);
    if (typeView === "out") return ledgerSearched.filter(l => Number(l.out || 0) > 0);
    return ledgerSearched;
  }, [ledgerSearched, typeView]);

  const ledgerView = useMemo(() => {
    let running = 0;
    return ledgerTyped.map(item => {
      running += Number(item.in || 0) - Number(item.out || 0);
      return { ...item, balance: running };
    });
  }, [ledgerTyped]);

  const viewTotals = useMemo(() => {
    const tin = ledgerTyped.reduce((s, i) => s + Number(i.in || 0), 0);
    const tout = ledgerTyped.reduce((s, i) => s + Number(i.out || 0), 0);
    return { in: tin, out: tout, net: tin - tout };
  }, [ledgerTyped]);

  // ===== paginação =====
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [ledgerView, pageSize, typeView]);
  const totalItems = ledgerView.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const rows = ledgerView.slice(startIdx, endIdx);

  // ===== gráficos =====
  const dailySalesChartData = {
    labels: (data.dailySales ?? []).map(i => i.date),
    datasets: [{ label: "Vendas Diárias (R$)", data: (data.dailySales ?? []).map(i => i.total), backgroundColor: "rgba(59,130,246,.5)", borderColor: "rgb(59,130,246)", borderWidth: 1 }],
  };
  const monthlySalesChartData = {
    labels: (data.monthlySales ?? []).map(i => i.month),
    datasets: [{ label: "Vendas Mensais (R$)", data: (data.monthlySales ?? []).map(i => i.total), backgroundColor: "rgba(16,185,129,.5)", borderColor: "rgb(16,185,129)", borderWidth: 1 }],
  };
  const chartOptions = { responsive: true, plugins: { legend: { position: "top" }, title: { display: false }, tooltip: { mode: "index", intersect: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { autoSkip: true, maxRotation: 0 } } } };

  // ===== topbar: datas + busca + export =====
  const [openDate, setOpenDate] = useState(false);
  const dateBtnRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (!dateBtnRef.current?.parentElement?.contains(e.target)) setOpenDate(false); };
    document.addEventListener("click", h); return () => document.removeEventListener("click", h);
  }, []);
  const setQuick = (days) => { const r = lastNDays(days); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); };
  const setToday = () => { setFilters(f => ({ ...f, mode: "day", date: today() })); setOpenDate(false); };
  const setThisMonth = () => { setFilters(f => ({ ...f, mode: "month", month: thisMonth() })); setOpenDate(false); };

  const goPrevDay = () => setFilters(f => ({ ...f, mode: "day", date: shiftDate(f.date, -1) }));
  const goNextDay = () => setFilters(f => ({ ...f, mode: "day", date: shiftDate(f.date, +1) }));
  const goToday = () => setFilters(f => ({ ...f, mode: "day", date: today() }));

  const searchRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6"><h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1><p className="text-sm text-gray-500">Carregando…</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />)}</div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /><div className="h-80 rounded-lg bg-gray-100 animate-pulse" /></div>
      </div>
    );
  }

  const periodLabel =
    filters.mode === "day" ? filters.date :
    filters.mode === "month" ? filters.month :
    `${filters.startDate} a ${filters.endDate}`;

  const totals = data.totals || { revenue: 0, expenses: 0, net: 0 };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Painel central de desempenho e vendas (vendas e despesas)</p>
      </div>

      {/* Topbar */}
      <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="px-0 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            {[{ k: "day", l: "Dia" }, { k: "month", l: "Mês" }, { k: "range", l: "Período" }].map(t => (
              <button key={t.k} onClick={() => setFilters(f => ({ ...f, mode: t.k }))} className={`relative pb-2 text-sm font-medium ${filters.mode === t.k ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                {t.l}{filters.mode === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* === NAVEGAÇÃO DE DIA: setas envolvendo o dropdown; sem botão "Hoje" separado === */}
            {filters.mode === "day" ? (
              <div className="flex items-center gap-2">
                {/* < */}
                <button
                  onClick={goPrevDay}
                  className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                  title="Dia anterior"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {/* Dropdown (Hoje/Mês atual/Período) */}
                <div className="relative">
                  <button
                    ref={dateBtnRef}
                    type="button"
                    onClick={() => setOpenDate(v => !v)}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
                    {filters.mode === "day" ? "Hoje" : filters.mode === "month" ? "Mês atual" : "Período"}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {openDate && (
                    <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToday}>Hoje</button>
                        <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setThisMonth}>Mês atual</button>
                        <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(7); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 7 dias</button>
                        <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(30); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 30 dias</button>
                      </div>
                      <div className="my-3 h-px bg-gray-100" />
                      {filters.mode === "day" && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-500 px-1">Dia</div>
                          <Input type="date" value={filters.date} onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))} />
                        </div>
                      )}
                      {filters.mode === "month" && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-500 px-1">Mês</div>
                          <Input type="month" value={filters.month} onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))} />
                        </div>
                      )}
                      {filters.mode === "range" && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs font-semibold text-gray-500 px-1">Início</div>
                            <Input type="date" value={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 px-1">Fim</div>
                            <Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* > */}
                <button
                  onClick={goNextDay}
                  className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                  title="Próximo dia"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              // Nos outros modos mantém só o dropdown como já estava
              <div className="relative">
                <button
                  ref={dateBtnRef}
                  type="button"
                  onClick={() => setOpenDate(v => !v)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center border border-gray-300 rounded-[3px] text-[10px]">▦</span>
                  {filters.mode === "day" ? "Hoje" : filters.mode === "month" ? "Mês atual" : "Período"}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {openDate && (
                  <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="text-xs font-semibold text-gray-500 px-1 pb-2">Rápido</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setToday}>Hoje</button>
                      <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={setThisMonth}>Mês atual</button>
                      <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(7); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 7 dias</button>
                      <button className="rounded-md border px-2 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { const r = lastNDays(30); setFilters(f => ({ ...f, mode: "range", startDate: r.start, endDate: r.end })); setOpenDate(false); }}>Últimos 30 dias</button>
                    </div>
                    <div className="my-3 h-px bg-gray-100" />
                    {filters.mode === "day" && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-500 px-1">Dia</div>
                        <Input type="date" value={filters.date} onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))} />
                      </div>
                    )}
                    {filters.mode === "month" && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-500 px-1">Mês</div>
                        <Input type="month" value={filters.month} onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))} />
                      </div>
                    )}
                    {filters.mode === "range" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 px-1">Início</div>
                          <Input type="date" value={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 px-1">Fim</div>
                          <Input type="date" value={filters.endDate} min={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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

            {/* Export CSV */}
            <button
              type="button"
              onClick={() => {
                setExporting(true);
                try {
                  const headers = ["Data", "Tipo", "Descrição", "Cliente", "Pagamento", "Entrada", "Saída", "Saldo"];
                  const csvRows = [headers.join(",")];
                  ledgerView.forEach((r) => {
                    csvRows.push([
                      `"${r.date ? formatDate(r.date) : ""}"`,
                      `"${r.type}"`,
                      `"${(r.description || "").replaceAll('"', '""')}"`,
                      `"${(r.customerName || "").replaceAll('"', '""')}"`,
                      `"${(r.payment || "").replaceAll('"', '""')}"`,
                      r.in ?? 0,
                      r.out ?? 0,
                      r.balance ?? 0,
                    ].join(","));
                  });
                  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  const label = filters.mode === "day" ? filters.date : filters.mode === "month" ? filters.month : `${filters.startDate}_a_${filters.endDate}`;
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
      <div className="mt-2 text-sm text-black-500">
  Período atual: <strong>
    {filters.mode === "day"
      ? formatDate(filters.date)
      : filters.mode === "month"
      ? filters.month
      : `${formatDate(filters.startDate)} a ${formatDate(filters.endDate)}`
    }
  </strong>
</div>


      {/* KPIs gerais */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Receita no Período"><div className="text-2xl font-semibold">{formatCurrency(totals.revenue)}</div></Card>
        <Card title="Despesas no Período"><div className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expenses)}</div></Card>
        <Card title="Saldo (Receita - Despesas)"><div className={`text-2xl font-semibold ${totals.net < 0 ? "text-red-600" : "text-green-700"}`}>{formatCurrency(totals.net)}</div></Card>
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vendas Diárias"><div className="h-80"><Bar data={dailySalesChartData} options={chartOptions} /></div></Card>
        <Card title="Vendas Mensais"><div className="h-80"><Bar data={monthlySalesChartData} options={chartOptions} /></div></Card>
      </div>

      {/* Tabela: Fluxo de Caixa */}
      <div className="mt-6">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-800">Fluxo de Caixa</h3>
              <div className="inline-flex rounded-md border border-gray-200 overflow-hidden w-max">
                {[
                  { k: "all", label: "Todos" },
                  { k: "in", label: "Entradas" },
                  { k: "out", label: "Saídas" },
                ].map(t => (
                  <button
                    key={t.k}
                    onClick={() => setTypeView(t.k)}
                    className={`px-3 py-1.5 text-sm ${typeView === t.k ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Totais do dia atual</p>
              <div className="text-sm text-gray-700">
                <span className="mr-3">Entrada: <strong>{formatCurrency(viewTotals.in)}</strong></span>
                <span className="mr-3">Saída: <strong className="text-red-600">{formatCurrency(viewTotals.out)}</strong></span>
                <span>Saldo: <strong className={viewTotals.net < 0 ? "text-red-600" : "text-gray-900"}>{formatCurrency(viewTotals.net)}</strong></span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Exibindo {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} de {totalItems}</p>
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
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.length > 0 ? rows.map((r) => {
                  const isSaleType = ((r.type || "").toLowerCase() === "sale" || (r.type || "").toLowerCase() === "venda");
                  const resolvedId = isSaleType ? resolveViewId(r) : null;

                  return (
                    <tr key={r.id || `${r.type}-${r.date}-${r.description}`}>
                      <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{r.date ? formatDate(r.date) : "—"}</td>
                      <td className="px-6 py-3 text-sm font-medium">{r.type}</td>
                      <td className="px-6 py-3 text-sm">{r.description}</td>
                      <td className="px-6 py-3 text-sm">{r.customerName || "—"}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{r.payment || "—"}</td>
                      <td className="px-6 py-3 text-sm text-right text-green-700">{r.in ? formatCurrency(r.in) : "—"}</td>
                      <td className="px-6 py-3 text-sm text-right text-red-600">{r.out ? formatCurrency(r.out) : "—"}</td>
                      <td className={`px-6 py-3 text-sm text-right ${r.balance < 0 ? "text-red-600" : "text-gray-900"}`}>
                        {formatCurrency(r.balance)}
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        {resolvedId ? (
                          <Link
                            to={`/sales/view/${encodeURIComponent(resolvedId)}`}
                            className="inline-flex p-1 text-gray-700 hover:text-gray-900"
                            title="Ver detalhes da venda"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500">Nenhum lançamento no período</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Itens por página</span>
              <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <Pagination currentPage={safePage} totalPages={totalPages} onChange={(p) => setPage(p)} className="justify-center" windowSize={1} />
            <div className="text-sm text-gray-600">{totalItems > 0 ? <>Exibindo <strong>{startIdx + 1}</strong>–<strong>{endIdx}</strong> de <strong>{totalItems}</strong></> : "Nenhum registro"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

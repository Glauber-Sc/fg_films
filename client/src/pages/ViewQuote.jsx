// // // // "use client"

// // // // import { useState, useEffect } from "react"
// // // // import { useParams, useNavigate } from "react-router-dom"
// // // // import { toast } from "react-toastify"
// // // // import { PrinterIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
// // // // import PageHeader from "../components/PageHeader"
// // // // import Card from "../components/Card"
// // // // import { formatCurrency } from "../utils/format"
// // // // import { fetchQuoteById, convertQuoteToSale } from "../services/api"

// // // // const ViewQuote = () => {
// // // //   const { id } = useParams()
// // // //   const navigate = useNavigate()
// // // //   const [quote, setQuote] = useState(null)
// // // //   const [isLoading, setIsLoading] = useState(true)

// // // //   useEffect(() => {
// // // //     loadQuote()
// // // //   }, [id])

// // // //   const loadQuote = async () => {
// // // //     try {
// // // //       setIsLoading(true)
// // // //       const data = await fetchQuoteById(id)
// // // //       setQuote(data)
// // // //     } catch (error) {
// // // //       console.error("Error loading quote:", error)
// // // //       toast.error("Erro ao carregar orçamento")
// // // //       navigate("/quotes")
// // // //     } finally {
// // // //       setIsLoading(false)
// // // //     }
// // // //   }

// // // //   const handleConvertToSale = async () => {
// // // //     if (window.confirm("Tem certeza que deseja converter este orçamento em venda?")) {
// // // //       try {
// // // //         await convertQuoteToSale(id)
// // // //         toast.success("Orçamento convertido em venda com sucesso!")
// // // //         navigate("/quotes")
// // // //       } catch (error) {
// // // //         console.error("Error converting quote to sale:", error)
// // // //         toast.error("Erro ao converter orçamento em venda")
// // // //       }
// // // //     }
// // // //   }

// // // //   const handlePrint = () => {
// // // //     window.print()
// // // //   }

// // // //   if (isLoading) {
// // // //     return <div className="text-center py-8">Carregando...</div>
// // // //   }

// // // //   if (!quote) {
// // // //     return <div className="text-center py-8">Orçamento não encontrado</div>
// // // //   }

// // // //   return (
// // // //     <div>
// // // //       <PageHeader
// // // //         title={`Orçamento #${quote.quoteNumber}`}
// // // //         actionButton={
// // // //           <div className="flex space-x-2">
// // // //             <button onClick={handlePrint} className="btn-secondary flex items-center">
// // // //               <PrinterIcon className="w-5 h-5 mr-1" />
// // // //               Imprimir
// // // //             </button>
// // // //             {quote.status !== "converted" && (
// // // //               <button onClick={handleConvertToSale} className="btn-primary flex items-center">
// // // //                 <ShoppingCartIcon className="w-5 h-5 mr-1" />
// // // //                 Converter em Venda
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         }
// // // //       />

// // // //       <Card>
// // // //         <div className="print:shadow-none">
// // // //           {/* Header */}
// // // //           <div className="mb-6 pb-6 border-b">
// // // //             <div className="flex justify-between items-start">
// // // //               <div>
// // // //                 <h2 className="text-2xl font-bold">FgFilms</h2>
// // // //                 <p className="text-gray-600">Sistema de Gestão</p>
// // // //               </div>
// // // //               <div className="text-right">
// // // //                 <p className="text-lg font-medium">Orçamento #{quote.quoteNumber}</p>
// // // //                 <p className="text-gray-600">Data: {new Date(quote.date).toLocaleDateString()}</p>
// // // //                 <span
// // // //                   className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
// // // //                     quote.status === "converted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
// // // //                   }`}
// // // //                 >
// // // //                   {quote.status === "converted" ? "Convertido" : "Pendente"}
// // // //                 </span>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Customer Info */}
// // // //           <div className="mb-6">
// // // //             <h3 className="font-medium text-gray-700 mb-2">Cliente</h3>
// // // //             <p className="text-black-600 hover:text-black-800 text-lg font-medium">{quote.customerName || "Cliente não informado"}</p>
// // // //           </div>

// // // //           {/* Items */}
// // // //           <div className="mb-6">
// // // //             <h3 className="font-medium text-gray-700 mb-4">Itens</h3>
// // // //             <div className="table-container">
// // // //               <table className="table">
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th className="table-header">Produto</th>
// // // //                     <th className="table-header">Marca</th>
// // // //                     <th className="table-header">Qtd</th>
// // // //                     <th className="table-header">Preço Unit.</th>
// // // //                     <th className="table-header">Total</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {quote.items.map((item, index) => (
// // // //                     <tr key={index}>
// // // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{item.name}</td>
// // // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{item.brand}</td>
// // // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{item.quantity}</td>
// // // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(item.price)}</td>
// // // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(item.total)}</td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           </div>

// // // //           {/* Notes */}
// // // //           {quote.notes && (
// // // //             <div className="mb-6">
// // // //               <h3 className="font-medium text-gray-700 mb-2">Observações</h3>
// // // //               <p className="text-black-600 hover:text-black-800 text-lg font-medium">{quote.notes}</p>
// // // //             </div>
// // // //           )}

// // // //           {/* Total */}
// // // //           <div className="border-t pt-4">
// // // //             <div className="flex justify-end">
// // // //               <div className="text-right">
// // // //                 <p className="text-2xl font-bold">Total: {formatCurrency(quote.total)}</p>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </Card>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default ViewQuote





// // // import { useState, useEffect } from "react"
// // // import { useParams, useNavigate } from "react-router-dom"
// // // import { toast } from "react-toastify"
// // // import { PrinterIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
// // // import PageHeader from "../components/PageHeader"
// // // import Card from "../components/Card"
// // // import { formatCurrency } from "../utils/format"
// // // import { fetchQuoteById, convertQuoteToSale } from "../services/api"

// // // const ViewQuote = () => {
// // //   const { id } = useParams()
// // //   const navigate = useNavigate()
// // //   const [quote, setQuote] = useState(null)
// // //   const [isLoading, setIsLoading] = useState(true)

// // //   useEffect(() => { loadQuote() }, [id])

// // //   const loadQuote = async () => {
// // //     try {
// // //       setIsLoading(true)
// // //       const data = await fetchQuoteById(id)
// // //       setQuote(data)
// // //     } catch (error) {
// // //       console.error("Error loading quote:", error)
// // //       toast.error("Erro ao carregar orçamento")
// // //       navigate("/quotes")
// // //     } finally {
// // //       setIsLoading(false)
// // //     }
// // //   }

// // //   const handleConvertToSale = async () => {
// // //     if (window.confirm("Tem certeza que deseja converter este orçamento em venda?")) {
// // //       try {
// // //         await convertQuoteToSale(id)
// // //         toast.success("Orçamento convertido em venda com sucesso!")
// // //         navigate("/quotes")
// // //       } catch (error) {
// // //         console.error("Error converting quote to sale:", error)
// // //         toast.error("Erro ao converter orçamento em venda")
// // //       }
// // //     }
// // //   }

// // //   const handlePrint = () => {
// // //     window.print()
// // //   }

// // //   if (isLoading) return <div className="text-center py-8">Carregando...</div>
// // //   if (!quote) return <div className="text-center py-8">Orçamento não encontrado</div>

// // //   return (
// // //     <div>
// // //       {/* ==== CSS GLOBAL DA IMPRESSÃO (auto-contido) ==== */}
// // //       <style>{`
// // //         /* Na tela, esconda a área exclusiva de impressão */
// // //         @media screen {
// // //           #fg-print { display: none !important; }
// // //         }

// // //         /* ---- IMPRESSÃO ---- */
// // //         @media print {
// // //           /* 1) Esconde tudo do app... */
// // //           body * { visibility: hidden !important; }

// // //           /* 2) ...menos o container do orçamento */
// // //           #fg-print, #fg-print * { visibility: visible !important; }

// // //           /* 3) Faz o container ocupar a página desde o topo/esquerda */
// // //           #fg-print {
// // //             position: absolute !important;
// // //             left: 0 !important;
// // //             top: 0 !important;
// // //             width: 210mm !important;       /* A4 */
// // //             min-height: 297mm !important;   /* A4 */
// // //             margin: 0 !important;
// // //             padding: 12mm !important;
// // //             background: #fff !important;
// // //           }

// // //           /* 4) Some com elementos marcados como no-print */
// // //           .no-print { display: none !important; }

// // //           /* 5) Página A4 com margens */
// // //           @page { size: A4; margin: 12mm; }
// // //         }

// // //         /* ===== Estilos do layout A4 FG FILMS ===== */
// // //         #fg-print {
// // //           font-family: Arial, Helvetica, sans-serif;
// // //           color: #111; font-size: 12px; line-height: 1.3;
// // //         }
// // //         #fg-print .sheet { position: relative; }
// // //         #fg-print .row { display: grid; gap: 6px; align-items: center; }
// // //         #fg-print .box { border: 1px solid #000; padding: 6px; }
// // //         #fg-print .line { border-bottom: 1px solid #000; height: 22px; }
// // //         #fg-print .header { display: grid; grid-template-columns: 1fr 180px; gap: 10px; }
// // //         #fg-print .brand { display: grid; grid-template-columns: 64px 1fr; gap: 8px; align-items: center; }
// // //         #fg-print .logo { width: 64px; height: 40px; border: 1px solid #000; display:flex; align-items:center; justify-content:center; font-size:10px; }
// // //         #fg-print .brand h1 { margin: 0; font-size: 18px; letter-spacing: .4px; }
// // //         #fg-print .brand .subtitle { font-size: 11px; color: #555; }
// // //         #fg-print .orcamento { border: 2px solid #000; text-align: center; padding: 6px; }
// // //         #fg-print .orcamento .title { font-size: 16px; font-weight: 800; }
// // //         #fg-print .orcamento .numero { margin-top: 6px; border: 1px solid #000; height: 28px; display:flex; align-items:center; justify-content:center; font-weight: 700; }
// // //         #fg-print .empresa { border: 1px solid #000; padding: 6px; margin-top: 8px; }
// // //         #fg-print .dados { border: 1px solid #000; border-top: none; padding: 6px;
// // //           display: grid; grid-template-columns: 1.3fr .9fr 1fr 1fr 80px; gap: 6px; }
// // //         #fg-print .dados .field { display: grid; grid-template-rows: auto 26px; gap: 2px; }
// // //         #fg-print .dados label { font-size: 10px; text-transform: uppercase; letter-spacing: .3px; }
// // //         #fg-print table { width: 100%; border-collapse: collapse; margin-top: 6px; }
// // //         #fg-print .itens thead th { border: 1px solid #000; padding: 6px; font-size: 11px; text-align: center; }
// // //         #fg-print .itens tbody td { border: 1px solid #000; height: 24px; padding: 4px; }
// // //         #fg-print .col-quant { width: 60px; text-align: center; }
// // //         #fg-print .col-valor, #fg-print .col-total { width: 120px; text-align: right; }
// // //         #fg-print .footer { display: grid; grid-template-columns: 1fr 220px; gap: 10px; align-items: end; margin-top: 8px; }
// // //         #fg-print .validade { border: 1px solid #000; padding: 6px; min-height: 42px; display: grid; align-content: center; font-size: 10px; color: #333; }
// // //         #fg-print .total { border: 2px solid #000; padding: 8px; text-align: right; font-size: 18px; font-weight: 800; }
// // //         #fg-print .assinaturas { display: grid; grid-template-columns: 1fr 240px; gap: 20px; align-items: end; margin-top: 22mm; }
// // //         #fg-print .assinaturas .linha-ass { border-top: 1px solid #000; height: 0; margin-top: 24px; }
// // //       `}</style>

// // //       {/* ===== TELA NORMAL (não imprime) ===== */}
// // //       <div className="no-print">
// // //         <PageHeader
// // //           title={`Orçamento #${quote.quoteNumber}`}
// // //           actionButton={
// // //             <div className="flex space-x-2">
// // //               <button onClick={handlePrint} className="btn-secondary flex items-center">
// // //                 <PrinterIcon className="w-5 h-5 mr-1" />
// // //                 Imprimir
// // //               </button>
// // //               {quote.status !== "converted" && (
// // //                 <button onClick={handleConvertToSale} className="btn-primary flex items-center">
// // //                   <ShoppingCartIcon className="w-5 h-5 mr-1" />
// // //                   Converter em Venda
// // //                 </button>
// // //               )}
// // //             </div>
// // //           }
// // //         />

// // //         <Card>
// // //           {/* Conteúdo da tela (o seu de sempre)… */}
// // //           <div className="mb-6 pb-6 border-b">
// // //             <div className="flex justify-between items-start">
// // //               <div>
// // //                 <h2 className="text-2xl font-bold">FgFilms</h2>
// // //                 <p className="text-gray-600">Sistema de Gestão</p>
// // //               </div>
// // //               <div className="text-right">
// // //                 <p className="text-lg font-medium">Orçamento #{quote.quoteNumber}</p>
// // //                 <p className="text-gray-600">Data: {new Date(quote.date).toLocaleDateString()}</p>
// // //                 <span
// // //                   className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
// // //                     quote.status === "converted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
// // //                   }`}
// // //                 >
// // //                   {quote.status === "converted" ? "Convertido" : "Pendente"}
// // //                 </span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="mb-6">
// // //             <h3 className="font-medium text-gray-700 mb-2">Cliente</h3>
// // //             <p className="text-black-600 hover:text-black-800 text-lg font-medium">
// // //               {quote.customerName || "Cliente não informado"}
// // //             </p>
// // //           </div>

// // //           <div className="mb-6">
// // //             <h3 className="font-medium text-gray-700 mb-4">Itens</h3>
// // //             <div className="table-container">
// // //               <table className="table">
// // //                 <thead>
// // //                   <tr>
// // //                     <th className="table-header">Produto</th>
// // //                     <th className="table-header">Marca</th>
// // //                     <th className="table-header">Qtd</th>
// // //                     <th className="table-header">Preço Unit.</th>
// // //                     <th className="table-header">Total</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {quote.items.map((item, index) => (
// // //                     <tr key={index}>
// // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{item.name}</td>
// // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{item.brand}</td>
// // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{item.quantity}</td>
// // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(item.price)}</td>
// // //                       <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(item.total)}</td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           </div>

// // //           {quote.notes && (
// // //             <div className="mb-6">
// // //               <h3 className="font-medium text-gray-700 mb-2">Observações</h3>
// // //               <p className="text-black-600 hover:text-black-800 text-lg font-medium">{quote.notes}</p>
// // //             </div>
// // //           )}

// // //           <div className="border-t pt-4">
// // //             <div className="flex justify-end">
// // //               <div className="text-right">
// // //                 <p className="text-2xl font-bold">Total: {formatCurrency(quote.total)}</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </Card>
// // //       </div>

// // //       {/* ===== LAYOUT EXCLUSIVO PARA IMPRESSÃO ===== */}
// // //       <div id="fg-print">
// // //         <div className="sheet">
// // //           {/* Cabeçalho */}
// // //           <div className="header">
// // //             <div className="brand">
// // //               <div className="logo">LOGO</div>
// // //               <div>
// // //                 <h1>FG FILMS</h1>
// // //                 <div className="subtitle">acessórios automotivos</div>
// // //               </div>
// // //             </div>
// // //             <div className="orcamento">
// // //               <div className="title">ORÇAMENTO</div>
// // //               <div className="numero">Nº {quote.quoteNumber}</div>
// // //             </div>
// // //           </div>

// // //           {/* Empresa */}
// // //           <div className="empresa">
// // //             <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
// // //               <div style={{fontWeight:700}}>CNPJ: 14.864.222/0001-67</div>
// // //               <div style={{fontSize:11}}>Película · Super LED · Som · Amplificadores · Alarmes · Travas · Módulos</div>
// // //             </div>
// // //             <div style={{marginTop:4}}>Tel.: (91) 98241-6768 · <span style={{fontSize:11}}>fer_mala2005@hotmail.com</span></div>
// // //             <div style={{marginTop:4, fontWeight:700}}>RUA QUINZE DE AGOSTO, 552, CRUZEIRO / ICOARACI</div>
// // //           </div>

// // //           {/* Dados do cliente (linhas em branco para preencher na impressão; ajuste se quiser preencher com dados) */}
// // //           <div className="dados">
// // //             <div className="field"><label>Nome</label><div className="line"></div></div>
// // //             <div className="field"><label>Tel.</label><div className="line"></div></div>
// // //             <div className="field"><label>End.</label><div className="line"></div></div>
// // //             <div className="field"><label>Bairro</label><div className="line"></div></div>
// // //             <div className="field"><label>Cidade</label><div className="line"></div></div>
// // //             <div className="field"><label>UF</label><div className="line"></div></div>
// // //             <div className="field"><label>CPF/CNPJ</label><div className="line"></div></div>
// // //             <div className="field"><label>Insc. Est.</label><div className="line"></div></div>
// // //             <div className="field"><label>Cond. Pagamento</label><div className="line"></div></div>
// // //             <div className="field"><label>Prazo Entrega</label><div className="line"></div></div>
// // //             <div className="field"><label>Validade</label><div className="line"></div></div>
// // //           </div>

// // //           {/* Itens */}
// // //           <table className="itens">
// // //             <thead>
// // //               <tr>
// // //                 <th className="col-quant">Quant.</th>
// // //                 <th>Discriminação</th>
// // //                 <th className="col-valor">V. Unit.</th>
// // //                 <th className="col-total">Total</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {quote.items.map((item, i) => (
// // //                 <tr key={i}>
// // //                   <td className="col-quant">{item.quantity}</td>
// // //                   <td>{`${item.name}${item.brand ? " - " + item.brand : ""}`}</td>
// // //                   <td className="col-valor">{formatCurrency(item.price)}</td>
// // //                   <td className="col-total">{formatCurrency(item.total)}</td>
// // //                 </tr>
// // //               ))}
// // //               {Array.from({ length: Math.max(12 - quote.items.length, 0) }).map((_, i) => (
// // //                 <tr key={`blank-${i}`}><td></td><td></td><td></td><td></td></tr>
// // //               ))}
// // //             </tbody>
// // //           </table>

// // //           {/* Observações */}
// // //           {quote.notes ? (
// // //             <div style={{border:'1px solid #000', borderTop:'none', padding:'6px', marginTop:'6px'}}>
// // //               <div style={{fontSize:11, fontWeight:700, marginBottom:4}}>Observações</div>
// // //               <div>{quote.notes}</div>
// // //             </div>
// // //           ) : null}

// // //           {/* Total + validade */}
// // //           <div className="footer">
// // //             <div className="validade">
// // //               Apresente este orçamento até a data de validade. Após, será realizado um novo orçamento.
// // //               <div style={{marginTop:6, fontSize:11}}>Data: {new Date(quote.date).toLocaleDateString()}</div>
// // //               <div style={{fontSize:11}}>Cliente: {quote.customerName || "Não informado"}</div>
// // //             </div>
// // //             <div className="total">TOTAL R$ {formatCurrency(quote.total).replace("R$ ","")}</div>
// // //           </div>

// // //           {/* Assinaturas */}
// // //           <div className="assinaturas">
// // //             <div>
// // //               <div className="linha-ass"></div>
// // //               <div style={{fontSize:10, textAlign:'center'}}>DATA</div>
// // //             </div>
// // //             <div>
// // //               <div className="linha-ass"></div>
// // //               <div style={{fontSize:10, textAlign:'center'}}>ASSINATURA ATENDENTE</div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default ViewQuote


// // import { useState, useEffect } from "react"
// // import { useParams, useNavigate } from "react-router-dom"
// // import { toast } from "react-toastify"
// // import { PrinterIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
// // import PageHeader from "../components/PageHeader"
// // import Card from "../components/Card"
// // import { formatCurrency } from "../utils/format"
// // import { fetchQuoteById, convertQuoteToSale } from "../services/api"

// // const ViewQuote = () => {
// //   const { id } = useParams()
// //   const navigate = useNavigate()
// //   const [quote, setQuote] = useState(null)
// //   const [isLoading, setIsLoading] = useState(true)

// //   useEffect(() => { loadQuote() }, [id])

// //   const loadQuote = async () => {
// //     try {
// //       setIsLoading(true)
// //       const data = await fetchQuoteById(id)
// //       setQuote(data)
// //     } catch (error) {
// //       console.error("Error loading quote:", error)
// //       toast.error("Erro ao carregar orçamento")
// //       navigate("/quotes")
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleConvertToSale = async () => {
// //     if (window.confirm("Tem certeza que deseja converter este orçamento em venda?")) {
// //       try {
// //         await convertQuoteToSale(id)
// //         toast.success("Orçamento convertido em venda com sucesso!")
// //         navigate("/quotes")
// //       } catch (error) {
// //         console.error("Error converting quote to sale:", error)
// //         toast.error("Erro ao converter orçamento em venda")
// //       }
// //     }
// //   }

// //   const handlePrint = () => window.print()

// //   if (isLoading) return <div className="text-center py-8">Carregando...</div>
// //   if (!quote) return <div className="text-center py-8">Orçamento não encontrado</div>

// //   return (
// //     <div>
// //       {/* ==== CSS GLOBAL DA IMPRESSÃO (100% fiel ao talão) ==== */}
// //       <style>{`
// //         @media screen { #fg-print { display: none !important; } }

// //         @media print {
// //           body * { visibility: hidden !important; }
// //           #fg-print, #fg-print * { visibility: visible !important; }

// //           /* folha A4 com margens enxutas parecidas com o bloco do talão */
// //           @page { size: A4; margin: 10mm; }

// //           #fg-print {
// //             position: absolute !important;
// //             inset: 0 0 auto 0 !important;
// //             margin: 0 !important;
// //             padding: 0 !important;
// //           }
// //           .no-print { display: none !important; }
// //         }

// //         /* ---------- Estilos do formulário ---------- */
// //         #fg-print {
// //           font-family: Arial, Helvetica, sans-serif;
// //           color: #000;
// //         }
// //         #fg-print .sheet {
// //           width: 190mm;              /* largura visual do talão na A4 */
// //           margin: 0 auto;
// //           background:#fff;
// //         }

// //         /* bordas e medidas inspiradas no papel */
// //         .b1 { border:1px solid #000; }
// //         .b2 { border:2px solid #000; }
// //         .p6 { padding:6px; }
// //         .p8 { padding:8px; }
// //         .mt4{ margin-top:4px; }
// //         .mt6{ margin-top:6px; }
// //         .mt8{ margin-top:8px; }
// //         .mb4{ margin-bottom:4px; }
// //         .tt { text-transform: uppercase; letter-spacing: .2px; }
// //         .small { font-size:11px; }
// //         .xsmall { font-size:10px; }

// //         /* cabeçalho */
// //         .hdr {
// //           display:grid;
// //           grid-template-columns: 1fr 170px;
// //           gap:10px;
// //           align-items:center;
// //         }
// //         .brand {
// //           display:grid;
// //           grid-template-columns: 64px 1fr;
// //           gap:8px;
// //           align-items:center;
// //         }
// //         .logo {
// //           width:64px; height:40px; display:flex; align-items:center; justify-content:center;
// //           border:1px solid #000; font-size:10px;
// //         }
// //         .brand h1 { margin:0; font-size:22px; line-height:1; }
// //         .brand .sub { margin-top:2px; font-size:11px; }

// //         .orc {
// //           text-align:center;
// //           border:2px solid #000;
// //           padding:6px;
// //         }
// //         .orc .t { font-weight:800; font-size:16px; }
// //         .orc .n { margin-top:6px; border:1px solid #000; height:28px; display:flex; align-items:center; justify-content:center; font-weight:700; }
// //         .orc .n::before { content:"Nº "; margin-right:2px; }

// //         /* bloco empresa (igual ao impresso) */
// //         .empresa { border:1px solid #000; padding:6px; margin-top:8px; }
// //         .empresa .row { display:flex; flex-wrap:wrap; justify-content:space-between; gap:8px; }
// //         .empresa .svc { font-size:11px; }
// //         .empresa .addr { font-weight:700; }

// //         /* dados do cliente – 4 linhas, como no formulário */
// //         .dados { border:1px solid #000; border-top:none; }
// //         .dln { display:grid; grid-template-columns: 1.4fr .8fr 1fr .6fr; gap:6px; padding:6px; }
// //         .dln-2 { grid-template-columns: 1.8fr 1fr .6fr; }
// //         .dln-3 { grid-template-columns: 1.2fr 1fr 1fr; }
// //         .dln-4 { grid-template-columns: 1.2fr 1fr 1fr; }
// //         .field { display:grid; grid-template-rows:auto 26px; gap:2px; }
// //         .field label { font-size:10px; text-transform:uppercase; }
// //         .line { border-bottom:1px solid #000; }

// //         /* tabela de itens */
// //         table.itens { width:100%; border-collapse:collapse; margin-top:6px; }
// //         .itens thead th { border:1px solid #000; padding:6px; font-size:11px; text-align:center; }
// //         .itens tbody td { border:1px solid #000; padding:4px; height:24px; }
// //         .col-q { width:60px; text-align:center; }
// //         .col-vu, .col-t { width:120px; text-align:right; }

// //         /* marca d'água FG FILMS no miolo da tabela */
// //         .wm {
// //           position:absolute; left:0; right:0; margin:auto; top:92mm;
// //           width:75%; text-align:center; font-size:36px; font-weight:700; color:#000;
// //           opacity:.06; pointer-events:none; user-select:none;
// //         }
// //         .wm small { display:block; font-weight:400; font-size:16px; letter-spacing:.8px; }

// //         /* rodapé total/validade */
// //         .foot { display:grid; grid-template-columns: 1fr 220px; gap:10px; align-items:end; margin-top:8px; }
// //         .valid { border:1px solid #000; padding:6px; min-height:44px; display:grid; align-content:center; font-size:10px; color:#333; }
// //         .total { border:2px solid #000; padding:8px; text-align:right; font-size:18px; font-weight:800; }

// //         /* assinaturas */
// //         .sign { display:grid; grid-template-columns: 1fr 240px; gap:20px; align-items:end; margin-top:22mm; }
// //         .uline { border-top:1px solid #000; height:0; margin-top:24px; }
// //         .siglbl { font-size:10px; text-align:center; }
// //       `}</style>

// //       {/* ==== Interface normal (não imprime) ==== */}
// //       <div className="no-print">
// //         <PageHeader
// //           title={`Orçamento #${quote.quoteNumber}`}
// //           actionButton={
// //             <div className="flex space-x-2">
// //               <button onClick={handlePrint} className="btn-secondary flex items-center">
// //                 <PrinterIcon className="w-5 h-5 mr-1" />
// //                 Imprimir
// //               </button>
// //               {quote.status !== "converted" && (
// //                 <button onClick={handleConvertToSale} className="btn-primary flex items-center">
// //                   <ShoppingCartIcon className="w-5 h-5 mr-1" />
// //                   Converter em Venda
// //                 </button>
// //               )}
// //             </div>
// //           }
// //         />

// //         <Card>
// //           {/* conteúdo de tela segue como estava */}
// //           <div className="mb-6 pb-6 border-b">
// //             <div className="flex justify-between items-start">
// //               <div>
// //                 <h2 className="text-2xl font-bold">FgFilms</h2>
// //                 <p className="text-gray-600">Sistema de Gestão</p>
// //               </div>
// //               <div className="text-right">
// //                 <p className="text-lg font-medium">Orçamento #{quote.quoteNumber}</p>
// //                 <p className="text-gray-600">Data: {new Date(quote.date).toLocaleDateString()}</p>
// //                 <span
// //                   className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
// //                     quote.status === "converted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
// //                   }`}
// //                 >
// //                   {quote.status === "converted" ? "Convertido" : "Pendente"}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="font-medium text-gray-700 mb-2">Cliente</h3>
// //             <p className="text-lg font-medium">
// //               {quote.customerName || "Cliente não informado"}
// //             </p>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="font-medium text-gray-700 mb-4">Itens</h3>
// //             <div className="table-container">
// //               <table className="table">
// //                 <thead>
// //                   <tr>
// //                     <th className="table-header">Produto</th>
// //                     <th className="table-header">Marca</th>
// //                     <th className="table-header">Qtd</th>
// //                     <th className="table-header">Preço Unit.</th>
// //                     <th className="table-header">Total</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {quote.items.map((item, index) => (
// //                     <tr key={index}>
// //                       <td className="table-cell text-sm font-medium">{item.name}</td>
// //                       <td className="table-cell text-sm font-medium">{item.brand}</td>
// //                       <td className="table-cell text-sm font-medium">{item.quantity}</td>
// //                       <td className="table-cell text-sm font-medium">{formatCurrency(item.price)}</td>
// //                       <td className="table-cell text-sm font-medium">{formatCurrency(item.total)}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //           {quote.notes && (
// //             <div className="mb-6">
// //               <h3 className="font-medium text-gray-700 mb-2">Observações</h3>
// //               <p className="text-lg font-medium">{quote.notes}</p>
// //             </div>
// //           )}

// //           <div className="border-t pt-4">
// //             <div className="flex justify-end">
// //               <div className="text-right">
// //                 <p className="text-2xl font-bold">Total: {formatCurrency(quote.total)}</p>
// //               </div>
// //             </div>
// //           </div>
// //         </Card>
// //       </div>

// //       {/* ==== LAYOUT EXCLUSIVO PARA IMPRESSÃO (fiel ao talão) ==== */}
// //       <div id="fg-print">
// //         <div className="sheet">
// //           {/* Cabeçalho */}
// //           <div className="hdr">
// //             <div className="brand">
// //               <div className="logo">LOGO</div>
// //               <div>
// //                 <h1>FG FILMS</h1>
// //                 <div className="sub">acessórios automotivos</div>
// //               </div>
// //             </div>
// //             <div className="orc">
// //               <div className="t">ORÇAMENTO</div>
// //               <div className="n">{quote.quoteNumber}</div>
// //             </div>
// //           </div>

// //           {/* Empresa */}
// //           <div className="empresa">
// //             <div className="row">
// //               <div style={{fontWeight:700}}>CNPJ: 14.864.222/0001-67</div>
// //               <div className="svc">PELÍCULA · SUPER LED · SOM · AMPLIFICADORES · ALARMES · TRAVAS · MÓDULOS</div>
// //             </div>
// //             <div className="mt4">Tel.: (91) 98241-6768 · <span className="small">fer_maia2005@hotmail.com</span></div>
// //             <div className="mt4 addr">RUA QUINZE DE AGOSTO, 552, CRUZEIRO / ICOARACI</div>
// //           </div>

// //           {/* Dados (4 linhas como na arte) */}
// //           <div className="dados">
// //             {/* L1: Nome / Tel. */}
// //             <div className="dln">
// //               <div className="field"><label>Nome</label><div className="line"></div></div>
// //               <div className="field"><label>Tel.</label><div className="line"></div></div>
// //               <div className="field"><label></label><div></div></div>
// //               <div className="field"><label></label><div></div></div>
// //             </div>
// //             {/* L2: End. / Cidade / UF */}
// //             <div className="dln dln-2">
// //               <div className="field"><label>End.</label><div className="line"></div></div>
// //               <div className="field"><label>Cidade</label><div className="line"></div></div>
// //               <div className="field"><label>UF</label><div className="line"></div></div>
// //             </div>
// //             {/* L3: Bairro / CPF/CNPJ / INSC. EST. */}
// //             <div className="dln dln-3">
// //               <div className="field"><label>Bairro</label><div className="line"></div></div>
// //               <div className="field"><label>CPF/CNPJ</label><div className="line"></div></div>
// //               <div className="field"><label>INSC. EST.</label><div className="line"></div></div>
// //             </div>
// //             {/* L4: Cond. Pagamento / Prazo Entrega / Validade */}
// //             <div className="dln dln-4">
// //               <div className="field"><label>COND. PAGAMENTO</label><div className="line"></div></div>
// //               <div className="field"><label>PRAZO ENTREGA</label><div className="line"></div></div>
// //               <div className="field"><label>VALIDADE</label><div className="line"></div></div>
// //             </div>
// //           </div>

// //           {/* Tabela de Itens */}
// //           <div style={{position:"relative"}}>
// //             <div className="wm">FG FILMS<small>acessórios automotivos</small></div>
// //             <table className="itens">
// //               <thead>
// //                 <tr>
// //                   <th className="col-q">Quant.</th>
// //                   <th>Discriminação</th>
// //                   <th className="col-vu">V. Unit.</th>
// //                   <th className="col-t">Total</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {quote.items.map((item, i) => (
// //                   <tr key={i}>
// //                     <td className="col-q">{item.quantity}</td>
// //                     <td>{`${item.name}${item.brand ? " - " + item.brand : ""}`}</td>
// //                     <td className="col-vu">{formatCurrency(item.price)}</td>
// //                     <td className="col-t">{formatCurrency(item.total)}</td>
// //                   </tr>
// //                 ))}
// //                 {Array.from({ length: Math.max(12 - quote.items.length, 0) }).map((_, i) => (
// //                   <tr key={`blank-${i}`}><td></td><td></td><td></td><td></td></tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Observações (opcional) */}
// //           {quote.notes ? (
// //             <div className="b1 p6 mt6">
// //               <div className="small tt mb4">Observações</div>
// //               <div>{quote.notes}</div>
// //             </div>
// //           ) : null}

// //           {/* Validade + Total */}
// //           <div className="foot">
// //             <div className="valid">
// //               Apresente este orçamento até a data de validade. Após, será realizado um novo orçamento.
// //               <div className="mt4 xsmall">Data: {new Date(quote.date).toLocaleDateString()}</div>
// //               <div className="xsmall">Cliente: {quote.customerName || "Não informado"}</div>
// //             </div>
// //             <div className="total">TOTAL R$ {formatCurrency(quote.total).replace("R$ ","")}</div>
// //           </div>

// //           {/* Assinaturas */}
// //           <div className="sign">
// //             <div>
// //               <div className="uline"></div>
// //               <div className="siglbl">DATA</div>
// //             </div>
// //             <div>
// //               <div className="uline"></div>
// //               <div className="siglbl">ASSINATURA ATENDENTE</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default ViewQuote



// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { PrinterIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
// import PageHeader from "../components/PageHeader";
// import Card from "../components/Card";
// import { formatCurrency } from "../utils/format";
// import { fetchQuoteById, convertQuoteToSale } from "../services/api";

// const BLANK_ROWS = 12; // quantas linhas vazias quer mostrar na tabela ao imprimir

// const ViewQuote = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [quote, setQuote] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadQuote();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const loadQuote = async () => {
//     try {
//       setIsLoading(true);
//       const data = await fetchQuoteById(id);
//       setQuote(data);
//     } catch (error) {
//       console.error("Error loading quote:", error);
//       toast.error("Erro ao carregar orçamento");
//       navigate("/quotes");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleConvertToSale = async () => {
//     if (window.confirm("Tem certeza que deseja converter este orçamento em venda?")) {
//       try {
//         await convertQuoteToSale(id);
//         toast.success("Orçamento convertido em venda com sucesso!");
//         navigate("/quotes");
//       } catch (error) {
//         console.error("Error converting quote to sale:", error);
//         toast.error("Erro ao converter orçamento em venda");
//       }
//     }
//   };

//   const handlePrint = () => window.print();

//   if (isLoading) return <div className="text-center py-8">Carregando...</div>;
//   if (!quote) return <div className="text-center py-8">Orçamento não encontrado</div>;

//   return (
//     <div>
//       {/* ==== CSS GLOBAL DE IMPRESSÃO (fiel ao talão) ==== */}
//       <style>{`
//         @media screen { #fg-print { display: none !important; } }

//         @media print {
//           body * { visibility: hidden !important; }
//           #fg-print, #fg-print * { visibility: visible !important; }
//           @page { size: A4; margin: 10mm; } /* ajuste a margem conforme seu papel */

//           #fg-print {
//             position: absolute !important;
//             inset: 0 0 auto 0 !important;
//             margin: 0 !important;
//             padding: 0 !important;
//           }
//           .no-print { display: none !important; }
//         }

//         /* ---------- Estilos do formulário ---------- */
//         #fg-print {
//           font-family: Arial, Helvetica, sans-serif;
//           color: #000;
//         }
//         #fg-print .sheet {
//           width: 190mm;              /* largura visual do talão na A4 — ajuste fino aqui */
//           margin: 0 auto;
//           background:#fff;
//         }

//         .b1 { border:1px solid #000; }
//         .b2 { border:2px solid #000; }
//         .p6 { padding:6px; }
//         .p8 { padding:8px; }
//         .mt2{ margin-top:2px; }
//         .mt4{ margin-top:4px; }
//         .mt6{ margin-top:6px; }
//         .mt8{ margin-top:8px; }
//         .mb4{ margin-bottom:4px; }
//         .tt { text-transform: uppercase; letter-spacing: .2px; }
//         .small { font-size:11px; }
//         .xsmall { font-size:10px; }

//         /* Cabeçalho */
//         .hdr {
//           display:grid;
//           grid-template-columns: 1fr 170px;
//           gap:10px;
//           align-items:center;
//         }
//         .brand {
//           display:grid;
//           grid-template-columns: 64px 1fr;
//           gap:8px;
//           align-items:center;
//         }
//         .logo {
//           width:64px; height:40px; display:flex; align-items:center; justify-content:center;
//           border:1px solid #000; font-size:10px;
//         }
//         .brand h1 { margin:0; font-size:22px; line-height:1; }
//         .brand .sub { margin-top:2px; font-size:11px; }

//         .orc {
//           text-align:center;
//           border:2px solid #000;
//           padding:6px;
//         }
//         .orc .t { font-weight:800; font-size:16px; }
//         .orc .n { margin-top:6px; border:1px solid #000; height:28px; display:flex; align-items:center; justify-content:center; font-weight:700; }
//         .orc .n::before { content:"Nº "; margin-right:2px; }

//         /* Bloco empresa */
//         .empresa { border:1px solid #000; padding:6px; margin-top:8px; }
//         .empresa .row { display:flex; flex-wrap:wrap; justify-content:space-between; gap:8px; }
//         .empresa .svc { font-size:11px; }
//         .empresa .addr { font-weight:700; }

//         /* Dados do cliente – 4 linhas como no formulário */
//         .dados { border:1px solid #000; border-top:none; }
//         .dln { display:grid; grid-template-columns: 1.4fr .8fr 1fr .6fr; gap:6px; padding:6px; }
//         .dln-2 { grid-template-columns: 1.8fr 1fr .6fr; }
//         .dln-3 { grid-template-columns: 1.2fr 1fr 1fr; }
//         .dln-4 { grid-template-columns: 1.2fr 1fr 1fr; }
//         .field { display:grid; grid-template-rows:auto 26px; gap:2px; }
//         .field label { font-size:10px; text-transform:uppercase; }
//         .line { border-bottom:1px solid #000; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; padding:2px 4px; }

//         /* Tabela de itens */
//         table.itens { width:100%; border-collapse:collapse; margin-top:6px; }
//         .itens thead th { border:1px solid #000; padding:6px; font-size:11px; text-align:center; }
//         .itens tbody td { border:1px solid #000; padding:4px; height:24px; }
//         .col-q { width:60px; text-align:center; }
//         .col-vu, .col-t { width:120px; text-align:right; }

//         /* Marca d'água no miolo da tabela */
//         .wm {
//           position:absolute; left:0; right:0; margin:auto; top:92mm;
//           width:75%; text-align:center; font-size:36px; font-weight:700; color:#000;
//           opacity:.06; pointer-events:none; user-select:none;
//         }
//         .wm small { display:block; font-weight:400; font-size:16px; letter-spacing:.8px; }

//         /* Rodapé total/validade */
//         .foot { display:grid; grid-template-columns: 1fr 220px; gap:10px; align-items:end; margin-top:8px; }
//         .valid { border:1px solid #000; padding:6px; min-height:44px; display:grid; align-content:center; font-size:10px; color:#333; }
//         .total { border:2px solid #000; padding:8px; text-align:right; font-size:18px; font-weight:800; }

//         /* Assinaturas */
//         .sign { display:grid; grid-template-columns: 1fr 240px; gap:20px; align-items:end; margin-top:22mm; }
//         .uline { border-top:1px solid #000; height:0; margin-top:24px; }
//         .siglbl { font-size:10px; text-align:center; }
//       `}</style>

//       {/* ==== Interface normal (não imprime) ==== */}
//       <div className="no-print">
//         <PageHeader
//           title={`Orçamento #${quote.quoteNumber}`}
//           actionButton={
//             <div className="flex space-x-2">
//               <button onClick={handlePrint} className="btn-secondary flex items-center">
//                 <PrinterIcon className="w-5 h-5 mr-1" />
//                 Imprimir
//               </button>
//               {quote.status !== "converted" && (
//                 <button onClick={handleConvertToSale} className="btn-primary flex items-center">
//                   <ShoppingCartIcon className="w-5 h-5 mr-1" />
//                   Converter em Venda
//                 </button>
//               )}
//             </div>
//           }
//         />

//         <Card>
//           <div className="mb-6 pb-6 border-b">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold">FgFilms</h2>
//                 <p className="text-gray-600">Sistema de Gestão</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-lg font-medium">Orçamento #{quote.quoteNumber}</p>
//                 <p className="text-gray-600">Data: {new Date(quote.date).toLocaleDateString()}</p>
//                 <span
//                   className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${quote.status === "converted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                     }`}
//                 >
//                   {quote.status === "converted" ? "Convertido" : "Pendente"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="font-medium text-gray-700 mb-2">Cliente</h3>
//             <p className="text-lg font-medium">
//               {quote.customerName || "Cliente não informado"}
//             </p>
//           </div>

//           <div className="mb-6">
//             <h3 className="font-medium text-gray-700 mb-4">Itens</h3>
//             <div className="table-container">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th className="table-header">Produto</th>
//                     <th className="table-header">Marca</th>
//                     <th className="table-header">Qtd</th>
//                     <th className="table-header">Preço Unit.</th>
//                     <th className="table-header">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quote.items.map((item, index) => (
//                     <tr key={index}>
//                       <td className="table-cell text-sm font-medium">{item.name}</td>
//                       <td className="table-cell text-sm font-medium">{item.brand}</td>
//                       <td className="table-cell text-sm font-medium">{item.quantity}</td>
//                       <td className="table-cell text-sm font-medium">{formatCurrency(item.price)}</td>
//                       <td className="table-cell text-sm font-medium">{formatCurrency(item.total)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {quote.notes && (
//             <div className="mb-6">
//               <h3 className="font-medium text-gray-700 mb-2">Observações</h3>
//               <p className="text-lg font-medium">{quote.notes}</p>
//             </div>
//           )}

//           <div className="border-t pt-4">
//             <div className="flex justify-end">
//               <div className="text-right">
//                 <p className="text-2xl font-bold">Total: {formatCurrency(quote.total)}</p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* ==== LAYOUT EXCLUSIVO PARA IMPRESSÃO (fiel ao talão) ==== */}
//       <div id="fg-print">
//         <div className="sheet">


//           {/* Empresa */}
//           <div className="empresa">

//             {/* Cabeçalho */}
//             <div className="hdr">
//               <div className="brand">
//                 <div className="logo">LOGO</div>
//                 <div>
//                   <h1>FG FILMS</h1>
//                   <div className="sub">acessórios automotivos</div>
//                 </div>
//               </div>
//               <div className="orc">
//                 <div className="t">ORÇAMENTO</div>
//                 <div className="n">{quote.quoteNumber}</div>
//               </div>
//             </div>
//             <div className="row">
//               <div style={{ fontWeight: 700 }}>CNPJ: 14.864.222/0001-67</div>

//             </div>
//             <div className="svc">PELÍCULA · SUPER LED · SOM · AMPLIFICADORES · ALARMES · TRAVAS · MÓDULOS</div>
//             <div className="mt4">Tel.: (91) 98241-6768 · <span className="">fer_maia2005@hotmail.com</span></div>
//             <div className="mt4 addr">RUA QUINZE DE AGOSTO, 552, CRUZEIRO / ICOARACI</div>
//           </div>

//           {/* Dados (4 linhas como na arte) */}
//           <div className="dados">
//             {/* L1: Nome / Tel. */}
//             <div className="dln">
//               <div className="field"><label>Nome</label><div className="line">{quote.customerName || ""}</div></div>
//               <div className="field"><label>Tel.</label><div className="line">{quote.customerPhone || ""}</div></div>
//               <div className="field"><label></label><div></div></div>
//               <div className="field"><label></label><div></div></div>
//             </div>
//             {/* L2: End. / Cidade / UF */}
//             <div className="dln dln-2">
//               <div className="field"><label>End.</label><div className="line">{quote.address || ""}</div></div>
//               <div className="field"><label>Cidade</label><div className="line">{quote.city || ""}</div></div>
//               <div className="field"><label>UF</label><div className="line">{quote.uf || ""}</div></div>
//             </div>
//             {/* L3: Bairro / CPF/CNPJ / INSC. EST. */}
//             <div className="dln dln-3">
//               <div className="field"><label>Bairro</label><div className="line">{quote.neighborhood || ""}</div></div>
//               <div className="field"><label>CPF/CNPJ</label><div className="line">{quote.cpfCnpj || ""}</div></div>
//               <div className="field"><label>INSC. EST.</label><div className="line">{quote.stateRegistration || ""}</div></div>
//             </div>
//             {/* L4: Cond. Pagamento / Prazo Entrega / Validade */}
//             <div className="dln dln-4">
//               <div className="field"><label>COND. PAGAMENTO</label><div className="line">{quote.paymentTerms || ""}</div></div>
//               <div className="field"><label>PRAZO ENTREGA</label><div className="line">{quote.deliveryTime || ""}</div></div>
//               <div className="field"><label>VALIDADE</label><div className="line">{quote.validityDate || ""}</div></div>
//             </div>
//           </div>

//           {/* Tabela de Itens */}
//           <div style={{ position: "relative" }}>
//             <div className="wm">FG FILMS<small>acessórios automotivos</small></div>
//             <table className="itens">
//               <thead>
//                 <tr>
//                   <th className="col-q">Quant.</th>
//                   <th>Discriminação</th>
//                   <th className="col-vu">V. Unit.</th>
//                   <th className="col-t">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {quote.items.map((item, i) => (
//                   <tr key={i}>
//                     <td className="col-q">{item.quantity}</td>
//                     <td>{`${item.name}${item.brand ? " - " + item.brand : ""}`}</td>
//                     <td className="col-vu">{formatCurrency(item.price)}</td>
//                     <td className="col-t">{formatCurrency(item.total)}</td>
//                   </tr>
//                 ))}
//                 {Array.from({ length: Math.max(BLANK_ROWS - quote.items.length, 0) }).map((_, i) => (
//                   <tr key={`blank-${i}`}><td></td><td></td><td></td><td></td></tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Observações (opcional) */}
//           {quote.notes ? (
//             <div className="b1 p6 mt6">
//               <div className="small tt mb4">Observações</div>
//               <div>{quote.notes}</div>
//             </div>
//           ) : null}

//           {/* Validade + Total */}
//           <div className="foot">
//             <div className="valid">
//               Apresente este orçamento até a data de validade. Após, será realizado um novo orçamento.
//               <div className="mt4 xsmall">Data: {new Date(quote.date).toLocaleDateString()}</div>
//               <div className="xsmall">Cliente: {quote.customerName || "Não informado"}</div>
//             </div>
//             <div className="total">TOTAL R$ {formatCurrency(quote.total).replace("R$ ", "")}</div>
//           </div>

//           {/* Assinaturas */}
//           <div className="sign">
//             <div>
//               <div className="uline"></div>
//               <div className="siglbl">DATA</div>
//             </div>
//             <div>
//               <div className="uline"></div>
//               <div className="siglbl">ASSINATURA ATENDENTE</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewQuote;



import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrinterIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchQuoteById, convertQuoteToSale } from "../services/api";

const BLANK_ROWS = 12; // linhas vazias na tabela de impressão

const StatusBadge = ({ status }) => {
  const key = (status || "").toLowerCase();
  const map = {
    converted: { label: "Convertido", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    pending: { label: "Pendente", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  };
  const found = map[key] || { label: status || "—", cls: "bg-gray-100 text-gray-700 border-gray-200" };
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${found.cls}`}>
      {found.label}
    </span>
  );
};

const ViewQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadQuote = async () => {
    try {
      setIsLoading(true);
      const data = await fetchQuoteById(id);
      setQuote(data);
    } catch (error) {
      console.error("Error loading quote:", error);
      toast.error("Erro ao carregar orçamento");
      navigate("/quotes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToSale = async () => {
    if (window.confirm("Tem certeza que deseja converter este orçamento em venda?")) {
      try {
        await convertQuoteToSale(id);
        toast.success("Orçamento convertido em venda com sucesso!");
        navigate("/quotes");
      } catch (error) {
        console.error("Error converting quote to sale:", error);
        toast.error("Erro ao converter orçamento em venda");
      }
    }
  };

  const handlePrint = () => window.print();

  if (isLoading) return <div className="flex h-64 items-center justify-center text-gray-600">Carregando...</div>;
  if (!quote) return <div className="flex h-64 items-center justify-center text-gray-600">Orçamento não encontrado</div>;

  return (
    <div className="p-6">
      {/* === CSS GLOBAL DE IMPRESSÃO === */}
      <style>{`
        @media screen { #fg-print { display: none !important; } }
        @media print {
          body * { visibility: hidden !important; }
          #fg-print, #fg-print * { visibility: visible !important; }
          @page { size: A4; margin: 10mm; }
          #fg-print { position: absolute !important; inset: 0 0 auto 0 !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }
        #fg-print { font-family: Arial, Helvetica, sans-serif; color: #000; }
        #fg-print .sheet { width: 190mm; margin: 0 auto; background: #fff; }
        .b1 { border:1px solid #000; } .b2 { border:2px solid #000; }
        .p6 { padding:6px; } .p8 { padding:8px; }
        .mt2{ margin-top:2px; } .mt4{ margin-top:4px; } .mt6{ margin-top:6px; } .mt8{ margin-top:8px; } .mb4{ margin-bottom:4px; }
        .tt { text-transform: uppercase; letter-spacing: .2px; }
        .small { font-size:11px; } .xsmall { font-size:10px; }
        .hdr { display:grid; grid-template-columns: 1fr 170px; gap:10px; align-items:center; }
        .brand { display:grid; grid-template-columns: 64px 1fr; gap:8px; align-items:center; }
        .logo { width:64px; height:40px; display:flex; align-items:center; justify-content:center; border:1px solid #000; font-size:10px; }
        .brand h1 { margin:0; font-size:22px; line-height:1; } .brand .sub { margin-top:2px; font-size:11px; }
        .orc { text-align:center; border:2px solid #000; padding:6px; } .orc .t { font-weight:800; font-size:16px; }
        .orc .n { margin-top:6px; border:1px solid #000; height:28px; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .orc .n::before { content:"Nº "; margin-right:2px; }
        .empresa { border:1px solid #000; padding:6px; margin-top:8px; }
        .empresa .row { display:flex; flex-wrap:wrap; justify-content:space-between; gap:8px; }
        .empresa .svc { font-size:11px; } .empresa .addr { font-weight:700; }
        .dados { border:1px solid #000; border-top:none; }
        .dln { display:grid; grid-template-columns: 1.4fr .8fr 1fr .6fr; gap:6px; padding:6px; }
        .dln-2 { grid-template-columns: 1.8fr 1fr .6fr; }
        .dln-3 { grid-template-columns: 1.2fr 1fr 1fr; }
        .dln-4 { grid-template-columns: 1.2fr 1fr 1fr; }
        .field { display:grid; grid-template-rows:auto 26px; gap:2px; }
        .field label { font-size:10px; text-transform:uppercase; }
        .line { border-bottom:1px solid #000; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; padding:2px 4px; }
        table.itens { width:100%; border-collapse:collapse; margin-top:6px; }
        .itens thead th { border:1px solid #000; padding:6px; font-size:11px; text-align:center; }
        .itens tbody td { border:1px solid #000; padding:4px; height:24px; }
        .col-q { width:60px; text-align:center; } .col-vu, .col-t { width:120px; text-align:right; }
        .wm { position:absolute; left:0; right:0; margin:auto; top:92mm; width:75%; text-align:center; font-size:36px; font-weight:700; color:#000; opacity:.06; pointer-events:none; user-select:none; }
        .wm small { display:block; font-weight:400; font-size:16px; letter-spacing:.8px; }
        .foot { display:grid; grid-template-columns: 1fr 220px; gap:10px; align-items:end; margin-top:8px; }
        .valid { border:1px solid #000; padding:6px; min-height:44px; display:grid; align-content:center; font-size:10px; color:#333; }
        .total { border:2px solid #000; padding:8px; text-align:right; font-size:18px; font-weight:800; }
        .sign { display:grid; grid-template-columns: 1fr 240px; gap:20px; align-items:end; margin-top:22mm; }
        .uline { border-top:1px solid #000; height:0; margin-top:24px; } .siglbl { font-size:10px; text-align:center; }
      `}</style>

      {/* === Header padrão + ações === */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orçamento #{quote.quoteNumber}</h1>
          <p className="text-sm text-gray-500">Visualize, imprima ou converta em venda</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <PrinterIcon className="h-5 w-5" /> Imprimir
          </button>
          {(quote.status || "").toLowerCase() !== "converted" && (
            <button onClick={handleConvertToSale} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black">
              <ShoppingCartIcon className="h-5 w-5" /> Converter em Venda
            </button>
          )}
        </div>
      </div>

      {/* === Card resumo + itens === */}
      <div className="overflow-hidden rounded-lg bg-white shadow no-print">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Resumo</h3>
            <p className="text-sm text-gray-500">Cliente, data e status</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(quote.total)}</p>
            <div className="mt-1"><StatusBadge status={(quote.status || "").toLowerCase()} /></div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Cliente</p>
            <p className="text-sm font-medium text-gray-900">{quote.customerName || "Cliente não informado"}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">Data</p>
            <p className="text-sm font-medium text-gray-900">{new Date(quote.date).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        <div className="border-t px-6 py-6">
          <h3 className="mb-4 text-sm font-medium text-gray-700">Itens</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Qtd</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço Unit.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {quote.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.brand}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {quote.notes && (
          <div className="border-t px-6 py-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Observações</h3>
            <p className="text-sm text-gray-900">{quote.notes}</p>
          </div>
        )}
      </div>

      {/* === Layout exclusivo de impressão === */}
      <div id="fg-print">
        <div className="sheet">
          <div className="empresa">
            <div className="hdr">
              <div className="brand">
                <div className="logo">LOGO</div>
                <div>
                  <h1>FG FILMS</h1>
                  <div className="sub">acessórios automotivos</div>
                </div>
              </div>
              <div className="orc">
                <div className="t">ORÇAMENTO</div>
                <div className="n">{quote.quoteNumber}</div>
              </div>
            </div>
            <div className="row">
              <div style={{ fontWeight: 700 }}>CNPJ: 14.864.222/0001-67</div>
            </div>
            <div className="svc">PELÍCULA · SUPER LED · SOM · AMPLIFICADORES · ALARMES · TRAVAS · MÓDULOS</div>
            <div className="mt4">Tel.: (91) 98241-6768 · <span>fer_maia2005@hotmail.com</span></div>
            <div className="mt4 addr">RUA QUINZE DE AGOSTO, 552, CRUZEIRO / ICOARACI</div>
          </div>

          <div className="dados">
            <div className="dln">
              <div className="field"><label>Nome</label><div className="line">{quote.customerName || ""}</div></div>
              <div className="field"><label>Tel.</label><div className="line">{quote.customerPhone || ""}</div></div>
              <div className="field"><label></label><div></div></div>
              <div className="field"><label></label><div></div></div>
            </div>
            <div className="dln dln-2">
              <div className="field"><label>End.</label><div className="line">{quote.address || ""}</div></div>
              <div className="field"><label>Cidade</label><div className="line">{quote.city || ""}</div></div>
              <div className="field"><label>UF</label><div className="line">{quote.uf || ""}</div></div>
            </div>
            <div className="dln dln-3">
              <div className="field"><label>Bairro</label><div className="line">{quote.neighborhood || ""}</div></div>
              <div className="field"><label>CPF/CNPJ</label><div className="line">{quote.cpfCnpj || ""}</div></div>
              <div className="field"><label>INSC. EST.</label><div className="line">{quote.stateRegistration || ""}</div></div>
            </div>
            <div className="dln dln-4">
              <div className="field"><label>COND. PAGAMENTO</label><div className="line">{quote.paymentTerms || ""}</div></div>
              <div className="field"><label>PRAZO ENTREGA</label><div className="line">{quote.deliveryTime || ""}</div></div>
              <div className="field"><label>VALIDADE</label><div className="line">{quote.validityDate || ""}</div></div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div className="wm">FG FILMS<small>acessórios automotivos</small></div>
            <table className="itens">
              <thead>
                <tr>
                  <th className="col-q">Quant.</th>
                  <th>Discriminação</th>
                  <th className="col-vu">V. Unit.</th>
                  <th className="col-t">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, i) => (
                  <tr key={i}>
                    <td className="col-q">{item.quantity}</td>
                    <td>{`${item.name}${item.brand ? " - " + item.brand : ""}`}</td>
                    <td className="col-vu">{formatCurrency(item.price)}</td>
                    <td className="col-t">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(BLANK_ROWS - quote.items.length, 0) }).map((_, i) => (
                  <tr key={`blank-${i}`}><td></td><td></td><td></td><td></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {quote.notes ? (
            <div className="b1 p6 mt6">
              <div className="small tt mb4">Observações</div>
              <div>{quote.notes}</div>
            </div>
          ) : null}

          <div className="foot">
            <div className="valid">
              Apresente este orçamento até a data de validade. Após, será realizado um novo orçamento.
              <div className="mt4 xsmall">Data: {new Date(quote.date).toLocaleDateString("pt-BR")}</div>
              <div className="xsmall">Cliente: {quote.customerName || "Não informado"}</div>
            </div>
            <div className="total">TOTAL R$ {formatCurrency(quote.total).replace("R$ ", "")}</div>
          </div>

          <div className="sign">
            <div>
              <div className="uline"></div>
              <div className="siglbl">DATA</div>
            </div>
            <div>
              <div className="uline"></div>
              <div className="siglbl">ASSINATURA ATENDENTE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuote;

// // // // // // "use client"

// // // // // // import { useState, useEffect } from "react"
// // // // // // import { toast } from "react-toastify"
// // // // // // import {
// // // // // //   MagnifyingGlassIcon,
// // // // // //   ShoppingCartIcon,
// // // // // //   PlusIcon,
// // // // // //   MinusIcon,
// // // // // //   TrashIcon,
// // // // // //   XMarkIcon,
// // // // // //   UserPlusIcon,
// // // // // //   DocumentArrowDownIcon,
// // // // // // } from "@heroicons/react/24/outline"
// // // // // // import PageHeader from "../components/PageHeader"
// // // // // // import Card from "../components/Card"
// // // // // // import { formatCurrency } from "../utils/format"
// // // // // // import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api"

// // // // // // const PDV = () => {
// // // // // //   const [products, setProducts] = useState([])
// // // // // //   const [customers, setCustomers] = useState([])
// // // // // //   const [filteredProducts, setFilteredProducts] = useState([])
// // // // // //   const [isLoading, setIsLoading] = useState(true)
// // // // // //   const [searchTerm, setSearchTerm] = useState("")
// // // // // //   const [cart, setCart] = useState([])
// // // // // //   const [isCartOpen, setIsCartOpen] = useState(false)
// // // // // //   const [selectedCustomer, setSelectedCustomer] = useState("")
// // // // // //   const [quickCustomerName, setQuickCustomerName] = useState("")
// // // // // //   const [showQuickCustomer, setShowQuickCustomer] = useState(false)
// // // // // //   const [paymentMethods, setPaymentMethods] = useState([])
// // // // // //   const [showPaymentModal, setShowPaymentModal] = useState(false)

// // // // // //   // Payment machines
// // // // // //   const cardMachines = [
// // // // // //     { id: "machine_a", name: "Máquina A" },
// // // // // //     { id: "machine_b", name: "Máquina B" },
// // // // // //     { id: "machine_c", name: "Máquina C" },
// // // // // //   ]

// // // // // //   useEffect(() => {
// // // // // //     loadData()
// // // // // //   }, [])

// // // // // //   useEffect(() => {
// // // // // //     if (searchTerm) {
// // // // // //       const filtered = products.filter(
// // // // // //         (product) =>
// // // // // //           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // //           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // // //           product.code?.toLowerCase().includes(searchTerm.toLowerCase()),
// // // // // //       )
// // // // // //       setFilteredProducts(filtered)
// // // // // //     } else {
// // // // // //       setFilteredProducts(products.filter((product) => product.stock > 0))
// // // // // //     }
// // // // // //   }, [searchTerm, products])

// // // // // //   const loadData = async () => {
// // // // // //     try {
// // // // // //       setIsLoading(true)
// // // // // //       const [productsData, customersData] = await Promise.all([fetchProducts(), fetchCustomers()])
// // // // // //       const availableProducts = productsData.filter((product) => product.stock > 0)
// // // // // //       setProducts(productsData)
// // // // // //       setFilteredProducts(availableProducts)
// // // // // //       setCustomers(customersData)
// // // // // //     } catch (error) {
// // // // // //       console.error("Error loading data:", error)
// // // // // //       toast.error("Erro ao carregar dados")
// // // // // //     } finally {
// // // // // //       setIsLoading(false)
// // // // // //     }
// // // // // //   }

// // // // // //   const addToCart = (product) => {
// // // // // //     const existingItem = cart.find((item) => item.id === product.id)

// // // // // //     if (existingItem) {
// // // // // //       if (existingItem.quantity >= product.stock) {
// // // // // //         toast.warning(`Estoque máximo atingido para ${product.name}`)
// // // // // //         return
// // // // // //       }

// // // // // //       setCart(
// // // // // //         cart.map((item) =>
// // // // // //           item.id === product.id
// // // // // //             ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
// // // // // //             : item,
// // // // // //         ),
// // // // // //       )
// // // // // //     } else {
// // // // // //       setCart([
// // // // // //         ...cart,
// // // // // //         {
// // // // // //           id: product.id,
// // // // // //           name: product.name,
// // // // // //           brand: product.brand,
// // // // // //           price: product.price,
// // // // // //           quantity: 1,
// // // // // //           stock: product.stock,
// // // // // //           total: product.price,
// // // // // //         },
// // // // // //       ])
// // // // // //     }

// // // // // //     setIsCartOpen(true)
// // // // // //   }

// // // // // //   const removeFromCart = (productId) => {
// // // // // //     setCart(cart.filter((item) => item.id !== productId))
// // // // // //   }

// // // // // //   const updateQuantity = (productId, newQuantity) => {
// // // // // //     if (newQuantity <= 0) return

// // // // // //     const product = cart.find((item) => item.id === productId)
// // // // // //     if (newQuantity > product.stock) {
// // // // // //       toast.warning(`Estoque máximo atingido para ${product.name}`)
// // // // // //       return
// // // // // //     }

// // // // // //     setCart(
// // // // // //       cart.map((item) =>
// // // // // //         item.id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
// // // // // //       ),
// // // // // //     )
// // // // // //   }

// // // // // //   const getCartTotal = () => {
// // // // // //     return cart.reduce((sum, item) => sum + item.total, 0)
// // // // // //   }

// // // // // //   const addPaymentMethod = () => {
// // // // // //     const remaining = getCartTotal() - paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
// // // // // //     if (remaining <= 0) {
// // // // // //       toast.warning("Valor total já foi coberto pelos métodos de pagamento")
// // // // // //       return
// // // // // //     }

// // // // // //     setPaymentMethods([
// // // // // //       ...paymentMethods,
// // // // // //       {
// // // // // //         id: Date.now(),
// // // // // //         method: "Dinheiro",
// // // // // //         amount: remaining,
// // // // // //         machine: "",
// // // // // //       },
// // // // // //     ])
// // // // // //   }

// // // // // //   const updatePaymentMethod = (id, field, value) => {
// // // // // //     setPaymentMethods(
// // // // // //       paymentMethods.map((pm) =>
// // // // // //         pm.id === id
// // // // // //           ? {
// // // // // //               ...pm,
// // // // // //               [field]: field === "amount" ? Number(value) || 0 : value,
// // // // // //               ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
// // // // // //                 ? { machine: "" }
// // // // // //                 : {}),
// // // // // //             }
// // // // // //           : pm,
// // // // // //       ),
// // // // // //     )
// // // // // //   }

// // // // // //   const removePaymentMethod = (id) => {
// // // // // //     setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
// // // // // //   }

// // // // // //   const getTotalPayments = () => {
// // // // // //     return paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
// // // // // //   }

// // // // // //   const handleQuickCustomerAdd = async () => {
// // // // // //     if (!quickCustomerName.trim()) {
// // // // // //       toast.error("Digite o nome do cliente")
// // // // // //       return
// // // // // //     }

// // // // // //     try {
// // // // // //       const newCustomer = await createCustomer({ name: quickCustomerName.trim() })
// // // // // //       setCustomers([...customers, newCustomer])
// // // // // //       setSelectedCustomer(newCustomer.id)
// // // // // //       setQuickCustomerName("")
// // // // // //       setShowQuickCustomer(false)
// // // // // //       toast.success("Cliente adicionado com sucesso")
// // // // // //     } catch (error) {
// // // // // //       console.error("Error creating customer:", error)
// // // // // //       toast.error("Erro ao adicionar cliente")
// // // // // //     }
// // // // // //   }

// // // // // //   const handleFinalizeSale = async () => {
// // // // // //     if (cart.length === 0) {
// // // // // //       toast.error("Adicione produtos ao carrinho para finalizar a venda")
// // // // // //       return
// // // // // //     }

// // // // // //     if (paymentMethods.length === 0) {
// // // // // //       toast.error("Adicione pelo menos um método de pagamento")
// // // // // //       return
// // // // // //     }

// // // // // //     const totalPayments = getTotalPayments()
// // // // // //     const cartTotal = getCartTotal()

// // // // // //     if (Math.abs(totalPayments - cartTotal) > 0.01) {
// // // // // //       toast.error("O valor total dos pagamentos deve ser igual ao valor da venda")
// // // // // //       return
// // // // // //     }

// // // // // //     // Validate card payments have machines selected
// // // // // //     const cardPayments = paymentMethods.filter(
// // // // // //       (pm) => pm.method === "Cartão de Crédito" || pm.method === "Cartão de Débito",
// // // // // //     )
// // // // // //     if (cardPayments.some((pm) => !pm.machine)) {
// // // // // //       toast.error("Selecione a máquina para todos os pagamentos com cartão")
// // // // // //       return
// // // // // //     }

// // // // // //     try {
// // // // // //       const customerName = selectedCustomer
// // // // // //         ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
// // // // // //         : "Cliente não identificado"

// // // // // //       // Create a sale for each product in the cart
// // // // // //       for (const item of cart) {
// // // // // //         const saleData = {
// // // // // //           productId: item.id,
// // // // // //           productName: item.name,
// // // // // //           quantity: item.quantity,
// // // // // //           unitPrice: item.price,
// // // // // //           total: item.total,
// // // // // //           customerId: selectedCustomer || null,
// // // // // //           customerName: customerName,
// // // // // //           paymentMethods: paymentMethods,
// // // // // //           date: new Date().toISOString(),
// // // // // //         }

// // // // // //         await createSale(saleData)
// // // // // //       }

// // // // // //       toast.success("Venda finalizada com sucesso!")

// // // // // //       // Reset form
// // // // // //       setCart([])
// // // // // //       setSelectedCustomer("")
// // // // // //       setPaymentMethods([])
// // // // // //       setIsCartOpen(false)
// // // // // //       setShowPaymentModal(false)

// // // // // //       // Reload products to get updated stock
// // // // // //       loadData()
// // // // // //     } catch (error) {
// // // // // //       console.error("Error finalizing sale:", error)
// // // // // //       toast.error("Erro ao finalizar venda")
// // // // // //     }
// // // // // //   }

// // // // // //   const proceedToPayment = () => {
// // // // // //     if (cart.length === 0) {
// // // // // //       toast.error("Adicione produtos ao carrinho")
// // // // // //       return
// // // // // //     }

// // // // // //     // Initialize with one payment method covering the full amount
// // // // // //     if (paymentMethods.length === 0) {
// // // // // //       setPaymentMethods([
// // // // // //         {
// // // // // //           id: Date.now(),
// // // // // //           method: "Dinheiro",
// // // // // //           amount: getCartTotal(),
// // // // // //           machine: "",
// // // // // //         },
// // // // // //       ])
// // // // // //     }

// // // // // //     setShowPaymentModal(true)
// // // // // //   }

// // // // // //   const generateReceipt = () => {
// // // // // //     if (cart.length === 0) {
// // // // // //       toast.error("Adicione produtos ao carrinho para gerar recibo")
// // // // // //       return
// // // // // //     }

// // // // // //     const customerName = selectedCustomer
// // // // // //       ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
// // // // // //       : "Cliente não identificado"

// // // // // //     // Create receipt data
// // // // // //     const receiptData = {
// // // // // //       saleNumber: Date.now(),
// // // // // //       date: new Date(),
// // // // // //       customer: customerName,
// // // // // //       items: cart,
// // // // // //       paymentMethods: paymentMethods,
// // // // // //       total: getCartTotal(),
// // // // // //     }

// // // // // //     // Generate and download receipt
// // // // // //     generateReceiptPDF(receiptData)
// // // // // //   }

// // // // // //   const generateReceiptPDF = (data) => {
// // // // // //     // Create a simple HTML receipt for printing
// // // // // //     const receiptHTML = `
// // // // // //       <!DOCTYPE html>
// // // // // //       <html>
// // // // // //       <head>
// // // // // //         <title>Recibo - AutoParts</title>
// // // // // //         <style>
// // // // // //           body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
// // // // // //           .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
// // // // // //           .info { margin-bottom: 20px; }
// // // // // //           .items { margin-bottom: 20px; }
// // // // // //           .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
// // // // // //           .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; font-size: 18px; }
// // // // // //           .payment { margin-top: 10px; }
// // // // // //           .footer { text-align: center; margin-top: 20px; font-size: 12px; }
// // // // // //         </style>
// // // // // //       </head>
// // // // // //       <body>
// // // // // //         <div class="header">
// // // // // //           <h2>AutoParts</h2>
// // // // // //           <p>Sistema de Gestão</p>
// // // // // //         </div>

// // // // // //         <div class="info">
// // // // // //           <p><strong>Recibo #${data.saleNumber}</strong></p>
// // // // // //           <p>Data: ${data.date.toLocaleString("pt-BR")}</p>
// // // // // //           <p>Cliente: ${data.customer}</p>
// // // // // //         </div>

// // // // // //         <div class="items">
// // // // // //           <h3>Itens:</h3>
// // // // // //           ${data.items
// // // // // //             .map(
// // // // // //               (item) => `
// // // // // //             <div class="item">
// // // // // //               <span>${item.name} (${item.quantity}x)</span>
// // // // // //               <span>${formatCurrency(item.total)}</span>
// // // // // //             </div>
// // // // // //           `,
// // // // // //             )
// // // // // //             .join("")}
// // // // // //         </div>

// // // // // //         <div class="payment">
// // // // // //           <h3>Pagamento:</h3>
// // // // // //           ${data.paymentMethods
// // // // // //             .map(
// // // // // //               (pm) => `
// // // // // //             <div class="item">
// // // // // //               <span>${pm.method}${pm.machine ? ` (${pm.machine})` : ""}</span>
// // // // // //               <span>${formatCurrency(pm.amount)}</span>
// // // // // //             </div>
// // // // // //           `,
// // // // // //             )
// // // // // //             .join("")}
// // // // // //         </div>

// // // // // //         <div class="total">
// // // // // //           <div class="item">
// // // // // //             <span>TOTAL:</span>
// // // // // //             <span>${formatCurrency(data.total)}</span>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         <div class="footer">
// // // // // //           <p>Obrigado pela preferência!</p>
// // // // // //         </div>
// // // // // //       </body>
// // // // // //       </html>
// // // // // //     `

// // // // // //     // Open in new window for printing
// // // // // //     const printWindow = window.open("", "_blank")
// // // // // //     printWindow.document.write(receiptHTML)
// // // // // //     printWindow.document.close()
// // // // // //     printWindow.print()
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="relative">
// // // // // //       <PageHeader title="PDV - Ponto de Venda" />

// // // // // //       <div className="mb-6 flex justify-between items-center">
// // // // // //         <div className="relative w-full max-w-md">
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             placeholder="Buscar produtos por nome, marca ou código..."
// // // // // //             className="input-field pl-10"
// // // // // //             value={searchTerm}
// // // // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // // // //           />
// // // // // //           <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// // // // // //         </div>

// // // // // //         <button
// // // // // //           className="flex items-center ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
// // // // // //           onClick={() => setIsCartOpen(true)}
// // // // // //         >
// // // // // //           <ShoppingCartIcon className="w-5 h-5 mr-2" />
// // // // // //           Carrinho ({cart.length})
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {isLoading ? (
// // // // // //         <div className="text-center py-8">Carregando produtos...</div>
// // // // // //       ) : (
// // // // // //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// // // // // //           {filteredProducts.length > 0 ? (
// // // // // //             filteredProducts.map((product) => (
// // // // // //               <Card key={product.id} className="flex flex-col h-full">
// // // // // //                 <div className="flex-1">
// // // // // //                   <h3 className="font-medium text-lg mb-1">{product.name}</h3>
// // // // // //                   <p className="text-sm text-gray-500 mb-2">
// // // // // //                     {product.brand} • {product.code || "Sem código"}
// // // // // //                   </p>
// // // // // //                   <p className="text-sm mb-1">Modelo: {product.compatibleModel}</p>
// // // // // //                   <div className="flex justify-between items-center mt-4">
// // // // // //                     <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
// // // // // //                     <span className={`text-sm ${product.stock <= 5 ? "text-red-600" : "text-green-600"}`}>
// // // // // //                       Estoque: {product.stock}
// // // // // //                     </span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //                 <button
// // // // // //                   onClick={() => addToCart(product)}
// // // // // //                   className="mt-4 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
// // // // // //                   disabled={product.stock <= 0}
// // // // // //                 >
// // // // // //                   <PlusIcon className="w-5 h-5 mr-1" />
// // // // // //                   Adicionar
// // // // // //                 </button>
// // // // // //               </Card>
// // // // // //             ))
// // // // // //           ) : (
// // // // // //             <div className="col-span-full text-center py-8">
// // // // // //               Nenhum produto encontrado. Verifique o termo de busca ou se há produtos em estoque.
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* Shopping Cart Sidebar */}
// // // // // //       <div
// // // // // //         className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
// // // // // //           isCartOpen ? "translate-x-0" : "translate-x-full"
// // // // // //         }`}
// // // // // //       >
// // // // // //         <div className="flex flex-col h-full">
// // // // // //           <div className="flex justify-between items-center p-4 border-b">
// // // // // //             <h2 className="text-xl font-bold">Carrinho de Compras</h2>
// // // // // //             <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
// // // // // //               <XMarkIcon className="w-6 h-6" />
// // // // // //             </button>
// // // // // //           </div>

// // // // // //           <div className="flex-1 overflow-y-auto p-4">
// // // // // //             {cart.length === 0 ? (
// // // // // //               <div className="text-center py-8 text-gray-500">
// // // // // //                 Carrinho vazio. Adicione produtos para realizar uma venda.
// // // // // //               </div>
// // // // // //             ) : (
// // // // // //               <div className="space-y-4">
// // // // // //                 {cart.map((item) => (
// // // // // //                   <div key={item.id} className="border-b pb-4">
// // // // // //                     <div className="font-medium">{item.name}</div>
// // // // // //                     <div className="text-sm text-gray-500">
// // // // // //                       {item.brand} • {formatCurrency(item.price)}
// // // // // //                     </div>
// // // // // //                     <div className="flex items-center justify-between mt-2">
// // // // // //                       <div className="flex items-center border rounded-md">
// // // // // //                         <button
// // // // // //                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // // // //                           className="px-2 py-1 text-gray-600 hover:bg-gray-100"
// // // // // //                         >
// // // // // //                           <MinusIcon className="w-4 h-4" />
// // // // // //                         </button>
// // // // // //                         <span className="px-3">{item.quantity}</span>
// // // // // //                         <button
// // // // // //                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // // // //                           className="px-2 py-1 text-gray-600 hover:bg-gray-100"
// // // // // //                         >
// // // // // //                           <PlusIcon className="w-4 h-4" />
// // // // // //                         </button>
// // // // // //                       </div>
// // // // // //                       <div className="flex items-center">
// // // // // //                         <span className="font-medium mr-2">{formatCurrency(item.total)}</span>
// // // // // //                         <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
// // // // // //                           <TrashIcon className="w-5 h-5" />
// // // // // //                         </button>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>

// // // // // //           <div className="p-4 border-t">
// // // // // //             {/* Customer Selection */}
// // // // // //             <div className="mb-4">
// // // // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
// // // // // //               <div className="flex space-x-2">
// // // // // //                 <select
// // // // // //                   className="input-field flex-1"
// // // // // //                   value={selectedCustomer}
// // // // // //                   onChange={(e) => setSelectedCustomer(e.target.value)}
// // // // // //                 >
// // // // // //                   <option value="">Selecione um cliente</option>
// // // // // //                   {customers.map((customer) => (
// // // // // //                     <option key={customer.id} value={customer.id}>
// // // // // //                       {customer.name}
// // // // // //                     </option>
// // // // // //                   ))}
// // // // // //                 </select>
// // // // // //                 <button
// // // // // //                   onClick={() => setShowQuickCustomer(true)}
// // // // // //                   className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // // // //                   title="Cadastro rápido"
// // // // // //                 >
// // // // // //                   <UserPlusIcon className="w-5 h-5" />
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>

// // // // // //             {/* Quick Customer Modal */}
// // // // // //             {showQuickCustomer && (
// // // // // //               <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
// // // // // //                 <label className="block text-sm font-medium text-green-700 mb-1">Cadastro Rápido</label>
// // // // // //                 <div className="flex space-x-2">
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     placeholder="Nome do cliente"
// // // // // //                     className="input-field flex-1"
// // // // // //                     value={quickCustomerName}
// // // // // //                     onChange={(e) => setQuickCustomerName(e.target.value)}
// // // // // //                     onKeyPress={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
// // // // // //                   />
// // // // // //                   <button
// // // // // //                     onClick={handleQuickCustomerAdd}
// // // // // //                     className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // // // //                   >
// // // // // //                     Salvar
// // // // // //                   </button>
// // // // // //                   <button
// // // // // //                     onClick={() => {
// // // // // //                       setShowQuickCustomer(false)
// // // // // //                       setQuickCustomerName("")
// // // // // //                     }}
// // // // // //                     className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
// // // // // //                   >
// // // // // //                     Cancelar
// // // // // //                   </button>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             )}

// // // // // //             <div className="flex justify-between items-center text-lg font-bold mb-4">
// // // // // //               <span>Total:</span>
// // // // // //               <span>{formatCurrency(getCartTotal())}</span>
// // // // // //             </div>

// // // // // //             <div className="space-y-2">
// // // // // //               <button
// // // // // //                 onClick={proceedToPayment}
// // // // // //                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // // // // //                 disabled={cart.length === 0}
// // // // // //               >
// // // // // //                 Finalizar Venda
// // // // // //               </button>

// // // // // //               <button
// // // // // //                 onClick={generateReceipt}
// // // // // //                 className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
// // // // // //                 disabled={cart.length === 0}
// // // // // //               >
// // // // // //                 <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
// // // // // //                 Gerar Recibo
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Payment Modal */}
// // // // // //       {showPaymentModal && (
// // // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
// // // // // //           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // // // //             <div className="p-6">
// // // // // //               <div className="flex justify-between items-center mb-6">
// // // // // //                 <h2 className="text-xl font-bold">Métodos de Pagamento</h2>
// // // // // //                 <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-full hover:bg-gray-100">
// // // // // //                   <XMarkIcon className="w-6 h-6" />
// // // // // //                 </button>
// // // // // //               </div>

// // // // // //               <div className="mb-6">
// // // // // //                 <div className="flex justify-between items-center text-lg font-bold mb-4">
// // // // // //                   <span>Total da Venda:</span>
// // // // // //                   <span>{formatCurrency(getCartTotal())}</span>
// // // // // //                 </div>

// // // // // //                 <div className="flex justify-between items-center text-sm text-gray-600">
// // // // // //                   <span>Total Pago:</span>
// // // // // //                   <span>{formatCurrency(getTotalPayments())}</span>
// // // // // //                 </div>

// // // // // //                 <div className="flex justify-between items-center text-sm">
// // // // // //                   <span>Restante:</span>
// // // // // //                   <span className={getTotalPayments() < getCartTotal() ? "text-red-600" : "text-green-600"}>
// // // // // //                     {formatCurrency(getCartTotal() - getTotalPayments())}
// // // // // //                   </span>
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               <div className="space-y-4 mb-6">
// // // // // //                 {paymentMethods.map((payment) => (
// // // // // //                   <div key={payment.id} className="border rounded-lg p-4">
// // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // // // //                       <div>
// // // // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// // // // // //                         <select
// // // // // //                           value={payment.method}
// // // // // //                           onChange={(e) => updatePaymentMethod(payment.id, "method", e.target.value)}
// // // // // //                           className="input-field"
// // // // // //                         >
// // // // // //                           <option value="Dinheiro">Dinheiro</option>
// // // // // //                           <option value="PIX">PIX</option>
// // // // // //                           <option value="Cartão de Crédito">Cartão de Crédito</option>
// // // // // //                           <option value="Cartão de Débito">Cartão de Débito</option>
// // // // // //                           <option value="Transferência">Transferência</option>
// // // // // //                         </select>
// // // // // //                       </div>

// // // // // //                       <div>
// // // // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// // // // // //                         <input
// // // // // //                           type="number"
// // // // // //                           step="0.01"
// // // // // //                           min="0"
// // // // // //                           value={payment.amount}
// // // // // //                           onChange={(e) => updatePaymentMethod(payment.id, "amount", e.target.value)}
// // // // // //                           className="input-field"
// // // // // //                         />
// // // // // //                       </div>

// // // // // //                       {(payment.method === "Cartão de Crédito" || payment.method === "Cartão de Débito") && (
// // // // // //                         <div>
// // // // // //                           <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// // // // // //                           <select
// // // // // //                             value={payment.machine}
// // // // // //                             onChange={(e) => updatePaymentMethod(payment.id, "machine", e.target.value)}
// // // // // //                             className="input-field"
// // // // // //                           >
// // // // // //                             <option value="">Selecione a máquina</option>
// // // // // //                             {cardMachines.map((machine) => (
// // // // // //                               <option key={machine.id} value={machine.name}>
// // // // // //                                 {machine.name}
// // // // // //                               </option>
// // // // // //                             ))}
// // // // // //                           </select>
// // // // // //                         </div>
// // // // // //                       )}
// // // // // //                     </div>

// // // // // //                     <div className="mt-3 flex justify-end">
// // // // // //                       <button
// // // // // //                         onClick={() => removePaymentMethod(payment.id)}
// // // // // //                         className="text-red-600 hover:text-red-800 text-sm"
// // // // // //                       >
// // // // // //                         Remover
// // // // // //                       </button>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>

// // // // // //               <div className="flex justify-between items-center mb-6">
// // // // // //                 <button
// // // // // //                   onClick={addPaymentMethod}
// // // // // //                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // // // //                 >
// // // // // //                   Adicionar Método
// // // // // //                 </button>
// // // // // //               </div>

// // // // // //               <div className="flex space-x-4">
// // // // // //                 <button
// // // // // //                   onClick={() => setShowPaymentModal(false)}
// // // // // //                   className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
// // // // // //                 >
// // // // // //                   Cancelar
// // // // // //                 </button>
// // // // // //                 <button
// // // // // //                   onClick={handleFinalizeSale}
// // // // // //                   className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // // //                   disabled={Math.abs(getTotalPayments() - getCartTotal()) > 0.01 || paymentMethods.length === 0}
// // // // // //                 >
// // // // // //                   Confirmar Venda
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* Overlay when cart is open on mobile */}
// // // // // //       {isCartOpen && (
// // // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={() => setIsCartOpen(false)} />
// // // // // //       )}
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default PDV






// // // // // import { useState, useEffect } from "react"
// // // // // import { toast } from "react-toastify"
// // // // // import {
// // // // //   MagnifyingGlassIcon,
// // // // //   ShoppingCartIcon,
// // // // //   PlusIcon,
// // // // //   MinusIcon,
// // // // //   TrashIcon,
// // // // //   XMarkIcon,
// // // // //   UserPlusIcon,
// // // // //   DocumentArrowDownIcon,
// // // // // } from "@heroicons/react/24/outline"
// // // // // import PageHeader from "../components/PageHeader"
// // // // // import Card from "../components/Card"
// // // // // import { formatCurrency } from "../utils/format"
// // // // // import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api"

// // // // // const PDV = () => {
// // // // //   const [products, setProducts] = useState([])
// // // // //   const [customers, setCustomers] = useState([])
// // // // //   const [filteredProducts, setFilteredProducts] = useState([])
// // // // //   const [isLoading, setIsLoading] = useState(true)
// // // // //   const [searchTerm, setSearchTerm] = useState("")
// // // // //   const [cart, setCart] = useState([])
// // // // //   const [isCartOpen, setIsCartOpen] = useState(false)
// // // // //   const [selectedCustomer, setSelectedCustomer] = useState("")
// // // // //   const [quickCustomerName, setQuickCustomerName] = useState("")
// // // // //   const [showQuickCustomer, setShowQuickCustomer] = useState(false)
// // // // //   const [paymentMethods, setPaymentMethods] = useState([])
// // // // //   const [showPaymentModal, setShowPaymentModal] = useState(false)

// // // // //   // Payment machines
// // // // //   const cardMachines = [
// // // // //     { id: "machine_a", name: "Máquina A" },
// // // // //     { id: "machine_b", name: "Máquina B" },
// // // // //     { id: "machine_c", name: "Máquina C" },
// // // // //   ]

// // // // //   useEffect(() => {
// // // // //     loadData()
// // // // //   }, [])

// // // // //   useEffect(() => {
// // // // //     if (searchTerm) {
// // // // //       const filtered = products.filter(
// // // // //         (product) =>
// // // // //           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //           product.code?.toLowerCase().includes(searchTerm.toLowerCase()),
// // // // //       )
// // // // //       setFilteredProducts(filtered)
// // // // //     } else {
// // // // //       setFilteredProducts(products.filter((product) => product.stock > 0))
// // // // //     }
// // // // //   }, [searchTerm, products])

// // // // //   const loadData = async () => {
// // // // //     try {
// // // // //       setIsLoading(true)
// // // // //       const [productsData, customersData] = await Promise.all([fetchProducts(), fetchCustomers()])
// // // // //       const availableProducts = productsData.filter((product) => product.stock > 0)
// // // // //       setProducts(productsData)
// // // // //       setFilteredProducts(availableProducts)
// // // // //       setCustomers(customersData)
// // // // //     } catch (error) {
// // // // //       console.error("Error loading data:", error)
// // // // //       toast.error("Erro ao carregar dados")
// // // // //     } finally {
// // // // //       setIsLoading(false)
// // // // //     }
// // // // //   }

// // // // //   const addToCart = (product) => {
// // // // //     const existingItem = cart.find((item) => item.id === product.id)

// // // // //     if (existingItem) {
// // // // //       if (existingItem.quantity >= product.stock) {
// // // // //         toast.warning(`Estoque máximo atingido para ${product.name}`)
// // // // //         return
// // // // //       }

// // // // //       setCart(
// // // // //         cart.map((item) =>
// // // // //           item.id === product.id
// // // // //             ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
// // // // //             : item,
// // // // //         ),
// // // // //       )
// // // // //     } else {
// // // // //       setCart([
// // // // //         ...cart,
// // // // //         {
// // // // //           id: product.id,
// // // // //           name: product.name,
// // // // //           brand: product.brand,
// // // // //           price: product.price,
// // // // //           quantity: 1,
// // // // //           stock: product.stock,
// // // // //           total: product.price,
// // // // //         },
// // // // //       ])
// // // // //     }

// // // // //     setIsCartOpen(true)
// // // // //   }

// // // // //   const removeFromCart = (productId) => {
// // // // //     setCart(cart.filter((item) => item.id !== productId))
// // // // //   }

// // // // //   const updateQuantity = (productId, newQuantity) => {
// // // // //     if (newQuantity <= 0) return

// // // // //     const product = cart.find((item) => item.id === productId)
// // // // //     if (newQuantity > product.stock) {
// // // // //       toast.warning(`Estoque máximo atingido para ${product.name}`)
// // // // //       return
// // // // //     }

// // // // //     setCart(
// // // // //       cart.map((item) =>
// // // // //         item.id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
// // // // //       ),
// // // // //     )
// // // // //   }

// // // // //   const getCartTotal = () => {
// // // // //     return cart.reduce((sum, item) => sum + item.total, 0)
// // // // //   }

// // // // //   const addPaymentMethod = () => {
// // // // //     const remaining = getCartTotal() - paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
// // // // //     if (remaining <= 0) {
// // // // //       toast.warning("Valor total já foi coberto pelos métodos de pagamento")
// // // // //       return
// // // // //     }

// // // // //     setPaymentMethods([
// // // // //       ...paymentMethods,
// // // // //       {
// // // // //         id: Date.now(),
// // // // //         method: "Dinheiro",
// // // // //         amount: remaining,
// // // // //         machine: "",
// // // // //       },
// // // // //     ])
// // // // //   }

// // // // //   const updatePaymentMethod = (id, field, value) => {
// // // // //     setPaymentMethods(
// // // // //       paymentMethods.map((pm) =>
// // // // //         pm.id === id
// // // // //           ? {
// // // // //               ...pm,
// // // // //               [field]: field === "amount" ? Number(value) || 0 : value,
// // // // //               ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
// // // // //                 ? { machine: "" }
// // // // //                 : {}),
// // // // //             }
// // // // //           : pm,
// // // // //       ),
// // // // //     )
// // // // //   }

// // // // //   const removePaymentMethod = (id) => {
// // // // //     setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
// // // // //   }

// // // // //   const getTotalPayments = () => {
// // // // //     return paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
// // // // //   }

// // // // //   const handleQuickCustomerAdd = async () => {
// // // // //     if (!quickCustomerName.trim()) {
// // // // //       toast.error("Digite o nome do cliente")
// // // // //       return
// // // // //     }

// // // // //     try {
// // // // //       const newCustomer = await createCustomer({ name: quickCustomerName.trim() })
// // // // //       setCustomers([...customers, newCustomer])
// // // // //       setSelectedCustomer(newCustomer.id)
// // // // //       setQuickCustomerName("")
// // // // //       setShowQuickCustomer(false)
// // // // //       toast.success("Cliente adicionado com sucesso")
// // // // //     } catch (error) {
// // // // //       console.error("Error creating customer:", error)
// // // // //       toast.error("Erro ao adicionar cliente")
// // // // //     }
// // // // //   }

// // // // //   const handleFinalizeSale = async () => {
// // // // //     if (cart.length === 0) {
// // // // //       toast.error("Adicione produtos ao carrinho para finalizar a venda")
// // // // //       return
// // // // //     }

// // // // //     if (paymentMethods.length === 0) {
// // // // //       toast.error("Adicione pelo menos um método de pagamento")
// // // // //       return
// // // // //     }

// // // // //     const totalPayments = getTotalPayments()
// // // // //     const cartTotal = getCartTotal()

// // // // //     if (Math.abs(totalPayments - cartTotal) > 0.01) {
// // // // //       toast.error("O valor total dos pagamentos deve ser igual ao valor da venda")
// // // // //       return
// // // // //     }

// // // // //     // Validate card payments have machines selected
// // // // //     const cardPayments = paymentMethods.filter(
// // // // //       (pm) => pm.method === "Cartão de Crédito" || pm.method === "Cartão de Débito",
// // // // //     )
// // // // //     if (cardPayments.some((pm) => !pm.machine)) {
// // // // //       toast.error("Selecione a máquina para todos os pagamentos com cartão")
// // // // //       return
// // // // //     }

// // // // //     try {
// // // // //       const customerName = selectedCustomer
// // // // //         ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
// // // // //         : "Cliente não identificado"

// // // // //       // Create a sale for each product in the cart
// // // // //       for (const item of cart) {
// // // // //         const saleData = {
// // // // //           productId: item.id,
// // // // //           productName: item.name,
// // // // //           quantity: item.quantity,
// // // // //           unitPrice: item.price,
// // // // //           total: item.total,
// // // // //           customerId: selectedCustomer || null,
// // // // //           customerName: customerName,
// // // // //           paymentMethods: paymentMethods,
// // // // //           date: new Date().toISOString(),
// // // // //         }

// // // // //         await createSale(saleData)
// // // // //       }

// // // // //       toast.success("Venda finalizada com sucesso!")

// // // // //       // Reset form
// // // // //       setCart([])
// // // // //       setSelectedCustomer("")
// // // // //       setPaymentMethods([])
// // // // //       setIsCartOpen(false)
// // // // //       setShowPaymentModal(false)

// // // // //       // Reload products to get updated stock
// // // // //       loadData()
// // // // //     } catch (error) {
// // // // //       console.error("Error finalizing sale:", error)
// // // // //       toast.error("Erro ao finalizar venda")
// // // // //     }
// // // // //   }

// // // // //   const proceedToPayment = () => {
// // // // //     if (cart.length === 0) {
// // // // //       toast.error("Adicione produtos ao carrinho")
// // // // //       return
// // // // //     }

// // // // //     // Initialize with one payment method covering the full amount
// // // // //     if (paymentMethods.length === 0) {
// // // // //       setPaymentMethods([
// // // // //         {
// // // // //           id: Date.now(),
// // // // //           method: "Dinheiro",
// // // // //           amount: getCartTotal(),
// // // // //           machine: "",
// // // // //         },
// // // // //       ])
// // // // //     }

// // // // //     setShowPaymentModal(true)
// // // // //   }

// // // // //   const generateReceipt = () => {
// // // // //     if (cart.length === 0) {
// // // // //       toast.error("Adicione produtos ao carrinho para gerar recibo")
// // // // //       return
// // // // //     }

// // // // //     const customerName = selectedCustomer
// // // // //       ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
// // // // //       : "Cliente não identificado"

// // // // //     // Create receipt data
// // // // //     const receiptData = {
// // // // //       saleNumber: Date.now(),
// // // // //       date: new Date(),
// // // // //       customer: customerName,
// // // // //       items: cart,
// // // // //       paymentMethods: paymentMethods,
// // // // //       total: getCartTotal(),
// // // // //     }

// // // // //     // Generate and download receipt
// // // // //     generateReceiptPDF(receiptData)
// // // // //   }

// // // // //   const generateReceiptPDF = (data) => {
// // // // //     // Create a simple HTML receipt for printing
// // // // //     const receiptHTML = `
// // // // //       <!DOCTYPE html>
// // // // //       <html>
// // // // //       <head>
// // // // //         <title>Recibo - AutoParts</title>
// // // // //         <style>
// // // // //           body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
// // // // //           .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
// // // // //           .info { margin-bottom: 20px; }
// // // // //           .items { margin-bottom: 20px; }
// // // // //           .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
// // // // //           .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; font-size: 18px; }
// // // // //           .payment { margin-top: 10px; }
// // // // //           .footer { text-align: center; margin-top: 20px; font-size: 12px; }
// // // // //         </style>
// // // // //       </head>
// // // // //       <body>
// // // // //         <div class="header">
// // // // //           <h2>AutoParts</h2>
// // // // //           <p>Sistema de Gestão</p>
// // // // //         </div>

// // // // //         <div class="info">
// // // // //           <p><strong>Recibo #${data.saleNumber}</strong></p>
// // // // //           <p>Data: ${data.date.toLocaleString("pt-BR")}</p>
// // // // //           <p>Cliente: ${data.customer}</p>
// // // // //         </div>

// // // // //         <div class="items">
// // // // //           <h3>Itens:</h3>
// // // // //           ${data.items
// // // // //             .map(
// // // // //               (item) => `
// // // // //             <div class="item">
// // // // //               <span>${item.name} (${item.quantity}x)</span>
// // // // //               <span>${formatCurrency(item.total)}</span>
// // // // //             </div>
// // // // //           `,
// // // // //             )
// // // // //             .join("")}
// // // // //         </div>

// // // // //         <div class="payment">
// // // // //           <h3>Pagamento:</h3>
// // // // //           ${data.paymentMethods
// // // // //             .map(
// // // // //               (pm) => `
// // // // //             <div class="item">
// // // // //               <span>${pm.method}${pm.machine ? ` (${pm.machine})` : ""}</span>
// // // // //               <span>${formatCurrency(pm.amount)}</span>
// // // // //             </div>
// // // // //           `,
// // // // //             )
// // // // //             .join("")}
// // // // //         </div>

// // // // //         <div class="total">
// // // // //           <div class="item">
// // // // //             <span>TOTAL:</span>
// // // // //             <span>${formatCurrency(data.total)}</span>
// // // // //           </div>
// // // // //         </div>

// // // // //         <div class="footer">
// // // // //           <p>Obrigado pela preferência!</p>
// // // // //         </div>
// // // // //       </body>
// // // // //       </html>
// // // // //     `

// // // // //     // Open in new window for printing
// // // // //     const printWindow = window.open("", "_blank")
// // // // //     printWindow.document.write(receiptHTML)
// // // // //     printWindow.document.close()
// // // // //     printWindow.print()
// // // // //   }

// // // // //   return (
// // // // //     <div className="relative">
// // // // //       <PageHeader title="PDV - Ponto de Venda" />

// // // // //       <div className="mb-6 flex justify-between items-center">
// // // // //         <div className="relative w-full max-w-md">
// // // // //           <input
// // // // //             type="text"
// // // // //             placeholder="Buscar produtos por nome, marca ou código..."
// // // // //             className="input-field pl-10"
// // // // //             value={searchTerm}
// // // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // // //           />
// // // // //           <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// // // // //         </div>

// // // // //         <button
// // // // //           className="flex items-center ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
// // // // //           onClick={() => setIsCartOpen(true)}
// // // // //         >
// // // // //           <ShoppingCartIcon className="w-5 h-5 mr-2" />
// // // // //           Carrinho ({cart.length})
// // // // //         </button>
// // // // //       </div>

// // // // //       {isLoading ? (
// // // // //         <div className="text-center py-8">Carregando produtos...</div>
// // // // //       ) : (
// // // // //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// // // // //           {filteredProducts.length > 0 ? (
// // // // //             filteredProducts.map((product) => (
// // // // //               <Card key={product.id} className="flex flex-col h-full">
// // // // //                 <div className="flex-1">
// // // // //                   <h3 className="font-medium text-lg mb-1">{product.name}</h3>
// // // // //                   <p className="text-sm text-gray-500 mb-2">
// // // // //                     {product.brand} • {product.code || "Sem código"}
// // // // //                   </p>
// // // // //                   <p className="text-sm mb-1">Modelo: {product.compatibleModel}</p>
// // // // //                   <div className="flex justify-between items-center mt-4">
// // // // //                     <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
// // // // //                     <span className={`text-sm ${product.stock <= 5 ? "text-red-600" : "text-green-600"}`}>
// // // // //                       Estoque: {product.stock}
// // // // //                     </span>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <button
// // // // //                   onClick={() => addToCart(product)}
// // // // //                   className="mt-4 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
// // // // //                   disabled={product.stock <= 0}
// // // // //                 >
// // // // //                   <PlusIcon className="w-5 h-5 mr-1" />
// // // // //                   Adicionar
// // // // //                 </button>
// // // // //               </Card>
// // // // //             ))
// // // // //           ) : (
// // // // //             <div className="col-span-full text-center py-8">
// // // // //               Nenhum produto encontrado. Verifique o termo de busca ou se há produtos em estoque.
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       )}

// // // // //       {/* Shopping Cart Sidebar */}
// // // // //       <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 `}>
// // // // //         <div className="flex flex-col h-full">
// // // // //           <div className="flex justify-between items-center p-4 border-b">
// // // // //             <h2 className="text-xl font-bold">Carrinho de Compras</h2>
// // // // //             {/* <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
// // // // //               <XMarkIcon className="w-6 h-6" />
// // // // //             </button> */}
// // // // //           </div>

// // // // //           <div className="flex-1 overflow-y-auto p-4">
// // // // //             {cart.length === 0 ? (
// // // // //               <div className="text-center py-8 text-gray-500">
// // // // //                 Carrinho vazio. Adicione produtos para realizar uma venda.
// // // // //               </div>
// // // // //             ) : (
// // // // //               <div className="space-y-4">
// // // // //                 {cart.map((item) => (
// // // // //                   <div key={item.id} className="border-b pb-4">
// // // // //                     <div className="font-medium">{item.name}</div>
// // // // //                     <div className="text-sm text-gray-500">
// // // // //                       {item.brand} • {formatCurrency(item.price)}
// // // // //                     </div>
// // // // //                     <div className="flex items-center justify-between mt-2">
// // // // //                       <div className="flex items-center border rounded-md">
// // // // //                         <button
// // // // //                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // // //                           className="px-2 py-1 text-gray-600 hover:bg-gray-100"
// // // // //                         >
// // // // //                           <MinusIcon className="w-4 h-4" />
// // // // //                         </button>
// // // // //                         <span className="px-3">{item.quantity}</span>
// // // // //                         <button
// // // // //                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // // //                           className="px-2 py-1 text-gray-600 hover:bg-gray-100"
// // // // //                         >
// // // // //                           <PlusIcon className="w-4 h-4" />
// // // // //                         </button>
// // // // //                       </div>
// // // // //                       <div className="flex items-center">
// // // // //                         <span className="font-medium mr-2">{formatCurrency(item.total)}</span>
// // // // //                         <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
// // // // //                           <TrashIcon className="w-5 h-5" />
// // // // //                         </button>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           <div className="p-4 border-t">
// // // // //             {/* Customer Selection */}
// // // // //             <div className="mb-4">
// // // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
// // // // //               <div className="flex space-x-2">
// // // // //                 <select
// // // // //                   className="input-field flex-1"
// // // // //                   value={selectedCustomer}
// // // // //                   onChange={(e) => setSelectedCustomer(e.target.value)}
// // // // //                 >
// // // // //                   <option value="">Selecione um cliente</option>
// // // // //                   {customers.map((customer) => (
// // // // //                     <option key={customer.id} value={customer.id}>
// // // // //                       {customer.name}
// // // // //                     </option>
// // // // //                   ))}
// // // // //                 </select>
// // // // //                 <button
// // // // //                   onClick={() => setShowQuickCustomer(true)}
// // // // //                   className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // // //                   title="Cadastro rápido"
// // // // //                 >
// // // // //                   <UserPlusIcon className="w-5 h-5" />
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Quick Customer Modal */}
// // // // //             {showQuickCustomer && (
// // // // //               <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
// // // // //                 <label className="block text-sm font-medium text-green-700 mb-1">Cadastro Rápido</label>
// // // // //                 <div className="flex space-x-2">
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     placeholder="Nome do cliente"
// // // // //                     className="input-field flex-1"
// // // // //                     value={quickCustomerName}
// // // // //                     onChange={(e) => setQuickCustomerName(e.target.value)}
// // // // //                     onKeyPress={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
// // // // //                   />
// // // // //                   <button
// // // // //                     onClick={handleQuickCustomerAdd}
// // // // //                     className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // // //                   >
// // // // //                     Salvar
// // // // //                   </button>
// // // // //                   <button
// // // // //                     onClick={() => {
// // // // //                       setShowQuickCustomer(false)
// // // // //                       setQuickCustomerName("")
// // // // //                     }}
// // // // //                     className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
// // // // //                   >
// // // // //                     Cancelar
// // // // //                   </button>
// // // // //                 </div>
// // // // //               </div>
// // // // //             )}

// // // // //             <div className="flex justify-between items-center text-lg font-bold mb-4">
// // // // //               <span>Total:</span>
// // // // //               <span>{formatCurrency(getCartTotal())}</span>
// // // // //             </div>

// // // // //             <div className="space-y-2">
// // // // //               <button
// // // // //                 onClick={proceedToPayment}
// // // // //                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // // // //                 disabled={cart.length === 0}
// // // // //               >
// // // // //                 Finalizar Venda
// // // // //               </button>

// // // // //               <button
// // // // //                 onClick={generateReceipt}
// // // // //                 className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
// // // // //                 disabled={cart.length === 0}
// // // // //               >
// // // // //                 <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
// // // // //                 Gerar Recibo
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Payment Modal */}
// // // // //       {showPaymentModal && (
// // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
// // // // //           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // // //             <div className="p-6">
// // // // //               <div className="flex justify-between items-center mb-6">
// // // // //                 <h2 className="text-xl font-bold">Métodos de Pagamento</h2>
// // // // //                 <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-full hover:bg-gray-100">
// // // // //                   <XMarkIcon className="w-6 h-6" />
// // // // //                 </button>
// // // // //               </div>

// // // // //               <div className="mb-6">
// // // // //                 <div className="flex justify-between items-center text-lg font-bold mb-4">
// // // // //                   <span>Total da Venda:</span>
// // // // //                   <span>{formatCurrency(getCartTotal())}</span>
// // // // //                 </div>

// // // // //                 <div className="flex justify-between items-center text-sm text-gray-600">
// // // // //                   <span>Total Pago:</span>
// // // // //                   <span>{formatCurrency(getTotalPayments())}</span>
// // // // //                 </div>

// // // // //                 <div className="flex justify-between items-center text-sm">
// // // // //                   <span>Restante:</span>
// // // // //                   <span className={getTotalPayments() < getCartTotal() ? "text-red-600" : "text-green-600"}>
// // // // //                     {formatCurrency(getCartTotal() - getTotalPayments())}
// // // // //                   </span>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="space-y-4 mb-6">
// // // // //                 {paymentMethods.map((payment) => (
// // // // //                   <div key={payment.id} className="border rounded-lg p-4">
// // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // // //                       <div>
// // // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// // // // //                         <select
// // // // //                           value={payment.method}
// // // // //                           onChange={(e) => updatePaymentMethod(payment.id, "method", e.target.value)}
// // // // //                           className="input-field"
// // // // //                         >
// // // // //                           <option value="Dinheiro">Dinheiro</option>
// // // // //                           <option value="PIX">PIX</option>
// // // // //                           <option value="Cartão de Crédito">Cartão de Crédito</option>
// // // // //                           <option value="Cartão de Débito">Cartão de Débito</option>
// // // // //                           <option value="Transferência">Transferência</option>
// // // // //                         </select>
// // // // //                       </div>

// // // // //                       <div>
// // // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// // // // //                         <input
// // // // //                           type="number"
// // // // //                           step="0.01"
// // // // //                           min="0"
// // // // //                           value={payment.amount}
// // // // //                           onChange={(e) => updatePaymentMethod(payment.id, "amount", e.target.value)}
// // // // //                           className="input-field"
// // // // //                         />
// // // // //                       </div>

// // // // //                       {(payment.method === "Cartão de Crédito" || payment.method === "Cartão de Débito") && (
// // // // //                         <div>
// // // // //                           <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// // // // //                           <select
// // // // //                             value={payment.machine}
// // // // //                             onChange={(e) => updatePaymentMethod(payment.id, "machine", e.target.value)}
// // // // //                             className="input-field"
// // // // //                           >
// // // // //                             <option value="">Selecione a máquina</option>
// // // // //                             {cardMachines.map((machine) => (
// // // // //                               <option key={machine.id} value={machine.name}>
// // // // //                                 {machine.name}
// // // // //                               </option>
// // // // //                             ))}
// // // // //                           </select>
// // // // //                         </div>
// // // // //                       )}
// // // // //                     </div>

// // // // //                     <div className="mt-3 flex justify-end">
// // // // //                       <button
// // // // //                         onClick={() => removePaymentMethod(payment.id)}
// // // // //                         className="text-red-600 hover:text-red-800 text-sm"
// // // // //                       >
// // // // //                         Remover
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>

// // // // //               <div className="flex justify-between items-center mb-6">
// // // // //                 <button
// // // // //                   onClick={addPaymentMethod}
// // // // //                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // // //                 >
// // // // //                   Adicionar Método
// // // // //                 </button>
// // // // //               </div>

// // // // //               <div className="flex space-x-4">
// // // // //                 <button
// // // // //                   onClick={() => setShowPaymentModal(false)}
// // // // //                   className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
// // // // //                 >
// // // // //                   Cancelar
// // // // //                 </button>
// // // // //                 <button
// // // // //                   onClick={handleFinalizeSale}
// // // // //                   className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // // //                   disabled={Math.abs(getTotalPayments() - getCartTotal()) > 0.01 || paymentMethods.length === 0}
// // // // //                 >
// // // // //                   Confirmar Venda
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}


// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default PDV



// // // // import { useState, useEffect } from "react"
// // // // import { toast } from "react-toastify"
// // // // import {
// // // //   MagnifyingGlassIcon,
// // // //   ShoppingCartIcon,
// // // //   PlusIcon,
// // // //   MinusIcon,
// // // //   TrashIcon,
// // // //   XMarkIcon,
// // // //   UserPlusIcon,
// // // //   DocumentArrowDownIcon,
// // // // } from "@heroicons/react/24/outline"
// // // // import PageHeader from "../components/PageHeader"
// // // // import Card from "../components/Card"
// // // // import { formatCurrency } from "../utils/format"
// // // // import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api"

// // // // const PDV = () => {
// // // //   const [products, setProducts] = useState([])
// // // //   const [customers, setCustomers] = useState([])
// // // //   const [filteredProducts, setFilteredProducts] = useState([])
// // // //   const [isLoading, setIsLoading] = useState(true)
// // // //   const [searchTerm, setSearchTerm] = useState("")
// // // //   const [cart, setCart] = useState([])
// // // //   const [isCartOpen, setIsCartOpen] = useState(false)
// // // //   const [selectedCustomer, setSelectedCustomer] = useState("")
// // // //   const [quickCustomerName, setQuickCustomerName] = useState("")
// // // //   const [showQuickCustomer, setShowQuickCustomer] = useState(false)
// // // //   const [paymentMethods, setPaymentMethods] = useState([])
// // // //   const [showPaymentModal, setShowPaymentModal] = useState(false)

// // // //   // Payment machines
// // // //   const cardMachines = [
// // // //     { id: "machine_a", name: "Máquina A" },
// // // //     { id: "machine_b", name: "Máquina B" },
// // // //     { id: "machine_c", name: "Máquina C" },
// // // //   ]

// // // //   useEffect(() => {
// // // //     loadData()
// // // //   }, [])

// // // //   useEffect(() => {
// // // //     if (searchTerm) {
// // // //       const filtered = products.filter(
// // // //         (product) =>
// // // //           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //           product.code?.toLowerCase().includes(searchTerm.toLowerCase()),
// // // //       )
// // // //       setFilteredProducts(filtered)
// // // //     } else {
// // // //       setFilteredProducts(products.filter((product) => product.stock > 0))
// // // //     }
// // // //   }, [searchTerm, products])

// // // //   const loadData = async () => {
// // // //     try {
// // // //       setIsLoading(true)
// // // //       const [productsData, customersData] = await Promise.all([fetchProducts(), fetchCustomers()])
// // // //       const availableProducts = productsData.filter((product) => product.stock > 0)
// // // //       setProducts(productsData)
// // // //       setFilteredProducts(availableProducts)
// // // //       setCustomers(customersData)
// // // //     } catch (error) {
// // // //       console.error("Error loading data:", error)
// // // //       toast.error("Erro ao carregar dados")
// // // //     } finally {
// // // //       setIsLoading(false)
// // // //     }
// // // //   }

// // // //   const addToCart = (product) => {
// // // //     const existingItem = cart.find((item) => item.id === product.id)

// // // //     if (existingItem) {
// // // //       if (existingItem.quantity >= product.stock) {
// // // //         toast.warning(`Estoque máximo atingido para ${product.name}`)
// // // //         return
// // // //       }

// // // //       setCart(
// // // //         cart.map((item) =>
// // // //           item.id === product.id
// // // //             ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
// // // //             : item,
// // // //         ),
// // // //       )
// // // //     } else {
// // // //       setCart([
// // // //         ...cart,
// // // //         {
// // // //           id: product.id,
// // // //           name: product.name,
// // // //           brand: product.brand,
// // // //           price: product.price,
// // // //           quantity: 1,
// // // //           stock: product.stock,
// // // //           total: product.price,
// // // //         },
// // // //       ])
// // // //     }

// // // //     setIsCartOpen(true)
// // // //   }

// // // //   const removeFromCart = (productId) => {
// // // //     setCart(cart.filter((item) => item.id !== productId))
// // // //   }

// // // //   const updateQuantity = (productId, newQuantity) => {
// // // //     if (newQuantity <= 0) return

// // // //     const product = cart.find((item) => item.id === productId)
// // // //     if (newQuantity > product.stock) {
// // // //       toast.warning(`Estoque máximo atingido para ${product.name}`)
// // // //       return
// // // //     }

// // // //     setCart(
// // // //       cart.map((item) =>
// // // //         item.id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
// // // //       ),
// // // //     )
// // // //   }

// // // //   const getCartTotal = () => {
// // // //     return cart.reduce((sum, item) => sum + item.total, 0)
// // // //   }

// // // //   const addPaymentMethod = () => {
// // // //     const remaining = getCartTotal() - paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
// // // //     if (remaining <= 0) {
// // // //       toast.warning("Valor total já foi coberto pelos métodos de pagamento")
// // // //       return
// // // //     }

// // // //     setPaymentMethods([
// // // //       ...paymentMethods,
// // // //       {
// // // //         id: Date.now(),
// // // //         method: "Dinheiro",
// // // //         amount: remaining,
// // // //         machine: "",
// // // //       },
// // // //     ])
// // // //   }

// // // //   const updatePaymentMethod = (id, field, value) => {
// // // //     setPaymentMethods(
// // // //       paymentMethods.map((pm) =>
// // // //         pm.id === id
// // // //           ? {
// // // //               ...pm,
// // // //               [field]: field === "amount" ? Number(value) || 0 : value,
// // // //               ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
// // // //                 ? { machine: "" }
// // // //                 : {}),
// // // //             }
// // // //           : pm,
// // // //       ),
// // // //     )
// // // //   }

// // // //   const removePaymentMethod = (id) => {
// // // //     setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
// // // //   }

// // // //   const getTotalPayments = () => {
// // // //     return paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
// // // //   }

// // // //   const handleQuickCustomerAdd = async () => {
// // // //     if (!quickCustomerName.trim()) {
// // // //       toast.error("Digite o nome do cliente")
// // // //       return
// // // //     }

// // // //     try {
// // // //       const newCustomer = await createCustomer({ name: quickCustomerName.trim() })
// // // //       setCustomers([...customers, newCustomer])
// // // //       setSelectedCustomer(newCustomer.id)
// // // //       setQuickCustomerName("")
// // // //       setShowQuickCustomer(false)
// // // //       toast.success("Cliente adicionado com sucesso")
// // // //     } catch (error) {
// // // //       console.error("Error creating customer:", error)
// // // //       toast.error("Erro ao adicionar cliente")
// // // //     }
// // // //   }

// // // //   const handleFinalizeSale = async () => {
// // // //     if (cart.length === 0) {
// // // //       toast.error("Adicione produtos ao carrinho para finalizar a venda")
// // // //       return
// // // //     }

// // // //     if (paymentMethods.length === 0) {
// // // //       toast.error("Adicione pelo menos um método de pagamento")
// // // //       return
// // // //     }

// // // //     const totalPayments = getTotalPayments()
// // // //     const cartTotal = getCartTotal()

// // // //     if (Math.abs(totalPayments - cartTotal) > 0.01) {
// // // //       toast.error("O valor total dos pagamentos deve ser igual ao valor da venda")
// // // //       return
// // // //     }

// // // //     const cardPayments = paymentMethods.filter(
// // // //       (pm) => pm.method === "Cartão de Crédito" || pm.method === "Cartão de Débito",
// // // //     )
// // // //     if (cardPayments.some((pm) => !pm.machine)) {
// // // //       toast.error("Selecione a máquina para todos os pagamentos com cartão")
// // // //       return
// // // //     }

// // // //     try {
// // // //       const customerName = selectedCustomer
// // // //         ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
// // // //         : "Cliente não identificado"

// // // //       for (const item of cart) {
// // // //         const saleData = {
// // // //           productId: item.id,
// // // //           productName: item.name,
// // // //           quantity: item.quantity,
// // // //           unitPrice: item.price,
// // // //           total: item.total,
// // // //           customerId: selectedCustomer || null,
// // // //           customerName: customerName,
// // // //           paymentMethods: paymentMethods,
// // // //           date: new Date().toISOString(),
// // // //         }

// // // //         await createSale(saleData)
// // // //       }

// // // //       toast.success("Venda finalizada com sucesso!")

// // // //       setCart([])
// // // //       setSelectedCustomer("")
// // // //       setPaymentMethods([])
// // // //       setIsCartOpen(false)
// // // //       setShowPaymentModal(false)
// // // //       loadData()
// // // //     } catch (error) {
// // // //       console.error("Error finalizing sale:", error)
// // // //       toast.error("Erro ao finalizar venda")
// // // //     }
// // // //   }

// // // //   const proceedToPayment = () => {
// // // //     if (cart.length === 0) {
// // // //       toast.error("Adicione produtos ao carrinho")
// // // //       return
// // // //     }

// // // //     if (paymentMethods.length === 0) {
// // // //       setPaymentMethods([
// // // //         {
// // // //           id: Date.now(),
// // // //           method: "Dinheiro",
// // // //           amount: getCartTotal(),
// // // //           machine: "",
// // // //         },
// // // //       ])
// // // //     }

// // // //     setShowPaymentModal(true)
// // // //   }

// // // //   const generateReceipt = () => {
// // // //     if (cart.length === 0) {
// // // //       toast.error("Adicione produtos ao carrinho para gerar recibo")
// // // //       return
// // // //     }

// // // //     const customerName = selectedCustomer
// // // //       ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
// // // //       : "Cliente não identificado"

// // // //     const receiptData = {
// // // //       saleNumber: Date.now(),
// // // //       date: new Date(),
// // // //       customer: customerName,
// // // //       items: cart,
// // // //       paymentMethods: paymentMethods,
// // // //       total: getCartTotal(),
// // // //     }

// // // //     generateReceiptPDF(receiptData)
// // // //   }

// // // //   const generateReceiptPDF = (data) => {
// // // //     const receiptHTML = `
// // // //       <!DOCTYPE html>
// // // //       <html>
// // // //       <head>
// // // //         <title>Recibo - AutoParts</title>
// // // //         <style>
// // // //           body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
// // // //           .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
// // // //           .info { margin-bottom: 20px; }
// // // //           .items { margin-bottom: 20px; }
// // // //           .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
// // // //           .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; font-size: 18px; }
// // // //           .payment { margin-top: 10px; }
// // // //           .footer { text-align: center; margin-top: 20px; font-size: 12px; }
// // // //         </style>
// // // //       </head>
// // // //       <body>
// // // //         <div class="header">
// // // //           <h2>AutoParts</h2>
// // // //           <p>Sistema de Gestão</p>
// // // //         </div>
// // // //         <div class="info">
// // // //           <p><strong>Recibo #${data.saleNumber}</strong></p>
// // // //           <p>Data: ${data.date.toLocaleString("pt-BR")}</p>
// // // //           <p>Cliente: ${data.customer}</p>
// // // //         </div>
// // // //         <div class="items">
// // // //           <h3>Itens:</h3>
// // // //           ${data.items
// // // //             .map(
// // // //               (item) => `
// // // //               <div class="item">
// // // //                 <span>${item.name} (${item.quantity}x)</span>
// // // //                 <span>${formatCurrency(item.total)}</span>
// // // //               </div>
// // // //             `,
// // // //             )
// // // //             .join("")}
// // // //         </div>
// // // //         <div class="payment">
// // // //           <h3>Pagamento:</h3>
// // // //           ${data.paymentMethods
// // // //             .map(
// // // //               (pm) => `
// // // //               <div class="item">
// // // //                 <span>${pm.method}${pm.machine ? ` (${pm.machine})` : ""}</span>
// // // //                 <span>${formatCurrency(pm.amount)}</span>
// // // //               </div>
// // // //             `,
// // // //             )
// // // //             .join("")}
// // // //         </div>
// // // //         <div class="total">
// // // //           <div class="item">
// // // //             <span>TOTAL:</span>
// // // //             <span>${formatCurrency(data.total)}</span>
// // // //           </div>
// // // //         </div>
// // // //         <div class="footer">
// // // //           <p>Obrigado pela preferência!</p>
// // // //         </div>
// // // //       </body>
// // // //       </html>
// // // //     `

// // // //     const printWindow = window.open("", "_blank")
// // // //     printWindow.document.write(receiptHTML)
// // // //     printWindow.document.close()
// // // //     printWindow.print()
// // // //   }

// // // //   return (
// // // //     <div className="relative">
// // // //       <PageHeader title="PDV - Ponto de Venda" />

// // // //       {/* Topo */}
// // // //       <div className="mb-4 flex justify-between items-center">
// // // //         <div className="relative w-full max-w-xl">
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Buscar produto (nome, código de barras ou categoria)"
// // // //             className="input-field pl-10"
// // // //             value={searchTerm}
// // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // //           />
// // // //           <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// // // //         </div>

// // // //         {/* abre o drawer apenas no mobile/tablet */}
// // // //         <button
// // // //           className="flex items-center ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors lg:hidden"
// // // //           onClick={() => setIsCartOpen(true)}
// // // //         >
// // // //           <ShoppingCartIcon className="w-5 h-5 mr-2" />
// // // //           Carrinho ({cart.length})
// // // //         </button>
// // // //       </div>

// // // //       {/* 3 COLUNAS no desktop (Produtos | Carrinho | Pagamento) */}
// // // //       <div className="hidden lg:grid lg:grid-cols-[1fr_0.9fr_0.9fr] gap-6">
// // // //         {/* PRODUTOS */}
// // // //         <section className="rounded-xl border bg-white">
// // // //           <header className="flex items-center justify-between p-4 border-b">
// // // //             <span className="font-semibold text-lg">Produtos</span>
// // // //           </header>

// // // //           <div className="p-4">
// // // //             {isLoading ? (
// // // //               <div className="text-center py-8">Carregando produtos...</div>
// // // //             ) : filteredProducts.length > 0 ? (
// // // //               <div className="max-h-[calc(100vh-260px)] overflow-y-auto pr-2 space-y-3">
// // // //                 {filteredProducts.map((product) => (
// // // //                   <div
// // // //                     key={product.id}
// // // //                     className="flex items-center justify-between rounded-xl border px-3 py-3"
// // // //                   >
// // // //                     <div className="min-w-0">
// // // //                       <div className="truncate font-medium">{product.name}</div>
// // // //                       <div className="text-xs text-gray-500 flex items-center gap-2">
// // // //                         <span className="rounded-md bg-gray-100 px-2 py-[2px]">{product.brand}</span>
// // // //                         <span>Estoque: {product.stock}</span>
// // // //                       </div>
// // // //                       <div className="mt-1 font-semibold">{formatCurrency(product.price)}</div>
// // // //                     </div>

// // // //                     <button
// // // //                       onClick={() => addToCart(product)}
// // // //                       disabled={product.stock <= 0}
// // // //                       className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-xl bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
// // // //                       title="Adicionar"
// // // //                     >
// // // //                       <PlusIcon className="w-5 h-5" />
// // // //                     </button>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="text-center py-8">
// // // //                 Nenhum produto encontrado. Verifique o termo de busca ou se há produtos em estoque.
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </section>

// // // //         {/* CARRINHO */}
// // // //         <aside className="rounded-xl border bg-white flex flex-col">
// // // //           <header className="flex items-center justify-between p-4 border-b">
// // // //             <h2 className="font-semibold text-lg">Carrinho de Compras</h2>
// // // //             <span className="text-xs bg-gray-100 px-2 py-[2px] rounded-md">{cart.length} itens</span>
// // // //           </header>

// // // //           <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-260px)]">
// // // //             {cart.length === 0 ? (
// // // //               <div className="text-center py-8 text-gray-500">
// // // //                 Carrinho vazio<br />Adicione produtos para começar
// // // //               </div>
// // // //             ) : (
// // // //               cart.map((item) => (
// // // //                 <div key={item.id} className="border rounded-lg p-3">
// // // //                   <div className="font-medium">{item.name}</div>
// // // //                   <div className="text-xs text-gray-500">{item.brand} • {formatCurrency(item.price)}</div>

// // // //                   <div className="mt-2 flex items-center justify-between">
// // // //                     <div className="flex items-center border rounded-md">
// // // //                       <button
// // // //                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // //                         className="px-2 py-1 text-gray-600 hover:bg-gray-100"
// // // //                       >
// // // //                         <MinusIcon className="w-4 h-4" />
// // // //                       </button>
// // // //                       <span className="px-3">{item.quantity}</span>
// // // //                       <button
// // // //                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // //                         className="px-2 py-1 text-gray-600 hover:bg-gray-100"
// // // //                       >
// // // //                         <PlusIcon className="w-4 h-4" />
// // // //                       </button>
// // // //                     </div>

// // // //                     <div className="flex items-center gap-2">
// // // //                       <span className="font-medium">{formatCurrency(item.total)}</span>
// // // //                       <button
// // // //                         onClick={() => removeFromCart(item.id)}
// // // //                         className="text-red-500 hover:text-red-700"
// // // //                         title="Remover"
// // // //                       >
// // // //                         <TrashIcon className="w-5 h-5" />
// // // //                       </button>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               ))
// // // //             )}
// // // //           </div>

// // // //           {/* Rodapé carrinho */}
// // // //           <div className="p-4 border-t">
// // // //             {/* Cliente */}
// // // //             <div className="mb-3">
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
// // // //               <div className="flex gap-2">
// // // //                 <select
// // // //                   className="input-field flex-1"
// // // //                   value={selectedCustomer}
// // // //                   onChange={(e) => setSelectedCustomer(e.target.value)}
// // // //                 >
// // // //                   <option value="">Selecione um cliente</option>
// // // //                   {customers.map((customer) => (
// // // //                     <option key={customer.id} value={customer.id}>{customer.name}</option>
// // // //                   ))}
// // // //                 </select>
// // // //                 <button
// // // //                   onClick={() => setShowQuickCustomer(true)}
// // // //                   className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // //                   title="Cadastro rápido"
// // // //                 >
// // // //                   <UserPlusIcon className="w-5 h-5" />
// // // //                 </button>
// // // //               </div>
// // // //             </div>

// // // //             {/* Cadastro rápido */}
// // // //             {showQuickCustomer && (
// // // //               <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
// // // //                 <label className="block text-sm font-medium text-green-700 mb-1">Cadastro Rápido</label>
// // // //                 <div className="flex gap-2">
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="Nome do cliente"
// // // //                     className="input-field flex-1"
// // // //                     value={quickCustomerName}
// // // //                     onChange={(e) => setQuickCustomerName(e.target.value)}
// // // //                     onKeyPress={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
// // // //                   />
// // // //                   <button onClick={handleQuickCustomerAdd} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Salvar</button>
// // // //                   <button
// // // //                     onClick={() => { setShowQuickCustomer(false); setQuickCustomerName(""); }}
// // // //                     className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
// // // //                   >
// // // //                     Cancelar
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             <div className="flex justify-between items-center text-base font-bold mb-3">
// // // //               <span>Total:</span>
// // // //               <span>{formatCurrency(getCartTotal())}</span>
// // // //             </div>

// // // //             <div className="space-y-2">
// // // //               <button
// // // //                 onClick={() => {
// // // //                   if (paymentMethods.length === 0) {
// // // //                     setPaymentMethods([{ id: Date.now(), method: "Dinheiro", amount: getCartTotal(), machine: "" }])
// // // //                   }
// // // //                 }}
// // // //                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
// // // //                 disabled={cart.length === 0}
// // // //               >
// // // //                 Preparar Pagamento
// // // //               </button>

// // // //               <button
// // // //                 onClick={generateReceipt}
// // // //                 className="w-full py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50"
// // // //                 disabled={cart.length === 0}
// // // //               >
// // // //                 <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
// // // //                 Gerar Recibo
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </aside>

// // // //         {/* PAGAMENTO */}
// // // //         <section className="rounded-xl border bg-white flex flex-col">
// // // //           <header className="flex items-center gap-2 p-4 border-b">
// // // //             <span className="font-semibold text-lg">Pagamento</span>
// // // //           </header>

// // // //           <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)]">
// // // //             {/* Resumo */}
// // // //             <div className="rounded-lg bg-gray-100 px-4 py-4 text-center">
// // // //               <div className="text-sm text-gray-600">Total a Pagar</div>
// // // //               <div className="text-2xl font-extrabold">{formatCurrency(getCartTotal())}</div>
// // // //             </div>

// // // //             {/* Métodos */}
// // // //             <div className="space-y-4">
// // // //               {paymentMethods.map((payment) => (
// // // //                 <div key={payment.id} className="border rounded-lg p-4">
// // // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // //                     <div>
// // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// // // //                       <select
// // // //                         value={payment.method}
// // // //                         onChange={(e) => updatePaymentMethod(payment.id, "method", e.target.value)}
// // // //                         className="input-field"
// // // //                       >
// // // //                         <option value="Dinheiro">Dinheiro</option>
// // // //                         <option value="PIX">PIX</option>
// // // //                         <option value="Cartão de Crédito">Cartão de Crédito</option>
// // // //                         <option value="Cartão de Débito">Cartão de Débito</option>
// // // //                         <option value="Transferência">Transferência</option>
// // // //                       </select>
// // // //                     </div>

// // // //                     <div>
// // // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// // // //                       <input
// // // //                         type="number"
// // // //                         step="0.01"
// // // //                         min="0"
// // // //                         value={payment.amount}
// // // //                         onChange={(e) => updatePaymentMethod(payment.id, "amount", e.target.value)}
// // // //                         className="input-field"
// // // //                       />
// // // //                     </div>

// // // //                     {(payment.method === "Cartão de Crédito" || payment.method === "Cartão de Débito") && (
// // // //                       <div>
// // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// // // //                         <select
// // // //                           value={payment.machine}
// // // //                           onChange={(e) => updatePaymentMethod(payment.id, "machine", e.target.value)}
// // // //                           className="input-field"
// // // //                         >
// // // //                           <option value="">Selecione a máquina</option>
// // // //                           {cardMachines.map((m) => (
// // // //                             <option key={m.id} value={m.name}>{m.name}</option>
// // // //                           ))}
// // // //                         </select>
// // // //                       </div>
// // // //                     )}
// // // //                   </div>

// // // //                   <div className="mt-3 flex justify-end">
// // // //                     <button
// // // //                       onClick={() => removePaymentMethod(payment.id)}
// // // //                       className="text-red-600 hover:text-red-800 text-sm"
// // // //                     >
// // // //                       Remover
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>

// // // //             {/* Totais e ação */}
// // // //             <div className="flex items-center justify-between">
// // // //               <div className="text-sm">
// // // //                 <div className="text-gray-600">
// // // //                   Total Pago: <span className="font-semibold">{formatCurrency(getTotalPayments())}</span>
// // // //                 </div>
// // // //                 <div>
// // // //                   Restante:{" "}
// // // //                   <span className={getTotalPayments() < getCartTotal() ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
// // // //                     {formatCurrency(getCartTotal() - getTotalPayments())}
// // // //                   </span>
// // // //                 </div>
// // // //               </div>

// // // //               <button
// // // //                 onClick={addPaymentMethod}
// // // //                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // //               >
// // // //                 Adicionar Método
// // // //               </button>
// // // //             </div>

// // // //             <button
// // // //               onClick={handleFinalizeSale}
// // // //               disabled={cart.length === 0 || Math.abs(getTotalPayments() - getCartTotal()) > 0.01 || paymentMethods.length === 0}
// // // //               className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
// // // //             >
// // // //               Finalizar Venda
// // // //             </button>
// // // //           </div>
// // // //         </section>
// // // //       </div>

// // // //       {/* DRAWER do CARRINHO (mobile/tablet) */}
// // // //       <div
// // // //         className={[
// // // //           "fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 lg:hidden",
// // // //           isCartOpen ? "translate-x-0" : "translate-x-full",
// // // //         ].join(" ")}
// // // //       >
// // // //         <div className="flex flex-col h-full">
// // // //           <div className="flex justify-between items-center p-4 border-b">
// // // //             <h2 className="text-xl font-bold">Carrinho de Compras</h2>
// // // //             <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
// // // //               <XMarkIcon className="w-6 h-6" />
// // // //             </button>
// // // //           </div>

// // // //           <div className="flex-1 overflow-y-auto p-4">
// // // //             {cart.length === 0 ? (
// // // //               <div className="text-center py-8 text-gray-500">Carrinho vazio. Adicione produtos para realizar uma venda.</div>
// // // //             ) : (
// // // //               <div className="space-y-4">
// // // //                 {cart.map((item) => (
// // // //                   <div key={item.id} className="border-b pb-4">
// // // //                     <div className="font-medium">{item.name}</div>
// // // //                     <div className="text-sm text-gray-500">{item.brand} • {formatCurrency(item.price)}</div>
// // // //                     <div className="flex items-center justify-between mt-2">
// // // //                       <div className="flex items-center border rounded-md">
// // // //                         <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// // // //                           <MinusIcon className="w-4 h-4" />
// // // //                         </button>
// // // //                         <span className="px-3">{item.quantity}</span>
// // // //                         <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// // // //                           <PlusIcon className="w-4 h-4" />
// // // //                         </button>
// // // //                       </div>
// // // //                       <div className="flex items-center">
// // // //                         <span className="font-medium mr-2">{formatCurrency(item.total)}</span>
// // // //                         <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
// // // //                           <TrashIcon className="w-5 h-5" />
// // // //                         </button>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <div className="p-4 border-t space-y-2">
// // // //             <button
// // // //               onClick={() => {
// // // //                 if (paymentMethods.length === 0) {
// // // //                   setPaymentMethods([{ id: Date.now(), method: "Dinheiro", amount: getCartTotal(), machine: "" }])
// // // //                 }
// // // //                 setShowPaymentModal(true)
// // // //               }}
// // // //               className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // // //               disabled={cart.length === 0}
// // // //             >
// // // //               Pagamento
// // // //             </button>
// // // //             <button
// // // //               onClick={generateReceipt}
// // // //               className="w-full py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
// // // //               disabled={cart.length === 0}
// // // //             >
// // // //               <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
// // // //               Gerar Recibo
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* MODAL DE PAGAMENTO (mobile/tablet) */}
// // // //       {showPaymentModal && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4 lg:hidden">
// // // //           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // //             <div className="p-6">
// // // //               <div className="flex justify-between items-center mb-6">
// // // //                 <h2 className="text-xl font-bold">Métodos de Pagamento</h2>
// // // //                 <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-full hover:bg-gray-100">
// // // //                   <XMarkIcon className="w-6 h-6" />
// // // //                 </button>
// // // //               </div>

// // // //               <div className="mb-6">
// // // //                 <div className="flex justify-between items-center text-lg font-bold mb-4">
// // // //                   <span>Total da Venda:</span>
// // // //                   <span>{formatCurrency(getCartTotal())}</span>
// // // //                 </div>

// // // //                 <div className="flex justify-between items-center text-sm text-gray-600">
// // // //                   <span>Total Pago:</span>
// // // //                   <span>{formatCurrency(getTotalPayments())}</span>
// // // //                 </div>

// // // //                 <div className="flex justify-between items-center text-sm">
// // // //                   <span>Restante:</span>
// // // //                   <span className={getTotalPayments() < getCartTotal() ? "text-red-600" : "text-green-600"}>
// // // //                     {formatCurrency(getCartTotal() - getTotalPayments())}
// // // //                   </span>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="space-y-4 mb-6">
// // // //                 {paymentMethods.map((payment) => (
// // // //                   <div key={payment.id} className="border rounded-lg p-4">
// // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // //                       <div>
// // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// // // //                         <select
// // // //                           value={payment.method}
// // // //                           onChange={(e) => updatePaymentMethod(payment.id, "method", e.target.value)}
// // // //                           className="input-field"
// // // //                         >
// // // //                           <option value="Dinheiro">Dinheiro</option>
// // // //                           <option value="PIX">PIX</option>
// // // //                           <option value="Cartão de Crédito">Cartão de Crédito</option>
// // // //                           <option value="Cartão de Débito">Cartão de Débito</option>
// // // //                           <option value="Transferência">Transferência</option>
// // // //                         </select>
// // // //                       </div>

// // // //                       <div>
// // // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// // // //                         <input
// // // //                           type="number"
// // // //                           step="0.01"
// // // //                           min="0"
// // // //                           value={payment.amount}
// // // //                           onChange={(e) => updatePaymentMethod(payment.id, "amount", e.target.value)}
// // // //                           className="input-field"
// // // //                         />
// // // //                       </div>

// // // //                       {(payment.method === "Cartão de Crédito" || payment.method === "Cartão de Débito") && (
// // // //                         <div>
// // // //                           <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// // // //                           <select
// // // //                             value={payment.machine}
// // // //                             onChange={(e) => updatePaymentMethod(payment.id, "machine", e.target.value)}
// // // //                             className="input-field"
// // // //                           >
// // // //                             <option value="">Selecione a máquina</option>
// // // //                             {cardMachines.map((machine) => (
// // // //                               <option key={machine.id} value={machine.name}>
// // // //                                 {machine.name}
// // // //                               </option>
// // // //                             ))}
// // // //                           </select>
// // // //                         </div>
// // // //                       )}
// // // //                     </div>

// // // //                     <div className="mt-3 flex justify-end">
// // // //                       <button
// // // //                         onClick={() => removePaymentMethod(payment.id)}
// // // //                         className="text-red-600 hover:text-red-800 text-sm"
// // // //                       >
// // // //                         Remover
// // // //                       </button>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>

// // // //               <div className="flex justify-between items-center mb-6">
// // // //                 <button
// // // //                   onClick={addPaymentMethod}
// // // //                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // // //                 >
// // // //                   Adicionar Método
// // // //                 </button>
// // // //               </div>

// // // //               <div className="flex space-x-4">
// // // //                 <button
// // // //                   onClick={() => setShowPaymentModal(false)}
// // // //                   className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
// // // //                 >
// // // //                   Cancelar
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={handleFinalizeSale}
// // // //                   className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // //                   disabled={Math.abs(getTotalPayments() - getCartTotal()) > 0.01 || paymentMethods.length === 0}
// // // //                 >
// // // //                   Confirmar Venda
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }

// // // // export default PDV


// // // import { useReducer, useEffect, useMemo } from "react"
// // // import { toast } from "react-toastify"
// // // import {
// // //   PlusIcon,
// // //   MinusIcon,
// // //   TrashIcon,
// // //   CreditCardIcon,
// // //   UserPlusIcon,
// // //   ShoppingCartIcon,
// // // } from "@heroicons/react/24/outline"
// // // import PageHeader from "../components/PageHeader"
// // // import { formatCurrency } from "../utils/format"
// // // import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api"

// // // /**
// // //  * OBJETIVO: Unificar Carrinho + Pagamento em UMA funcionalidade (uma só área + um só fluxo)
// // //  * - Um estado único com useReducer
// // //  * - Um único botão de ação: Finalizar Venda
// // //  * - Validações centralizadas
// // //  * - Cria UMA venda com todos os itens (em vez de 1 por item)
// // //  * - Mesma UI para desktop e mobile (sem duplicar componentes/modais)
// // //  */

// // // // ---------- Tipos simples ----------
// // // const MACHINE_OPTIONS = [
// // //   { id: "machine_a", name: "Máquina A" },
// // //   { id: "machine_b", name: "Máquina B" },
// // //   { id: "machine_c", name: "Máquina C" },
// // // ]

// // // const PAYMENT_METHODS = [
// // //   "Dinheiro",
// // //   "PIX",
// // //   "Cartão de Crédito",
// // //   "Cartão de Débito",
// // //   "Transferência",
// // // ]

// // // // ---------- Reducer ----------
// // // const initialState = {
// // //   products: [],
// // //   customers: [],
// // //   filteredProducts: [],
// // //   isLoading: true,
// // //   searchTerm: "",
// // //   cart: [], // {id,name,brand,price,quantity,stock,total}
// // //   selectedCustomerId: "",
// // //   quickCustomerName: "",
// // //   payments: [], // {id, method, amount, machine?}
// // // }

// // // function reducer(state, action) {
// // //   switch (action.type) {
// // //     case "SET_DATA": {
// // //       const { products, customers } = action.payload
// // //       const available = products.filter((p) => p.stock > 0)
// // //       return { ...state, products, customers, filteredProducts: available, isLoading: false }
// // //     }
// // //     case "SET_LOADING":
// // //       return { ...state, isLoading: action.payload }
// // //     case "SET_SEARCH": {
// // //       const searchTerm = action.payload
// // //       const filtered = searchTerm
// // //         ? state.products.filter(
// // //             (p) =>
// // //               p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //               p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //               p.code?.toLowerCase().includes(searchTerm.toLowerCase()),
// // //           )
// // //         : state.products.filter((p) => p.stock > 0)
// // //       return { ...state, searchTerm, filteredProducts: filtered }
// // //     }
// // //     case "ADD_TO_CART": {
// // //       const p = action.payload
// // //       const existing = state.cart.find((i) => i.id === p.id)
// // //       if (existing) {
// // //         if (existing.quantity >= p.stock) {
// // //           toast.warning(`Estoque máximo atingido para ${p.name}`)
// // //           return state
// // //         }
// // //         const cart = state.cart.map((i) =>
// // //           i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i,
// // //         )
// // //         return { ...state, cart }
// // //       }
// // //       return {
// // //         ...state,
// // //         cart: [
// // //           ...state.cart,
// // //           { id: p.id, name: p.name, brand: p.brand, price: p.price, quantity: 1, stock: p.stock, total: p.price },
// // //         ],
// // //       }
// // //     }
// // //     case "REMOVE_FROM_CART":
// // //       return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) }
// // //     case "UPDATE_QTY": {
// // //       const { id, qty } = action.payload
// // //       if (qty <= 0) return state
// // //       const it = state.cart.find((i) => i.id === id)
// // //       if (!it) return state
// // //       if (qty > it.stock) {
// // //         toast.warning(`Estoque máximo atingido para ${it.name}`)
// // //         return state
// // //       }
// // //       const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i))
// // //       return { ...state, cart }
// // //     }
// // //     case "SET_CUSTOMER":
// // //       return { ...state, selectedCustomerId: action.payload }
// // //     case "SET_QUICK_CUSTOMER":
// // //       return { ...state, quickCustomerName: action.payload }
// // //     case "ADD_PAYMENT": {
// // //       const remaining = action.payload // número calculado fora
// // //       if (remaining <= 0) {
// // //         toast.warning("Valor total já coberto")
// // //         return state
// // //       }
// // //       const pm = { id: Date.now(), method: "Dinheiro", amount: Number(remaining), machine: "" }
// // //       return { ...state, payments: [...state.payments, pm] }
// // //     }
// // //     case "UPDATE_PAYMENT": {
// // //       const { id, field, value } = action.payload
// // //       const payments = state.payments.map((pm) =>
// // //         pm.id === id
// // //           ? {
// // //               ...pm,
// // //               [field]: field === "amount" ? (Number(value) || 0) : value,
// // //               ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
// // //                 ? { machine: "" }
// // //                 : {}),
// // //             }
// // //           : pm,
// // //       )
// // //       return { ...state, payments }
// // //     }
// // //     case "REMOVE_PAYMENT":
// // //       return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) }
// // //     case "RESET_ALL":
// // //       return { ...initialState, products: state.products, customers: state.customers, filteredProducts: state.filteredProducts }
// // //     default:
// // //       return state
// // //   }
// // // }

// // // export default function PDV() {
// // //   const [state, dispatch] = useReducer(reducer, initialState)

// // //   // Carregar dados
// // //   useEffect(() => {
// // //     const load = async () => {
// // //       try {
// // //         dispatch({ type: "SET_LOADING", payload: true })
// // //         const [prods, custs] = await Promise.all([fetchProducts(), fetchCustomers()])
// // //         dispatch({ type: "SET_DATA", payload: { products: prods, customers: custs } })
// // //       } catch (e) {
// // //         console.error(e)
// // //         toast.error("Erro ao carregar dados")
// // //       } finally {
// // //         dispatch({ type: "SET_LOADING", payload: false })
// // //       }
// // //     }
// // //     load()
// // //   }, [])

// // //   const cartTotal = useMemo(() => state.cart.reduce((s, i) => s + i.total, 0), [state.cart])
// // //   const totalPayments = useMemo(() => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0), [state.payments])
// // //   const remaining = useMemo(() => Number((cartTotal - totalPayments).toFixed(2)), [cartTotal, totalPayments])

// // //   const addDefaultPaymentIfEmpty = () => {
// // //     if (state.cart.length === 0) {
// // //       toast.error("Adicione produtos ao carrinho")
// // //       return
// // //     }
// // //     if (state.payments.length === 0) {
// // //       dispatch({ type: "ADD_PAYMENT", payload: cartTotal })
// // //     }
// // //   }

// // //   const handleQuickCustomerAdd = async () => {
// // //     const name = state.quickCustomerName?.trim()
// // //     if (!name) {
// // //       toast.error("Digite o nome do cliente")
// // //       return
// // //     }
// // //     try {
// // //       const newC = await createCustomer({ name })
// // //       toast.success("Cliente adicionado")
// // //       dispatch({ type: "SET_DATA", payload: { products: state.products, customers: [...state.customers, newC] } })
// // //       dispatch({ type: "SET_CUSTOMER", payload: newC.id })
// // //       dispatch({ type: "SET_QUICK_CUSTOMER", payload: "" })
// // //     } catch (e) {
// // //       console.error(e)
// // //       toast.error("Erro ao adicionar cliente")
// // //     }
// // //   }

// // //   const validateBeforeFinalize = () => {
// // //     if (state.cart.length === 0) {
// // //       toast.error("Carrinho vazio")
// // //       return false
// // //     }
// // //     if (state.payments.length === 0) {
// // //       toast.error("Adicione um método de pagamento")
// // //       return false
// // //     }
// // //     if (Math.abs(totalPayments - cartTotal) > 0.01) {
// // //       toast.error("Pagamentos devem somar o total da venda")
// // //       return false
// // //     }
// // //     const cardPays = state.payments.filter((p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito")
// // //     if (cardPays.some((p) => !p.machine)) {
// // //       toast.error("Selecione a máquina para todos cartões")
// // //       return false
// // //     }
// // //     return true
// // //   }

// // //   const handleFinalize = async () => {
// // //     if (!validateBeforeFinalize()) return

// // //     const customerName = state.selectedCustomerId
// // //       ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
// // //       : "Cliente não identificado"

// // //     // NOVO: cria UMA venda com todos os itens
// // //     const salePayload = {
// // //       customerId: state.selectedCustomerId || null,
// // //       customerName,
// // //       items: state.cart.map((i) => ({ productId: i.id, name: i.name, qty: i.quantity, unitPrice: i.price, total: i.total })),
// // //       payments: state.payments,
// // //       total: cartTotal,
// // //       date: new Date().toISOString(),
// // //     }

// // //     try {
// // //       await createSale(salePayload)
// // //       toast.success("Venda finalizada!")
// // //       dispatch({ type: "RESET_ALL" })
// // //       // Recarrega produtos/estoque
// // //       const prods = await fetchProducts()
// // //       dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } })
// // //     } catch (e) {
// // //       console.error(e)
// // //       toast.error("Erro ao finalizar venda")
// // //     }
// // //   }

// // //   return (
// // //     <div className="relative">
// // //       <PageHeader title="PDV" />

// // //       {/* BUSCA + AÇÕES RÁPIDAS */}
// // //       <div className="mb-4 flex gap-3 items-center">
// // //         <input
// // //           type="text"
// // //           placeholder="Buscar produto (nome, marca ou código)"
// // //           className="input-field flex-1"
// // //           value={state.searchTerm}
// // //           onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
// // //         />
// // //         <button
// // //           onClick={addDefaultPaymentIfEmpty}
// // //           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
// // //           disabled={state.cart.length === 0}
// // //           title="Prepara pagamento default com o total"
// // //         >
// // //           <CreditCardIcon className="w-5 h-5 inline mr-2" />Preparar Pagamento
// // //         </button>
// // //         <div className="hidden lg:flex items-center text-sm bg-gray-100 rounded-md px-3 py-2">
// // //           <ShoppingCartIcon className="w-5 h-5 mr-2" /> {state.cart.length} itens
// // //         </div>
// // //       </div>

// // //       {/* GRADE 2 COLUNAS: PRODUTOS | CHECKOUT (Carrinho+Pagamento) */}
// // //       <div className="grid lg:grid-cols-2 gap-6">
// // //         {/* PRODUTOS */}
// // //         <section className="rounded-xl border bg-white">
// // //           <header className="flex items-center justify-between p-4 border-b">
// // //             <span className="font-semibold text-lg">Produtos</span>
// // //           </header>
// // //           <div className="p-4">
// // //             {state.isLoading ? (
// // //               <div className="text-center py-8">Carregando...</div>
// // //             ) : state.filteredProducts.length ? (
// // //               <div className="max-h-[calc(100vh-260px)] overflow-y-auto pr-2 space-y-3">
// // //                 {state.filteredProducts.map((p) => (
// // //                   <div key={p.id} className="flex items-center justify-between rounded-xl border px-3 py-3">
// // //                     <div className="min-w-0">
// // //                       <div className="truncate font-medium">{p.name}</div>
// // //                       <div className="text-xs text-gray-500 flex items-center gap-2">
// // //                         <span className="rounded-md bg-gray-100 px-2 py-[2px]">{p.brand}</span>
// // //                         <span>Estoque: {p.stock}</span>
// // //                       </div>
// // //                       <div className="mt-1 font-semibold">{formatCurrency(p.price)}</div>
// // //                     </div>
// // //                     <button
// // //                       onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
// // //                       disabled={p.stock <= 0}
// // //                       className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-xl bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
// // //                       title="Adicionar"
// // //                     >
// // //                       <PlusIcon className="w-5 h-5" />
// // //                     </button>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <div className="text-center py-8 text-gray-500">Nenhum produto encontrado.</div>
// // //             )}
// // //           </div>
// // //         </section>

// // //         {/* CHECKOUT UNIFICADO */}
// // //         <section className="rounded-xl border bg-white flex flex-col">
// // //           <header className="flex items-center justify-between p-4 border-b">
// // //             <h2 className="font-semibold text-lg">Checkout (Carrinho + Pagamento)</h2>
// // //             <span className="text-xs bg-gray-100 px-2 py-[2px] rounded-md">{state.cart.length} itens</span>
// // //           </header>

// // //           <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)]">
// // //             {/* CARRINHO */}
// // //             <div className="space-y-4">
// // //               {state.cart.length === 0 ? (
// // //                 <div className="text-center py-8 text-gray-500">Carrinho vazio</div>
// // //               ) : (
// // //                 state.cart.map((it) => (
// // //                   <div key={it.id} className="border rounded-lg p-3">
// // //                     <div className="font-medium">{it.name}</div>
// // //                     <div className="text-xs text-gray-500">{it.brand} • {formatCurrency(it.price)}</div>
// // //                     <div className="mt-2 flex items-center justify-between">
// // //                       <div className="flex items-center border rounded-md">
// // //                         <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// // //                           <MinusIcon className="w-4 h-4" />
// // //                         </button>
// // //                         <span className="px-3">{it.quantity}</span>
// // //                         <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// // //                           <PlusIcon className="w-4 h-4" />
// // //                         </button>
// // //                       </div>
// // //                       <div className="flex items-center gap-2">
// // //                         <span className="font-medium">{formatCurrency(it.total)}</span>
// // //                         <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })} className="text-red-500 hover:text-red-700" title="Remover">
// // //                           <TrashIcon className="w-5 h-5" />
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </div>

// // //             {/* CLIENTE */}
// // //             <div className="border rounded-lg p-4">
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
// // //               <div className="flex gap-2">
// // //                 <select
// // //                   className="input-field flex-1"
// // //                   value={state.selectedCustomerId}
// // //                   onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: e.target.value })}
// // //                 >
// // //                   <option value="">Selecione um cliente</option>
// // //                   {state.customers.map((c) => (
// // //                     <option key={c.id} value={c.id}>{c.name}</option>
// // //                   ))}
// // //                 </select>
// // //                 <button
// // //                   onClick={handleQuickCustomerAdd}
// // //                   className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // //                   title="Cadastro rápido (usa o campo ao lado)"
// // //                 >
// // //                   <UserPlusIcon className="w-5 h-5" />
// // //                 </button>
// // //               </div>
// // //               <input
// // //                 type="text"
// // //                 placeholder="Nome rápido do cliente"
// // //                 className="input-field mt-2"
// // //                 value={state.quickCustomerName}
// // //                 onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
// // //               />
// // //             </div>

// // //             {/* RESUMO */}
// // //             <div className="rounded-lg bg-gray-100 px-4 py-4 grid grid-cols-2 gap-3 text-sm">
// // //               <div>Total dos Itens</div>
// // //               <div className="text-right font-semibold">{formatCurrency(cartTotal)}</div>
// // //               <div>Total Pago</div>
// // //               <div className="text-right font-semibold">{formatCurrency(totalPayments)}</div>
// // //               <div>Restante</div>
// // //               <div className={`text-right font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>
// // //                 {formatCurrency(remaining)}
// // //               </div>
// // //             </div>

// // //             {/* PAGAMENTOS */}
// // //             <div className="space-y-4">
// // //               {state.payments.map((p) => (
// // //                 <div key={p.id} className="border rounded-lg p-4">
// // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// // //                       <select
// // //                         value={p.method}
// // //                         onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: e.target.value } })}
// // //                         className="input-field"
// // //                       >
// // //                         {PAYMENT_METHODS.map((m) => (
// // //                           <option key={m} value={m}>{m}</option>
// // //                         ))}
// // //                       </select>
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// // //                       <input
// // //                         type="number"
// // //                         step="0.01"
// // //                         min="0"
// // //                         value={p.amount}
// // //                         onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
// // //                         className="input-field"
// // //                       />
// // //                     </div>
// // //                     {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// // //                         <select
// // //                           value={p.machine}
// // //                           onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: e.target.value } })}
// // //                           className="input-field"
// // //                         >
// // //                           <option value="">Selecione a máquina</option>
// // //                           {MACHINE_OPTIONS.map((m) => (
// // //                             <option key={m.id} value={m.name}>{m.name}</option>
// // //                           ))}
// // //                         </select>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                   <div className="mt-3 flex justify-end">
// // //                     <button onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} className="text-red-600 hover:text-red-800 text-sm">Remover</button>
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               <div className="flex items-center justify-between">
// // //                 <small className="text-gray-600">Dica: use "Adicionar Método" até cobrir o total.</small>
// // //                 <button
// // //                   onClick={() => dispatch({ type: "ADD_PAYMENT", payload: remaining })}
// // //                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// // //                 >
// // //                   Adicionar Método
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <button
// // //               onClick={handleFinalize}
// // //               disabled={state.cart.length === 0 || state.payments.length === 0 || Math.abs(totalPayments - cartTotal) > 0.01}
// // //               className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
// // //             >
// // //               Finalizar Venda
// // //             </button>
// // //           </div>
// // //         </section>
// // //       </div>
// // //     </div>
// // //   )
// // // }



// // import { useReducer, useEffect, useMemo } from "react"
// // import { toast } from "react-toastify"
// // import {
// //   PlusIcon,
// //   MinusIcon,
// //   TrashIcon,
// //   CreditCardIcon,
// //   UserPlusIcon,
// //   ShoppingCartIcon,
// // } from "@heroicons/react/24/outline"
// // import PageHeader from "../components/PageHeader"
// // import { formatCurrency } from "../utils/format"
// // import { fetchProducts, createSale, fetchCustomers, createCustomer } from "../services/api"

// // /**
// //  * PDV UNIFICADO (Carrinho + Pagamento)
// //  * - UMA tela, UM fluxo
// //  * - Botão único: Finalizar Venda
// //  * - Validações centralizadas
// //  * - createSale envia UMA venda com todos itens e pagamentos
// //  * - Campo "Nome rápido do cliente" oculto por padrão; aparece ao clicar no ícone
// //  */

// // // ---------- Opções ----------
// // const MACHINE_OPTIONS = [
// //   { id: "machine_a", name: "Máquina A" },
// //   { id: "machine_b", name: "Máquina B" },
// //   { id: "machine_c", name: "Máquina C" },
// // ]

// // const PAYMENT_METHODS = [
// //   "Dinheiro",
// //   "PIX",
// //   "Cartão de Crédito",
// //   "Cartão de Débito",
// //   "Transferência",
// // ]

// // // ---------- Estado / Reducer ----------
// // const initialState = {
// //   products: [],
// //   customers: [],
// //   filteredProducts: [],
// //   isLoading: true,
// //   searchTerm: "",
// //   cart: [], // {id,name,brand,price,quantity,stock,total}
// //   selectedCustomerId: "",
// //   quickCustomerName: "",
// //   showQuickCustomer: false, // <- controla exibição do input rápido
// //   payments: [], // {id, method, amount, machine?}
// // }

// // function reducer(state, action) {
// //   switch (action.type) {
// //     case "SET_DATA": {
// //       const { products, customers } = action.payload
// //       const available = products.filter((p) => p.stock > 0)
// //       return { ...state, products, customers, filteredProducts: available, isLoading: false }
// //     }
// //     case "SET_LOADING":
// //       return { ...state, isLoading: action.payload }
// //     case "SET_SEARCH": {
// //       const searchTerm = action.payload
// //       const filtered = searchTerm
// //         ? state.products.filter(
// //             (p) =>
// //               p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //               p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //               p.code?.toLowerCase().includes(searchTerm.toLowerCase()),
// //           )
// //         : state.products.filter((p) => p.stock > 0)
// //       return { ...state, searchTerm, filteredProducts: filtered }
// //     }
// //     case "ADD_TO_CART": {
// //       const p = action.payload
// //       const existing = state.cart.find((i) => i.id === p.id)
// //       if (existing) {
// //         if (existing.quantity >= p.stock) {
// //           toast.warning(`Estoque máximo atingido para ${p.name}`)
// //           return state
// //         }
// //         const cart = state.cart.map((i) =>
// //           i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i,
// //         )
// //         return { ...state, cart }
// //       }
// //       return {
// //         ...state,
// //         cart: [
// //           ...state.cart,
// //           { id: p.id, name: p.name, brand: p.brand, price: p.price, quantity: 1, stock: p.stock, total: p.price },
// //         ],
// //       }
// //     }
// //     case "REMOVE_FROM_CART":
// //       return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) }
// //     case "UPDATE_QTY": {
// //       const { id, qty } = action.payload
// //       if (qty <= 0) return state
// //       const it = state.cart.find((i) => i.id === id)
// //       if (!it) return state
// //       if (qty > it.stock) {
// //         toast.warning(`Estoque máximo atingido para ${it.name}`)
// //         return state
// //       }
// //       const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i))
// //       return { ...state, cart }
// //     }
// //     case "SET_CUSTOMER":
// //       return { ...state, selectedCustomerId: action.payload }
// //     case "SET_QUICK_CUSTOMER":
// //       return { ...state, quickCustomerName: action.payload }
// //     case "TOGGLE_QUICK_CUSTOMER":
// //       return { ...state, showQuickCustomer: !state.showQuickCustomer }
// //     case "ADD_PAYMENT": {
// //       const remaining = action.payload // número calculado fora
// //       if (remaining <= 0) {
// //         toast.warning("Valor total já coberto")
// //         return state
// //       }
// //       const pm = { id: Date.now(), method: "Dinheiro", amount: Number(remaining), machine: "" }
// //       return { ...state, payments: [...state.payments, pm] }
// //     }
// //     case "UPDATE_PAYMENT": {
// //       const { id, field, value } = action.payload
// //       const payments = state.payments.map((pm) =>
// //         pm.id === id
// //           ? {
// //               ...pm,
// //               [field]: field === "amount" ? (Number(value) || 0) : value,
// //               ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito"
// //                 ? { machine: "" }
// //                 : {}),
// //             }
// //           : pm,
// //       )
// //       return { ...state, payments }
// //     }
// //     case "REMOVE_PAYMENT":
// //       return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) }
// //     case "RESET_ALL":
// //       return { ...initialState, products: state.products, customers: state.customers, filteredProducts: state.filteredProducts }
// //     default:
// //       return state
// //   }
// // }

// // export default function PDVUnificado() {
// //   const [state, dispatch] = useReducer(reducer, initialState)

// //   // Carregar dados
// //   useEffect(() => {
// //     const load = async () => {
// //       try {
// //         dispatch({ type: "SET_LOADING", payload: true })
// //         const [prods, custs] = await Promise.all([fetchProducts(), fetchCustomers()])
// //         dispatch({ type: "SET_DATA", payload: { products: prods, customers: custs } })
// //       } catch (e) {
// //         console.error(e)
// //         toast.error("Erro ao carregar dados")
// //       } finally {
// //         dispatch({ type: "SET_LOADING", payload: false })
// //       }
// //     }
// //     load()
// //   }, [])

// //   const cartTotal = useMemo(() => state.cart.reduce((s, i) => s + i.total, 0), [state.cart])
// //   const totalPayments = useMemo(() => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0), [state.payments])
// //   const remaining = useMemo(() => Number((cartTotal - totalPayments).toFixed(2)), [cartTotal, totalPayments])

// //   const addDefaultPaymentIfEmpty = () => {
// //     if (state.cart.length === 0) {
// //       toast.error("Adicione produtos ao carrinho")
// //       return
// //     }
// //     if (state.payments.length === 0) {
// //       dispatch({ type: "ADD_PAYMENT", payload: cartTotal })
// //     }
// //   }

// //   const handleQuickCustomerAdd = async () => {
// //     const name = state.quickCustomerName?.trim()
// //     if (!name) {
// //       toast.error("Digite o nome do cliente")
// //       return
// //     }
// //     try {
// //       const newC = await createCustomer({ name })
// //       toast.success("Cliente adicionado")
// //       dispatch({ type: "SET_DATA", payload: { products: state.products, customers: [...state.customers, newC] } })
// //       dispatch({ type: "SET_CUSTOMER", payload: newC.id })
// //       dispatch({ type: "SET_QUICK_CUSTOMER", payload: "" })
// //       if (state.showQuickCustomer) dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })
// //     } catch (e) {
// //       console.error(e)
// //       toast.error("Erro ao adicionar cliente")
// //     }
// //   }

// //   const validateBeforeFinalize = () => {
// //     if (state.cart.length === 0) {
// //       toast.error("Carrinho vazio")
// //       return false
// //     }
// //     if (state.payments.length === 0) {
// //       toast.error("Adicione um método de pagamento")
// //       return false
// //     }
// //     if (Math.abs(totalPayments - cartTotal) > 0.01) {
// //       toast.error("Pagamentos devem somar o total da venda")
// //       return false
// //     }
// //     const cardPays = state.payments.filter((p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito")
// //     if (cardPays.some((p) => !p.machine)) {
// //       toast.error("Selecione a máquina para todos cartões")
// //       return false
// //     }
// //     return true
// //   }

// //   const handleFinalize = async () => {
// //     if (!validateBeforeFinalize()) return

// //     const customerName = state.selectedCustomerId
// //       ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name || "Cliente não identificado"
// //       : "Cliente não identificado"

// //     // UMA venda com todos os itens
// //     const salePayload = {
// //       customerId: state.selectedCustomerId || null,
// //       customerName,
// //       items: state.cart.map((i) => ({ productId: i.id, name: i.name, qty: i.quantity, unitPrice: i.price, total: i.total })),
// //       payments: state.payments,
// //       total: cartTotal,
// //       date: new Date().toISOString(),
// //     }

// //     try {
// //       await createSale(salePayload)
// //       toast.success("Venda finalizada!")
// //       dispatch({ type: "RESET_ALL" })
// //       // Recarrega produtos/estoque
// //       const prods = await fetchProducts()
// //       dispatch({ type: "SET_DATA", payload: { products: prods, customers: state.customers } })
// //     } catch (e) {
// //       console.error(e)
// //       toast.error("Erro ao finalizar venda")
// //     }
// //   }

// //   return (
// //     <div className="relative">
// //       <PageHeader title="PDV - Carrinho & Pagamento (Unificado)" />

// //       {/* BUSCA + AÇÕES RÁPIDAS */}
// //       <div className="mb-4 flex gap-3 items-center">
// //         <input
// //           type="text"
// //           placeholder="Buscar produto (nome, marca ou código)"
// //           className="input-field flex-1"
// //           value={state.searchTerm}
// //           onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
// //         />
// //         <button
// //           onClick={addDefaultPaymentIfEmpty}
// //           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
// //           disabled={state.cart.length === 0}
// //           title="Prepara pagamento default com o total"
// //         >
// //           <CreditCardIcon className="w-5 h-5 inline mr-2" />Preparar Pagamento
// //         </button>
// //         <div className="hidden lg:flex items-center text-sm bg-gray-100 rounded-md px-3 py-2">
// //           <ShoppingCartIcon className="w-5 h-5 mr-2" /> {state.cart.length} itens
// //         </div>
// //       </div>

// //       {/* GRADE 2 COLUNAS: PRODUTOS | CHECKOUT (Carrinho+Pagamento) */}
// //       <div className="grid lg:grid-cols-2 gap-6">
// //         {/* PRODUTOS */}
// //         <section className="rounded-xl border bg-white">
// //           <header className="flex items-center justify-between p-4 border-b">
// //             <span className="font-semibold text-lg">Produtos</span>
// //           </header>
// //           <div className="p-4">
// //             {state.isLoading ? (
// //               <div className="text-center py-8">Carregando...</div>
// //             ) : state.filteredProducts.length ? (
// //               <div className="max-h=[calc(100vh-260px)] lg:max-h-[calc(100vh-260px)] overflow-y-auto pr-2 space-y-3">
// //                 {state.filteredProducts.map((p) => (
// //                   <div key={p.id} className="flex items-center justify-between rounded-xl border px-3 py-3">
// //                     <div className="min-w-0">
// //                       <div className="truncate font-medium">{p.name}</div>
// //                       <div className="text-xs text-gray-500 flex items-center gap-2">
// //                         <span className="rounded-md bg-gray-100 px-2 py-[2px]">{p.brand}</span>
// //                         <span>Estoque: {p.stock}</span>
// //                       </div>
// //                       <div className="mt-1 font-semibold">{formatCurrency(p.price)}</div>
// //                     </div>
// //                     <button
// //                       onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
// //                       disabled={p.stock <= 0}
// //                       className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-xl bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
// //                       title="Adicionar"
// //                     >
// //                       <PlusIcon className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="text-center py-8 text-gray-500">Nenhum produto encontrado.</div>
// //             )}
// //           </div>
// //         </section>

// //         {/* CHECKOUT UNIFICADO */}
// //         <section className="rounded-xl border bg-white flex flex-col">
// //           <header className="flex items-center justify-between p-4 border-b">
// //             <h2 className="font-semibold text-lg">Checkout (Carrinho + Pagamento)</h2>
// //             <span className="text-xs bg-gray-100 px-2 py-[2px] rounded-md">{state.cart.length} itens</span>
// //           </header>

// //           <div className="p-4 space-y-5 overflow-y-auto lg:max-h-[calc(100vh-260px)]">
// //             {/* CARRINHO */}
// //             <div className="space-y-4">
// //               {state.cart.length === 0 ? (
// //                 <div className="text-center py-8 text-gray-500">Carrinho vazio</div>
// //               ) : (
// //                 state.cart.map((it) => (
// //                   <div key={it.id} className="border rounded-lg p-3">
// //                     <div className="font-medium">{it.name}</div>
// //                     <div className="text-xs text-gray-500">{it.brand} • {formatCurrency(it.price)}</div>
// //                     <div className="mt-2 flex items-center justify-between">
// //                       <div className="flex items-center border rounded-md">
// //                         <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// //                           <MinusIcon className="w-4 h-4" />
// //                         </button>
// //                         <span className="px-3">{it.quantity}</span>
// //                         <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100">
// //                           <PlusIcon className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                       <div className="flex items-center gap-2">
// //                         <span className="font-medium">{formatCurrency(it.total)}</span>
// //                         <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })} className="text-red-500 hover:text-red-700" title="Remover">
// //                           <TrashIcon className="w-5 h-5" />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </div>

// //             {/* CLIENTE */}
// //             <div className="border rounded-lg p-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
// //               <div className="flex gap-2 items-center">
// //                 <select
// //                   className="input-field flex-1"
// //                   value={state.selectedCustomerId}
// //                   onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: e.target.value })}
// //                 >
// //                   <option value="">Selecione um cliente</option>
// //                   {state.customers.map((c) => (
// //                     <option key={c.id} value={c.id}>{c.name}</option>
// //                   ))}
// //                 </select>
// //                 <button
// //                   onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })}
// //                   className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// //                   title="Cadastro rápido"
// //                 >
// //                   <UserPlusIcon className="w-5 h-5" />
// //                 </button>
// //               </div>
// //               {state.showQuickCustomer && (
// //                 <div className="mt-2 flex gap-2">
// //                   <input
// //                     type="text"
// //                     placeholder="Nome rápido do cliente"
// //                     className="input-field flex-1"
// //                     value={state.quickCustomerName}
// //                     onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
// //                     onKeyPress={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
// //                   />
// //                   <button
// //                     onClick={handleQuickCustomerAdd}
// //                     className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// //                   >Salvar</button>
// //                 </div>
// //               )}
// //             </div>

// //             {/* RESUMO */}
// //             <div className="rounded-lg bg-gray-100 px-4 py-4 grid grid-cols-2 gap-3 text-sm">
// //               <div>Total dos Itens</div>
// //               <div className="text-right font-semibold">{formatCurrency(cartTotal)}</div>
// //               <div>Total Pago</div>
// //               <div className="text-right font-semibold">{formatCurrency(totalPayments)}</div>
// //               <div>Restante</div>
// //               <div className={`text-right font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>
// //                 {formatCurrency(remaining)}
// //               </div>
// //             </div>

// //             {/* PAGAMENTOS */}
// //             <div className="space-y-4">
// //               {state.payments.map((p) => (
// //                 <div key={p.id} className="border rounded-lg p-4">
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
// //                       <select
// //                         value={p.method}
// //                         onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: e.target.value } })}
// //                         className="input-field"
// //                       >
// //                         {PAYMENT_METHODS.map((m) => (
// //                           <option key={m} value={m}>{m}</option>
// //                         ))}
// //                       </select>
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
// //                       <input
// //                         type="number"
// //                         step="0.01"
// //                         min="0"
// //                         value={p.amount}
// //                         onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })}
// //                         className="input-field"
// //                       />
// //                     </div>
// //                     {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
// //                         <select
// //                           value={p.machine}
// //                           onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: e.target.value } })}
// //                           className="input-field"
// //                         >
// //                           <option value="">Selecione a máquina</option>
// //                           {MACHINE_OPTIONS.map((m) => (
// //                             <option key={m.id} value={m.name}>{m.name}</option>
// //                           ))}
// //                         </select>
// //                       </div>
// //                     )}
// //                   </div>
// //                   <div className="mt-3 flex justify-end">
// //                     <button onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} className="text-red-600 hover:text-red-800 text-sm">Remover</button>
// //                   </div>
// //                 </div>
// //               ))}

// //               <div className="flex items-center justify-between">
// //                 <small className="text-gray-600">Dica: use "Adicionar Método" até cobrir o total.</small>
// //                 <button
// //                   onClick={() => dispatch({ type: "ADD_PAYMENT", payload: remaining })}
// //                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
// //                 >
// //                   Adicionar Método
// //                 </button>
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleFinalize}
// //               disabled={state.cart.length === 0 || state.payments.length === 0 || Math.abs(totalPayments - cartTotal) > 0.01}
// //               className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
// //             >
// //               Finalizar Venda
// //             </button>
// //           </div>
// //         </section>
// //       </div>
// //     </div>
// //   )
// // }



// import { useReducer, useEffect, useMemo, useRef } from "react";
// import { toast } from "react-toastify";
// import {
//   PlusIcon,
//   MinusIcon,
//   TrashIcon,
//   CreditCardIcon,
//   UserPlusIcon,
//   ShoppingCartIcon,
//   PrinterIcon,
//   ArrowPathIcon,
//   PauseIcon,
//   PlayIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import PageHeader from "../components/PageHeader";
// import { formatCurrency } from "../utils/format";
// import {
//   fetchProducts,
//   createSale,
//   fetchCustomers,
//   createCustomer,
// } from "../services/api";

// /**
//  * PDV PRO — compatível com seu backend:
//  * - createSale({ items[], payments[], total, ...extras })
//  * Extras enviados (server pode ignorar): subtotal, discount, surcharge, change, notes
//  */

// const MACHINE_OPTIONS = [
//   { id: "machine_a", name: "Máquina A" },
//   { id: "machine_b", name: "Máquina B" },
//   { id: "machine_c", name: "Máquina C" },
// ];

// const PAYMENT_METHODS = [
//   "Dinheiro",
//   "PIX",
//   "Cartão de Crédito",
//   "Cartão de Débito",
//   "Transferência",
// ];

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

//   // pagamentos: {id, method, amount, machine?, installments?}
//   payments: [],

//   // totais
//   discountValue: 0,
//   discountPct: 0, // se > 0, ignora discountValue
//   surchargeValue: 0,

//   printReceipt: true,
//   notes: "",

//   // estacionadas
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
//       return {
//         ...state,
//         products,
//         customers,
//         filteredProducts: available,
//         isLoading: false,
//         parked: readParked(),
//       };
//     }
//     case "SET_LOADING":
//       return { ...state, isLoading: action.payload };
//     case "SET_SEARCH": {
//       const searchTerm = action.payload;
//       const term = searchTerm.trim().toLowerCase();
//       const filtered = term
//         ? state.products.filter((p) =>
//           `${p.name} ${p.brand} ${p.code ?? ""}`
//             .toLowerCase()
//             .includes(term)
//         )
//         : state.products.filter((p) => Number(p.stock) > 0);
//       return { ...state, searchTerm, filteredProducts: filtered };
//     }

//     // ---------- CART ----------
//     case "ADD_TO_CART": {
//       const p = action.payload;
//       const existing = state.cart.find((i) => i.id === p.id);
//       if (existing) {
//         if (existing.quantity >= p.stock) {
//           toast.warning(`Estoque máximo atingido para ${p.name}`);
//           return state;
//         }
//         const cart = state.cart.map((i) =>
//           i.id === p.id
//             ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
//             : i
//         );
//         return { ...state, cart };
//       }
//       return {
//         ...state,
//         cart: [
//           ...state.cart,
//           {
//             id: p.id,
//             name: p.name,
//             brand: p.brand,
//             price: Number(p.price) || 0,
//             quantity: 1,
//             stock: Number(p.stock) || 0,
//             total: Number(p.price) || 0,
//           },
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
//       const cart = state.cart.map((i) =>
//         i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i
//       );
//       return { ...state, cart };
//     }
//     case "CLEAR_CART":
//       return { ...state, cart: [] };

//     // ---------- CLIENTE ----------
//     case "SET_CUSTOMER":
//       return { ...state, selectedCustomerId: action.payload };
//     case "SET_QUICK_CUSTOMER":
//       return { ...state, quickCustomerName: action.payload };
//     case "TOGGLE_QUICK_CUSTOMER":
//       return { ...state, showQuickCustomer: !state.showQuickCustomer };

//     // ---------- PAGAMENTOS ----------
//     case "ADD_PAYMENT": {
//       const remaining = action.payload;
//       if (remaining <= 0) {
//         toast.info("Nada a adicionar — total já coberto.");
//         return state;
//       }
//       const pm = {
//         id: Date.now(),
//         method: "Dinheiro",
//         amount: Number(remaining.toFixed(2)),
//         machine: "",
//         installments: 1,
//       };
//       return { ...state, payments: [...state.payments, pm] };
//     }
//     case "UPDATE_PAYMENT": {
//       const { id, field, value } = action.payload;
//       const payments = state.payments.map((pm) =>
//         pm.id === id
//           ? {
//             ...pm,
//             [field]:
//               field === "amount" || field === "installments"
//                 ? Number(value) || 0
//                 : value,
//             ...(field === "method" &&
//               value !== "Cartão de Crédito" &&
//               value !== "Cartão de Débito"
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

//     // ---------- TOTAIS ----------
//     case "SET_DISCOUNT_VALUE":
//       return { ...state, discountValue: Number(action.payload) || 0, discountPct: 0 };
//     case "SET_DISCOUNT_PCT":
//       return { ...state, discountPct: Number(action.payload) || 0 };
//     case "SET_SURCHARGE":
//       return { ...state, surchargeValue: Number(action.payload) || 0 };

//     // ---------- DIVERSOS ----------
//     case "SET_PRINT":
//       return { ...state, printReceipt: !!action.payload };
//     case "SET_NOTES":
//       return { ...state, notes: action.payload };

//     // ---------- ESTACIONAR ----------
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
//       return {
//         ...state,
//         cart: entry.snapshot.cart,
//         payments: entry.snapshot.payments,
//         selectedCustomerId: entry.snapshot.selectedCustomerId,
//         discountValue: entry.snapshot.discountValue,
//         discountPct: entry.snapshot.discountPct,
//         surchargeValue: entry.snapshot.surchargeValue,
//         notes: entry.snapshot.notes,
//       };
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
//       };
//     default:
//       return state;
//   }
// }

// export default function PDVPro() {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const searchRef = useRef(null);

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

//   // Atalhos
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "F4") {
//         e.preventDefault();
//         searchRef.current?.focus();
//       } else if (e.key === "F2") {
//         e.preventDefault();
//         const remaining = Math.max(0, totalDue - totalPayments);
//         dispatch({ type: "ADD_PAYMENT", payload: remaining });
//       } else if (e.key === "F3") {
//         e.preventDefault();
//         handleFinalize();
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   });

//   // Totais
//   const subtotal = useMemo(
//     () => state.cart.reduce((s, i) => s + i.total, 0),
//     [state.cart]
//   );

//   const discountFromPct = useMemo(() => {
//     const pct = Math.max(0, Math.min(100, state.discountPct || 0));
//     return Number(((subtotal * pct) / 100).toFixed(2));
//   }, [subtotal, state.discountPct]);

//   const discount = state.discountPct > 0 ? discountFromPct : Math.min(state.discountValue || 0, subtotal);
//   const surcharge = Math.max(0, state.surchargeValue || 0);

//   const totalDue = useMemo(
//     () => Math.max(0, Number((subtotal - discount + surcharge).toFixed(2))),
//     [subtotal, discount, surcharge]
//   );

//   const totalPayments = useMemo(
//     () => state.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
//     [state.payments]
//   );

//   const remaining = Number((totalDue - totalPayments).toFixed(2));
//   const change = remaining < 0 ? Math.abs(remaining) : 0;

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
//       dispatch({
//         type: "SET_DATA",
//         payload: { products: state.products, customers: [...state.customers, created] },
//       });
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

//     // Troco permitido — exige total pago >= totalDue
//     if (totalPayments + 0.001 < totalDue) {
//       return toast.error("Pagamentos devem cobrir o total."), false;
//     }
//     const cardPays = state.payments.filter(
//       (p) => p.method === "Cartão de Crédito" || p.method === "Cartão de Débito"
//     );
//     if (cardPays.some((p) => !p.machine)) {
//       return toast.error("Selecione a máquina para todos cartões."), false;
//     }
//     return true;
//   };

//   const openReceipt = (payload) => {
//     try {
//       const toBRL = (n) =>
//         (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
//             `<div>${pm.method}${pm.machine ? " (" + pm.machine + ")" : ""}${pm.installments > 1 ? ` ${pm.installments}x` : ""
//             }: <strong>${toBRL(pm.amount)}</strong></div>`
//         )
//         .join("");

//       const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Recibo</title>
//       <style>
//         body{font-family: Arial, sans-serif; margin:16px}
//         h1{font-size:18px;margin:0}
//         small{color:#555}
//         table{width:100%;border-collapse:collapse;margin-top:8px}
//         th,td{border-bottom:1px solid #eee;padding:6px 4px;font-size:12px}
//         .right{text-align:right}
//         .tot{margin-top:8px;border-top:1px dashed #333;padding-top:8px}
//       </style>
//       <body>
//         <h1>Recibo de Venda</h1>
//         <small>${d.toLocaleString("pt-BR")}</small>
//         <div style="margin-top:6px">Cliente: <strong>${payload.customerName || "—"}</strong></div>
//         <table>
//           <thead><tr><th>Produto</th><th class="right">Qtd</th><th class="right">Unit.</th><th class="right">Total</th></tr></thead>
//           <tbody>${itemsRows}</tbody>
//         </table>
//         <div class="tot">
//           <div>Subtotal: <strong>${toBRL(payload.subtotal)}</strong></div>
//           <div>Desconto: <strong>${toBRL(payload.discount)}</strong> &nbsp; Acréscimo: <strong>${toBRL(payload.surcharge)}</strong></div>
//           <div>Total: <strong>${toBRL(payload.total)}</strong></div>
//           ${payload.change > 0 ? `<div>Troco: <strong>${toBRL(payload.change)}</strong></div>` : ""}
//         </div>
//         <div style="margin-top:8px">${payRows}</div>
//         ${payload.notes ? `<div style="margin-top:8px"><em>${payload.notes}</em></div>` : ""}
//         <script>window.onload=()=>{window.print()};</script>
//       </body></html>`;
//       const w = window.open("", "_blank");
//       w.document.write(html);
//       w.document.close();
//     } catch { }
//   };

//   const handleFinalize = async () => {
//     if (!validateBeforeFinalize()) return;

//     const customerName = state.selectedCustomerId
//       ? state.customers.find((c) => c.id === state.selectedCustomerId)?.name ||
//       "Cliente não identificado"
//       : "Cliente não identificado";

//     const payload = {
//       customerId: state.selectedCustomerId || null,
//       customerName,
//       items: state.cart.map((i) => ({
//         productId: i.id,
//         name: i.name,
//         qty: i.quantity,
//         unitPrice: i.price,
//         total: i.total,
//       })),
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
//       // Recarrega estoque
//       const prods = await fetchProducts();
//       dispatch({
//         type: "SET_DATA",
//         payload: { products: prods, customers: state.customers },
//       });
//     } catch (e) {
//       console.error(e);
//       toast.error("Erro ao finalizar venda");
//     }
//   };

//   // Helpers
//   const firstFiltered = state.filteredProducts[0];

//   return (
//     <div className="relative">
//       <PageHeader title="PDV Pro" subtitle="Carrinho, pagamentos, descontos e troco — rápido e direto." />

//       {/* Top bar: busca + ações rápidas */}
//       <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
//         <div className="flex-1 flex gap-2">
//           <input
//             ref={searchRef}
//             type="text"
//             placeholder="F4 para focar — busque por nome, marca ou código… (Enter para adicionar o 1º)"
//             className="input-field flex-1"
//             value={state.searchTerm}
//             onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && firstFiltered) {
//                 dispatch({ type: "ADD_TO_CART", payload: firstFiltered });
//               }
//             }}
//           />
//           <button
//             onClick={addDefaultPaymentIfEmpty}
//             className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             title="F2 — adiciona método com o restante"
//           >
//             <CreditCardIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => {
//               dispatch({ type: "PARK_CURRENT" });
//               dispatch({ type: "RESET_ALL" });
//             }}
//             className="px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
//             title="Estacionar venda atual"
//           >
//             <PauseIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => dispatch({ type: "LOAD_PARKED" })}
//             className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//             title="Recarregar estacionadas"
//           >
//             <ArrowPathIcon className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="hidden lg:flex items-center text-sm bg-gray-100 rounded-md px-3 py-2">
//           <ShoppingCartIcon className="w-5 h-5 mr-2" /> {state.cart.length} itens
//         </div>
//       </div>

//       {/* Grade: Produtos | Checkout */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* PRODUTOS */}
//         <section className="rounded-xl border bg-white">
//           <header className="flex items-center justify-between p-4 border-b">
//             <span className="font-semibold text-lg">Produtos</span>
//             <span className="text-xs text-gray-500">{state.filteredProducts.length} resultados</span>
//           </header>
//           <div className="p-4">
//             {state.isLoading ? (
//               <div className="text-center py-8">Carregando...</div>
//             ) : state.filteredProducts.length ? (
//               <div className="lg:max-h-[calc(100vh-260px)] overflow-y-auto pr-1 space-y-3">
//                 {state.filteredProducts.map((p) => (
//                   <div key={p.id} className="flex items-center justify-between rounded-xl border px-3 py-3">
//                     <div className="min-w-0">
//                       <div className="truncate font-medium">{p.name}</div>
//                       <div className="text-xs text-gray-500 flex items-center gap-2">
//                         <span className="rounded-md bg-gray-100 px-2 py-[2px]">{p.brand}</span>
//                         <span>Estoque: {p.stock}</span>
//                         {p.code && <span>• Cód: {p.code}</span>}
//                       </div>
//                       <div className="mt-1 font-semibold">{formatCurrency(p.price)}</div>
//                     </div>
//                     <button
//                       onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
//                       disabled={p.stock <= 0}
//                       className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-xl bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
//                       title="Adicionar"
//                     >
//                       <PlusIcon className="w-5 h-5" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">Nenhum produto encontrado.</div>
//             )}
//           </div>
//         </section>

//         {/* CHECKOUT */}
//         <section className="rounded-xl border bg-white flex flex-col">
//           <header className="flex items-center justify-between p-4 border-b">
//             <h2 className="font-semibold text-lg">Checkout</h2>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => dispatch({ type: "CLEAR_CART" })}
//                 className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
//                 title="Limpar carrinho"
//               >
//                 Limpar
//               </button>
//               <button
//                 onClick={() => dispatch({ type: "RESET_ALL" })}
//                 className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
//                 title="Nova venda"
//               >
//                 Nova venda
//               </button>
//             </div>
//           </header>

//           <div className="p-4 space-y-5 overflow-y-auto lg:max-h-[calc(100vh-260px)]">
//             {/* CARRINHO */}
//             <div className="space-y-4">
//               {state.cart.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">Carrinho vazio</div>
//               ) : (
//                 state.cart.map((it) => (
//                   <div key={it.id} className="border rounded-lg p-3">
//                     <div className="font-medium">{it.name}</div>
//                     <div className="text-xs text-gray-500">
//                       {it.brand} • {formatCurrency(it.price)} • estoque {it.stock}
//                     </div>
//                     <div className="mt-2 flex items-center justify-between">
//                       <div className="flex items-center border rounded-md">
//                         <button
//                           onClick={() =>
//                             dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })
//                           }
//                           className="px-2 py-1 text-gray-600 hover:bg-gray-100"
//                         >
//                           <MinusIcon className="w-4 h-4" />
//                         </button>
//                         <input
//                           type="number"
//                           min="1"
//                           className="w-14 text-center outline-none"
//                           value={it.quantity}
//                           onChange={(e) =>
//                             dispatch({
//                               type: "UPDATE_QTY",
//                               payload: { id: it.id, qty: Number(e.target.value) || 1 },
//                             })
//                           }
//                         />
//                         <button
//                           onClick={() =>
//                             dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })
//                           }
//                           className="px-2 py-1 text-gray-600 hover:bg-gray-100"
//                         >
//                           <PlusIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="font-semibold">{formatCurrency(it.total)}</span>
//                         <button
//                           onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })}
//                           className="text-red-500 hover:text-red-700"
//                           title="Remover"
//                         >
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* CLIENTE */}
//             <div className="border rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <label className="block text-sm font-medium text-gray-700">Cliente (opcional)</label>
//                 <label className="flex items-center gap-2 text-xs text-gray-600">
//                   <input
//                     type="checkbox"
//                     checked={state.printReceipt}
//                     onChange={(e) => dispatch({ type: "SET_PRINT", payload: e.target.checked })}
//                   />
//                   Imprimir recibo
//                 </label>
//               </div>
//               <div className="mt-2 flex gap-2 items-center">
//                 <select
//                   className="input-field flex-1"
//                   value={state.selectedCustomerId}
//                   onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: e.target.value })}
//                 >
//                   <option value="">Selecione um cliente</option>
//                   {state.customers.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//                 <button
//                   onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })}
//                   className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                   title="Cadastro rápido"
//                 >
//                   <UserPlusIcon className="w-5 h-5" />
//                 </button>
//               </div>
//               {state.showQuickCustomer && (
//                 <div className="mt-2 flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Nome rápido do cliente"
//                     className="input-field flex-1"
//                     value={state.quickCustomerName}
//                     onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
//                     onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
//                   />
//                   <button
//                     onClick={handleQuickCustomerAdd}
//                     className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                   >
//                     Salvar
//                   </button>
//                 </div>
//               )}
//               <textarea
//                 placeholder="Observações na venda (opcional)"
//                 className="mt-2 input-field w-full"
//                 rows={2}
//                 value={state.notes}
//                 onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })}
//               />
//             </div>

//             {/* DESCONTOS / ACRÉSCIMO */}
//             <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (R$)</label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="input-field w-full pr-8"
//                     value={state.discountPct > 0 ? 0 : state.discountValue}
//                     onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })}
//                   />
//                   {state.discountPct > 0 && (
//                     <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//                       (usando %)
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   step="0.1"
//                   className="input-field w-full"
//                   value={state.discountPct}
//                   onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Acréscimo (R$)</label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   className="input-field w-full"
//                   value={state.surchargeValue}
//                   onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })}
//                 />
//               </div>
//             </div>

//             {/* RESUMO */}
//             <div className="rounded-lg bg-gray-50 px-4 py-4 grid grid-cols-2 gap-3 text-sm">
//               <div>Subtotal</div>
//               <div className="text-right font-medium">{formatCurrency(subtotal)}</div>
//               <div>Desconto</div>
//               <div className="text-right">- {formatCurrency(discount)}</div>
//               <div>Acréscimo</div>
//               <div className="text-right">+ {formatCurrency(surcharge)}</div>
//               <div className="col-span-2 border-t pt-2 flex justify-between">
//                 <strong>Total a pagar</strong>
//                 <strong>{formatCurrency(totalDue)}</strong>
//               </div>
//               <div>Total Pago</div>
//               <div className="text-right font-medium">{formatCurrency(totalPayments)}</div>
//               <div>Restante</div>
//               <div className={`text-right font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>
//                 {formatCurrency(Math.max(0, remaining))}
//               </div>
//               {change > 0 && (
//                 <>
//                   <div>Troco</div>
//                   <div className="text-right font-bold">{formatCurrency(change)}</div>
//                 </>
//               )}
//             </div>

//             {/* PAGAMENTOS */}
//             <div className="space-y-4">
//               {state.payments.map((p) => (
//                 <div key={p.id} className="border rounded-lg p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
//                       <select
//                         value={p.method}
//                         onChange={(e) =>
//                           dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: e.target.value } })
//                         }
//                         className="input-field"
//                       >
//                         {PAYMENT_METHODS.map((m) => (
//                           <option key={m} value={m}>
//                             {m}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={p.amount}
//                         onChange={(e) =>
//                           dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })
//                         }
//                         className="input-field"
//                       />
//                     </div>
//                     {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
//                       <>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
//                           <select
//                             value={p.machine}
//                             onChange={(e) =>
//                               dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: e.target.value } })
//                             }
//                             className="input-field"
//                           >
//                             <option value="">Selecione a máquina</option>
//                             {MACHINE_OPTIONS.map((m) => (
//                               <option key={m.id} value={m.name}>
//                                 {m.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         {p.method === "Cartão de Crédito" && (
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
//                             <input
//                               type="number"
//                               min="1"
//                               step="1"
//                               value={p.installments || 1}
//                               onChange={(e) =>
//                                 dispatch({
//                                   type: "UPDATE_PAYMENT",
//                                   payload: { id: p.id, field: "installments", value: e.target.value },
//                                 })
//                               }
//                               className="input-field"
//                             />
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                   <div className="mt-3 flex justify-between">
//                     <button
//                       onClick={() =>
//                         dispatch({
//                           type: "UPDATE_PAYMENT",
//                           payload: { id: p.id, field: "amount", value: Math.max(0, totalDue - totalPayments + p.amount) },
//                         })
//                       }
//                       className="text-xs text-gray-600 hover:underline"
//                       title="Preencher com restante"
//                     >
//                       Usar restante
//                     </button>
//                     <button
//                       onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })}
//                       className="text-red-600 hover:text-red-800 text-sm"
//                     >
//                       Remover
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <div className="flex items-center justify-between">
//                 <small className="text-gray-600">Dica: F2 adiciona o restante automaticamente.</small>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })}
//                     className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
//                     title="Limpar pagamentos"
//                   >
//                     <XMarkIcon className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })}
//                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                   >
//                     Adicionar Método
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* FINALIZAR */}
//             <div className="sticky bottom-0 bg-white pt-2">
//               <button
//                 onClick={handleFinalize}
//                 disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue}
//                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
//                 title="F3"
//               >
//                 <PrinterIcon className="w-5 h-5" />
//                 Finalizar Venda — {formatCurrency(totalDue)}
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* VENDAS ESTACIONADAS */}
//       {state.parked.length > 0 && (
//         <div className="mt-6 rounded-xl border bg-white">
//           <header className="flex items-center justify-between p-4 border-b">
//             <h3 className="font-semibold">Vendas Estacionadas</h3>
//             <span className="text-xs text-gray-500">{state.parked.length}</span>
//           </header>
//           <div className="p-4 space-y-2">
//             {state.parked.map((p) => (
//               <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
//                 <div className="text-sm">
//                   <div className="font-medium">#{p.id}</div>
//                   <div className="text-gray-600">
//                     {new Date(p.createdAt).toLocaleString("pt-BR")} • {p.snapshot.cart.length} itens
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => {
//                       dispatch({ type: "RESUME_PARKED", payload: p.id });
//                       toast.info("Venda retomada no checkout.");
//                     }}
//                     className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
//                   >
//                     <PlayIcon className="w-4 h-4" /> Retomar
//                   </button>
//                   <button
//                     onClick={() => dispatch({ type: "DELETE_PARKED", payload: p.id })}
//                     className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
//                   >
//                     Excluir
//                   </button>
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
import { useReducer, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  PrinterIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import PageHeader from "../components/PageHeader";
import { formatCurrency } from "../utils/format";
import {
  fetchProducts,
  createSale,
  fetchCustomers,
  createCustomer,
} from "../services/api";

/**
 * PDV PRO — compatível com seu backend:
 * - createSale({ items[], payments[], total, ...extras })
 * Extras enviados (server pode ignorar): subtotal, discount, surcharge, change, notes
 */

const MACHINE_OPTIONS = [
  { id: "machine_a", name: "Máquina A" },
  { id: "machine_b", name: "Máquina B" },
  { id: "machine_c", name: "Máquina C" },
];

const PAYMENT_METHODS = [
  "Dinheiro",
  "PIX",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Transferência",
];

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

  // pagamentos: {id, method, amount, machine?, installments?}
  payments: [],

  // totais
  discountValue: 0,
  discountPct: 0, // se > 0, ignora discountValue
  surchargeValue: 0,

  printReceipt: true,
  notes: "",

  // estacionadas
  parked: [], // [{id, createdAt, snapshot}]
};

function readParked() {
  try { const raw = localStorage.getItem(PARKED_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function writeParked(arr) { localStorage.setItem(PARKED_KEY, JSON.stringify(arr)); }

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA": {
      const { products, customers } = action.payload;
      const available = products.filter((p) => Number(p.stock) > 0);
      return { ...state, products, customers, filteredProducts: available, isLoading: false, parked: readParked() };
    }
    case "SET_LOADING": return { ...state, isLoading: action.payload };
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
        if (existing.quantity >= p.stock) { toast.warning(`Estoque máximo atingido para ${p.name}`); return state; }
        const cart = state.cart.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
        return { ...state, cart };
      }
      return { ...state, cart: [...state.cart, { id: p.id, name: p.name, brand: p.brand, price: Number(p.price)||0, quantity: 1, stock: Number(p.stock)||0, total: Number(p.price)||0 }] };
    }
    case "REMOVE_FROM_CART": return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) return state;
      const it = state.cart.find((i) => i.id === id); if (!it) return state;
      if (qty > it.stock) { toast.warning(`Estoque máximo atingido para ${it.name}`); return state; }
      const cart = state.cart.map((i) => (i.id === id ? { ...i, quantity: qty, total: qty * i.price } : i));
      return { ...state, cart };
    }
    case "CLEAR_CART": return { ...state, cart: [] };

    // CLIENTE
    case "SET_CUSTOMER": return { ...state, selectedCustomerId: action.payload };
    case "SET_QUICK_CUSTOMER": return { ...state, quickCustomerName: action.payload };
    case "TOGGLE_QUICK_CUSTOMER": return { ...state, showQuickCustomer: !state.showQuickCustomer };

    // PAGAMENTOS
    case "ADD_PAYMENT": {
      const remaining = action.payload;
      if (remaining <= 0) { toast.info("Nada a adicionar — total já coberto."); return state; }
      const pm = { id: Date.now(), method: "Dinheiro", amount: Number(remaining.toFixed(2)), machine: "", installments: 1 };
      return { ...state, payments: [...state.payments, pm] };
    }
    case "UPDATE_PAYMENT": {
      const { id, field, value } = action.payload;
      const payments = state.payments.map((pm) =>
        pm.id === id
          ? { ...pm,
              [field]: (field === "amount" || field === "installments") ? (Number(value) || 0) : value,
              ...(field === "method" && value !== "Cartão de Crédito" && value !== "Cartão de Débito" ? { machine: "", installments: 1 } : {}),
            }
          : pm
      );
      return { ...state, payments };
    }
    case "REMOVE_PAYMENT": return { ...state, payments: state.payments.filter((p) => p.id !== action.payload) };
    case "CLEAR_PAYMENTS": return { ...state, payments: [] };

    // TOTAIS
    case "SET_DISCOUNT_VALUE": return { ...state, discountValue: Number(action.payload) || 0, discountPct: 0 };
    case "SET_DISCOUNT_PCT": return { ...state, discountPct: Number(action.payload) || 0 };
    case "SET_SURCHARGE": return { ...state, surchargeValue: Number(action.payload) || 0 };

    // OUTROS
    case "SET_PRINT": return { ...state, printReceipt: !!action.payload };
    case "SET_NOTES": return { ...state, notes: action.payload };

    // ESTACIONAR
    case "LOAD_PARKED": return { ...state, parked: readParked() };
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
      return { ...initialState, products: state.products, customers: state.customers, filteredProducts: state.filteredProducts, parked: state.parked };
    default:
      return state;
  }
}

export default function PDVPro() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showProducts, setShowProducts] = useState(true); // <- NOVO: mostrar/ocultar coluna de produtos
  const searchRef = useRef(null);

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

  // Atalhos
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "F4") { e.preventDefault(); searchRef.current?.focus();
      } else if (e.key === "F2") { e.preventDefault(); dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) });
      } else if (e.key === "F3") { e.preventDefault(); handleFinalize();
      } else if (e.key === "F8") { e.preventDefault(); setShowProducts((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
      const itemsRows = payload.items.map((it) => `<tr><td>${it.name}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${toBRL(it.unitPrice)}</td><td style="text-align:right">${toBRL(it.total)}</td></tr>`).join("");
      const payRows = (payload.payments || []).map((pm) => `<div>${pm.method}${pm.machine ? " (" + pm.machine + ")" : ""}${pm.installments > 1 ? ` ${pm.installments}x` : ""}: <strong>${toBRL(pm.amount)}</strong></div>`).join("");
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
      const w = window.open("", "_blank"); w.document.write(html); w.document.close();
    } catch {}
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
      subtotal, discount, surcharge,
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

  return (
    <div className="relative">
      <PageHeader title="PDV Pro" subtitle="Checkout em destaque. Produtos como apoio, sem roubar a cena." />

      {/* Top bar */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex-1 flex gap-2">
          <input
            ref={searchRef}
            type="text"
            placeholder="F4 para focar — busque por nome, marca ou código… (Enter adiciona o 1º resultado)"
            className="input-field flex-1"
            value={state.searchTerm}
            onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter" && firstFiltered) dispatch({ type: "ADD_TO_CART", payload: firstFiltered }); }}
          />
          <button onClick={addDefaultPaymentIfEmpty} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" title="F2 — adiciona método com o restante">
            <CreditCardIcon className="w-5 h-5" />
          </button>
          <button onClick={() => { dispatch({ type: "PARK_CURRENT" }); dispatch({ type: "RESET_ALL" }); }} className="px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700" title="Estacionar venda atual">
            <PauseIcon className="w-5 h-5" />
          </button>
          <button onClick={() => dispatch({ type: "LOAD_PARKED" })} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" title="Recarregar estacionadas">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProducts((v) => !v)}
            className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            title="F8 — mostrar/ocultar lista de produtos"
          >
            {showProducts ? <><EyeSlashIcon className="w-5 h-5 inline mr-1" /> Ocultar produtos</> : <><EyeIcon className="w-5 h-5 inline mr-1" /> Mostrar produtos</>}
          </button>
          <div className="hidden lg:flex items-center text-sm bg-gray-100 rounded-md px-3 py-2">
            <ShoppingCartIcon className="w-5 h-5 mr-2" /> {state.cart.length} itens
          </div>
        </div>
      </div>

      {/* GRID: Checkout (maior) | Produtos (compacto) */}
      <div className={`grid grid-cols-12 gap-4 xl:gap-6`}>
        {/* CHECKOUT — 9/12 no desktop, 100% no mobile */}
        <section className="col-span-12 xl:col-span-9 2xl:col-span-9 rounded-xl border bg-white flex flex-col">
          <header className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">Checkout</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => dispatch({ type: "CLEAR_CART" })} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200" title="Limpar carrinho">Limpar</button>
              <button onClick={() => dispatch({ type: "RESET_ALL" })} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200" title="Nova venda">Nova venda</button>
            </div>
          </header>

          {/* altura generosa + scroll interno */}
          <div className="p-4 space-y-5 overflow-y-auto h-[calc(100vh-260px)]">
            {/* CARRINHO */}
            <div className="space-y-4">
              {state.cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Carrinho vazio</div>
              ) : (
                state.cart.map((it) => (
                  <div key={it.id} className="border rounded-lg p-3">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">{it.brand} • {formatCurrency(it.price)} • estoque {it.stock}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity - 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><MinusIcon className="w-4 h-4" /></button>
                        <input type="number" min="1" className="w-14 text-center outline-none" value={it.quantity} onChange={(e) => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: Number(e.target.value) || 1 } })} />
                        <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: it.id, qty: it.quantity + 1 } })} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><PlusIcon className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatCurrency(it.total)}</span>
                        <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: it.id })} className="text-red-500 hover:text-red-700" title="Remover"><TrashIcon className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CLIENTE */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Cliente (opcional)</label>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={state.printReceipt} onChange={(e) => dispatch({ type: "SET_PRINT", payload: e.target.checked })} />
                  Imprimir recibo
                </label>
              </div>
              <div className="mt-2 flex gap-2 items-center">
                <select className="input-field flex-1" value={state.selectedCustomerId} onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: e.target.value })}>
                  <option value="">Selecione um cliente</option>
                  {state.customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <button onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" title="Cadastro rápido">
                  <UserPlusIcon className="w-5 h-5" />
                </button>
              </div>
              {state.showQuickCustomer && (
                <div className="mt-2 flex gap-2">
                  <input type="text" placeholder="Nome rápido do cliente" className="input-field flex-1" value={state.quickCustomerName} onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()} />
                  <button onClick={handleQuickCustomerAdd} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Salvar</button>
                </div>
              )}
              <textarea placeholder="Observações na venda (opcional)" className="mt-2 input-field w-full" rows={2} value={state.notes} onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })} />
            </div>

            {/* DESCONTOS / ACRÉSCIMO */}
            <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (R$)</label>
                <div className="relative">
                  <input type="number" min="0" step="0.01" className="input-field w-full pr-8" value={state.discountPct > 0 ? 0 : state.discountValue} onChange={(e) => dispatch({ type: "SET_DISCOUNT_VALUE", payload: e.target.value })} />
                  {state.discountPct > 0 && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">(usando %)</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
                <input type="number" min="0" max="100" step="0.1" className="input-field w-full" value={state.discountPct} onChange={(e) => dispatch({ type: "SET_DISCOUNT_PCT", payload: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acréscimo (R$)</label>
                <input type="number" min="0" step="0.01" className="input-field w-full" value={state.surchargeValue} onChange={(e) => dispatch({ type: "SET_SURCHARGE", payload: e.target.value })} />
              </div>
            </div>

            {/* RESUMO */}
            <div className="rounded-lg bg-gray-50 px-4 py-4 grid grid-cols-2 gap-3 text-sm">
              <div>Subtotal</div><div className="text-right font-medium">{formatCurrency(subtotal)}</div>
              <div>Desconto</div><div className="text-right">- {formatCurrency(discount)}</div>
              <div>Acréscimo</div><div className="text-right">+ {formatCurrency(surcharge)}</div>
              <div className="col-span-2 border-t pt-2 flex justify-between"><strong>Total a pagar</strong><strong>{formatCurrency(totalDue)}</strong></div>
              <div>Total Pago</div><div className="text-right font-medium">{formatCurrency(totalPayments)}</div>
              <div>Restante</div><div className={`text-right font-bold ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>{formatCurrency(Math.max(0, remaining))}</div>
              {change > 0 && (<><div>Troco</div><div className="text-right font-bold">{formatCurrency(change)}</div></>)}
            </div>

            {/* PAGAMENTOS */}
            <div className="space-y-4">
              {state.payments.map((p) => (
                <div key={p.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                      <select value={p.method} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "method", value: e.target.value } })} className="input-field">
                        {PAYMENT_METHODS.map((m) => (<option key={m} value={m}>{m}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                      <input type="number" step="0.01" min="0" value={p.amount} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: e.target.value } })} className="input-field" />
                    </div>
                    {(p.method === "Cartão de Crédito" || p.method === "Cartão de Débito") && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
                          <select value={p.machine} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "machine", value: e.target.value } })} className="input-field">
                            <option value="">Selecione a máquina</option>
                            {MACHINE_OPTIONS.map((m) => (<option key={m.id} value={m.name}>{m.name}</option>))}
                          </select>
                        </div>
                        {p.method === "Cartão de Crédito" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                            <input type="number" min="1" step="1" value={p.installments || 1} onChange={(e) => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "installments", value: e.target.value } })} className="input-field" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="mt-3 flex justify-between">
                    <button onClick={() => dispatch({ type: "UPDATE_PAYMENT", payload: { id: p.id, field: "amount", value: Math.max(0, totalDue - totalPayments + p.amount) } })} className="text-xs text-gray-600 hover:underline" title="Preencher com restante">Usar restante</button>
                    <button onClick={() => dispatch({ type: "REMOVE_PAYMENT", payload: p.id })} className="text-red-600 hover:text-red-800 text-sm">Remover</button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <small className="text-gray-600">Dica: F2 adiciona o restante automaticamente.</small>
                <div className="flex items-center gap-2">
                  <button onClick={() => dispatch({ type: "CLEAR_PAYMENTS" })} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" title="Limpar pagamentos">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => dispatch({ type: "ADD_PAYMENT", payload: Math.max(0, totalDue - totalPayments) })} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Adicionar Método</button>
                </div>
              </div>
            </div>

            {/* FINALIZAR */}
            <div className="sticky bottom-0 bg-white pt-2">
              <button onClick={handleFinalize} disabled={state.cart.length === 0 || totalPayments + 0.001 < totalDue} className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2" title="F3">
                <PrinterIcon className="w-5 h-5" />
                Finalizar Venda — {formatCurrency(totalDue)}
              </button>
            </div>
          </div>
        </section>

        {/* PRODUTOS — 3/12 no desktop; pode ocultar */}
        {showProducts && (
          <section className="col-span-12 xl:col-span-3 2xl:col-span-3 rounded-xl border bg-white">
            <header className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-lg">Produtos</span>
              <span className="text-xs text-gray-500">{state.filteredProducts.length} resultados</span>
            </header>
            <div className="p-3">
              {state.isLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : state.filteredProducts.length ? (
                <div className="overflow-y-auto h-[calc(100vh-300px)] pr-1 space-y-2">
                  {state.filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => dispatch({ type: "ADD_TO_CART", payload: p })}
                      disabled={p.stock <= 0}
                      className="w-full text-left rounded-lg border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                      title="Adicionar ao carrinho"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="truncate font-medium text-sm">{p.name}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2">
                            <span className="rounded bg-gray-100 px-1.5 py-px">{p.brand}</span>
                            <span>Est.: {p.stock}</span>
                            {p.code && <span>• {p.code}</span>}
                          </div>
                        </div>
                        <div className="shrink-0 font-semibold text-sm">{formatCurrency(p.price)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Nenhum produto encontrado.</div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* VENDAS ESTACIONADAS */}
      {state.parked.length > 0 && (
        <div className="mt-6 rounded-xl border bg-white">
          <header className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Vendas Estacionadas</h3>
            <span className="text-xs text-gray-500">{state.parked.length}</span>
          </header>
          <div className="p-4 space-y-2">
            {state.parked.map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="text-sm">
                  <div className="font-medium">#{p.id}</div>
                  <div className="text-gray-600">{new Date(p.createdAt).toLocaleString("pt-BR")} • {p.snapshot.cart.length} itens</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { dispatch({ type: "RESUME_PARKED", payload: p.id }); toast.info("Venda retomada no checkout."); }} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1">
                    <PlayIcon className="w-4 h-4" /> Retomar
                  </button>
                  <button onClick={() => dispatch({ type: "DELETE_PARKED", payload: p.id })} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

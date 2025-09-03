// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline"
// import PageHeader from "../components/PageHeader"
// import Card from "../components/Card"
// import { formatCurrency } from "../utils/format"
// import { fetchProducts, fetchCustomers, createQuote } from "../services/api"

// const AddQuote = () => {
//   const navigate = useNavigate()
//   const [products, setProducts] = useState([])
//   const [customers, setCustomers] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedItems, setSelectedItems] = useState([])
//   const [selectedCustomer, setSelectedCustomer] = useState("")
//   const [notes, setNotes] = useState("")

//   useEffect(() => {
//     loadData()
//   }, [])

//   const loadData = async () => {
//     try {
//       setIsLoading(true)
//       const [productsData, customersData] = await Promise.all([fetchProducts(), fetchCustomers()])
//       setProducts(productsData.filter((p) => p.stock > 0))
//       setCustomers(customersData)
//     } catch (error) {
//       console.error("Error loading data:", error)
//       toast.error("Erro ao carregar dados")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const addProduct = (product) => {
//     const existingItem = selectedItems.find((item) => item.id === product.id)

//     if (existingItem) {
//       if (existingItem.quantity >= product.stock) {
//         toast.warning(`Estoque máximo atingido para ${product.name}`)
//         return
//       }

//       setSelectedItems(
//         selectedItems.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
//             : item,
//         ),
//       )
//     } else {
//       setSelectedItems([
//         ...selectedItems,
//         {
//           id: product.id,
//           name: product.name,
//           brand: product.brand,
//           price: product.price,
//           quantity: 1,
//           stock: product.stock,
//           total: product.price,
//         },
//       ])
//     }
//   }

//   const removeItem = (productId) => {
//     setSelectedItems(selectedItems.filter((item) => item.id !== productId))
//   }

//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity <= 0) return

//     const product = selectedItems.find((item) => item.id === productId)
//     if (newQuantity > product.stock) {
//       toast.warning(`Estoque máximo atingido para ${product.name}`)
//       return
//     }

//     setSelectedItems(
//       selectedItems.map((item) =>
//         item.id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
//       ),
//     )
//   }

//   const getTotal = () => {
//     return selectedItems.reduce((sum, item) => sum + item.total, 0)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (selectedItems.length === 0) {
//       toast.error("Adicione pelo menos um produto ao orçamento")
//       return
//     }

//     try {
//       const customerName = selectedCustomer
//         ? customers.find((c) => c.id === selectedCustomer)?.name
//         : "Cliente não informado"

//       const quoteData = {
//         customerId: selectedCustomer || null,
//         customerName,
//         items: selectedItems,
//         total: getTotal(),
//         notes,
//         date: new Date().toISOString(),
//       }

//       await createQuote(quoteData)
//       toast.success("Orçamento criado com sucesso")
//       navigate("/quotes")
//     } catch (error) {
//       console.error("Error creating quote:", error)
//       toast.error("Erro ao criar orçamento")
//     }
//   }

//   if (isLoading) {
//     return <div className="text-center py-8">Carregando...</div>
//   }

//   return (
//     <div>
//       <PageHeader title="Novo Orçamento" />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Products Selection */}
//         <Card title="Selecionar Produtos">
//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {products.map((product) => (
//               <div key={product.id} className="border rounded-lg p-4">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <h4 className="font-medium">{product.name}</h4>
//                     <p className="text-sm text-gray-500">
//                       {product.brand} • Estoque: {product.stock}
//                     </p>
//                     <p className="font-medium text-blue-600">{formatCurrency(product.price)}</p>
//                   </div>
//                   <button
//                     onClick={() => addProduct(product)}
//                     className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
//                   >
//                     Adicionar
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Quote Details */}
//         <Card title="Detalhes do Orçamento">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
//               <select
//                 value={selectedCustomer}
//                 onChange={(e) => setSelectedCustomer(e.target.value)}
//                 className="input-field"
//               >
//                 <option value="">Selecione um cliente</option>
//                 {customers.map((customer) => (
//                   <option key={customer.id} value={customer.id}>
//                     {customer.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 rows={3}
//                 className="input-field"
//                 placeholder="Observações sobre o orçamento..."
//               />
//             </div>

//             {/* Selected Items */}
//             <div>
//               <h3 className="font-medium text-gray-700 mb-3">Itens Selecionados</h3>
//               {selectedItems.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">Nenhum item selecionado</p>
//               ) : (
//                 <div className="space-y-3">
//                   {selectedItems.map((item) => (
//                     <div key={item.id} className="border rounded-lg p-3">
//                       <div className="flex justify-between items-center">
//                         <div className="flex-1">
//                           <p className="font-medium">{item.name}</p>
//                           <p className="text-sm text-gray-500">{formatCurrency(item.price)} cada</p>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className="flex items-center border rounded-md">
//                             <button
//                               type="button"
//                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                               className="px-2 py-1 text-gray-600 hover:bg-gray-100"
//                             >
//                               <MinusIcon className="w-4 h-4" />
//                             </button>
//                             <span className="px-3">{item.quantity}</span>
//                             <button
//                               type="button"
//                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                               className="px-2 py-1 text-gray-600 hover:bg-gray-100"
//                             >
//                               <PlusIcon className="w-4 h-4" />
//                             </button>
//                           </div>
//                           <span className="font-medium w-20 text-right">{formatCurrency(item.total)}</span>
//                           <button
//                             type="button"
//                             onClick={() => removeItem(item.id)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <TrashIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Total */}
//             <div className="border-t pt-4">
//               <div className="flex justify-between items-center text-lg font-bold">
//                 <span>Total:</span>
//                 <span>{formatCurrency(getTotal())}</span>
//               </div>
//             </div>

//             <button type="submit" className="w-full btn-primary" disabled={selectedItems.length === 0}>
//               Criar Orçamento
//             </button>
//           </form>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default AddQuote



"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchProducts, fetchCustomers, createQuote } from "../services/api";

// Ícone de busca inline (padrão)
const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const AddQuote = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, customersData] = await Promise.all([
        fetchProducts(),
        fetchCustomers(),
      ]);
      setProducts((productsData || []).filter((p) => Number(p.stock) > 0));
      setCustomers(customersData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = (product) => {
    const existing = selectedItems.find((i) => i.id === product.id);
    if (existing) {
      if (existing.quantity >= Number(product.stock)) {
        toast.warning(`Estoque máximo atingido para ${product.name}`);
        return;
      }
      setSelectedItems((prev) =>
        prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * Number(i.price) }
            : i
        )
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: Number(product.price) || 0,
          quantity: 1,
          stock: Number(product.stock) || 0,
          total: Number(product.price) || 0,
        },
      ]);
    }
  };

  const removeItem = (productId) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) return;
    const item = selectedItems.find((i) => i.id === productId);
    if (!item) return;
    if (newQty > Number(item.stock)) {
      toast.warning(`Estoque máximo atingido para ${item.name}`);
      return;
    }
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity: newQty, total: newQty * Number(i.price) } : i))
    );
  };

  const total = useMemo(
    () => selectedItems.reduce((sum, i) => sum + Number(i.total || 0), 0),
    [selectedItems]
  );

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.brand, p.code].filter(Boolean).some((f) => String(f).toLowerCase().includes(q))
    );
  }, [products, query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("Adicione pelo menos um produto ao orçamento");
      return;
    }
    try {
      const customerName = selectedCustomer
        ? customers.find((c) => String(c.id) === String(selectedCustomer))?.name
        : "Cliente não informado";
      const payload = {
        customerId: selectedCustomer || null,
        customerName,
        items: selectedItems,
        total,
        notes,
        date: new Date().toISOString(),
      };
      await createQuote(payload);
      toast.success("Orçamento criado com sucesso");
      navigate("/quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.error("Erro ao criar orçamento");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center"><span className="text-gray-600">Carregando...</span></div>
    );
  }

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Orçamento</h1>
        <p className="text-sm text-gray-500">Selecione produtos, ajuste quantidades e salve a proposta</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Seleção de produtos */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Selecionar Produtos</h3>
            <p className="text-sm text-gray-500">{products.length} itens disponíveis em estoque</p>

            {/* Busca */}
            <div className="relative mt-4">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, marca ou código"
                className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto px-6 py-4">
            {filteredProducts.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">Nenhum produto encontrado</div>
            ) : (
              <ul className="space-y-3">
                {filteredProducts.map((p) => (
                  <li key={p.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-gray-900">{p.name}</h4>
                        <p className="truncate text-xs text-gray-500">{p.brand || "—"} • Estoque: {p.stock}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(p.price)}</p>
                      </div>
                      <button
                        onClick={() => addProduct(p)}
                        disabled={Number(p.stock) <= 0}
                        className="inline-flex items-center justify-center rounded-md btn-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Adicionar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Detalhes do orçamento */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Detalhes do Orçamento</h3>
            <p className="text-sm text-gray-500">Defina cliente, observações e confira os itens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            {/* Cliente */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cliente (opcional)</label>
              <div className="relative">
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações sobre o orçamento..."
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
              />
            </div>

            {/* Itens selecionados */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700">Itens Selecionados</h4>
              {selectedItems.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">Nenhum item selecionado</div>
              ) : (
                <ul className="space-y-3">
                  {selectedItems.map((item) => (
                    <li key={item.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.price)} cada • Estoque: {item.stock}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="w-24 text-right text-sm font-semibold text-gray-900">
                            {formatCurrency(item.total)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remover"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedItems.length === 0}
              className="w-full rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Criar Orçamento
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuote;

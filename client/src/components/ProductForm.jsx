// "use client"

// import { useState, useEffect } from "react"
// import { fetchSuppliers } from "../services/api"

// const ProductForm = ({ initialData = {}, onSubmit, buttonText = "Salvar" }) => {
//   const [suppliers, setSuppliers] = useState([])
//   const [formData, setFormData] = useState({
//     name: initialData.name || "",
//     brand: initialData.brand || "",
//     compatibleModel: initialData.compatibleModel || "",
//     stock: initialData.stock || 0,
//     price: initialData.price || 0,
//     costPrice: initialData.costPrice || 0,
//     code: initialData.code || "",
//     supplierId: initialData.supplierId || "",
//   })

//   useEffect(() => {
//     loadSuppliers()
//   }, [])

//   const loadSuppliers = async () => {s
//     try {
//       const data = await fetchSuppliers()
//       setSuppliers(data)
//     } catch (error) {
//       console.error("Error loading suppliers:", error)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: name === "stock" || name === "price" || name === "costPrice" ? Number(value) : value,
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onSubmit(formData)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//             Nome do Produto *
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="input-field"
//           />
//         </div>

//         <div>
//           <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
//             Marca *
//           </label>
//           <input
//             type="text"
//             id="brand"
//             name="brand"
//             value={formData.brand}
//             onChange={handleChange}
//             required
//             className="input-field"
//           />
//         </div>

//         <div>
//           <label htmlFor="compatibleModel" className="block text-sm font-medium text-gray-700 mb-1">
//             Modelo Compatível *
//           </label>
//           <input
//             type="text"
//             id="compatibleModel"
//             name="compatibleModel"
//             value={formData.compatibleModel}
//             onChange={handleChange}
//             required
//             className="input-field"
//           />
//         </div>

//         <div>
//           <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
//             Quantidade em Estoque *
//           </label>
//           <input
//             type="number"
//             id="stock"
//             name="stock"
//             value={formData.stock}
//             onChange={handleChange}
//             min="0"
//             required
//             className="input-field"
//           />
//         </div>

//         <div>
//           <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
//             Valor de Custo (R$) *
//           </label>
//           <input
//             type="number"
//             id="costPrice"
//             name="costPrice"
//             value={formData.costPrice}
//             onChange={handleChange}
//             min="0"
//             step="0.01"
//             required
//             className="input-field"
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//             Preço de Venda (R$) *
//           </label>
//           <input
//             type="number"
//             id="price"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             min="0"
//             step="0.01"
//             required
//             className="input-field"
//           />
//         </div>

//         <div>
//           <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
//             Fornecedor
//           </label>
//           <select
//             id="supplierId"
//             name="supplierId"
//             value={formData.supplierId}
//             onChange={handleChange}
//             className="input-field"
//           >
//             <option value="">Selecione um fornecedor</option>
//             {suppliers.map((supplier) => (
//               <option key={supplier.id} value={supplier.id}>
//                 {supplier.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
//             Código do Produto (opcional)
//           </label>
//           <input
//             type="text"
//             id="code"
//             name="code"
//             value={formData.code}
//             onChange={handleChange}
//             className="input-field"
//           />
//         </div>
//       </div>

//       {formData.costPrice > 0 && formData.price > 0 && (
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <h3 className="font-medium text-blue-800 mb-2">Análise de Margem</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <p className="text-sm text-blue-600">Custo</p>
//               <p className="font-medium">
//                 {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(formData.costPrice)}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-blue-600">Venda</p>
//               <p className="font-medium">
//                 {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(formData.price)}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-blue-600">Margem</p>
//               <p className="font-medium text-green-600">
//                 {(((formData.price - formData.costPrice) / formData.costPrice) * 100).toFixed(2)}%
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-end">
//         <button type="submit" className="btn-primary">
//           {buttonText}
//         </button>
//       </div>
//     </form>
//   )
// }

// export default ProductForm




"use client"

import { useState, useEffect } from "react"
import { fetchSuppliers } from "../services/api"

const ProductForm = ({ initialData = {}, onSubmit, buttonText = "Salvar" }) => {
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    brand: initialData.brand || "",
    compatibleModel: initialData.compatibleModel || "",
    stock: initialData.stock || 0,
    lowStock: initialData.lowStock ?? 5, // ⬅️ NOVO: alerta configurável
    price: initialData.price || 0,
    costPrice: initialData.costPrice || 0,
    code: initialData.code || "",
    supplierId: initialData.supplierId || "",
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Error loading suppliers:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]:
        name === "stock" ||
        name === "lowStock" || // ⬅️ NOVO: tratar como número
        name === "price" ||
        name === "costPrice"
          ? Number(value)
          : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData) // formData já contém lowStock
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="compatibleModel" className="block text-sm font-medium text-gray-700 mb-1">
            Modelo Compatível *
          </label>
          <input
            type="text"
            id="compatibleModel"
            name="compatibleModel"
            value={formData.compatibleModel}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade em Estoque *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="input-field"
          />
        </div>

        {/* ⬇️ NOVO CAMPO: você define o número do alerta livremente */}
        <div>
          <label htmlFor="lowStock" className="block text-sm font-medium text-gray-700 mb-1">
            Estoque mínimo (alerta) *
          </label>
          <input
            type="number"
            id="lowStock"
            name="lowStock"
            value={formData.lowStock}
            onChange={handleChange}
            min="0"
            required
            className="input-field"
            placeholder="Ex.: 5 (avisa quando chegar a 5 ou menos)"
          />
        </div>

        <div>
          <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Valor de Custo (R$) *
          </label>
          <input
            type="number"
            id="costPrice"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Preço de Venda (R$) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
            Fornecedor
          </label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código do Produto (opcional)
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      {formData.costPrice > 0 && formData.price > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Análise de Margem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600">Custo</p>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(formData.costPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Venda</p>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(formData.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Margem</p>
              <p className="font-medium text-green-600">
                {(((formData.price - formData.costPrice) / formData.costPrice) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          {buttonText}
        </button>
      </div>
    </form>
  )
}

export default ProductForm

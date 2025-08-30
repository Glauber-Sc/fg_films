// // "use client"

// // import { useState, useEffect } from "react"
// // import { fetchSuppliers } from "../services/api"

// // const ProductForm = ({ initialData = {}, onSubmit, buttonText = "Salvar" }) => {
// //   const [suppliers, setSuppliers] = useState([])
// //   const [formData, setFormData] = useState({
// //     name: initialData.name || "",
// //     brand: initialData.brand || "",
// //     compatibleModel: initialData.compatibleModel || "",
// //     stock: initialData.stock || 0,
// //     price: initialData.price || 0,
// //     costPrice: initialData.costPrice || 0,
// //     code: initialData.code || "",
// //     supplierId: initialData.supplierId || "",
// //   })

// //   useEffect(() => {
// //     loadSuppliers()
// //   }, [])

// //   const loadSuppliers = async () => {s
// //     try {
// //       const data = await fetchSuppliers()
// //       setSuppliers(data)
// //     } catch (error) {
// //       console.error("Error loading suppliers:", error)
// //     }
// //   }

// //   const handleChange = (e) => {
// //     const { name, value } = e.target
// //     setFormData({
// //       ...formData,
// //       [name]: name === "stock" || name === "price" || name === "costPrice" ? Number(value) : value,
// //     })
// //   }

// //   const handleSubmit = (e) => {
// //     e.preventDefault()
// //     onSubmit(formData)
// //   }

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-6">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div>
// //           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
// //             Nome do Produto *
// //           </label>
// //           <input
// //             type="text"
// //             id="name"
// //             name="name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             required
// //             className="input-field"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
// //             Marca *
// //           </label>
// //           <input
// //             type="text"
// //             id="brand"
// //             name="brand"
// //             value={formData.brand}
// //             onChange={handleChange}
// //             required
// //             className="input-field"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="compatibleModel" className="block text-sm font-medium text-gray-700 mb-1">
// //             Modelo Compatível *
// //           </label>
// //           <input
// //             type="text"
// //             id="compatibleModel"
// //             name="compatibleModel"
// //             value={formData.compatibleModel}
// //             onChange={handleChange}
// //             required
// //             className="input-field"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
// //             Quantidade em Estoque *
// //           </label>
// //           <input
// //             type="number"
// //             id="stock"
// //             name="stock"
// //             value={formData.stock}
// //             onChange={handleChange}
// //             min="0"
// //             required
// //             className="input-field"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
// //             Valor de Custo (R$) *
// //           </label>
// //           <input
// //             type="number"
// //             id="costPrice"
// //             name="costPrice"
// //             value={formData.costPrice}
// //             onChange={handleChange}
// //             min="0"
// //             step="0.01"
// //             required
// //             className="input-field"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
// //             Preço de Venda (R$) *
// //           </label>
// //           <input
// //             type="number"
// //             id="price"
// //             name="price"
// //             value={formData.price}
// //             onChange={handleChange}
// //             min="0"
// //             step="0.01"
// //             required
// //             className="input-field"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
// //             Fornecedor
// //           </label>
// //           <select
// //             id="supplierId"
// //             name="supplierId"
// //             value={formData.supplierId}
// //             onChange={handleChange}
// //             className="input-field"
// //           >
// //             <option value="">Selecione um fornecedor</option>
// //             {suppliers.map((supplier) => (
// //               <option key={supplier.id} value={supplier.id}>
// //                 {supplier.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
// //             Código do Produto (opcional)
// //           </label>
// //           <input
// //             type="text"
// //             id="code"
// //             name="code"
// //             value={formData.code}
// //             onChange={handleChange}
// //             className="input-field"
// //           />
// //         </div>
// //       </div>

// //       {formData.costPrice > 0 && formData.price > 0 && (
// //         <div className="bg-blue-50 p-4 rounded-lg">
// //           <h3 className="font-medium text-blue-800 mb-2">Análise de Margem</h3>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <div>
// //               <p className="text-sm text-blue-600">Custo</p>
// //               <p className="font-medium">
// //                 {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(formData.costPrice)}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-blue-600">Venda</p>
// //               <p className="font-medium">
// //                 {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(formData.price)}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-sm text-blue-600">Margem</p>
// //               <p className="font-medium text-green-600">
// //                 {(((formData.price - formData.costPrice) / formData.costPrice) * 100).toFixed(2)}%
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div className="flex justify-end">
// //         <button type="submit" className="btn-primary">
// //           {buttonText}
// //         </button>
// //       </div>
// //     </form>
// //   )
// // }

// // export default ProductForm




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
//     lowStock: initialData.lowStock ?? 5, // ⬅️ NOVO: alerta configurável
//     price: initialData.price || 0,
//     costPrice: initialData.costPrice || 0,
//     code: initialData.code || "",
//     supplierId: initialData.supplierId || "",
//   })

//   useEffect(() => {
//     loadSuppliers()
//   }, [])

//   const loadSuppliers = async () => {
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
//       [name]:
//         name === "stock" ||
//         name === "lowStock" || // ⬅️ NOVO: tratar como número
//         name === "price" ||
//         name === "costPrice"
//           ? Number(value)
//           : value,
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onSubmit(formData) // formData já contém lowStock
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

//         {/* ⬇️ NOVO CAMPO: você define o número do alerta livremente */}
//         <div>
//           <label htmlFor="lowStock" className="block text-sm font-medium text-gray-700 mb-1">
//             Estoque mínimo (alerta) *
//           </label>
//           <input
//             type="number"
//             id="lowStock"
//             name="lowStock"
//             value={formData.lowStock}
//             onChange={handleChange}
//             min="0"
//             required
//             className="input-field"
//             placeholder="Ex.: 5 (avisa quando chegar a 5 ou menos)"
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



import { useEffect, useMemo, useState } from "react";
import { fetchSuppliers } from "../services/api";

const ProductForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  buttonText = "Salvar",
  isSubmitting = false,
}) => {
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: initialData.name ?? "",
    brand: initialData.brand ?? "",
    compatibleModel: initialData.compatibleModel ?? "",
    code: initialData.code ?? "",
    supplierId: initialData.supplierId ?? "",
    stock: initialData.stock ?? 0,
    lowStock: initialData.lowStock ?? 5, // alerta configurável
    costPrice: initialData.costPrice ?? 0,
    price: initialData.price ?? 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSuppliers();
        setSuppliers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading suppliers:", e);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["stock", "lowStock", "price", "costPrice"].includes(name)) {
      // permite string vazia durante digitação; envia número no submit
      setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const margin = useMemo(() => {
    const cp = Number(formData.costPrice || 0);
    const pr = Number(formData.price || 0);
    if (cp <= 0) return null;
    return ((pr - cp) / cp) * 100;
  }, [formData.costPrice, formData.price]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, brand, compatibleModel } = formData;
    if (!name.trim() || !brand.trim() || !compatibleModel.trim()) return;

    const payload = {
      ...formData,
      stock: Number(formData.stock || 0),
      lowStock: Number(formData.lowStock || 0),
      price: Number(formData.price || 0),
      costPrice: Number(formData.costPrice || 0),
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Nome do Produto *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoFocus
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="brand" className="mb-1 block text-sm font-medium text-gray-700">
            Marca *
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            required
            value={formData.brand}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        {/* Modelo compatível */}
        <div>
          <label htmlFor="compatibleModel" className="mb-1 block text-sm font-medium text-gray-700">
            Modelo Compatível *
          </label>
          <input
            id="compatibleModel"
            name="compatibleModel"
            type="text"
            required
            value={formData.compatibleModel}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        {/* Quantidade em estoque */}
        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium text-gray-700">
            Quantidade em Estoque *
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            required
            value={formData.stock}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        {/* Estoque mínimo */}
        <div>
          <label htmlFor="lowStock" className="mb-1 block text-sm font-medium text-gray-700">
            Estoque mínimo (alerta) *
          </label>
          <input
            id="lowStock"
            name="lowStock"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            required
            value={formData.lowStock}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            placeholder="Ex.: 5 (avisa quando chegar a 5 ou menos)"
          />
        </div>

        {/* Custo */}
        <div>
          <label htmlFor="costPrice" className="mb-1 block text-sm font-medium text-gray-700">
            Valor de Custo (R$) *
          </label>
          <input
            id="costPrice"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            required
            value={formData.costPrice}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        {/* Preço */}
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
            Preço de Venda (R$) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            required
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
          {Number(formData.costPrice || 0) > 0 &&
            Number(formData.price || 0) < Number(formData.costPrice || 0) && (
              <p className="mt-1 text-xs text-red-600">
                Atenção: preço de venda está abaixo do custo.
              </p>
            )}
        </div>

        {/* Fornecedor */}
        <div>
          <label htmlFor="supplierId" className="mb-1 block text-sm font-medium text-gray-700">
            Fornecedor
          </label>
          <select
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Código */}
        <div>
          <label htmlFor="code" className="mb-1 block text-sm font-medium text-gray-700">
            Código do Produto (opcional)
          </label>
          <input
            id="code"
            name="code"
            type="text"
            value={formData.code}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>
      </div>

      {(Number(formData.costPrice) > 0 || Number(formData.price) > 0) && (
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-800">Análise de Margem</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-blue-600">Custo</p>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  Number(formData.costPrice || 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Venda</p>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  Number(formData.price || 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Margem</p>
              <p className={`font-medium ${margin != null && margin < 0 ? "text-red-600" : "text-green-600"}`}>
                {margin == null ? "—" : `${margin.toFixed(2)}%`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

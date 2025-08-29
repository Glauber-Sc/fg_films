// "use client"

// import { useState } from "react"

// const SupplierForm = ({ initialData = {}, onSubmit, buttonText = "Salvar" }) => {
//   const [formData, setFormData] = useState({
//     name: initialData.name || "",
//     cnpj: initialData.cnpj || "",
//     phone: initialData.phone || "",
//     email: initialData.email || "",
//     address: initialData.address || "",
//     notes: initialData.notes || "",
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
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
//             Nome do Fornecedor *
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
//           <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
//             CNPJ
//           </label>
//           <input
//             type="text"
//             id="cnpj"
//             name="cnpj"
//             value={formData.cnpj}
//             onChange={handleChange}
//             className="input-field"
//             placeholder="00.000.000/0000-00"
//           />
//         </div>

//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//             Telefone
//           </label>
//           <input
//             type="text"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="input-field"
//             placeholder="(11) 99999-9999"
//           />
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="input-field"
//             placeholder="fornecedor@email.com"
//           />
//         </div>
//       </div>

//       <div>
//         <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//           Endereço
//         </label>
//         <input
//           type="text"
//           id="address"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           className="input-field"
//           placeholder="Rua, número, bairro, cidade"
//         />
//       </div>

//       <div>
//         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
//           Observações
//         </label>
//         <textarea
//           id="notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           rows={3}
//           className="input-field"
//           placeholder="Observações sobre o fornecedor..."
//         />
//       </div>

//       <div className="flex justify-end">
//         <button type="submit" className="btn-primary">
//           {buttonText}
//         </button>
//       </div>
//     </form>
//   )
// }

// export default SupplierForm




// ===== components/SupplierForm.jsx =====
import { useState } from "react";

const onlyDigits = (s = "") => String(s).replace(/\D+/g, "");

const SupplierForm = ({ initialData = {}, onSubmit, onCancel, buttonText = "Salvar", isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    cnpj: initialData.cnpj || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    address: initialData.address || "",
    notes: initialData.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) return; // validação simples
    onSubmit?.({
      ...formData,
      cnpj: onlyDigits(formData.cnpj),
      phone: onlyDigits(formData.phone),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Nome do Fornecedor *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        <div>
          <label htmlFor="cnpj" className="mb-1 block text-sm font-medium text-gray-700">CNPJ</label>
          <input
            id="cnpj"
            name="cnpj"
            type="text"
            placeholder="00.000.000/0000-00"
            value={formData.cnpj}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(91) 99999-9999"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="fornecedor@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">Endereço</label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Rua, número, bairro, cidade"
          value={formData.address}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Observações sobre o fornecedor..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
        />
      </div>

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

export { SupplierForm as default };

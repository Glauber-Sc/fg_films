// // import React, { useState, useEffect } from 'react';

// // const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
// //   const [formData, setFormData] = useState({
// //     date: '',
// //     description: '',
// //     value: ''
// //   });

// //   useEffect(() => {
// //     if (expense) {
// //       setFormData({
// //         date: expense.date,
// //         description: expense.description,
// //         value: expense.value.toString()
// //       });
// //     } else {
// //       setFormData({
// //         date: new Date().toISOString().split('T')[0],
// //         description: '',
// //         value: ''
// //       });
// //     }
// //   }, [expense]);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     onSubmit({
// //       ...formData,
// //       value: parseFloat(formData.value)
// //     });
// //   };

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   return (
// //     <div className="bg-white p-6 rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold mb-6 text-gray-800">
// //         {expense ? 'Editar Despesa' : 'Nova Despesa'}
// //       </h2>
      
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Data
// //           </label>
// //           <input
// //             type="date"
// //             name="date"
// //             value={formData.date}
// //             onChange={handleChange}
// //             required
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Descrição
// //           </label>
// //           <input
// //             type="text"
// //             name="description"
// //             value={formData.description}
// //             onChange={handleChange}
// //             required
// //             placeholder="Digite a descrição da despesa"
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Valor (R$)
// //           </label>
// //           <input
// //             type="number"
// //             name="value"
// //             value={formData.value}
// //             onChange={handleChange}
// //             required
// //             step="0.01"
// //             min="0"
// //             placeholder="0.00"
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //         </div>

// //         <div className="flex space-x-3 pt-4">
// //           <button
// //             type="submit"
// //             className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
// //           >
// //             {expense ? 'Atualizar' : 'Criar'} Despesa
// //           </button>
// //           <button
// //             type="button"
// //             onClick={onCancel}
// //             className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
// //           >
// //             Cancelar
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default ExpenseForm;




// import React, { useEffect, useMemo, useState } from "react";

// /**
//  * Formulário de Despesa padronizado no estilo do app
//  * - Header cinza no card
//  * - Inputs com classe `input-field`
//  * - Botões preto (primário) e secundário branco/borda
//  * - Aceita vírgula ou ponto no valor; normaliza no submit
//  */
// const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({ date: "", description: "", value: "" });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (expense) {
//       setFormData({
//         date: (expense.date ? new Date(expense.date) : new Date()).toISOString().slice(0, 10),
//         description: expense.description ?? "",
//         value: String(expense.value ?? ""),
//       });
//     } else {
//       setFormData({
//         date: new Date().toISOString().slice(0, 10),
//         description: "",
//         value: "",
//       });
//     }
//   }, [expense]);

//   const validate = () => {
//     const e = {};
//     if (!formData.date) e.date = "Informe a data";
//     if (!formData.description?.trim()) e.description = "Informe a descrição";
//     const normalized = (formData.value || "").replace(/\./g, "").replace(",", ".");
//     const num = Number.parseFloat(normalized);
//     if (!Number.isFinite(num) || num <= 0) e.value = "Informe um valor válido";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     try {
//       setIsSubmitting(true);
//       const normalized = formData.value.replace(/\./g, "").replace(",", ".");
//       const payload = {
//         date: formData.date,
//         description: formData.description.trim(),
//         value: Number.parseFloat(normalized),
//       };
//       await onSubmit?.(payload);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const headerTitle = useMemo(() => (expense ? "Editar Despesa" : "Nova Despesa"), [expense]);
//   const submitLabel = useMemo(() => (expense ? "Atualizar Despesa" : "Criar Despesa"), [expense]);

//   return (
//     <div className="overflow-hidden rounded-lg bg-white shadow">
//       <div className="border-b bg-gray-50 px-6 py-4">
//         <h2 className="text-lg font-semibold text-gray-800">{headerTitle}</h2>
//         <p className="text-sm text-gray-500">Preencha os campos abaixo e salve</p>
//       </div>

//       <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="date">Data *</label>
//             <input
//               id="date"
//               name="date"
//               type="date"
//               required
//               value={formData.date}
//               onChange={handleChange}
//               className="input-field"
//               aria-invalid={!!errors.date}
//               aria-describedby={errors.date ? "date-err" : undefined}
//             />
//             {errors.date && <p id="date-err" className="mt-1 text-xs text-red-600">{errors.date}</p>}
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="value">Valor (R$) *</label>
//             <input
//               id="value"
//               name="value"
//               type="text"
//               inputMode="decimal"
//               placeholder="0,00"
//               value={formData.value}
//               onChange={handleChange}
//               className="input-field"
//               aria-invalid={!!errors.value}
//               aria-describedby={errors.value ? "value-err" : undefined}
//             />
//             {errors.value && <p id="value-err" className="mt-1 text-xs text-red-600">{errors.value}</p>}
//           </div>
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="description">Descrição *</label>
//           <input
//             id="description"
//             name="description"
//             type="text"
//             required
//             placeholder="Digite a descrição da despesa"
//             value={formData.description}
//             onChange={handleChange}
//             className="input-field"
//             aria-invalid={!!errors.description}
//             aria-describedby={errors.description ? "desc-err" : undefined}
//           />
//           {errors.description && <p id="desc-err" className="mt-1 text-xs text-red-600">{errors.description}</p>}
//         </div>

//         <div className="flex items-center justify-end gap-2 pt-2">
//           {onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
//             >
//               Cancelar
//             </button>
//           )}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isSubmitting ? "Salvando..." : submitLabel}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ExpenseForm;


import { useState, useEffect } from "react";

const ExpenseForm = ({ initialData = {}, onSubmit, onCancel, buttonText = "Salvar", isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    description: initialData.description || "",
    value: initialData.value !== undefined && initialData.value !== null ? String(initialData.value).replace(".", ",") : "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      description: initialData.description || "",
      value: initialData.value !== undefined && initialData.value !== null ? String(initialData.value).replace(".", ",") : "",
    });
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!formData.date) e.date = "Informe a data";
    if (!formData.description?.trim()) e.description = "Informe a descrição";
    const normalized = String(formData.value || "").replace(/\./g, "").replace(",", ".");
    const num = Number.parseFloat(normalized);
    if (!Number.isFinite(num) || num <= 0) e.value = "Informe um valor válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const normalized = String(formData.value).replace(/\./g, "").replace(",", ".");
    onSubmit?.({
      date: formData.date,
      description: formData.description.trim(),
      value: Number.parseFloat(normalized),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">Data *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-err" : undefined}
          />
          {errors.date && <p id="date-err" className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="value" className="mb-1 block text-sm font-medium text-gray-700">Valor (R$) *</label>
          <input
            id="value"
            name="value"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={formData.value}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            aria-invalid={!!errors.value}
            aria-describedby={errors.value ? "value-err" : undefined}
          />
          {errors.value && <p id="value-err" className="mt-1 text-xs text-red-600">{errors.value}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Descrição *</label>
        <input
          id="description"
          name="description"
          type="text"
          required
          placeholder="Digite a descrição da despesa"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "desc-err" : undefined}
        />
        {errors.description && <p id="desc-err" className="mt-1 text-xs text-red-600">{errors.description}</p>}
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
          className="inline-flex items-center rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;

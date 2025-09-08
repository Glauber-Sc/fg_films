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
          className="inline-flex items-center rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export { SupplierForm as default };

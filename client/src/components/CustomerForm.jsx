import { useState } from "react";

const CustomerForm = ({ initialData = {}, onSubmit, onCancel, buttonText = "Salvar", isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    phone: initialData.phone || "",
    document: initialData.document || "",
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
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Nome *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
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
            autoComplete="tel"
            placeholder="(91) 99999-9999"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        <div>
          <label htmlFor="document" className="mb-1 block text-sm font-medium text-gray-700">CPF/CNPJ</label>
          <input
            id="document"
            name="document"
            type="text"
            autoComplete="off"
            placeholder="000.000.000-00"
            value={formData.document}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">Endereço</label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder="Rua, número, bairro, cidade"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Observações sobre o cliente..."
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
          className="inline-flex items-center rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg.primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export { CustomerForm as default };

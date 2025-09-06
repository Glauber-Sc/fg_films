import { useEffect, useState } from "react";

const toForm = (data) => ({
  date: data?.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  description: data?.description ?? "",
  employee: data?.employee ?? "",
  value: data?.value != null ? String(data.value).replace(".", ",") : "",
});

const ServiceForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  buttonText = "Salvar",
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState(() => toForm(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) return;
    setFormData(toForm(initialData));
  }, [initialData?.id]);

  const validate = () => {
    const e = {};
    if (!formData.date) e.date = "Informe a data";
    if (!formData.description?.trim()) e.description = "Informe a descrição";
    if (!formData.employee?.trim()) e.employee = "Informe o funcionário";
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
      employee: formData.employee.trim(),
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
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="value" className="mb-1 block text-sm font-medium text-gray-700">Valor (R$) *</label>
          <input
            id="value"
            name="value"
            type="number"
            inputMode="decimal"
            placeholder="0,00"
            value={formData.value}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
            aria-invalid={!!errors.value}
          />
          {errors.value && <p className="mt-1 text-xs text-red-600">{errors.value}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Descrição *</label>
        <input
          id="description"
          name="description"
          type="text"
          required
          placeholder="Ex.: Instalação de som automotivo"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="employee" className="mb-1 block text-sm font-medium text-gray-700">Funcionário *</label>
        <input
          id="employee"
          name="employee"
          type="text"
          required
          placeholder="Quem executou o serviço"
          value={formData.employee}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
          aria-invalid={!!errors.employee}
        />
        {errors.employee && <p className="mt-1 text-xs text-red-600">{errors.employee}</p>}
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

export default ServiceForm;

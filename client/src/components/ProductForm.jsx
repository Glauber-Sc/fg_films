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
          className="inline-flex items-center rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

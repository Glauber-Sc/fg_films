import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatDateTime } from "../utils/format";

export default function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // nome legível do fornecedor (mostra nome, não o ID)
  const [supplierName, setSupplierName] = useState("—");

  // carrega produto pelo ID
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Extrai nome do fornecedor de diferentes formatos de payload
  const pickSupplierName = (p) => {
    return (
      p?.supplier?.name ||
      p?.supplier?.fantasyName ||
      p?.supplier?.companyName ||
      p?.supplierName ||
      p?.fornecedorNome || // caso sua API já devolva esse campo
      null
    );
  };

  // Busca nome do fornecedor quando necessário
  useEffect(() => {
    (async () => {
      if (!product) {
        setSupplierName("—");
        return;
      }

      // 1) tenta achar no próprio produto
      const inlineName = pickSupplierName(product);
      if (inlineName) {
        setSupplierName(String(inlineName));
        return;
      }

      // 2) se só vier o ID, tenta buscar o fornecedor
      const sid = product.supplierId || product.fornecedorId;
      if (!sid) {
        setSupplierName("—");
        return;
      }

      try {
        const res = await fetch(`/api/suppliers/${encodeURIComponent(sid)}`);
        if (!res.ok) throw new Error("Fornecedor não encontrado");
        const sup = await res.json();
        const name =
          sup?.name || sup?.fantasyName || sup?.companyName || sup?.razaoSocial;
        setSupplierName(name ? String(name) : "—");
      } catch (e) {
        console.warn("Não foi possível obter nome do fornecedor:", e);
        setSupplierName("—");
      }
    })();
  }, [product]);

  // Datas (cadastrado em)
  const createdAtLabel = useMemo(() => {
    const raw = product?.createdAt || product?.created_at;
    return raw ? formatDateTime(raw) : "—";
  }, [product]);

  // Status de estoque (legível)
  const stockStatus = useMemo(() => {
    if (!product)
      return {
        label: "—",
        tone: "text-gray-500",
        badge: "bg-gray-100 text-gray-700",
      };
    const stock = Number(product.stock ?? 0);
    const low = Number(
      Number.isFinite(product.lowStock) ? product.lowStock : 5
    );
    if (stock <= 0)
      return {
        label: "Esgotado",
        tone: "text-red-600",
        badge: "bg-red-50 text-red-700",
      };
    if (stock <= low)
      return {
        label: "Baixo estoque",
        tone: "text-amber-600",
        badge: "bg-amber-50 text-amber-700",
      };
    return {
      label: "Em estoque",
      tone: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700",
    };
  }, [product]);

  // Valores
  const price = Number(product?.price ?? 0);
  const cost = Number(product?.costPrice ?? 0);
  const profit = price - cost;
  const margin = price ? (profit / price) * 100 : 0; // margem sobre venda
  const markup = cost ? (profit / cost) * 100 : 0; // markup sobre custo

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="rounded-md border bg-white p-6 shadow">
          <h1 className="text-lg font-semibold">Produto não encontrado</h1>
          <p className="text-sm text-gray-600 mt-1">
            Verifique o link ou tente novamente pela lista de produtos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900">
            Detalhes do Produto
          </h1>
          <p className="text-sm text-gray-500">Ficha do item e status</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/products/edit/${encodeURIComponent(product.id)}`}
            className="inline-flex items-center gap-2 rounded-md btn-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary"
            title="Editar Produto"
          >
            <PencilIcon className="h-5 w-5" />
            Editar
          </Link>
        </div>
      </div>

      {/* Título + códigos legíveis */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {product.name || "—"}
        </h2>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-gray-700">
            Código: {product.code || "—"}
          </span>
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 ${stockStatus.badge}`}
          >
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* Resumo em cartões com rótulos REAIS */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Marca</p>
          <p className="text-sm font-medium text-gray-900">
            {product.brand || "—"}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Modelo compatível</p>
          <p className="text-sm font-medium text-gray-900">
            {product.compatibleModel || "—"}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Fornecedor</p>
          <p className="text-sm font-medium text-gray-900">
            {supplierName || "—"}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Cadastrado em</p>
          <p className="text-sm font-medium text-gray-900">
            {createdAtLabel}
          </p>
        </div>
      </div>

      {/* Tabela de valores e estoque */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Estoque e preços
          </h2>
          <p className={`text-sm ${stockStatus.tone}`}>{stockStatus.label}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estoque atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Alerta de baixo estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Preço de venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Lucro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Margem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Markup
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {Number(product.stock ?? 0)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {Number(
                    Number.isFinite(product.lowStock) ? product.lowStock : 5
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(price)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(cost)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(profit)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {margin.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {markup.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ficha técnica com NOMES REAIS (sem mostrar IDs técnicos) */}
        <div className="border-t px-6 py-4 text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="text-gray-500">Nome do produto:</span>{" "}
              {product.name || "—"}
            </div>
            <div>
              <span className="text-gray-500">Marca:</span>{" "}
              {product.brand || "—"}
            </div>
            <div>
              <span className="text-gray-500">Modelo compatível:</span>{" "}
              {product.compatibleModel || "—"}
            </div>
            <div>
              <span className="text-gray-500">Fornecedor:</span>{" "}
              {supplierName || "—"}
            </div>
            <div>
              <span className="text-gray-500">Código:</span>{" "}
              {product.code || "—"}
            </div>
            <div>
              <span className="text-gray-500">Estoque atual:</span>{" "}
              {Number(product.stock ?? 0)}
            </div>
            <div>
              <span className="text-gray-500">Alerta de estoque:</span>{" "}
              {Number(
                Number.isFinite(product.lowStock) ? product.lowStock : 5
              )}
            </div>
            <div>
              <span className="text-gray-500">Preço de venda:</span>{" "}
              {formatCurrency(price)}
            </div>
            <div>
              <span className="text-gray-500">Custo:</span>{" "}
              {formatCurrency(cost)}
            </div>
            <div>
              <span className="text-gray-500">Lucro estimado:</span>{" "}
              {formatCurrency(profit)}
            </div>
            <div>
              <span className="text-gray-500">Margem:</span>{" "}
              {margin.toFixed(1)}%
            </div>
            <div>
              <span className="text-gray-500">Markup:</span>{" "}
              {markup.toFixed(1)}%
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500">Cadastrado em:</span>{" "}
              {createdAtLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

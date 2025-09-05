
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import { fetchSales } from "../services/api";
import { groupSales } from "../utils/groupSales";
import { DocumentArrowDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { paymentReceipt } from "../utils/paymentReceipt";
import logo from "../assets/img/logo.png";

export default function ViewSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rawSales, setRawSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // carrega as vendas e reagrupa (para conseguir achar a venda pelo id do grupo)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSales();
        setRawSales(data || []);
      } catch (e) {
        console.error("Erro ao carregar vendas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => groupSales(rawSales), [rawSales]);

  // id vem codificado na URL
  const decodedId = useMemo(() => {
    try {
      return decodeURIComponent(id || "");
    } catch {
      return id || "";
    }
  }, [id]);

  const sale = useMemo(() => grouped.find((g) => g.id === decodedId), [grouped, decodedId]);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!sale) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </button>
        </div>
        <div className="rounded-md border bg-white p-6 shadow">
          <h1 className="text-lg font-semibold">Venda não encontrada</h1>
          <p className="text-sm text-gray-600 mt-1">Verifique o link ou tente novamente pela lista de vendas.</p>
        </div>
      </div>
    );
  }

  const totalQty = sale.items.reduce((s, i) => s + (i.qty || 0), 0);

  return (
    <div className="p-6">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Detalhes da Venda</h1>
        <p className="text-sm text-gray-500">Acompanhe as vendas e emita recibos</p>
      </div>

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              paymentReceipt({ ...sale, payments: sale.paymentMethods }, { logoUrl: logo })
            }
            className="inline-flex items-center gap-2 rounded-md btn-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary"
            title="Gerar Recibo"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Gerar Recibo
          </button>
        </div>
      </div>

      {/* resumo */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Cliente</p>
          <p className="text-sm font-medium text-gray-900">{sale.customerName}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Data - Hora</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(sale.date).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total da venda</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(sale.total)}</p>
        </div>
      </div>

      {/* itens */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Itens vendidos</h2>
          <p className="text-sm text-gray-500">Quantidade total: {totalQty}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Produto</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Qtd</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Unitário</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sale.items.map((it, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">{it.name}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-900">{it.qty}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-900">{formatCurrency(it.unitPrice)}</td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(it.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-700" colSpan={3}>Total</td>
                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(sale.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* pagamento */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Formas de pagamento</h3>
          {sale.paymentMethods && sale.paymentMethods.length > 0 ? (
            <ul className="text-sm text-gray-800 space-y-1">
              {sale.paymentMethods.map((pm, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    {pm.method}{pm.machine ? ` (${pm.machine})` : ""}
                  </span>
                  <span className="font-medium">{formatCurrency(pm.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Não especificado</p>
          )}
        </div>

        {/* <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Ações</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/sales"
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Voltar para lista
            </Link>
            <button
              onClick={() =>
                paymentReceipt({ ...sale, payments: sale.paymentMethods }, { logoUrl: logo })
              }
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Gerar recibo
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

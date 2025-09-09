import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchServices, deleteService } from "../services/api";
import { formatCurrency } from "../utils/format";
import { toast } from "react-toastify";

export default function ViewService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // carrega serviços
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Erro ao carregar serviços:", e);
        toast.error("Erro ao carregar serviços");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const service = useMemo(
    () => services.find((s) => String(s.id) === String(id)),
    [services, id]
  );

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!service) {
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
          <h1 className="text-lg font-semibold">Serviço não encontrado</h1>
          <p className="text-sm text-gray-600 mt-1">
            Verifique o link ou tente novamente pela lista de serviços.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Deseja excluir este serviço?")) return;
    try {
      await deleteService(service.id);
      toast.success("Serviço excluído com sucesso");
      navigate("/services");
    } catch (e) {
      console.error("Erro ao excluir serviço:", e);
      toast.error("Erro ao excluir serviço");
    }
  };

  // ------- NOVO: usar created em vez de date (com fallbacks para snake_case) -------
  const createdISO =
    service.createdAt ||
    service.created_at ||
    service.paidAt ||
    service.paid_at ||
    service.updatedAt ||
    service.updated_at ||
    service.date ||
    null;

  const createdLabel = createdISO
    ? new Date(createdISO).toLocaleString()
    : "—";

  return (
    <div className="p-6">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Detalhes do Serviço
          </h1>
          <p className="text-sm text-gray-500">Acompanhe os serviços realizados</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/services/edit/${service.id}`}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4" />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>

      {/* resumo */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Descrição</p>
          <p className="text-sm font-medium text-gray-900">{service.description}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Funcionário</p>
          <p className="text-sm font-medium text-gray-900">
            {service.employee || "—"}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Criado em</p>
          <p className="text-sm font-medium text-gray-900">
            {createdLabel}
          </p>
        </div>
      </div>

      {/* valor */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-xs text-gray-500">Valor do serviço</p>
        <p className="text-xl font-semibold text-gray-900">
          {formatCurrency(service.value)}
        </p>
      </div>

      {/* pagamento */}
      {service.paymentMethods && service.paymentMethods.length > 0 && (
        <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Formas de pagamento
          </h3>
          <ul className="text-sm text-gray-800 space-y-1">
            {service.paymentMethods.map((pm, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b py-1"
              >
                <span>
                  {pm.method}
                  {pm.machine ? ` (${pm.machine})` : ""}
                </span>
                <span className="font-medium">
                  {formatCurrency(pm.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

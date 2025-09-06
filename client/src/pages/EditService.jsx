import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchServiceById, updateService } from "../services/api";
import ServiceForm from "../components/ServiceForm";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const svc = await fetchServiceById(id);
        setData(svc);
      } catch (e) {
        console.error("Erro ao carregar serviço:", e);
        toast.error("Erro ao carregar serviço");
      }
    })();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateService(id, formData);
      toast.success("Serviço atualizado com sucesso");
      navigate("/services");
    } catch (e) {
      console.error("Erro ao atualizar serviço:", e);
      toast.error("Erro ao atualizar serviço");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Editar Serviço</h1>
        <p className="text-sm text-gray-500">Atualize as informações do serviço</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Dados do Serviço</h3>
        </div>
        <div className="px-6 py-6">
          <ServiceForm
            initialData={data}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            buttonText="Salvar Alterações"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditService;

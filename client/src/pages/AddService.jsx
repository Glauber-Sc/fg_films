import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createService } from "../services/api";
import ServiceForm from "../components/ServiceForm";

const AddService = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createService(formData);
      toast.success("Serviço registrado com sucesso");
      navigate("/services");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Erro ao registrar serviço");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Serviço</h1>
        <p className="text-sm text-gray-500">Cadastre o seus serviços</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Dados do Serviço</h3>
              <p className="text-sm text-gray-500">Preencha os campos abaixo e salve</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <ServiceForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            buttonText="Adicionar Serviço"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddService;

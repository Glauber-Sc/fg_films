import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCustomer } from "../services/api";
import CustomerForm from "../components/CustomerForm";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createCustomer(formData);
      toast.success("Cliente adicionado com sucesso");
      navigate("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Erro ao adicionar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Cliente</h1>
        <p className="text-sm text-gray-500">Cadastre um novo cliente no sistema</p>
      </div>

      {/* Card padrão */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Dados do Cliente</h3>
          <p className="text-sm text-gray-500">Preencha os campos abaixo e salve</p>
        </div>
        <div className="px-6 py-6">
          <CustomerForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            buttonText="Adicionar Cliente"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;

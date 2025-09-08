import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createSupplier } from "../services/api";
import SupplierForm from "../components/SupplierForm";

const AddSupplier = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createSupplier(formData);
      toast.success("Fornecedor adicionado com sucesso");
      navigate("/suppliers");
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast.error("Erro ao adicionar fornecedor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Fornecedor</h1>
        <p className="text-sm text-gray-500">Cadastre um novo fornecedor no sistema</p>
      </div>

      {/* Card padrão */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Dados do Fornecedor</h3>
          <p className="text-sm text-gray-500">Preencha os campos abaixo e salve</p>
        </div>
        <div className="px-6 py-6">
          <SupplierForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            buttonText="Adicionar Fornecedor"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../services/api";
import ProductForm from "../components/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createProduct(formData);
      toast.success("Produto adicionado com sucesso");
      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Erro ao adicionar produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Produto</h1>
        <p className="text-sm text-gray-500">Cadastre um novo item no catálogo</p>
      </div>

      {/* Card padrão */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Dados do Produto</h3>
          <p className="text-sm text-gray-500">Preencha os campos abaixo e salve</p>
        </div>
        <div className="px-6 py-6">
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            buttonText="Adicionar Produto"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

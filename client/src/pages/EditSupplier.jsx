"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SupplierForm from "../components/SupplierForm";
import { fetchSupplierById, updateSupplier } from "../services/api";

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSupplierById(id);
        setSupplier(data || null);
      } catch (error) {
        console.error("Error loading supplier:", error);
        toast.error("Erro ao carregar fornecedor");
        navigate("/suppliers");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateSupplier(id, formData);
      toast.success("Fornecedor atualizado com sucesso");
      navigate("/suppliers");
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Erro ao atualizar fornecedor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-gray-600">Carregando...</div>;
  }

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Editar Fornecedor</h1>
        <p className="text-sm text-gray-500">Atualize os dados do fornecedor e salve</p>
      </div>

      {/* Card padrão */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Dados do Fornecedor</h3>
          <p className="text-sm text-gray-500">Campos obrigatórios marcados com *</p>
        </div>
        <div className="px-6 py-6">
          {supplier ? (
            <SupplierForm
              initialData={supplier}
              onSubmit={handleSubmit}
              onCancel={() => navigate(-1)}
              buttonText="Atualizar Fornecedor"
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="text-center text-gray-600">Fornecedor não encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;

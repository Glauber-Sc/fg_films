import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomerForm from "../components/CustomerForm";
import { fetchCustomerById, updateCustomer } from "../services/api";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCustomerById(id);
        setCustomer(data || null);
      } catch (error) {
        console.error("Error loading customer:", error);
        toast.error("Erro ao carregar cliente");
        navigate("/customers");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateCustomer(id, formData);
      toast.success("Cliente atualizado com sucesso");
      navigate("/customers");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Erro ao atualizar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-600">Carregando...</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header padronizado */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Editar Cliente</h1>
        <p className="text-sm text-gray-500">Atualize os dados do cliente e salve</p>
      </div>

      {/* Card padrão */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Dados do Cliente</h3>
          <p className="text-sm text-gray-500">Campos obrigatórios marcados com *</p>
        </div>
        <div className="px-6 py-6">
          {customer ? (
            <CustomerForm
              initialData={customer}
              onSubmit={handleSubmit}
              onCancel={() => navigate(-1)}
              buttonText="Atualizar Cliente"
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="text-center text-gray-600">Cliente não encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;

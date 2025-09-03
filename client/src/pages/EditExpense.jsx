import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ExpenseForm from "../components/ExpenseForm";
import { fetchExpenseById, updateExpense } from "../services/api";
import { BanknotesIcon } from "@heroicons/react/24/outline";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchExpenseById(id);
        setExpense(data || null);
      } catch (error) {
        console.error("Error loading expense:", error);
        toast.error("Erro ao carregar despesa");
        navigate("/expenses");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateExpense(id, formData);
      toast.success("Despesa atualizada com sucesso");
      navigate("/expenses");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Erro ao atualizar despesa");
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
        <h1 className="text-2xl font-semibold text-gray-900">Editar Despesa</h1>
        <p className="text-sm text-gray-500">Atualize os dados e salve</p>
      </div>

      {/* Card padrão */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          {/* <<< ÍCONE À ESQUERDA DO TÍTULO >>> */}
          <div className="flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5 text-gray-700" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Dados da Despesa</h3>
              <p className="text-sm text-gray-500">Campos obrigatórios marcados com *</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          {expense ? (
            <ExpenseForm
              initialData={expense}
              onSubmit={handleSubmit}
              onCancel={() => navigate(-1)}
              buttonText="Atualizar Despesa"
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="text-center text-gray-600">Despesa não encontrada</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditExpense;

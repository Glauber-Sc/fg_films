import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createExpense } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import { BanknotesIcon } from "@heroicons/react/24/outline";

const AddExpense = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createExpense(formData);
      toast.success("Despesa adicionada com sucesso");
      navigate("/expenses");
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error("Erro ao adicionar despesa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nova Despesa</h1>
        <p className="text-sm text-gray-500">Cadastre uma nova despesa no sistema</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Dados da Despesa</h3>
              <p className="text-sm text-gray-500">Preencha os campos abaixo e salve</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            buttonText="Adicionar Despesa"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddExpense;

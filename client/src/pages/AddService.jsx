import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import { formatCurrency } from "../utils/format";
import { createService } from "../services/api";

const cardMachines = [
  { id: "machine_a", name: "Máquina A" },
  { id: "machine_b", name: "Máquina B" },
  { id: "machine_c", name: "Máquina C" },
];

export default function AddService() {
  const navigate = useNavigate();

  // dados básicos do serviço
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [employee, setEmployee] = useState("");

  // pagamentos (já aparece direto, como no NewSale)
  const [paymentMethods, setPaymentMethods] = useState([
    { id: Date.now(), method: "Dinheiro", amount: 0, machine: "" },
  ]);

  const totalPayments = paymentMethods.reduce((s, pm) => s + (Number(pm.amount) || 0), 0);

  const addPaymentMethod = () => {
    setPaymentMethods((arr) => [
      ...arr,
      { id: Date.now(), method: "Dinheiro", amount: 0, machine: "" },
    ]);
  };

  const updatePaymentMethod = (id, field, value) => {
    setPaymentMethods((arr) =>
      arr.map((pm) =>
        pm.id === id
          ? {
              ...pm,
              [field]: field === "amount" ? Number(value) || 0 : value,
              ...(field === "method" &&
              value !== "Cartão de Crédito" &&
              value !== "Cartão de Débito"
                ? { machine: "" }
                : {}),
            }
          : pm
      )
    );
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods((arr) => arr.filter((pm) => pm.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) return toast.error("Informe a data");
    if (!description.trim()) return toast.error("Informe a descrição");
    if (!employee.trim()) return toast.error("Informe o funcionário");

    if (totalPayments <= 0) return toast.error("Informe pelo menos um pagamento com valor > 0");

    // cartões exigem máquina
    const cardPays = paymentMethods.filter(
      (pm) => pm.method === "Cartão de Crédito" || pm.method === "Cartão de Débito"
    );
    if (cardPays.some((pm) => !pm.machine)) {
      return toast.error("Selecione a máquina para todos os pagamentos com cartão");
    }

    try {
      await createService({
        date,
        description: description.trim(),
        employee: employee.trim(),
        value: Number(totalPayments.toFixed(2)),   // total = soma dos pagamentos
        paymentMethods: paymentMethods.map((pm) => ({
          method: pm.method,
          amount: Number((+pm.amount).toFixed(2)),
          machine: pm.machine || "",
        })),
      });

      toast.success("Serviço registrado com sucesso");
      navigate("/services");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar serviço");
    }
  };

  return (
    <div>
      <PageHeader title="Registrar Novo Serviço" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* dados principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário *</label>
              <input
                type="text"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                placeholder="Quem executou o serviço"
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: Instalação de som automotivo"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* detalhes + pagamentos (direto, sem modal e sem campo de valor) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Detalhes do Serviço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Serviço</p>
                <p className="font-medium">{description || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profissional</p>
                <p className="font-medium">{employee || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-medium">
                  {new Date(date + "T00:00:00").toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total (soma dos pagamentos)</p>
                <p className="font-medium text-lg text-blue-600">
                  {formatCurrency(totalPayments)}
                </p>
              </div>
            </div>

            {/* Métodos de Pagamento — igual ao de vendas */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Métodos de Pagamento</h4>
                <button
                  type="button"
                  onClick={addPaymentMethod}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Adicionar Método
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="border rounded-lg p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Método
                        </label>
                        <select
                          value={pm.method}
                          onChange={(e) => updatePaymentMethod(pm.id, "method", e.target.value)}
                          className="input-field"
                        >
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="PIX">PIX</option>
                          <option value="Cartão de Crédito">Cartão de Crédito</option>
                          <option value="Cartão de Débito">Cartão de Débito</option>
                          <option value="Transferência">Transferência</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor
                        </label>
                        <input
                          
                          value={pm.amount}
                          onChange={(e) =>
                            updatePaymentMethod(pm.id, "amount", e.target.value)
                          }
                          className="input-field"
                        />
                      </div>

                      {(pm.method === "Cartão de Crédito" ||
                        pm.method === "Cartão de Débito") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Máquina
                          </label>
                          <select
                            value={pm.machine}
                            onChange={(e) =>
                              updatePaymentMethod(pm.id, "machine", e.target.value)
                            }
                            className="input-field"
                          >
                            <option value="">Selecione a máquina</option>
                            {cardMachines.map((m) => (
                              <option key={m.id} value={m.name}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {paymentMethods.length > 1 && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePaymentMethod(pm.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center text-sm">
                <span>Total do Serviço:</span>
                <span className={totalPayments > 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(totalPayments)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={totalPayments <= 0}
            >
              Registrar Serviço
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

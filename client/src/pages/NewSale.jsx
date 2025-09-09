import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../components/Card";
import { formatCurrency } from "../utils/format";
import { fetchProducts, fetchCustomers, createSale } from "../services/api";

// ⬇️ importe os constants (ajuste o caminho se necessário)
import { MACHINE_OPTIONS, PAYMENT_METHODS } from "../constants/domainsPDV";

const NewSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [productDetails, setProductDetails] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, customersData] = await Promise.all([fetchProducts(), fetchCustomers()]);
      const availableProducts = productsData.filter((product) => product.stock > 0);
      setProducts(availableProducts);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.id === selectedProduct);
      setProductDetails(product);
      calculateTotal(product, quantity);

      // Initialize payment methods with full amount
      if (product) {
        setPaymentMethods([
          {
            id: Date.now(),
            method: PAYMENT_METHODS?.[0] ?? "Dinheiro",
            amount: product.price * quantity,
            machine: "",
          },
        ]);
      }
    } else {
      setProductDetails(null);
      setTotal(0);
      setPaymentMethods([]);
    }
  }, [selectedProduct, products]);

  useEffect(() => {
    if (productDetails) {
      calculateTotal(productDetails, quantity);

      // Update payment methods total
      const newTotal = productDetails.price * quantity;
      if (paymentMethods.length === 1) {
        setPaymentMethods([
          {
            ...paymentMethods[0],
            amount: newTotal,
          },
        ]);
      }
    }
  }, [quantity, productDetails]);

  const calculateTotal = (product, qty) => {
    if (product) {
      setTotal(product.price * qty);
    } else {
      setTotal(0);
    }
  };

  const addPaymentMethod = () => {
    const currentTotal = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
    const remaining = total - currentTotal;

    if (remaining <= 0) {
      toast.warning("Valor total já foi coberto pelos métodos de pagamento");
      return;
    }

    setPaymentMethods([
      ...paymentMethods,
      {
        id: Date.now(),
        method: PAYMENT_METHODS?.[0] ?? "Dinheiro",
        amount: remaining,
        machine: "",
      },
    ]);
  };

  const updatePaymentMethod = (id, field, value) => {
    setPaymentMethods(
      paymentMethods.map((pm) =>
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
          : pm,
      ),
    );
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
  };

  const getTotalPayments = () => {
    return paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Selecione um produto");
      return;
    }

    if (quantity <= 0) {
      toast.error("A quantidade deve ser maior que zero");
      return;
    }

    if (productDetails && quantity > productDetails.stock) {
      toast.error(`Quantidade indisponível. Estoque atual: ${productDetails.stock}`);
      return;
    }

    if (paymentMethods.length === 0) {
      toast.error("Adicione pelo menos um método de pagamento");
      return;
    }

    const totalPayments = getTotalPayments();
    if (Math.abs(totalPayments - total) > 0.01) {
      toast.error("O valor total dos pagamentos deve ser igual ao valor da venda");
      return;
    }

    // Validate card payments have machines selected
    const cardPayments = paymentMethods.filter(
      (pm) => pm.method === "Cartão de Crédito" || pm.method === "Cartão de Débito",
    );
    if (cardPayments.some((pm) => !pm.machine)) {
      toast.error("Selecione a máquina para todos os pagamentos com cartão");
      return;
    }

    try {
      const customerName = selectedCustomer
        ? customers.find((c) => c.id === selectedCustomer)?.name || "Cliente não identificado"
        : "Cliente não identificado";

      const saleData = {
        productId: selectedProduct,
        productName: productDetails.name,
        quantity: Number.parseInt(quantity),
        unitPrice: productDetails.price,
        total: total,
        customerId: selectedCustomer || null,
        customerName: customerName,
        paymentMethods: paymentMethods,
        date: new Date().toISOString(),
      };

      await createSale(saleData);
      toast.success("Venda registrada com sucesso");
      navigate("/sales");
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.error("Erro ao registrar venda");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nova Venda</h1>
        <p className="text-sm text-gray-500">Cadastre uma nova Venda no sistema</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                  Produto *
                </label>
                <select
                  id="product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)} (Estoque: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente (opcional)
                </label>
                <select
                  id="customer"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                  min="1"
                  max={productDetails?.stock || 1}
                  required
                  className="input-field"
                />
                {productDetails && (
                  <p className="text-sm text-gray-500 mt-1">Estoque disponível: {productDetails.stock}</p>
                )}
              </div>
            </div>

            {productDetails && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Detalhes da Venda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Produto</p>
                    <p className="font-medium">{productDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preço Unitário</p>
                    <p className="font-medium">{formatCurrency(productDetails.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantidade</p>
                    <p className="font-medium">{quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium text-lg text-blue-600">{formatCurrency(total)}</p>
                  </div>
                </div>

                {/* Payment Methods */}
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
                    {paymentMethods.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                            <select
                              value={payment.method}
                              onChange={(e) => updatePaymentMethod(payment.id, "method", e.target.value)}
                              className="input-field"
                            >
                              {PAYMENT_METHODS.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={payment.amount}
                              onChange={(e) => updatePaymentMethod(payment.id, "amount", e.target.value)}
                              className="input-field"
                            />
                          </div>

                          {(payment.method === "Cartão de Crédito" || payment.method === "Cartão de Débito") && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Máquina</label>
                              <select
                                value={payment.machine}
                                onChange={(e) => updatePaymentMethod(payment.id, "machine", e.target.value)}
                                className="input-field"
                              >
                                <option value="">Selecione a máquina</option>
                                {MACHINE_OPTIONS.map((machine) => (
                                  <option key={machine.id} value={machine.name}>
                                    {machine.name}
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
                              onClick={() => removePaymentMethod(payment.id)}
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
                    <span>Total Pago:</span>
                    <span className={getTotalPayments() === total ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(getTotalPayments())}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={!productDetails || Math.abs(getTotalPayments() - total) > 0.01}
              >
                Registrar Venda
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default NewSale;

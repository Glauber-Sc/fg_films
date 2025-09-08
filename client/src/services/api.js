import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Products ----------
export const fetchProducts = async () => (await api.get("/products")).data;
export const fetchProductById = async (id) =>
  (await api.get(`/products/${id}`)).data;
export const createProduct = async (productData) =>
  (await api.post("/products", productData)).data;
export const updateProduct = async (id, productData) =>
  (await api.put(`/products/${id}`, productData)).data;
export const deleteProduct = async (id) =>
  (await api.delete(`/products/${id}`)).data;

// ---------- Sales ----------
export const fetchSales = async () => (await api.get("/sales")).data;
export const createSale = async (saleData) =>
  (await api.post("/sales", saleData)).data;

// ---------- Customers ----------
export const fetchCustomers = async () => (await api.get("/customers")).data;
export const fetchCustomerById = async (id) =>
  (await api.get(`/customers/${id}`)).data;
export const createCustomer = async (data) =>
  (await api.post("/customers", data)).data;
export const updateCustomer = async (id, data) =>
  (await api.put(`/customers/${id}`, data)).data;
export const deleteCustomer = async (id) =>
  (await api.delete(`/customers/${id}`)).data;

// ---------- Suppliers ----------
export const fetchSuppliers = async () => (await api.get("/suppliers")).data;
export const fetchSupplierById = async (id) =>
  (await api.get(`/suppliers/${id}`)).data;
export const createSupplier = async (data) =>
  (await api.post("/suppliers", data)).data;
export const updateSupplier = async (id, data) =>
  (await api.put(`/suppliers/${id}`, data)).data;
export const deleteSupplier = async (id) =>
  (await api.delete(`/suppliers/${id}`)).data;

// ---------- Quotes ----------
export const fetchQuotes = async () => (await api.get("/quotes")).data;
export const fetchQuoteById = async (id) =>
  (await api.get(`/quotes/${id}`)).data;
export const createQuote = async (data) =>
  (await api.post("/quotes", data)).data;
export const deleteQuote = async (id) =>
  (await api.delete(`/quotes/${id}`)).data;
export const convertQuoteToSale = async (id) =>
  (await api.post(`/quotes/${id}/convert`)).data;

// ---------- Dashboard ----------
export const fetchDashboardData = async () =>
  (await api.get("/dashboard")).data;

// ---------- Reports (AGORA COM PARÂMETROS) ----------
export const fetchReports = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data;
};

// ---------- Expenses ----------
export const fetchExpenses = async () => (await api.get("/expenses")).data;
export const fetchExpenseById = async (id) =>
  (await api.get(`/expenses/${id}`)).data;
export const createExpense = async (data) =>
  (await api.post("/expenses", data)).data;
export const updateExpense = async (id, data) =>
  (await api.put(`/expenses/${id}`, data)).data;
export const deleteExpense = async (id) =>
  (await api.delete(`/expenses/${id}`)).data;

/* ---- ALIAS de compatibilidade (se alguém ainda usa /dispesas no front antigo) ---- */
export async function fetchDispesas() {
  return fetchExpenses();
}
export async function addDispesa(dispesa) {
  return createExpense(dispesa);
}

// ...
// ---------- Services ----------
export const fetchServices = async () => (await api.get("/services")).data;
export const fetchServiceById = async (id) =>
  (await api.get(`/services/${id}`)).data;
export const createService = async (data) =>
  (await api.post("/services", data)).data;
export const updateService = async (id, data) =>
  (await api.put(`/services/${id}`, data)).data;
export const deleteService = async (id) =>
  (await api.delete(`/services/${id}`)).data;
// ...

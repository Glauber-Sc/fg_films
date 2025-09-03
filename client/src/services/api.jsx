// import axios from "axios"

// const API_URL = "http://localhost:3000/api"

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Products API
// export const fetchProducts = async () => {
//   const response = await api.get("/products")
//   return response.data
// }

// export const fetchProductById = async (id) => {
//   const response = await api.get(`/products/${id}`)
//   return response.data
// }

// export const createProduct = async (productData) => {
//   const response = await api.post("/products", productData)
//   return response.data
// }

// export const updateProduct = async (id, productData) => {
//   const response = await api.put(`/products/${id}`, productData)
//   return response.data
// }

// export const deleteProduct = async (id) => {
//   const response = await api.delete(`/products/${id}`)
//   return response.data
// }

// // Sales API
// export const fetchSales = async () => {
//   const response = await api.get("/sales")
//   return response.data
// }

// export const createSale = async (saleData) => {
//   const response = await api.post("/sales", saleData)
//   return response.data
// }

// // Customers API
// export const fetchCustomers = async () => {
//   const response = await api.get("/customers")
//   return response.data
// }

// export const fetchCustomerById = async (id) => {
//   const response = await api.get(`/customers/${id}`)
//   return response.data
// }

// export const createCustomer = async (customerData) => {
//   const response = await api.post("/customers", customerData)
//   return response.data
// }

// export const updateCustomer = async (id, customerData) => {
//   const response = await api.put(`/customers/${id}`, customerData)
//   return response.data
// }

// export const deleteCustomer = async (id) => {
//   const response = await api.delete(`/customers/${id}`)
//   return response.data
// }

// // Suppliers API
// export const fetchSuppliers = async () => {
//   const response = await api.get("/suppliers")
//   return response.data
// }

// export const fetchSupplierById = async (id) => {
//   const response = await api.get(`/suppliers/${id}`)
//   return response.data
// }

// export const createSupplier = async (supplierData) => {
//   const response = await api.post("/suppliers", supplierData)
//   return response.data
// }

// export const updateSupplier = async (id, supplierData) => {
//   const response = await api.put(`/suppliers/${id}`, supplierData)
//   return response.data
// }

// export const deleteSupplier = async (id) => {
//   const response = await api.delete(`/suppliers/${id}`)
//   return response.data
// }

// // Quotes API
// export const fetchQuotes = async () => {
//   const response = await api.get("/quotes")
//   return response.data
// }

// export const fetchQuoteById = async (id) => {
//   const response = await api.get(`/quotes/${id}`)
//   return response.data
// }

// export const createQuote = async (quoteData) => {
//   const response = await api.post("/quotes", quoteData)
//   return response.data
// }

// export const deleteQuote = async (id) => {
//   const response = await api.delete(`/quotes/${id}`)
//   return response.data
// }

// export const convertQuoteToSale = async (id) => {
//   const response = await api.post(`/quotes/${id}/convert`)
//   return response.data
// }

// // Dashboard API
// export const fetchDashboardData = async () => {
//   const response = await api.get("/dashboard")
//   return response.data
// }

// // Reports API
// export const fetchReports = async () => {
//   const response = await api.get("/reports")
//   return response.data
// }



// export async function fetchDispesas() {
//   const res = await fetch('/api/dispesas');
//   return res.json();
// }

// export async function addDispesa(dispesa) {
//   const res = await fetch('/api/dispesas', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(dispesa),
//   });
//   return res.json();
// }



// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Products ----------
export const fetchProducts = async () => (await api.get("/products")).data;
export const fetchProductById = async (id) => (await api.get(`/products/${id}`)).data;
export const createProduct = async (productData) => (await api.post("/products", productData)).data;
export const updateProduct = async (id, productData) => (await api.put(`/products/${id}`, productData)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;

// ---------- Sales ----------
export const fetchSales = async () => (await api.get("/sales")).data;
export const createSale = async (saleData) => (await api.post("/sales", saleData)).data;

// ---------- Customers ----------
export const fetchCustomers = async () => (await api.get("/customers")).data;
export const fetchCustomerById = async (id) => (await api.get(`/customers/${id}`)).data;
export const createCustomer = async (data) => (await api.post("/customers", data)).data;
export const updateCustomer = async (id, data) => (await api.put(`/customers/${id}`, data)).data;
export const deleteCustomer = async (id) => (await api.delete(`/customers/${id}`)).data;

// ---------- Suppliers ----------
export const fetchSuppliers = async () => (await api.get("/suppliers")).data;
export const fetchSupplierById = async (id) => (await api.get(`/suppliers/${id}`)).data;
export const createSupplier = async (data) => (await api.post("/suppliers", data)).data;
export const updateSupplier = async (id, data) => (await api.put(`/suppliers/${id}`, data)).data;
export const deleteSupplier = async (id) => (await api.delete(`/suppliers/${id}`)).data;

// ---------- Quotes ----------
export const fetchQuotes = async () => (await api.get("/quotes")).data;
export const fetchQuoteById = async (id) => (await api.get(`/quotes/${id}`)).data;
export const createQuote = async (data) => (await api.post("/quotes", data)).data;
export const deleteQuote = async (id) => (await api.delete(`/quotes/${id}`)).data;
export const convertQuoteToSale = async (id) => (await api.post(`/quotes/${id}/convert`)).data;

// ---------- Dashboard ----------
export const fetchDashboardData = async () => (await api.get("/dashboard")).data;

// ---------- Reports (AGORA COM PARÂMETROS) ----------
export const fetchReports = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data;
};

// ---------- Expenses ----------
export const fetchExpenses = async () => (await api.get("/expenses")).data;
export const fetchExpenseById = async (id) => (await api.get(`/expenses/${id}`)).data;
export const createExpense = async (data) => (await api.post("/expenses", data)).data;
export const updateExpense = async (id, data) => (await api.put(`/expenses/${id}`, data)).data;
export const deleteExpense = async (id) => (await api.delete(`/expenses/${id}`)).data;

/* ---- ALIAS de compatibilidade (se alguém ainda usa /dispesas no front antigo) ---- */
export async function fetchDispesas() { return fetchExpenses(); }
export async function addDispesa(dispesa) { return createExpense(dispesa); }


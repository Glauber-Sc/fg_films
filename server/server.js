import express from "express"
import cors from "cors"
import morgan from "morgan"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

import productsRoutes from "./routes/products.js"
import salesRoutes from "./routes/sales.js"
import dashboardRoutes from "./routes/dashboard.js"
import reportsRoutes from "./routes/reports.js"
import customersRoutes from "./routes/customers.js"
import suppliersRoutes from "./routes/suppliers.js"
import quotesRoutes from "./routes/quotes.js"
import expensesRoutes from "./routes/expenses.js"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create data directory if it doesn't exist
const dataDir = join(__dirname, "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

// Initialize sample data if it doesn't exist
const productsFile = join(dataDir, "products.json")
const salesFile = join(dataDir, "sales.json")
const customersFile = join(dataDir, "customers.json")
const suppliersFile = join(dataDir, "suppliers.json")
const quotesFile = join(dataDir, "quotes.json")
const expensesFile = join(dataDir, "expenses.json")

if (!fs.existsSync(productsFile)) {
  const initialProducts = [
    {
      id: "1",
      name: "Filtro de Óleo Premium",
      brand: "FilterTech",
      compatibleModel: "Toyota Corolla 2018-2022",
      stock: 15,
      price: 29.99,
      costPrice: 18.5,
      code: "FO-1234",
      supplierId: "1",
    },
    {
      id: "2",
      name: "Pastilha de Freio Dianteira",
      brand: "BrakeMaster",
      compatibleModel: "Honda Civic 2017-2021",
      stock: 8,
      price: 89.9,
      costPrice: 65.0,
      code: "PF-5678",
      supplierId: "2",
    },
    {
      id: "3",
      name: "Amortecedor Traseiro",
      brand: "SuspensionPro",
      compatibleModel: "Volkswagen Golf 2015-2020",
      stock: 4,
      price: 249.9,
      costPrice: 180.0,
      code: "AT-9012",
      supplierId: "1",
    },
    {
      id: "4",
      name: "Kit Correia Dentada",
      brand: "BeltTech",
      compatibleModel: "Fiat Uno 2010-2020",
      stock: 0,
      price: 179.9,
      costPrice: 125.0,
      code: "KCD-3456",
      supplierId: "3",
    },
    {
      id: "5",
      name: "Vela de Ignição Iridium",
      brand: "SparkPro",
      compatibleModel: "Chevrolet Onix 2017-2022",
      stock: 20,
      price: 39.9,
      costPrice: 25.0,
      code: "VI-7890",
      supplierId: "2",
    },
  ]
  fs.writeFileSync(productsFile, JSON.stringify(initialProducts, null, 2))
}

if (!fs.existsSync(salesFile)) {
  const initialSales = [
    {
      id: "1",
      productId: "1",
      productName: "Filtro de Óleo Premium",
      quantity: 2,
      unitPrice: 29.99,
      total: 59.98,
      customerName: "João Silva",
      paymentMethod: "Dinheiro",
      date: "2023-05-20T10:30:00Z",
    },
    {
      id: "2",
      productId: "2",
      productName: "Pastilha de Freio Dianteira",
      quantity: 1,
      unitPrice: 89.9,
      total: 89.9,
      customerName: "Maria Santos",
      paymentMethod: "Cartão de Crédito",
      date: "2023-05-20T14:45:00Z",
    },
    {
      id: "3",
      productId: "5",
      productName: "Vela de Ignição Iridium",
      quantity: 4,
      unitPrice: 39.9,
      total: 159.6,
      paymentMethod: "PIX",
      date: "2023-05-19T09:15:00Z",
    },
  ]
  fs.writeFileSync(salesFile, JSON.stringify(initialSales, null, 2))
}

if (!fs.existsSync(customersFile)) {
  const initialCustomers = [
    {
      id: "1",
      name: "João Silva",
      phone: "(11) 99999-1111",
      document: "123.456.789-00",
      address: "Rua das Flores, 123, Centro, São Paulo",
      notes: "Cliente preferencial",
      createdAt: "2023-05-01T10:00:00Z",
    },
    {
      id: "2",
      name: "Maria Santos",
      phone: "(11) 88888-2222",
      document: "987.654.321-00",
      address: "Av. Paulista, 456, Bela Vista, São Paulo",
      notes: "",
      createdAt: "2023-05-02T14:30:00Z",
    },
  ]
  fs.writeFileSync(customersFile, JSON.stringify(initialCustomers, null, 2))
}

if (!fs.existsSync(suppliersFile)) {
  const initialSuppliers = [
    {
      id: "1",
      name: "AutoPeças Premium Ltda",
      cnpj: "12.345.678/0001-90",
      phone: "(11) 3333-4444",
      email: "vendas@autopecaspremium.com.br",
      address: "Rua Industrial, 789, Vila Madalena, São Paulo",
      notes: "Fornecedor principal de filtros e amortecedores",
      createdAt: "2023-04-01T09:00:00Z",
    },
    {
      id: "2",
      name: "Distribuidora Central",
      cnpj: "98.765.432/0001-10",
      phone: "(11) 5555-6666",
      email: "compras@distribuidoracentral.com.br",
      address: "Av. Marginal, 1000, Ipiranga, São Paulo",
      notes: "Especializada em freios e velas",
      createdAt: "2023-04-02T11:15:00Z",
    },
    {
      id: "3",
      name: "Peças & Cia",
      cnpj: "11.222.333/0001-44",
      phone: "(11) 7777-8888",
      email: "atendimento@pecasecia.com.br",
      address: "Rua do Comércio, 555, Brás, São Paulo",
      notes: "Fornecedor de correias e acessórios",
      createdAt: "2023-04-03T16:45:00Z",
    },
  ]
  fs.writeFileSync(suppliersFile, JSON.stringify(initialSuppliers, null, 2))
}

if (!fs.existsSync(quotesFile)) {
  const initialQuotes = []
  fs.writeFileSync(quotesFile, JSON.stringify(initialQuotes, null, 2))
}

if (!fs.existsSync(expensesFile)) {
  const initialExpenses = []
  fs.writeFileSync(expensesFile, JSON.stringify(initialExpenses, null, 2))
}

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/products", productsRoutes)
app.use("/api/sales", salesRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/customers", customersRoutes)
app.use("/api/suppliers", suppliersRoutes)
app.use("/api/quotes", quotesRoutes)
app.use("/api/expenses", expensesRoutes)

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../client/dist")))

  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../client/dist/index.html"))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

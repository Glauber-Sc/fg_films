// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// import productsRoutes from "./routes/products.js";
// import salesRoutes from "./routes/sales.js";
// import dashboardRoutes from "./routes/dashboard.js";
// import reportsRoutes from "./routes/reports.js";
// import customersRoutes from "./routes/customers.js";
// import suppliersRoutes from "./routes/suppliers.js";
// import quotesRoutes from "./routes/quotes.js";
// import expensesRoutes from "./routes/expenses.js";
// import servicesRoutes from "./routes/services.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // API Routes
// app.use("/api/products", productsRoutes);
// app.use("/api/sales", salesRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/reports", reportsRoutes);
// app.use("/api/customers", customersRoutes);
// app.use("/api/suppliers", suppliersRoutes);
// app.use("/api/quotes", quotesRoutes);
// app.use("/api/expenses", expensesRoutes);
// app.use("/api/services", servicesRoutes);

// // Static (produção)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(join(__dirname, "../client/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(join(__dirname, "../client/dist/index.html"));
//   });
// }

// // Start
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// server/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import productsRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportsRoutes from "./routes/reports.js";
import customersRoutes from "./routes/customers.js";
import suppliersRoutes from "./routes/suppliers.js";
import quotesRoutes from "./routes/quotes.js";
import expensesRoutes from "./routes/expenses.js";
import servicesRoutes from "./routes/services.js";

import { initDb } from "./db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initDb(); // <-- garante tabelas criadas

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/services", servicesRoutes);

// Static (produção)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../client/dist/index.html"));
  });
}

// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

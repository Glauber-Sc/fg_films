import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { spawn } from "child_process";

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

const isPkg = !!process.pkg;

if (isPkg) {
  try {
    process.chdir(path.dirname(process.execPath));
  } catch {}
}

const baseDir = isPkg ? path.dirname(process.execPath) : process.cwd();
const webDir = path.join(baseDir, "web");

initDb();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/services", servicesRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true, baseDir, webDir });
});

app.use(express.static(webDir));
app.get("*", (req, res) => {
  res.sendFile(path.join(webDir, "index.html"));
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server rodando em http://127.0.0.1:${PORT}`);
  try {
    spawn("cmd", ["/c", "start", `http://127.0.0.1:${PORT}`], {
      detached: true,
      stdio: "ignore",
    }).unref();
  } catch {}
});

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ViewProduct from "./pages/ViewProduct";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Sales from "./pages/Sales";
import NewSale from "./pages/NewSale";
import ViewSale from "./pages/ViewSale";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import PDV from "./pages/PDV";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";
import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import EditSupplier from "./pages/EditSupplier";
import Quotes from "./pages/Quotes";
import AddQuote from "./pages/AddQuote";
import ViewQuote from "./pages/ViewQuote";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import EditService from "./pages/EditService";
import ViewService from "./pages/ViewService";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const location = useLocation();
  const isPDV = location.pathname === "/pdv";

  return (
    <div className="flex h-screen bg-gray-50">
      {!isPDV && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isPDV ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className={isPDV ? "" : "p-6"}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/products/view/:id" element={<ViewProduct />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/new" element={<NewSale />} />
            <Route path="/sales/view/:id" element={<ViewSale />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/pdv" element={<PDV />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/add" element={<AddSupplier />} />
            <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/add" element={<AddQuote />} />
            <Route path="/quotes/view/:id" element={<ViewQuote />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/add" element={<AddExpense />} />
            <Route path="/expenses/edit/:id" element={<EditExpense />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/add" element={<AddService />} />
            <Route path="/services/edit/:id" element={<EditService />} />
            <Route path="/services/view/:id" element={<ViewService />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

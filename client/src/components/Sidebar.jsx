"use client"

import { Link, useLocation } from "react-router-dom"
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const menuItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "PDV", path: "/pdv", icon: ShoppingBagIcon },
    { name: "Produtos", path: "/products", icon: CubeIcon },
    { name: "Vendas", path: "/sales", icon: ShoppingCartIcon },
    { name: "Orçamentos", path: "/quotes", icon: DocumentTextIcon },
    { name: "Clientes", path: "/customers", icon: UsersIcon },
    { name: "Fornecedores", path: "/suppliers", icon: BuildingOfficeIcon },
    { name: "Despesas", path: "/expenses", icon: DocumentTextIcon },
    { name: "Estoque", path: "/inventory", icon: ClipboardDocumentListIcon },
    { name: "Relatórios", path: "/reports", icon: ChartBarIcon },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 text-black-600 hover:text-black-800 text-sm font-medium ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {isOpen && <h1 className="text-xl font-bold text-red-600">FgFilms</h1>}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
          {isOpen ? <XMarkIcon className="w-6 h-6 text-gray-500" /> : <Bars3Icon className="w-6 h-6 text-gray-500" />}
        </button>
      </div>

      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  isActive(item.path)
                    ? "bg-red-50 text-red-600 border-r-4 border-red-600"
                    : "text-gray-600 hover:bg-gray-100"
                } transition-colors`}
              >
                <item.icon className="w-6 h-6" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CubeIcon, ShoppingCartIcon, CurrencyDollarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import PageHeader from "../components/PageHeader"
import StatsCard from "../components/StatsCard"
import Card from "../components/Card"
import { formatCurrency } from "../utils/format"
import { fetchDashboardData } from "../services/api"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalSales: 0,     // agora é do DIA (servidor já devolve por dia)
    revenue: 0,        // agora é do DIA (servidor já devolve por dia)
    lowStockProducts: 0,
    recentSales: [],
    lowStockItems: [],
    topProducts: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Carregando...</div>
  }

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total de Produtos" value={dashboardData.totalProducts} icon={CubeIcon} color="blue" />
        <StatsCard title="Vendas" value={dashboardData.totalSales} icon={ShoppingCartIcon} color="green" />
        <StatsCard
          title="Faturamento"
          value={formatCurrency(dashboardData.revenue)}
          icon={CurrencyDollarIcon}
          color="yellow"
        />
        <StatsCard
          title="Estoque Baixo/Esgotado"
          value={dashboardData.lowStockProducts}
          icon={ExclamationCircleIcon}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Vendas Recentes">
          {dashboardData.recentSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="table-header">Produto</th>
                    <th className="table-header">Qtd</th>
                    <th className="table-header">Valor</th>
                    <th className="table-header">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{sale.productName}</td>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{sale.quantity}</td>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(sale.total)}</td>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{new Date(sale.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma venda recente</p>
          )}
          <div className="mt-4 text-right">
            <Link to="/sales" className="text-red-600 hover:text-red-800 text-sm font-medium">
              Ver todas as vendas →
            </Link>
          </div>
        </Card>

        <Card title="Produtos com Estoque Baixo">
          {dashboardData.lowStockItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="table-header">Produto</th>
                    <th className="table-header">Estoque</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.lowStockItems.map((product) => (
                    <tr key={product.id}>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.name}</td>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.stock}</td>
                      <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">
                        <span className={`badge ${product.stock === 0 ? "badge-danger" : "badge-warning"}`}>
                          {product.stock === 0 ? "Esgotado" : "Estoque Baixo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum produto com estoque baixo</p>
          )}
          <div className="mt-4 text-right">
            <Link to="/inventory" className="text-red-600 hover:text-red-800 text-sm font-medium">
              Ver estoque completo →
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Produtos Mais Vendidos">
        {dashboardData.topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="table-header">Produto</th>
                  <th className="table-header">Marca</th>
                  <th className="table-header">Qtd. Vendida</th>
                  <th className="table-header">Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.name}</td>
                    <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.brand}</td>
                    <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{product.totalSold}</td>
                    <td className="table-cell text-black-600 hover:text-black-800 text-sm font-medium">{formatCurrency(product.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhuma venda registrada</p>
        )}
        <div className="mt-4 text-right">
          <Link to="/reports" className="text-red-600 hover:text-red-800 text-sm font-medium">
            Ver relatórios completos →
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard

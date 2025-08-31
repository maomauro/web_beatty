import { Card, CardContent } from '../../components/ui/card';
import { 
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
}

interface CategoryStats {
  name: string;
  productCount: number;
  percentage: number;
  color: string;
}

export function DashboardPage() {
  // Datos de ejemplo
  const productStats: ProductStats = {
    total: 156,
    active: 142,
    inactive: 14,
    lowStock: 23,
    outOfStock: 8,
    totalValue: 24500000,
    averagePrice: 157051
  };

  const categoryStats: CategoryStats[] = [
    { name: 'Cuidado Dental', productCount: 45, percentage: 29, color: '#3B82F6' },
    { name: 'Afeitado', productCount: 32, percentage: 21, color: '#10B981' },
    { name: 'Higiene Personal', productCount: 28, percentage: 18, color: '#F59E0B' },
    { name: 'Cuidado Facial', productCount: 23, percentage: 15, color: '#EF4444' },
    { name: 'Otros', productCount: 28, percentage: 18, color: '#8B5CF6' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Producto agregado',
      product: 'Cepillo dental suave',
      time: 'Hace 2 horas',
      type: 'add'
    },
    {
      id: 2,
      action: 'Stock actualizado',
      product: 'Enjuague bucal Fresh',
      time: 'Hace 4 horas',
      type: 'update'
    },
    {
      id: 3,
      action: 'Producto desactivado',
      product: 'After Shave Bálsamo',
      time: 'Hace 1 día',
      type: 'deactivate'
    },
    {
      id: 4,
      action: 'Precio modificado',
      product: 'Máquina de afeitar x3',
      time: 'Hace 2 días',
      type: 'price'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'update':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'deactivate':
        return <Clock className="h-4 w-4 text-red-600" />;
      case 'price':
        return <DollarSign className="h-4 w-4 text-yellow-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas de Productos</h1>
        <p className="text-gray-600 mt-2">
          Análisis y métricas de tus productos en el catálogo
        </p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Productos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(productStats.averagePrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Categorías */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categorías</h3>
            <div className="space-y-3">
              {categoryStats.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{category.productCount}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estado de Stock */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Stock</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Stock Normal</span>
                </div>
                <span className="font-semibold text-green-600">
                  {productStats.total - productStats.lowStock - productStats.outOfStock}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">Stock Bajo</span>
                </div>
                <span className="font-semibold text-yellow-600">{productStats.lowStock}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-gray-900">Sin Stock</span>
                </div>
                <span className="font-semibold text-red-600">{productStats.outOfStock}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.product}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Financiero */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(productStats.totalValue)}</p>
              <p className="text-sm text-blue-700">Valor Total Inventario</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">{formatCurrency(productStats.averagePrice)}</p>
              <p className="text-sm text-green-700">Precio Promedio</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">{productStats.active}</p>
              <p className="text-sm text-purple-700">Productos Activos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

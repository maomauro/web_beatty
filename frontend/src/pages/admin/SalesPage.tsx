import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  DollarSign,
  Search,
  Filter,
  Eye,
  TrendingUp,
  Calendar,
  User,
  Package,
  RefreshCw,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShoppingCart,
  Award
} from 'lucide-react';

interface Sale {
  id_venta: number;
  id_usuario: number;
  fecha_venta: string;
  total_venta: number;
  estado: string;
  // Información relacionada
  usuario_nombre: string;
  usuario_apellido: string;
  items_count: number;
  items_details: CartItem[];
}

interface CartItem {
  id_carrito: number;
  id_producto: number;
  cantidad: number;
  valor_unitario: number;
  iva_calculado: number;
  subtotal: number;
  producto_nombre: string;
  producto_codigo: string;
}

interface SalesSummary {
  total_ventas: number;
  ventas_confirmadas: number;
  ventas_pendientes: number;
  ventas_canceladas: number;
  valor_total_ventas: number;
  valor_promedio_venta: number;
  mejor_cliente: string;
  producto_mas_vendido: string;
  crecimiento_mensual: number;
}

export function SalesPage() {
  const [sales] = useState<Sale[]>([
    {
      id_venta: 1,
      id_usuario: 2,
      fecha_venta: '2024-01-15 14:30:00',
      total_venta: 12412.00,
      estado: 'CONFIRMADO',
      usuario_nombre: 'María',
      usuario_apellido: 'Gómez',
      items_count: 2,
      items_details: [
        {
          id_carrito: 2,
          id_producto: 32,
          cantidad: 1,
          valor_unitario: 5200.00,
          iva_calculado: 208.00,
          subtotal: 5408.00,
          producto_nombre: 'Cepillo dental suave',
          producto_codigo: 'PROD-002'
        },
        {
          id_carrito: 6,
          id_producto: 33,
          cantidad: 1,
          valor_unitario: 7004.00,
          iva_calculado: 280.16,
          subtotal: 7004.00,
          producto_nombre: 'Enjuague bucal Fresh Mint 250ml',
          producto_codigo: 'PROD-003'
        }
      ]
    },
    {
      id_venta: 2,
      id_usuario: 4,
      fecha_venta: '2024-01-14 16:45:00',
      total_venta: 7004.00,
      estado: 'CONFIRMADO',
      usuario_nombre: 'Laura',
      usuario_apellido: 'Martínez',
      items_count: 1,
      items_details: [
        {
          id_carrito: 4,
          id_producto: 34,
          cantidad: 1,
          valor_unitario: 6800.00,
          iva_calculado: 204.00,
          subtotal: 7004.00,
          producto_nombre: 'Cepillo dental encías sensibles',
          producto_codigo: 'PROD-004'
        }
      ]
    },
    {
      id_venta: 3,
      id_usuario: 1,
      fecha_venta: '2024-01-13 11:20:00',
      total_venta: 18500.00,
      estado: 'PENDIENTE',
      usuario_nombre: 'Juan',
      usuario_apellido: 'Pérez',
      items_count: 2,
      items_details: [
        {
          id_carrito: 7,
          id_producto: 35,
          cantidad: 1,
          valor_unitario: 12500.00,
          iva_calculado: 500.00,
          subtotal: 13000.00,
          producto_nombre: 'Máquina de afeitar desechable x3',
          producto_codigo: 'PROD-005'
        },
        {
          id_carrito: 8,
          id_producto: 36,
          cantidad: 1,
          valor_unitario: 5500.00,
          iva_calculado: 220.00,
          subtotal: 5500.00,
          producto_nombre: 'Máquina de afeitar Sensitive',
          producto_codigo: 'PROD-006'
        }
      ]
    },
    {
      id_venta: 4,
      id_usuario: 3,
      fecha_venta: '2024-01-12 09:15:00',
      total_venta: 0.00,
      estado: 'CANCELADO',
      usuario_nombre: 'Carlos',
      usuario_apellido: 'Rodríguez',
      items_count: 0,
      items_details: []
    },
    {
      id_venta: 5,
      id_usuario: 5,
      fecha_venta: '2024-01-11 13:30:00',
      total_venta: 32000.00,
      estado: 'CONFIRMADO',
      usuario_nombre: 'Andrés',
      usuario_apellido: 'Ramírez',
      items_count: 3,
      items_details: [
        {
          id_carrito: 9,
          id_producto: 37,
          cantidad: 2,
          valor_unitario: 13500.00,
          iva_calculado: 540.00,
          subtotal: 27000.00,
          producto_nombre: 'Espuma de afeitar 200ml',
          producto_codigo: 'PROD-007'
        },
        {
          id_carrito: 10,
          id_producto: 38,
          cantidad: 1,
          valor_unitario: 5000.00,
          iva_calculado: 200.00,
          subtotal: 5000.00,
          producto_nombre: 'After Shave Bálsamo 150ml',
          producto_codigo: 'PROD-008'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [dateFilter, setDateFilter] = useState<string>('TODOS');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Calcular estadísticas
  const salesSummary: SalesSummary = {
    total_ventas: sales.length,
    ventas_confirmadas: sales.filter(sale => sale.estado === 'CONFIRMADO').length,
    ventas_pendientes: sales.filter(sale => sale.estado === 'PENDIENTE').length,
    ventas_canceladas: sales.filter(sale => sale.estado === 'CANCELADO').length,
    valor_total_ventas: sales
      .filter(sale => sale.estado === 'CONFIRMADO')
      .reduce((sum, sale) => sum + sale.total_venta, 0),
    valor_promedio_venta: sales.filter(sale => sale.estado === 'CONFIRMADO').length > 0
      ? sales.filter(sale => sale.estado === 'CONFIRMADO').reduce((sum, sale) => sum + sale.total_venta, 0) / sales.filter(sale => sale.estado === 'CONFIRMADO').length
      : 0,
    mejor_cliente: sales
      .filter(sale => sale.estado === 'CONFIRMADO')
      .reduce((best, sale) => sale.total_venta > best.total_venta ? sale : best, sales[0] || { usuario_nombre: 'N/A', usuario_apellido: 'N/A' })
      .usuario_nombre + ' ' + sales
      .filter(sale => sale.estado === 'CONFIRMADO')
      .reduce((best, sale) => sale.total_venta > best.total_venta ? sale : best, sales[0] || { usuario_apellido: 'N/A' })
      .usuario_apellido,
    producto_mas_vendido: 'Cepillo dental suave',
    crecimiento_mensual: 15.5
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.usuario_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id_venta.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'TODOS' || sale.estado === statusFilter;
    
    const matchesDate = dateFilter === 'TODOS' || 
      (dateFilter === 'HOY' && isToday(sale.fecha_venta)) ||
      (dateFilter === 'SEMANA' && isThisWeek(sale.fecha_venta)) ||
      (dateFilter === 'MES' && isThisMonth(sale.fecha_venta));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADO':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'PENDIENTE':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'CANCELADO':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Menos de 1 hora';
    if (diffInHours < 24) return `${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} días`;
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isThisMonth = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes de Ventas</h1>
          <p className="text-gray-600 mt-2">
            Analiza y monitorea el rendimiento de ventas del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          <Button onClick={() => window.location.reload()} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900">{salesSummary.total_ventas}</p>
                <p className="text-xs text-blue-600">
                  {formatCurrency(salesSummary.valor_total_ventas)}
                </p>
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
                <p className="text-sm text-gray-500">Confirmadas</p>
                <p className="text-2xl font-bold text-gray-900">{salesSummary.ventas_confirmadas}</p>
                <p className="text-xs text-green-600">
                  Promedio: {formatCurrency(salesSummary.valor_promedio_venta)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Crecimiento</p>
                <p className="text-2xl font-bold text-gray-900">{salesSummary.crecimiento_mensual}%</p>
                <p className="text-xs text-yellow-600">
                  Este mes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mejor Cliente</p>
                <p className="text-lg font-bold text-gray-900 truncate">{salesSummary.mejor_cliente}</p>
                <p className="text-xs text-purple-600">
                  Mayor compra
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente o ID de venta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="CONFIRMADO">Confirmadas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CANCELADO">Canceladas</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="TODOS">Todas las fechas</option>
                <option value="HOY">Hoy</option>
                <option value="SEMANA">Esta semana</option>
                <option value="MES">Este mes</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredSales.length} de {sales.length} ventas
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de ventas */}
      <div className="grid gap-4">
        {filteredSales.map((sale) => (
          <Card key={sale.id_venta}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(sale.estado)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        Venta #{sale.id_venta}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {sale.usuario_nombre} {sale.usuario_apellido}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sale.estado)}`}>
                        {sale.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {sale.items_count} productos • {formatCurrency(sale.total_venta)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(sale.fecha_venta)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{sale.items_count} items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Total: {formatCurrency(sale.total_venta)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeSince(sale.fecha_venta)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(sale)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver Detalles</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de detalles */}
      {isDetailModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Detalles de Venta #{selectedSale.id_venta}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Información de la venta */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Información de la Venta</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">ID Venta:</span>
                    <p className="font-medium">#{selectedSale.id_venta}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Cliente:</span>
                    <p className="font-medium">{selectedSale.usuario_nombre} {selectedSale.usuario_apellido}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedSale.estado)}`}>
                      {selectedSale.estado}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <p className="font-medium">{formatCurrency(selectedSale.total_venta)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <p className="font-medium">{formatDate(selectedSale.fecha_venta)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Items:</span>
                    <p className="font-medium">{selectedSale.items_count} productos</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tiempo:</span>
                    <p className="font-medium">{getTimeSince(selectedSale.fecha_venta)}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de productos */}
              {selectedSale.items_details.length > 0 ? (
                <div className="bg-white border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Productos de la Venta</span>
                    </h3>
                  </div>
                  <div className="divide-y">
                    {selectedSale.items_details.map((item) => (
                      <div key={item.id_carrito} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {item.producto_nombre}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {item.producto_codigo}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>Cantidad: {item.cantidad}</span>
                              <span>Precio: {formatCurrency(item.valor_unitario)}</span>
                              <span>IVA: {formatCurrency(item.iva_calculado)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total de la Venta:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(selectedSale.total_venta)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="text-yellow-800">Esta venta no tiene productos asociados</span>
                  </div>
                </div>
              )}

              {/* Información del cliente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Información del Cliente</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nombre:</span>
                    <p className="font-medium">{selectedSale.usuario_nombre} {selectedSale.usuario_apellido}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">ID Usuario:</span>
                    <p className="font-medium">{selectedSale.id_usuario}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Generar Factura</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  ShoppingCart,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Package,
  DollarSign,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface CartItem {
  id_carrito: number;
  id_venta: number | null;
  id_usuario: number;
  id_producto: number;
  fecha_carrito: string;
  cantidad: number;
  valor_unitario: number;
  iva_calculado: number;
  subtotal: number;
  estado: string;
  fecha_abandono: string | null;
  // Información relacionada
  usuario_nombre: string;
  usuario_apellido: string;
  producto_nombre: string;
  producto_codigo: string;
  venta_total: number | null;
  venta_estado: string | null;
}

interface CartSummary {
  total_carritos: number;
  carritos_activos: number;
  carritos_abandonados: number;
  carritos_concretados: number;
  valor_total_abandonado: number;
  valor_total_concretado: number;
  promedio_abandono: number;
}

export function CartsPage() {
  const [cartItems] = useState<CartItem[]>([
    {
      id_carrito: 1,
      id_venta: null,
      id_usuario: 1,
      id_producto: 31,
      fecha_carrito: '2024-01-15 10:30:00',
      cantidad: 2,
      valor_unitario: 4500.00,
      iva_calculado: 180.00,
      subtotal: 9180.00,
      estado: 'ACTIVO',
      fecha_abandono: null,
      usuario_nombre: 'Juan',
      usuario_apellido: 'Pérez',
      producto_nombre: 'Cepillo de dientes clásico',
      producto_codigo: 'PROD-001',
      venta_total: null,
      venta_estado: null
    },
    {
      id_carrito: 2,
      id_venta: 1,
      id_usuario: 2,
      id_producto: 32,
      fecha_carrito: '2024-01-14 15:45:00',
      cantidad: 1,
      valor_unitario: 5200.00,
      iva_calculado: 208.00,
      subtotal: 5408.00,
      estado: 'CONCRETADO',
      fecha_abandono: null,
      usuario_nombre: 'María',
      usuario_apellido: 'Gómez',
      producto_nombre: 'Cepillo dental suave',
      producto_codigo: 'PROD-002',
      venta_total: 5408.00,
      venta_estado: 'CONFIRMADO'
    },
    {
      id_carrito: 3,
      id_venta: null,
      id_usuario: 3,
      id_producto: 33,
      fecha_carrito: '2024-01-13 09:20:00',
      cantidad: 3,
      valor_unitario: 8900.00,
      iva_calculado: 356.00,
      subtotal: 27056.00,
      estado: 'ABANDONADO',
      fecha_abandono: '2024-01-13 11:30:00',
      usuario_nombre: 'Carlos',
      usuario_apellido: 'Rodríguez',
      producto_nombre: 'Enjuague bucal Fresh Mint 250ml',
      producto_codigo: 'PROD-003',
      venta_total: null,
      venta_estado: null
    },
    {
      id_carrito: 4,
      id_venta: 2,
      id_usuario: 4,
      id_producto: 34,
      fecha_carrito: '2024-01-12 14:15:00',
      cantidad: 1,
      valor_unitario: 6800.00,
      iva_calculado: 204.00,
      subtotal: 7004.00,
      estado: 'CONCRETADO',
      fecha_abandono: null,
      usuario_nombre: 'Laura',
      usuario_apellido: 'Martínez',
      producto_nombre: 'Cepillo dental encías sensibles',
      producto_codigo: 'PROD-004',
      venta_total: 7004.00,
      venta_estado: 'CONFIRMADO'
    },
    {
      id_carrito: 5,
      id_venta: null,
      id_usuario: 5,
      id_producto: 35,
      fecha_carrito: '2024-01-11 16:30:00',
      cantidad: 2,
      valor_unitario: 12500.00,
      iva_calculado: 500.00,
      subtotal: 25500.00,
      estado: 'ABANDONADO',
      fecha_abandono: '2024-01-11 18:45:00',
      usuario_nombre: 'Andrés',
      usuario_apellido: 'Ramírez',
      producto_nombre: 'Máquina de afeitar desechable x3',
      producto_codigo: 'PROD-005',
      venta_total: null,
      venta_estado: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [selectedCart, setSelectedCart] = useState<CartItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Calcular estadísticas
  const cartSummary: CartSummary = {
    total_carritos: cartItems.length,
    carritos_activos: cartItems.filter(item => item.estado === 'ACTIVO').length,
    carritos_abandonados: cartItems.filter(item => item.estado === 'ABANDONADO').length,
    carritos_concretados: cartItems.filter(item => item.estado === 'CONCRETADO').length,
    valor_total_abandonado: cartItems
      .filter(item => item.estado === 'ABANDONADO')
      .reduce((sum, item) => sum + item.subtotal, 0),
    valor_total_concretado: cartItems
      .filter(item => item.estado === 'CONCRETADO')
      .reduce((sum, item) => sum + item.subtotal, 0),
    promedio_abandono: cartItems.length > 0 
      ? (cartItems.filter(item => item.estado === 'ABANDONADO').length / cartItems.length) * 100
      : 0
  };

  const filteredCartItems = cartItems.filter(item => {
    const matchesSearch = 
      item.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usuario_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.producto_codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || item.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (cart: CartItem) => {
    setSelectedCart(cart);
    setIsDetailModalOpen(true);
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'CONCRETADO':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ABANDONADO':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-blue-100 text-blue-800';
      case 'CONCRETADO':
        return 'bg-green-100 text-green-800';
      case 'ABANDONADO':
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Carritos</h1>
          <p className="text-gray-600 mt-2">
            Monitorea y administra los carritos de compra del sistema
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Carritos</p>
                <p className="text-2xl font-bold text-gray-900">{cartSummary.total_carritos}</p>
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
                <p className="text-sm text-gray-500">Concretados</p>
                <p className="text-2xl font-bold text-gray-900">{cartSummary.carritos_concretados}</p>
                <p className="text-xs text-green-600">
                  {formatCurrency(cartSummary.valor_total_concretado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abandonados</p>
                <p className="text-2xl font-bold text-gray-900">{cartSummary.carritos_abandonados}</p>
                <p className="text-xs text-red-600">
                  {formatCurrency(cartSummary.valor_total_abandonado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa Abandono</p>
                <p className="text-2xl font-bold text-gray-900">{cartSummary.promedio_abandono.toFixed(1)}%</p>
                <p className="text-xs text-yellow-600">
                  {cartSummary.carritos_activos} activos
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
                  placeholder="Buscar por cliente, producto o código..."
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
                <option value="ACTIVO">Activos</option>
                <option value="CONCRETADO">Concretados</option>
                <option value="ABANDONADO">Abandonados</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredCartItems.length} de {cartItems.length} carritos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de carritos */}
      <div className="grid gap-4">
        {filteredCartItems.map((cart) => (
          <Card key={cart.id_carrito}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(cart.estado)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {cart.usuario_nombre} {cart.usuario_apellido}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ID: {cart.id_carrito}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cart.estado)}`}>
                        {cart.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {cart.producto_nombre} ({cart.producto_codigo})
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>Cantidad: {cart.cantidad}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Subtotal: {formatCurrency(cart.subtotal)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Creado: {getTimeSince(cart.fecha_carrito)}</span>
                      </div>
                      {cart.estado === 'ABANDONADO' && cart.fecha_abandono && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Abandonado: {getTimeSince(cart.fecha_abandono)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(cart)}
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
      {isDetailModalOpen && selectedCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Detalles del Carrito #{selectedCart.id_carrito}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Información del cliente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Información del Cliente</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Cliente:</span>
                    <p className="font-medium">{selectedCart.usuario_nombre} {selectedCart.usuario_apellido}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">ID Usuario:</span>
                    <p className="font-medium">{selectedCart.id_usuario}</p>
                  </div>
                </div>
              </div>

              {/* Información del producto */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Información del Producto</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Producto:</span>
                    <p className="font-medium">{selectedCart.producto_nombre}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Código:</span>
                    <p className="font-medium">{selectedCart.producto_codigo}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">ID Producto:</span>
                    <p className="font-medium">{selectedCart.id_producto}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Cantidad:</span>
                    <p className="font-medium">{selectedCart.cantidad}</p>
                  </div>
                </div>
              </div>

              {/* Información financiera */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Información Financiera</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Valor Unitario:</span>
                    <p className="font-medium">{formatCurrency(selectedCart.valor_unitario)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">IVA Calculado:</span>
                    <p className="font-medium">{formatCurrency(selectedCart.iva_calculado)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Subtotal:</span>
                    <p className="font-medium">{formatCurrency(selectedCart.subtotal)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedCart.estado)}`}>
                      {selectedCart.estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información temporal */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Información Temporal</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha de Creación:</span>
                    <p className="font-medium">{formatDate(selectedCart.fecha_carrito)}</p>
                  </div>
                  {selectedCart.fecha_abandono && (
                    <div>
                      <span className="text-gray-500">Fecha de Abandono:</span>
                      <p className="font-medium">{formatDate(selectedCart.fecha_abandono)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Tiempo Transcurrido:</span>
                    <p className="font-medium">{getTimeSince(selectedCart.fecha_carrito)}</p>
                  </div>
                </div>
              </div>

              {/* Información de venta (si aplica) */}
              {selectedCart.id_venta && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Información de Venta</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">ID Venta:</span>
                      <p className="font-medium">{selectedCart.id_venta}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Venta:</span>
                      <p className="font-medium">{formatCurrency(selectedCart.venta_total || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado Venta:</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {selectedCart.venta_estado}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
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

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Calendar,
  Download,
  FileText,
  Search,
  CalendarDays,
  DollarSign,
  ShoppingCart
} from 'lucide-react';

interface SalesReport {
  id: string;
  date: string;
  customerName: string;
  products: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export function ReportsPage() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Datos de ejemplo para el reporte
  const salesData: SalesReport[] = [
    {
      id: 'V001',
      date: '2024-01-15',
      customerName: 'Andrés Ramírez',
      products: 'Cepillo dental, Enjuague bucal',
      total: 45000,
      status: 'completed'
    },
    {
      id: 'V002',
      date: '2024-01-14',
      customerName: 'María Gómez',
      products: 'Máquina de afeitar, Espuma de afeitar',
      total: 78000,
      status: 'completed'
    },
    {
      id: 'V003',
      date: '2024-01-13',
      customerName: 'Juan Pérez',
      products: 'After Shave, Toallas húmedas',
      total: 32000,
      status: 'pending'
    },
    {
      id: 'V004',
      date: '2024-01-12',
      customerName: 'Laura Martínez',
      products: 'Cepillo dental, Pasta dental',
      total: 28000,
      status: 'completed'
    },
    {
      id: 'V005',
      date: '2024-01-11',
      customerName: 'Carlos Rodríguez',
      products: 'Máquina de afeitar x3',
      total: 120000,
      status: 'cancelled'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const filteredSales = salesData.filter(sale => {
    const matchesDate = (!startDate || sale.date >= startDate) && 
                       (!endDate || sale.date <= endDate);
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesStatus && matchesSearch;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = filteredSales.filter(sale => sale.status === 'completed').length;

  const handleExportPDF = () => {
    console.log('Exportando reporte de ventas a PDF...');
    alert('Reporte de ventas se está descargando en PDF...');
  };

  const handleExportExcel = () => {
    console.log('Exportando reporte de ventas a Excel...');
    alert('Reporte de ventas se está descargando en Excel...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes de Ventas</h1>
        <p className="text-gray-600 mt-2">
          Genera reportes detallados de ventas por fecha
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Filtro de Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completadas</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cliente o ID de venta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{completedSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Registros</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Ventas */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Listado de Ventas</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Exportar PDF</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportExcel}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID Venta</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Productos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">{sale.id}</td>
                    <td className="py-3 px-4">{formatDate(sale.date)}</td>
                    <td className="py-3 px-4 font-medium">{sale.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{sale.products}</td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(sale.total)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                        {getStatusText(sale.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron ventas con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

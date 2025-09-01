import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Calendar,
  Download,
  FileText,
  Search,
  CalendarDays,
  DollarSign,
  ShoppingCart,
  Loader2,
  X
} from 'lucide-react';
import { reportsService, SalesReportItem, SalesSummary, ReportFilters } from '../../services/reportsService';
import { toast } from 'sonner';

export function ReportsPage() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estados para datos reales
  const [salesData, setSalesData] = useState<SalesReportItem[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar datos iniciales
  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setError('');

    try {
      const filters: ReportFilters = {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        status_filter: statusFilter !== 'all' ? statusFilter : undefined,
        search_term: searchTerm || undefined
      };

      const [reportResponse, summaryResponse] = await Promise.all([
        reportsService.getSalesReport(filters),
        reportsService.getSalesSummary({ start_date: startDate, end_date: endDate })
      ]);

      setSalesData(reportResponse.sales);
      setSummary(summaryResponse);
    } catch (err: any) {
      console.error('Error cargando reporte:', err);
      setError(err.response?.data?.detail || 'Error cargando reporte de ventas');
      toast.error('Error cargando reporte de ventas');
    } finally {
      setLoading(false);
    }
  };

  // Recargar datos cuando cambien los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadReportData();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, statusFilter, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    // Crear fecha en zona horaria local para evitar problemas de UTC
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
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
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const filteredSales = salesData;
  const totalSales = summary?.total_sales || 0;
  const completedSales = summary?.completed_sales || 0;

  const handleExportPDF = () => {
    console.log('Exportando reporte de ventas a PDF...');
    toast.info('Funcionalidad de exportación PDF en desarrollo');
  };

  const handleExportExcel = () => {
    console.log('Exportando reporte de ventas a Excel...');
    toast.info('Funcionalidad de exportación Excel en desarrollo');
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setSearchTerm('');
    toast.success('Filtros limpiados');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <option value="confirmed">Confirmadas</option>
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

            {/* Botón Limpiar Filtros */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center space-x-2 h-10 w-full"
              >
                <X className="h-4 w-4" />
                <span>Limpiar Filtros</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.total_sales || 0)}</p>
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
                <p className="text-sm text-gray-500">Ventas Confirmadas</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.completed_sales || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.pending_sales || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Registros</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.total_records || 0}</p>
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Cargando reporte...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No se encontraron ventas con los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id_venta} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">V{sale.id_venta.toString().padStart(3, '0')}</td>
                      <td className="py-3 px-4">{formatDate(sale.fecha_venta)}</td>
                      <td className="py-3 px-4 font-medium">{sale.customer_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{sale.products}</td>
                      <td className="py-3 px-4 font-semibold">{formatCurrency(sale.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                          {getStatusText(sale.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

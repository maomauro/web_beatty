import { Card, CardContent } from '../../components/ui/card';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  Package,
  Users,
  Target,
  Award
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface KPI {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
  icon: React.ReactNode;
  color: string;
}

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface ProductData {
  name: string;
  sales: number;
  quantity: number;
  revenue: number;
}

interface CustomerData {
  name: string;
  totalSpent: number;
  orders: number;
  lastOrder: string;
  segment: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export function DashboardPage() {

  // Datos de ejemplo para gráficos
  const salesData: SalesData[] = [
    { date: 'Ene 1', sales: 45000, orders: 12 },
    { date: 'Ene 2', sales: 52000, orders: 15 },
    { date: 'Ene 3', sales: 38000, orders: 10 },
    { date: 'Ene 4', sales: 61000, orders: 18 },
    { date: 'Ene 5', sales: 49000, orders: 14 },
    { date: 'Ene 6', sales: 55000, orders: 16 },
    { date: 'Ene 7', sales: 67000, orders: 20 },
  ];

  const topProducts: ProductData[] = [
    { name: 'Cepillo dental suave', sales: 45, quantity: 180, revenue: 234000 },
    { name: 'Enjuague bucal Fresh', sales: 38, quantity: 152, revenue: 198000 },
    { name: 'Máquina de afeitar x3', sales: 32, quantity: 96, revenue: 384000 },
    { name: 'Espuma de afeitar', sales: 28, quantity: 84, revenue: 378000 },
    { name: 'After Shave Bálsamo', sales: 25, quantity: 75, revenue: 125000 },
  ];

  const topCustomers: CustomerData[] = [
    { name: 'Andrés Ramírez', totalSpent: 320000, orders: 8, lastOrder: '2024-01-15', segment: 'Premium' },
    { name: 'María Gómez', totalSpent: 245000, orders: 6, lastOrder: '2024-01-14', segment: 'Regular' },
    { name: 'Juan Pérez', totalSpent: 198000, orders: 5, lastOrder: '2024-01-13', segment: 'Regular' },
    { name: 'Laura Martínez', totalSpent: 156000, orders: 4, lastOrder: '2024-01-12', segment: 'Nuevo' },
    { name: 'Carlos Rodríguez', totalSpent: 134000, orders: 3, lastOrder: '2024-01-11', segment: 'Nuevo' },
  ];

  const categoryData: CategoryData[] = [
    { name: 'Cuidado Dental', value: 35, color: '#3B82F6' },
    { name: 'Afeitado', value: 28, color: '#10B981' },
    { name: 'Higiene Personal', value: 22, color: '#F59E0B' },
    { name: 'Cuidado Facial', value: 15, color: '#EF4444' },
  ];

  // KPIs calculados
  const kpis: KPI[] = [
    {
      title: 'Ventas Totales',
      value: '$2,450,000',
      change: 15.3,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Productos Vendidos',
      value: '8,934',
      change: 12.1,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: <Package className="h-6 w-6" />,
      color: 'text-purple-600'
    },
    {
      title: 'Clientes Registrados',
      value: '1,247',
      change: 8.2,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: <Users className="h-6 w-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Clientes Nuevos',
      value: '156',
      change: 15.3,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: <User className="h-6 w-6" />,
      color: 'text-orange-600'
    },
    {
      title: 'Retención de Clientes',
      value: '78.3%',
      change: 2.1,
      changeType: 'increase',
      period: 'vs mes anterior',
      icon: <Target className="h-6 w-6" />,
      color: 'text-red-600'
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
      month: 'short',
      day: 'numeric'
    });
  };





  return (
    <div className="space-y-6">
             {/* Header */}
       <div>
         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
         <p className="text-gray-600 mt-2">
           Bienvenido al panel de control. Aquí puedes ver el resumen de tu sistema.
         </p>
       </div>



      {/* Dashboard de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center ${kpi.color}`}>
                  {kpi.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {kpi.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      +{kpi.change}%
                    </span>
                    <span className="text-xs text-gray-500">{kpi.period}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Gráfico de Ventas por Período */}
         <Card>
           <CardContent className="pt-6">
             <div className="mb-4">
               <h3 className="text-lg font-semibold text-gray-900">Ventas por Período</h3>
             </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Ventas']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

                 {/* Gráfico de Productos Top */}
         <Card>
           <CardContent className="pt-6">
             <div className="mb-4">
               <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
             </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Ventas']}
                />
                <Bar dataKey="revenue" fill="#10B981" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

                                   {/* Gráfico de Distribución por Categorías */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Distribución por Categorías</h3>
              </div>
             <ResponsiveContainer width="100%" height={300}>
               <RechartsPieChart>
                 <Pie
                   data={categoryData}
                   cx="50%"
                   cy="50%"
                   labelLine={false}
                   label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                   outerRadius={80}
                   fill="#8884d8"
                   dataKey="value"
                 >
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip formatter={(value: any) => [`${value}%`, 'Porcentaje']} />
               </RechartsPieChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

                   {/* Segmentación de Clientes */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Segmentación de Clientes</h3>
              </div>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                     <Award className="h-5 w-5 text-green-600" />
                   </div>
                   <div>
                     <p className="font-medium text-gray-900">Premium</p>
                     <p className="text-sm text-gray-500">Clientes de alto valor</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-semibold text-gray-900">247</p>
                   <p className="text-xs text-green-600">+12.5%</p>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                     <Users className="h-5 w-5 text-blue-600" />
                   </div>
                   <div>
                     <p className="font-medium text-gray-900">Regular</p>
                     <p className="text-sm text-gray-500">Clientes frecuentes</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-semibold text-gray-900">634</p>
                   <p className="text-xs text-blue-600">+8.2%</p>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                     <User className="h-5 w-5 text-yellow-600" />
                   </div>
                   <div>
                     <p className="font-medium text-gray-900">Nuevo</p>
                     <p className="text-sm text-gray-500">Clientes recientes</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-semibold text-gray-900">366</p>
                   <p className="text-xs text-yellow-600">+15.3%</p>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
      </div>

             {/* Análisis Detallado */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Top Clientes */}
         <Card>
           <CardContent className="pt-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes</h3>
             <div className="space-y-3">
               {topCustomers.map((customer, index) => (
                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                       <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                     </div>
                     <div>
                       <p className="font-medium text-gray-900">{customer.name}</p>
                       <p className="text-sm text-gray-500">
                         {customer.orders} órdenes • {customer.segment}
                       </p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                     <p className="text-xs text-gray-500">{formatDate(customer.lastOrder)}</p>
                   </div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>

                   {/* Métricas de Seguimiento */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Seguimiento</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">!</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Productos stock críticos</p>
                      <p className="text-sm text-gray-500">Necesitan reabastecimiento</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">23</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">0</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Productos sin stock</p>
                      <p className="text-sm text-gray-500">Agotados completamente</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">8</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-orange-600">⚠</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Productos próximos a vencer</p>
                      <p className="text-sm text-gray-500">Vencimiento cercano</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">12</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-orange-600">❌</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Carritos Abandonados</p>
                      <p className="text-sm text-gray-500">Compra no completada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">34</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">😴</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Clientes sin actividad</p>
                      <p className="text-sm text-gray-500">Inactivos recientemente</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">234</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
       </div>


    </div>
  );
}

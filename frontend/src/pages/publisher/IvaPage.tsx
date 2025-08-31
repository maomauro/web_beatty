import { Card, CardContent } from '../../components/ui/card';
import { 
  Percent,
  Package,
  Eye
} from 'lucide-react';

interface IvaType {
  id: string;
  percentage: number;
  description: string;
  productCount: number;
}

export function IvaPage() {
  // Datos de ejemplo
  const ivaTypes: IvaType[] = [
    {
      id: 'IVA001',
      percentage: 0,
      description: 'Sin IVA - Productos exentos',
      productCount: 12
    },
    {
      id: 'IVA002',
      percentage: 4,
      description: 'IVA Mínimo - Productos de primera necesidad',
      productCount: 8
    },
    {
      id: 'IVA003',
      percentage: 10,
      description: 'IVA Medio - Productos especiales',
      productCount: 15
    },
    {
      id: 'IVA004',
      percentage: 19,
      description: 'IVA Máximo - Productos generales',
      productCount: 121
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tipos de IVA Disponibles</h1>
        <p className="text-gray-600 mt-2">
          Visualiza los tipos de IVA disponibles para asignar a productos
        </p>
      </div>

      {/* Información */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Modo Solo Lectura</h3>
              <p className="text-sm text-blue-700">
                Como publicador, puedes ver los tipos de IVA disponibles pero no modificarlos. 
                Contacta al administrador para cambios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tipos de IVA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ivaTypes.map((iva) => (
          <Card key={iva.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Percent className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {iva.percentage}%
                    </h3>
                    {iva.percentage === 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Exento
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {iva.description}
                  </p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Package className="h-4 w-4" />
                    <span>{iva.productCount} productos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{ivaTypes.length}</p>
              <p className="text-sm text-gray-600">Tipos de IVA</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {ivaTypes.reduce((sum, iva) => sum + iva.productCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Productos Totales</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información sobre IVA</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>0% IVA:</strong> Productos exentos de impuestos como medicamentos esenciales y algunos productos de primera necesidad.
            </p>
            <p>
              <strong>4% IVA:</strong> Productos de primera necesidad como alimentos básicos y algunos productos de higiene personal.
            </p>
            <p>
              <strong>10% IVA:</strong> Productos especiales como libros, revistas y algunos servicios.
            </p>
            <p>
              <strong>19% IVA:</strong> Productos generales y la mayoría de bienes y servicios.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

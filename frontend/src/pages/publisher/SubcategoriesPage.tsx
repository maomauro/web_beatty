import { Card, CardContent } from '../../components/ui/card';
import { 
  FolderTree,
  Package,
  Eye
} from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
  category: string;
  description: string;
  productCount: number;
}

export function SubcategoriesPage() {
  // Datos de ejemplo
  const subcategories: Subcategory[] = [
    {
      id: 'SC001',
      name: 'Cepillos',
      category: 'Cuidado Dental',
      description: 'Cepillos de dientes y accesorios',
      productCount: 15
    },
    {
      id: 'SC002',
      name: 'Enjuagues',
      category: 'Cuidado Dental',
      description: 'Enjuagues bucales y productos de limpieza',
      productCount: 12
    },
    {
      id: 'SC003',
      name: 'Máquinas',
      category: 'Afeitado',
      description: 'Máquinas de afeitar eléctricas y manuales',
      productCount: 8
    },
    {
      id: 'SC004',
      name: 'Espumas',
      category: 'Afeitado',
      description: 'Espumas y geles de afeitar',
      productCount: 10
    },
    {
      id: 'SC005',
      name: 'After Shave',
      category: 'Afeitado',
      description: 'Productos post-afeitado',
      productCount: 6
    },
    {
      id: 'SC006',
      name: 'Jabones',
      category: 'Higiene Personal',
      description: 'Jabones y geles de baño',
      productCount: 18
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subcategorías Disponibles</h1>
        <p className="text-gray-600 mt-2">
          Visualiza las subcategorías de productos disponibles en el sistema
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
                Como publicador, puedes ver las subcategorías disponibles pero no modificarlas. 
                Contacta al administrador para cambios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Subcategorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subcategories.map((subcategory) => (
          <Card key={subcategory.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderTree className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-blue-600 mb-1">
                    {subcategory.category}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {subcategory.description}
                  </p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Package className="h-4 w-4" />
                    <span>{subcategory.productCount} productos</span>
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
              <p className="text-2xl font-bold text-gray-900">{subcategories.length}</p>
              <p className="text-sm text-gray-600">Subcategorías Totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {subcategories.reduce((sum, sub) => sum + sub.productCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Productos Totales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

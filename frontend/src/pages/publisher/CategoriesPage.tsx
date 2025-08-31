import { Card, CardContent } from '../../components/ui/card';
import { 
  FolderOpen,
  Package,
  Eye
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  subcategories: number;
}

export function CategoriesPage() {
  // Datos de ejemplo
  const categories: Category[] = [
    {
      id: 'C001',
      name: 'Cuidado Dental',
      description: 'Productos relacionados con el cuidado e higiene dental',
      productCount: 45,
      subcategories: 3
    },
    {
      id: 'C002',
      name: 'Afeitado',
      description: 'Productos para el afeitado y cuidado de la barba',
      productCount: 32,
      subcategories: 4
    },
    {
      id: 'C003',
      name: 'Higiene Personal',
      description: 'Productos de higiene personal y cuidado corporal',
      productCount: 28,
      subcategories: 5
    },
    {
      id: 'C004',
      name: 'Cuidado Facial',
      description: 'Productos para el cuidado y limpieza facial',
      productCount: 23,
      subcategories: 3
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categorías Disponibles</h1>
        <p className="text-gray-600 mt-2">
          Visualiza las categorías de productos disponibles en el sistema
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
                Como publicador, puedes ver las categorías disponibles pero no modificarlas. 
                Contacta al administrador para cambios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{category.productCount} productos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FolderOpen className="h-4 w-4" />
                      <span>{category.subcategories} subcategorías</span>
                    </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">Categorías Totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Productos Totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.subcategories, 0)}
              </p>
              <p className="text-sm text-gray-600">Subcategorías Totales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

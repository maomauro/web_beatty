import { NavLink } from 'react-router-dom';
import { 
  Package,
  FolderOpen,
  FolderTree,
  Percent,
  BarChart3
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Estadísticas de Productos',
    href: '/publisher',
    icon: BarChart3,
    description: 'Análisis y métricas de productos'
  },
  {
    name: 'Productos',
    href: '/publisher/products',
    icon: Package,
    description: 'Gestión de productos'
  },
  {
    name: 'Categorías',
    href: '/publisher/categories',
    icon: FolderOpen,
    description: 'Ver categorías disponibles'
  },
  {
    name: 'Subcategorías',
    href: '/publisher/subcategories',
    icon: FolderTree,
    description: 'Ver subcategorías disponibles'
  },
  {
    name: 'IVA',
    href: '/publisher/iva',
    icon: Percent,
    description: 'Ver tipos de IVA disponibles'
  }
];

export function PublisherSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo del panel del publicador */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Publicador</h2>
            <p className="text-xs text-gray-500">Web Beatty</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                title={item.description}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Información del sistema */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="font-medium">Web Beatty</p>
          <p>Panel Publicador v1.0</p>
          <p className="mt-1">Gestión de Productos</p>
        </div>
      </div>
    </aside>
  );
}

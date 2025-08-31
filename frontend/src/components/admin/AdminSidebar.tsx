import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  FolderOpen,
  FolderTree,
  Percent,
  Settings,
  BarChart3,
  ShoppingCart,
  FileText
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Vista general del sistema'
  },
  {
    name: 'Perfiles',
    href: '/admin/profiles',
    icon: UserCheck,
    description: 'Gestión de roles del sistema'
  },
  {
    name: 'Personas',
    href: '/admin/persons',
    icon: Users,
    description: 'Gestión de información personal'
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: UserCheck,
    description: 'Gestión de credenciales de acceso'
  },
  {
    name: 'Productos',
    href: '/admin/products',
    icon: Package,
    description: 'Gestión de productos'
  },
  {
    name: 'Categorías',
    href: '/admin/categories',
    icon: FolderOpen,
    description: 'Gestión de categorías principales'
  },
  {
    name: 'Subcategorías',
    href: '/admin/subcategories',
    icon: FolderTree,
    description: 'Gestión de subcategorías'
  },
  {
    name: 'IVA',
    href: '/admin/iva',
    icon: Percent,
    description: 'Configuración de impuestos'
  },
  {
    name: 'Parámetros',
    href: '/admin/parameters',
    icon: Settings,
    description: 'Configuraciones del sistema'
  },
  {
    name: 'Ventas',
    href: '/admin/sales',
    icon: BarChart3,
    description: 'Reportes de ventas'
  },
  {
    name: 'Carritos',
    href: '/admin/carts',
    icon: ShoppingCart,
    description: 'Gestión de carritos'
  },
  {
    name: 'Reportes',
    href: '/admin/reports',
    icon: FileText,
    description: 'Reportes avanzados'
  }
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo del panel administrativo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Administración</h2>
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
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
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
          <p>Panel Administrativo v1.0</p>
          <p className="mt-1">Sistema de Gestión de Ventas</p>
        </div>
      </div>
    </aside>
  );
}

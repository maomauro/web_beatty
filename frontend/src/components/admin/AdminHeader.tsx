import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Home
} from 'lucide-react';

export function AdminHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    navigate('/');
  };

  const handleGoToStore = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WB</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Panel Administrativo
            </h1>
            <p className="text-sm text-gray-500">
              Web Beatty - Gestión del Sistema
            </p>
          </div>
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center space-x-4">
          {/* Botón ir a tienda */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToStore}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Ir a Tienda</span>
          </Button>

          {/* Notificaciones */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Configuración */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* Perfil del usuario */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.nombre || 'Administrador'}
              </p>
              <p className="text-xs text-gray-500">
                {user.email || 'admin@webbeatty.com'}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
          </div>

          {/* Cerrar sesión */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

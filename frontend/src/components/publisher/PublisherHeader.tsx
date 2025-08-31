import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  Store,
  LogOut,
  User
} from 'lucide-react';

export function PublisherHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleGoToStore = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-semibold text-gray-900">Panel Publicador</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleGoToStore}
            className="flex items-center space-x-2"
          >
            <Store className="h-4 w-4" />
            <span>Ir a Tienda</span>
          </Button>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.nombre} {user.apellido}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

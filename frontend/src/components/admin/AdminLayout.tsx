import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  const navigate = useNavigate();

  // Verificar si el usuario es administrador
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user || user.profile !== 'Administrador') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet, useNavigate } from 'react-router-dom';
import { PublisherSidebar } from './PublisherSidebar';

export function PublisherLayout() {
  const navigate = useNavigate();

  // Verificar si el usuario es publicador
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user || user.profile !== 'Publicador') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <PublisherSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

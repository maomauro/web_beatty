import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredProfile?: 'Administrador' | 'Publicador' | 'Cliente';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredProfile,
  redirectTo = '/',
}) => {
  const { isAuthenticated, isLoadingUser, user } = useAuthContext();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se requiere un perfil específico, verificar
  if (requiredProfile && user?.profile !== requiredProfile) {
    // Redirigir según el perfil del usuario
    if (user?.profile === 'Administrador') {
      return <Navigate to="/admin" replace />;
    } else if (user?.profile === 'Publicador') {
      return <Navigate to="/publisher" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

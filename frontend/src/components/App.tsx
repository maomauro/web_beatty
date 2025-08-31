import { useState } from 'react';
import { LogoutConfirmModal } from './modals/LogoutConfirmModal';
import { SessionExpiredModal } from './modals/SessionExpiredModal';
import { useSessionExpiration } from '../hooks/useSessionExpiration';

// Ejemplo de uso en el componente principal
export function App() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Hook para manejar expiración de sesión
  const { isSessionExpired, tryRefreshToken } = useSessionExpiration({
    onSessionExpired: () => {
      setShowSessionExpiredModal(true);
      // Limpiar datos del usuario
      setCurrentUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    onRefreshToken: async () => {
      // Implementar lógica de renovación de token
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;

        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access_token', data.access_token);
          return true;
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
      return false;
    },
    sessionTimeoutMinutes: 30, // 30 minutos
    checkIntervalMinutes: 1    // Verificar cada minuto
  });

  // Manejar cierre de sesión
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Limpiar datos del usuario
    setCurrentUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setShowLogoutModal(false);
    // Redirigir a login o home
  };

  // Manejar sesión expirada
  const handleSessionExpired = () => {
    setShowSessionExpiredModal(false);
    // Redirigir a login
  };

  const handleTryRefresh = async () => {
    const success = await tryRefreshToken();
    if (success) {
      setShowSessionExpiredModal(false);
    }
  };

  return (
    <div>
      {/* Tu contenido principal aquí */}
      
      {/* Botón de ejemplo para logout */}
      {currentUser && (
        <button onClick={handleLogout}>
          Cerrar Sesión
        </button>
      )}

      {/* Modal de confirmación de logout */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        userName={currentUser?.name}
      />

      {/* Modal de sesión expirada */}
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onLogin={handleSessionExpired}
        onRefresh={handleTryRefresh}
        canRefresh={true}
      />
    </div>
  );
}

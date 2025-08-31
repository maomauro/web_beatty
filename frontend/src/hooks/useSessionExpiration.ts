import { useState, useEffect, useCallback } from 'react';

interface UseSessionExpirationProps {
  onSessionExpired: () => void;
  onRefreshToken?: () => Promise<boolean>;
  sessionTimeoutMinutes?: number;
  checkIntervalMinutes?: number;
}

export function useSessionExpiration({
  onSessionExpired,
  onRefreshToken,
  sessionTimeoutMinutes = 30,
  checkIntervalMinutes = 1
}: UseSessionExpirationProps) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Actualizar actividad del usuario
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Verificar si la sesión ha expirado
  const checkSessionExpiration = useCallback(() => {
    const now = new Date();
    const timeDiff = now.getTime() - lastActivity.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff >= sessionTimeoutMinutes) {
      setIsSessionExpired(true);
      onSessionExpired();
    }
  }, [lastActivity, sessionTimeoutMinutes, onSessionExpired]);

  // Intentar renovar token
  const tryRefreshToken = useCallback(async () => {
    if (!onRefreshToken) return false;
    
    try {
      const success = await onRefreshToken();
      if (success) {
        setIsSessionExpired(false);
        updateActivity();
        return true;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    return false;
  }, [onRefreshToken, updateActivity]);

  // Eventos para detectar actividad del usuario
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Verificar expiración periódicamente
  useEffect(() => {
    const interval = setInterval(checkSessionExpiration, checkIntervalMinutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkSessionExpiration, checkIntervalMinutes]);

  return {
    isSessionExpired,
    updateActivity,
    tryRefreshToken,
    lastActivity
  };
}

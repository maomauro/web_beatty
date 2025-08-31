import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import authService, { LoginRequest, UserData } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query para obtener el usuario actual
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Redirección automática según el perfil del usuario
      setTimeout(() => {
        if (data.user.profile === 'Administrador') {
          navigate('/admin');
        } else if (data.user.profile === 'Publicador') {
          navigate('/publisher');
        } else {
          navigate('/');
        }
      }, 100);
    },
    onError: (error) => {
      console.error('Error en login:', error);
      setIsAuthenticated(false);
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        return authService.logout(refreshToken);
      }
      return Promise.resolve({ message: 'No refresh token found' });
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.clear();
      // Redirección automática al logout
      navigate('/');
    },
    onError: (error) => {
      console.error('Error en logout:', error);
      // Aún así limpiar el estado local
      setIsAuthenticated(false);
      queryClient.clear();
      // Redirección automática al logout
      navigate('/');
    },
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated && !user) {
        refetchUser();
      }
    };

    checkAuth();
  }, [user, refetchUser]);

  // Función de login
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(credentials);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }, [loginMutation]);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }, [logoutMutation]);

  // Función para limpiar datos de autenticación (sin llamar al backend)
  const clearAuth = useCallback(() => {
    authService.clearAuthData();
    setIsAuthenticated(false);
    queryClient.clear();
  }, [queryClient]);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoadingUser,
    userError,
    
    // Estados de mutación
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    
    // Funciones
    login,
    logout,
    clearAuth,
    refetchUser,
  };
};

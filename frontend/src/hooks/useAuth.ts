import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, LoginData, RegisterData } from '../services/authService';
import { debug } from '../utils/debugUtils';

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
    queryFn: () => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No token available');
      return authService.getCurrentUser(token);
    },
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  });

  // Manejar errores de autenticación
  useEffect(() => {
    if (userError && userError instanceof Error) {
      // Si hay error de autenticación, limpiar tokens inválidos
      if (userError.message.includes('401') || userError.message.includes('Unauthorized')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    }
  }, [userError]);

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginData) => authService.login(credentials),
    onSuccess: (data) => {
      // Guardar tokens en localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Debug del login
      debug.login(data.user);
      
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

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (registerData: RegisterData) => authService.register(registerData),
    onSuccess: (data) => {
      // Debug del registro
      debug.login(data);
      
      // Mostrar mensaje de éxito y redirigir al login
      setTimeout(() => {
        navigate('/');
      }, 100);
    },
    onError: (error) => {
      console.error('Error en registro:', error);
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        return authService.logout(refreshToken);
      }
      return Promise.resolve({ message: 'No refresh token found' });
    },
    onSuccess: () => {
      // Limpiar localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      setIsAuthenticated(false);
      queryClient.clear();
      
      // Debug del logout
      debug.logout();
      
      // Redirección automática al logout
      navigate('/');
    },
    onError: (error) => {
      console.error('Error en logout:', error);
      // Aún así limpiar el estado local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      queryClient.clear();
      // Redirección automática al logout
      navigate('/');
    },
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      
      if (authenticated && !user) {
        refetchUser();
      }
    };

    checkAuth();
  }, [user, refetchUser]);

  // Función de login
  const login = useCallback(async (credentials: LoginData) => {
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

  // Función de registro
  const register = useCallback(async (registerData: RegisterData) => {
    try {
      await registerMutation.mutateAsync(registerData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }, [registerMutation]);

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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
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
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    
    // Funciones
    login,
    register,
    logout,
    clearAuth,
    refetchUser,
  };
};

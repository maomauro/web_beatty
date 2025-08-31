import { QueryClient } from '@tanstack/react-query';

// Configuración de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo de vida de los datos en caché (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tiempo de vida en caché (10 minutos)
      gcTime: 10 * 60 * 1000,
      // Reintentos en caso de error
      retry: (failureCount, error: any) => {
        // No reintentar en errores 4xx (excepto 408, 429)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 3;
          }
          return false;
        }
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
      // Refetch automático cuando la ventana vuelve a estar activa
      refetchOnWindowFocus: true,
      // Refetch automático cuando se reconecta la red
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentos para mutaciones
      retry: 1,
    },
  },
});

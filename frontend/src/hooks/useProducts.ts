import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProducts, 
  getProductsWithFilters, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateProductStock 
} from '../services/productService';
import { ProductoUI } from '../types';

// Hook para obtener todos los productos
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obtener productos con filtros
export const useProductsWithFilters = (params: {
  skip?: number;
  limit?: number;
  categoria_id?: number;
  subcategoria_id?: number;
  estado?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['products', 'filtered', params],
    queryFn: () => getProductsWithFilters(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obtener un producto por ID
export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear un producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidar y refetch la lista de productos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook para actualizar un producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductoUI> }) => 
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar y refetch la lista de productos y el producto específico
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

// Hook para eliminar un producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidar y refetch la lista de productos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook para actualizar stock de un producto
export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, cantidad }: { id: string; cantidad: number }) => 
      updateProductStock(id, cantidad),
    onSuccess: (_, { id }) => {
      // Invalidar y refetch la lista de productos y el producto específico
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

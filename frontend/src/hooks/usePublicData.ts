import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryById } from '../services/categoryService';
import { getSubcategories, getSubcategoryById } from '../services/subcategoryService';
import { getProducts } from '../services/productService';

// Hook para obtener todas las categorías
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para obtener una categoría específica
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// Hook para obtener subcategorías
export const useSubcategories = (categoriaId?: number) => {
  return useQuery({
    queryKey: ['subcategories', categoriaId],
    queryFn: () => getSubcategories(categoriaId),
    enabled: !categoriaId || categoriaId > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// Hook para obtener una subcategoría específica
export const useSubcategory = (id: number) => {
  return useQuery({
    queryKey: ['subcategory', id],
    queryFn: () => getSubcategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// Hook para obtener productos (ya existe en useProducts, pero lo incluimos aquí para consistencia)
export const usePublicProducts = () => {
  return useQuery({
    queryKey: ['public-products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obtener subcategorías para el footer
export const useFooterSubcategories = () => {
  return useQuery({
    queryKey: ['footer-subcategories'],
    queryFn: () => getSubcategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos (más tiempo porque el footer no cambia mucho)
    gcTime: 60 * 60 * 1000, // 1 hora
  });
};

import api from './api';
import { Subcategoria } from '../types';

// Obtener todas las subcategorías (público)
export const getSubcategories = async (categoriaId?: number): Promise<Subcategoria[]> => {
  try {
    const params = categoriaId ? { categoria_id: categoriaId } : {};
    const response = await api.get('/subcategories/public', { params });
    return response.data.subcategorias;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

// Obtener una subcategoría por ID (público)
export const getSubcategoryById = async (id: number): Promise<Subcategoria> => {
  try {
    const response = await api.get(`/subcategories/public/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategory by ID:', error);
    throw error;
  }
};

import api from './api';
import { Categoria } from '../types';

// Obtener todas las categorías (público)
export const getCategories = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categories/public');
    return response.data.categorias;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Obtener una categoría por ID (público)
export const getCategoryById = async (id: number): Promise<Categoria> => {
  try {
    const response = await api.get(`/categories/public/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

import { useState, useEffect } from 'react';
import { ProductoUI } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<ProductoUI[]>([]);

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Agregar producto a favoritos
  const addToFavorites = (product: ProductoUI) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === product.id);
      if (exists) {
        return prev; // Ya existe, no hacer nada
      }
      return [...prev, product];
    });
  };

  // Remover producto de favoritos
  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
  };

  // Verificar si un producto está en favoritos
  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  // Toggle favorito (agregar/quitar)
  const toggleFavorite = (product: ProductoUI) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Limpiar todos los favoritos
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
}

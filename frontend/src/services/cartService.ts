import api from './api';
import { CartItemUI } from '../types';

// Tipos para el backend (formato localStorage)
export interface LocalStorageCartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    brand: string;
    stock: number;
    id_iva: number;
    iva_rate?: number;
    subtotal: number;
    iva_amount: number;
    total: number;
}

export interface CartCreateRequest {
    items: LocalStorageCartItem[];
}

export interface CartResponse {
    id_venta: number;
    total_venta: number;
    estado: string;
    fecha_venta: string;
    items: LocalStorageCartItem[];
}

// Servicio de carrito
export const cartService = {
    // Crear carrito y venta desde localStorage
    async createCartFromLocalStorage(cartItems: CartItemUI[]): Promise<CartResponse> {
        try {
            const request: CartCreateRequest = { items: cartItems };

            const response = await api.post('/cart/create', request);
            return response.data;
        } catch (error) {
            // console.error('Error creating cart:', error);
            throw error;
        }
    },

      // Obtener carrito del usuario
  async getUserCart(): Promise<CartResponse | null> {
    try {
      const response = await api.get('/cart/user');
      
      // Si no hay carrito, retornar null
      if (response.data.message === "No hay carrito pendiente") {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo carrito:', error);
      return null;
    }
  },

    // Actualizar carrito existente del usuario
    async updateUserCart(cartItems: CartItemUI[]): Promise<CartResponse> {
        try {
            const request: CartCreateRequest = { items: cartItems };

            const response = await api.put('/cart/update', request);
            return response.data;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    },

    // Limpiar carrito del usuario
    async clearUserCart(): Promise<void> {
        try {
            await api.delete('/cart/user');
        } catch (error) {
            // console.error('Error clearing user cart:', error);
            throw error;
        }
    },

    // Confirmar compra del carrito actual
    async confirmPurchase(): Promise<any> {
        try {
            const response = await api.put('/cart/confirm');
            return response.data;
        } catch (error: any) {
            // console.error('Error confirming purchase:', error);
            
            // Manejar errores específicos
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Error de conexión. Verifica que el backend esté ejecutándose.');
            }
            
            if (error.response?.status === 500) {
                throw new Error(`Error interno del servidor: ${error.response.data?.detail || 'Error desconocido'}`);
            }
            
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para confirmar compras.');
            }
            
            if (error.response?.status === 404) {
                throw new Error('No se encontró un carrito pendiente para confirmar.');
            }
            
            if (error.response?.status === 400) {
                throw new Error(error.response.data?.detail || 'Error en la solicitud.');
            }
            
            throw error;
        }
    }
};

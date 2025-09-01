import { useState, useEffect, useCallback } from 'react';
import { CartItemUI } from '../types';
import { cartService } from '../services/cartService';
import { ivaService, IvaRate } from '../services/ivaService';
import { debug } from '../utils/debugUtils';

// Clave para el localStorage
const CART_STORAGE_KEY = 'web_beatty_cart';

export function useLocalStorage() {
  // Estado para almacenar las tasas de IVA
  const [ivaRates, setIvaRates] = useState<IvaRate[]>([]);
  
  // Estado inicial: intentar cargar desde localStorage
  const [cartItems, setCartItems] = useState<CartItemUI[]>(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Cargar tasas de IVA al inicializar
  useEffect(() => {
    const loadIvaRates = async () => {
      try {
        console.log('🔄 Cargando tasas de IVA...');
        const rates = await ivaService.getAllIvaRates();
        console.log('✅ Tasas de IVA cargadas:', rates);
        setIvaRates(rates);
      } catch (error) {
        console.error('❌ Error loading IVA rates:', error);
        // Si falla, usar tasas por defecto
        console.log('🔄 Usando tasas de IVA por defecto...');
        const defaultRates = [
          { id_iva: 1, porcentaje: 0, descripcion: 'Sin IVA' },
          { id_iva: 2, porcentaje: 4, descripcion: 'IVA Mínimo' },
          { id_iva: 3, porcentaje: 10, descripcion: 'IVA Medio' },
          { id_iva: 4, porcentaje: 19, descripcion: 'IVA Máximo' }
        ];
        setIvaRates(defaultRates);
      }
    };
    loadIvaRates();
  }, []);

  // Guardar en localStorage cada vez que cambie el carrito (optimizado)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      // Solo log si hay cambios significativos
      if (cartItems.length > 0) {
        console.log('🔄 Carrito sincronizado:', cartItems.length, 'productos');
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Función helper para calcular IVA de un producto (optimizada)
  const calculateProductIva = useCallback((product: any, quantity: number): {
    id_iva: number;
    iva_rate: number;
    subtotal: number;
    iva_amount: number;
    total: number;
  } => {
    const id_iva = product.id_iva || 1;
    const ivaRate = ivaRates.find(rate => rate.id_iva === id_iva);
    const finalIvaRate = ivaRate || { id_iva: 1, porcentaje: 0, descripcion: 'Sin IVA' };
    
    const subtotal = product.price * quantity;
    const iva_amount = subtotal * (finalIvaRate.porcentaje / 100);
    const total = subtotal + iva_amount;

    // Solo log si hay error (optimizado)
    if (!ivaRate) {
      console.warn('⚠️ IVA no encontrado para producto:', product.name, 'id_iva:', id_iva);
    }

    return {
      id_iva,
      iva_rate: finalIvaRate.porcentaje,
      subtotal: Math.round(subtotal),
      iva_amount: Math.round(iva_amount),
      total: Math.round(total)
    };
  }, [ivaRates]);

  // Función para agregar producto al carrito
  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let updatedItems;
      
      if (existingItem) {
        // Incrementar cantidad si ya existe
        const newQuantity = existingItem.quantity + 1;
        const ivaCalc = calculateProductIva(product, newQuantity);
        
        updatedItems = prev.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: newQuantity,
                ...ivaCalc
              }
            : item
        );
      } else {
        // Agregar nuevo item
        const ivaCalc = calculateProductIva(product, 1);
        const newItem: CartItemUI = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          brand: product.brand,
          stock: product.stock,
          ...ivaCalc
        };
        updatedItems = [...prev, newItem];
      }
      
             // Guardar en localStorage (optimizado)
       try {
         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
         // Solo debug en desarrollo
         if (debug && debug.localStorage) {
           debug.localStorage('ADD_TO_CART', updatedItems);
         }
       } catch (error) {
         console.error('Error al guardar en localStorage:', error);
       }
      
      return updatedItems;
    });
  };

  // Función para actualizar cantidad
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.id === productId) {
          const ivaCalc = calculateProductIva(item, quantity);
          return { 
            ...item, 
            quantity,
            ...ivaCalc
          };
        }
        return item;
      });
      
      // Guardar inmediatamente en localStorage (optimizado)
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
        // Solo debug en desarrollo
        if (debug && debug.localStorage) {
          debug.localStorage('UPDATE_QUANTITY', updatedItems);
        }
        
        // Actualizar también en la DB si el usuario está logueado
        updateCartInBackend(updatedItems);
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
      
      return updatedItems;
    });
  };

  // Función para remover producto
  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.id !== productId);
      
      // Guardar inmediatamente en localStorage (optimizado)
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
        // Solo debug en desarrollo
        if (debug && debug.localStorage) {
          debug.localStorage('REMOVE_FROM_CART', updatedItems);
        }
        
        // Actualizar también en la DB si el usuario está logueado
        updateCartInBackend(updatedItems);
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
      
      return updatedItems;
    });
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCartItems([]);
    // Limpiar localStorage inmediatamente (optimizado)
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      // Solo debug en desarrollo
      if (debug && debug.localStorage) {
        debug.localStorage('CLEAR_CART', []);
      }
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };

  // Función para guardar carrito en backend (al cerrar sesión) - optimizada
  const saveCartToBackend = async () => {
    console.log('🔄 Guardando carrito en backend...');
    
    // Obtener datos directamente del localStorage (más confiable)
    const localStorageCart = localStorage.getItem(CART_STORAGE_KEY);
    
    let cartDataToSave = cartItems;
    
    if (localStorageCart) {
      try {
        const parsedCart = JSON.parse(localStorageCart);
        
        // Usar datos del localStorage si tiene más productos que el estado
        if (parsedCart.length > cartItems.length) {
          cartDataToSave = parsedCart;
        } else if (cartItems.length === 0 && parsedCart.length > 0) {
          cartDataToSave = parsedCart;
        }
      } catch (error) {
        console.error('❌ Error parseando localStorage:', error);
      }
    }
    
    // Solo debug en desarrollo
    if (debug && debug.sendToBackend) {
      debug.sendToBackend('SAVE_CART', { items: cartDataToSave });
    }
    
    if (cartDataToSave.length > 0) {
      console.log('📦 Guardando', cartDataToSave.length, 'productos...');
      try {
        // Verificar si ya existe un carrito en el backend
        const existingCart = await cartService.getUserCart();
        if (debug && debug.backendResponse) {
          debug.backendResponse('GET_USER_CART', existingCart);
        }
        
        if (existingCart && existingCart.items && existingCart.items.length > 0) {
          // Si ya existe carrito, actualizar
          await cartService.updateUserCart(cartDataToSave);
          console.log('✅ Carrito actualizado');
          if (debug && debug.backendResponse) {
            debug.backendResponse('UPDATE_USER_CART', { success: true });
          }
        } else {
          // Si no existe carrito, crear nuevo
          await cartService.createCartFromLocalStorage(cartDataToSave);
          console.log('✅ Carrito creado');
          if (debug && debug.backendResponse) {
            debug.backendResponse('CREATE_USER_CART', { success: true });
          }
        }
      } catch (error) {
        console.error('❌ Error guardando carrito:', error);
        if (debug && debug.error) {
          debug.error('SAVE_CART_TO_BACKEND', error);
        }
        throw error; // Re-lanzar el error para que se capture en handleLogoutConfirm
      }
    } else {
      console.log('⚠️ Carrito vacío');
    }
  };

  // Función para actualizar carrito en backend
  const updateCartInBackend = async (itemsToUpdate?: CartItemUI[]) => {
    const items = itemsToUpdate || cartItems;
    if (items.length > 0) {
      try {
        await cartService.updateUserCart(items);
        console.log('✅ Carrito actualizado en backend');
      } catch (error) {
        console.error('❌ Error al actualizar carrito en backend:', error);
      }
    }
  };

  // Función para cargar carrito desde backend (al loguear) - optimizada
  const loadCartFromBackend = async () => {
    try {
      const backendCart = await cartService.getUserCart();
      if (debug && debug.backendResponse) {
        debug.backendResponse('LOAD_CART_FROM_BACKEND', backendCart);
      }
      
      if (backendCart && backendCart.items.length > 0) {
        // Usar directamente los valores de IVA calculados por el backend
        const frontendItems: CartItemUI[] = backendCart.items.map(item => {
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            brand: item.brand,
            stock: item.stock,
            id_iva: item.id_iva,
            iva_rate: item.iva_rate,
            subtotal: item.subtotal,
            iva_amount: item.iva_amount,
            total: item.total
          };
        });
        
        console.log('🔄 Cargando carrito desde DB:', frontendItems.length, 'productos');
        
        // Siempre reemplazar localStorage con datos del DB al hacer login
        setCartItems(frontendItems);
        if (debug && debug.loadCart) {
          debug.loadCart(backendCart);
        }
      } else {
        console.log('📭 No hay carrito en DB');
      }
    } catch (error) {
      if (debug && debug.error) {
        debug.error('LOAD_CART_FROM_BACKEND', error);
      }
    }
  };

  // Función para obtener el total de items
  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Función para obtener el subtotal del carrito (sin IVA)
  const getCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Función para obtener el total de IVA del carrito
  const getCartIvaTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.iva_amount, 0);
  };

  // Función para obtener el total del carrito (con IVA)
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveCartToBackend,
    updateCartInBackend,
    loadCartFromBackend,
    getCartItemCount,
    getCartSubtotal,
    getCartIvaTotal,
    getCartTotal
  };
}

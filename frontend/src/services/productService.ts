import api from './api';
import { Producto, ProductoUI } from '../types';

// Convertir Producto del backend a ProductoUI para el frontend
const convertProductoToProductoUI = (producto: any): ProductoUI => {
  // Función para convertir URLs relativas a absolutas del backend
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return 'http://localhost:8000/static/images/products/default.webp';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/static/')) {
      return `http://localhost:8000${imagePath}`;
    }
    return `http://localhost:8000/static/images/products/${imagePath}`;
  };

  return {
    id: producto.id?.toString() || producto.id_producto?.toString() || '0',
    name: producto.nombre || producto.name || 'Producto sin nombre',
    price: Number(producto.valor || producto.price || 0),
    originalPrice: undefined, // Por ahora no tenemos precio original en el backend
    image: getImageUrl(producto.imagen_principal || producto.imagen || producto.image),
    rating: 4.5, // Por ahora rating fijo
    reviews: Math.floor(Math.random() * 1000) + 100, // Por ahora reviews aleatorios
    stock: producto.stock || 0,
    category: producto.categoria_nombre || producto.categoria?.nombre || producto.category || 'Sin categoría',
    subcategory: producto.subcategoria_nombre || producto.subcategoria?.nombre || producto.subcategory || 'Sin subcategoría',
    brand: producto.marca || producto.brand || 'Sin marca',
    gender: 'Unisex', // Por ahora género fijo
    description: `Producto ${producto.nombre || producto.name} de la marca ${producto.marca || producto.brand}`,
    isOnSale: producto.id_iva === 1, // Productos sin IVA se muestran como oferta
    id_iva: producto.id_iva || 1,
    id_categoria: producto.id_categoria || producto.categoria?.id_categoria,
    id_subcategoria: producto.id_subcategoria || producto.subcategoria?.id_subcategoria,
    ivaPorcentaje: producto.iva_porcentaje || producto.iva?.porcentaje,
    ivaDescripcion: producto.iva_descripcion || producto.iva?.descripcion,
    imageGallery: producto.imagen_galeria ? producto.imagen_galeria.map(getImageUrl) : [],
  };
};

// Obtener todos los productos
export const getProducts = async (): Promise<ProductoUI[]> => {
  try {
    const response = await api.get('/products/public');
    return response.data.productos.map(convertProductoToProductoUI);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Obtener productos sin IVA
export const getProductsSinIva = async (): Promise<ProductoUI[]> => {
  try {
    const response = await api.get('/products/public-sin-iva');
    return response.data.productos.map(convertProductoToProductoUI);
  } catch (error) {
    console.error('Error fetching products sin IVA:', error);
    throw error;
  }
};

// Obtener productos con filtros
export const getProductsWithFilters = async (params: {
  skip?: number;
  limit?: number;
  categoria_id?: number;
  subcategoria_id?: number;
  estado?: string;
  search?: string;
}): Promise<{ productos: ProductoUI[]; total: number }> => {
  try {
    const response = await api.get('/products/public', { params });
    return {
      productos: response.data.productos.map(convertProductoToProductoUI),
      total: response.data.total
    };
  } catch (error) {
    console.error('Error fetching products with filters:', error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (id: string): Promise<ProductoUI> => {
  try {
    const response = await api.get(`/products/public/${id}`);
    return convertProductoToProductoUI(response.data);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProduct = async (productData: Partial<Producto>): Promise<ProductoUI> => {
  try {
    const response = await api.post('/products', productData);
    return convertProductoToProductoUI(response.data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Actualizar un producto
export const updateProduct = async (id: string, productData: Partial<Producto>): Promise<ProductoUI> => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return convertProductoToProductoUI(response.data);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Actualizar stock de un producto
export const updateProductStock = async (id: string, cantidad: number): Promise<{ message: string; nuevo_stock: number }> => {
  try {
    const response = await api.patch(`/products/${id}/stock`, null, {
      params: { cantidad }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

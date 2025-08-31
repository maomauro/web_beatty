// Tipos de datos para el sistema de ventas

export interface Perfil {
  id_perfil: number;
  nombre: string;
  descripcion: string;
}

export interface Persona {
  id_persona: number;
  tipo_identificacion: string;
  identificacion: string;
  genero: 'FEMENINO' | 'MASCULINO';
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Usuario {
  id_usuario: number;
  id_persona: number;
  id_perfil: number;
  username: string;
  password: string;
  persona?: Persona;
  perfil?: Perfil;
}

export interface IVA {
  id_iva: number;
  porcentaje: number;
  descripcion: string;
  nombre?: string;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

export interface Subcategoria {
  id_subcategoria: number;
  id_categoria: number;
  nombre: string;
  descripcion: string;
  categoria?: Categoria;
}

export interface Producto {
  id_producto: number;
  id_categoria: number;
  id_subcategoria: number;
  id_iva: number;
  codigo: string;
  marca: string;
  nombre: string;
  fecha_caducidad: string;
  imagen: string;
  valor: number;
  stock: number;
  estado: 'ACTIVO' | 'INACTIVO';
  categoria?: Categoria;
  subcategoria?: Subcategoria;
  iva?: IVA;
}

export interface CarritoItem {
  id_carrito: number;
  id_venta?: number;
  id_usuario: number;
  id_producto: number;
  fecha_carrito: string;
  cantidad: number;
  valor_unitario: number;
  iva_calculado: number;
  subtotal: number;
  estado: 'ACTIVO' | 'ABANDONADO' | 'VENTA';
  fecha_abandono?: string;
  producto?: Producto;
  usuario?: Usuario;
}

export interface Venta {
  id_venta: number;
  id_usuario: number;
  fecha_venta: string;
  total_venta: number;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
  usuario?: Usuario;
  items?: CarritoItem[];
}

export interface Parametro {
  id_parametro: number;
  descripcion: string;
  valor: string;
}

// Tipos para la UI (adaptados de la plantilla Figma)
export interface ProductoUI {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  category: string;
  subcategory: string;
  brand: string;
  gender: string;
  description: string;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  id_iva?: number; // Agregado para filtrar productos por IVA
  id_categoria?: number; // Agregado para filtros de categoría
  id_subcategoria?: number; // Agregado para filtros de subcategoría
  ivaPorcentaje?: number; // Nuevo: Porcentaje de IVA
  ivaDescripcion?: string; // Nuevo: Descripción del IVA (ej. "IVA del 19%")
  imageGallery?: string[]; // Nuevo: Galería de imágenes del producto
}

export interface CartItemUI {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand: string;
  stock: number;
}

export interface UserUI {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  profile?: string; // Rol del usuario: 'Administrador', 'Publicador', 'Cliente'
  personalInfo?: {
    tipoIdentificacion: string;
    identificacion: string;
    genero: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    skinType?: string;
    favoriteCategories: string[];
  };
}

export interface OrderUI {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

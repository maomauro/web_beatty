# Web Beatty - Frontend

Sistema Administrativo de Ventas - Frontend React con shadcn/ui

## 🚀 Características

- **React 18** con TypeScript
- **shadcn/ui** - Componentes modernos y accesibles
- **Tailwind CSS** - Sistema de diseño completo
- **React Router** - Navegación SPA
- **Vite** - Build tool rápido
- **Responsive Design** - Funciona en móvil y desktop
- **Tema claro/oscuro** - Soporte para ambos modos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes shadcn/ui
│   ├── Header.tsx      # Navegación principal
│   ├── Footer.tsx      # Pie de página
│   ├── HomePage.tsx    # Página de inicio
│   ├── CatalogPage.tsx # Catálogo de productos
│   ├── AuthPage.tsx    # Autenticación
│   ├── ProfilePage.tsx # Perfil de usuario
│   ├── CartSidebar.tsx # Carrito lateral
│   └── ProductDetailModal.tsx # Modal de producto
├── lib/
│   └── utils.ts        # Utilidades
├── types/
│   └── index.ts        # Tipos TypeScript
├── App.tsx             # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🎨 Sistema de Diseño

### Colores
- **Primary**: Azul (#2563EB)
- **Secondary**: Gris claro (#F3F4F6)
- **Accent**: Verde (#10B981)
- **Destructive**: Rojo (#EF4444)

### Componentes Disponibles
- Button, Card, Input, Select
- Modal, Sidebar, Navigation
- Form, Table, Pagination
- Y muchos más...

## 📱 Páginas Implementadas

### 🏠 HomePage
- Hero section con call-to-action
- Productos destacados
- Sección de características

### 🛍️ CatalogPage
- Grid de productos
- Filtros y búsqueda
- Paginación

### 👤 AuthPage
- Login/Registro
- Formularios validados
- Manejo de errores

### 🛒 CartSidebar
- Lista de productos
- Cantidades editables
- Cálculo de totales

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Web Beatty
```

### Tailwind CSS
Configurado con variables CSS personalizadas para:
- Colores del tema
- Tipografía
- Espaciado
- Bordes y sombras

## 🚀 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Linting del código

## 📦 Dependencias Principales

### Core
- `react` - Biblioteca principal
- `react-dom` - Renderizado DOM
- `react-router-dom` - Navegación

### UI/UX
- `@radix-ui/*` - Componentes primitivos
- `lucide-react` - Iconos
- `sonner` - Notificaciones
- `class-variance-authority` - Variantes de componentes

### Styling
- `tailwindcss` - Framework CSS
- `tailwindcss-animate` - Animaciones
- `clsx` - Clases condicionales

### Development
- `vite` - Build tool
- `typescript` - Tipado estático
- `eslint` - Linting

## 🎯 Próximos Pasos

1. **Integración con Backend**
   - Conectar con APIs FastAPI
   - Manejo de autenticación JWT
   - Sincronización de datos

2. **Funcionalidades Avanzadas**
   - Búsqueda en tiempo real
   - Filtros avanzados
   - Wishlist persistente

3. **Optimización**
   - Lazy loading
   - Code splitting
   - Performance monitoring

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

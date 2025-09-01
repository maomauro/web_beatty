# Web Beatty - Frontend

## 📋 **Descripción**

Frontend del sistema Web Beatty desarrollado con **React 18**, **TypeScript** y **shadcn/ui**. Sistema completo de e-commerce para productos de aseo personal con autenticación JWT, carrito de compras, reportes administrativos y gestión de productos.

---

## 🚀 **Características Implementadas**

### **✅ Autenticación y Autorización**
- Sistema JWT completo con refresh automático
- Login/Registro con validación de datos
- Perfiles de usuario (Administrador, Publicador, Cliente)
- Protección de rutas por perfil
- Manejo de sesiones persistente

### **✅ Gestión de Productos**
- Catálogo completo con 30 productos
- Búsqueda y filtros avanzados
- Paginación optimizada
- Detalles de productos con galería
- Gestión de stock y precios

### **✅ Carrito de Compras**
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de IVA
- Persistencia en base de datos
- Confirmación de compras

### **✅ Panel Administrativo**
- Dashboard con métricas
- Reportes de ventas detallados
- Gestión de categorías y IVA
- Gestión de productos
- Filtros y exportación

### **✅ Panel del Publicador**
- Estadísticas de productos
- Gestión de inventario
- Vista de categorías
- Modales completos

### **✅ UX/UI Avanzada**
- Diseño responsive completo
- Animaciones y transiciones
- Notificaciones en tiempo real
- Estados de carga optimizados
- Modales y sidebars interactivos

---

## 🏗️ **Arquitectura del Proyecto**

```
frontend/
├── src/
│   ├── components/               # Componentes React
│   │   ├── ui/                   # Componentes shadcn/ui
│   │   │   ├── button.tsx        # Botones
│   │   │   ├── card.tsx          # Tarjetas
│   │   │   ├── input.tsx         # Inputs
│   │   │   ├── select.tsx        # Selects
│   │   │   ├── dialog.tsx        # Modales
│   │   │   ├── sheet.tsx         # Sidebars
│   │   │   └── ...               # Otros componentes
│   │   ├── Header.tsx            # Header principal
│   │   ├── Footer.tsx            # Footer
│   │   ├── CartSidebar.tsx       # Sidebar del carrito
│   │   ├── ProductCard.tsx       # Tarjeta de producto
│   │   ├── ProductDetailModal.tsx # Modal de detalle
│   │   ├── AuthModal.tsx         # Modal de autenticación
│   │   └── ...                   # Otros componentes
│   ├── pages/                    # Páginas principales
│   │   ├── HomePage.tsx          # Página de inicio
│   │   ├── CatalogPage.tsx       # Catálogo de productos
│   │   ├── AuthPage.tsx          # Página de autenticación
│   │   ├── ProfilePage.tsx       # Página de perfil
│   │   └── admin/                # Páginas de administración
│   │       ├── DashboardPage.tsx # Dashboard admin
│   │       ├── ReportsPage.tsx   # Reportes de ventas
│   │       └── ProductManagementPage.tsx # Gestión productos
│   ├── services/                 # Servicios API
│   │   ├── authService.ts        # Servicio de autenticación
│   │   ├── productService.ts     # Servicio de productos
│   │   ├── cartService.ts        # Servicio de carrito
│   │   └── reportsService.ts     # Servicio de reportes
│   ├── hooks/                    # Hooks personalizados
│   │   ├── useAuth.ts            # Hook de autenticación
│   │   ├── useLocalStorage.ts    # Hook de localStorage
│   │   └── useCart.ts            # Hook de carrito
│   ├── context/                  # Context API
│   │   ├── AuthContext.tsx       # Contexto de autenticación
│   │   └── CartContext.tsx       # Contexto de carrito
│   ├── utils/                    # Utilidades
│   │   ├── constants.ts          # Constantes
│   │   ├── helpers.ts            # Funciones helper
│   │   └── debugUtils.ts         # Utilidades de debug
│   ├── types/                    # Tipos TypeScript
│   │   ├── user.ts               # Tipos de usuario
│   │   ├── product.ts            # Tipos de producto
│   │   ├── cart.ts               # Tipos de carrito
│   │   └── reports.ts            # Tipos de reportes
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Punto de entrada
│   └── index.css                 # Estilos globales
├── public/                       # Archivos públicos
├── package.json                  # Dependencias
├── vite.config.ts               # Configuración Vite
├── tailwind.config.js           # Configuración Tailwind
└── README.md                     # Este archivo
```

---

## 📦 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 16+
- npm o yarn
- Backend ejecutándose en puerto 8000

### **Instalación Rápida**
```bash
# Clonar repositorio
git clone <repository-url>
cd web_beatty/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Ejecutar en desarrollo
npm run dev
```

### **Variables de Entorno**
```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=Web Beatty
VITE_APP_VERSION=1.0.0

# Development
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

---

## 🎨 **Sistema de Diseño**

### **Colores del Tema**
```css
/* Primary Colors */
--primary: #2563EB;      /* Azul principal */
--primary-foreground: #FFFFFF;

/* Secondary Colors */
--secondary: #F3F4F6;   /* Gris claro */
--secondary-foreground: #374151;

/* Accent Colors */
--accent: #10B981;      /* Verde */
--accent-foreground: #FFFFFF;

/* Destructive */
--destructive: #EF4444; /* Rojo */
--destructive-foreground: #FFFFFF;

/* Background Colors */
--background: #FFFFFF;
--foreground: #111827;
```

### **Tipografía**
- **Font Family**: Inter, system-ui, sans-serif
- **Font Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
- **Font Weights**: 400, 500, 600, 700

### **Componentes Disponibles**
- ✅ **Button** - Botones con variantes
- ✅ **Card** - Tarjetas de contenido
- ✅ **Input** - Campos de entrada
- ✅ **Select** - Selectores
- ✅ **Dialog** - Modales
- ✅ **Sheet** - Sidebars
- ✅ **Table** - Tablas
- ✅ **Form** - Formularios
- ✅ **Badge** - Etiquetas
- ✅ **Alert** - Alertas
- ✅ **Toast** - Notificaciones

---

## 📱 **Páginas y Funcionalidades**

### **🏠 HomePage**
- **Hero Section** con imagen de fondo y call-to-action
- **Productos Destacados** en grid responsive
- **Modal Informativo** con detalles de la empresa
- **Navegación Fluida** a otras secciones

### **🛍️ CatalogPage**
- **Grid Responsive** de productos
- **Búsqueda en Tiempo Real** por nombre
- **Filtros Avanzados** por categoría y subcategoría
- **Paginación Visual** con scroll infinito
- **Estados de Carga** optimizados

### **🔐 AuthPage**
- **Modal de Login** con validaciones
- **Modal de Registro** con campos completos
- **Persistencia de Sesión** con localStorage
- **Protección de Rutas** para usuarios autenticados
- **Botones Demo** para acceso rápido

### **🛒 CartSidebar**
- **Lista de Productos** con cantidades
- **Cálculo Automático** de totales e IVA
- **Persistencia Local** entre sesiones
- **Validación de Autenticación** antes de agregar
- **Proceso de Checkout** completo

### **👤 ProfilePage**
- **Información Personal** editable
- **Información de Contacto** editable
- **Campos Protegidos** (tipo ID, número ID, email)
- **Modo Edición** con botones guardar/cancelar
- **Validaciones en Tiempo Real**

### **🏢 Admin Dashboard**
- **Métricas Principales** con KPIs
- **Reportes de Ventas** con filtros
- **Gestión de Productos** completa
- **Gestión de Categorías** y IVA
- **Navegación Intuitiva** con sidebar

### **📈 ReportsPage**
- **Reporte Detallado** de ventas
- **Filtros Avanzados** por fecha, estado, búsqueda
- **Métricas Visuales** con cards
- **Exportación de Datos** estructurados
- **Paginación** optimizada

---

## 🔧 **Configuración Técnica**

### **Build Tool - Vite**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### **Tailwind CSS**
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

### **TypeScript**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 🚀 **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 3000)
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Linting del código
npm run type-check   # Verificación de tipos TypeScript

# Testing (preparado)
npm run test         # Tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
```

---

## 📦 **Dependencias Principales**

### **Core Dependencies**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@tanstack/react-query": "^4.29.0",
  "axios": "^1.3.0"
}
```

### **UI/UX Dependencies**
```json
{
  "@radix-ui/react-dialog": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.5",
  "@radix-ui/react-select": "^1.2.2",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^1.2.1",
  "lucide-react": "^0.263.1",
  "sonner": "^0.6.0"
}
```

### **Styling Dependencies**
```json
{
  "tailwindcss": "^3.2.7",
  "tailwindcss-animate": "^1.0.6",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.21"
}
```

### **Development Dependencies**
```json
{
  "@types/react": "^18.0.28",
  "@types/react-dom": "^18.0.11",
  "@typescript-eslint/eslint-plugin": "^5.57.1",
  "@typescript-eslint/parser": "^5.57.1",
  "@vitejs/plugin-react": "^3.1.0",
  "eslint": "^8.38.0",
  "typescript": "^4.9.5",
  "vite": "^4.2.0"
}
```

---

## 🔗 **Integración con Backend**

### **Servicios API Implementados**
- ✅ **authService.ts** - Autenticación JWT
- ✅ **productService.ts** - Gestión de productos
- ✅ **cartService.ts** - Carrito de compras
- ✅ **reportsService.ts** - Reportes administrativos

### **Hooks Personalizados**
- ✅ **useAuth.ts** - Gestión de autenticación
- ✅ **useLocalStorage.ts** - Persistencia local
- ✅ **useCart.ts** - Gestión del carrito

### **Context API**
- ✅ **AuthContext.tsx** - Estado global de autenticación
- ✅ **CartContext.tsx** - Estado global del carrito

---

## 🧪 **Testing**

### **Configuración de Testing**
```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### **Scripts de Testing**
```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:ui       # Interfaz visual de tests
```

---

## 📊 **Performance y Optimización**

### **Optimizaciones Implementadas**
- ✅ **Code Splitting** - Carga diferida de componentes
- ✅ **Lazy Loading** - Carga bajo demanda
- ✅ **Memoización** - React.memo y useMemo
- ✅ **Debouncing** - Búsquedas optimizadas
- ✅ **Caching** - React Query para datos

### **Métricas de Performance**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 🔒 **Seguridad**

### **Medidas Implementadas**
- ✅ **JWT Authentication** - Tokens seguros
- ✅ **Route Protection** - Protección de rutas
- ✅ **Input Validation** - Validación de formularios
- ✅ **XSS Protection** - Sanitización de datos
- ✅ **CSRF Protection** - Headers de seguridad

---

## 🚀 **Despliegue**

### **Despliegue en Producción**
```bash
# Construir para producción
npm run build

# Servir archivos estáticos
npm run preview

# Desplegar en servidor
# Los archivos están en ./dist/
```

### **Variables de Producción**
```env
VITE_API_URL=https://api.webbeatty.com
VITE_APP_NAME=Web Beatty
VITE_DEBUG=false
```

---

## 🤝 **Contribución**

### **Flujo de Desarrollo**
1. **Fork** el repositorio
2. **Crear** rama feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** cambios
4. **Ejecutar tests**: `npm test`
5. **Commit**: `git commit -m "feat: nueva funcionalidad"`
6. **Push**: `git push origin feature/nueva-funcionalidad`
7. **Crear Pull Request**

### **Estándares de Código**
- **TypeScript** estricto
- **ESLint** para linting
- **Prettier** para formateo
- **Conventional Commits** para mensajes
- **Tests** para nuevas funcionalidades

---

## 📞 **Soporte**

### **Problemas Comunes**
- **Error de conexión al backend**: Verificar puerto 8000
- **Error de CORS**: Verificar configuración del backend
- **Error de autenticación**: Verificar tokens JWT
- **Error de build**: Verificar dependencias

### **Recursos Adicionales**
- **Documentación Backend**: `../backend/README.md`
- **APIs**: `../docs/APIS_BACKEND.md`
- **Testing**: `../docs/TESTING_FRONTEND_BACKEND.md`
- **Postman**: `../docs/GUIA_POSTMAN.md`

---

## 📄 **Licencia**

Este proyecto está bajo la licencia MIT.

---

**Versión:** 1.0.0  
**Última actualización:** Septiembre 2025  
**Estado:** ✅ Completado y funcional  
**Desarrollado por:** Equipo Web Beatty

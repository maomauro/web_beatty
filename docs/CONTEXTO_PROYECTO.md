# 📋 Documento de Contexto - Sistema Administrativo de Ventas

## 🎯 **Descripción del Proyecto**

**Nombre:** Sistema Administrativo de Ventas - Web Beatty  
**Tipo:** Prueba Técnica  
**Objetivo:** Desarrollar un sistema completo de gestión de ventas para productos de aseo personal con usuarios registrados.

---

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico**
- **Backend:** Python + FastAPI
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Base de Datos:** MySQL (HeidiSQL)
- **ORM:** SQLAlchemy
- **Migraciones:** Alembic
- **Autenticación:** JWT + Bcrypt
- **Iconos:** Lucide React
- **Notificaciones:** Sonner

### **Arquitectura General**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Datos         │
│   Port: 3000    │    │   Port: 8000    │    │   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📊 **Modelo de Datos**

### **Entidades Principales**

#### **1. Gestión de Usuarios**
- **`tbl_perfil`** - Roles del sistema (Administrador, Publicador, Cliente)
- **`tbl_persona`** - Información personal con validaciones únicas
- **`tbl_usuario`** - Credenciales de acceso

#### **2. Gestión de Productos**
- **`tbl_iva`** - Tipos de impuestos (0%, 4%, 10%, 19%)
- **`tbl_categoria`** - Categorías principales
- **`tbl_subcategoria`** - Subcategorías específicas
- **`tbl_producto`** - Productos con stock, precios, IVA

#### **3. Sistema de Ventas**
- **`tbl_venta`** - Cabecera de ventas
- **`tbl_carrito`** - Items en carrito con estados
- **`tbl_parametro`** - Configuraciones del sistema

### **Relaciones Clave**
```
Persona → Usuario (con Perfil)
Categoría → Subcategoría → Producto
Usuario → Carrito → Venta
Producto → Carrito (con IVA calculado)
```

---

## 🔐 **Sistema de Permisos**

### **Perfiles y Permisos**

| Perfil | Permisos |
|--------|----------|
| **Administrador** | Gestión completa: perfiles, personas, categorías, IVA, parámetros |
| **Publicador** | Solo gestión de productos |
| **Cliente** | Registro, carrito de compras, compras |

### **Credenciales de Acceso**
- **Administrador:** `admin@webbeatty.com` / Demo Admin
- **Publicador:** `publisher@webbeatty.com` / Demo Publicador
- **Clientes de prueba:** 5 usuarios con datos reales

---

## 📁 **Estructura del Proyecto**

```
proyecto-ventas/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── models/                   # Modelos SQLAlchemy
│   │   ├── schemas/                  # Esquemas Pydantic
│   │   ├── crud/                     # Operaciones CRUD
│   │   ├── routers/                  # Endpoints API
│   │   ├── services/                 # Lógica de negocio
│   │   └── utils/                    # Utilidades
│   ├── alembic/                      # Migraciones
│   ├── tests/                        # Tests unitarios
│   ├── requirements.txt              # Dependencias
│   ├── config.py                     # Configuración
│   └── database.py                   # Configuración DB
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   │   ├── ui/                   # Componentes shadcn/ui
│   │   │   ├── Header.tsx            # Header principal
│   │   │   ├── ProductCard.tsx       # Tarjeta de producto
│   │   │   ├── modals/               # Modales del sistema
│   │   │   │   ├── ProductDetailModal.tsx # Modal de detalle de producto
│   │   │   │   ├── AuthPromptModal.tsx # Modal de autenticación requerida
│   │   │   │   ├── AboutModal.tsx    # Modal informativo
│   │   │   │   ├── LogoutConfirmModal.tsx # Modal de confirmación logout
│   │   │   │   ├── PurchaseHistoryModal.tsx # Modal historial compras
│   │   │   │   ├── AbandonedCartsModal.tsx # Modal carritos abandonados
│   │   │   │   ├── CheckoutConfirmModal.tsx # Modal confirmación de compra
│   │   │   │   └── ThankYouModal.tsx # Modal de agradecimiento post-compra
│   │   │   ├── sidebars/             # Sidebars del sistema
│   │   │   │   ├── CartSidebar.tsx   # Sidebar del carrito
│   │   │   │   └── FavoritesSidebar.tsx # Sidebar de favoritos
│   │   │   ├── common/               # Componentes comunes (Header, Footer)
│   │   │   ├── admin/                # Componentes del Panel Administrativo
│   │   │   │   ├── AdminLayout.tsx   # Layout del panel admin
│   │   │   │   ├── AdminSidebar.tsx  # Sidebar del panel admin
│   │   │   │   └── AdminHeader.tsx   # Header del panel admin
│   │   │   └── publisher/            # Componentes del Panel del Publicador
│   │   │       ├── PublisherLayout.tsx # Layout del panel publicador
│   │   │       ├── PublisherSidebar.tsx # Sidebar del panel publicador
│   │   │       └── PublisherHeader.tsx # Header del panel publicador
│   │   ├── pages/                    # Páginas principales
│   │   │   ├── HomePage.tsx          # Página de inicio
│   │   │   ├── ProductsPage.tsx      # Página de productos (catálogo)
│   │   │   ├── AboutPage.tsx         # Página Nosotros
│   │   │   ├── ProfilePage.tsx       # Página de perfil
│   │   │   ├── AuthPage.tsx          # Página de autenticación
│   │   │   ├── admin/                # Páginas del Panel Administrativo
│   │   │   │   ├── DashboardPage.tsx # Dashboard administrativo
│   │   │   │   ├── ProfilesPage.tsx  # Gestión de perfiles
│   │   │   │   ├── PersonsPage.tsx   # Gestión de personas
│   │   │   │   ├── UsersPage.tsx     # Gestión de usuarios
│   │   │   │   ├── CategoriesPage.tsx # Gestión de categorías
│   │   │   │   ├── SubcategoriesPage.tsx # Gestión de subcategorías
│   │   │   │   ├── ProductsPage.tsx  # Gestión de productos
│   │   │   │   ├── IvaPage.tsx       # Gestión de IVA
│   │   │   │   ├── ParametersPage.tsx # Gestión de parámetros
│   │   │   │   ├── CartsPage.tsx     # Gestión de carritos
│   │   │   │   ├── SalesPage.tsx     # Gestión de ventas
│   │   │   │   └── ReportsPage.tsx   # Reportes
│   │   │   └── publisher/            # Páginas del Panel del Publicador
│   │   │       ├── DashboardPage.tsx # Estadísticas de productos
│   │   │       ├── ProductsPage.tsx  # Gestión de productos
│   │   │       ├── CategoriesPage.tsx # Ver categorías
│   │   │       ├── SubcategoriesPage.tsx # Ver subcategorías
│   │   │       └── IvaPage.tsx       # Ver tipos de IVA
│   │   ├── services/                 # Servicios API (preparado para integración)
│   │   ├── hooks/                    # Custom hooks
│   │   │   └── useFavorites.ts       # Hook para favoritos
│   │   ├── types/                    # Tipos TypeScript
│   │   │   └── index.ts              # Definiciones de tipos
│   │   ├── utils/                    # Utilidades (preparado para integración)
│   │   ├── lib/                      # Utilidades
│   │   │   └── utils.ts              # Funciones utilitarias
│   │   ├── App.tsx                   # Componente principal
│   │   └── main.tsx                  # Punto de entrada
│   ├── public/                       # Archivos estáticos
│   ├── package.json                  # Dependencias
│   ├── tailwind.config.js            # Configuración Tailwind
│   ├── vite.config.ts                # Configuración Vite
│   └── tsconfig.json                 # Configuración TypeScript
├── database/                         # Base de Datos
│   ├── backup/                       # Scripts de backup
│   ├── data/                         # Datos separados
│   └── migrations/                   # Migraciones manuales
└── docs/                             # Documentación
```

---

## ✅ **Estado Actual del Proyecto**

### **📊 Progreso General**
- **Frontend:** 100% completado ✅
- **Backend - Auth API:** 100% completado ✅
- **Backend - Resto APIs:** 0% completado ⏳
- **Integración:** 0% completado ⏳

### **✅ Completado**
1. **Estructura de carpetas** - Organización completa del proyecto
2. **Configuración de base de datos** - Scripts SQL completos
3. **Migraciones Alembic** - Sistema de versionado de DB
4. **Datos iniciales** - Seed data y test data separados
5. **Configuración backend** - FastAPI, SQLAlchemy, Alembic
6. **Documentación** - README y guías de uso
7. **Frontend completo** - React + TypeScript + Vite + Tailwind CSS
8. **Componentes UI** - Sistema de diseño con shadcn/ui
9. **Páginas principales** - Home, Products, About, Profile
10. **Sistema de autenticación** - Login/Registro con modales
11. **Gestión de estado** - Carrito, favoritos, usuario actual
12. **Funcionalidades avanzadas** - Búsqueda, filtros, modales
13. **UX/UI mejorada** - Responsive design, animaciones, feedback
14. **Proceso de checkout** - Flujo completo de confirmación y agradecimiento
15. **Historial de compras** - Compras realizadas y carritos abandonados
16. **Sistema de favoritos** - Gestión completa con persistencia
17. **Panel Administrativo** - Dashboard completo con todas las funcionalidades
18. **Panel del Publicador** - Gestión de productos con modales completos
19. **Sistema de navegación** - Botones Demo Admin y Demo Publicador
20. **Estadísticas unificadas** - Dashboard con métricas completas
21. **Reorganización de estructura** - Componentes organizados en carpetas lógicas
22. **Limpieza de código** - Imports no utilizados eliminados
23. **Configuración TypeScript** - tsconfig.json y tsconfig.node.json creados
24. **Future flags React Router** - Configuración para v7
25. **Preparación para integración** - Directorios services/ y utils/ creados
26. **API de Autenticación** - Endpoints login, me, refresh, logout completos ✅
27. **Sistema JWT** - Tokens de acceso y refresh implementados ✅
28. **Validación de tokens** - Verificación de expiración y tipo ✅
29. **Hashing de contraseñas** - Bcrypt implementado ✅
30. **Testing de API** - Documentación completa de testing ✅

### **🔄 En Progreso**
- Integración frontend-backend (conectar con APIs de autenticación)
- Implementación de modelos SQLAlchemy para otras entidades
- Desarrollo de endpoints REST para productos, categorías, etc.

### **⏳ Pendiente**
- APIs para productos, categorías, IVA, ventas
- Testing completo de todas las APIs
- Despliegue
- Optimizaciones de performance

---

## 🔗 **Preparación para Integración Frontend-Backend**

### **📁 Estructura Preparada para APIs:**
```
frontend/src/
├── services/                 # 🆕 Servicios API (creado)
├── utils/                    # 🆕 Utilidades para integración (creado)
├── hooks/                    # Custom hooks (expandir con useAuth, useApi, etc.)
└── types/                    # Tipos (expandir con tipos de API)
```

### **🎯 Próximos Pasos de Integración:**
1. **Configuración de servicios API** - Axios, interceptores, manejo de errores
2. **Implementación de autenticación** - JWT, refresh tokens, gestión de sesión
3. **Reemplazo de datos mock** - Conectar con endpoints reales
4. **Gestión de estado global** - React Query o Context API
5. **Manejo de errores** - Error boundaries y feedback al usuario

### **🔧 Tecnologías a Implementar:**
- **Axios** - Cliente HTTP para llamadas a API
- **React Query** - Gestión de estado del servidor
- **JWT** - Autenticación y autorización
- **Interceptores** - Manejo automático de tokens

---

## 🔐 **API de Autenticación - Completada**

### **Endpoints Implementados**
| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/auth/login` | `POST` | Iniciar sesión | No requerida |
| `/api/auth/me` | `GET` | Obtener usuario actual | JWT Bearer |
| `/api/auth/refresh` | `POST` | Renovar token de acceso | No requerida |
| `/api/auth/logout` | `POST` | Cerrar sesión | No requerida |

### **Características Implementadas**
- ✅ **JWT Tokens** - Access token (30 min) + Refresh token (7 días)
- ✅ **Bcrypt Hashing** - Contraseñas hasheadas de forma segura
- ✅ **Validación de Tokens** - Verificación de expiración y tipo
- ✅ **Gestión de Sesiones** - Refresh tokens en memoria del servidor
- ✅ **Testing Completo** - Documentación de testing con Postman
- ✅ **Variables de Entorno** - Configuración automática en Postman

### **Credenciales de Prueba**
- **Email:** `admin@sistema.com`
- **Password:** `admin123`
- **Perfil:** Administrador

### **Documentación de Testing**
- 📋 **Archivo:** `docs/TESTING_AUTH_API.md`
- 📋 **Contenido:** Guía completa de testing con Postman
- 📋 **Scripts:** Automatización de tokens en variables de entorno

---

## 🚀 **Funcionalidades Requeridas**

### **Backend (FastAPI)**
- ✅ **Autenticación** - Login/Logout con JWT (completado)
- [ ] **CRUD Perfiles** - Gestión de roles
- [ ] **CRUD Personas** - Gestión de información personal
- [ ] **CRUD Usuarios** - Gestión de credenciales
- [ ] **CRUD Productos** - Gestión de productos con IVA
- [ ] **CRUD Categorías** - Gestión de categorización
- [ ] **CRUD IVA** - Gestión de impuestos
- [ ] **Carrito de Compras** - Gestión de carrito
- [ ] **Ventas** - Proceso de venta completo
- [ ] **Reportes** - Listado de ventas por fecha

### **Frontend (React)**
- ✅ **Login/Registro** - Autenticación de usuarios con modales
- ✅ **Página de Inicio** - Banner principal, productos destacados
- ✅ **Catálogo de Productos** - Lista con búsqueda y filtros
- ✅ **Carrito de Compras** - Agregar/quitar productos, persistencia
- ✅ **Sistema de Favoritos** - Gestión de productos favoritos
- ✅ **Página de Perfil** - Información personal editable
- ✅ **Historial de Compras** - Compras realizadas y carritos abandonados
- ✅ **Página Nosotros** - Información de la empresa
- ✅ **Sistema de Navegación** - Header responsive con funcionalidades
- ✅ **Modales Interactivos** - Detalles de productos, confirmaciones
- ✅ **Proceso de Checkout** - Flujo completo de confirmación y agradecimiento
- ✅ **Dashboard Administrativo** - Panel completo para administradores
- ✅ **Panel del Publicador** - Gestión de productos para publicadores
- [ ] **Reportes Avanzados** - Visualización de ventas

---

## 📋 **Requisitos Técnicos**

### **Obligatorios**
- ✅ Separación Front-end/Back-end
- ✅ Servicios web REST
- ✅ Backend en Python/FastAPI
- ✅ Frontend en React
- ✅ Base de datos relacional (MySQL)
- ✅ Repositorio Git

### **Opcionales (Valorados)**
- ✅ Estilos y usabilidad (Tailwind CSS + shadcn/ui)
- ✅ Documentación completa
- ✅ Validaciones robustas (frontend)
- [ ] Testing unitario e integración
- [ ] Seguridad avanzada (backend)
- ✅ Responsive design
- ✅ Animaciones y transiciones
- ✅ Feedback visual (notificaciones Sonner)
- ✅ Gestión de estado avanzada

---

## 🔧 **Configuración de Desarrollo**

### **Requisitos del Sistema**
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### **Variables de Entorno**
```env
# Backend
DATABASE_URL=mysql://root:password@localhost:3306/web_beatty
SECRET_KEY=tu_clave_secreta_super_segura_aqui_2024
DEBUG=True
CORS_ORIGINS=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:8000/api
```

### **Comandos de Inicialización**
```bash
# Base de datos
mysql -u root -p < database/init_database.sql

# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📊 **Datos de Prueba**

### **Productos Disponibles**
- **30 productos** de aseo personal
- **7 subcategorías:** accesorios-baño, afeitada, desodorantes, etc.
- **4 tipos de IVA:** 0%, 4%, 10%, 19%
- **Marcas reales:** Colgate, Oral-B, Gillette, Nivea, etc.

### **Usuarios de Prueba**
- **2 usuarios sistema:** admin@webbeatty.com, publisher@webbeatty.com
- **5 clientes:** juan.perez, maria.gomez, carlos.rodriguez, etc.
- **Datos reales:** nombres, direcciones, teléfonos colombianos

---

## 🎯 **Próximos Pasos**

### **Fase 1: Backend (Prioridad Alta)**
1. **Modelos SQLAlchemy** - Implementar todas las entidades
2. **Esquemas Pydantic** - Validación de datos
3. **CRUD Operations** - Operaciones básicas
4. **Autenticación JWT** - Sistema de login
5. **Endpoints REST** - APIs principales
6. **Integración con Frontend** - Conectar APIs reales

### **Fase 2: Frontend (Prioridad Media)**
1. ✅ **Configuración React** - Setup inicial con Vite + TypeScript
2. ✅ **Componentes básicos** - Formularios, tablas, modales
3. ✅ **Autenticación** - Login/Logout con modales
4. ✅ **Gestión de productos** - Catálogo con búsqueda y filtros
5. ✅ **Carrito de compras** - Funcionalidad completa con persistencia
6. ✅ **Sistema de favoritos** - Gestión de productos favoritos
7. ✅ **Página de perfil** - Información personal editable
8. ✅ **Historial de compras** - Compras realizadas y carritos abandonados
9. ✅ **UX/UI avanzada** - Responsive design, animaciones, feedback
10. ✅ **Proceso de Checkout** - Flujo completo de confirmación y agradecimiento
11. ✅ **Dashboard Administrativo** - Panel completo para administradores
12. ✅ **Panel del Publicador** - Gestión de productos para publicadores

### **Fase 3: Integración (Prioridad Baja)**
1. **Testing** - Unit tests y integration tests
2. **Documentación** - API docs y user guides
3. **Optimización** - Performance y UX
4. **Despliegue** - Preparación para producción

---

## 🎨 **Funcionalidades Frontend Implementadas**

### **🏠 Página de Inicio (HomePage)**
- **Banner principal** con imagen de fondo y botón "Conoce Más"
- **Modal informativo** con detalles de la empresa
- **Productos destacados** en grid responsive
- **Navegación fluida** a otras secciones

### **🛍️ Catálogo de Productos (ProductsPage)**
- **Búsqueda en tiempo real** por nombre de producto
- **Filtros por categoría** (Accesorios de baño, Afeitada, etc.)
- **Grid responsive** con tarjetas de productos
- **Paginación visual** con scroll infinito
- **Estados de carga** y manejo de errores

### **🔐 Sistema de Autenticación**
- **Modal de login** con validaciones
- **Modal de registro** con campos completos de `tbl_persona`
- **Persistencia de sesión** con localStorage
- **Protección de rutas** para usuarios autenticados
- **Logout con confirmación** y redirección
- **Botones Demo** - Demo Admin y Demo Publicador para acceso rápido

### **🛒 Carrito de Compras**
- **Agregar/quitar productos** con contador visual
- **Modal del carrito** con lista de productos
- **Cálculo de totales** en tiempo real
- **Persistencia local** entre sesiones
- **Validación de autenticación** antes de agregar
- **Proceso de checkout** con confirmación y agradecimiento

### **❤️ Sistema de Favoritos**
- **Hook personalizado** `useFavorites`
- **Persistencia local** con localStorage
- **Modal de favoritos** con lista completa
- **Iconos interactivos** en productos
- **Sincronización** entre componentes

### **👤 Página de Perfil (ProfilePage)**
- **Información personal** editable (nombre, apellido, género)
- **Información de contacto** editable (teléfono, dirección)
- **Campos protegidos** (tipo ID, número ID, email)
- **Modo edición** con botones guardar/cancelar
- **Validaciones** en tiempo real

### **📊 Historial de Compras**
- **Modal de Compras Realizadas** con ventas confirmadas
- **Modal de Carritos Abandonados** con ventas canceladas
- **Expandir/contraer** detalles de cada venta
- **Información detallada** de productos por venta
- **Estados visuales** diferenciados

### **🏢 Página Nosotros (AboutPage)**
- **Información de la empresa** con diseño atractivo
- **Secciones organizadas** con iconos
- **Diseño responsive** para todos los dispositivos
- **Navegación integrada** con el resto de la aplicación

### **💳 Proceso de Checkout**
- **Modal de confirmación** con resumen completo de la compra
- **Información detallada** de productos, precios y totales
- **Cálculo automático** de subtotal, envío, IVA y total final
- **Información de entrega** con tiempo estimado y métodos de pago
- **Modal de agradecimiento** con mensaje personalizado
- **Flujo optimizado** sin interrupciones o alertas del navegador
- **Navegación clara** con opciones para continuar comprando o ir al inicio

### **🎛️ Panel Administrativo**
- **Dashboard completo** con métricas y estadísticas
- **Gestión de perfiles** - CRUD completo de roles
- **Gestión de personas** - CRUD completo de información personal
- **Gestión de usuarios** - CRUD completo de credenciales
- **Gestión de categorías** - CRUD completo de categorías
- **Gestión de subcategorías** - CRUD completo de subcategorías
- **Gestión de productos** - CRUD completo con modales
- **Gestión de IVA** - CRUD completo de tipos de impuestos
- **Gestión de parámetros** - CRUD completo de configuraciones
- **Gestión de carritos** - Visualización de carritos de compras
- **Gestión de ventas** - Visualización de ventas realizadas
- **Reportes** - Generación de reportes de ventas
- **Navegación intuitiva** con sidebar y breadcrumbs
- **Modales completos** para todas las operaciones CRUD
- **Validaciones robustas** en formularios
- **Estados de carga** y manejo de errores

### **📈 Panel del Publicador**
- **Estadísticas de Productos** - Dashboard unificado con métricas completas
  - **KPIs Principales** - Total productos, activos, stock bajo, valor promedio
  - **Distribución por Categorías** - Gráfico con porcentajes y colores
  - **Estado de Stock** - Normal, bajo, sin stock con iconos
  - **Actividad Reciente** - Lista de acciones recientes con iconos
  - **Resumen Financiero** - Valor total inventario, precio promedio, productos activos
- **Gestión de Productos** - Tabla completa con funcionalidades avanzadas
  - **Tabla responsive** con scroll horizontal para listados extensos
  - **Filtros avanzados** - Búsqueda, categoría, estado de stock
  - **Modal de Nuevo Producto** - Formulario completo con validaciones
  - **Modal de Editar Producto** - Formulario pre-llenado para modificaciones
  - **Modal de Ver Producto** - Vista de solo lectura con detalles completos
  - **Acciones por producto** - Ver (👁️) y Editar (✏️) únicamente
  - **Estados visuales** - Iconos y badges para stock y estado
- **Ver Categorías** - Lista de categorías disponibles
- **Ver Subcategorías** - Lista de subcategorías disponibles
- **Ver Tipos de IVA** - Lista de tipos de impuestos disponibles
- **Navegación simplificada** - 5 elementos principales
- **Diseño consistente** - Tema verde para diferenciar del admin
- **Funcionalidades completas** - Sin botón de eliminar como solicitado

### **🎯 Componentes Reutilizables**
- **Header** con navegación, búsqueda, carrito, favoritos, usuario
- **ProductCard** con imagen, precio, botones de acción
- **ProductDetailModal** con información completa del producto
- **AuthPromptModal** para usuarios no autenticados
- **LogoutConfirmModal** con confirmación de datos perdidos
- **CheckoutConfirmModal** con resumen de compra y confirmación
- **ThankYouModal** con mensaje de agradecimiento post-compra
- **AdminLayout** - Layout completo para panel administrativo
- **AdminSidebar** - Navegación del panel administrativo
- **PublisherLayout** - Layout completo para panel del publicador
- **PublisherSidebar** - Navegación del panel del publicador

### **⚡ Características Técnicas**
- **TypeScript** para tipado fuerte
- **React Router** para navegación SPA
- **Tailwind CSS** para estilos utilitarios
- **shadcn/ui** para componentes consistentes
- **Lucide React** para iconografía
- **Sonner** para notificaciones
- **Vite** para desarrollo rápido
- **Modales responsivos** con scroll interno
- **Validaciones en tiempo real** en formularios
- **Estados de carga** y manejo de errores
- **Persistencia local** con localStorage
- **Navegación fluida** entre paneles

---

## 🔍 **Puntos de Atención**

### **Técnicos**
- **Validaciones** - Implementar validaciones robustas
- **Seguridad** - Protección contra SQL injection, XSS
- **Performance** - Optimización de consultas
- **Error Handling** - Manejo de errores consistente

### **Funcionales**
- **Cálculo de IVA** - Lógica de impuestos correcta
- **Estados del carrito** - Gestión de carritos abandonados
- **Permisos** - Control de acceso por perfil
- **Reportes** - Generación de reportes de ventas

---

## 📞 **Contacto y Soporte**

**Desarrollador:** [Tu nombre]  
**Fecha de inicio:** [Fecha]  
**Estado:** En desarrollo  
**Versión:** 1.0.0  

---

*Este documento se actualiza conforme avanza el desarrollo del proyecto.*

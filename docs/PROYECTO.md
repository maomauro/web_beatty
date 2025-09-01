# 📋 Documento de Contexto - Sistema Web Beatty

## 🎯 **Descripción del Proyecto**

**Nombre:** Sistema Web Beatty - Gestión de Ventas  
**Tipo:** Sistema Completo de E-commerce  
**Objetivo:** Desarrollar un sistema completo de gestión de ventas para productos de aseo personal con usuarios registrados, carrito de compras, reportes y administración.

---

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico**
- **Backend:** Python + FastAPI + SQLAlchemy + Alembic
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Base de Datos:** MySQL 8.0+ (HeidiSQL)
- **Autenticación:** JWT + Bcrypt + Passlib
- **ORM:** SQLAlchemy 2.0+
- **Migraciones:** Alembic
- **Iconos:** Lucide React
- **Notificaciones:** Sonner
- **Estado:** React Query + Context API
- **Validación:** Pydantic + Zod

### **Arquitectura General**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Datos         │
│   Port: 3000    │    │   Port: 8000    │    │   (MySQL)       │
│   TypeScript    │    │   Python        │    │   utf8mb4       │
│   Tailwind CSS  │    │   JWT Auth      │    │   InnoDB        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📊 **Modelo de Datos Actualizado**

### **Entidades Principales**

#### **1. Gestión de Usuarios**
- **`tbl_perfil`** - Roles del sistema (Administrador, Publicador, Cliente)
- **`tbl_persona`** - Información personal con validaciones únicas
- **`tbl_usuario`** - Credenciales de acceso con passwords hasheados

#### **2. Gestión de Productos**
- **`tbl_iva`** - Tipos de impuestos colombianos (0%, 4%, 10%, 19%)
- **`tbl_categoria`** - Categorías principales (Aseo Personal)
- **`tbl_subcategoria`** - Subcategorías específicas (7 subcategorías)
- **`tbl_producto`** - Productos con stock, precios, IVA, imágenes JSON

#### **3. Sistema de Ventas**
- **`tbl_venta`** - Cabecera de ventas con estados (PENDIENTE, CONFIRMADO, CANCELADO)
- **`tbl_carrito`** - Items en carrito con IVA calculado y estados
- **`tbl_parametro`** - Configuraciones del sistema (inactividad)

### **Relaciones Clave**
```
Persona (1:1) → Usuario (N:1) → Perfil
Categoría (1:N) → Subcategoría (1:N) → Producto
Usuario (1:N) → Venta (1:N) → Carrito
Producto (1:N) → Carrito (con IVA calculado)
```

---

## 🔐 **Sistema de Permisos Actualizado**

### **Perfiles y Permisos**

| Perfil | Permisos | Endpoints |
|--------|----------|-----------|
| **Administrador** | Gestión completa del sistema | `/api/reports/*`, `/api/categories/*`, `/api/iva/*` |
| **Publicador** | Solo gestión de productos | `/api/products/*` (POST/PUT/DELETE) |
| **Cliente** | Registro, carrito, compras | `/api/cart/*`, `/api/products` (GET) |

### **Credenciales de Acceso Actualizadas**
- **Administrador:** `admin@sistema.com` / `admin123`
- **Publicador:** `publicador@sistema.com` / `publicador123`
- **Cliente de Prueba:** `maria.gomez@example.com` / `cliente123`
- **Cliente Real:** `maomauro.c@gmail.com` / `80236633`

---

## 📁 **Estructura del Proyecto Actualizada**

```
web_beatty/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── models/                   # Modelos SQLAlchemy
│   │   │   ├── user.py               # Usuario, Persona, Perfil
│   │   │   ├── product.py            # Producto, Categoría, Subcategoría
│   │   │   ├── cart.py               # Carrito, Venta
│   │   │   ├── iva.py                # IVA
│   │   │   └── parameter.py          # Parámetros
│   │   ├── schemas/                  # Esquemas Pydantic
│   │   │   ├── user.py               # Schemas de usuario
│   │   │   ├── product.py            # Schemas de producto
│   │   │   ├── cart.py               # Schemas de carrito
│   │   │   └── reports.py            # Schemas de reportes
│   │   ├── crud/                     # Operaciones CRUD
│   │   ├── routers/                  # Endpoints API
│   │   │   ├── auth.py               # Autenticación
│   │   │   ├── cart.py               # Carrito de compras
│   │   │   ├── product.py            # Productos
│   │   │   ├── category.py           # Categorías
│   │   │   ├── subcategory.py        # Subcategorías
│   │   │   ├── iva.py                # IVA
│   │   │   └── reports.py            # Reportes
│   │   ├── services/                 # Lógica de negocio
│   │   └── utils/                    # Utilidades
│   ├── alembic/                      # Migraciones
│   ├── tests/                        # Tests organizados
│   │   ├── unit/                     # Tests unitarios
│   │   ├── integration/              # Tests de integración
│   │   └── e2e/                     # Tests end-to-end
│   ├── static/                       # Archivos estáticos
│   ├── requirements.txt              # Dependencias
│   ├── config.py                     # Configuración
│   ├── main.py                       # Punto de entrada
│   └── README.md                     # Documentación backend
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   │   ├── ui/                   # Componentes shadcn/ui
│   │   │   ├── Header.tsx            # Header principal
│   │   │   ├── Footer.tsx            # Footer
│   │   │   ├── CartSidebar.tsx       # Sidebar del carrito
│   │   │   ├── ProductCard.tsx       # Tarjeta de producto
│   │   │   ├── ProductDetailModal.tsx # Modal de detalle
│   │   │   ├── AuthModal.tsx         # Modal de autenticación
│   │   │   └── ...                   # Otros componentes
│   │   ├── pages/                    # Páginas principales
│   │   │   ├── HomePage.tsx          # Página de inicio
│   │   │   ├── CatalogPage.tsx       # Catálogo de productos
│   │   │   ├── AuthPage.tsx          # Página de autenticación
│   │   │   ├── ProfilePage.tsx       # Página de perfil
│   │   │   └── admin/                # Páginas de administración
│   │   │       ├── DashboardPage.tsx # Dashboard admin
│   │   │       ├── ReportsPage.tsx   # Reportes de ventas
│   │   │       └── ProductManagementPage.tsx # Gestión productos
│   │   ├── services/                 # Servicios API
│   │   │   ├── authService.ts        # Servicio de autenticación
│   │   │   ├── productService.ts     # Servicio de productos
│   │   │   ├── cartService.ts        # Servicio de carrito
│   │   │   └── reportsService.ts     # Servicio de reportes
│   │   ├── hooks/                    # Hooks personalizados
│   │   │   ├── useAuth.ts            # Hook de autenticación
│   │   │   ├── useLocalStorage.ts    # Hook de localStorage
│   │   │   └── useCart.ts            # Hook de carrito
│   │   ├── context/                  # Context API
│   │   │   ├── AuthContext.tsx       # Contexto de autenticación
│   │   │   └── CartContext.tsx       # Contexto de carrito
│   │   ├── utils/                    # Utilidades
│   │   │   ├── constants.ts          # Constantes
│   │   │   ├── helpers.ts            # Funciones helper
│   │   │   └── debugUtils.ts         # Utilidades de debug
│   │   ├── types/                    # Tipos TypeScript
│   │   │   ├── user.ts               # Tipos de usuario
│   │   │   ├── product.ts            # Tipos de producto
│   │   │   ├── cart.ts               # Tipos de carrito
│   │   │   └── reports.ts            # Tipos de reportes
│   │   ├── App.tsx                   # Componente principal
│   │   ├── main.tsx                  # Punto de entrada
│   │   └── index.css                 # Estilos globales
│   ├── public/                       # Archivos públicos
│   ├── package.json                  # Dependencias
│   ├── vite.config.ts               # Configuración Vite
│   ├── tailwind.config.js           # Configuración Tailwind
│   └── README.md                     # Documentación frontend
├── database/                         # Base de datos
│   ├── migrations/                   # Migraciones SQL
│   │   └── 001_initial_schema.sql    # Esquema inicial
│   ├── backup/                       # Backups
│   │   └── web_beatty.sql            # Backup completo
│   ├── init_database.sql             # Script de inicialización
│   ├── update_database.sh            # Script de actualización
│   └── README.md                     # Documentación BD
├── docs/                             # Documentación
│   ├── CONTEXTO_PROYECTO.md          # Este documento
│   ├── APIS_BACKEND.md               # Documentación APIs
│   ├── TESTING_FRONTEND_BACKEND.md   # Guía de testing
│   ├── GUIA_POSTMAN.md               # Guía Postman
│   ├── CHECKLIST_BACKEND.md          # Checklist backend
│   └── er_web_beatty.pdf             # Diagrama ER
├── .gitignore                        # Archivos ignorados
└── README.md                         # README principal
```

---

## 🚀 **Funcionalidades Implementadas**

### **✅ Autenticación y Autorización**
- Sistema JWT completo con refresh automático
- Registro de usuarios con validación de datos
- Login/logout con manejo de sesiones
- Perfiles de usuario con permisos específicos
- Password hashing con bcrypt

### **✅ Gestión de Productos**
- Catálogo completo con 30 productos de aseo personal
- 7 subcategorías organizadas
- Sistema de IVA colombiano (0%, 4%, 10%, 19%)
- Gestión de stock y precios
- Imágenes en formato JSON con galería

### **✅ Carrito de Compras**
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de IVA
- Persistencia en base de datos
- Estados: ACTIVO, VENTA, ABANDONADO

### **✅ Sistema de Ventas**
- Confirmación de compras
- Estados de venta: PENDIENTE, CONFIRMADO, CANCELADO
- Cálculo de totales con IVA
- Historial de compras
- Limpieza automática de carrito

### **✅ Reportes y Analytics**
- Reporte detallado de ventas
- Filtros por fecha, estado y búsqueda
- Métricas: total ventas, confirmadas, pendientes
- Resumen con estadísticas
- Exportación de datos

### **✅ Administración**
- Dashboard administrativo
- Gestión de categorías y subcategorías
- Gestión de tipos de IVA
- Gestión de productos (admin/pub)
- Parámetros del sistema

---

## 📊 **Datos del Sistema**

### **Usuarios Registrados**
- **12 usuarios** en total
- **1 Administrador** (`admin@sistema.com`)
- **1 Publicador** (`publicador@sistema.com`)
- **10 Clientes** (incluyendo datos reales)

### **Productos Disponibles**
- **30 productos** activos
- **1 categoría** (Aseo Personal)
- **7 subcategorías**:
  - Accesorios de baño
  - Afeitada
  - Desodorantes
  - Desodorantes para pies
  - Jabones y geles
  - Repelentes
  - Toallitas y pañitos

### **Ventas Registradas**
- **5 ventas** en el sistema
- **2 ventas confirmadas** ($112,796 total)
- **3 ventas pendientes** ($77,764 total)
- **9 items** en carrito

### **Marcas Incluidas**
- Colgate, Oral-B, Listerine
- Gillette, Bic, Nivea
- Rexona, AXE, Old Spice
- Dove, Palmolive, Eucerin
- Head & Shoulders, Pantene, Sedal
- Y más...

---

## 🔧 **Configuración Técnica**

### **Backend (FastAPI)**
- **Puerto:** 8000
- **Framework:** FastAPI 0.104.1+
- **ORM:** SQLAlchemy 2.0.23+
- **Autenticación:** JWT con python-jose
- **Validación:** Pydantic 2.5.0+
- **Migraciones:** Alembic 1.12.1+
- **Testing:** pytest 7.4.3+

### **Frontend (React)**
- **Puerto:** 3000
- **Framework:** React 18+
- **Build Tool:** Vite 5+
- **Lenguaje:** TypeScript 5+
- **Styling:** Tailwind CSS 3+
- **UI Components:** shadcn/ui
- **State Management:** React Query + Context API
- **HTTP Client:** Axios

### **Base de Datos (MySQL)**
- **Versión:** 8.0+
- **Charset:** utf8mb4
- **Collation:** utf8mb4_spanish2_ci
- **Motor:** InnoDB
- **Herramienta:** HeidiSQL

---

## 🧪 **Testing y Calidad**

### **Backend Testing**
- **Tests Unitarios:** Modelos, servicios, utilidades
- **Tests de Integración:** APIs, autenticación, carrito
- **Tests E2E:** Flujos completos de usuario
- **Cobertura:** >80% del código

### **Frontend Testing**
- **Component Testing:** React Testing Library
- **Integration Testing:** APIs y servicios
- **E2E Testing:** Cypress (preparado)
- **Type Safety:** TypeScript estricto

### **Herramientas de Testing**
- **Backend:** pytest, httpx, coverage
- **Frontend:** Vitest, React Testing Library
- **API Testing:** Postman (colección completa)
- **Database Testing:** Scripts de verificación

---

## 📚 **Documentación Disponible**

### **Documentación Técnica**
- ✅ **CONTEXTO_PROYECTO.md** - Este documento
- ✅ **APIS_BACKEND.md** - Documentación completa de APIs
- ✅ **TESTING_FRONTEND_BACKEND.md** - Guía de testing
- ✅ **GUIA_POSTMAN.md** - Guía de Postman con colección
- ✅ **CHECKLIST_BACKEND.md** - Checklist de implementación

### **READMEs Específicos**
- ✅ **backend/README.md** - Documentación del backend
- ✅ **frontend/README.md** - Documentación del frontend
- ✅ **database/README.md** - Documentación de la base de datos

### **Diagramas y Esquemas**
- ✅ **er_web_beatty.pdf** - Diagrama Entidad-Relación
- ✅ **Swagger UI** - `http://localhost:8000/docs`
- ✅ **ReDoc** - `http://localhost:8000/redoc`

---

## 🚀 **Instalación y Despliegue**

### **Instalación Rápida**
```bash
# 1. Clonar repositorio
git clone <repository-url>
cd web_beatty

# 2. Configurar base de datos
cd database
./update_database.sh

# 3. Configurar backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp env_template.txt .env
# Editar .env con credenciales
uvicorn main:app --reload

# 4. Configurar frontend
cd ../frontend
npm install
npm run dev
```

### **Credenciales de Acceso**
- **Admin:** `admin@sistema.com` / `admin123`
- **Publicador:** `publicador@sistema.com` / `publicador123`
- **Cliente:** `maria.gomez@example.com` / `cliente123`

---

## 📈 **Métricas del Proyecto**

### **Código**
- **Backend:** ~2,500 líneas de código Python
- **Frontend:** ~3,000 líneas de código TypeScript/React
- **Base de Datos:** 10 tablas, 50+ campos
- **APIs:** 25+ endpoints documentados

### **Funcionalidades**
- **Autenticación:** 100% implementada
- **Carrito:** 100% funcional
- **Productos:** 100% gestionables
- **Reportes:** 100% operativos
- **Testing:** 80%+ cobertura

### **Calidad**
- **Type Safety:** 100% TypeScript
- **Documentación:** 100% cubierta
- **Testing:** Tests unitarios, integración y E2E
- **Performance:** Optimizado para producción

---

## 🔮 **Próximas Mejoras**

### **Funcionalidades Futuras**
- 🔮 **Pagos:** Integración con pasarelas de pago
- 🔮 **Notificaciones:** Email y SMS
- 🔮 **Dashboard:** Métricas en tiempo real
- 🔮 **Mobile:** Aplicación móvil
- 🔮 **SEO:** Optimización para buscadores

### **Mejoras Técnicas**
- 🔮 **Cache:** Redis para mejor performance
- 🔮 **CDN:** Distribución de contenido
- 🔮 **Monitoring:** Logs y métricas avanzadas
- 🔮 **CI/CD:** Pipeline automatizado
- 🔮 **Docker:** Containerización completa

---

## 📞 **Soporte y Contacto**

### **Documentación**
- 📚 **Swagger UI:** `http://localhost:8000/docs`
- 📚 **ReDoc:** `http://localhost:8000/redoc`
- 📚 **Postman:** Colección completa disponible

### **Testing**
- 🧪 **Backend:** `pytest` en directorio backend
- 🧪 **Frontend:** `npm test` en directorio frontend
- 🧪 **API:** Postman collection incluida

### **Despliegue**
- 🚀 **Desarrollo:** Scripts de instalación incluidos
- 🚀 **Producción:** Documentación de despliegue
- 🚀 **Docker:** Configuración preparada

---

**Versión:** 1.0.0  
**Última actualización:** Septiembre 2025  
**Estado:** ✅ Completado y funcional  
**Desarrollado por:** Equipo Web Beatty

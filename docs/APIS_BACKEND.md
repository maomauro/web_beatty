# 🔌 Documento de APIs Backend - Sistema Administrativo de Ventas

## 🎯 **Descripción General**

Este documento define las APIs necesarias para el backend del Sistema Administrativo de Ventas Web Beatty, basado en el modelo de datos y las funcionalidades implementadas en el frontend.

---

## 📊 **Análisis de Requerimientos**

### **Entidades de Base de Datos:**
- `tbl_perfil` - Roles del sistema
- `tbl_persona` - Información personal
- `tbl_usuario` - Credenciales de acceso
- `tbl_iva` - Tipos de impuestos
- `tbl_categoria` - Categorías principales
- `tbl_subcategoria` - Subcategorías específicas
- `tbl_producto` - Productos con stock y precios
- `tbl_carrito` - Items en carrito
- `tbl_venta` - Cabecera de ventas
- `tbl_parametro` - Configuraciones del sistema

### **Funcionalidades Frontend:**
- Sistema de autenticación
- Panel Administrativo (CRUD completo)
- Panel del Publicador (Gestión de productos)
- E-commerce (Catálogo, carrito, checkout)
- Sistema de favoritos
- Historial de compras
- Reportes y estadísticas

---

## 🔐 **1. Autenticación y Autorización**

### **Base URL:** `/api/auth`

| Método | Endpoint     | Descripción             | Parámetros          | Respuesta             |
|--------|--------------|-------------------------|---------------------|-----------------------|
| `POST` | `/login`     | Iniciar sesión          | `email`, `password` | JWT token + user data |
| `POST` | `/logout`    | Cerrar sesión           | JWT token           | Success message       |
| `GET`  | `/me`        | Obtener usuario actual  | JWT token           | User data             |
| `POST` | `/refresh`   | Renovar token           | Refresh token       | New JWT token         |

---

## 👥 **2. Gestión de Usuarios y Perfiles**

### **Base URL:** `/api/users`

#### **2.1 Perfiles**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/profiles` | Listar perfiles | Query params | Lista de perfiles |
| `GET` | `/profiles/{id}` | Obtener perfil | `id` | Perfil específico |
| `POST` | `/profiles` | Crear perfil | Profile data | Perfil creado |
| `PUT` | `/profiles/{id}` | Actualizar perfil | `id`, Profile data | Perfil actualizado |
| `DELETE` | `/profiles/{id}` | Eliminar perfil | `id` | Success message |

#### **2.2 Personas**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/persons` | Listar personas | Query params | Lista de personas |
| `GET` | `/persons/{id}` | Obtener persona | `id` | Persona específica |
| `POST` | `/persons` | Crear persona | Person data | Persona creada |
| `PUT` | `/persons/{id}` | Actualizar persona | `id`, Person data | Persona actualizada |
| `DELETE` | `/persons/{id}` | Eliminar persona | `id` | Success message |

#### **2.3 Usuarios**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/users` | Listar usuarios | Query params | Lista de usuarios |
| `GET` | `/users/{id}` | Obtener usuario | `id` | Usuario específico |
| `POST` | `/users` | Crear usuario | User data | Usuario creado |
| `PUT` | `/users/{id}` | Actualizar usuario | `id`, User data | Usuario actualizado |
| `DELETE` | `/users/{id}` | Eliminar usuario | `id` | Success message |
| `PUT` | `/users/{id}/profile` | Actualizar perfil de usuario | `id`, Profile data | Usuario actualizado |

---

## 🛍️ **3. Gestión de Productos**

### **Base URL:** `/api/products`

#### **3.1 Productos**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/products` | Listar productos | Query params | Lista de productos |
| `GET` | `/products/{id}` | Obtener producto | `id` | Producto específico |
| `POST` | `/products` | Crear producto | Product data | Producto creado |
| `PUT` | `/products/{id}` | Actualizar producto | `id`, Product data | Producto actualizado |
| `DELETE` | `/products/{id}` | Eliminar producto | `id` | Success message |
| `GET` | `/products/search` | Buscar productos | `q`, `category`, `price_range` | Productos filtrados |
| `GET` | `/products/featured` | Productos destacados | - | Lista de productos destacados |
| `PUT` | `/products/{id}/stock` | Actualizar stock | `id`, `stock` | Stock actualizado |

#### **3.2 Categorías**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/categories` | Listar categorías | - | Lista de categorías |
| `GET` | `/categories/{id}` | Obtener categoría | `id` | Categoría específica |
| `POST` | `/categories` | Crear categoría | Category data | Categoría creada |
| `PUT` | `/categories/{id}` | Actualizar categoría | `id`, Category data | Categoría actualizada |
| `DELETE` | `/categories/{id}` | Eliminar categoría | `id` | Success message |

#### **3.3 Subcategorías**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/subcategories` | Listar subcategorías | `category_id` | Lista de subcategorías |
| `GET` | `/subcategories/{id}` | Obtener subcategoría | `id` | Subcategoría específica |
| `POST` | `/subcategories` | Crear subcategoría | Subcategory data | Subcategoría creada |
| `PUT` | `/subcategories/{id}` | Actualizar subcategoría | `id`, Subcategory data | Subcategoría actualizada |
| `DELETE` | `/subcategories/{id}` | Eliminar subcategoría | `id` | Success message |

#### **3.4 IVA**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/iva` | Listar tipos de IVA | - | Lista de tipos de IVA |
| `GET` | `/iva/{id}` | Obtener tipo de IVA | `id` | Tipo de IVA específico |
| `POST` | `/iva` | Crear tipo de IVA | IVA data | Tipo de IVA creado |
| `PUT` | `/iva/{id}` | Actualizar tipo de IVA | `id`, IVA data | Tipo de IVA actualizado |
| `DELETE` | `/iva/{id}` | Eliminar tipo de IVA | `id` | Success message |

---

## 🛒 **4. Sistema de Carrito y Compras**

### **Base URL:** `/api/cart`

#### **4.1 Carrito**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/cart` | Obtener carrito del usuario | JWT token | Carrito actual |
| `POST` | `/cart/items` | Agregar producto al carrito | `product_id`, `quantity` | Item agregado |
| `PUT` | `/cart/items/{id}` | Actualizar cantidad | `id`, `quantity` | Item actualizado |
| `DELETE` | `/cart/items/{id}` | Eliminar item del carrito | `id` | Item eliminado |
| `DELETE` | `/cart` | Vaciar carrito | - | Carrito vaciado |
| `GET` | `/cart/total` | Calcular total del carrito | - | Total con IVA |

#### **4.2 Favoritos**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/favorites` | Obtener favoritos del usuario | JWT token | Lista de favoritos |
| `POST` | `/favorites` | Agregar a favoritos | `product_id` | Producto agregado |
| `DELETE` | `/favorites/{product_id}` | Eliminar de favoritos | `product_id` | Producto eliminado |
| `GET` | `/favorites/check/{product_id}` | Verificar si está en favoritos | `product_id` | Boolean |

---

## 💳 **5. Sistema de Ventas**

### **Base URL:** `/api/sales`

#### **5.1 Ventas**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `POST` | `/sales` | Crear venta | Cart data | Venta creada |
| `GET` | `/sales` | Listar ventas del usuario | JWT token | Lista de ventas |
| `GET` | `/sales/{id}` | Obtener venta específica | `id` | Venta específica |
| `GET` | `/sales/abandoned` | Carritos abandonados | JWT token | Lista de carritos |
| `PUT` | `/sales/{id}/status` | Actualizar estado de venta | `id`, `status` | Estado actualizado |

#### **5.2 Checkout**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `POST` | `/checkout/validate` | Validar carrito para checkout | Cart data | Validación |
| `POST` | `/checkout/process` | Procesar checkout | Payment data | Venta procesada |
| `POST` | `/checkout/confirm` | Confirmar venta | `sale_id` | Venta confirmada |

---

## 📊 **6. Reportes y Estadísticas**

### **Base URL:** `/api/reports`

#### **6.1 Estadísticas Generales**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/stats/dashboard` | Estadísticas del dashboard | Date range | KPIs generales |
| `GET` | `/stats/products` | Estadísticas de productos | Date range | Métricas de productos |
| `GET` | `/stats/sales` | Estadísticas de ventas | Date range | Métricas de ventas |
| `GET` | `/stats/users` | Estadísticas de usuarios | Date range | Métricas de usuarios |

#### **6.2 Reportes Específicos**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/reports/sales` | Reporte de ventas | Date range, filters | Reporte detallado |
| `GET` | `/reports/products` | Reporte de productos | Category, stock | Reporte de inventario |
| `GET` | `/reports/users` | Reporte de usuarios | Date range | Reporte de usuarios |
| `GET` | `/reports/abandoned-carts` | Reporte de carritos abandonados | Date range | Carritos abandonados |

---

## ⚙️ **7. Configuración del Sistema**

### **Base URL:** `/api/config`

#### **7.1 Parámetros**
| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/parameters` | Listar parámetros | - | Lista de parámetros |
| `GET` | `/parameters/{key}` | Obtener parámetro | `key` | Valor del parámetro |
| `POST` | `/parameters` | Crear parámetro | Parameter data | Parámetro creado |
| `PUT` | `/parameters/{key}` | Actualizar parámetro | `key`, Parameter data | Parámetro actualizado |
| `DELETE` | `/parameters/{key}` | Eliminar parámetro | `key` | Success message |

---

## 🔍 **8. Búsqueda y Filtros**

### **Base URL:** `/api/search`

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/products` | Búsqueda de productos | `q`, `category`, `price_min`, `price_max`, `sort` | Productos filtrados |
| `GET` | `/users` | Búsqueda de usuarios | `q`, `profile`, `status` | Usuarios filtrados |
| `GET` | `/sales` | Búsqueda de ventas | `q`, `date_from`, `date_to`, `status` | Ventas filtradas |

---

## 📈 **9. APIs Específicas del Panel del Publicador**

### **Base URL:** `/api/publisher`

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|-----------|
| `GET` | `/dashboard/stats` | Estadísticas del publicador | JWT token | KPIs del publicador |
| `GET` | `/products/my-products` | Productos del publicador | JWT token | Lista de productos |
| `GET` | `/products/activity` | Actividad reciente | JWT token | Lista de actividades |
| `GET` | `/products/stock-alerts` | Alertas de stock | JWT token | Productos con stock bajo |

---

## 🔐 **10. Middleware y Validaciones**

### **Autenticación**
- **JWT Token** en header: `Authorization: Bearer <token>`
- **Refresh Token** para renovación automática
- **Roles y permisos** por endpoint

### **Validaciones**
- **Campos requeridos** en todos los POST/PUT
- **Formato de datos** (email, teléfono, etc.)
- **Permisos de usuario** según perfil
- **Límites de rate limiting**

### **Respuestas Estándar**
```json
{
  "success": true,
  "data": {...},
  "message": "Operación exitosa",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### **Manejo de Errores**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campos requeridos faltantes",
    "details": {...}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 📋 **11. Esquemas de Datos Principales**

### **Usuario**
```json
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "profile": {
    "id": 1,
    "name": "Cliente"
  },
  "person": {
    "id": 1,
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+573001234567",
    "address": {...}
  }
}
```

### **Producto**
```json
{
  "id": 1,
  "code": "PROD-001",
  "name": "Cepillo dental",
  "brand": "Colgate",
  "price": 5000,
  "stock": 100,
  "category": {
    "id": 1,
    "name": "Higiene bucal"
  },
  "subcategory": {
    "id": 1,
    "name": "Cepillos"
  },
  "iva": {
    "id": 1,
    "percentage": 19
  }
}
```

### **Venta**
```json
{
  "id": 1,
  "user_id": 1,
  "total": 15000,
  "iva_total": 2850,
  "status": "CONFIRMED",
  "created_at": "2024-01-01T00:00:00Z",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 5000,
      "iva": 950
    }
  ]
}
```

---

## 🚀 **12. Priorización de Desarrollo**

### **Fase 1 (Crítico)**
1. **Autenticación** - Login/Logout/JWT
2. **Productos** - CRUD básico
3. **Carrito** - Agregar/quitar productos
4. **Ventas** - Proceso básico de checkout

### **Fase 2 (Importante)**
1. **Usuarios y Perfiles** - CRUD completo
2. **Categorías y IVA** - Gestión
3. **Favoritos** - Sistema completo
4. **Reportes básicos** - Estadísticas

### **Fase 3 (Mejoras)**
1. **Búsqueda avanzada** - Filtros complejos
2. **Reportes detallados** - Análisis completo
3. **Configuración** - Parámetros del sistema
4. **Optimizaciones** - Performance y UX

---

## 📝 **13. Notas de Implementación**

### **Base de Datos**
- Usar **SQLAlchemy** para ORM
- Implementar **migraciones** con Alembic
- Configurar **relaciones** correctamente
- Implementar **índices** para búsquedas

### **Seguridad**
- **Validación de entrada** en todos los endpoints
- **Sanitización** de datos
- **Rate limiting** para prevenir abuso
- **Logs** de auditoría

### **Performance**
- **Paginación** en listados grandes
- **Caché** para datos estáticos
- **Optimización** de consultas SQL
- **Compresión** de respuestas

---

*Este documento se actualiza conforme se desarrollan las APIs del backend.*

# 📚 Documentación de APIs - Backend Web Beatty

## 🎯 **Descripción General**

Este documento describe todas las APIs disponibles en el backend del sistema Web Beatty, desarrollado con FastAPI. El sistema proporciona endpoints para autenticación, gestión de productos, carrito de compras, reportes y administración.

---

## 🔗 **Información Base**

- **URL Base:** `http://localhost:8000`
- **Documentación Interactiva:** `http://localhost:8000/docs` (Swagger UI)
- **Documentación Alternativa:** `http://localhost:8000/redoc` (ReDoc)
- **Health Check:** `http://localhost:8000/health`

---

## 🔐 **Autenticación**

### **Sistema JWT**
- **Algoritmo:** HS256
- **Duración Access Token:** 30 minutos
- **Duración Refresh Token:** 7 días
- **Header:** `Authorization: Bearer <token>`

### **Endpoints de Autenticación**

#### **POST /api/auth/login**
Iniciar sesión de usuario.

**Request Body:**
```json
{
  "username": "admin@sistema.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id_usuario": 6,
    "username": "admin@sistema.com",
    "perfil": {
      "id_perfil": 1,
      "nombre": "Administrador"
    },
    "persona": {
      "id_persona": 6,
      "nombre": "Admin",
      "apellido": "Sistema",
      "email": "admin@sistema.com"
    }
  }
}
```

#### **POST /api/auth/register**
Registrar nuevo usuario.

**Request Body:**
```json
{
  "tipo_identificacion": "CC",
  "identificacion": "1234567890",
  "genero": "MASCULINO",
  "nombre": "Juan",
  "apellido": "Pérez",
  "direccion": "Calle 123 #45-67",
  "telefono": "3001234567",
  "email": "juan.perez@example.com"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id_usuario": 13,
    "username": "juan.perez@example.com",
    "password": "1234567890"
  }
}
```

#### **GET /api/auth/me**
Obtener información del usuario actual.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id_usuario": 6,
  "username": "admin@sistema.com",
  "perfil": {
    "id_perfil": 1,
    "nombre": "Administrador"
  },
  "persona": {
    "id_persona": 6,
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@sistema.com"
  }
}
```

#### **POST /api/auth/logout**
Cerrar sesión.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 🛍️ **Carrito de Compras**

### **Endpoints del Carrito**

#### **GET /api/cart**
Obtener carrito del usuario actual.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "items": [
    {
      "id_carrito": 130,
      "id_producto": 32,
      "cantidad": 3,
      "valor_unitario": 5200.00,
      "iva_calculado": 2964.00,
      "subtotal": 18564.00,
      "producto": {
        "id_producto": 32,
        "nombre": "Cepillo dental suave",
        "marca": "Oral-B",
        "imagen": "{\"principal\": \"default-1.webp\"}"
      }
    }
  ],
  "total_items": 1,
  "subtotal": 18564.00,
  "total_iva": 2964.00,
  "total": 21528.00
}
```

#### **POST /api/cart**
Agregar producto al carrito.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "id_producto": 32,
  "cantidad": 2
}
```

**Response (201):**
```json
{
  "message": "Producto agregado al carrito",
  "item": {
    "id_carrito": 131,
    "id_producto": 32,
    "cantidad": 2,
    "valor_unitario": 5200.00,
    "iva_calculado": 1976.00,
    "subtotal": 12376.00
  }
}
```

#### **PUT /api/cart/{item_id}**
Actualizar cantidad de un item del carrito.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "cantidad": 5
}
```

**Response (200):**
```json
{
  "message": "Cantidad actualizada",
  "item": {
    "id_carrito": 130,
    "cantidad": 5,
    "subtotal": 30940.00
  }
}
```

#### **DELETE /api/cart/{item_id}**
Eliminar item del carrito.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Item eliminado del carrito"
}
```

#### **PUT /api/cart/confirm**
Confirmar compra (convertir carrito en venta).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Compra confirmada exitosamente",
  "venta": {
    "id_venta": 6,
    "total_venta": 21528.00,
    "estado": "CONFIRMADO",
    "fecha_venta": "2025-09-01T12:00:00"
  }
}
```

#### **DELETE /api/cart/clear**
Limpiar carrito completo.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Carrito limpiado exitosamente"
}
```

---

## 📦 **Productos**

### **Endpoints de Productos**

#### **GET /api/products**
Listar productos (público).

**Query Parameters:**
- `page` (int): Número de página (default: 1)
- `limit` (int): Items por página (default: 10)
- `search` (str): Búsqueda por nombre
- `category` (int): Filtrar por categoría
- `subcategory` (int): Filtrar por subcategoría

**Response (200):**
```json
{
  "products": [
    {
      "id_producto": 32,
      "codigo": "PROD-002",
      "marca": "Oral-B",
      "nombre": "Cepillo dental suave",
      "valor": 5200.00,
      "stock": 70,
      "estado": "ACTIVO",
      "imagen": "{\"principal\": \"default-1.webp\"}",
      "categoria": {
        "id_categoria": 1,
        "nombre": "Aseo personal"
      },
      "subcategoria": {
        "id_subcategoria": 1,
        "nombre": "accesorios-baño"
      },
      "iva": {
        "id_iva": 4,
        "porcentaje": 19.00,
        "descripcion": "IVA Máximo"
      }
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 10,
  "pages": 3
}
```

#### **GET /api/products/{product_id}**
Obtener producto específico.

**Response (200):**
```json
{
  "id_producto": 32,
  "codigo": "PROD-002",
  "marca": "Oral-B",
  "nombre": "Cepillo dental suave",
  "valor": 5200.00,
  "stock": 70,
  "estado": "ACTIVO",
  "imagen": "{\"principal\": \"default-1.webp\", \"galeria\": [\"default.webp\", \"default-1.webp\", \"default-2.webp\"]}",
  "fecha_caducidad": "2027-10-15",
  "categoria": {
    "id_categoria": 1,
    "nombre": "Aseo personal"
  },
  "subcategoria": {
    "id_subcategoria": 1,
    "nombre": "accesorios-baño"
  },
  "iva": {
    "id_iva": 4,
    "porcentaje": 19.00,
    "descripcion": "IVA Máximo"
  }
}
```

#### **POST /api/products** (Admin/Publicador)
Crear nuevo producto.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "codigo": "PROD-031",
  "marca": "Nueva Marca",
  "nombre": "Nuevo Producto",
  "valor": 15000.00,
  "stock": 100,
  "id_categoria": 1,
  "id_subcategoria": 1,
  "id_iva": 4,
  "fecha_caducidad": "2026-12-31",
  "imagen": "{\"principal\": \"default.webp\"}"
}
```

**Response (201):**
```json
{
  "message": "Producto creado exitosamente",
  "product": {
    "id_producto": 61,
    "codigo": "PROD-031",
    "nombre": "Nuevo Producto"
  }
}
```

#### **PUT /api/products/{product_id}** (Admin/Publicador)
Actualizar producto.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "nombre": "Producto Actualizado",
  "valor": 18000.00,
  "stock": 150
}
```

**Response (200):**
```json
{
  "message": "Producto actualizado exitosamente"
}
```

#### **DELETE /api/products/{product_id}** (Admin/Publicador)
Eliminar producto.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

---

## 📊 **Reportes**

### **Endpoints de Reportes** (Solo Admin)

#### **GET /api/reports/sales**
Reporte detallado de ventas.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `start_date` (str): Fecha inicio (YYYY-MM-DD)
- `end_date` (str): Fecha fin (YYYY-MM-DD)
- `status` (str): Estado (completed, pending, cancelled)
- `search` (str): Búsqueda por cliente
- `page` (int): Número de página
- `limit` (int): Items por página

**Response (200):**
```json
{
  "sales": [
    {
      "id_venta": 1,
      "fecha_venta": "2025-09-01T10:38:51",
      "total_venta": 74252.00,
      "estado": "CONFIRMADO",
      "usuario": {
        "nombre": "María",
        "apellido": "Gómez",
        "email": "maria.gomez@example.com"
      },
      "items": [
        {
          "id_producto": 42,
          "nombre": "Desodorante clásico 150ml",
          "cantidad": 3,
          "valor_unitario": 15000.00,
          "subtotal": 49500.00
        }
      ]
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

#### **GET /api/reports/sales/summary**
Resumen de ventas.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `start_date` (str): Fecha inicio (YYYY-MM-DD)
- `end_date` (str): Fecha fin (YYYY-MM-DD)

**Response (200):**
```json
{
  "total_sales": 112796.00,
  "completed_sales": 2,
  "pending_sales": 3,
  "total_records": 5,
  "average_order_value": 56398.00
}
```

---

## 🏷️ **Categorías**

### **Endpoints de Categorías**

#### **GET /api/categories**
Listar categorías.

**Response (200):**
```json
[
  {
    "id_categoria": 1,
    "nombre": "Aseo personal",
    "descripcion": "Productos relacionados con el cuidado e higiene personal",
    "subcategorias": [
      {
        "id_subcategoria": 1,
        "nombre": "accesorios-baño",
        "descripcion": "Accesorios para el baño"
      }
    ]
  }
]
```

#### **POST /api/categories** (Solo Admin)
Crear categoría.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "nombre": "Nueva Categoría",
  "descripcion": "Descripción de la nueva categoría"
}
```

**Response (201):**
```json
{
  "message": "Categoría creada exitosamente",
  "categoria": {
    "id_categoria": 2,
    "nombre": "Nueva Categoría"
  }
}
```

#### **PUT /api/categories/{id}** (Solo Admin)
Actualizar categoría.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "nombre": "Categoría Actualizada",
  "descripcion": "Nueva descripción"
}
```

**Response (200):**
```json
{
  "message": "Categoría actualizada exitosamente"
}
```

#### **DELETE /api/categories/{id}** (Solo Admin)
Eliminar categoría.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Categoría eliminada exitosamente"
}
```

---

## 💰 **IVA**

### **Endpoints de IVA**

#### **GET /api/iva**
Listar tipos de IVA.

**Response (200):**
```json
[
  {
    "id_iva": 1,
    "porcentaje": 0.00,
    "descripcion": "Sin IVA"
  },
  {
    "id_iva": 2,
    "porcentaje": 4.00,
    "descripcion": "IVA Mínimo"
  },
  {
    "id_iva": 3,
    "porcentaje": 10.00,
    "descripcion": "IVA Medio"
  },
  {
    "id_iva": 4,
    "porcentaje": 19.00,
    "descripcion": "IVA Máximo"
  }
]
```

#### **POST /api/iva** (Solo Admin)
Crear tipo de IVA.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "porcentaje": 5.00,
  "descripcion": "IVA Reducido"
}
```

**Response (201):**
```json
{
  "message": "Tipo de IVA creado exitosamente",
  "iva": {
    "id_iva": 5,
    "porcentaje": 5.00,
    "descripcion": "IVA Reducido"
  }
}
```

#### **PUT /api/iva/{id}** (Solo Admin)
Actualizar tipo de IVA.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "porcentaje": 6.00,
  "descripcion": "IVA Reducido Actualizado"
}
```

**Response (200):**
```json
{
  "message": "Tipo de IVA actualizado exitosamente"
}
```

#### **DELETE /api/iva/{id}** (Solo Admin)
Eliminar tipo de IVA.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Tipo de IVA eliminado exitosamente"
}
```

---

## 🔧 **Endpoints de Utilidad**

### **GET /**
Información general del sistema.

**Response (200):**
```json
{
  "message": "Sistema Administrativo de Ventas - Web Beatty",
  "version": "1.0.0",
  "status": "running"
}
```

### **GET /health**
Health check del sistema.

**Response (200):**
```json
{
  "status": "healthy"
}
```

### **GET /api/test-connection**
Prueba de conexión.

**Response (200):**
```json
{
  "status": "success",
  "message": "Backend funcionando correctamente",
  "timestamp": "2025-09-01T12:00:00Z"
}
```

---

## 🚨 **Códigos de Error**

### **Errores Comunes**

#### **400 Bad Request**
```json
{
  "detail": "Datos de entrada inválidos"
}
```

#### **401 Unauthorized**
```json
{
  "detail": "Credenciales incorrectas"
}
```

#### **403 Forbidden**
```json
{
  "detail": "No tienes permisos para acceder a este recurso"
}
```

#### **404 Not Found**
```json
{
  "detail": "Recurso no encontrado"
}
```

#### **422 Validation Error**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

#### **500 Internal Server Error**
```json
{
  "detail": "Error interno del servidor"
}
```

---

## 📋 **Ejemplos de Uso**

### **Flujo Completo de Compra**

1. **Login del usuario:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "maria.gomez@example.com", "password": "cliente123"}'
```

2. **Agregar producto al carrito:**
```bash
curl -X POST "http://localhost:8000/api/cart" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"id_producto": 32, "cantidad": 2}'
```

3. **Ver carrito:**
```bash
curl -X GET "http://localhost:8000/api/cart" \
  -H "Authorization: Bearer <access_token>"
```

4. **Confirmar compra:**
```bash
curl -X PUT "http://localhost:8000/api/cart/confirm" \
  -H "Authorization: Bearer <access_token>"
```

### **Ejemplo con Postman**

Importar la colección de Postman incluida en `docs/GUIA_POSTMAN.md` para tener todos los endpoints configurados automáticamente.

---

## 🔒 **Seguridad**

### **Medidas Implementadas**
- ✅ **JWT Authentication** - Tokens seguros con expiración
- ✅ **Password Hashing** - Bcrypt para contraseñas
- ✅ **CORS Configuration** - Control de orígenes permitidos
- ✅ **Input Validation** - Validación con Pydantic
- ✅ **SQL Injection Protection** - ORM SQLAlchemy
- ✅ **Rate Limiting** - Protección contra ataques

### **Recomendaciones**
- 🔒 **HTTPS** en producción
- 🔒 **Rate Limiting** más estricto
- 🔒 **Logs de Auditoría** para acciones críticas
- 🔒 **Backup Automático** de base de datos

---

## 📚 **Documentación Adicional**

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **Guía Postman:** `docs/GUIA_POSTMAN.md`
- **Testing:** `docs/TESTING_FRONTEND_BACKEND.md`

---

**Versión:** 1.0.0  
**Última actualización:** Septiembre 2025  
**Desarrollado por:** Equipo Web Beatty

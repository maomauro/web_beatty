# 🚀 Guía Completa: Configurar y Probar Endpoints en Postman

## 📋 Prerrequisitos

### 1. Backend Ejecutándose
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Base de Datos Configurada
- MySQL ejecutándose en `localhost:3306`
- Base de datos `web_beatty` creada
- Script `database/init_database.sql` ejecutado

### 3. Variables de Entorno
Crear archivo `.env` en `backend/` basado en `env_template.txt`:
```env
DATABASE_URL=mysql+pymysql://desarrollo:desarrollo@localhost:3306/web_beatty
SECRET_KEY=tu_clave_secreta_super_segura_aqui_2024_web_beatty_system
DEBUG=True
```

---

## 🛠️ Configuración de Postman

### Paso 1: Crear Colección
1. Abrir Postman
2. Click en "Collections" → "New Collection"
3. **Nombre**: `Web Beatty API`
4. **Descripción**: `API del Sistema Administrativo de Ventas`

### Paso 2: Configurar Environment
1. Click en "Environments" → "New Environment"
2. **Nombre**: `Web Beatty Local`
3. **Variables**:
   - `base_url`: `http://localhost:8000`
   - `access_token`: (dejar vacío)
   - `refresh_token`: (dejar vacío)

### Paso 3: Crear Carpetas
En la colección, crear estas carpetas:
- `🔐 Auth`
- `📂 Categories`
- `📁 Subcategories`
- `📦 Products`
- `🛒 Cart & Sales`

---

## 🔐 ENDPOINTS DE AUTENTICACIÓN

### 1. Login
- **Método**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "admin@sistema.com",
  "password": "admin123"
}
```
- **Tests** (Post-response script):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.access_token);
    pm.environment.set("refresh_token", response.refresh_token);
}
```

### 2. Get Current User
- **Método**: `GET`
- **URL**: `{{base_url}}/api/auth/me`
- **Headers**: `Authorization: Bearer {{access_token}}`

### 3. Refresh Token
- **Método**: `POST`
- **URL**: `{{base_url}}/api/auth/refresh`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "refresh_token": "{{refresh_token}}"
}
```
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.access_token);
}
```

### 4. Logout
- **Método**: `POST`
- **URL**: `{{base_url}}/api/auth/logout`
- **Headers**: `Authorization: Bearer {{access_token}}`

---

## 🌐 ENDPOINTS PÚBLICOS (SIN AUTENTICACIÓN)

> **Importante**: Estos endpoints NO requieren autenticación y están diseñados para que los clientes puedan consultar información sin necesidad de registrarse.

### 📂 CATEGORÍAS PÚBLICAS

#### 1. Listar Categorías Públicas
- **Método**: `GET`
- **URL**: `{{base_url}}/api/categories/public`
- **Headers**: Ninguno requerido
- **Query Params** (opcionales):
  - `skip`: `0`
  - `limit`: `10`
- **Respuesta esperada**:
```json
{
  "categorias": [
    {
      "id_categoria": 1,
      "nombre": "Cuidado del Cabello",
      "descripcion": "Productos para el cuidado del cabello"
    },
    {
      "id_categoria": 2,
      "nombre": "Cuidado de la Piel",
      "descripcion": "Productos para el cuidado de la piel"
    }
  ],
  "total": 2
}
```

#### 2. Obtener Categoría Pública por ID
- **Método**: `GET`
- **URL**: `{{base_url}}/api/categories/public/1`
- **Headers**: Ninguno requerido
- **Respuesta esperada**:
```json
{
  "id_categoria": 1,
  "nombre": "Cuidado del Cabello",
  "descripcion": "Productos para el cuidado del cabello"
}
```

### 📁 SUBCATEGORÍAS PÚBLICAS

#### 1. Listar Subcategorías Públicas
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories/public`
- **Headers**: Ninguno requerido
- **Query Params** (opcionales):
  - `skip`: `0`
  - `limit`: `10`
  - `categoria_id`: `1` (filtrar por categoría)
- **Respuesta esperada** (siempre incluye detalles de categoría):
```json
{
  "subcategorias": [
    {
      "id_subcategoria": 1,
      "id_categoria": 1,
      "nombre": "Shampoo",
      "descripcion": "Shampoos para diferentes tipos de cabello",
      "categoria_nombre": "Cuidado del Cabello"
    }
  ],
  "total": 1
}
```



#### 3. Listar Subcategorías Públicas por Categoría
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories/public?categoria_id=1`
- **Headers**: Ninguno requerido
- **Query Params**:
  - `categoria_id`: `1` (ID de la categoría)
- **Respuesta esperada**: Solo subcategorías de la categoría especificada

#### 4. Obtener Subcategoría Pública por ID
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories/public/1`
- **Headers**: Ninguno requerido
- **Respuesta esperada** (siempre incluye detalles de categoría):
```json
{
  "id_subcategoria": 1,
  "id_categoria": 1,
  "nombre": "Shampoo",
  "descripcion": "Shampoos para diferentes tipos de cabello",
  "categoria_nombre": "Cuidado del Cabello"
}
```



### 📦 PRODUCTOS PÚBLICOS

#### 1. Listar Productos Públicos (formato simple)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/public-simple`
- **Headers**: Ninguno requerido
- **Respuesta esperada**:
```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Shampoo Reparador Intensivo",
      "marca": "L'Oréal Paris",
      "valor": 45000.0,
      "stock": 50,
      "estado": "ACTIVO",
      "id_iva": 1
    }
  ],
  "total": 1,
  "message": "Productos obtenidos exitosamente"
}
```

#### 2. Listar Productos Públicos (formato completo)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/public`
- **Headers**: Ninguno requerido
- **Query Params** (opcionales):
  - `skip`: `0`
  - `limit`: `10`
  - `categoria_id`: `1`
  - `subcategoria_id`: `1`
  - `estado`: `ACTIVO`
  - `search`: `shampoo`
- **Respuesta esperada** (siempre incluye detalles de relaciones):
```json
{
  "productos": [
    {
      "id_producto": 1,
      "id_categoria": 1,
      "id_subcategoria": 1,
      "id_iva": 1,
      "codigo": "SH001",
      "marca": "L'Oréal Paris",
      "nombre": "Shampoo Reparador Intensivo",
      "fecha_caducidad": "2025-12-31",
      "imagen": "shampoo.jpg",
      "valor": 45000.00,
      "stock": 50,
      "estado": "ACTIVO",
      "categoria_nombre": "Cuidado del Cabello",
      "subcategoria_nombre": "Shampoo",
      "iva_nombre": "Sin IVA",
      "iva_porcentaje": 0.0
    }
  ],
  "total": 1
}
```



#### 4. Obtener Producto Público por ID
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/public/1`
- **Headers**: Ninguno requerido
- **Respuesta esperada** (siempre incluye detalles de relaciones):
```json
{
  "id_producto": 1,
  "id_categoria": 1,
  "id_subcategoria": 1,
  "id_iva": 1,
  "codigo": "SH001",
  "marca": "L'Oréal Paris",
  "nombre": "Shampoo Reparador Intensivo",
  "fecha_caducidad": "2025-12-31",
  "imagen": "shampoo.jpg",
  "valor": 45000.00,
  "stock": 50,
  "estado": "ACTIVO",
  "categoria_nombre": "Cuidado del Cabello",
  "subcategoria_nombre": "Shampoo",
  "iva_nombre": "Sin IVA",
  "iva_porcentaje": 0.0
}
```



#### 6. Endpoint de Prueba de Productos
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/test`
- **Headers**: Ninguno requerido
- **Respuesta esperada**:
```json
{
  "message": "Router de productos funcionando correctamente",
  "status": "success"
}
```

### 🔍 FILTROS DISPONIBLES EN ENDPOINTS PÚBLICOS

#### Para Productos Públicos:
- `categoria_id`: Filtrar por ID de categoría
- `subcategoria_id`: Filtrar por ID de subcategoría
- `estado`: Filtrar por estado (por defecto "ACTIVO")
- `search`: Buscar por nombre, marca o código

#### Para Subcategorías Públicas:
- `categoria_id`: Filtrar por ID de categoría

#### Para Categorías Públicas:
- `skip`: Número de registros a omitir (paginación)
- `limit`: Número máximo de registros a retornar

---

## 📂 ENDPOINTS DE CATEGORÍAS

### 1. Listar Categorías
- **Método**: `GET`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcionales):
  - `skip`: `0`
  - `limit`: `10`

### 2. Obtener Categoría por ID
- **Método**: `GET`
- **URL**: `{{base_url}}/api/categories/1`
- **Headers**: `Authorization: Bearer {{access_token}}`

### 3. Crear Categoría
- **Método**: `POST`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "nombre": "Cuidado del Cabello",
  "descripcion": "Productos para el cuidado y tratamiento del cabello"
}
```

### 4. Actualizar Categoría
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/categories/1`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "nombre": "Cuidado del Cabello Actualizado",
  "descripcion": "Descripción actualizada"
}
```

### 5. Eliminar Categoría
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/categories/1`
- **Headers**: `Authorization: Bearer {{access_token}}`

---

## 📁 ENDPOINTS DE SUBCATEGORÍAS

### 1. Listar Subcategorías (con detalles por defecto)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcionales):
  - `skip`: `0`
  - `limit`: `10`
  - `categoria_id`: `1`
  - `basic`: `false` (por defecto, incluye detalles de categoría)
- **Respuesta esperada** (con detalles):
```json
{
  "subcategorias": [
    {
      "id_categoria": 1,
      "nombre": "accesorios-baño",
      "descripcion": "Accesorios para el baño",
      "id_subcategoria": 1,
      "categoria_nombre": "Cuidado Personal"
    }
  ],
  "total": 1
}
```

### 2. Listar Subcategorías (modo básico)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories?basic=true`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params**:
  - `basic`: `true` (solo datos básicos, sin detalles)
- **Respuesta esperada** (básica):
```json
{
  "subcategorias": [
    {
      "id_categoria": 1,
      "nombre": "accesorios-baño",
      "descripcion": "Accesorios para el baño",
      "id_subcategoria": 1
    }
  ],
  "total": 1
}
```

### 3. Obtener Subcategoría por ID (con detalles por defecto)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories/1`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcionales):
  - `basic`: `false` (por defecto, incluye detalles de categoría)
- **Respuesta esperada**:
```json
{
  "id_categoria": 1,
  "nombre": "accesorios-baño",
  "descripcion": "Accesorios para el baño",
  "id_subcategoria": 1,
  "categoria_nombre": "Cuidado Personal"
}
```

### 4. Obtener Subcategoría por ID (modo básico)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/subcategories/1?basic=true`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params**:
  - `basic`: `true` (solo datos básicos)

### 5. Crear Subcategoría
- **Método**: `POST`
- **URL**: `{{base_url}}/api/subcategories`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "id_categoria": 1,
  "nombre": "Shampoo",
  "descripcion": "Shampoos y acondicionadores"
}
```

### 6. Actualizar Subcategoría
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/subcategories/1`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "nombre": "Shampoo y Acondicionador",
  "descripcion": "Descripción actualizada"
}
```

### 7. Eliminar Subcategoría
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/subcategories/1`
- **Headers**: `Authorization: Bearer {{access_token}}`

---

## 📦 ENDPOINTS DE PRODUCTOS

### 1. Listar Productos (con detalles por defecto)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcionales):
  - `skip`: `0`
  - `limit`: `10`
  - `categoria_id`: `1`
  - `subcategoria_id`: `1`
  - `estado`: `ACTIVO`
  - `search`: `shampoo`
  - `basic`: `false` (por defecto, incluye detalles de relaciones)
- **Respuesta esperada** (con detalles):
```json
{
  "productos": [
    {
      "id_categoria": 1,
      "id_subcategoria": 1,
      "id_iva": 1,
      "codigo": "SH001",
      "marca": "L'Oréal Paris",
      "nombre": "Shampoo Reparador Intensivo",
      "fecha_caducidad": "2025-12-31",
      "imagen": "https://example.com/shampoo.jpg",
      "valor": 45000.00,
      "stock": 50,
      "estado": "ACTIVO",
      "id_producto": 1,
      "categoria_nombre": "Cuidado Personal",
      "subcategoria_nombre": "accesorios-baño",
      "iva_porcentaje": 19.00,
      "iva_descripcion": "IVA General"
    }
  ],
  "total": 1
}
```

### 2. Listar Productos (modo básico)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products?basic=true`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params**:
  - `basic`: `true` (solo datos básicos, sin detalles de relaciones)
- **Respuesta esperada** (básica):
```json
{
  "productos": [
    {
      "id_categoria": 1,
      "id_subcategoria": 1,
      "id_iva": 1,
      "codigo": "SH001",
      "marca": "L'Oréal Paris",
      "nombre": "Shampoo Reparador Intensivo",
      "fecha_caducidad": "2025-12-31",
      "imagen": "https://example.com/shampoo.jpg",
      "valor": 45000.00,
      "stock": 50,
      "estado": "ACTIVO",
      "id_producto": 1
    }
  ],
  "total": 1
}
```

### 3. Obtener Producto por ID (con detalles por defecto)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/1`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcionales):
  - `basic`: `false` (por defecto, incluye detalles de relaciones)
- **Respuesta esperada**:
```json
{
  "id_categoria": 1,
  "id_subcategoria": 1,
  "id_iva": 1,
  "codigo": "SH001",
  "marca": "L'Oréal Paris",
  "nombre": "Shampoo Reparador Intensivo",
  "fecha_caducidad": "2025-12-31",
  "imagen": "https://example.com/shampoo.jpg",
  "valor": 45000.00,
  "stock": 50,
  "estado": "ACTIVO",
  "id_producto": 1,
  "categoria_nombre": "Cuidado Personal",
  "subcategoria_nombre": "accesorios-baño",
  "iva_porcentaje": 19.00,
  "iva_descripcion": "IVA General"
}
```

### 4. Obtener Producto por ID (modo básico)
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/1?basic=true`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params**:
  - `basic`: `true` (solo datos básicos)

### 5. Crear Producto
- **Método**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "id_categoria": 1,
  "id_subcategoria": 1,
  "id_iva": 1,
  "codigo": "SH001",
  "marca": "L'Oréal Paris",
  "nombre": "Shampoo Reparador Intensivo",
  "fecha_caducidad": "2025-12-31",
  "imagen": "https://example.com/shampoo.jpg",
  "valor": 45000.00,
  "stock": 50,
  "estado": "ACTIVO"
}
```

### 6. Actualizar Producto
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/products/1`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "nombre": "Shampoo Reparador Intensivo Actualizado",
  "valor": 48000.00,
  "stock": 45
}
```

### 7. Actualizar Stock
- **Método**: `PATCH`
- **URL**: `{{base_url}}/api/products/1/stock?cantidad=5`
- **Headers**: `Authorization: Bearer {{access_token}}`

### 8. Eliminar Producto
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/products/1`
- **Headers**: `Authorization: Bearer {{access_token}}`

---

## 🧪 ORDEN DE PRUEBAS RECOMENDADO

### **Fase 0: Endpoints Públicos (Sin Autenticación)**
> **Importante**: Probar estos endpoints ANTES de hacer login para verificar que funcionan sin autenticación.
> **Nota**: Todos los endpoints públicos devuelven información detallada por defecto.

1. **Endpoint de Prueba de Productos**: `GET {{base_url}}/api/products/test`
2. **Listar Categorías Públicas**: `GET {{base_url}}/api/categories/public`
3. **Obtener Categoría Pública por ID**: `GET {{base_url}}/api/categories/public/1`
4. **Listar Subcategorías Públicas**: `GET {{base_url}}/api/subcategories/public`
5. **Listar Subcategorías Públicas por Categoría**: `GET {{base_url}}/api/subcategories/public?categoria_id=1`
6. **Obtener Subcategoría Pública por ID**: `GET {{base_url}}/api/subcategories/public/1`
7. **Listar Productos Públicos (formato simple)**: `GET {{base_url}}/api/products/public-simple`
8. **Listar Productos Públicos (formato completo)**: `GET {{base_url}}/api/products/public`
9. **Obtener Producto Público por ID**: `GET {{base_url}}/api/products/public/1`
10. **Probar filtros en productos**: `GET {{base_url}}/api/products/public?categoria_id=1&search=shampoo`

### **Fase 1: Autenticación**
1. **Login** con `admin@sistema.com` / `admin123`
2. Verificar que se guardaron los tokens en variables
3. **Get Current User** (debe retornar datos del usuario)
4. **Refresh Token** (opcional, para probar renovación)

### **Fase 2: Categorías**
1. **Listar Categorías** (debe mostrar las existentes del script SQL)
2. **Crear Categoría** nueva
3. **Obtener Categoría** por ID (usar el ID de la creada)
4. **Actualizar Categoría**
5. **Listar Categorías** (verificar cambios)

### **Fase 3: Subcategorías**
1. **Listar Subcategorías** (debe mostrar las existentes con detalles de categoría)
2. **Listar Subcategorías modo básico** (`?basic=true`)
3. **Crear Subcategoría** nueva (asociada a una categoría existente)
4. **Obtener Subcategoría con Detalles** por ID
5. **Obtener Subcategoría modo básico** por ID (`?basic=true`)
6. **Actualizar Subcategoría**
7. **Listar Subcategorías** por categoría

### **Fase 4: Productos**
1. **Listar Productos** (debe estar vacío inicialmente, con detalles por defecto)
2. **Listar Productos modo básico** (`?basic=true`)
3. **Crear Producto** nuevo (usar categoría y subcategoría existentes)
4. **Obtener Producto con Detalles** por ID
5. **Obtener Producto modo básico** por ID (`?basic=true`)
6. **Actualizar Producto**
7. **Actualizar Stock**
8. **Buscar Productos** por término
9. **Listar Productos** con filtros
10. **Listar Productos modo básico** con filtros

### **Fase 5: Pruebas de Autorización**
1. **Logout**
2. Intentar acceder a endpoints protegidos (debe dar 401)
3. Hacer login con usuario diferente
4. Probar endpoints con diferentes perfiles

---

## 📊 CÓDIGOS DE RESPUESTA ESPERADOS

| Código | Descripción | Cuándo Ocurre |
|--------|-------------|---------------|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Error de validación de datos |
| `401` | Unauthorized | No autenticado o token inválido |
| `403` | Forbidden | No autorizado para la operación |
| `404` | Not Found | Recurso no encontrado |
| `422` | Unprocessable Entity | Error de validación de esquema |

---

## 🔧 TROUBLESHOOTING

### Error 1: "Cannot import name 'DATABASE_URL'"
**Solución**: Verificar que el archivo `.env` existe en `backend/` y tiene la variable `DATABASE_URL`

### Error 2: "AttributeError: 'dict' object has no attribute 'perfil'"
**Solución**: Este error ya está corregido. El problema era que los routers estaban intentando acceder a `current_user.perfil.nombre` cuando `current_user` es un diccionario del token JWT. Ahora se usa `current_user.get("profile")`.

### Error 3: "Connection refused"
**Solución**: 
- Verificar que MySQL esté ejecutándose
- Verificar credenciales en `DATABASE_URL`
- Verificar que la base de datos `web_beatty` existe

### Error 4: "401 Unauthorized"
**Solución**:
- Verificar que el token esté en la variable `access_token`
- Verificar que el token no haya expirado
- Hacer login nuevamente

### Error 4.1: "403 Forbidden" en endpoints públicos
**Solución**:
- Verificar que estés usando la URL correcta con `/public` o `/public-simple`
- Los endpoints públicos NO requieren token de autorización
- Ejemplo correcto: `GET {{base_url}}/api/products/public-simple`
- Ejemplo incorrecto: `GET {{base_url}}/api/products` (requiere autenticación)

### Error 5: "403 Forbidden"
**Solución**:
- Verificar que el usuario tenga el perfil correcto
- Usar usuario administrador para operaciones de eliminación

### Error 6: "404 Not Found"
**Solución**:
- Verificar que el ID del recurso existe
- Verificar que la URL del endpoint sea correcta

---

## 📝 NOTAS IMPORTANTES

1. **Endpoints públicos vs privados**:
   - **Endpoints públicos**: NO requieren autenticación, diseñados para clientes sin registro, SIEMPRE devuelven información detallada
   - **Endpoints privados**: Requieren `Authorization: Bearer {{access_token}}`
   - **Endpoints públicos disponibles**: `/public` y `/public-simple` en categorías, subcategorías y productos

2. **Siempre usar el token**: Todos los endpoints privados requieren `Authorization: Bearer {{access_token}}`

2. **IDs dinámicos**: Los IDs en las URLs deben ajustarse según los datos reales de la base de datos

3. **Validaciones implementadas**:
   - Autenticación requerida
   - Autorización por perfil
   - Integridad referencial
   - Datos únicos
   - Validación de esquemas

4. **Datos de prueba**: El script SQL incluye datos iniciales para categorías, subcategorías, IVA y usuarios

5. **Credenciales de prueba**:
   - **Admin**: `admin@sistema.com` / `admin123`
   - **Publicador**: `publicador@sistema.com` / `publi123`

6. **Endpoints optimizados**: Los endpoints principales ahora devuelven detalles por defecto:
   - **Por defecto**: Incluyen información de relaciones (nombres de categorías, subcategorías, IVA)
   - **Modo básico**: Usar `?basic=true` para obtener solo datos básicos sin detalles
   - **Ejemplo**: `GET /api/subcategories` (con detalles) vs `GET /api/subcategories?basic=true` (básico)

---

## 🎯 PRÓXIMOS PASOS

Una vez que todos los endpoints funcionen correctamente:

1. **Integración Frontend-Backend**: Conectar el frontend React con estos endpoints
   - Usar endpoints públicos para la página inicial y catálogo
   - Usar endpoints privados para carrito, favoritos y perfil
2. **Endpoints adicionales**: Implementar IVA, usuarios, ventas, etc.
3. **Testing automatizado**: Crear tests unitarios y de integración
4. **Documentación API**: Generar documentación automática con Swagger

## 🌟 CARACTERÍSTICAS IMPLEMENTADAS

### ✅ **Endpoints Públicos (Sin Autenticación)**
- **Categorías públicas**: Consulta sin registro
- **Subcategorías públicas**: Con filtros por categoría, siempre incluyen detalles de categoría
- **Productos públicos**: Formato simple y completo, siempre incluyen detalles de relaciones
- **Filtros avanzados**: Por categoría, subcategoría, búsqueda, estado

### ✅ **Endpoints Privados (Con Autenticación)**
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Autorización por perfil**: Administrador, Publicador, Cliente
- **Validaciones**: Integridad referencial, datos únicos

### ✅ **Optimizaciones**
- **Detalles por defecto**: Los endpoints principales incluyen información de relaciones
- **Modo básico**: Usar `?basic=true` para datos simples
- **Paginación**: Soporte para `skip` y `limit`
- **Búsqueda**: Filtros por múltiples criterios

---

## 🛒 ENDPOINTS DE CARRITO Y VENTAS

### **Requisitos Previos**
- Usuario autenticado (todos los endpoints requieren token)
- **Credenciales de prueba**:
  - **Admin**: `admin@sistema.com` / `admin123` (puede ver todas las ventas)
  - **Cliente**: `cliente@prueba.com` / `cliente123` (puede crear carritos y ver sus ventas)
  - **Publicador**: `publicador@sistema.com` / `publi123` (no tiene acceso a ventas)

**Nota**: Si no existe el usuario cliente, ejecutar: `python create_test_client.py`

### **Secuencia de Operaciones**
1. **Login** para obtener token
2. **Crear carrito** (crea venta + items) - **Solo Clientes**
3. **Consultar ventas** del usuario - **Admin ve todas, Cliente ve sus propias**
4. **Ver detalle** de venta específica - **Admin ve cualquier venta, Cliente ve sus propias**

## 🔐 AUTORIZACIÓN POR PERFIL

### **Permisos por Perfil:**

| Perfil            | Crear Carrito | Ver Ventas Propias | Ver Todas las Ventas |
|-------------------|---------------|--------------------|----------------------|
| **Administrador** | ❌ No         | ✅ Sí             | ✅ Sí                |
| **Publicador**    | ❌ No         | ❌ No             | ❌ No                |
| **Cliente**       | ✅ Sí         | ✅ Sí             | ❌ No                |

### **Notas Importantes:**
- **Solo Clientes** pueden crear carritos y ventas
- **Administradores** pueden ver todas las ventas del sistema (incluyendo las de otros usuarios)
- **Publicadores** no tienen acceso a funcionalidades de ventas
- **Clientes** solo pueden ver sus propias ventas

---

### 1. Crear Carrito y Venta
- **Método**: `POST`
- **URL**: `{{base_url}}/api/cart/create`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{access_token}}`
- **Body** (raw JSON):
```json
{
  "items": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "valor_unitario": 15000.0,
      "iva_calculado": 2850.0,
      "subtotal": 32850.0
    },
    {
      "id_producto": 2,
      "cantidad": 1,
      "valor_unitario": 25000.0,
      "iva_calculado": 4750.0,
      "subtotal": 29750.0
    }
  ]
}
```

**Respuesta Exitosa (201)**:
```json
{
  "id_venta": 1,
  "total_venta": 62600.0,
  "estado": "PENDIENTE",
  "fecha_venta": "2024-01-15T10:30:00",
  "items": [
    {
      "id_carrito": 1,
      "id_venta": 1,
      "id_usuario": 6,
      "id_producto": 1,
      "cantidad": 2,
      "valor_unitario": 15000.0,
      "iva_calculado": 2850.0,
      "subtotal": 32850.0,
      "fecha_carrito": "2024-01-15T10:30:00",
      "estado": "ACTIVO",
      "fecha_abandono": null
    },
    {
      "id_carrito": 2,
      "id_venta": 1,
      "id_usuario": 6,
      "id_producto": 2,
      "cantidad": 1,
      "valor_unitario": 25000.0,
      "iva_calculado": 4750.0,
      "subtotal": 29750.0,
      "fecha_carrito": "2024-01-15T10:30:00",
      "estado": "ACTIVO",
      "fecha_abandono": null
    }
  ]
}
```

---

### 2. Listar Ventas del Usuario
- **Método**: `GET`
- **URL**: `{{base_url}}/api/cart/sales`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Parameters** (opcionales):
  - `skip`: 0 (registros a omitir)
  - `limit`: 100 (máximo de registros)

**Respuesta Exitosa (200)**:
```json
[
  {
    "id_venta": 1,
    "id_usuario": 6,
    "total_venta": 62600.0,
    "estado": "PENDIENTE",
    "fecha_venta": "2024-01-15T10:30:00",
    "usuario_nombre": "Admin Sistema",
    "usuario_email": "admin@sistema.com"
  },
  {
    "id_venta": 2,
    "id_usuario": 6,
    "total_venta": 45000.0,
    "estado": "CONFIRMADA",
    "fecha_venta": "2024-01-14T15:20:00",
    "usuario_nombre": "Admin Sistema",
    "usuario_email": "admin@sistema.com"
  }
]
```

---

### 3. Detalle de Venta y Carrito
- **Método**: `GET`
- **URL**: `{{base_url}}/api/cart/sale/{sale_id}`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Ejemplo**: `{{base_url}}/api/cart/sale/1`

**Respuesta Exitosa (200)**:
```json
{
  "id_venta": 1,
  "total_venta": 62600.0,
  "estado": "PENDIENTE",
  "fecha_venta": "2024-01-15T10:30:00",
  "items": [
    {
      "id_carrito": 1,
      "id_venta": 1,
      "id_usuario": 6,
      "id_producto": 1,
      "cantidad": 2,
      "valor_unitario": 15000.0,
      "iva_calculado": 2850.0,
      "subtotal": 32850.0,
      "fecha_carrito": "2024-01-15T10:30:00",
      "estado": "ACTIVO",
      "fecha_abandono": null
    },
    {
      "id_carrito": 2,
      "id_venta": 1,
      "id_usuario": 6,
      "id_producto": 2,
      "cantidad": 1,
      "valor_unitario": 25000.0,
      "iva_calculado": 4750.0,
      "subtotal": 29750.0,
      "fecha_carrito": "2024-01-15T10:30:00",
      "estado": "ACTIVO",
      "fecha_abandono": null
    }
  ]
}
```

---

### 4. Confirmar Compra
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/cart/confirm`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Descripción**: Confirma la compra del carrito actual, cambiando el estado de PENDIENTE a CONFIRMADO

**Cambios en la base de datos:**
- `tbl_venta.estado`: `'PENDIENTE'` → `'CONFIRMADO'`
- `tbl_venta.fecha_venta`: Se actualiza a la fecha actual
- `tbl_carrito.estado`: `'ACTIVO'` → `'VENTA'` para todos los items
- `tbl_producto.stock`: Se reduce según las cantidades vendidas

**Respuesta Exitosa (200)**:
```json
{
  "message": "Compra confirmada exitosamente",
  "id_venta": 1,
  "total_venta": 62600.0,
  "fecha_venta": "2024-01-15T15:45:30",
  "estado": "CONFIRMADO",
  "items_count": 2,
  "stock_updates": [
    {
      "id_producto": 42,
      "nombre": "Desodorante clásico 150ml",
      "stock_anterior": 120,
      "stock_actual": 118,
      "cantidad_vendida": 2
    },
    {
      "id_producto": 32,
      "nombre": "Cepillo dental suave",
      "stock_anterior": 80,
      "stock_actual": 79,
      "cantidad_vendida": 1
    }
  ]
}
```

**Errores posibles:**
- **403 Forbidden**: Solo clientes pueden confirmar compras
- **404 Not Found**: No hay carrito pendiente para confirmar
- **400 Bad Request**: El carrito está vacío
- **400 Bad Request**: Stock insuficiente para algún producto
- **400 Bad Request**: Producto no encontrado

---

## 🛒 FLUJO DE PRUEBA - CARRITO Y VENTAS

### **Paso 1: Login**
1. Ejecutar **Login** para obtener token
2. Verificar que `access_token` se guarde en variables

### **Paso 2: Crear Carrito**
1. Ejecutar **Crear Carrito y Venta**
2. Guardar el `id_venta` de la respuesta
3. Verificar que se creen los registros en ambas tablas

### **Paso 3: Consultar Ventas**
1. Ejecutar **Listar Ventas del Usuario**
2. Verificar que aparezca la venta creada
3. Verificar información del usuario

### **Paso 4: Ver Detalle**
1. Ejecutar **Detalle de Venta y Carrito** con el `id_venta`
2. Verificar todos los items del carrito
3. Verificar cálculos de totales

---

## ⚠️ POSIBLES ERRORES - CARRITO Y VENTAS

### **Error 1: "401 Unauthorized"**
**Solución**: 
- Verificar que el token esté en `access_token`
- Hacer login nuevamente

### **Error 2: "403 Forbidden - Solo los usuarios con perfil 'Cliente' pueden crear carritos y ventas"**
**Solución**:
- Usar un usuario con perfil "Cliente" (ID = 3)
- Los administradores y publicadores NO pueden crear carritos
- Crear un usuario cliente en la base de datos

### **Error 3: "403 Forbidden - Los usuarios con perfil 'Publicador' no tienen acceso a consultar ventas"**
**Solución**:
- Los publicadores no tienen acceso a funcionalidades de ventas
- Usar un usuario administrador o cliente para consultar ventas

### **Error 4: "404 Not Found" en detalle de venta**
**Solución**:
- Verificar que el `id_venta` existe
- Verificar que la venta pertenece al usuario autenticado (excepto administradores)

### **Error 5: "422 Validation Error"**
**Solución**:
- Verificar formato del JSON en el body
- Verificar que `id_producto` existe en la base de datos
- Verificar que los cálculos de `subtotal` sean correctos

### **Error 6: "500 Internal Server Error"**
**Solución**:
- Verificar que las tablas `tbl_venta` y `tbl_carrito` existen
- Verificar conexión a la base de datos
- Revisar logs del backend

---

¡Listo para probar! 🚀

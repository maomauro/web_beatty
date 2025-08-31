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

1. **Siempre usar el token**: Todos los endpoints (excepto login) requieren `Authorization: Bearer {{access_token}}`

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
2. **Endpoints adicionales**: Implementar IVA, usuarios, ventas, etc.
3. **Testing automatizado**: Crear tests unitarios y de integración
4. **Documentación API**: Generar documentación automática con Swagger

¡Listo para probar! 🚀

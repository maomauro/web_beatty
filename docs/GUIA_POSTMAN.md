# 🚀 Guía Completa: Testing de APIs con Postman - Sistema Web Beatty

## 📋 **Descripción**

Esta guía proporciona instrucciones completas para configurar y probar todas las APIs del sistema Web Beatty usando Postman, incluyendo autenticación, carrito de compras, productos, reportes y administración.

---

## 🛠️ **Configuración Inicial**

### **1. Prerrequisitos**

#### **Backend Ejecutándose**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### **Base de Datos Configurada**
- MySQL ejecutándose en `localhost:3306`
- Base de datos `web_beatty` creada
- Script `database/update_database.sh` ejecutado

#### **Variables de Entorno**
Crear archivo `.env` en `backend/` basado en `env_template.txt`:
```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/web_beatty
SECRET_KEY=tu_clave_secreta_super_segura_aqui_2024_web_beatty_system
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### **2. Configuración de Postman**

#### **Paso 1: Crear Colección**
1. Abrir Postman
2. Click en "Collections" → "New Collection"
3. **Nombre**: `Web Beatty API`
4. **Descripción**: `API del Sistema Web Beatty - Gestión de Ventas`

#### **Paso 2: Configurar Environment**
1. Click en "Environments" → "New Environment"
2. **Nombre**: `Web Beatty Local`
3. **Variables**:
   ```
   base_url: http://localhost:8000
   access_token: (dejar vacío)
   refresh_token: (dejar vacío)
   user_id: (dejar vacío)
   cart_id: (dejar vacío)
   ```

#### **Paso 3: Crear Carpetas**
En la colección, crear estas carpetas:
- `🔐 Auth` - Autenticación
- `🛒 Cart` - Carrito de compras
- `📦 Products` - Productos
- `📊 Reports` - Reportes
- `🏷️ Categories` - Categorías
- `💰 IVA` - Gestión de IVA
- `🔧 Utils` - Utilidades

---

## 🔐 **ENDPOINTS DE AUTENTICACIÓN**

### **1. Login**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "admin@sistema.com",
  "password": "admin123"
}
```
- **Tests** (Post-response script):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.access_token);
    pm.environment.set("refresh_token", response.refresh_token);
    pm.environment.set("user_id", response.user.id_usuario);
    console.log("✅ Login exitoso - Token guardado");
}
```

### **2. Register**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
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
- **Tests**:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    console.log("✅ Usuario registrado:", response.user.username);
    console.log("📝 Password:", response.user.password);
}
```

### **3. Get Current User**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/auth/me`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const user = pm.response.json();
    console.log("👤 Usuario actual:", user.username);
    console.log("🏷️ Perfil:", user.perfil.nombre);
}
```

### **4. Logout**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/auth/logout`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    pm.environment.set("access_token", "");
    pm.environment.set("refresh_token", "");
    console.log("✅ Logout exitoso - Tokens limpiados");
}
```

---

## 🛒 **ENDPOINTS DEL CARRITO**

### **1. Get Cart**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/cart`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const cart = pm.response.json();
    console.log("🛒 Items en carrito:", cart.total_items);
    console.log("💰 Total:", cart.total);
}
```

### **2. Add to Cart**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/cart`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "id_producto": 32,
  "cantidad": 2
}
```
- **Tests**:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("cart_id", response.item.id_carrito);
    console.log("✅ Producto agregado al carrito");
    console.log("🆔 Cart ID:", response.item.id_carrito);
}
```

### **3. Update Cart Item**
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/cart/{{cart_id}}`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "cantidad": 5
}
```
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("✅ Cantidad actualizada:", response.item.cantidad);
}
```

### **4. Remove Cart Item**
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/cart/{{cart_id}}`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Item eliminado del carrito");
}
```

### **5. Confirm Purchase**
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/cart/confirm`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("✅ Compra confirmada");
    console.log("🆔 Venta ID:", response.venta.id_venta);
    console.log("💰 Total:", response.venta.total_venta);
}
```

### **6. Clear Cart**
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/cart/clear`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Carrito limpiado");
}
```

---

## 📦 **ENDPOINTS DE PRODUCTOS**

### **1. Get Products (Public)**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products`
- **Query Params** (opcional):
  - `page`: 1
  - `limit`: 10
  - `search`: "cepillo"
  - `category`: 1
  - `subcategory`: 1
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("📦 Productos encontrados:", response.total);
    console.log("📄 Página:", response.page);
}
```

### **2. Get Product by ID**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/products/32`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const product = pm.response.json();
    console.log("📦 Producto:", product.nombre);
    console.log("💰 Precio:", product.valor);
    console.log("📦 Stock:", product.stock);
}
```

### **3. Create Product (Admin/Publisher)**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
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
- **Tests**:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    console.log("✅ Producto creado:", response.product.nombre);
    console.log("🆔 ID:", response.product.id_producto);
}
```

### **4. Update Product (Admin/Publisher)**
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/products/32`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "nombre": "Producto Actualizado",
  "valor": 18000.00,
  "stock": 150
}
```
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Producto actualizado");
}
```

### **5. Delete Product (Admin/Publisher)**
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/products/32`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Producto eliminado");
}
```

---

## 📊 **ENDPOINTS DE REPORTES (Solo Admin)**

### **1. Get Sales Report**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/reports/sales`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcional):
  - `start_date`: "2025-01-01"
  - `end_date`: "2025-12-31"
  - `status`: "confirmed"
  - `search`: "maria"
  - `page`: 1
  - `limit`: 10
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("📊 Ventas encontradas:", response.total);
    console.log("📄 Página:", response.page);
}
```

### **2. Get Sales Summary**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/reports/sales/summary`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Query Params** (opcional):
  - `start_date`: "2025-01-01"
  - `end_date`: "2025-12-31"
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const summary = pm.response.json();
    console.log("💰 Total Ventas:", summary.total_sales);
    console.log("✅ Ventas Confirmadas:", summary.completed_sales);
    console.log("⏳ Ventas Pendientes:", summary.pending_sales);
    console.log("📊 Total Registros:", summary.total_records);
}
```

---

## 🏷️ **ENDPOINTS DE CATEGORÍAS**

### **1. Get Categories**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/categories`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const categories = pm.response.json();
    console.log("🏷️ Categorías encontradas:", categories.length);
}
```

### **2. Create Category (Solo Admin)**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/categories`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "nombre": "Nueva Categoría",
  "descripcion": "Descripción de la nueva categoría"
}
```
- **Tests**:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    console.log("✅ Categoría creada:", response.categoria.nombre);
}
```

### **3. Update Category (Solo Admin)**
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/categories/1`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "nombre": "Categoría Actualizada",
  "descripcion": "Nueva descripción"
}
```
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Categoría actualizada");
}
```

### **4. Delete Category (Solo Admin)**
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/categories/1`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Categoría eliminada");
}
```

---

## 💰 **ENDPOINTS DE IVA**

### **1. Get IVA Types**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/iva`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const ivaTypes = pm.response.json();
    console.log("💰 Tipos de IVA:", ivaTypes.length);
}
```

### **2. Create IVA Type (Solo Admin)**
- **Método**: `POST`
- **URL**: `{{base_url}}/api/iva`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "porcentaje": 5.00,
  "descripcion": "IVA Reducido"
}
```
- **Tests**:
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    console.log("✅ Tipo de IVA creado:", response.iva.descripcion);
}
```

### **3. Update IVA Type (Solo Admin)**
- **Método**: `PUT`
- **URL**: `{{base_url}}/api/iva/1`
- **Headers**: 
  - `Authorization: Bearer {{access_token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "porcentaje": 6.00,
  "descripcion": "IVA Reducido Actualizado"
}
```
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Tipo de IVA actualizado");
}
```

### **4. Delete IVA Type (Solo Admin)**
- **Método**: `DELETE`
- **URL**: `{{base_url}}/api/iva/1`
- **Headers**: `Authorization: Bearer {{access_token}}`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Tipo de IVA eliminado");
}
```

---

## 🔧 **ENDPOINTS DE UTILIDAD**

### **1. Health Check**
- **Método**: `GET`
- **URL**: `{{base_url}}/health`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    console.log("✅ Servidor funcionando correctamente");
}
```

### **2. Test Connection**
- **Método**: `GET`
- **URL**: `{{base_url}}/api/test-connection`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("✅ Backend funcionando:", response.message);
}
```

### **3. Root Endpoint**
- **Método**: `GET`
- **URL**: `{{base_url}}/`
- **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("🏠 Sistema:", response.message);
    console.log("📦 Versión:", response.version);
}
```

---

## 🧪 **TESTS AUTOMATIZADOS**

### **Pre-request Scripts**

#### **Para Endpoints que Requieren Autenticación**
```javascript
// Verificar si hay token
if (!pm.environment.get("access_token")) {
    console.log("⚠️ No hay token de acceso. Ejecutar login primero.");
}
```

#### **Para Endpoints de Admin**
```javascript
// Verificar si es admin
const token = pm.environment.get("access_token");
if (token) {
    // Decodificar token para verificar perfil
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.perfil !== "Administrador") {
        console.log("⚠️ Se requiere perfil de Administrador");
    }
}
```

### **Post-response Scripts**

#### **Manejo de Errores**
```javascript
if (pm.response.code >= 400) {
    console.log("❌ Error:", pm.response.code);
    console.log("📝 Mensaje:", pm.response.json().detail);
}
```

#### **Validación de Respuestas**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    
    // Validar estructura de respuesta
    if (response.hasOwnProperty('message')) {
        console.log("✅ Operación exitosa:", response.message);
    }
    
    // Validar datos requeridos
    if (response.hasOwnProperty('data')) {
        console.log("📊 Datos recibidos:", response.data.length || "N/A");
    }
}
```

---

## 🔄 **AUTOMATIZACIÓN CON NEWMAN**

### **Instalar Newman**
```bash
npm install -g newman
```

### **Ejecutar Colección**
```bash
# Ejecutar colección completa
newman run "Web Beatty API" -e "Web Beatty Local"

# Ejecutar con reporte HTML
newman run "Web Beatty API" -e "Web Beatty Local" --reporters html --reporter-html-export docs/reports/

# Ejecutar con reporte JSON
newman run "Web Beatty API" -e "Web Beatty Local" --reporters json --reporter-json-export docs/reports/results.json
```

### **Script de Automatización**
```bash
#!/bin/bash
# run_tests.sh

echo "🧪 Ejecutando tests de API..."

# Ejecutar tests
newman run "Web Beatty API" -e "Web Beatty Local" \
  --reporters cli,html,json \
  --reporter-html-export docs/reports/ \
  --reporter-json-export docs/reports/results.json

echo "✅ Tests completados. Revisar reportes en docs/reports/"
```

---

## 📊 **CREDENCIALES DE PRUEBA**

### **Usuarios Disponibles**

#### **Administrador**
```json
{
  "username": "admin@sistema.com",
  "password": "admin123",
  "profile": "Administrador"
}
```

#### **Publicador**
```json
{
  "username": "publicador@sistema.com",
  "password": "publicador123",
  "profile": "Publicador"
}
```

#### **Cliente**
```json
{
  "username": "maria.gomez@example.com",
  "password": "cliente123",
  "profile": "Cliente"
}
```

### **Productos de Prueba**
```json
{
  "id_producto": 32,
  "nombre": "Cepillo dental suave",
  "marca": "Oral-B",
  "valor": 5200.00,
  "stock": 70
}
```

---

## 🚨 **CÓDIGOS DE ERROR**

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

## 📋 **CHECKLIST DE TESTING**

### **Antes de Ejecutar Tests**
- [ ] Backend ejecutándose en puerto 8000
- [ ] Base de datos configurada y accesible
- [ ] Variables de entorno configuradas
- [ ] Environment de Postman configurado
- [ ] Colección importada

### **Tests Obligatorios**
- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas
- [ ] Obtener usuario actual
- [ ] Logout
- [ ] Agregar producto al carrito
- [ ] Obtener carrito
- [ ] Actualizar cantidad en carrito
- [ ] Eliminar item del carrito
- [ ] Confirmar compra
- [ ] Obtener productos (público)
- [ ] Obtener reportes (admin)
- [ ] Gestión de categorías (admin)
- [ ] Gestión de IVA (admin)

### **Tests de Seguridad**
- [ ] Acceso sin autenticación
- [ ] Acceso con token inválido
- [ ] Acceso con permisos insuficientes
- [ ] Validación de datos de entrada
- [ ] Manejo de errores

---

## 🔗 **ENLACES ÚTILES**

### **Documentación Interactiva**
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **Health Check:** `http://localhost:8000/health`

### **Recursos Adicionales**
- **Postman Docs:** https://learning.postman.com/
- **Newman Docs:** https://github.com/postmanlabs/newman
- **FastAPI Docs:** https://fastapi.tiangolo.com/

---

## 📞 **SOPORTE**

### **Problemas Comunes**

#### **Error: "No se puede conectar al backend"**
- Verificar que el backend esté ejecutándose en puerto 8000
- Verificar configuración de CORS
- Revisar logs del backend

#### **Error: "Token inválido"**
- Ejecutar login nuevamente
- Verificar que el token no haya expirado
- Revisar configuración de JWT

#### **Error: "CORS"**
- Verificar configuración de CORS en el backend
- Verificar que las URLs estén correctas
- Revisar configuración de headers

---

**Versión:** 1.0.0  
**Última actualización:** Septiembre 2025  
**Estado:** ✅ Completado y funcional  
**Desarrollado por:** Equipo Web Beatty

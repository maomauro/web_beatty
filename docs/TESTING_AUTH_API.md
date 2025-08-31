# 🔐 Testing de API de Autenticación - Web Beatty

## 📋 **Resumen**

Este documento describe el proceso completo de testing para la API de autenticación del Sistema Administrativo de Ventas Web Beatty.

## 🎯 **Endpoints Implementados**

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/auth/login` | `POST` | Iniciar sesión | No requerida |
| `/api/auth/me` | `GET` | Obtener usuario actual | JWT Bearer |
| `/api/auth/refresh` | `POST` | Renovar token de acceso | No requerida |
| `/api/auth/logout` | `POST` | Cerrar sesión | No requerida |

## 🔧 **Configuración de Postman**

### **Environment: "Web Beatty Local"**

#### **Variables Configuradas:**
- `base_url`: `http://localhost:8000`
- `access_token`: (se llena automáticamente)
- `refresh_token`: (se llena automáticamente)

## 📝 **Proceso de Testing**

### **1. Configuración Inicial**

#### **1.1 Crear Environment**
1. En Postman, click en el ícono de engranaje (⚙️)
2. Seleccionar "Environments"
3. Click en "+" para crear nuevo environment
4. Nombrar: "Web Beatty Local"
5. Agregar variables:
   - `base_url`: `http://localhost:8000`
   - `access_token`: (dejar vacío)
   - `refresh_token`: (dejar vacío)

#### **1.2 Configurar Scripts Post-response**
Cada request tiene scripts para manejar automáticamente los tokens.

### **2. Testing del Endpoint `/login`**

#### **2.1 Configuración del Request**
- **URL:** `{{base_url}}/api/auth/login`
- **Método:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "admin@sistema.com",
    "password": "admin123"
  }
  ```

#### **2.2 Script Post-response**
```javascript
// Script para guardar tokens en Web Beatty Local
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    
    // Guardar tokens en el environment Web Beatty Local
    pm.environment.set("access_token", responseJson.access_token);
    pm.environment.set("refresh_token", responseJson.refresh_token);
    
    console.log("✅ Tokens guardados en Web Beatty Local");
    console.log("🔑 Access Token:", responseJson.access_token.substring(0, 50) + "...");
    console.log("🔄 Refresh Token:", responseJson.refresh_token.substring(0, 50) + "...");
    
    // Verificar que se guardaron correctamente
    const savedAccessToken = pm.environment.get("access_token");
    const savedRefreshToken = pm.environment.get("refresh_token");
    
    console.log("✅ Verificación - Access Token guardado:", savedAccessToken ? "SÍ" : "NO");
    console.log("✅ Verificación - Refresh Token guardado:", savedRefreshToken ? "SÍ" : "NO");
    
} else {
    console.log("❌ Error en login:", pm.response.text());
}
```

#### **2.3 Respuesta Esperada**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": 6,
    "email": "admin@sistema.com",
    "profile": "Administrador",
    "person_name": "Admin Sistema",
    "person_data": {
      "id_persona": 6,
      "tipo_identificacion": "CC",
      "identificacion": "123456789",
      "genero": "MASCULINO",
      "nombre": "Admin",
      "apellido": "Sistema",
      "direccion": "Oficina Principal",
      "telefono": "3000000000",
      "email": "admin@sistema.com"
    }
  }
}
```

### **3. Testing del Endpoint `/me`**

#### **3.1 Configuración del Request**
- **URL:** `{{base_url}}/api/auth/me`
- **Método:** `GET`
- **Headers:**
  - `Authorization: Bearer {{access_token}}`

#### **3.2 Respuesta Esperada**
```json
{
  "user_id": 6,
  "email": "admin@sistema.com",
  "profile": "Administrador",
  "person_name": "Admin Sistema",
  "person_data": {
    "id_persona": 6,
    "tipo_identificacion": "CC",
    "identificacion": "123456789",
    "genero": "MASCULINO",
    "nombre": "Admin",
    "apellido": "Sistema",
    "direccion": "Oficina Principal",
    "telefono": "3000000000",
    "email": "admin@sistema.com"
  }
}
```

### **4. Testing del Endpoint `/refresh`**

#### **4.1 Configuración del Request**
- **URL:** `{{base_url}}/api/auth/refresh`
- **Método:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "refresh_token": "{{refresh_token}}"
  }
  ```

#### **4.2 Script Post-response**
```javascript
// Script para actualizar access_token automáticamente
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    
    // Actualizar solo el access_token
    pm.environment.set("access_token", responseJson.access_token);
    
    console.log("✅ Access Token renovado automáticamente");
    console.log("🔑 Nuevo Access Token:", responseJson.access_token.substring(0, 50) + "...");
    
    // Verificar que se guardó correctamente
    const savedAccessToken = pm.environment.get("access_token");
    console.log("✅ Verificación - Access Token actualizado:", savedAccessToken ? "SÍ" : "NO");
    
} else {
    console.log("❌ Error al renovar token:", pm.response.text());
}
```

#### **4.3 Respuesta Esperada**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### **5. Testing del Endpoint `/logout`**

#### **5.1 Configuración del Request**
- **URL:** `{{base_url}}/api/auth/logout`
- **Método:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "refresh_token": "{{refresh_token}}"
  }
  ```

#### **5.2 Script Post-response**
```javascript
// Script para limpiar tokens al hacer logout
if (pm.response.code === 200) {
    // Limpiar tokens
    pm.environment.set("access_token", "");
    pm.environment.set("refresh_token", "");
    
    console.log("✅ Tokens limpiados automáticamente");
    console.log("🧹 Access Token: LIMPIADO");
    console.log("🔄 Refresh Token: LIMPIADO");
    
    // Verificar que se limpiaron correctamente
    const savedAccessToken = pm.environment.get("access_token");
    const savedRefreshToken = pm.environment.get("refresh_token");
    
    console.log("✅ Verificación - Access Token limpiado:", savedAccessToken === "" ? "SÍ" : "NO");
    console.log("✅ Verificación - Refresh Token limpiado:", savedRefreshToken === "" ? "SÍ" : "NO");
    
} else {
    console.log("❌ Error en logout:", pm.response.text());
}
```

#### **5.3 Respuesta Esperada**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

## 🔄 **Flujo Completo de Testing**

### **Secuencia Recomendada:**
1. **Login** → Genera tokens y los guarda automáticamente
2. **Me** → Verifica que el access_token funciona
3. **Refresh** → Renueva el access_token automáticamente
4. **Me** → Verifica que el nuevo token funciona
5. **Logout** → Limpia todos los tokens automáticamente

### **Verificaciones:**
- ✅ Tokens se guardan automáticamente después del login
- ✅ Variables de entorno se actualizan correctamente
- ✅ Access token se renueva automáticamente
- ✅ Tokens se limpian automáticamente después del logout
- ✅ Todos los endpoints devuelven códigos de estado correctos

## ⚠️ **Casos de Error**

### **Credenciales Incorrectas**
```json
{
  "detail": "Credenciales incorrectas"
}
```

### **Token Expirado**
```json
{
  "detail": "Token expirado"
}
```

### **Token Inválido**
```json
{
  "detail": "Token inválido"
}
```

### **Refresh Token Inválido**
```json
{
  "detail": "Refresh token inválido"
}
```

## 🎯 **Configuración de Tokens**

### **Duración de Tokens:**
- **Access Token:** 30 minutos
- **Refresh Token:** 7 días

### **Almacenamiento:**
- **Access Token:** En variables de entorno de Postman
- **Refresh Token:** En variables de entorno de Postman + memoria del servidor

## 📊 **Métricas de Testing**

### **Tiempos de Respuesta Esperados:**
- **Login:** < 500ms
- **Me:** < 200ms
- **Refresh:** < 300ms
- **Logout:** < 200ms

### **Códigos de Estado:**
- **200:** Operación exitosa
- **401:** No autorizado (token inválido/expirado)
- **422:** Error de validación
- **500:** Error interno del servidor

## ✅ **Checklist de Testing**

- [ ] Environment "Web Beatty Local" configurado
- [ ] Variables de entorno creadas
- [ ] Scripts Post-response implementados
- [ ] Endpoint `/login` funciona correctamente
- [ ] Endpoint `/me` funciona correctamente
- [ ] Endpoint `/refresh` funciona correctamente
- [ ] Endpoint `/logout` funciona correctamente
- [ ] Tokens se guardan automáticamente
- [ ] Tokens se renuevan automáticamente
- [ ] Tokens se limpian automáticamente
- [ ] Casos de error funcionan correctamente
- [ ] Documentación actualizada

---

**Fecha de Testing:** 30 de Agosto, 2025  
**Versión de API:** 1.0.0  
**Tester:** Sistema de Testing Automatizado

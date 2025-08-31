# 🧪 Testing de Integración Frontend-Backend - Web Beatty

## 📋 **Resumen**

Este documento describe el proceso de testing para validar la integración completa entre el frontend (React) y el backend (FastAPI) del Sistema Administrativo de Ventas Web Beatty.

## 🎯 **Objetivos del Testing**

- ✅ Validar autenticación completa (login/logout)
- ✅ Verificar redirección automática según perfil
- ✅ Probar protección de rutas
- ✅ Confirmar manejo de tokens JWT
- ✅ Validar renovación automática de tokens
- ✅ Verificar manejo de errores

## 🚀 **Preparación del Entorno**

### **1. Backend (FastAPI)**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Verificar que esté ejecutándose en:** `http://localhost:8000`

### **2. Frontend (React)**
```bash
cd frontend
npm run dev
```

**Verificar que esté ejecutándose en:** `http://localhost:5173`

## 🧪 **Casos de Prueba**

### **Caso 1: Login de Administrador**

**Pasos:**
1. Abrir `http://localhost:5173`
2. Hacer clic en "Iniciar Sesión"
3. Ingresar credenciales:
   - **Email:** `admin@sistema.com`
   - **Password:** `admin123`
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Redirección automática a `/admin`
- ✅ Header administrativo visible (azul)
- ✅ Información del usuario mostrada
- ✅ Acceso a todas las rutas administrativas

### **Caso 2: Login de Publicador**

**Pasos:**
1. Abrir `http://localhost:5173`
2. Hacer clic en "Iniciar Sesión"
3. Ingresar credenciales:
   - **Email:** `publicador@sistema.com`
   - **Password:** `publicador123`
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Redirección automática a `/publisher`
- ✅ Header del publicador visible (verde)
- ✅ Información del usuario mostrada
- ✅ Acceso a todas las rutas del publicador

### **Caso 3: Login de Cliente**

**Pasos:**
1. Abrir `http://localhost:5173`
2. Hacer clic en "Iniciar Sesión"
3. Ingresar credenciales:
   - **Email:** `cliente@example.com`
   - **Password:** `cliente123`
4. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Redirección automática a `/` (página principal)
- ✅ Header normal visible
- ✅ Acceso a funcionalidades de cliente

### **Caso 4: Protección de Rutas**

**Pasos:**
1. Sin estar autenticado, intentar acceder a:
   - `http://localhost:5173/admin`
   - `http://localhost:5173/publisher`
   - `http://localhost:5173/profile`

**Resultado Esperado:**
- ✅ Redirección automática a `/` (página principal)
- ✅ No acceso a rutas protegidas

### **Caso 5: Acceso Incorrecto a Rutas**

**Pasos:**
1. Hacer login como Administrador
2. Intentar acceder a `http://localhost:5173/publisher`
3. Hacer login como Publicador
4. Intentar acceder a `http://localhost:5173/admin`

**Resultado Esperado:**
- ✅ Redirección automática a la ruta correcta según el perfil
- ✅ No acceso a rutas de otros perfiles

### **Caso 6: Logout**

**Pasos:**
1. Hacer login con cualquier perfil
2. Hacer clic en el botón de logout (ícono de salida)
3. Confirmar logout

**Resultado Esperado:**
- ✅ Logout exitoso
- ✅ Redirección automática a `/`
- ✅ Limpieza de tokens
- ✅ No acceso a rutas protegidas

### **Caso 7: Renovación Automática de Tokens**

**Pasos:**
1. Hacer login
2. Esperar que el token expire (configurado para 15 minutos)
3. Intentar realizar una acción que requiera autenticación

**Resultado Esperado:**
- ✅ Renovación automática del token
- ✅ Continuidad de la sesión
- ✅ No interrupción del usuario

### **Caso 8: Manejo de Errores**

**Pasos:**
1. Intentar login con credenciales incorrectas
2. Intentar acceder a rutas protegidas sin autenticación
3. Simular error de red

**Resultado Esperado:**
- ✅ Mensajes de error claros
- ✅ No crashes de la aplicación
- ✅ Manejo graceful de errores

## 🔧 **Credenciales de Prueba**

### **Administrador**
- **Email:** `admin@sistema.com`
- **Password:** `admin123`
- **Perfil:** Administrador

### **Publicador**
- **Email:** `publicador@sistema.com`
- **Password:** `publicador123`
- **Perfil:** Publicador

### **Cliente**
- **Email:** `cliente@example.com`
- **Password:** `cliente123`
- **Perfil:** Cliente

## 📊 **Checklist de Testing**

### **Autenticación**
- [ ] Login exitoso con credenciales correctas
- [ ] Login fallido con credenciales incorrectas
- [ ] Logout exitoso
- [ ] Limpieza de datos de sesión

### **Redirección**
- [ ] Redirección automática post-login según perfil
- [ ] Redirección automática post-logout
- [ ] Redirección desde rutas protegidas sin autenticación

### **Protección de Rutas**
- [ ] Rutas administrativas protegidas
- [ ] Rutas del publicador protegidas
- [ ] Ruta de perfil protegida
- [ ] Acceso correcto según perfil

### **Manejo de Tokens**
- [ ] Almacenamiento correcto de tokens
- [ ] Renovación automática de tokens
- [ ] Limpieza de tokens en logout
- [ ] Manejo de tokens expirados

### **UI/UX**
- [ ] Header correcto según perfil
- [ ] Información del usuario visible
- [ ] Botones de navegación funcionando
- [ ] Estados de loading apropiados

### **Errores**
- [ ] Mensajes de error claros
- [ ] No crashes de aplicación
- [ ] Manejo de errores de red
- [ ] Validación de formularios

## 🐛 **Solución de Problemas**

### **Error: "No se puede conectar al backend"**
- Verificar que el backend esté ejecutándose en puerto 8000
- Verificar configuración de CORS
- Revisar logs del backend

### **Error: "Token inválido"**
- Verificar que las credenciales sean correctas
- Revisar configuración de JWT en el backend
- Verificar que el token no haya expirado

### **Error: "Ruta no encontrada"**
- Verificar que las rutas estén correctamente configuradas
- Revisar configuración de React Router
- Verificar que los componentes estén importados

### **Error: "CORS"**
- Verificar configuración de CORS en el backend
- Verificar que las URLs estén correctas
- Revisar configuración de headers

## 📝 **Notas Importantes**

1. **Tokens JWT:** Configurados para expirar en 15 minutos
2. **Refresh Tokens:** Almacenados en memoria del servidor
3. **CORS:** Configurado para permitir `http://localhost:5173`
4. **Base URL:** `http://localhost:8000/api`

## ✅ **Criterios de Éxito**

El testing se considera exitoso cuando:
- ✅ Todos los casos de prueba pasan
- ✅ No hay errores en consola
- ✅ La experiencia de usuario es fluida
- ✅ La seguridad está funcionando correctamente
- ✅ La integración frontend-backend es estable

---

**Fecha de Testing:** [Fecha actual]
**Versión:** 1.0.0
**Estado:** ✅ Completado

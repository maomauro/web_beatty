# 📤 Exportar Colección Postman - Web Beatty

## **🎯 Objetivo**

Este documento explica cómo exportar e importar la colección de Postman del proyecto Web Beatty para compartir con evaluadores o equipo de desarrollo.

---

## **📤 Pasos para Exportar**

### **1. Exportar Colección Principal**

**Desde Postman Desktop:**
1. Abre Postman
2. Ve a la colección "Web Beatty APIs"
3. Haz clic derecho → "Export"
4. Formato: **Collection v2.1**
5. Guarda como: `Web_Beatty_APIs.postman_collection.json`

### **2. Exportar Variables de Entorno**

**Exportar Environment:**
1. Ve a "Environments" en el sidebar
2. Selecciona "Web Beatty Local"
3. Haz clic en "Export"
4. Guarda como: `Web_Beatty_Local.postman_environment.json`

### **3. Crear Archivo de Configuración**

**Crear `postman_setup.md`:**
```markdown
# Configuración Postman - Web Beatty

## Importar Colección
1. Abrir Postman
2. Import → Upload Files
3. Seleccionar: Web_Beatty_APIs.postman_collection.json
4. Importar

## Importar Variables de Entorno
1. Import → Upload Files
2. Seleccionar: Web_Beatty_Local.postman_environment.json
3. Importar
4. Seleccionar environment "Web Beatty Local"

## Configurar Backend
1. Asegurar que backend esté ejecutándose en puerto 8000
2. Verificar URL: http://localhost:8000
3. Probar endpoint: GET /health
```

---

## **📁 Estructura de Archivos**

```
📁 Postman_Export/
├── 📄 Web_Beatty_APIs.postman_collection.json
├── 📄 Web_Beatty_Local.postman_environment.json
├── 📄 README_Postman.md
├── 📄 setup_instructions.md
└── 📄 quick_start.md
```

---

## **🔧 Archivos de Configuración**

### **1. README_Postman.md**
```markdown
# Web Beatty - Colección Postman

## Descripción
Colección completa de APIs del sistema Web Beatty para testing y desarrollo.

## Endpoints Incluidos
- 🔐 Autenticación (4 endpoints)
- 🛒 Carrito de Compras (6 endpoints)
- 📦 Productos (5 endpoints)
- 📊 Reportes (2 endpoints)
- 🏷️ Categorías (4 endpoints)
- 💰 IVA (4 endpoints)

## Configuración Rápida
1. Importar colección
2. Importar variables de entorno
3. Seleccionar environment "Web Beatty Local"
4. Ejecutar backend en puerto 8000
5. ¡Listo para usar!
```

### **2. setup_instructions.md**
```markdown
# Instrucciones de Configuración

## Prerrequisitos
- Postman instalado
- Backend ejecutándose en puerto 8000
- Node.js y npm (para frontend)

## Pasos de Configuración

### 1. Importar Colección
- Abrir Postman
- File → Import
- Seleccionar: Web_Beatty_APIs.postman_collection.json
- Importar

### 2. Importar Variables de Entorno
- File → Import
- Seleccionar: Web_Beatty_Local.postman_environment.json
- Importar
- Seleccionar environment "Web Beatty Local"

### 3. Verificar Configuración
- URL Base: {{base_url}} (debe ser http://localhost:8000)
- Probar endpoint: GET /health
- Debe retornar: {"status": "healthy"}

### 4. Autenticación
- Usar endpoint: POST /api/auth/login
- Credenciales demo incluidas en colección
- Token se guarda automáticamente

## Variables de Entorno
- base_url: http://localhost:8000
- api_url: http://localhost:8000/api
- token: (se llena automáticamente al hacer login)
```

### **3. quick_start.md**
```markdown
# Quick Start - Postman Web Beatty

## 🚀 Configuración en 5 Minutos

### Paso 1: Importar
1. Abrir Postman
2. Import → Upload Files
3. Seleccionar ambos archivos .json
4. Importar

### Paso 2: Configurar
1. Seleccionar environment "Web Beatty Local"
2. Verificar base_url: http://localhost:8000

### Paso 3: Probar
1. Ejecutar: GET /health
2. Debe retornar: {"status": "healthy"}

### Paso 4: Autenticarse
1. Ejecutar: POST /api/auth/login
2. Usar credenciales demo:
   - username: admin@sistema.com
   - password: admin123

### Paso 5: Explorar
- Navegar por las carpetas de la colección
- Probar diferentes endpoints
- Verificar respuestas

## 🎯 Endpoints Principales
- **Health Check**: GET /health
- **Login**: POST /api/auth/login
- **Productos**: GET /api/products
- **Carrito**: GET /api/cart
- **Reportes**: GET /api/reports/sales

## 🔧 Troubleshooting
- Error 404: Verificar que backend esté ejecutándose
- Error CORS: Verificar configuración del backend
- Error auth: Verificar credenciales o token
```

---

## **📤 Comandos para Crear Archivos**

### **Crear Carpeta de Exportación:**
```bash
# Crear carpeta para exportación
mkdir Postman_Export
cd Postman_Export

# Crear archivos de documentación
touch README_Postman.md
touch setup_instructions.md
touch quick_start.md
```

### **Estructura Final:**
```
📁 Postman_Export/
├── 📄 Web_Beatty_APIs.postman_collection.json
├── 📄 Web_Beatty_Local.postman_environment.json
├── 📄 README_Postman.md
├── 📄 setup_instructions.md
├── 📄 quick_start.md
└── 📄 CHANGELOG.md
```

---

## **🎯 Incluir en el Proyecto**

### **Opción 1: Carpeta Separada**
```
📁 web_beatty/
├── 📁 backend/
├── 📁 frontend/
├── 📁 docs/
└── 📁 postman_export/
    ├── 📄 Web_Beatty_APIs.postman_collection.json
    ├── 📄 Web_Beatty_Local.postman_environment.json
    └── 📄 README.md
```

### **Opción 2: En la Documentación**
```
📁 docs/
├── 📄 APIS_BACKEND.md
├── 📄 GUIA_POSTMAN.md
└── 📁 postman/
    ├── 📄 Web_Beatty_APIs.postman_collection.json
    └── 📄 Web_Beatty_Local.postman_environment.json
```

---

## **📋 Checklist de Exportación**

- ✅ Exportar colección principal
- ✅ Exportar variables de entorno
- ✅ Crear archivos de documentación
- ✅ Verificar que todos los endpoints estén incluidos
- ✅ Probar importación en Postman limpio
- ✅ Verificar que las variables funcionen
- ✅ Crear README con instrucciones
- ✅ Incluir credenciales de prueba

---

## **🚀 Comandos Rápidos**

```bash
# Crear estructura de exportación
mkdir -p docs/postman
cd docs/postman

# Crear archivos de documentación
echo "# Postman Export - Web Beatty" > README.md
echo "# Setup Instructions" > setup.md
echo "# Quick Start" > quick_start.md

# Verificar estructura
ls -la
```

---

**Nota:** Después de exportar, prueba importar la colección en un Postman limpio para verificar que todo funcione correctamente.

# Base de Datos - Sistema de Ventas

## 📁 Estructura de Carpetas

```
database/
├── backup/
│   └── web_beatty.sql          # Script completo de backup
├── data/
│   ├── seed_data.sql           # Datos iniciales del sistema
│   └── test_data.sql           # Datos de prueba
├── migrations/                  # Migraciones manuales (si es necesario)
└── README.md                   # Este archivo
```

## 🔄 Migraciones con Alembic

### Configuración
Las migraciones están configuradas en el backend con Alembic:

```bash
cd backend
alembic upgrade head    # Aplicar todas las migraciones
alembic downgrade -1    # Revertir última migración
alembic current         # Ver migración actual
alembic history         # Ver historial de migraciones
```

### Migraciones Disponibles

1. **001_initial_schema.py** - Creación de todas las tablas
2. **002_seed_data.py** - Datos iniciales del sistema

## 📊 Datos del Sistema

### Seed Data (Datos Iniciales)
- **Perfiles**: Administrador, Publicador, Cliente
- **IVA**: 4 tipos (0%, 4%, 10%, 19%)
- **Categorías**: Aseo personal
- **Subcategorías**: 7 subcategorías
- **Usuarios del sistema**: admin/admin123, publicador/publi123

### Test Data (Datos de Prueba)
- **Clientes**: 5 clientes de prueba
- **Productos**: 30 productos de aseo personal

## 🚀 Comandos de Inicialización

### Opción 1: Usar Migraciones (Recomendado)
```bash
# En el directorio backend
alembic upgrade head
```

### Opción 2: Usar Script Completo
```bash
# Ejecutar directamente en MySQL
mysql -u root -p < database/backup/web_beatty.sql
```

### Opción 3: Usar Scripts Separados
```bash
# Primero seed data
mysql -u root -p web_beatty < database/data/seed_data.sql

# Luego test data (opcional)
mysql -u root -p web_beatty < database/data/test_data.sql
```

## 🔧 Configuración de Base de Datos

### Variables de Entorno
```env
DATABASE_URL=mysql://usuario:password@localhost:3306/web_beatty
```

### Crear Base de Datos
```sql
CREATE DATABASE web_beatty 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_spanish2_ci;
```

## 📋 Credenciales de Acceso

### Usuarios del Sistema
- **Administrador**: `admin` / `admin123`
- **Publicador**: `publicador` / `publi123`

### Clientes de Prueba
- `juan.perez` / `1001234567`
- `maria.gomez` / `1007654321`
- `carlos.rodriguez` / `940112233`
- `laura.martinez` / `1019988776`
- `andres.ramirez` / `AV2023456`

## 🔍 Verificar Instalación

```sql
-- Verificar tablas creadas
SHOW TABLES;

-- Verificar datos de perfiles
SELECT * FROM tbl_perfil;

-- Verificar productos
SELECT COUNT(*) as total_productos FROM tbl_producto;

-- Verificar usuarios
SELECT u.username, p.nombre, pf.nombre as perfil 
FROM tbl_usuario u 
JOIN tbl_persona p ON u.id_persona = p.id_persona 
JOIN tbl_perfil pf ON u.id_perfil = pf.id_perfil;
```

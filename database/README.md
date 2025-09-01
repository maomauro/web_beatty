# Base de Datos - Sistema Web Beatty

## 📋 Descripción

Este directorio contiene todos los archivos relacionados con la base de datos del sistema Web Beatty, incluyendo migraciones, backups y scripts de inicialización.

## 📁 Estructura del Directorio

```
database/
├── migrations/           # Migraciones de la base de datos
│   └── 001_initial_schema.sql
├── backup/              # Backups de la base de datos
│   └── web_beatty.sql
├── data/               # Datos adicionales (si aplica)
├── init_database.sql   # Script de inicialización
├── update_database.sh  # Script de actualización
└── README.md          # Este archivo
```

## 🚀 Instalación Rápida

### Opción 1: Script Automático (Recomendado)

```bash
# Desde la raíz del proyecto
./database/update_database.sh
```

### Opción 2: Manual

```bash
# 1. Crear la base de datos
mysql -u root -e "CREATE DATABASE IF NOT EXISTS web_beatty CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci;"

# 2. Ejecutar la migración
mysql -u root web_beatty < database/migrations/001_initial_schema.sql
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción | Registros |
|-------|-------------|-----------|
| `tbl_perfil` | Perfiles de usuario | 3 |
| `tbl_persona` | Datos personales | 12 |
| `tbl_usuario` | Usuarios del sistema | 12 |
| `tbl_categoria` | Categorías de productos | 1 |
| `tbl_subcategoria` | Subcategorías | 7 |
| `tbl_iva` | Tipos de IVA | 4 |
| `tbl_producto` | Productos del catálogo | 30 |
| `tbl_venta` | Registro de ventas | 5 |
| `tbl_carrito` | Items del carrito | 9 |
| `tbl_parametro` | Parámetros del sistema | 1 |

### Relaciones Clave

- **Usuario** → **Persona** (1:1)
- **Usuario** → **Perfil** (N:1)
- **Producto** → **Categoría** (N:1)
- **Producto** → **Subcategoría** (N:1)
- **Producto** → **IVA** (N:1)
- **Venta** → **Usuario** (N:1)
- **Carrito** → **Venta** (N:1)
- **Carrito** → **Usuario** (N:1)
- **Carrito** → **Producto** (N:1)

## 👥 Usuarios del Sistema

### Administradores
- **admin@sistema.com** / `admin123`
  - Perfil: Administrador
  - Acceso completo al sistema

### Publicadores
- **publicador@sistema.com** / `publicador123`
  - Perfil: Publicador
  - Gestión de productos

### Clientes de Prueba
- **maria.gomez@example.com** / `cliente123`
  - Perfil: Cliente
  - Datos de prueba

### Clientes Reales
- **maomauro.c@gmail.com** / `80236633`
  - Perfil: Cliente
  - Datos reales

## 🛍️ Datos de Productos

### Categoría: Aseo Personal
- **30 productos** activos
- **7 subcategorías**:
  - Accesorios de baño
  - Afeitada
  - Desodorantes
  - Desodorantes para pies
  - Jabones y geles
  - Repelentes
  - Toallitas y pañitos

### Marcas Incluidas
- Colgate, Oral-B, Listerine
- Gillette, Bic, Nivea
- Rexona, AXE, Old Spice
- Dove, Palmolive, Eucerin
- Head & Shoulders, Pantene
- Y más...

## 📈 Datos de Ventas

### Ventas Existentes
- **5 ventas** registradas
- **2 ventas confirmadas** ($112,796 total)
- **3 ventas pendientes** ($77,764 total)
- **9 items** en carrito

### Estados de Venta
- `CONFIRMADO`: Venta completada
- `PENDIENTE`: Venta en proceso
- `CANCELADO`: Venta cancelada

## 🔧 Configuración

### Configuración de Base de Datos
- **Host**: localhost
- **Usuario**: root
- **Base de datos**: web_beatty
- **Charset**: utf8mb4
- **Collation**: utf8mb4_spanish2_ci

### Parámetros del Sistema
- **Inactividad**: 3 días (para carritos abandonados)

## 📝 Migraciones

### Migración 001: Esquema Inicial
- **Archivo**: `001_initial_schema.sql`
- **Descripción**: Estructura completa de la base de datos
- **Datos**: Todos los datos iniciales incluidos
- **Estado**: ✅ Completada

## 🔄 Actualizaciones

### Cómo Actualizar la Base de Datos

1. **Backup** (recomendado):
   ```bash
   mysqldump -u root web_beatty > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Ejecutar migración**:
   ```bash
   ./database/update_database.sh
   ```

### Restaurar desde Backup

```bash
mysql -u root web_beatty < database/backup/web_beatty.sql
```

## 🚨 Notas Importantes

1. **Passwords**: Todos los passwords están hasheados con bcrypt
2. **Datos Reales**: Incluye datos reales de usuarios registrados
3. **Ventas**: Contiene ventas reales con estados variados
4. **Productos**: Catálogo completo con imágenes JSON
5. **IVA**: Sistema de IVA colombiano (0%, 4%, 10%, 19%)

## 🆘 Solución de Problemas

### Error de Conexión
```bash
# Verificar que MySQL esté corriendo
sudo service mysql status

# Verificar credenciales
mysql -u root -p
```

### Error de Permisos
```bash
# Dar permisos de ejecución al script
chmod +x database/update_database.sh
```

### Error de Charset
```bash
# Verificar configuración de MySQL
mysql -u root -e "SHOW VARIABLES LIKE 'character_set%';"
```

## 📞 Soporte

Para problemas con la base de datos:
1. Revisar logs de MySQL
2. Verificar permisos de usuario
3. Confirmar que la base de datos existe
4. Ejecutar el script de verificación

---

**Última actualización**: Septiembre 2025
**Versión**: 1.0.0

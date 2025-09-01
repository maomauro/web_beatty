#!/bin/bash

# =====================================================
# Script de actualización de base de datos
# Sistema Web Beatty
# =====================================================

echo "🔄 Actualizando base de datos web_beatty..."

# Configuración de la base de datos
DB_HOST="localhost"
DB_USER="root"
DB_PASS=""
DB_NAME="web_beatty"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si MySQL está disponible
if ! command -v mysql &> /dev/null; then
    show_error "MySQL no está instalado o no está en el PATH"
    exit 1
fi

# Crear base de datos si no existe
show_message "Creando base de datos si no existe..."
mysql -h "$DB_HOST" -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci;" 2>/dev/null

# Ejecutar la migración
show_message "Ejecutando migración inicial..."
if mysql -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" < database/migrations/001_initial_schema.sql; then
    show_message "Migración ejecutada correctamente"
else
    show_error "Error ejecutando la migración"
    exit 1
fi

# Verificar la instalación
show_message "Verificando la instalación..."

# Contar registros en las tablas principales
echo "📊 Estadísticas de la base de datos:"
mysql -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" -e "
SELECT 'Perfiles' as tabla, COUNT(*) as total FROM tbl_perfil
UNION ALL
SELECT 'Personas', COUNT(*) FROM tbl_persona
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM tbl_usuario
UNION ALL
SELECT 'Productos', COUNT(*) FROM tbl_producto
UNION ALL
SELECT 'Ventas', COUNT(*) FROM tbl_venta
UNION ALL
SELECT 'Carritos', COUNT(*) FROM tbl_carrito;
" 2>/dev/null

# Mostrar usuarios principales
echo ""
echo "👥 Usuarios principales:"
mysql -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" -e "
SELECT 
    CONCAT(p.nombre, ' ', p.apellido) as nombre,
    p.email,
    pf.nombre as perfil
FROM tbl_persona p
JOIN tbl_usuario u ON p.id_persona = u.id_persona
JOIN tbl_perfil pf ON u.id_perfil = pf.id_perfil
WHERE p.email IN ('admin@sistema.com', 'publicador@sistema.com', 'maria.gomez@example.com')
ORDER BY pf.nombre;
" 2>/dev/null

show_message "Base de datos actualizada correctamente!"
echo ""
echo "🔑 Credenciales de acceso:"
echo "   • Admin: admin@sistema.com / admin123"
echo "   • Publicador: publicador@sistema.com / publicador123"
echo "   • Cliente: maria.gomez@example.com / cliente123"
echo "   • Cliente Real: maomauro.c@gmail.com / 80236633"
echo ""
echo "🚀 ¡Listo para usar!"

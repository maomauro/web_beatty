-- =====================================================
-- Script de inicialización de la base de datos web_beatty
-- Este script ejecuta la migración inicial
-- =====================================================

-- Ejecutar la migración inicial
SOURCE database/migrations/001_initial_schema.sql;

-- =====================================================
-- Verificación de la instalación
-- =====================================================

-- Mostrar las tablas creadas
SHOW TABLES;

-- Verificar datos de usuarios principales
SELECT 
    p.nombre, 
    p.apellido, 
    p.email, 
    pf.nombre as perfil
FROM tbl_persona p
JOIN tbl_usuario u ON p.id_persona = u.id_persona
JOIN tbl_perfil pf ON u.id_perfil = pf.id_perfil
WHERE p.email IN ('admin@sistema.com', 'publicador@sistema.com', 'maria.gomez@example.com')
ORDER BY pf.nombre;

-- Verificar productos disponibles
SELECT 
    codigo,
    marca,
    nombre,
    valor,
    stock,
    estado
FROM tbl_producto 
WHERE estado = 'ACTIVO'
LIMIT 5;

-- Verificar ventas existentes
SELECT 
    v.id_venta,
    CONCAT(p.nombre, ' ', p.apellido) as cliente,
    v.fecha_venta,
    v.total_venta,
    v.estado
FROM tbl_venta v
JOIN tbl_usuario u ON v.id_usuario = u.id_usuario
JOIN tbl_persona p ON u.id_persona = p.id_persona
ORDER BY v.fecha_venta DESC;

-- =====================================================
-- CREDENCIALES DE ACCESO
-- =====================================================

/*
USUARIOS PRINCIPALES:

1. ADMINISTRADOR:
   - Email: admin@sistema.com
   - Password: admin123
   - Perfil: Administrador

2. PUBLICADOR:
   - Email: publicador@sistema.com
   - Password: publicador123
   - Perfil: Publicador

3. CLIENTE DE PRUEBA:
   - Email: maria.gomez@example.com
   - Password: cliente123
   - Perfil: Cliente

4. CLIENTE REAL:
   - Email: maomauro.c@gmail.com
   - Password: 80236633 (número de cédula)
   - Perfil: Cliente
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

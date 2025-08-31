-- =====================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- Sistema Administrativo de Ventas - Web Beatty
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `web_beatty` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_spanish2_ci;

-- Usar la base de datos
USE `web_beatty`;

-- =====================================================
-- CREACIÓN DE TABLAS
-- =====================================================

-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS `tbl_perfil` (
  `id_perfil` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_perfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de IVA
CREATE TABLE IF NOT EXISTS `tbl_iva` (
  `id_iva` int NOT NULL AUTO_INCREMENT,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_iva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS `tbl_categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de parámetros
CREATE TABLE IF NOT EXISTS `tbl_parametro` (
  `id_parametro` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `valor` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_parametro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de personas
CREATE TABLE IF NOT EXISTS `tbl_persona` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `tipo_identificacion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `identificacion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `genero` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL COMMENT 'FEMENINO, MASCULINO',
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `identificacion` (`identificacion`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `tbl_persona_index_0` (`tipo_identificacion`,`identificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de subcategorías
CREATE TABLE IF NOT EXISTS `tbl_subcategoria` (
  `id_subcategoria` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_subcategoria`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `tbl_subcategoria_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categoria` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `tbl_usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_persona` int DEFAULT NULL,
  `id_perfil` int DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `tbl_usuario_index_1` (`id_persona`,`id_perfil`),
  KEY `id_perfil` (`id_perfil`),
  CONSTRAINT `tbl_usuario_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `tbl_persona` (`id_persona`),
  CONSTRAINT `tbl_usuario_ibfk_2` FOREIGN KEY (`id_perfil`) REFERENCES `tbl_perfil` (`id_perfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS `tbl_producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `id_subcategoria` int DEFAULT NULL,
  `id_iva` int DEFAULT NULL,
  `codigo` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `marca` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `fecha_caducidad` date DEFAULT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT 'ACTIVO',
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `tbl_producto_index_2` (`estado`),
  KEY `id_subcategoria` (`id_subcategoria`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_iva` (`id_iva`),
  CONSTRAINT `tbl_producto_ibfk_1` FOREIGN KEY (`id_subcategoria`) REFERENCES `tbl_subcategoria` (`id_subcategoria`),
  CONSTRAINT `tbl_producto_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categoria` (`id_categoria`),
  CONSTRAINT `tbl_producto_ibfk_3` FOREIGN KEY (`id_iva`) REFERENCES `tbl_iva` (`id_iva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS `tbl_venta` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_venta` datetime DEFAULT (now()),
  `total_venta` decimal(12,2) DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_venta`),
  KEY `tbl_venta_index_4` (`estado`),
  CONSTRAINT `tbl_venta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Tabla de carrito
CREATE TABLE IF NOT EXISTS `tbl_carrito` (
  `id_carrito` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `fecha_carrito` datetime DEFAULT (now()),
  `cantidad` int DEFAULT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  `iva_calculado` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT 'ACTIVO',
  `fecha_abandono` datetime DEFAULT NULL,
  PRIMARY KEY (`id_carrito`),
  KEY `tbl_carrito_index_3` (`estado`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `tbl_carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario` (`id_usuario`),
  CONSTRAINT `tbl_carrito_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `tbl_venta` (`id_venta`),
  CONSTRAINT `tbl_carrito_ibfk_3` FOREIGN KEY (`id_producto`) REFERENCES `tbl_producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar perfiles
INSERT INTO `tbl_perfil` (`id_perfil`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', 'El administrador podrá crear y editar perfiles, personas, categorías, subcategorías, IVA y parámetros'),
(2, 'Publicador', 'El publicador podrá crear y editar productos'),
(3, 'Cliente', 'El cliente podrá registrarse, crear carrito de compras y realizar compras');

-- Insertar tipos de IVA
INSERT INTO `tbl_iva` (`id_iva`, `porcentaje`, `descripcion`) VALUES
(1, 0.00, 'Sin IVA'),
(2, 4.00, 'IVA Mínimo'),
(3, 10.00, 'IVA Medio'),
(4, 19.00, 'IVA Máximo');

-- Insertar categorías
INSERT INTO `tbl_categoria` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Aseo personal', 'Productos relacionados con el cuidado e higiene personal');

-- Insertar subcategorías
INSERT INTO `tbl_subcategoria` (`id_subcategoria`, `id_categoria`, `nombre`, `descripcion`) VALUES
(1, 1, 'accesorios-baño', 'Accesorios para el baño'),
(2, 1, 'afeitada', 'Productos para la afeitada'),
(3, 1, 'desodorantes', 'Desodorantes corporales'),
(4, 1, 'desodorantes-pies', 'Desodorantes para pies'),
(5, 1, 'jabones-geles', 'Jabones y geles de baño'),
(6, 1, 'repelentes', 'Productos repelentes'),
(7, 1, 'toallitas-pañitos', 'Toallitas y pañitos húmedos');

-- Insertar parámetros
INSERT INTO `tbl_parametro` (`id_parametro`, `descripcion`, `valor`) VALUES
(1, 'inactividad', '3');

-- Insertar usuarios del sistema
INSERT INTO `tbl_persona` (`id_persona`, `tipo_identificacion`, `identificacion`, `genero`, `nombre`, `apellido`, `direccion`, `telefono`, `email`) VALUES
(6, 'CC', '123456789', 'MASCULINO', 'Admin', 'Sistema', 'Oficina Principal', '3000000000', 'admin@sistema.com'),
(7, 'CC', '987654321', 'FEMENINO', 'Publicador', 'Sistema', 'Oficina Principal', '3111111111', 'publicador@sistema.com');

INSERT INTO `tbl_usuario` (`id_usuario`, `id_persona`, `id_perfil`, `username`, `password`) VALUES
(6, 6, 1, 'admin', 'admin123'),
(7, 7, 2, 'publicador', 'publi123');

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

SELECT 'Base de datos inicializada correctamente' as mensaje;
SELECT COUNT(*) as total_perfiles FROM tbl_perfil;
SELECT COUNT(*) as total_iva FROM tbl_iva;
SELECT COUNT(*) as total_categorias FROM tbl_categoria;
SELECT COUNT(*) as total_subcategorias FROM tbl_subcategoria;
SELECT COUNT(*) as total_usuarios FROM tbl_usuario;

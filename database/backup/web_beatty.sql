-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para web_beatty
DROP DATABASE IF EXISTS `web_beatty`;
CREATE DATABASE IF NOT EXISTS `web_beatty` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `web_beatty`;

-- Volcando estructura para tabla web_beatty.tbl_carrito
DROP TABLE IF EXISTS `tbl_carrito`;
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

-- Volcando datos para la tabla web_beatty.tbl_carrito: ~0 rows (aproximadamente)
DELETE FROM `tbl_carrito`;

-- Volcando estructura para tabla web_beatty.tbl_categoria
DROP TABLE IF EXISTS `tbl_categoria`;
CREATE TABLE IF NOT EXISTS `tbl_categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_categoria: ~1 rows (aproximadamente)
DELETE FROM `tbl_categoria`;
INSERT INTO `tbl_categoria` (`id_categoria`, `nombre`, `descripcion`) VALUES
	(1, 'Aseo personal', 'Productos relacionados con el cuidado e higiene personal');

-- Volcando estructura para tabla web_beatty.tbl_iva
DROP TABLE IF EXISTS `tbl_iva`;
CREATE TABLE IF NOT EXISTS `tbl_iva` (
  `id_iva` int NOT NULL AUTO_INCREMENT,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_iva`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_iva: ~4 rows (aproximadamente)
DELETE FROM `tbl_iva`;
INSERT INTO `tbl_iva` (`id_iva`, `porcentaje`, `descripcion`) VALUES
	(1, 0.00, 'Sin IVA'),
	(2, 4.00, 'IVA Mínimo'),
	(3, 10.00, 'IVA Medio'),
	(4, 19.00, 'IVA Máximo');

-- Volcando estructura para tabla web_beatty.tbl_parametro
DROP TABLE IF EXISTS `tbl_parametro`;
CREATE TABLE IF NOT EXISTS `tbl_parametro` (
  `id_parametro` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `valor` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_parametro`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_parametro: ~1 rows (aproximadamente)
DELETE FROM `tbl_parametro`;
INSERT INTO `tbl_parametro` (`id_parametro`, `descripcion`, `valor`) VALUES
	(1, 'inactividad', '3');

-- Volcando estructura para tabla web_beatty.tbl_perfil
DROP TABLE IF EXISTS `tbl_perfil`;
CREATE TABLE IF NOT EXISTS `tbl_perfil` (
  `id_perfil` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_perfil: ~3 rows (aproximadamente)
DELETE FROM `tbl_perfil`;
INSERT INTO `tbl_perfil` (`id_perfil`, `nombre`, `descripcion`) VALUES
	(1, 'Administrador', 'El administrador podrá crear y editar perfiles, personas, categorías, subcategorías, IVA y parámetros'),
	(2, 'Publicador', 'El publicador podrá crear y editar productos'),
	(3, 'Cliente', 'El cliente podrá registrarse, crear carrito de compras y realizar compras');

-- Volcando estructura para tabla web_beatty.tbl_persona
DROP TABLE IF EXISTS `tbl_persona`;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_persona: ~7 rows (aproximadamente)
DELETE FROM `tbl_persona`;
INSERT INTO `tbl_persona` (`id_persona`, `tipo_identificacion`, `identificacion`, `genero`, `nombre`, `apellido`, `direccion`, `telefono`, `email`) VALUES
	(1, 'CC', '1001234567', 'MASCULINO', 'Juan', 'Pérez', 'Calle 10 # 25-30', '3001234567', 'juan.perez@example.com'),
	(2, 'CC', '1007654321', 'FEMENINO', 'María', 'Gómez', 'Carrera 15 # 40-22', '3017654321', 'maria.gomez@example.com'),
	(3, 'TI', '940112233', 'MASCULINO', 'Carlos', 'Rodríguez', 'Av. Siempre Viva 123', '3023344556', 'carlos.rodriguez@example.com'),
	(4, 'CC', '1019988776', 'FEMENINO', 'Laura', 'Martínez', 'Calle 45 # 20-15', '3109988776', 'laura.martinez@example.com'),
	(5, 'CE', 'AV2023456', 'MASCULINO', 'Andrés', 'Ramírez', 'Transversal 8 # 60-14', '3112023456', 'andres.ramirez@example.com'),
	(6, 'CC', '123456789', 'MASCULINO', 'Admin', 'Sistema', 'Oficina Principal', '3000000000', 'admin@sistema.com'),
	(7, 'CC', '987654321', 'FEMENINO', 'Publicador', 'Sistema', 'Oficina Principal', '3111111111', 'publicador@sistema.com');

-- Volcando estructura para tabla web_beatty.tbl_producto
DROP TABLE IF EXISTS `tbl_producto`;
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_producto: ~30 rows (aproximadamente)
DELETE FROM `tbl_producto`;
INSERT INTO `tbl_producto` (`id_producto`, `id_categoria`, `id_subcategoria`, `id_iva`, `codigo`, `marca`, `nombre`, `fecha_caducidad`, `imagen`, `valor`, `stock`, `estado`) VALUES
	(31, 1, 1, 4, 'PROD-001', 'Colgate', 'Cepillo de dientes clásico', '2027-12-31', 'cepillo1.jpg', 4500.00, 100, 'ACTIVO'),
	(32, 1, 1, 4, 'PROD-002', 'Oral-B', 'Cepillo dental suave', '2027-10-15', 'cepillo2.jpg', 5200.00, 80, 'ACTIVO'),
	(33, 1, 1, 4, 'PROD-003', 'Listerine', 'Enjuague bucal Fresh Mint 250ml', '2026-09-01', 'enjuague1.jpg', 8900.00, 60, 'ACTIVO'),
	(34, 1, 1, 3, 'PROD-004', 'Sensodyne', 'Cepillo dental encías sensibles', '2028-01-20', 'cepillo3.jpg', 6800.00, 90, 'ACTIVO'),
	(35, 1, 2, 4, 'PROD-005', 'Gillette', 'Máquina de afeitar desechable x3', '2026-08-30', 'afeitadora1.jpg', 12500.00, 200, 'ACTIVO'),
	(36, 1, 2, 4, 'PROD-006', 'Bic', 'Máquina de afeitar Sensitive', '2026-05-20', 'afeitadora2.jpg', 11000.00, 150, 'ACTIVO'),
	(37, 1, 2, 3, 'PROD-007', 'Nivea Men', 'Espuma de afeitar 200ml', '2026-12-31', 'espuma1.jpg', 13500.00, 75, 'ACTIVO'),
	(38, 1, 2, 4, 'PROD-008', 'Barber Pro', 'After Shave Bálsamo 150ml', '2027-09-15', 'aftershave1.jpg', 15900.00, 50, 'ACTIVO'),
	(39, 1, 3, 4, 'PROD-009', 'Rexona', 'Desodorante en barra Fresh', '2026-05-15', 'desodorante1.jpg', 8900.00, 150, 'ACTIVO'),
	(40, 1, 3, 4, 'PROD-010', 'Nivea', 'Desodorante Roll-On Invisible', '2027-01-01', 'desodorante2.jpg', 9600.00, 200, 'ACTIVO'),
	(41, 1, 3, 4, 'PROD-011', 'AXE', 'Desodorante en spray Dark Temptation', '2026-07-07', 'desodorante3.jpg', 12500.00, 90, 'ACTIVO'),
	(42, 1, 3, 3, 'PROD-012', 'Old Spice', 'Desodorante clásico 150ml', '2027-08-10', 'desodorante4.jpg', 11200.00, 120, 'ACTIVO'),
	(43, 1, 4, 4, 'PROD-013', 'Odor-Eaters', 'Desodorante en polvo para pies', '2026-11-10', 'desodorantepies1.jpg', 9500.00, 80, 'ACTIVO'),
	(44, 1, 4, 4, 'PROD-014', 'Dr. Scholl', 'Spray desodorante para pies', '2027-03-03', 'desodorantepies2.jpg', 11200.00, 50, 'ACTIVO'),
	(45, 1, 4, 3, 'PROD-015', 'Tenys Pé', 'Talco desodorante antifúngico 100g', '2026-04-04', 'desodorantepies3.jpg', 8700.00, 70, 'ACTIVO'),
	(46, 1, 4, 4, 'PROD-016', 'Rexona', 'Desodorante pies spray 150ml', '2027-12-01', 'desodorantepies4.jpg', 10800.00, 65, 'ACTIVO'),
	(47, 1, 5, 4, 'PROD-017', 'Dove', 'Jabón líquido antibacterial 400ml', '2027-01-01', 'jabon1.jpg', 11500.00, 120, 'ACTIVO'),
	(48, 1, 5, 4, 'PROD-018', 'Palmolive', 'Jabón en barra neutro x3', '2027-05-12', 'jabon2.jpg', 7800.00, 90, 'ACTIVO'),
	(49, 1, 5, 4, 'PROD-019', 'Eucerin', 'Gel de baño piel sensible 250ml', '2027-04-04', 'gel1.jpg', 24500.00, 60, 'ACTIVO'),
	(50, 1, 5, 3, 'PROD-020', 'Johnson’s', 'Jabón líquido para bebé 300ml', '2028-02-02', 'jabon3.jpg', 9800.00, 140, 'ACTIVO'),
	(51, 1, 6, 4, 'PROD-021', 'OFF!', 'Repelente en spray familiar 200ml', '2026-03-20', 'repelente1.jpg', 18500.00, 60, 'ACTIVO'),
	(52, 1, 6, 3, 'PROD-022', 'Nopikex', 'Repelente en crema 120ml', '2027-06-06', 'repelente2.jpg', 16200.00, 80, 'ACTIVO'),
	(53, 1, 6, 4, 'PROD-023', 'XPEL', 'Repelente natural con citronela 150ml', '2026-09-09', 'repelente3.jpg', 14800.00, 55, 'ACTIVO'),
	(54, 1, 6, 1, 'PROD-024', 'Baby OFF!', 'Repelente para niños 100ml', '2028-05-05', 'repelente4.jpg', 17500.00, 40, 'ACTIVO'),
	(55, 1, 7, 4, 'PROD-025', 'Head & Shoulders', 'Shampoo anticaspa 400ml', '2027-03-15', 'shampoo1.jpg', 18500.00, 200, 'ACTIVO'),
	(56, 1, 7, 4, 'PROD-026', 'Pantene', 'Shampoo hidratación profunda 350ml', '2027-09-20', 'shampoo2.jpg', 17200.00, 180, 'ACTIVO'),
	(57, 1, 7, 4, 'PROD-027', 'Sedal', 'Shampoo rizos definidos 300ml', '2028-01-10', 'shampoo3.jpg', 15000.00, 160, 'ACTIVO'),
	(58, 1, 7, 3, 'PROD-028', 'Eucerin', 'Shampoo dermo-capilar 250ml', '2026-08-08', 'shampoo4.jpg', 28500.00, 90, 'ACTIVO'),
	(59, 1, 7, 4, 'PROD-029', 'Herbal Essences', 'Shampoo con aloe vera 400ml', '2028-06-06', 'shampoo5.jpg', 19500.00, 130, 'ACTIVO'),
	(60, 1, 7, 4, 'PROD-030', 'Johnson’s Baby', 'Shampoo suave 300ml', '2028-04-04', 'shampoo6.jpg', 12500.00, 170, 'ACTIVO');

-- Volcando estructura para tabla web_beatty.tbl_subcategoria
DROP TABLE IF EXISTS `tbl_subcategoria`;
CREATE TABLE IF NOT EXISTS `tbl_subcategoria` (
  `id_subcategoria` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_subcategoria`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `tbl_subcategoria_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_subcategoria: ~7 rows (aproximadamente)
DELETE FROM `tbl_subcategoria`;
INSERT INTO `tbl_subcategoria` (`id_subcategoria`, `id_categoria`, `nombre`, `descripcion`) VALUES
	(1, 1, 'accesorios-baño', 'Accesorios para el baño'),
	(2, 1, 'afeitada', 'Productos para la afeitada'),
	(3, 1, 'desodorantes', 'Desodorantes corporales'),
	(4, 1, 'desodorantes-pies', 'Desodorantes para pies'),
	(5, 1, 'jabones-geles', 'Jabones y geles de baño'),
	(6, 1, 'repelentes', 'Productos repelentes'),
	(7, 1, 'toallitas-pañitos', 'Toallitas y pañitos húmedos');

-- Volcando estructura para tabla web_beatty.tbl_usuario
DROP TABLE IF EXISTS `tbl_usuario`;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_usuario: ~7 rows (aproximadamente)
DELETE FROM `tbl_usuario`;
INSERT INTO `tbl_usuario` (`id_usuario`, `id_persona`, `id_perfil`, `username`, `password`) VALUES
	(1, 1, 3, 'juan.perez', '1001234567'),
	(2, 2, 3, 'maria.gomez', '1007654321'),
	(3, 3, 3, 'carlos.rodriguez', '940112233'),
	(4, 4, 3, 'laura.martinez', '1019988776'),
	(5, 5, 3, 'andres.ramirez', 'AV2023456'),
	(6, 6, 1, 'admin', 'admin123'),
	(7, 7, 2, 'publicador', 'publi123');

-- Volcando estructura para tabla web_beatty.tbl_venta
DROP TABLE IF EXISTS `tbl_venta`;
CREATE TABLE IF NOT EXISTS `tbl_venta` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_venta` datetime DEFAULT (now()),
  `total_venta` decimal(12,2) DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_venta`),
  KEY `tbl_venta_index_4` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Volcando datos para la tabla web_beatty.tbl_venta: ~0 rows (aproximadamente)
DELETE FROM `tbl_venta`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

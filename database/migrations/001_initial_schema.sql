-- =====================================================
-- Migración inicial de la base de datos web_beatty
-- Basada en el backup web_beatty.sql
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `web_beatty` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci;

USE `web_beatty`;

-- =====================================================
-- TABLA: tbl_perfil
-- =====================================================
DROP TABLE IF EXISTS `tbl_perfil`;
CREATE TABLE `tbl_perfil` (
  `id_perfil` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_perfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de perfiles
INSERT INTO `tbl_perfil` (`id_perfil`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', 'El administrador podrá crear y editar perfiles, personas, categorías, subcategorías, IVA y parámetros'),
(2, 'Publicador', 'El publicador podrá crear y editar productos'),
(3, 'Cliente', 'El cliente podrá registrarse, crear carrito de compras y realizar compras');

-- =====================================================
-- TABLA: tbl_persona
-- =====================================================
DROP TABLE IF EXISTS `tbl_persona`;
CREATE TABLE `tbl_persona` (
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

-- Datos iniciales de personas
INSERT INTO `tbl_persona` (`id_persona`, `tipo_identificacion`, `identificacion`, `genero`, `nombre`, `apellido`, `direccion`, `telefono`, `email`) VALUES
(1, 'CC', '1001234567', 'MASCULINO', 'Juan', 'Pérez', 'Calle 10 # 25-30', '3001234567', 'juan.perez@example.com'),
(2, 'CC', '1007654321', 'FEMENINO', 'María', 'Gómez', 'Carrera 15 # 40-22', '3017654321', 'maria.gomez@example.com'),
(3, 'TI', '940112233', 'MASCULINO', 'Carlos', 'Rodríguez', 'Av. Siempre Viva 123', '3023344556', 'carlos.rodriguez@example.com'),
(4, 'CC', '1019988776', 'FEMENINO', 'Laura', 'Martínez', 'Calle 45 # 20-15', '3109988776', 'laura.martinez@example.com'),
(5, 'CE', 'AV2023456', 'MASCULINO', 'Andrés', 'Ramírez', 'Transversal 8 # 60-14', '3112023456', 'andres.ramirez@example.com'),
(6, 'CC', '123456789', 'MASCULINO', 'Admin', 'Sistema', 'Oficina Principal', '3000000000', 'admin@sistema.com'),
(7, 'CC', '987654321', 'FEMENINO', 'Publicador', 'Sistema', 'Oficina Principal', '3111111111', 'publicador@sistema.com'),
(8, 'CC', '1234567890', 'FEMENINO', 'Ana', 'García', 'Calle 123 #45-67, Bogotá', '3001234567', 'ana.garcia@example.com'),
(9, 'CC', '1111111111', 'FEMENINO', 'Test', 'User', 'Test Address', '3001111111', 'test.user@example.com'),
(10, 'CEDULA', '80236633', 'MASCULINO', 'MAURICIO', 'CIFUENTES ACOSTA', 'TV 65 # 59 - 35 SUR / CONJUNTO RESIDENCIAL SANTA ELENA RESERVADO / T2 - APTO 113', '+573118886917', 'maomauro.c@gmail.com'),
(11, 'CEDULA', '12345678', 'MASCULINO', 'EDGAR', 'CIFUENTES', 'TV 65 # 59 - 35 SUR / CONJUNTO RESIDENCIAL SANTA ELENA RESERVADO / T2 - APTO 113', '+573118886917', 'mao@gmail.com'),
(12, 'CEDULA', '111222333', 'MASCULINO', 'JUAN', 'PAEZ', 'CALLE 3 23 4', '3131234567', 'juan@gmail.com');

-- =====================================================
-- TABLA: tbl_usuario
-- =====================================================
DROP TABLE IF EXISTS `tbl_usuario`;
CREATE TABLE `tbl_usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_persona` int DEFAULT NULL,
  `id_perfil` int DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `tbl_usuario_index_1` (`id_persona`,`id_perfil`),
  KEY `id_perfil` (`id_perfil`),
  CONSTRAINT `tbl_usuario_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `tbl_persona` (`id_persona`),
  CONSTRAINT `tbl_usuario_ibfk_2` FOREIGN KEY (`id_perfil`) REFERENCES `tbl_perfil` (`id_perfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de usuarios (passwords hasheados con bcrypt)
INSERT INTO `tbl_usuario` (`id_usuario`, `id_persona`, `id_perfil`, `username`, `password`) VALUES
(1, 1, 3, 'juan.perez@example.com', '$2b$12$K4hYBQCp66/06GZAUfpeN.haQ0.2rx2MEXaMYUMOJF2xwLtA3CV2u'),
(2, 2, 3, 'maria.gomez@example.com', '$2b$12$K4hYBQCp66/06GZAUfpeN.haQ0.2rx2MEXaMYUMOJF2xwLtA3CV2u'),
(3, 3, 3, 'carlos.rodriguez@example.com', '$2b$12$K4hYBQCp66/06GZAUfpeN.haQ0.2rx2MEXaMYUMOJF2xwLtA3CV2u'),
(4, 4, 3, 'laura.martinez@example.com', '$2b$12$K4hYBQCp66/06GZAUfpeN.haQ0.2rx2MEXaMYUMOJF2xwLtA3CV2u'),
(5, 5, 3, 'andres.ramirez@example.com', '$2b$12$K4hYBQCp66/06GZAUfpeN.haQ0.2rx2MEXaMYUMOJF2xwLtA3CV2u'),
(6, 6, 1, 'admin@sistema.com', '$2b$12$OlJFEFtYK7/sat2clEeMKuVYIFJ1xmP/o6hMXVeqXi7i57k98Ow1u'),
(7, 7, 2, 'publicador@sistema.com', '$2b$12$xxdJJRosiEUauonttl7XD.ms7EYQShR5n7JH.8I1f7v67qFvBP8sS'),
(8, 8, 3, 'ana.garcia@example.com', '$2b$12$LBn/yx07mpdcT/mmi/xVu.v.5gvceN9QfCkXBnCqk1DNHbcGa68Sy'),
(9, 9, 3, 'test.user@example.com', '$2b$12$XKPZxVS5PCF.SDYSH.dr4ej9HDEz8hkUzmPkAgUXrJPQxe5THNcPy'),
(10, 10, 3, 'maomauro.c@gmail.com', '$2b$12$pUn9LznmdFPdmf6a07Y0..wQi13fPNCyVuwNk2oxCxDc.nQQifWNu'),
(11, 11, 3, 'mao@gmail.com', '$2b$12$Ru/GSGe381ZXuejKqadm1eKCDAol.bh17NQc1n0EIVZ24KUdO.ufO'),
(12, 12, 3, 'juan@gmail.com', '$2b$12$UUZlo/MNtVIV1/gWLTiyC.7l.p6YNQs4B9T/tS8wUBPWfnabSnPmm');

-- =====================================================
-- TABLA: tbl_categoria
-- =====================================================
DROP TABLE IF EXISTS `tbl_categoria`;
CREATE TABLE `tbl_categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de categorías
INSERT INTO `tbl_categoria` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Aseo personal', 'Productos relacionados con el cuidado e higiene personal');

-- =====================================================
-- TABLA: tbl_subcategoria
-- =====================================================
DROP TABLE IF EXISTS `tbl_subcategoria`;
CREATE TABLE `tbl_subcategoria` (
  `id_subcategoria` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_subcategoria`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `tbl_subcategoria_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categoria` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de subcategorías
INSERT INTO `tbl_subcategoria` (`id_subcategoria`, `id_categoria`, `nombre`, `descripcion`) VALUES
(1, 1, 'accesorios-baño', 'Accesorios para el baño'),
(2, 1, 'afeitada', 'Productos para la afeitada'),
(3, 1, 'desodorantes', 'Desodorantes corporales'),
(4, 1, 'desodorantes-pies', 'Desodorantes para pies'),
(5, 1, 'jabones-geles', 'Jabones y geles de baño'),
(6, 1, 'repelentes', 'Productos repelentes'),
(7, 1, 'toallitas-pañitos', 'Toallitas y pañitos húmedos');

-- =====================================================
-- TABLA: tbl_iva
-- =====================================================
DROP TABLE IF EXISTS `tbl_iva`;
CREATE TABLE `tbl_iva` (
  `id_iva` int NOT NULL AUTO_INCREMENT,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_iva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de IVA
INSERT INTO `tbl_iva` (`id_iva`, `porcentaje`, `descripcion`) VALUES
(1, 0.00, 'Sin IVA'),
(2, 4.00, 'IVA Mínimo'),
(3, 10.00, 'IVA Medio'),
(4, 19.00, 'IVA Máximo');

-- =====================================================
-- TABLA: tbl_producto
-- =====================================================
DROP TABLE IF EXISTS `tbl_producto`;
CREATE TABLE `tbl_producto` (
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

-- Datos iniciales de productos
INSERT INTO `tbl_producto` (`id_producto`, `id_categoria`, `id_subcategoria`, `id_iva`, `codigo`, `marca`, `nombre`, `fecha_caducidad`, `imagen`, `valor`, `stock`, `estado`) VALUES
(31, 1, 1, 4, 'PROD-001', 'Colgate', 'Cepillo de dientes clásico', '2027-12-31', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 4500.00, 100, 'ACTIVO'),
(32, 1, 1, 4, 'PROD-002', 'Oral-B', 'Cepillo dental suave', '2027-10-15', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 5200.00, 70, 'ACTIVO'),
(33, 1, 1, 4, 'PROD-003', 'Listerine', 'Enjuague bucal Fresh Mint 250ml', '2026-09-01', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 8900.00, 60, 'ACTIVO'),
(34, 1, 1, 3, 'PROD-004', 'Sensodyne', 'Cepillo dental encías sensibles', '2028-01-20', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 6800.00, 89, 'ACTIVO'),
(35, 1, 2, 1, 'PROD-005', 'Gillette', 'Máquina de afeitar desechable x3', '2026-08-30', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 12500.00, 199, 'ACTIVO'),
(36, 1, 2, 4, 'PROD-006', 'Bic', 'Máquina de afeitar Sensitive', '2026-05-20', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 11000.00, 150, 'ACTIVO'),
(37, 1, 2, 3, 'PROD-007', 'Nivea Men', 'Espuma de afeitar 200ml', '2026-12-31', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 13500.00, 75, 'ACTIVO'),
(38, 1, 2, 4, 'PROD-008', 'Barber Pro', 'After Shave Bálsamo 150ml', '2027-09-15', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 15900.00, 50, 'ACTIVO'),
(39, 1, 3, 4, 'PROD-009', 'Rexona', 'Desodorante en barra Fresh', '2026-05-15', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 8900.00, 150, 'ACTIVO'),
(40, 1, 3, 1, 'PROD-010', 'Nivea', 'Desodorante Roll-On Invisible', '2027-01-01', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 9600.00, 200, 'ACTIVO'),
(41, 1, 3, 4, 'PROD-011', 'AXE', 'Desodorante en spray Dark Temptation', '2026-07-07', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 12500.00, 90, 'ACTIVO'),
(42, 1, 3, 3, 'PROD-012', 'Old Spice', 'Desodorante clásico 150ml', '2027-08-10', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 11200.00, 114, 'ACTIVO'),
(43, 1, 4, 4, 'PROD-013', 'Odor-Eaters', 'Desodorante en polvo para pies', '2026-11-10', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 9500.00, 80, 'ACTIVO'),
(44, 1, 4, 1, 'PROD-014', 'Dr. Scholl', 'Spray desodorante para pies', '2027-03-03', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 11200.00, 50, 'ACTIVO'),
(45, 1, 4, 3, 'PROD-015', 'Tenys Pé', 'Talco desodorante antifúngico 100g', '2026-04-04', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 8700.00, 70, 'ACTIVO'),
(46, 1, 4, 4, 'PROD-016', 'Rexona', 'Desodorante pies spray 150ml', '2027-12-01', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 10800.00, 65, 'ACTIVO'),
(47, 1, 5, 1, 'PROD-017', 'Dove', 'Jabón líquido antibacterial 400ml', '2027-01-01', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 11500.00, 120, 'ACTIVO'),
(48, 1, 5, 4, 'PROD-018', 'Palmolive', 'Jabón en barra neutro x3', '2027-05-12', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 7800.00, 90, 'ACTIVO'),
(49, 1, 5, 4, 'PROD-019', 'Eucerin', 'Gel de baño piel sensible 250ml', '2027-04-04', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 24500.00, 60, 'ACTIVO'),
(50, 1, 5, 3, 'PROD-020', 'Johnson\'s', 'Jabón líquido para bebé 300ml', '2028-02-02', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 9800.00, 140, 'ACTIVO'),
(51, 1, 6, 4, 'PROD-021', 'OFF!', 'Repelente en spray familiar 200ml', '2026-03-20', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 18500.00, 60, 'ACTIVO'),
(52, 1, 6, 3, 'PROD-022', 'Nopikex', 'Repelente en crema 120ml', '2027-06-06', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 16200.00, 80, 'ACTIVO'),
(53, 1, 6, 4, 'PROD-023', 'XPEL', 'Repelente natural con citronela 150ml', '2026-09-09', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 14800.00, 55, 'ACTIVO'),
(54, 1, 6, 1, 'PROD-024', 'Baby OFF!', 'Repelente para niños 100ml', '2028-05-05', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 17500.00, 40, 'ACTIVO'),
(55, 1, 7, 4, 'PROD-025', 'Head & Shoulders', 'Shampoo anticaspa 400ml', '2027-03-15', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 18500.00, 200, 'ACTIVO'),
(56, 1, 7, 1, 'PROD-026', 'Pantene', 'Shampoo hidratación profunda 350ml', '2027-09-20', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 17200.00, 180, 'ACTIVO'),
(57, 1, 7, 4, 'PROD-027', 'Sedal', 'Shampoo rizos definidos 300ml', '2028-01-10', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 15000.00, 160, 'ACTIVO'),
(58, 1, 7, 3, 'PROD-028', 'Eucerin', 'Shampoo dermo-capilar 250ml', '2026-08-08', '{"principal": "default-2.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 28500.00, 90, 'ACTIVO'),
(59, 1, 7, 1, 'PROD-029', 'Herbal Essences', 'Shampoo con aloe vera 400ml', '2028-06-06', '{"principal": "default-1.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 19500.00, 130, 'ACTIVO'),
(60, 1, 7, 4, 'PROD-030', 'Johnson\'s Baby', 'Shampoo suave 300ml', '2028-04-04', '{"principal": "default.webp", "galeria": ["default.webp","default-1.webp", "default-2.webp"]}', 12500.00, 170, 'ACTIVO');

-- =====================================================
-- TABLA: tbl_venta
-- =====================================================
DROP TABLE IF EXISTS `tbl_venta`;
CREATE TABLE `tbl_venta` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_venta` datetime DEFAULT (now()),
  `total_venta` decimal(12,2) DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_venta`),
  KEY `tbl_venta_index_4` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de ventas
INSERT INTO `tbl_venta` (`id_venta`, `id_usuario`, `fecha_venta`, `total_venta`, `estado`) VALUES
(1, 2, '2025-09-01 10:38:51', 74252.00, 'CONFIRMADO'),
(2, 3, '2025-08-31 17:11:59', 19200.00, 'PENDIENTE'),
(3, 4, '2025-08-31 17:13:03', 40000.00, 'PENDIENTE'),
(4, 11, '2025-09-01 11:57:21', 38544.00, 'CONFIRMADO'),
(5, 12, '2025-09-01 07:01:27', 18564.00, 'PENDIENTE');

-- =====================================================
-- TABLA: tbl_carrito
-- =====================================================
DROP TABLE IF EXISTS `tbl_carrito`;
CREATE TABLE `tbl_carrito` (
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

-- Datos iniciales de carrito
INSERT INTO `tbl_carrito` (`id_carrito`, `id_venta`, `id_usuario`, `id_producto`, `fecha_carrito`, `cantidad`, `valor_unitario`, `iva_calculado`, `subtotal`, `estado`, `fecha_abandono`) VALUES
(3, 2, 3, 40, '2025-08-31 17:11:59', 2, 9600.00, 3648.00, 22848.00, 'ACTIVO', NULL),
(5, 3, 4, 40, '2025-08-31 17:13:07', 3, 9600.00, 5472.00, 34272.00, 'ACTIVO', NULL),
(6, 3, 4, 44, '2025-08-31 17:13:07', 1, 11200.00, 2128.00, 13328.00, 'ACTIVO', NULL),
(123, 1, 2, 42, '2025-09-01 05:37:57', 3, 15000.00, 4500.00, 49500.00, 'VENTA', NULL),
(124, 1, 2, 32, '2025-09-01 05:37:57', 4, 5200.00, 3952.00, 24752.00, 'VENTA', NULL),
(126, 4, 11, 32, '2025-09-01 06:56:53', 3, 5200.00, 2964.00, 18564.00, 'VENTA', NULL),
(127, 4, 11, 35, '2025-09-01 06:56:53', 1, 12500.00, 0.00, 12500.00, 'VENTA', NULL),
(128, 4, 11, 34, '2025-09-01 06:56:53', 1, 6800.00, 680.00, 7480.00, 'VENTA', NULL),
(130, 5, 12, 32, '2025-09-01 07:01:40', 3, 5200.00, 2964.00, 18564.00, 'ACTIVO', NULL);

-- =====================================================
-- TABLA: tbl_parametro
-- =====================================================
DROP TABLE IF EXISTS `tbl_parametro`;
CREATE TABLE `tbl_parametro` (
  `id_parametro` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `valor` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`id_parametro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales de parámetros
INSERT INTO `tbl_parametro` (`id_parametro`, `descripcion`, `valor`) VALUES
(1, 'inactividad', '3');

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================

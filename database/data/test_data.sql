-- =====================================================
-- DATOS DE PRUEBA (TEST DATA)
-- =====================================================

-- Clientes de prueba
INSERT INTO `tbl_persona` (`id_persona`, `tipo_identificacion`, `identificacion`, `genero`, `nombre`, `apellido`, `direccion`, `telefono`, `email`) VALUES
(1, 'CC', '1001234567', 'MASCULINO', 'Juan', 'Pérez', 'Calle 10 # 25-30', '3001234567', 'juan.perez@example.com'),
(2, 'CC', '1007654321', 'FEMENINO', 'María', 'Gómez', 'Carrera 15 # 40-22', '3017654321', 'maria.gomez@example.com'),
(3, 'TI', '940112233', 'MASCULINO', 'Carlos', 'Rodríguez', 'Av. Siempre Viva 123', '3023344556', 'carlos.rodriguez@example.com'),
(4, 'CC', '1019988776', 'FEMENINO', 'Laura', 'Martínez', 'Calle 45 # 20-15', '3109988776', 'laura.martinez@example.com'),
(5, 'CE', 'AV2023456', 'MASCULINO', 'Andrés', 'Ramírez', 'Transversal 8 # 60-14', '3112023456', 'andres.ramirez@example.com');

-- Usuarios clientes
INSERT INTO `tbl_usuario` (`id_usuario`, `id_persona`, `id_perfil`, `username`, `password`) VALUES
(1, 1, 3, 'juan.perez', '1001234567'),
(2, 2, 3, 'maria.gomez', '1007654321'),
(3, 3, 3, 'carlos.rodriguez', '940112233'),
(4, 4, 3, 'laura.martinez', '1019988776'),
(5, 5, 3, 'andres.ramirez', 'AV2023456');

-- Productos de prueba
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
(50, 1, 5, 3, 'PROD-020', 'Johnson\'s', 'Jabón líquido para bebé 300ml', '2028-02-02', 'jabon3.jpg', 9800.00, 140, 'ACTIVO'),
(51, 1, 6, 4, 'PROD-021', 'OFF!', 'Repelente en spray familiar 200ml', '2026-03-20', 'repelente1.jpg', 18500.00, 60, 'ACTIVO'),
(52, 1, 6, 3, 'PROD-022', 'Nopikex', 'Repelente en crema 120ml', '2027-06-06', 'repelente2.jpg', 16200.00, 80, 'ACTIVO'),
(53, 1, 6, 4, 'PROD-023', 'XPEL', 'Repelente natural con citronela 150ml', '2026-09-09', 'repelente3.jpg', 14800.00, 55, 'ACTIVO'),
(54, 1, 6, 1, 'PROD-024', 'Baby OFF!', 'Repelente para niños 100ml', '2028-05-05', 'repelente4.jpg', 17500.00, 40, 'ACTIVO'),
(55, 1, 7, 4, 'PROD-025', 'Head & Shoulders', 'Shampoo anticaspa 400ml', '2027-03-15', 'shampoo1.jpg', 18500.00, 200, 'ACTIVO'),
(56, 1, 7, 4, 'PROD-026', 'Pantene', 'Shampoo hidratación profunda 350ml', '2027-09-20', 'shampoo2.jpg', 17200.00, 180, 'ACTIVO'),
(57, 1, 7, 4, 'PROD-027', 'Sedal', 'Shampoo rizos definidos 300ml', '2028-01-10', 'shampoo3.jpg', 15000.00, 160, 'ACTIVO'),
(58, 1, 7, 3, 'PROD-028', 'Eucerin', 'Shampoo dermo-capilar 250ml', '2026-08-08', 'shampoo4.jpg', 28500.00, 90, 'ACTIVO'),
(59, 1, 7, 4, 'PROD-029', 'Herbal Essences', 'Shampoo con aloe vera 400ml', '2028-06-06', 'shampoo5.jpg', 19500.00, 130, 'ACTIVO'),
(60, 1, 7, 4, 'PROD-030', 'Johnson\'s Baby', 'Shampoo suave 300ml', '2028-04-04', 'shampoo6.jpg', 12500.00, 170, 'ACTIVO');

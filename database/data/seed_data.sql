-- =====================================================
-- DATOS INICIALES DEL SISTEMA (SEED DATA)
-- =====================================================

-- Perfiles del sistema
INSERT INTO `tbl_perfil` (`id_perfil`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', 'El administrador podrá crear y editar perfiles, personas, categorías, subcategorías, IVA y parámetros'),
(2, 'Publicador', 'El publicador podrá crear y editar productos'),
(3, 'Cliente', 'El cliente podrá registrarse, crear carrito de compras y realizar compras');

-- Tipos de IVA
INSERT INTO `tbl_iva` (`id_iva`, `porcentaje`, `descripcion`) VALUES
(1, 0.00, 'Sin IVA'),
(2, 4.00, 'IVA Mínimo'),
(3, 10.00, 'IVA Medio'),
(4, 19.00, 'IVA Máximo');

-- Categorías
INSERT INTO `tbl_categoria` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Aseo personal', 'Productos relacionados con el cuidado e higiene personal');

-- Subcategorías
INSERT INTO `tbl_subcategoria` (`id_subcategoria`, `id_categoria`, `nombre`, `descripcion`) VALUES
(1, 1, 'accesorios-baño', 'Accesorios para el baño'),
(2, 1, 'afeitada', 'Productos para la afeitada'),
(3, 1, 'desodorantes', 'Desodorantes corporales'),
(4, 1, 'desodorantes-pies', 'Desodorantes para pies'),
(5, 1, 'jabones-geles', 'Jabones y geles de baño'),
(6, 1, 'repelentes', 'Productos repelentes'),
(7, 1, 'toallitas-pañitos', 'Toallitas y pañitos húmedos');

-- Parámetros del sistema
INSERT INTO `tbl_parametro` (`id_parametro`, `descripcion`, `valor`) VALUES
(1, 'inactividad', '3');

-- Usuarios del sistema (Administrador y Publicador)
INSERT INTO `tbl_persona` (`id_persona`, `tipo_identificacion`, `identificacion`, `genero`, `nombre`, `apellido`, `direccion`, `telefono`, `email`) VALUES
(6, 'CC', '123456789', 'MASCULINO', 'Admin', 'Sistema', 'Oficina Principal', '3000000000', 'admin@sistema.com'),
(7, 'CC', '987654321', 'FEMENINO', 'Publicador', 'Sistema', 'Oficina Principal', '3111111111', 'publicador@sistema.com');

INSERT INTO `tbl_usuario` (`id_usuario`, `id_persona`, `id_perfil`, `username`, `password`) VALUES
(6, 6, 1, 'admin', 'admin123'),
(7, 7, 2, 'publicador', 'publi123');

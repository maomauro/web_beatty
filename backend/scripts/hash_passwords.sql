-- Script SQL para hashear contraseñas en MySQL
-- NOTA: Este script requiere que bcrypt esté disponible en MySQL
-- Para usar este método, necesitarías instalar una extensión de bcrypt para MySQL

-- Verificar usuarios existentes
SELECT id_usuario, username, password FROM tbl_usuario;

-- Ejemplo de actualización (requiere función bcrypt en MySQL)
-- UPDATE tbl_usuario 
-- SET password = bcrypt_hash(password, 12) 
-- WHERE password NOT LIKE '$2b$%';

-- Verificar resultado
SELECT id_usuario, username, 
       CASE 
           WHEN password LIKE '$2b$%' THEN 'Hashed'
           ELSE 'Plain Text'
       END as password_status
FROM tbl_usuario;

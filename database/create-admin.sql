-- Script para crear usuario administrador manualmente
-- Ejecutar este script si el usuario admin no funciona

-- Primero, eliminar el usuario admin si existe
DELETE FROM usuarios WHERE usuario = 'admin';

-- Crear nuevo usuario admin
-- NOTA: Este hash es temporal. Después de iniciar el backend,
-- usa el endpoint /api/usuarios para crear usuarios con hash correcto
INSERT INTO usuarios (nombre, usuario, password, rol) VALUES 
('Administrador', 'admin', 'TEMP_PASSWORD', 'administrador');

-- Instrucciones:
-- 1. Primero inicia el backend con Docker
-- 2. Luego ejecuta este comando en tu terminal:
--    curl -X POST http://localhost:5000/api/setup-admin
-- 3. Esto creará el usuario admin con la contraseña correcta

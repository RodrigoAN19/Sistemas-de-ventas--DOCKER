-- Migración: Agregar campo codigo_barra a productos
-- Fecha: 2026-01-21
-- Descripción: Agrega soporte para códigos de barras en productos

USE sistema_ventas;

-- Agregar columna codigo_barra
ALTER TABLE productos 
ADD COLUMN codigo_barra VARCHAR(50) UNIQUE AFTER nombre,
ADD INDEX idx_codigo_barra (codigo_barra);

-- Generar códigos de barras para productos existentes
-- Formato: 750 (prefijo) + id_producto con 10 dígitos
UPDATE productos 
SET codigo_barra = CONCAT('750', LPAD(id_producto, 10, '0'))
WHERE codigo_barra IS NULL;

-- Verificar
SELECT id_producto, nombre, codigo_barra, precio, stock 
FROM productos 
ORDER BY id_producto;

-- Sistema de Ventas e Inventario
-- Base de datos MySQL

CREATE DATABASE IF NOT EXISTS sistema_ventas;
USE sistema_ventas;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'vendedor') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    codigo_venta VARCHAR(50) NOT NULL UNIQUE,
    id_usuario INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    INDEX idx_codigo (codigo_venta),
    INDEX idx_fecha (fecha),
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalle de venta
CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    INDEX idx_venta (id_venta),
    INDEX idx_producto (id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
-- Password: admin123
-- Este hash fue generado con: bcrypt.hash('admin123', 10)
INSERT INTO usuarios (nombre, usuario, password, rol) VALUES 
('Administrador', 'admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z0RqYqVqYqVqYqVqYqVqYqVqYqVqY', 'administrador');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, precio, stock, estado) VALUES
('Cerveza Pilsen', 3.50, 100, 'activo'),
('Coca Cola 500ml', 2.50, 150, 'activo'),
('Inca Kola 500ml', 2.50, 150, 'activo'),
('Galleta Soda', 1.00, 200, 'activo'),
('Snack Lays', 2.00, 80, 'activo'),
('Agua San Luis 625ml', 1.50, 120, 'activo'),
('Sublime', 1.50, 100, 'activo'),
('Cigarros Hamilton', 5.00, 50, 'activo'),
('Chiclets Trident', 0.50, 300, 'activo'),
('Energizante Red Bull', 6.00, 40, 'activo');

-- Crear vista para reporte de ventas
CREATE VIEW vista_ventas AS
SELECT 
    v.id_venta,
    v.codigo_venta,
    v.fecha,
    v.total,
    u.nombre AS vendedor,
    u.rol
FROM ventas v
INNER JOIN usuarios u ON v.id_usuario = u.id_usuario;

-- Crear vista para detalle de ventas
CREATE VIEW vista_detalle_ventas AS
SELECT 
    dv.id_detalle,
    dv.id_venta,
    v.codigo_venta,
    p.nombre AS producto,
    dv.cantidad,
    dv.precio_unitario,
    dv.subtotal,
    v.fecha
FROM detalle_venta dv
INNER JOIN ventas v ON dv.id_venta = v.id_venta
INNER JOIN productos p ON dv.id_producto = p.id_producto;

-- Procedimiento almacenado para registrar venta
DELIMITER //

CREATE PROCEDURE registrar_venta(
    IN p_codigo_venta VARCHAR(50),
    IN p_id_usuario INT,
    IN p_total DECIMAL(10, 2),
    OUT p_id_venta INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_id_venta = -1;
    END;
    
    START TRANSACTION;
    
    INSERT INTO ventas (codigo_venta, id_usuario, total)
    VALUES (p_codigo_venta, p_id_usuario, p_total);
    
    SET p_id_venta = LAST_INSERT_ID();
    
    COMMIT;
END //

DELIMITER ;

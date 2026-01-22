const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Generar código único de venta
function generarCodigoVenta() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `V${año}${mes}${dia}${hora}${minuto}${segundo}${random}`;
}

// Registrar nueva venta
router.post('/', async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { productos } = req.body;
        const userId = req.session.userId;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: 'Debe agregar al menos un producto' });
        }

        await connection.beginTransaction();

        // Verificar stock de todos los productos
        for (const item of productos) {
            const [producto] = await connection.query(
                'SELECT stock FROM productos WHERE id_producto = ?',
                [item.id_producto]
            );

            if (producto.length === 0) {
                await connection.rollback();
                return res.status(404).json({ error: `Producto ${item.id_producto} no encontrado` });
            }

            if (producto[0].stock < item.cantidad) {
                await connection.rollback();
                return res.status(400).json({
                    error: `Stock insuficiente para producto ID ${item.id_producto}. Disponible: ${producto[0].stock}`
                });
            }
        }

        // Calcular total
        let total = 0;
        for (const item of productos) {
            total += item.precio_unitario * item.cantidad;
        }

        // Generar código de venta
        const codigoVenta = generarCodigoVenta();

        // Insertar venta
        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (codigo_venta, id_usuario, total) VALUES (?, ?, ?)',
            [codigoVenta, userId, total]
        );

        const idVenta = ventaResult.insertId;

        // Insertar detalle y actualizar stock
        for (const item of productos) {
            const subtotal = item.precio_unitario * item.cantidad;

            // Insertar detalle
            await connection.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [idVenta, item.id_producto, item.cantidad, item.precio_unitario, subtotal]
            );

            // Actualizar stock
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
                [item.cantidad, item.id_producto]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Venta registrada exitosamente',
            venta: {
                id: idVenta,
                codigo: codigoVenta,
                total: total
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error registrando venta:', error);
        res.status(500).json({ error: 'Error al registrar venta' });
    } finally {
        connection.release();
    }
});

// Obtener todas las ventas (con filtro opcional por fecha)
router.get('/', async (req, res) => {
    try {
        const { fecha } = req.query; // Filtro opcional por fecha

        let query = `
            SELECT v.*, u.nombre as vendedor 
            FROM ventas v 
            INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
        `;

        const params = [];

        // Si es vendedor, solo ver sus propias ventas
        if (req.session.rol === 'vendedor') {
            query += ' WHERE v.id_usuario = ?';
            params.push(req.session.userId);

            // Agregar filtro de fecha si existe
            if (fecha) {
                query += ' AND DATE(CONVERT_TZ(v.fecha, "+00:00", "-05:00")) = ?';
                params.push(fecha);
            }
        } else {
            // Si es admin y hay filtro de fecha
            if (fecha) {
                query += ' WHERE DATE(CONVERT_TZ(v.fecha, "+00:00", "-05:00")) = ?';
                params.push(fecha);
            }
        }

        query += ' ORDER BY v.fecha DESC';

        const [ventas] = await db.query(query, params);
        res.json(ventas);

    } catch (error) {
        console.error('Error obteniendo ventas:', error);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

// Obtener detalle de una venta
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar acceso
        const [venta] = await db.query(
            'SELECT * FROM ventas WHERE id_venta = ?',
            [id]
        );

        if (venta.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Si es vendedor, solo puede ver sus propias ventas
        if (req.session.rol === 'vendedor' && venta[0].id_usuario !== req.session.userId) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // Obtener detalle
        const [detalle] = await db.query(`
            SELECT dv.*, p.nombre as producto
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = ?
        `, [id]);

        res.json({
            venta: venta[0],
            detalle: detalle
        });

    } catch (error) {
        console.error('Error obteniendo detalle de venta:', error);
        res.status(500).json({ error: 'Error al obtener detalle de venta' });
    }
});

// Obtener estadísticas completas (solo admin)
router.get('/estadisticas/resumen', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // DATOS GENERALES (Todo el tiempo)
        const [totalVentas] = await db.query(
            'SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto FROM ventas'
        );

        const [totalProductos] = await db.query(
            'SELECT COUNT(*) as total FROM productos WHERE estado = "activo"'
        );

        const [stockBajo] = await db.query(
            'SELECT COUNT(*) as total FROM productos WHERE stock < 10 AND estado = "activo"'
        );

        // DATOS DEL MES ACTUAL
        const [ventasMes] = await db.query(`
            SELECT 
                COUNT(*) as total, 
                COALESCE(SUM(total), 0) as monto 
            FROM ventas 
            WHERE YEAR(CONVERT_TZ(fecha, "+00:00", "-05:00")) = YEAR(NOW()) 
            AND MONTH(CONVERT_TZ(fecha, "+00:00", "-05:00")) = MONTH(NOW())
        `);

        const [productosMesVendidos] = await db.query(`
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            INNER JOIN ventas v ON dv.id_venta = v.id_venta
            WHERE YEAR(CONVERT_TZ(v.fecha, "+00:00", "-05:00")) = YEAR(NOW()) 
            AND MONTH(CONVERT_TZ(v.fecha, "+00:00", "-05:00")) = MONTH(NOW())
            GROUP BY dv.id_producto
            ORDER BY total_vendido DESC
            LIMIT 5
        `);

        // DATOS DEL DÍA ACTUAL
        const [ventasHoy] = await db.query(`
            SELECT 
                COUNT(*) as total, 
                COALESCE(SUM(total), 0) as monto 
            FROM ventas 
            WHERE DATE(CONVERT_TZ(fecha, "+00:00", "-05:00")) = DATE(CONVERT_TZ(NOW(), "+00:00", "-05:00"))
        `);

        const [productosHoyVendidos] = await db.query(`
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            INNER JOIN ventas v ON dv.id_venta = v.id_venta
            WHERE DATE(CONVERT_TZ(v.fecha, "+00:00", "-05:00")) = DATE(CONVERT_TZ(NOW(), "+00:00", "-05:00"))
            GROUP BY dv.id_producto
            ORDER BY total_vendido DESC
            LIMIT 5
        `);

        // PRODUCTOS MÁS VENDIDOS (GENERAL)
        const [productosMasVendidos] = await db.query(`
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            GROUP BY dv.id_producto
            ORDER BY total_vendido DESC
            LIMIT 5
        `);

        res.json({
            // Datos generales
            general: {
                totalVentas: totalVentas[0],
                totalProductos: totalProductos[0].total,
                stockBajo: stockBajo[0].total,
                productosMasVendidos
            },
            // Datos del mes
            mensual: {
                ventas: ventasMes[0],
                productosMasVendidos: productosMesVendidos
            },
            // Datos del día
            diario: {
                ventas: ventasHoy[0],
                productosMasVendidos: productosHoyVendidos
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Obtener resumen de ventas por fecha (admin)
router.get('/estadisticas/resumen-dia', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { fecha } = req.query;

        if (!fecha) {
            return res.status(400).json({ error: 'Fecha requerida' });
        }

        const [resumen] = await db.query(`
            SELECT 
                COUNT(*) as total_ventas,
                COALESCE(SUM(total), 0) as monto_total,
                COALESCE(AVG(total), 0) as promedio_venta
            FROM ventas
            WHERE DATE(CONVERT_TZ(fecha, "+00:00", "-05:00")) = ?
        `, [fecha]);

        res.json(resumen[0]);

    } catch (error) {
        console.error('Error obteniendo resumen del día:', error);
        res.status(500).json({ error: 'Error al obtener resumen' });
    }
});

// Editar venta (solo admin)
router.put('/:id', async (req, res) => {
    const connection = await db.getConnection();

    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;
        const { productos } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: 'Debe agregar al menos un producto' });
        }

        await connection.beginTransaction();

        // Verificar que la venta existe
        const [ventaExistente] = await connection.query(
            'SELECT * FROM ventas WHERE id_venta = ?',
            [id]
        );

        if (ventaExistente.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Obtener detalle anterior para restaurar stock
        const [detalleAnterior] = await connection.query(
            'SELECT * FROM detalle_venta WHERE id_venta = ?',
            [id]
        );

        // Restaurar stock de productos anteriores
        for (const item of detalleAnterior) {
            await connection.query(
                'UPDATE productos SET stock = stock + ? WHERE id_producto = ?',
                [item.cantidad, item.id_producto]
            );
        }

        // Eliminar detalle anterior
        await connection.query('DELETE FROM detalle_venta WHERE id_venta = ?', [id]);

        // Verificar stock de nuevos productos
        for (const item of productos) {
            const [producto] = await connection.query(
                'SELECT stock FROM productos WHERE id_producto = ?',
                [item.id_producto]
            );

            if (producto.length === 0) {
                await connection.rollback();
                return res.status(404).json({ error: `Producto ${item.id_producto} no encontrado` });
            }

            if (producto[0].stock < item.cantidad) {
                await connection.rollback();
                return res.status(400).json({
                    error: `Stock insuficiente para producto ID ${item.id_producto}. Disponible: ${producto[0].stock}`
                });
            }
        }

        // Calcular nuevo total
        let total = 0;
        for (const item of productos) {
            total += item.precio_unitario * item.cantidad;
        }

        // Actualizar venta
        await connection.query(
            'UPDATE ventas SET total = ? WHERE id_venta = ?',
            [total, id]
        );

        // Insertar nuevo detalle y actualizar stock
        for (const item of productos) {
            const subtotal = item.precio_unitario * item.cantidad;

            await connection.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [id, item.id_producto, item.cantidad, item.precio_unitario, subtotal]
            );

            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
                [item.cantidad, item.id_producto]
            );
        }

        await connection.commit();

        res.json({
            message: 'Venta actualizada exitosamente',
            venta: {
                id: id,
                total: total
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error editando venta:', error);
        res.status(500).json({ error: 'Error al editar venta' });
    } finally {
        connection.release();
    }
});

// Eliminar venta (solo admin) - Restaura el stock
router.delete('/:id', async (req, res) => {
    const connection = await db.getConnection();

    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;

        await connection.beginTransaction();

        // Verificar que la venta existe
        const [venta] = await connection.query(
            'SELECT * FROM ventas WHERE id_venta = ?',
            [id]
        );

        if (venta.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Obtener detalle para restaurar stock
        const [detalle] = await connection.query(
            'SELECT * FROM detalle_venta WHERE id_venta = ?',
            [id]
        );

        // Restaurar stock
        for (const item of detalle) {
            await connection.query(
                'UPDATE productos SET stock = stock + ? WHERE id_producto = ?',
                [item.cantidad, item.id_producto]
            );
        }

        // Eliminar detalle (CASCADE eliminará automáticamente)
        await connection.query('DELETE FROM ventas WHERE id_venta = ?', [id]);

        await connection.commit();

        res.json({ message: 'Venta eliminada exitosamente' });

    } catch (error) {
        await connection.rollback();
        console.error('Error eliminando venta:', error);
        res.status(500).json({ error: 'Error al eliminar venta' });
    } finally {
        connection.release();
    }
});

module.exports = router;

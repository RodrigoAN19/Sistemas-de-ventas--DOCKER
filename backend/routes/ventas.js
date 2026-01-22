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

// Obtener todas las ventas
router.get('/', async (req, res) => {
    try {
        let query = `
            SELECT v.*, u.nombre as vendedor 
            FROM ventas v 
            INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
        `;

        // Si es vendedor, solo ver sus propias ventas
        if (req.session.rol === 'vendedor') {
            query += ' WHERE v.id_usuario = ?';
            const [ventas] = await db.query(query + ' ORDER BY v.fecha DESC', [req.session.userId]);
            return res.json(ventas);
        }

        // Si es admin, ver todas
        const [ventas] = await db.query(query + ' ORDER BY v.fecha DESC');
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

// Obtener estadísticas (solo admin)
router.get('/estadisticas/resumen', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const [totalVentas] = await db.query(
            'SELECT COUNT(*) as total, SUM(total) as monto FROM ventas'
        );

        const [ventasHoy] = await db.query(
            'SELECT COUNT(*) as total, SUM(total) as monto FROM ventas WHERE DATE(fecha) = CURDATE()'
        );

        const [productosMasVendidos] = await db.query(`
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            GROUP BY dv.id_producto
            ORDER BY total_vendido DESC
            LIMIT 5
        `);

        res.json({
            totalVentas: totalVentas[0],
            ventasHoy: ventasHoy[0],
            productosMasVendidos
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

module.exports = router;

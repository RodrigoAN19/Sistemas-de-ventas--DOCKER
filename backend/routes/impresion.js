/**
 * Rutas para impresión de tickets
 * Impresora: 3nStar RPT008 (80mm)
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { imprimirTicket, verificarImpresora } = require('../utils/printer');

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    next();
};

// Verificar estado de la impresora
router.get('/estado', isAuthenticated, (req, res) => {
    try {
        const estado = verificarImpresora();
        res.json(estado);
    } catch (error) {
        console.error('Error verificando impresora:', error);
        res.status(500).json({ error: 'Error al verificar impresora' });
    }
});

// Imprimir ticket de una venta
router.post('/ticket/:id_venta', isAuthenticated, async (req, res) => {
    try {
        const { id_venta } = req.params;

        // Obtener datos de la venta
        const [ventas] = await db.query(`
            SELECT v.*, u.nombre as vendedor
            FROM ventas v
            INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.id_venta = ?
        `, [id_venta]);

        if (ventas.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const venta = ventas[0];

        // Verificar permisos: vendedor solo puede imprimir sus propias ventas
        if (req.session.rol !== 'administrador' && venta.id_usuario !== req.session.userId) {
            return res.status(403).json({ error: 'No tienes permiso para imprimir este ticket' });
        }

        // Obtener detalle de la venta
        const [productos] = await db.query(`
            SELECT dv.*, p.nombre
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = ?
        `, [id_venta]);

        // Preparar datos para impresión
        const datosTicket = {
            codigo_venta: venta.codigo_venta,
            fecha: venta.fecha,
            vendedor: venta.vendedor,
            total: venta.total,
            productos: productos
        };

        // Imprimir ticket
        const resultado = await imprimirTicket(datosTicket);

        res.json({
            success: true,
            message: resultado.message,
            simulated: resultado.simulated || false
        });

    } catch (error) {
        console.error('Error imprimiendo ticket:', error);
        res.status(500).json({
            error: 'Error al imprimir ticket',
            details: error.message
        });
    }
});

// Reimprimir ticket (solo admin o vendedor de la venta)
router.post('/reimprimir/:codigo_venta', isAuthenticated, async (req, res) => {
    try {
        const { codigo_venta } = req.params;

        // Obtener datos de la venta por código
        const [ventas] = await db.query(`
            SELECT v.*, u.nombre as vendedor
            FROM ventas v
            INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.codigo_venta = ?
        `, [codigo_venta]);

        if (ventas.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const venta = ventas[0];

        // Verificar permisos
        if (req.session.rol !== 'administrador' && venta.id_usuario !== req.session.userId) {
            return res.status(403).json({ error: 'No tienes permiso para reimprimir este ticket' });
        }

        // Obtener detalle
        const [productos] = await db.query(`
            SELECT dv.*, p.nombre
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = ?
        `, [venta.id_venta]);

        // Preparar datos
        const datosTicket = {
            codigo_venta: venta.codigo_venta,
            fecha: venta.fecha,
            vendedor: venta.vendedor,
            total: venta.total,
            productos: productos
        };

        // Imprimir
        const resultado = await imprimirTicket(datosTicket);

        res.json({
            success: true,
            message: 'Ticket reimpreso correctamente',
            simulated: resultado.simulated || false
        });

    } catch (error) {
        console.error('Error reimprimiendo ticket:', error);
        res.status(500).json({
            error: 'Error al reimprimir ticket',
            details: error.message
        });
    }
});

module.exports = router;

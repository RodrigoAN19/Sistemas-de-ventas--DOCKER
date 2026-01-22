/**
 * Rutas para exportación de datos
 * Soporta PDF y Excel
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generarPDFVentas, generarPDFProductos, generarPDFDashboard } = require('../utils/pdf');
const { generarExcelVentas, generarExcelProductos } = require('../utils/excel');

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    next();
};

// Middleware solo admin
const isAdmin = (req, res, next) => {
    if (req.session.rol !== 'administrador') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
};

// ============= EXPORTAR VENTAS =============

// Exportar ventas a PDF
router.get('/ventas/pdf', isAuthenticated, async (req, res) => {
    try {
        const { fecha } = req.query;

        let query = `
            SELECT v.*, u.nombre as vendedor
            FROM ventas v
            INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
        `;

        const params = [];

        // Si no es admin, solo sus ventas
        if (req.session.rol !== 'administrador') {
            query += ' WHERE v.id_usuario = ?';
            params.push(req.session.userId);
        }

        // Filtro por fecha si existe
        if (fecha) {
            query += req.session.rol === 'administrador' ? ' WHERE' : ' AND';
            query += ' DATE(v.fecha) = ?';
            params.push(fecha);
        }

        query += ' ORDER BY v.fecha DESC';

        const [ventas] = await db.query(query, params);

        // Calcular resumen
        const resumen = {
            total_ventas: ventas.length,
            monto_total: ventas.reduce((sum, v) => sum + Number(v.total), 0),
            promedio: ventas.length > 0 ? ventas.reduce((sum, v) => sum + Number(v.total), 0) / ventas.length : 0
        };

        const pdfDoc = generarPDFVentas(ventas, resumen);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ventas_${new Date().toISOString().split('T')[0]}.pdf`);

        pdfDoc.pipe(res);

    } catch (error) {
        console.error('Error exportando ventas a PDF:', error);
        res.status(500).json({ error: 'Error al exportar ventas' });
    }
});

// Exportar ventas a Excel
router.get('/ventas/excel', isAuthenticated, async (req, res) => {
    try {
        const { fecha } = req.query;

        let query = `
            SELECT v.*, u.nombre as vendedor
            FROM ventas v
            INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
        `;

        const params = [];

        if (req.session.rol !== 'administrador') {
            query += ' WHERE v.id_usuario = ?';
            params.push(req.session.userId);
        }

        if (fecha) {
            query += req.session.rol === 'administrador' ? ' WHERE' : ' AND';
            query += ' DATE(v.fecha) = ?';
            params.push(fecha);
        }

        query += ' ORDER BY v.fecha DESC';

        const [ventas] = await db.query(query, params);

        const resumen = {
            total_ventas: ventas.length,
            monto_total: ventas.reduce((sum, v) => sum + Number(v.total), 0),
            promedio: ventas.length > 0 ? ventas.reduce((sum, v) => sum + Number(v.total), 0) / ventas.length : 0
        };

        const buffer = await generarExcelVentas(ventas, resumen);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=ventas_${new Date().toISOString().split('T')[0]}.xlsx`);

        res.send(buffer);

    } catch (error) {
        console.error('Error exportando ventas a Excel:', error);
        res.status(500).json({ error: 'Error al exportar ventas' });
    }
});

// ============= EXPORTAR PRODUCTOS =============

// Exportar productos a PDF
router.get('/productos/pdf', isAdmin, async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos ORDER BY nombre');

        const pdfDoc = generarPDFProductos(productos);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=productos_${new Date().toISOString().split('T')[0]}.pdf`);

        pdfDoc.pipe(res);

    } catch (error) {
        console.error('Error exportando productos a PDF:', error);
        res.status(500).json({ error: 'Error al exportar productos' });
    }
});

// Exportar productos a Excel
router.get('/productos/excel', isAdmin, async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos ORDER BY nombre');

        const buffer = await generarExcelProductos(productos);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=productos_${new Date().toISOString().split('T')[0]}.xlsx`);

        res.send(buffer);

    } catch (error) {
        console.error('Error exportando productos a Excel:', error);
        res.status(500).json({ error: 'Error al exportar productos' });
    }
});

// ============= EXPORTAR DASHBOARD =============

// Exportar dashboard a PDF (solo admin)
router.get('/dashboard/pdf', isAdmin, async (req, res) => {
    try {
        // Obtener estadísticas
        const [statsResult] = await db.query(`
            SELECT 
                COUNT(*) as total_ventas,
                COALESCE(SUM(total), 0) as monto_total,
                COALESCE(AVG(total), 0) as promedio_venta
            FROM ventas
        `);

        const [ventasHoyResult] = await db.query(`
            SELECT COUNT(*) as ventas_dia
            FROM ventas
            WHERE DATE(fecha) = CURDATE()
        `);

        const [productosMasVendidos] = await db.query(`
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_venta dv
            INNER JOIN productos p ON dv.id_producto = p.id_producto
            GROUP BY dv.id_producto
            ORDER BY total_vendido DESC
            LIMIT 5
        `);

        const stats = {
            ...statsResult[0],
            ventas_dia: ventasHoyResult[0].ventas_dia,
            productos_mas_vendidos: productosMasVendidos
        };

        const pdfDoc = generarPDFDashboard(stats);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=dashboard_${new Date().toISOString().split('T')[0]}.pdf`);

        pdfDoc.pipe(res);

    } catch (error) {
        console.error('Error exportando dashboard a PDF:', error);
        res.status(500).json({ error: 'Error al exportar dashboard' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los productos activos
router.get('/', async (req, res) => {
    try {
        const [productos] = await db.query(
            'SELECT * FROM productos WHERE estado = "activo" ORDER BY nombre'
        );
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener todos los productos (incluye inactivos) - Solo admin
router.get('/todos', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const [productos] = await db.query(
            'SELECT * FROM productos ORDER BY nombre'
        );
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Crear producto - Solo admin
router.post('/', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { nombre, precio, stock } = req.body;

        if (!nombre || !precio || stock === undefined) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const [result] = await db.query(
            'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
            [nombre, precio, stock]
        );

        res.status(201).json({
            message: 'Producto creado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

// Actualizar producto - Solo admin
router.put('/:id', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;
        const { nombre, precio, stock, estado } = req.body;

        await db.query(
            'UPDATE productos SET nombre = ?, precio = ?, stock = ?, estado = ? WHERE id_producto = ?',
            [nombre, precio, stock, estado, id]
        );

        res.json({ message: 'Producto actualizado exitosamente' });

    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// Eliminar producto (cambiar a inactivo) - Solo admin
router.delete('/:id', async (req, res) => {
    try {
        if (req.session.rol !== 'administrador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;

        await db.query(
            'UPDATE productos SET estado = "inactivo" WHERE id_producto = ?',
            [id]
        );

        res.json({ message: 'Producto desactivado exitosamente' });

    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;

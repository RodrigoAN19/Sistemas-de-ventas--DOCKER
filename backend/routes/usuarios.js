const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');

// Obtener todos los usuarios (solo admin)
router.get('/', async (req, res) => {
    try {
        const [usuarios] = await db.query(
            'SELECT id_usuario, nombre, usuario, rol, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC'
        );
        res.json(usuarios);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Crear nuevo usuario (solo admin)
router.post('/', async (req, res) => {
    try {
        const { nombre, usuario, password, rol } = req.body;

        if (!nombre || !usuario || !password || !rol) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (rol !== 'administrador' && rol !== 'vendedor') {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        // Verificar si el usuario ya existe
        const [existingUser] = await db.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, usuario, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, usuario, hashedPassword, rol]
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Actualizar usuario (solo admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, usuario, password, rol } = req.body;

        if (!nombre || !usuario || !rol) {
            return res.status(400).json({ error: 'Nombre, usuario y rol son requeridos' });
        }

        // Si se proporciona nueva contraseña
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'UPDATE usuarios SET nombre = ?, usuario = ?, password = ?, rol = ? WHERE id_usuario = ?',
                [nombre, usuario, hashedPassword, rol, id]
            );
        } else {
            await db.query(
                'UPDATE usuarios SET nombre = ?, usuario = ?, rol = ? WHERE id_usuario = ?',
                [nombre, usuario, rol, id]
            );
        }

        res.json({ message: 'Usuario actualizado exitosamente' });

    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario (solo admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir eliminar el propio usuario
        if (parseInt(id) === req.session.userId) {
            return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
        }

        await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

        res.json({ message: 'Usuario eliminado exitosamente' });

    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

// GET /api/deportes
router.get('/', async (req, res) => {
    try {
        const deportes = await db.query(`
            SELECT d.id, d.nombre,
                   (SELECT COUNT(*) FROM equipos e WHERE e.deporte_id = d.id) AS total_equipos
            FROM deportes d
            ORDER BY d.nombre
        `);
        res.json(deportes);
    } catch (error) {
        console.error('Error GET /deportes:', error);
        res.status(500).json({ error: 'Error al obtener deportes' });
    }
});

// POST /api/deportes
router.post('/', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        if (!nombre || nombre.length < 2) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        }
        const existe = await db.query('SELECT id FROM deportes WHERE LOWER(nombre) = LOWER(?)', [nombre]);
        if (existe && existe.length > 0) {
            return res.status(409).json({ error: 'Ya existe un deporte con ese nombre' });
        }
        await db.query('INSERT INTO deportes (nombre) VALUES (?)', [nombre]);
        const idRows = await db.query('SELECT last_insert_rowid() AS id');
        const nuevoId = idRows[0].id;
        await registrarAuditoria(req, 'crear', 'deporte', nuevoId, { nombre });
        res.status(201).json({ message: 'Creado', id: nuevoId, nombre });
    } catch (error) {
        console.error('Error POST /deportes:', error);
        res.status(500).json({ error: 'Error al crear deporte' });
    }
});

// DELETE /api/deportes/:id
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({ error: 'ID inválido' });
        const equipos = await db.query('SELECT COUNT(*) AS total FROM equipos WHERE deporte_id = ?', [id]);
        if (equipos[0].total > 0) {
            return res.status(409).json({ error: 'No se puede borrar: hay ' + equipos[0].total + ' equipos asociados' });
        }
        await db.query('DELETE FROM deportes WHERE id = ?', [id]);
        await registrarAuditoria(req, 'borrar', 'deporte', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /deportes/:id:', error);
        res.status(500).json({ error: 'Error al borrar deporte' });
    }
});

module.exports = router;

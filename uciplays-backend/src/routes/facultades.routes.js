const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

// GET /api/facultades
router.get('/', async (req, res) => {
    try {
        const facultades = await db.query(`
            SELECT f.id, f.nombre, f.logo_url,
                   (SELECT COUNT(*) FROM equipos e WHERE e.facultad_id = f.id) AS total_equipos
            FROM facultades f
            ORDER BY f.nombre
        `);
        res.json(facultades);
    } catch (error) {
        console.error('Error GET /facultades:', error);
        res.status(500).json({ error: 'Error al obtener facultades' });
    }
});

// POST /api/facultades
router.post('/', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        if (!nombre || nombre.length < 2) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        }
        const existe = await db.query('SELECT id FROM facultades WHERE LOWER(nombre) = LOWER(?)', [nombre]);
        if (existe && existe.length > 0) {
            return res.status(409).json({ error: 'Ya existe una facultad con ese nombre' });
        }
        await db.query('INSERT INTO facultades (nombre, logo_url) VALUES (?, ?)', [nombre, body.logo_url || null]);
        const idRows = await db.query('SELECT last_insert_rowid() AS id');
        const nuevoId = idRows[0].id;
        await registrarAuditoria(req, 'crear', 'facultad', nuevoId, { nombre });
        res.status(201).json({ message: 'Creado', id: nuevoId, nombre });
    } catch (error) {
        console.error('Error POST /facultades:', error);
        res.status(500).json({ error: 'Error al crear facultad' });
    }
});

// PUT /api/facultades/:id
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        if (!nombre || nombre.length < 2) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        }
        await db.query('UPDATE facultades SET nombre = ?, logo_url = ? WHERE id = ?',
            [nombre, body.logo_url || null, id]);
        await registrarAuditoria(req, 'editar', 'facultad', id, { nombre });
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /facultades/:id:', error);
        res.status(500).json({ error: 'Error al editar facultad' });
    }
});

// DELETE /api/facultades/:id?cascade=true
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cascade = req.query.cascade === 'true';
        const equipos = await db.query('SELECT COUNT(*) AS total FROM equipos WHERE facultad_id = ?', [id]);
        if (equipos[0].total > 0 && !cascade) {
            return res.status(409).json({ error: 'La facultad tiene ' + equipos[0].total + ' equipos. Usa cascade=true para borrarla con ellos.' });
        }
        if (equipos[0].total > 0 && cascade) {
            // Borrar participantes de esos equipos
            const equipoIds = await db.query('SELECT id FROM equipos WHERE facultad_id = ?', [id]);
            for (const eq of equipoIds) {
                await db.query('DELETE FROM evento_participantes WHERE equipo_id = ?', [eq.id]);
                await db.query('DELETE FROM sanciones WHERE equipo_id = ?', [eq.id]);
            }
            await db.query('DELETE FROM equipos WHERE facultad_id = ?', [id]);
        }
        await db.query('DELETE FROM facultades WHERE id = ?', [id]);
        await registrarAuditoria(req, 'borrar', 'facultad', id, { cascade });
        res.json({ message: 'Eliminado', cascade });
    } catch (error) {
        console.error('Error DELETE /facultades/:id:', error);
        res.status(500).json({ error: 'Error al borrar facultad' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

// GET /api/sanciones
router.get('/', async (req, res) => {
    try {
        const sanciones = await db.query(`
            SELECT s.id, s.equipo_id,
                   e.nombre AS equipo_nombre,
                   f.nombre AS facultad_nombre,
                   d.nombre AS deporte,
                   s.puntos_descontados, s.motivo, s.observaciones, s.fecha
            FROM sanciones s
            JOIN equipos e ON e.id = s.equipo_id
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            ORDER BY s.fecha DESC
        `);
        res.json(sanciones);
    } catch (error) {
        console.error('Error GET /sanciones:', error);
        res.status(500).json({ error: 'Error al obtener sanciones' });
    }
});

// POST /api/sanciones
router.post('/', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        const equipoId = parseInt(body.equipo_id);
        const puntos = parseInt(body.puntos_descontados);
        if (!equipoId) return res.status(400).json({ error: 'equipo_id requerido' });
        if (!puntos || puntos >= 0) return res.status(400).json({ error: 'puntos_descontados debe ser un número negativo' });
        const existe = await db.query('SELECT id FROM equipos WHERE id = ?', [equipoId]);
        if (!existe || existe.length === 0) return res.status(404).json({ error: 'Equipo no encontrado' });

        await db.query(
            'INSERT INTO sanciones (equipo_id, puntos_descontados, motivo, observaciones) VALUES (?, ?, ?, ?)',
            [equipoId, puntos, body.motivo || '', body.observaciones || '']
        );
        const idRows = await db.query('SELECT last_insert_rowid() AS id');
        await registrarAuditoria(req, 'crear', 'sancion', idRows[0].id, { equipoId, puntos });
        res.status(201).json({ message: 'Creado', id: idRows[0].id });
    } catch (error) {
        console.error('Error POST /sanciones:', error);
        res.status(500).json({ error: 'Error al crear sanción' });
    }
});

// DELETE /api/sanciones/:id
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.query('DELETE FROM sanciones WHERE id = ?', [id]);
        await registrarAuditoria(req, 'borrar', 'sancion', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /sanciones/:id:', error);
        res.status(500).json({ error: 'Error al borrar sanción' });
    }
});

module.exports = router;

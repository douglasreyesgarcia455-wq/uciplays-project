const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

router.get('/', async (req, res) => {
    try {
        const equipos = await db.query(`
            SELECT e.id, e.nombre, f.nombre AS facultad, d.nombre AS deporte,
                   f.id AS facultad_id, d.id AS deporte_id,
                   (SELECT COUNT(*) FROM evento_participantes ep WHERE ep.equipo_id = e.id) AS total_eventos
            FROM equipos e
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            ORDER BY f.nombre, d.nombre, e.nombre
        `);
        res.json(equipos);
    } catch (error) {
        console.error('Error GET /equipos:', error);
        res.status(500).json({ error: 'Error al obtener equipos' });
    }
});

router.post('/', verificarToken, async (req, res) => {
    try {
        const body = req.body || {};
        const nombre = String(body.nombre || '').trim();
        const facultadId = parseInt(body.facultad_id);
        const deporteId = parseInt(body.deporte_id);
        if (!nombre || nombre.length < 2) {
            return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
        }
        if (!facultadId || !deporteId) {
            return res.status(400).json({ error: 'facultad_id y deporte_id son requeridos' });
        }
        const existe = await db.query('SELECT id FROM equipos WHERE facultad_id = ? AND deporte_id = ?', [facultadId, deporteId]);
        if (existe && existe.length > 0) {
            return res.status(409).json({ error: 'Ya existe un equipo de esa facultad para ese deporte' });
        }
        await db.query('INSERT INTO equipos (nombre, facultad_id, deporte_id) VALUES (?, ?, ?)', [nombre, facultadId, deporteId]);
        const idRows = await db.query('SELECT last_insert_rowid() AS id');
        await registrarAuditoria(req, 'crear', 'equipo', idRows[0].id, { nombre, facultadId, deporteId });
        res.status(201).json({ message: 'Creado', id: idRows[0].id });
    } catch (error) {
        console.error('Error POST /equipos:', error);
        res.status(500).json({ error: 'Error al crear equipo' });
    }
});

router.put('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body || {};
        await db.query('UPDATE equipos SET nombre = ?, facultad_id = ?, deporte_id = ? WHERE id = ?',
            [body.nombre, body.facultad_id, body.deporte_id, id]);
        await registrarAuditoria(req, 'editar', 'equipo', id, null);
        res.json({ message: 'Actualizado' });
    } catch (error) {
        console.error('Error PUT /equipos/:id:', error);
        res.status(500).json({ error: 'Error al editar equipo' });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const eventos = await db.query('SELECT COUNT(*) AS total FROM evento_participantes WHERE equipo_id = ?', [id]);
        if (eventos[0].total > 0) {
            return res.status(409).json({ error: 'El equipo tiene ' + eventos[0].total + ' eventos asociados' });
        }
        await db.query('DELETE FROM equipos WHERE id = ?', [id]);
        await registrarAuditoria(req, 'borrar', 'equipo', id, null);
        res.json({ message: 'Eliminado' });
    } catch (error) {
        console.error('Error DELETE /equipos/:id:', error);
        res.status(500).json({ error: 'Error al borrar equipo' });
    }
});

module.exports = router;

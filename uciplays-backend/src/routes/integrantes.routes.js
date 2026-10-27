const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const integrantes = await db.query(`
            SELECT i.id, i.nombre, i.ci, i.matricula,
                   e.nombre AS equipo_nombre,
                   f.nombre AS facultad_nombre,
                   d.nombre AS deporte
            FROM integrantes i
            JOIN equipos e ON e.id = i.equipo_id
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            ORDER BY f.nombre, e.nombre, i.nombre
        `);
        res.json(integrantes);
    } catch (error) {
        console.error('Error GET /integrantes:', error);
        res.status(500).json({ error: 'Error al obtener integrantes' });
    }
});

router.get('/:equipo_id', async (req, res) => {
    try {
        const integrantes = await db.query(`
            SELECT i.id, i.nombre, i.ci, i.matricula,
                   e.nombre AS equipo_nombre,
                   f.nombre AS facultad_nombre,
                   d.nombre AS deporte
            FROM integrantes i
            JOIN equipos e ON e.id = i.equipo_id
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            WHERE i.equipo_id = ?
            ORDER BY i.nombre
        `, [req.params.equipo_id]);
        res.json(integrantes);
    } catch (error) {
        console.error('Error GET /integrantes/:equipo_id:', error);
        res.status(500).json({ error: 'Error al obtener integrantes del equipo' });
    }
});

module.exports = router;

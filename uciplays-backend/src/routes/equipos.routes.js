const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const equipos = await db.query(`
            SELECT e.id, e.nombre, f.nombre AS facultad, d.nombre AS deporte,
                   f.id AS facultad_id, d.id AS deporte_id
            FROM equipos e
            JOIN facultades f ON f.id = e.facultad_id
            JOIN deportes d ON d.id = e.deporte_id
            ORDER BY f.nombre, d.nombre
        `);
        res.json(equipos);
    } catch (error) {
        console.error('Error GET /equipos:', error);
        res.status(500).json({ error: 'Error al obtener equipos' });
    }
});

module.exports = router;

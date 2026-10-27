const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

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

module.exports = router;

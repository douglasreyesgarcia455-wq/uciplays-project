const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const ranking = await db.query(`
            SELECT
                f.id,
                f.nombre,
                f.logo_url,
                SUM(CASE WHEN r.posicion_lograda = 1 THEN 1 ELSE 0 END) AS oros,
                SUM(CASE WHEN r.posicion_lograda = 2 THEN 1 ELSE 0 END) AS platas,
                SUM(CASE WHEN r.posicion_lograda = 3 THEN 1 ELSE 0 END) AS bronces,
                SUM(CASE WHEN r.posicion_lograda = 4 THEN 1 ELSE 0 END) AS cuarto,
                SUM(CASE WHEN r.posicion_lograda = 5 THEN 1 ELSE 0 END) AS quinto,
                COUNT(r.id) AS total_eventos,
                COALESCE(SUM(r.puntuacion_final), 0) AS puntos
            FROM facultades f
            LEFT JOIN equipos e ON e.facultad_id = f.id
            LEFT JOIN resultados r ON r.equipo_id = e.id
            GROUP BY f.id, f.nombre, f.logo_url
            ORDER BY puntos DESC, oros DESC
        `);
        res.json(ranking);
    } catch (error) {
        console.error('Error GET /ranking:', error);
        res.status(500).json({ error: 'Error al obtener ranking' });
    }
});

module.exports = router;

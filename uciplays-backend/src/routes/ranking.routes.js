const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT
                f.id,
                f.nombre,
                f.logo_url,
                SUM(CASE WHEN r.posicion_lograda = 1 THEN 1 ELSE 0 END) as oros,
                SUM(CASE WHEN r.posicion_lograda = 2 THEN 1 ELSE 0 END) as platas,
                SUM(CASE WHEN r.posicion_lograda = 3 THEN 1 ELSE 0 END) as bronces,
                SUM(CASE WHEN r.posicion_lograda = 4 THEN 1 ELSE 0 END) as cuarto,
                SUM(CASE WHEN r.posicion_lograda = 5 THEN 1 ELSE 0 END) as quinto,
                COUNT(r.id) as total_eventos,
                COALESCE(SUM(r.puntuacion_final), 0) as puntos
            FROM facultades f
            LEFT JOIN resultados r ON f.id = r.facultad_id
            GROUP BY f.id, f.nombre, f.logo_url
            ORDER BY puntos DESC
        `;
        const ranking = await db.query(query);
        res.json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener ranking" });
    }
});

module.exports = router;

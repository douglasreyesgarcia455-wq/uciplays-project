const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT f.id, f.nombre, COALESCE(SUM(r.puntuacion_final), 0) as puntos
            FROM facultades f
            LEFT JOIN resultados r ON f.id = r.facultad_id
            GROUP BY f.id, f.nombre
            ORDER BY puntos DESC
        `;
        const ranking = await db.query(query);
        res.json(ranking);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener ranking" });
    }
});

module.exports = router;
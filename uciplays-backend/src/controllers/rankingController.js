const db = require('../config/db');

const getRanking = async (req, res) => {
    try {
        const sql = `
            SELECT 
                f.nombre as facultad,
                f.siglas,
                SUM(CASE WHEN r.posicion_lograda = 1 THEN 1 ELSE 0 END) as oros,
                SUM(CASE WHEN r.posicion_lograda = 2 THEN 1 ELSE 0 END) as platas,
                SUM(CASE WHEN r.posicion_lograda = 3 THEN 1 ELSE 0 END) as bronces,
                SUM(COALESCE(r.puntuacion_final, 0)) as puntos_totales
            FROM facultades f
            LEFT JOIN resultados r ON f.id = r.facultad_id
            GROUP BY f.id
            ORDER BY puntos_totales DESC, oros DESC;
        `;
        const ranking = await db.query(sql);
        res.json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el ranking" });
    }
};

module.exports = { getRanking };
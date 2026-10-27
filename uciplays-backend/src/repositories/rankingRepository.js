// rankingRepository.js — Acceso a datos del ranking.
const db = require('../config/db');

async function obtenerRanking() {
    return db.query(`
        SELECT
            f.id,
            f.nombre,
            f.logo_url,
            COALESCE(SUM(ep.puntos), 0) AS puntos_eventos,
            COALESCE((
                SELECT SUM(s.puntos_descontados)
                FROM sanciones s
                JOIN equipos eq ON eq.id = s.equipo_id
                WHERE eq.facultad_id = f.id
            ), 0) AS puntos_sanciones,
            COALESCE(SUM(ep.puntos), 0) + COALESCE((
                SELECT SUM(s.puntos_descontados)
                FROM sanciones s
                JOIN equipos eq ON eq.id = s.equipo_id
                WHERE eq.facultad_id = f.id
            ), 0) AS puntos
        FROM facultades f
        LEFT JOIN equipos e ON e.facultad_id = f.id
        LEFT JOIN evento_participantes ep ON ep.equipo_id = e.id
        GROUP BY f.id, f.nombre, f.logo_url
        ORDER BY puntos DESC, f.nombre ASC
    `);
}

module.exports = { obtenerRanking };

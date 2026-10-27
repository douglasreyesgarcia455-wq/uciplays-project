// sancionesRepository.js — Acceso a datos de sanciones.
const db = require('../config/db');

async function obtenerTodas() {
    return db.query(`
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
}

async function obtenerPorId(id) {
    const rows = await db.query('SELECT id, equipo_id, puntos_descontados, motivo, observaciones, fecha FROM sanciones WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
}

async function crear(datos) {
    await db.query(
        'INSERT INTO sanciones (equipo_id, puntos_descontados, motivo, observaciones) VALUES (?, ?, ?, ?)',
        [datos.equipo_id, datos.puntos_descontados, datos.motivo || '', datos.observaciones || '']
    );
    const idRows = await db.query('SELECT last_insert_rowid() AS id');
    return idRows[0].id;
}

async function borrar(id) {
    await db.query('DELETE FROM sanciones WHERE id = ?', [id]);
}

async function existeEquipo(equipoId) {
    const rows = await db.query('SELECT id FROM equipos WHERE id = ?', [equipoId]);
    return rows && rows.length > 0;
}

module.exports = { obtenerTodas, obtenerPorId, crear, borrar, existeEquipo };

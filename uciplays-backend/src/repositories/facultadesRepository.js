// facultadesRepository.js — Acceso a datos de facultades.
const db = require('../config/db');

async function obtenerTodas() {
    return db.query(`
        SELECT f.id, f.nombre, f.logo_url,
               (SELECT COUNT(*) FROM equipos e WHERE e.facultad_id = f.id) AS total_equipos
        FROM facultades f
        ORDER BY f.nombre
    `);
}

async function obtenerPorId(id) {
    const rows = await db.query('SELECT id, nombre, logo_url FROM facultades WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
}

async function existeNombre(nombre, excluirId) {
    let sql = 'SELECT id FROM facultades WHERE LOWER(nombre) = LOWER(?)';
    const params = [nombre];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    const rows = await db.query(sql, params);
    return rows && rows.length > 0;
}

async function crear(datos) {
    await db.query('INSERT INTO facultades (nombre, logo_url) VALUES (?, ?)', [datos.nombre, datos.logo_url || null]);
    const idRows = await db.query('SELECT last_insert_rowid() AS id');
    return idRows[0].id;
}

async function actualizar(id, datos) {
    await db.query('UPDATE facultades SET nombre = ?, logo_url = ? WHERE id = ?', [datos.nombre, datos.logo_url || null, id]);
}

async function contarEquipos(id) {
    const rows = await db.query('SELECT COUNT(*) AS total FROM equipos WHERE facultad_id = ?', [id]);
    return rows[0].total;
}

async function borrarConCascade(id) {
    const equipos = await db.query('SELECT id FROM equipos WHERE facultad_id = ?', [id]);
    for (const eq of equipos) {
        await db.query('DELETE FROM evento_participantes WHERE equipo_id = ?', [eq.id]);
        await db.query('DELETE FROM sanciones WHERE equipo_id = ?', [eq.id]);
        await db.query('DELETE FROM integrantes WHERE equipo_id = ?', [eq.id]);
    }
    await db.query('DELETE FROM equipos WHERE facultad_id = ?', [id]);
    await db.query('DELETE FROM facultades WHERE id = ?', [id]);
}

async function borrar(id) {
    await db.query('DELETE FROM facultades WHERE id = ?', [id]);
}

module.exports = { obtenerTodas, obtenerPorId, existeNombre, crear, actualizar, contarEquipos, borrarConCascade, borrar };

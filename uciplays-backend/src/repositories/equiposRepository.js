// equiposRepository.js — Acceso a datos de equipos.
const db = require('../config/db');

async function obtenerTodos() {
    return db.query(`
        SELECT e.id, e.nombre, f.nombre AS facultad, d.nombre AS deporte,
               f.id AS facultad_id, d.id AS deporte_id,
               (SELECT COUNT(*) FROM evento_participantes ep WHERE ep.equipo_id = e.id) AS total_eventos
        FROM equipos e
        JOIN facultades f ON f.id = e.facultad_id
        JOIN deportes d ON d.id = e.deporte_id
        ORDER BY f.nombre, d.nombre, e.nombre
    `);
}

async function obtenerPorId(id) {
    const rows = await db.query('SELECT id, nombre, facultad_id, deporte_id FROM equipos WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
}

async function existeNombre(nombre, excluirId) {
    let sql = 'SELECT id FROM equipos WHERE LOWER(nombre) = LOWER(?)';
    const params = [nombre];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    const rows = await db.query(sql, params);
    return rows && rows.length > 0;
}

async function existeFacultadDeporte(facultadId, deporteId, excluirId) {
    let sql = 'SELECT id FROM equipos WHERE facultad_id = ? AND deporte_id = ?';
    const params = [facultadId, deporteId];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    const rows = await db.query(sql, params);
    return rows && rows.length > 0;
}

async function crear(datos) {
    await db.query('INSERT INTO equipos (nombre, facultad_id, deporte_id) VALUES (?, ?, ?)',
        [datos.nombre, datos.facultad_id, datos.deporte_id]);
    const idRows = await db.query('SELECT last_insert_rowid() AS id');
    return idRows[0].id;
}

async function actualizar(id, datos) {
    await db.query('UPDATE equipos SET nombre = ?, facultad_id = ?, deporte_id = ? WHERE id = ?',
        [datos.nombre, datos.facultad_id, datos.deporte_id, id]);
}

async function contarEventos(id) {
    const rows = await db.query('SELECT COUNT(*) AS total FROM evento_participantes WHERE equipo_id = ?', [id]);
    return rows[0].total;
}

async function borrar(id) {
    await db.query('DELETE FROM equipos WHERE id = ?', [id]);
}

module.exports = { obtenerTodos, obtenerPorId, existeNombre, existeFacultadDeporte, crear, actualizar, contarEventos, borrar };

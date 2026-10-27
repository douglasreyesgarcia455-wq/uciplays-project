// integrantesRepository.js — Acceso a datos de integrantes.
const db = require('../config/db');

async function obtenerTodos() {
    return db.query(`
        SELECT i.id, i.nombre, i.ci, i.matricula, i.equipo_id,
               e.nombre AS equipo_nombre, f.nombre AS facultad_nombre, d.nombre AS deporte
        FROM integrantes i
        JOIN equipos e ON e.id = i.equipo_id
        JOIN facultades f ON f.id = e.facultad_id
        JOIN deportes d ON d.id = e.deporte_id
        ORDER BY f.nombre, e.nombre, i.nombre
    `);
}

async function obtenerPorEquipo(equipoId) {
    return db.query(`
        SELECT i.id, i.nombre, i.ci, i.matricula, i.equipo_id,
               e.nombre AS equipo_nombre, f.nombre AS facultad_nombre, d.nombre AS deporte
        FROM integrantes i
        JOIN equipos e ON e.id = i.equipo_id
        JOIN facultades f ON f.id = e.facultad_id
        JOIN deportes d ON d.id = e.deporte_id
        WHERE i.equipo_id = ?
        ORDER BY i.nombre
    `, [equipoId]);
}

async function obtenerPorId(id) {
    const rows = await db.query('SELECT id, nombre, ci, matricula, equipo_id FROM integrantes WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
}

async function existeCI(ci, excluirId) {
    let sql = 'SELECT id FROM integrantes WHERE ci = ?';
    const params = [ci];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    const rows = await db.query(sql, params);
    return rows && rows.length > 0;
}

async function existeMatricula(matricula, excluirId) {
    let sql = 'SELECT id FROM integrantes WHERE matricula = ?';
    const params = [matricula];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    const rows = await db.query(sql, params);
    return rows && rows.length > 0;
}

async function crear(datos) {
    await db.query('INSERT INTO integrantes (nombre, ci, matricula, equipo_id) VALUES (?, ?, ?, ?)',
        [datos.nombre, datos.ci, datos.matricula, datos.equipo_id]);
    const idRows = await db.query('SELECT last_insert_rowid() AS id');
    return idRows[0].id;
}

async function actualizar(id, datos) {
    await db.query('UPDATE integrantes SET nombre = ?, ci = ?, matricula = ? WHERE id = ?',
        [datos.nombre, datos.ci, datos.matricula, id]);
}

async function borrar(id) {
    await db.query('DELETE FROM integrantes WHERE id = ?', [id]);
}

module.exports = { obtenerTodos, obtenerPorEquipo, obtenerPorId, existeCI, existeMatricula, crear, actualizar, borrar };

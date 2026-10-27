// deportesRepository.js — Acceso a datos de deportes.
const db = require('../config/db');

async function obtenerTodos() {
    return db.query(`
        SELECT d.id, d.nombre,
               (SELECT COUNT(*) FROM equipos e WHERE e.deporte_id = d.id) AS total_equipos
        FROM deportes d
        ORDER BY d.nombre
    `);
}

async function obtenerPorId(id) {
    const rows = await db.query('SELECT id, nombre FROM deportes WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
}

async function existeNombre(nombre, excluirId) {
    let sql = 'SELECT id FROM deportes WHERE LOWER(nombre) = LOWER(?)';
    const params = [nombre];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    const rows = await db.query(sql, params);
    return rows && rows.length > 0;
}

async function crear(nombre) {
    await db.query('INSERT INTO deportes (nombre) VALUES (?)', [nombre]);
    const idRows = await db.query('SELECT last_insert_rowid() AS id');
    return idRows[0].id;
}

async function actualizar(id, nombre) {
    await db.query('UPDATE deportes SET nombre = ? WHERE id = ?', [nombre, id]);
}

async function contarEquipos(id) {
    const rows = await db.query('SELECT COUNT(*) AS total FROM equipos WHERE deporte_id = ?', [id]);
    return rows[0].total;
}

async function borrar(id) {
    await db.query('DELETE FROM deportes WHERE id = ?', [id]);
}

async function crearEquiposParaFacultades(deporteId, nombreDeporte) {
    const facultades = await db.query('SELECT id, nombre FROM facultades ORDER BY id');
    for (const f of facultades) {
        await db.query(
            'INSERT INTO equipos (nombre, facultad_id, deporte_id) VALUES (?, ?, ?)',
            [f.nombre + ' ' + nombreDeporte, f.id, deporteId]
        );
    }
    return facultades.length;
}

module.exports = { obtenerTodos, obtenerPorId, existeNombre, crear, actualizar, contarEquipos, borrar, crearEquiposParaFacultades };

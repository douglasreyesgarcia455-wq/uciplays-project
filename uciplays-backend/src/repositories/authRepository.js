// authRepository.js — Acceso a datos de autenticación.
const db = require('../config/db');

async function obtenerPorUsername(username) {
    const rows = await db.query(
        'SELECT id, username, password_hash, rol, activo FROM usuarios WHERE username = ?',
        [username]
    );
    return rows && rows.length > 0 ? rows[0] : null;
}

async function obtenerPorId(id) {
    const rows = await db.query('SELECT id, username, rol, activo FROM usuarios WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
}

module.exports = { obtenerPorUsername, obtenerPorId };

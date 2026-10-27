// eventosRepository.js — Acceso a datos de eventos (Repository, GRASP).
// Única capa que conoce SQL de eventos.

const db = require('../config/db');

// Puntos por posición: 1º→3, 2º→2, 3º→1, 4º+→0
function puntosPorPosicion(posicion) {
    if (posicion === 1) return 3;
    if (posicion === 2) return 2;
    if (posicion === 3) return 1;
    return 0;
}

async function obtenerParticipantes(eventoId) {
    return db.query(
        `SELECT ep.id, ep.equipo_id, eq.nombre AS equipo_nombre, f.nombre AS facultad, d.nombre AS deporte,
                ep.posicion, ep.puntos
         FROM evento_participantes ep
         JOIN equipos eq ON eq.id = ep.equipo_id
         JOIN facultades f ON f.id = eq.facultad_id
         JOIN deportes d ON d.id = eq.deporte_id
         WHERE ep.evento_id = ?
         ORDER BY COALESCE(ep.posicion, 999), eq.nombre`,
        [eventoId]
    );
}

async function obtenerTodos(filtros) {
    const { estado } = filtros || {};
    let sql = `SELECT ev.id, ev.deporte_id, d.nombre AS deporte, ev.fecha, ev.hora, ev.lugar, ev.estado, ev.detalles
               FROM eventos ev
               JOIN deportes d ON d.id = ev.deporte_id`;
    const params = [];
    if (estado) { sql += ' WHERE ev.estado = ?'; params.push(estado); }
    sql += ' ORDER BY ev.fecha ASC, ev.hora ASC';

    const eventos = await db.query(sql, params);
    for (const ev of eventos) {
        ev.participantes = await obtenerParticipantes(ev.id);
    }
    return eventos;
}

async function obtenerPorId(id) {
    const rows = await db.query(
        `SELECT ev.id, ev.deporte_id, d.nombre AS deporte, ev.fecha, ev.hora, ev.lugar, ev.estado, ev.detalles
         FROM eventos ev JOIN deportes d ON d.id = ev.deporte_id WHERE ev.id = ?`,
        [id]
    );
    if (!rows || rows.length === 0) return null;
    const ev = rows[0];
    ev.participantes = await obtenerParticipantes(ev.id);
    return ev;
}

async function crear(datos) {
    const { deporte_id, fecha, hora, lugar, estado, detalles, participantes } = datos;
    await db.query(
        `INSERT INTO eventos (deporte_id, fecha, hora, lugar, estado, detalles) VALUES (?, ?, ?, ?, ?, ?)`,
        [deporte_id, fecha || null, hora || null, lugar || null, estado || 'pendiente', detalles || '']
    );
    const idRows = await db.query('SELECT last_insert_rowid() AS id');
    const eventoId = idRows[0].id;
    for (const p of participantes) {
        if (!p.equipo_id) continue;
        await db.query(
            'INSERT INTO evento_participantes (evento_id, equipo_id, posicion, puntos) VALUES (?, ?, ?, ?)',
            [eventoId, p.equipo_id, null, 0]
        );
    }
    return eventoId;
}

async function actualizar(id, datos) {
    const { deporte_id, fecha, hora, lugar, estado, detalles, participantes } = datos;
    await db.query(
        `UPDATE eventos SET deporte_id = ?, fecha = ?, hora = ?, lugar = ?, estado = ?, detalles = ? WHERE id = ?`,
        [deporte_id, fecha || null, hora || null, lugar || null, estado || 'pendiente', detalles || '', id]
    );
    await db.query('DELETE FROM evento_participantes WHERE evento_id = ?', [id]);
    for (const p of participantes) {
        if (!p.equipo_id) continue;
        await db.query(
            'INSERT INTO evento_participantes (evento_id, equipo_id, posicion, puntos) VALUES (?, ?, ?, ?)',
            [id, p.equipo_id, p.posicion || null, 0]
        );
    }
}

async function borrar(id) {
    await db.query('DELETE FROM evento_participantes WHERE evento_id = ?', [id]);
    await db.query('DELETE FROM eventos WHERE id = ?', [id]);
}

async function iniciar(id, fecha, hora) {
    await db.query(`UPDATE eventos SET estado = 'en curso', fecha = ?, hora = ? WHERE id = ?`, [fecha, hora, id]);
}

async function registrarResultado(id, resultados) {
    for (const r of resultados) {
        const pos = r.posicion || null;
        const pts = puntosPorPosicion(pos);
        await db.query(
            'UPDATE evento_participantes SET posicion = ?, puntos = ? WHERE evento_id = ? AND equipo_id = ?',
            [pos, pts, id, r.equipo_id]
        );
    }
    await db.query("UPDATE eventos SET estado = 'finalizado' WHERE id = ?", [id]);
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    borrar,
    iniciar,
    registrarResultado,
    puntosPorPosicion
};

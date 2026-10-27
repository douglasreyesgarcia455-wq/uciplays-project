// SancionDTO.js — Mapeo de fila de sanción a objeto de respuesta.
function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id !== undefined ? row.id : null,
        equipo_id: row.equipo_id !== undefined ? row.equipo_id : null,
        equipo_nombre: row.equipo_nombre !== undefined ? row.equipo_nombre : null,
        facultad_nombre: row.facultad_nombre !== undefined ? row.facultad_nombre : null,
        deporte: row.deporte !== undefined ? row.deporte : null,
        puntos_descontados: row.puntos_descontados !== undefined ? row.puntos_descontados : 0,
        motivo: row.motivo !== undefined ? row.motivo : null,
        observaciones: row.observaciones !== undefined ? row.observaciones : null,
        fecha: row.fecha !== undefined ? row.fecha : null
    };
}
module.exports = { toDTO };

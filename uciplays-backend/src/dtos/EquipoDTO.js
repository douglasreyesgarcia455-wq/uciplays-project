// EquipoDTO.js — Mapeo de fila de equipo a objeto de respuesta.
function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id,
        nombre: row.nombre !== undefined ? row.nombre : null,
        facultad: row.facultad !== undefined ? row.facultad : null,
        deporte: row.deporte !== undefined ? row.deporte : null,
        facultad_id: row.facultad_id !== undefined ? row.facultad_id : null,
        deporte_id: row.deporte_id !== undefined ? row.deporte_id : null,
        total_eventos: row.total_eventos !== undefined ? row.total_eventos : 0
    };
}
module.exports = { toDTO };

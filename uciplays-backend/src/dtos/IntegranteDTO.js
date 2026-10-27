// IntegranteDTO.js — Mapeo de fila de integrante a objeto de respuesta.
function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id,
        nombre: row.nombre !== undefined ? row.nombre : null,
        ci: row.ci !== undefined ? row.ci : null,
        matricula: row.matricula !== undefined ? row.matricula : null,
        equipo_id: row.equipo_id !== undefined ? row.equipo_id : null,
        equipo_nombre: row.equipo_nombre !== undefined ? row.equipo_nombre : null,
        facultad_nombre: row.facultad_nombre !== undefined ? row.facultad_nombre : null,
        deporte: row.deporte !== undefined ? row.deporte : null
    };
}
module.exports = { toDTO };

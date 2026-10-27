// DeporteDTO.js — Mapeo de fila de deporte a objeto de respuesta.
function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id !== undefined ? row.id : null,
        nombre: row.nombre !== undefined ? row.nombre : null,
        total_equipos: row.total_equipos !== undefined ? row.total_equipos : 0
    };
}
module.exports = { toDTO };

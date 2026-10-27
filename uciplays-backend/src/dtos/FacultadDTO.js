// FacultadDTO.js — Mapeo de fila de facultad a objeto de respuesta.
function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id !== undefined ? row.id : null,
        nombre: row.nombre !== undefined ? row.nombre : null,
        logo_url: row.logo_url !== undefined ? row.logo_url : null,
        total_equipos: row.total_equipos !== undefined ? row.total_equipos : 0
    };
}

module.exports = { toDTO };

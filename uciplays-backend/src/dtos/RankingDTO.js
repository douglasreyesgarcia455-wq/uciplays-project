// RankingDTO.js — Mapeo de fila de ranking a objeto de respuesta.
function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id !== undefined ? row.id : null,
        nombre: row.nombre !== undefined ? row.nombre : null,
        logo_url: row.logo_url !== undefined ? row.logo_url : null,
        puntos_eventos: row.puntos_eventos !== undefined ? row.puntos_eventos : 0,
        puntos_sanciones: row.puntos_sanciones !== undefined ? row.puntos_sanciones : 0,
        puntos: row.puntos !== undefined ? row.puntos : 0
    };
}
module.exports = { toDTO };

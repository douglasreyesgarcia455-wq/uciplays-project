// EventoDTO.js — Mapeo de fila de BD a objeto de respuesta HTTP (DTO, GRASP).
// Aísla el esquema de la BD del contrato con el cliente.

function toDTO(row) {
    if (row === null || row === undefined) return null;
    return {
        id: row.id,
        deporte_id: row.deporte_id !== undefined ? row.deporte_id : null,
        deporte: row.deporte !== undefined ? row.deporte : null,
        fecha: row.fecha !== undefined ? row.fecha : null,
        hora: row.hora !== undefined ? row.hora : null,
        lugar: row.lugar !== undefined ? row.lugar : null,
        estado: row.estado !== undefined ? row.estado : null,
        detalles: row.detalles !== undefined ? row.detalles : null,
        participantes: Array.isArray(row.participantes) ? row.participantes.map(p => ({
            id: p.id,
            equipo_id: p.equipo_id,
            equipo_nombre: p.equipo_nombre || null,
            facultad: p.facultad || null,
            deporte: p.deporte || null,
            posicion: p.posicion !== undefined ? p.posicion : null,
            puntos: p.puntos !== undefined ? p.puntos : 0
        })) : []
    };
}

module.exports = { toDTO };

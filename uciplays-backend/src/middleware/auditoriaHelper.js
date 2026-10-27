const db = require('../config/db');

async function registrarAuditoria(req, accion, entidad, entidadId, detalles) {
    try {
        const usuarioId = req.user ? req.user.id : null;
        const username = req.user ? req.user.username : null;
        const ip = req.ip || req.connection?.remoteAddress || null;
        const detallesStr = detalles ? (typeof detalles === 'string' ? detalles : JSON.stringify(detalles)) : null;
        await db.query(
            'INSERT INTO auditoria (usuario_id, username, accion, entidad, entidad_id, detalles, ip) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [usuarioId, username, accion, entidad, entidadId || null, detallesStr, ip]
        );
    } catch (e) {
        console.error('Error registrando auditoría:', e);
    }
}

module.exports = { registrarAuditoria };

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'uciplays-secret-cambiar-en-produccion';

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'No autenticado' });
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: 'No autorizado para esta acción' });
        }
        next();
    };
}

module.exports = { verificarToken, verificarRol, JWT_SECRET };

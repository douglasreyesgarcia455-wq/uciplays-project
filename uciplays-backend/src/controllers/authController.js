// authController.js — Controlador de autenticación.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../repositories/authRepository');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

async function login(req, res) {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }
        const user = await repo.obtenerPorUsername(username);
        if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
        if (!user.activo) return res.status(403).json({ error: 'Usuario inactivo' });
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const token = jwt.sign(
            { id: user.id, username: user.username, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        req.user = { id: user.id, username: user.username, rol: user.rol };
        await registrarAuditoria(req, 'login', 'usuario', user.id, { username: user.username });
        res.json({ token, user: { id: user.id, username: user.username, rol: user.rol } });
    } catch (e) {
        console.error('Error POST /auth/login:', e);
        res.status(500).json({ error: 'Error al autenticar' });
    }
}

async function logout(req, res) {
    try {
        await registrarAuditoria(req, 'logout', 'usuario', req.user.id, { username: req.user.username });
        res.json({ message: 'Logout registrado' });
    } catch (e) {
        console.error('Error POST /auth/logout:', e);
        res.status(500).json({ error: 'Error al hacer logout' });
    }
}

async function me(req, res) {
    res.json({ user: req.user });
}

module.exports = { login, logout, me };

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, verificarToken } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        }
        const rows = await db.query('SELECT id, username, password_hash, rol, activo FROM usuarios WHERE username = ?', [username]);
        if (!rows || rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const user = rows[0];
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
});

// POST /api/auth/logout
router.post('/logout', verificarToken, async (req, res) => {
    try {
        await registrarAuditoria(req, 'logout', 'usuario', req.user.id, { username: req.user.username });
        res.json({ message: 'Logout registrado' });
    } catch (e) {
        console.error('Error POST /auth/logout:', e);
        res.status(500).json({ error: 'Error al hacer logout' });
    }
});

// GET /api/auth/me
router.get('/me', verificarToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;

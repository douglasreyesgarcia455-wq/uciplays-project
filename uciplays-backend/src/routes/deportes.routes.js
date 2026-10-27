const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');
const { registrarAuditoria } = require('../middleware/auditoriaHelper');

router.get('/', async (req, res) => {
    try {
        const deportes = await db.query('SELECT id, nombre FROM deportes ORDER BY nombre');
        res.json(deportes);
    } catch (error) {
        console.error('Error GET /deportes:', error);
        res.status(500).json({ error: 'Error al obtener deportes' });
    }
});

module.exports = router;

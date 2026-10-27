// sanciones.routes.js — Router de sanciones. Solo rutas.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sancionesController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', controller.listar);
router.post('/', verificarToken, controller.crear);
router.delete('/:id', verificarToken, controller.borrar);

module.exports = router;

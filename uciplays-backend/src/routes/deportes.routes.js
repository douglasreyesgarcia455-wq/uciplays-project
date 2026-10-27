// deportes.routes.js — Router de deportes. Solo rutas.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/deportesController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', controller.listar);
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.actualizar);
router.delete('/:id', verificarToken, controller.borrar);

module.exports = router;

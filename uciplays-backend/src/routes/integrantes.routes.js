// integrantes.routes.js — Router de integrantes. Solo rutas.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/integrantesController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', controller.listar);
router.get('/:equipo_id', controller.porEquipo);
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.actualizar);
router.delete('/:id', verificarToken, controller.borrar);

module.exports = router;

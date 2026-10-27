// facultades.routes.js — Router de facultades. Solo rutas.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/facultadesController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.actualizar);
router.delete('/:id', verificarToken, controller.borrar);

module.exports = router;

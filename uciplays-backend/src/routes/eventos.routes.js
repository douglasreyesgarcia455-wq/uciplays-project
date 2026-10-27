// eventos.routes.js — Router de eventos. Solo rutas, delega en controller.
const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', eventosController.listar);
router.get('/:id', eventosController.obtener);
router.post('/', verificarToken, eventosController.crear);
router.put('/:id', verificarToken, eventosController.actualizar);
router.delete('/:id', verificarToken, eventosController.borrar);
router.post('/:id/iniciar', verificarToken, eventosController.iniciar);
router.post('/:id/resultado', verificarToken, eventosController.registrarResultado);

module.exports = router;

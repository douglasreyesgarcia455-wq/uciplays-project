const express = require('express');
const router = express.Router();
const facultadesController = require('../controllers/facultadesController');

router.get('/', facultadesController.listar);
router.get('/:id', facultadesController.obtener);

module.exports = router;
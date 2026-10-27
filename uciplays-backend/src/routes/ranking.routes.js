// ranking.routes.js — Router de ranking. Solo rutas.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rankingController');

router.get('/', controller.listar);

module.exports = router;

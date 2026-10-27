// auth.routes.js — Router de autenticación. Solo rutas.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

router.post('/login', controller.login);
router.post('/logout', verificarToken, controller.logout);
router.get('/me', verificarToken, controller.me);

module.exports = router;
